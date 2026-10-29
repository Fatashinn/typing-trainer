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
    await p.screenshot({ path: path.join(SHOTS, `keyboard-${scheme}.png`) });
  }
  const pm = await browser.newContext({ viewport: { width: 390, height: 800 }, colorScheme: 'light' });
  const pp = await pm.newPage();
  await pp.goto(URL);
  const overflow = await pp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check('нет горизонтальной прокрутки на ширине телефона', !overflow);
  await pp.screenshot({ path: path.join(SHOTS, 'phone.png') });

  await browser.close();
  console.log(failed ? `\n${failed} FAILED` : '\nALL OK');
  process.exit(failed ? 1 : 0);
})();
