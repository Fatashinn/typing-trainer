// Localization tests include a pure dictionary contract and real DOM behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const source = fs.readFileSync(path.resolve(__dirname, '../platform/i18n.js'), 'utf8');
const sandbox = { console }; vm.createContext(sandbox); vm.runInContext(source, sandbox);
const i18n = sandbox.TT2.i18n;
assert.equal(i18n.t('skill.unknown'), 'Недостаточно данных');
i18n.setLanguage('en');
assert.equal(i18n.t('skill.unknown'), 'Insufficient data');
assert.equal(i18n.t('game.reward', {xp: 25}), 'Earned 25 XP');
assert.equal(i18n.translateText('Shift не той рукой: для «:» нужен левый Shift.'), 'Wrong Shift hand: «:» needs left Shift.');
assert.equal(i18n.translateText('активно 00:04 · пауза · 25 wpm · 97% · 12/100'), 'active 00:04 · paused · 25 wpm · 97% · 12/100');
assert.ok(!/[А-Яа-яЁё]/.test(i18n.translateText('Копия от 2026-11-13T10:00:00Z. Уроков в истории: 12. Будут заменены семь разделов версии 1.x. Данные обучения и XP платформы 2.0 сохранятся без изменений. Сохраните текущую копию перед заменой. Закройте другие вкладки тренажёра.')));
for (const key of i18n.keys) assert.notEqual(i18n.t(key), key, 'untranslated key ' + key);
i18n.setLanguage('ru'); assert.equal(i18n.translateText('Ошибка.'), 'Ошибка.');
assert.throws(() => i18n.setLanguage('xx'), /Unsupported/);
(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage();
  await page.setContent('<html lang="ru"><head><title>Тренажёр знаков</title></head><body><button id="button">Настройки</button><div id="msg">Ошибка.</div><div id="text"><span>Тренировка</span><span>é ß</span></div><textarea id="customText" placeholder="Вставь сюда любой текст. Длинный текст пойдёт кусками по ~300 знаков.">Текст пользователя</textarea><div id="hint"><b>ж</b> → Shift + 6 · левый Shift (раскладка RU)</div><input aria-label="Настройки"><div data-i18n="skill.unknown"></div></body></html>');
  await page.addScriptTag({path: path.resolve(__dirname, '../platform/i18n.js')});
  await page.evaluate(() => { window.clicked = 0; document.querySelector('#button').onclick = () => window.clicked++; TT2.i18n.init(); TT2.i18n.setLanguage('en'); });
  assert.equal(await page.textContent('#button'), 'Settings');
  assert.equal(await page.textContent('#text'), 'Тренировкаé ß');
  assert.equal(await page.inputValue('#customText'), 'Текст пользователя');
  assert.equal(await page.getAttribute('#customText', 'placeholder'), 'Paste any text here. Long text is split into sections of about 300 characters.');
  assert.equal(await page.getAttribute('input', 'aria-label'), 'Settings');
  assert.equal(await page.textContent('#hint b'), 'ж');
  await page.click('#button'); assert.equal(await page.evaluate(() => window.clicked), 1);
  await page.evaluate(() => document.querySelector('#msg').textContent = 'Переключи раскладку (Ctrl+Space): нужна RU.');
  await page.waitForFunction(() => document.querySelector('#msg').textContent.startsWith('Switch input'));
  await page.evaluate(() => TT2.i18n.setLanguage('ru'));
  assert.equal(await page.textContent('#button'), 'Настройки');
  assert.equal(await page.textContent('#msg'), 'Переключи раскладку (Ctrl+Space): нужна RU.');
  assert.equal(await page.getAttribute('#customText', 'placeholder'), 'Вставь сюда любой текст. Длинный текст пойдёт кусками по ~300 знаков.');
  assert.equal(await page.textContent('[data-i18n]'), 'Недостаточно данных');
  console.log('i18n dictionary, dynamic DOM, round-trip, attributes and data preservation passed');
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
