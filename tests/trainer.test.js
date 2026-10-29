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
