// Run: node tests/trainer.test.js   (needs Playwright with Chromium)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOTS = process.env.SHOTS_DIR || path.resolve(__dirname, 'screenshots');
let failed = 0;
function check(name, cond, extra) {
  console.log((cond ? 'ok   ' : 'FAIL ') + name + (cond || extra === undefined ? '' : ' -> ' + JSON.stringify(extra)));
  if (!cond) failed++;
}

// dispatch a synthetic key event like a real keyboard would
const key = (page, type, code, k, shift = false, extra = {}) => page.evaluate(([type, code, k, shift, extra]) => {
  window.dispatchEvent(new KeyboardEvent(type, Object.assign({ code, key: k, shiftKey: shift, bubbles: true, cancelable: true }, extra)));
}, [type, code, k, shift, extra]);
const press = async (page, code, k, shift = false, extra) => { await key(page, 'keydown', code, k, shift, extra); await key(page, 'keyup', code, k, shift, extra); };
const st = page => page.evaluate(() => { const s = window.__tt.state; return { pos: s.pos, errors: s.errors, layoutErr: s.layoutErr, shiftErr: s.shiftErr, shiftWarn: s.shiftWarn, done: s.done, msg: document.getElementById('msg').textContent }; });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(URL);
  const ringed = p => p.evaluate(() => [...document.querySelectorAll('.key.next')].map(e => e.dataset.code).sort().join(','));

  // 0. hint levels and keyboard views, per mode
  check('по умолчанию подсказка «по запросу»', await page.inputValue('#hintSel') === 'demand');
  await page.evaluate(() => window.__tt.load('да: да'));
  check('по запросу: до нажатия ничего не подсвечено', await ringed(page) === '' && (await page.textContent('#hint')) === '');
  await press(page, 'KeyS', 'ы');
  check('по запросу: после ошибки подсказка появилась', await ringed(page) === 'KeyL' && (await page.textContent('#hint')).includes('д →'));
  await press(page, 'KeyL', 'д');
  check('по запросу: на следующем знаке снова скрыто', await ringed(page) === '');
  await page.waitForTimeout(1700);
  check('по запросу: после паузы 1,5 с подсказка появилась', await ringed(page) === 'KeyF');
  await page.selectOption('#hintSel', 'none');
  await page.evaluate(() => window.__tt.load('да: да'));
  await press(page, 'KeyS', 'ы');
  await page.waitForTimeout(1700);
  check('без подсказок: ни после ошибки, ни после паузы', await ringed(page) === '' && (await page.textContent('#hint')) === '' && (await page.textContent('#msg')) === 'Ошибка.');
  await page.selectOption('#kbSel', 'colors');
  check('клавиатура «только цвета»: подписей не видно', !(await page.isVisible('.key[data-code="KeyL"] .m')) && await page.isVisible('#kb'));
  await page.selectOption('#kbSel', 'hidden');
  check('клавиатура «скрыта»', !(await page.isVisible('#kb')));
  await page.click('[data-mode="symEN"]');
  check('у другого режима свои настройки', await page.inputValue('#hintSel') === 'demand' && await page.inputValue('#kbSel') === 'labels' && await page.isVisible('#kb'));
  await page.click('[data-mode="symRU"]');
  check('режим помнит свои настройки', await page.inputValue('#hintSel') === 'none' && await page.inputValue('#kbSel') === 'hidden');
  await press(page, 'KeyA', 'ф');
  check('после выбора в списке ввод не теряется', (await st(page)).errors === 1);
  await page.selectOption('#kbSel', 'labels');
  await page.selectOption('#hintSel', 'full');

  // 1. correct char advances, wrong char does not
  await page.evaluate(() => window.__tt.load('ab;c'));
  await press(page, 'KeyA', 'a');
  let s = await st(page);
  check('верный символ двигает курсор', s.pos === 1, s);
  await press(page, 'KeyS', 's');
  s = await st(page);
  check('неверный символ не двигает курсор', s.pos === 1 && s.errors === 1, s);
  await press(page, 'KeyB', 'b');
  // 2. "ж" (Semicolon in RU) when ";" expected in EN -> layout error
  await press(page, 'Semicolon', 'ж');
  s = await st(page);
  check('«ж» вместо «;» в EN = ошибка раскладки', s.pos === 2 && s.layoutErr === 1 && /Переключи раскладку/.test(s.msg), s);
  await press(page, 'Semicolon', ';');
  s = await st(page);
  check('«;» в EN после переключения проходит', s.pos === 3, s);
  // Cyrillic letter when Latin expected -> layout error too
  await press(page, 'KeyC', 'с');
  s = await st(page);
  check('кириллица вместо латиницы = ошибка раскладки', s.pos === 3 && s.layoutErr === 2, s);

  // 3. ":" in RU needs the LEFT shift in strict mode
  await page.evaluate(() => { window.__tt.settings.strict = true; window.__tt.load('да: да'); });
  await press(page, 'KeyL', 'д'); await press(page, 'KeyF', 'а');
  const hint = await page.textContent('#hint');
  check('подсказка для «:» в RU', hint.includes(': → Shift + 6 · правый указательный · левый Shift (раскладка RU)'), hint);
  const ring = await page.evaluate(() => [...document.querySelectorAll('.key.next')].map(e => e.dataset.code).sort().join(','));
  check('подсвечены 6 и левый Shift', ring === 'Digit6,ShiftLeft', ring);
  await key(page, 'keydown', 'ShiftRight', 'Shift', true);
  await press(page, 'Digit6', ':', true);
  await key(page, 'keyup', 'ShiftRight', 'Shift', false);
  s = await st(page);
  check('«:» с правым Shift в строгом режиме — ошибка', s.pos === 2 && s.shiftErr === 1 && /левый Shift/.test(s.msg), s);
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await press(page, 'Digit6', ':', true);
  await key(page, 'keyup', 'ShiftLeft', 'Shift', false);
  s = await st(page);
  check('«:» с левым Shift проходит', s.pos === 3, s);
  // ":" typed in EN layout (Shift+Semicolon) is accepted: it exists in both layouts
  await page.evaluate(() => window.__tt.load('да: да'));
  await press(page, 'KeyL', 'д'); await press(page, 'KeyF', 'а');
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await press(page, 'Semicolon', ':', true);
  await key(page, 'keyup', 'ShiftLeft', 'Shift', false);
  s = await st(page);
  check('общий знак «:» принимается из EN', s.pos === 3, s);
  // EN Shift+6 ("^") when RU ":" expected -> layout error
  await page.evaluate(() => window.__tt.load('да: да'));
  await press(page, 'KeyL', 'д'); await press(page, 'KeyF', 'а');
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await press(page, 'Digit6', '^', true);
  await key(page, 'keyup', 'ShiftLeft', 'Shift', false);
  s = await st(page);
  check('«^» вместо «:» в RU = ошибка раскладки', s.pos === 2 && s.layoutErr === 1, s);

  // non-strict: wrong shift is only a warning
  await page.evaluate(() => { window.__tt.settings.strict = false; window.__tt.load('да: да'); });
  await press(page, 'KeyL', 'д'); await press(page, 'KeyF', 'а');
  await key(page, 'keydown', 'ShiftRight', 'Shift', true);
  await press(page, 'Digit6', ':', true);
  await key(page, 'keyup', 'ShiftRight', 'Shift', false);
  s = await st(page);
  check('нестрогий режим: Shift не той рукой — предупреждение', s.pos === 3 && s.shiftErr === 0 && s.shiftWarn === 1, s);
  await page.evaluate(() => { window.__tt.settings.strict = true; });

  // Option / Cmd / Ctrl
  await page.evaluate(() => window.__tt.load('ab'));
  await press(page, 'Space', ' ', false, { ctrlKey: true });
  await press(page, 'KeyA', 'a', false, { metaKey: true });
  s = await st(page);
  check('Ctrl/Cmd + клавиша игнорируются', s.pos === 0 && s.errors === 0, s);
  await press(page, 'KeyA', 'å', false, { altKey: true });
  s = await st(page);
  check('Option + клавиша = ошибка', s.pos === 0 && s.errors === 1, s);

  // layout assignment for neutral chars
  const lays = await page.evaluate(() => window.__tt.assignLayouts('12 слово, Settings: 5%', 'RU').join(''));
  check('раскладка позиций (цифры наследуют справа, знаки слева)', lays === 'RU'.repeat(10) + 'EN'.repeat(12), lays);

  // 4. finish a lesson, stats survive reload
  await page.evaluate(() => window.__tt.load('да: да'));
  for (const [c, k] of [['KeyL', 'д'], ['KeyF', 'а']]) await press(page, c, k);
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await press(page, 'Digit6', ':', true);
  await key(page, 'keyup', 'ShiftLeft', 'Shift', false);
  for (const [c, k] of [['Space', ' '], ['KeyL', 'д'], ['KeyF', 'а']]) await press(page, c, k);
  s = await st(page);
  check('урок завершён, экран результата', s.done && await page.isVisible('#againBtn'), s);
  await press(page, 'Enter', 'Enter');
  s = await st(page);
  check('Enter на результате запускает новый урок', !s.done && s.pos === 0, s);
  const before = await page.evaluate(() => window.__tt.stats['RU|:']);
  await page.reload();
  const after = await page.evaluate(() => window.__tt.stats['RU|:']);
  check('статистика пережила перезагрузку', after && before && after.a === before.a && after.a >= 1, { before, after });
  await page.click('[data-tab="stats"]');
  const tableTxt = await page.textContent('#stTable');
  const histRows = await page.$$eval('#histTable tr', r => r.length);
  check('таблица статистики и история показываются', tableTxt.includes(':') && histRows >= 2, { histRows });
  await page.click('[data-tab="train"]');

  // generators: every mode gives 200-300 typeable chars
  const gen = await page.evaluate(() => {
    const bad = [];
    for (const m of ['digits', 'symRU', 'symEN', 'mixed']) for (let i = 0; i < 300; i++) {
      const t = window.__tt.generate(m);
      if (t.length < 150 || t.length > 300 || ![...t].every(window.__tt.typeable)) bad.push([m, t.length, t]);
    }
    return { bad: bad.slice(0, 3), n: bad.length, sample: { digits: window.__tt.generate('digits'), symRU: window.__tt.generate('symRU'), symEN: window.__tt.generate('symEN'), mixed: window.__tt.generate('mixed') } };
  });
  check('генераторы: 150–300 печатных символов', gen.n === 0, gen.bad);
  console.log(JSON.stringify(gen.sample, null, 1));

  // 6. pressed keys on the on-screen keyboard
  const downs = p => p.evaluate(() => [...document.querySelectorAll('.key.down')].map(e => e.dataset.code).sort().join(','));
  await page.selectOption('#hintSel', 'full');
  await page.evaluate(() => window.__tt.load('да да'));
  await key(page, 'keydown', 'KeyL', 'д');
  check('keydown: клавиша нажата', await downs(page) === 'KeyL');
  await key(page, 'keyup', 'KeyL', 'д');
  check('keyup: клавиша отпущена', await downs(page) === '');
  await key(page, 'keydown', 'MetaLeft', 'Meta', false, { metaKey: true });
  await key(page, 'keydown', 'Space', ' ', false, { metaKey: true });
  await key(page, 'keydown', 'ArrowUp', 'ArrowUp');
  await key(page, 'keydown', 'AltRight', 'Alt', false, { altKey: true });
  check('command, пробел, стрелка, option видны нажатыми (даже игнорируемые)', await downs(page) === 'AltRight,ArrowUp,MetaLeft,Space', await downs(page));
  await key(page, 'keyup', 'MetaLeft', 'Meta');
  check('отпускание command снимает клавиши без keyup (как на Mac)', await downs(page) === 'AltRight', await downs(page));
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  check('blur снимает все нажатия', await downs(page) === '' && (await st(page)).pos === 1);
  await key(page, 'keydown', 'KeyB', 'b');
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  check('visibilitychange снимает все нажатия', await downs(page) === '');
  await key(page, 'keydown', 'CapsLock', 'CapsLock', false, { modifierCapsLock: true });
  check('caps lock: индикатор горит', await page.evaluate(() => document.querySelector('[data-code="CapsLock"]').classList.contains('caps-on')));
  await key(page, 'keyup', 'CapsLock', 'CapsLock', false, { modifierCapsLock: false });
  check('caps lock: индикатор погас', !(await page.evaluate(() => document.querySelector('[data-code="CapsLock"]').classList.contains('caps-on'))));
  check('Mac-раскладка: верхний ряд, fn, command, стрелки', await page.evaluate(() =>
    ['Escape', 'F1', 'F12', 'TouchID', 'Fn', 'ControlLeft', 'AltLeft', 'MetaLeft', 'MetaRight', 'AltRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
      .every(c => document.querySelector(`[data-code="${c}"]`)) && !document.querySelector('[data-code="IntlBackslash"]')));

  // 7. flashes
  const flashOf = (p, code) => p.evaluate(c => { const el = document.querySelector(`[data-code="${c}"]`); return ['ok', 'bad', 'warn'].find(k => el.classList.contains('fl-' + k)) || ''; }, code);
  await page.evaluate(() => { window.__tt.settings.strict = true; window.__tt.load('да; да'); });
  await press(page, 'KeyL', 'д');
  check('вспышка: верно — зелёная', await flashOf(page, 'KeyL') === 'ok');
  await press(page, 'KeyS', 'ы');
  check('вспышка: не та клавиша — красная', await flashOf(page, 'KeyS') === 'bad');
  await press(page, 'KeyF', 'f');
  check('вспышка: ошибка раскладки — жёлтая', await flashOf(page, 'KeyF') === 'warn');
  await press(page, 'KeyF', 'а');
  await key(page, 'keydown', 'ShiftLeft', 'Shift', true);
  await press(page, 'Digit4', ';', true);
  await key(page, 'keyup', 'ShiftLeft', 'Shift', false);
  check('вспышка: Shift не той рукой — жёлтая', await flashOf(page, 'Digit4') === 'warn');
  await page.waitForTimeout(350);
  check('вспышка гаснет через ~250 мс', await page.evaluate(() => !document.querySelector('.key.fl')));
  const rctx = await browser.newContext({ reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(URL);
  await rp.evaluate(() => window.__tt.load('ab'));
  await press(rp, 'KeyS', 's');
  await rp.waitForTimeout(350);
  check('reduced motion: рамка остаётся до следующего нажатия', await flashOf(rp, 'KeyS') === 'bad');
  await press(rp, 'KeyA', 'a');
  check('reduced motion: следующее нажатие меняет рамку', await flashOf(rp, 'KeyS') === '' && await flashOf(rp, 'KeyA') === 'ok');
  await rctx.close();

  // 8. confusions & report
  const conf = await page.evaluate(() => window.__tt.stats['RU|;']);
  check('путаницы Shift записываются (какой нажат вместо какого)', conf && conf.sx && conf.sx.L === 1, conf);
  const confD = await page.evaluate(() => window.__tt.stats['RU|д'].x);
  check('путаница «д» → «ы» записана', confD && confD['ы'] >= 1 && confD['f'] === undefined, confD);
  const rep = await page.evaluate(() => window.__tt.report());
  const need = ['# Тренажёр знаков: отчёт', 'Уроков всего:', 'за 7 дней', '## Настройки', 'Строгий Shift: вкл', 'Подсказка / клавиатура:',
    '## Режимы: последние 10', '## Худшие знаки RU', '## Худшие знаки EN', '## Частые путаницы', '«д» RU → «ы»',
    '## Ошибки раскладки', '## Ошибки Shift', 'левый вместо правого', '## Последние уроки', 'Данных мало'];
  const missing = need.filter(x => !rep.includes(x));
  check('отчёт содержит все разделы', missing.length === 0 && rep.length <= 3000 && !rep.trim().startsWith('{'), missing);
  console.log('--- отчёт (мало данных) ---\n' + rep + '\n---');

  // copy button: success and manual fallback
  const cctx = await browser.newContext();
  await cctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const cp = await cctx.newPage();
  await cp.goto(URL);
  await cp.click('[data-tab="stats"]');
  await cp.click('#reportBtn');
  await cp.waitForTimeout(200);
  const copied = await cp.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e));
  const cmsg = await cp.textContent('#reportMsg');
  check('кнопка копирует отчёт в буфер', cmsg === 'Скопировано' && copied.startsWith('# Тренажёр знаков'), { cmsg, copied: copied.slice(0, 40) });
  await cp.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('denied')); });
  await cp.click('#reportBtn');
  await cp.waitForTimeout(200);
  const fb = await cp.evaluate(() => {
    const t = document.getElementById('reportOut');
    return { vis: !t.classList.contains('hidden'), sel: t.selectionEnd - t.selectionStart, len: t.value.length, msg: document.getElementById('reportMsg').textContent };
  });
  check('без буфера: отчёт в textarea, выделен, «Скопируй вручную»', fb.vis && fb.sel === fb.len && fb.len > 100 && fb.msg === 'Скопируй вручную: Cmd+C', fb);
  await cctx.close();

  // old stats without confusion pairs + lots of data: loads, report stays short
  const octx = await browser.newContext();
  await octx.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const stats = {};
    for (const ch of '.,!?:;"()%№-_+=*/\\0123456789') stats['RU|' + ch] = { a: 40, e: 7, le: 2, se: 1, t: 40 * 700, n: 40 };
    for (const ch of '.,!?:;"\'()[]{}<>@#$%^&*-_+=/\\|~`') stats['EN|' + ch] = { a: 30, e: 6, le: 1, se: 2, t: 30 * 900, n: 30 };
    const modes = ['digits', 'symRU', 'symEN', 'mixed', 'custom'];
    const history = Array.from({ length: 50 }, (_, i) => ({ t: Date.now() - (50 - i) * 36e5, mode: modes[i % 5], chars: 250, wpm: 20 + i % 7, acc: 90 + i % 5, errors: 5, layoutErr: 1, shiftErr: 2, shiftWarn: 0 }));
    localStorage.setItem('tt.stats', JSON.stringify(stats));
    localStorage.setItem('tt.history', JSON.stringify(history));
    localStorage.setItem('tt.settings', JSON.stringify({ mode: 'symRU', strict: true }));
  });
  const op = await octx.newPage();
  const oerrs = [];
  op.on('pageerror', e => oerrs.push(String(e)));
  await op.goto(URL);
  await op.click('[data-tab="stats"]');
  const orep = await op.evaluate(() => window.__tt.report());
  check('старая статистика без путаниц грузится, отчёт строится', oerrs.length === 0 && orep.includes('## Худшие знаки EN') && !orep.includes('Данных мало') && orep.includes('Уроков всего: 50'), oerrs);
  check('отчёт с большим объёмом данных ≤ 3000 символов', orep.length <= 3000 && orep.includes('## Последние уроки'), orep.length);
  console.log('--- отчёт (много данных), ' + orep.length + ' симв. ---\n' + orep + '\n---');
  await op.click('[data-tab="train"]');
  await op.evaluate(() => window.__tt.load('да'));
  await press(op, 'KeyS', 'ы');
  const ox = await op.evaluate(() => window.__tt.stats['RU|д']);
  check('после старых данных путаницы пишутся', ox && ox.x && ox.x['ы'] === 1 && oerrs.length === 0, ox);
  await octx.close();

  check('нет ошибок JS на странице', errs.length === 0, errs);

  // 5. works without localStorage
  const ctx2 = await browser.newContext();
  await ctx2.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const p2 = await ctx2.newPage();
  const errs2 = [];
  p2.on('pageerror', e => errs2.push(String(e)));
  await p2.goto(URL);
  await p2.evaluate(() => window.__tt.load('ab'));
  await press(p2, 'KeyA', 'a');
  const s2 = await st(p2);
  const note = await p2.textContent('#storageNote');
  check('без localStorage всё работает', s2.pos === 1 && errs2.length === 0 && note.includes('недоступен'), { s2, errs2 });

  // ---------- 9. daily training ----------
  // types the next n chars of the current lesson by event.key (code is irrelevant for the check)
  const typeN = (p, n) => p.evaluate(n => {
    for (let i = 0; i < n; i++) {
      const s = window.__tt.state;
      if (s.done || s.pos >= s.text.length) return;
      const k = s.text[s.pos];
      window.dispatchEvent(new KeyboardEvent('keydown', { key: k, code: '', bubbles: true, cancelable: true }));
    }
  }, n);
  const resultText = p => p.evaluate(() => document.getElementById('result').textContent.replace(/\s+/g, ' '));
  {
    const dctx = await browser.newContext();
    const dp = await dctx.newPage();
    const derrs = [];
    dp.on('pageerror', e => derrs.push(String(e)));
    await dp.goto(URL);
    await dp.click('[data-mode="symEN"]');
    await dp.evaluate(() => window.__tt.setBlockMs(1200));
    await dp.click('#dailyBtn');
    let t = await resultText(dp);
    check('тренировка дня: стартовый экран с блоками', t.includes('Тренировка дня') && t.includes('Цифры → Смешанный') && t.includes('Знаки RU'), t);
    await press(dp, 'Enter', 'Enter');
    let d = await dp.evaluate(() => ({ mode: window.__tt.settings.mode, waiting: window.__tt.daily.waiting, bar: document.getElementById('dailyBar').textContent.replace(/\s+/g, ' ') }));
    check('Enter запускает блок 1 «Цифры», таймер и прогресс сверху', d.mode === 'digits' && !d.waiting && /блок 1 из 3: Цифры/.test(d.bar) && /осталось \d\d:\d\d/.test(d.bar) && /всего \d+%/.test(d.bar), d);
    await typeN(dp, 5);
    await dp.waitForTimeout(1500);
    t = await resultText(dp);
    const h1 = await dp.evaluate(() => JSON.parse(localStorage.getItem('tt.history')).slice(-1)[0]);
    check('время блока вышло: экран «Дальше: …»', t.includes('Блок 1 из 3 готов') && t.includes('Дальше: Смешанный'), t);
    check('недописанный урок блока сохранён', h1 && h1.mode === 'digits' && h1.chars === 5, h1);
    await press(dp, 'Enter', 'Enter');
    d = await dp.evaluate(() => ({ mode: window.__tt.settings.mode, idx: window.__tt.daily.idx }));
    check('Enter — блок 2 (без данных вместо «Слабых мест» — «Смешанный»)', d.mode === 'mixed' && d.idx === 1, d);
    await typeN(dp, 5);
    await dp.waitForTimeout(1500);
    t = await resultText(dp);
    check('после блока 2: «Дальше: Знаки RU»', t.includes('Дальше: Знаки RU'), t);
    await press(dp, 'Enter', 'Enter');
    check('блок 3: «Знаки RU» (первый день начинается с RU)', await dp.evaluate(() => window.__tt.settings.mode) === 'symRU');
    await typeN(dp, 5);
    await dp.waitForTimeout(1500);
    t = await resultText(dp);
    check('после блока 3: «Тренировка дня завершена»', t.includes('Тренировка дня завершена') && await dp.evaluate(() => window.__tt.daily === null), t);
    await press(dp, 'Enter', 'Enter');
    check('после тренировки возвращается прежний режим', await dp.evaluate(() => window.__tt.settings.mode) === 'symEN');
    const rep2 = await dp.evaluate(() => window.__tt.report());
    check('отчёт: тренировка дня, время на букву, счёт знаков', rep2.includes('## Тренировка дня') && rep2.includes('Дней подряд:') &&
      rep2.includes('## Среднее время нажатия') && /Буква \d+ мс/.test(rep2) && /## Знаки RU: сколько раз встретились/.test(rep2) && rep2.includes('«...»'), rep2.slice(0, 200));
    // next calendar day: Знаки EN
    await dp.evaluate(() => localStorage.setItem('tt.daily', JSON.stringify({ lastDate: '2000-01-01', lastLang: 'RU' })));
    await dp.click('#dailyBtn');
    t = await resultText(dp);
    check('на следующий день — «Знаки EN»', t.includes('Знаки EN') && !t.includes('Знаки RU'), t);
    await dp.click('#dailyStop');
    check('«Прервать» останавливает тренировку дня', await dp.evaluate(() => window.__tt.daily === null && document.getElementById('dailyBar').classList.contains('hidden')));
    check('тренировка дня: нет ошибок JS', derrs.length === 0, derrs);
    await dctx.close();
  }
  // streak: seeded days
  {
    const sctx = await browser.newContext();
    await sctx.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      const k = dd => { const d = new Date(); d.setDate(d.getDate() - dd); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
      localStorage.setItem('tt.days', JSON.stringify({ [k(0)]: 11 * 60000, [k(1)]: 12 * 60000, [k(2)]: 10 * 60000, [k(4)]: 20 * 60000 }));
    });
    const sp = await sctx.newPage();
    await sp.goto(URL);
    const s1 = await sp.evaluate(() => Object.assign(window.__tt.streakInfo(), { txt: document.getElementById('streak').textContent }));
    check('дней подряд: 3, вчера не пропущено', s1.streak === 3 && !s1.missedYesterday && s1.txt.includes('Дней подряд: 3') && !s1.txt.includes('пропущено'), s1);
    await sctx.close();
    const sctx2 = await browser.newContext();
    await sctx2.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      const k = dd => { const d = new Date(); d.setDate(d.getDate() - dd); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
      localStorage.setItem('tt.days', JSON.stringify({ [k(0)]: 3 * 60000, [k(1)]: 9 * 60000, [k(3)]: 15 * 60000 }));
    });
    const sp2 = await sctx2.newPage();
    await sp2.goto(URL);
    const s2 = await sp2.evaluate(() => Object.assign(window.__tt.streakInfo(), { txt: document.getElementById('streak').textContent }));
    check('меньше 10 мин вчера: 0 дней и «вчера пропущено»', s2.streak === 0 && s2.missedYesterday && s2.txt.includes('вчера пропущено'), s2);
    await sctx2.close();
  }

  // ---------- 10. weak spots ----------
  {
    const wctx = await browser.newContext();
    await wctx.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      const st = (a, e, ms) => ({ a, e, le: 0, se: 0, t: ms * a, n: a });
      localStorage.setItem('tt.stats', JSON.stringify({
        'RU|:': st(10, 5, 900), 'RU|;': st(10, 4, 800), 'RU|№': st(8, 3, 1200), 'RU|(': st(10, 3, 700), 'RU|%': st(10, 2, 700),
        'RU|7': st(12, 3, 600), 'RU|,': st(40, 0, 250), 'RU|.': st(40, 0, 200), 'RU|?': st(3, 3, 2000),
        'RU|д': Object.assign(st(30, 4, 200), { x: { 'ы': 4 } }), 'EN|@': st(10, 1, 500), 'EN|#': st(6, 0, 400)
      }));
    });
    const wp = await wctx.newPage();
    const werrs = [];
    wp.on('pageerror', e => werrs.push(String(e)));
    await wp.goto(URL);
    await wp.click('[data-mode="weak"]');
    const w = await wp.evaluate(() => ({ text: window.__tt.state.text, weak: window.__tt.weak, info: document.getElementById('weakInfo').textContent, lays: [...new Set(window.__tt.state.layouts)] }));
    const top = w.weak.chars.map(c => c.ch);
    check('слабые места: 5–6 худших знаков с ≥5 попытками, раскладка RU', w.weak.L === 'RU' && top.length >= 5 && top.length <= 6 &&
      [':', ';', '№', '(', '7'].every(c => top.includes(c)) && !top.includes('?'), top);
    check('слабые места: каждый худший знак есть в тексте', top.every(c => w.text.includes(c)), w.text);
    check('слабые места: путаница «д» → «ы» даёт слова/слоги с «д»', w.weak.pairs.some(p => p.e === 'д' && p.p === 'ы') && /д/i.test(w.text) && w.info.includes('«д»→«ы»'), w.weak.pairs);
    check('слабые места: длина ~250, урок в RU', w.text.length >= 150 && w.text.length <= 300 && w.lays.join() === 'RU', { len: w.text.length, lays: w.lays });
    console.log('слабые места: ' + w.text);
    // EN worse than RU
    await wp.evaluate(() => {
      const st = (a, e, ms) => ({ a, e, le: 0, se: 0, t: ms * a, n: a });
      const s = window.__tt.stats;
      Object.assign(s, { 'EN|@': st(10, 8, 1500), 'EN|#': st(10, 7, 1500), 'EN|{': st(10, 8, 1600), 'EN|}': st(10, 7, 1500), 'EN|^': st(10, 9, 1900), 'EN|~': st(10, 6, 1400) });
    });
    await wp.click('#newBtn');
    const w2 = await wp.evaluate(() => ({ L: window.__tt.weak.L, lays: [...new Set(window.__tt.state.layouts)] }));
    check('слабые места: раскладка — та, где худшие знаки (EN)', w2.L === 'EN' && w2.lays.join() === 'EN', w2);
    check('слабые места: нет ошибок JS', werrs.length === 0, werrs);
    await wctx.close();
    // not enough data
    const nctx = await browser.newContext();
    const np = await nctx.newPage();
    await np.goto(URL);
    await np.click('[data-mode="weak"]');
    const msgTxt = await np.textContent('#text');
    check('слабые места без данных: «Мало данных, сначала пройди другие режимы»', msgTxt.includes('Мало данных, сначала пройди другие режимы'), msgTxt);
    await np.click('text=Перейти в «Цифры»');
    check('кнопка ведёт в «Цифры»', await np.evaluate(() => window.__tt.settings.mode === 'digits' && window.__tt.state.text.length > 100));
    await nctx.close();
  }

  // ---------- 11. speed ceiling ----------
  {
    const cctx2 = await browser.newContext();
    const cp2 = await cctx2.newPage();
    await cp2.goto(URL);
    await cp2.click('[data-tab="settings"]');
    await cp2.selectOption('#optCeiling', '40');
    await cp2.click('[data-tab="train"]');
    await cp2.evaluate(() => window.__tt.load('ab cd'));
    await press(cp2, 'KeyA', 'a'); await cp2.waitForTimeout(1500); await press(cp2, 'KeyB', 'b');
    await press(cp2, 'Space', ' '); await press(cp2, 'KeyC', 'c'); await press(cp2, 'KeyD', 'd');
    const r = await cp2.evaluate(() => {
      const spans = [...document.querySelectorAll('#text span')].map(s => s.classList.contains('fast'));
      const h = JSON.parse(localStorage.getItem('tt.history')).slice(-1)[0];
      return { spans, h, res: document.getElementById('result').textContent.replace(/\s+/g, ' ') };
    });
    const rawWpm = 5 / 5 / (r.h.ms / 60000);
    check('потолок: быстрое слово подсвечено, медленное нет', r.spans.join() === 'false,false,false,true,true', r.spans);
    check('потолок: быстрое слово не входит в wpm урока', r.h.fast === 1 && r.h.wpm < 40 && r.h.wpm < rawWpm, { h: r.h, rawWpm });
    check('потолок: в итоге «слов быстрее потолка»', /1\s*слов быстрее потолка/.test(r.res), r.res);
    await cctx2.close();
  }

  // ---------- 12. retype a word with an error ----------
  {
    const rctx2 = await browser.newContext();
    const rp2 = await rctx2.newPage();
    await rp2.goto(URL);
    check('перепечатка по умолчанию: 2 раза', await rp2.evaluate(() => window.__tt.settings.retype) === 2);
    await rp2.evaluate(() => window.__tt.load('ab cd'));
    const aBefore = await rp2.evaluate(() => (window.__tt.stats['EN|a'] || { a: 0 }).a);
    await press(rp2, 'KeyA', 'a'); await press(rp2, 'KeyS', 's'); await press(rp2, 'KeyB', 'b');
    let r = await rp2.evaluate(() => ({ text: window.__tt.state.text, rep: [...document.querySelectorAll('#text span')].map((s, i) => s.classList.contains('rep') ? i : -1).filter(i => i >= 0) }));
    check('слово с ошибкой вставлено ещё 2 раза и выделено', r.text === 'ab ab ab cd' && r.rep.join() === '3,4,6,7', r);
    // an error inside a repeat adds nothing more
    await press(rp2, 'Space', ' '); await press(rp2, 'KeyA', 'a'); await press(rp2, 'KeyX', 'x'); await press(rp2, 'KeyB', 'b');
    r = await rp2.evaluate(() => ({ text: window.__tt.state.text }));
    check('ошибка в повторе не добавляет новых повторов', r.text === 'ab ab ab cd', r);
    for (const [c, k] of [['Space', ' '], ['KeyA', 'a'], ['KeyB', 'b'], ['Space', ' '], ['KeyC', 'c'], ['KeyD', 'd']]) await press(rp2, c, k);
    r = await rp2.evaluate(() => ({ done: window.__tt.state.done, a: window.__tt.stats['EN|a'].a, h: JSON.parse(localStorage.getItem('tt.history')).slice(-1)[0] }));
    check('повторы идут в статистику как обычные нажатия', r.done && r.a - aBefore === 3 && r.h.chars === 11, { r, aBefore });
    await rp2.evaluate(() => { window.__tt.settings.retype = 0; window.__tt.load('ab cd'); });
    await press(rp2, 'KeyA', 'a'); await press(rp2, 'KeyS', 's'); await press(rp2, 'KeyB', 'b');
    check('перепечатка выкл: текст не меняется', await rp2.evaluate(() => window.__tt.state.text) === 'ab cd');
    await rctx2.close();
  }

  // ---------- 13. symbols like in normal text ----------
  {
    const gctx = await browser.newContext();
    const gp = await gctx.newPage();
    await gp.goto(URL);
    const g = await gp.evaluate(() => {
      const res = {};
      for (const L of ['RU', 'EN']) {
        const en = window.__tt.settings['sym' + L];
        const enabled = Object.keys(en).filter(k => en[k]);
        let single = 0, ell = 0, repeats = [], missing = [], badLen = [];
        for (let i = 0; i < 50; i++) {
          const t = window.__tt.generate('sym' + L);
          ell += (t.match(/\.\.\./g) || []).length;
          const noEll = t.replace(/\.\.\./g, '');
          single += (noEll.match(/\./g) || []).length;
          const m = noEll.match(/([^\p{L}\p{N}\s])\1/u) || t.match(/\.{4,}/);
          if (m) repeats.push(m[0] + ' in ' + t);
          enabled.forEach(tg => {
            const cs = tg === '0-9' ? null : tg.length === 2 ? tg.split('') : [tg];
            const ok = cs ? cs.every(c => (tg === '.' ? noEll : t).includes(c)) : /[0-9]/.test(t);
            if (!ok) missing.push(tg);
          });
          if (t.length < 150 || t.length > 300) badLen.push(t.length);
          // capital letter after . ! ? and a space
          if (/[.!?] [а-яёa-z]/.test(t)) repeats.push('lowercase after end: ' + t);
        }
        res[L] = { single, ell, repeats: repeats.slice(0, 2), missing: [...new Set(missing)], badLen };
      }
      return res;
    });
    for (const L of ['RU', 'EN']) {
      const x = g[L];
      check(`Знаки ${L}: одиночных точек ≥ 9× многоточий (${x.single} / ${x.ell})`, x.single >= 9 * Math.max(1, x.ell));
      check(`Знаки ${L}: нет повторов знаков подряд, после конца предложения — заглавная`, x.repeats.length === 0, x.repeats);
      check(`Знаки ${L}: каждый включённый знак есть в каждом из 50 уроков`, x.missing.length === 0, x.missing);
      check(`Знаки ${L}: длина урока 150–300`, x.badLen.length === 0, x.badLen);
    }
    // the density slider changes how many words carry a symbol
    const share = await gp.evaluate(() => {
      const s = window.__tt.settings;
      Object.keys(s.symRU).forEach(k => { s.symRU[k] = ['.', ',', '?', ':', '"', '()'].includes(k); });
      const out = {};
      for (const d of [1, 4]) {
        s.density = d;
        let sh = 0;
        for (let i = 0; i < 30; i++) {
          const w = window.__tt.generate('symRU').split(' ');
          sh += w.filter(x => /[^\p{L}.!?]/u.test(x.replace(/[.!?]$/, ''))).length / w.length;
        }
        out[d] = sh / 30;
      }
      return out;
    });
    check('ползунок «Плотность знаков» меняет частоту знаков', share[1] > 2 * share[4], share);
    await gp.click('[data-mode="symRU"]');
    check('ползунок плотности есть в режиме «Знаки»', await gp.isVisible('#densRange'));
    await gctx.close();
  }

  // screenshots, light and dark
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const scheme of ['light', 'dark']) {
    const c = await browser.newContext({ viewport: { width: 1000, height: 820 }, colorScheme: scheme });
    const p = await c.newPage();
    await p.goto(URL);
    await p.click('[data-mode="mixed"]');
    await p.selectOption('#hintSel', 'full');
    await p.evaluate(() => window.__tt.load('Срок: 15.11, Settings (№ 3) - 15%.'));
    await key(p, 'keydown', 'ShiftRight', 'Shift', true);
    await press(p, 'KeyC', 'С', true);
    await key(p, 'keyup', 'ShiftRight', 'Shift', false);
    for (const [code, k] of [['KeyH', 'р'], ['KeyJ', 'о'], ['KeyR', 'к']]) await press(p, code, k);
    const sp = await st(p);
    check(`скриншот ${scheme}: курсор на «:»`, sp.pos === 4 && sp.errors === 0, sp);
    await p.waitForTimeout(350);
    await p.screenshot({ path: path.join(SHOTS, `keyboard-${scheme}.png`) });
  }
  for (const scheme of ['light', 'dark']) {
    const c = await browser.newContext({ viewport: { width: 1000, height: 900 }, colorScheme: scheme });
    const p = await c.newPage();
    await p.goto(URL);
    await p.click('#dailyBtn');
    await press(p, 'Enter', 'Enter');
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(SHOTS, `daily-${scheme}.png`) });
  }
  const pm = await browser.newContext({ viewport: { width: 400, height: 800 }, colorScheme: 'light' });
  const pp = await pm.newPage();
  await pp.goto(URL);
  const overflow = await pp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check('нет горизонтальной прокрутки на ширине телефона', !overflow);
  await pp.screenshot({ path: path.join(SHOTS, 'phone.png') });

  await browser.close();
  console.log(failed ? `\n${failed} FAILED` : '\nALL OK');
  process.exit(failed ? 1 : 0);
})();
