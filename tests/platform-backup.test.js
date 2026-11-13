// Playwright regression for v1/v2 backups and the eighth user-data key.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const path = require('node:path');
const URL = process.env.TT_TEST_URL || 'file://' + path.resolve(__dirname, '..', 'index.html');
(async () => {
  const browser = await chromium.launch();
  let passed = 0;
  try {
    async function scenario(name, run) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(URL);
      await run(page);
      assert.deepEqual(errors, [], name + ': page errors');
      await context.close(); passed++; console.log('ok ' + name);
    }
    await scenario('v2 export covers eight keys and current platform memory', async page => {
      const b = await page.evaluate(() => {
        TT2.appState = TT2.storage.create(); TT2.appState.preferences.uiLanguage = 'en';
        return parseBackup(backupText());
      });
      assert.equal(b.version, 2); assert.equal(Object.keys(b.entries).length, 8);
      assert.equal(JSON.parse(b.entries['tt.platform']).preferences.uiLanguage, 'en');
    });
    await scenario('v1 replacement preserves all current platform bytes', async page => {
      const result = await page.evaluate(() => {
        const state = TT2.storage.create(); state.preferences.languageId = 'fr';
        const raw = JSON.stringify(state); localStorage.setItem('tt.platform', raw);
        const b = JSON.parse(backupText()); b.version = 1; delete b.entries['tt.platform'];
        b.entries['tt.custom'] = JSON.stringify({ text: 'legacy import', offset: 0 });
        replaceData(parseBackup(JSON.stringify(b)), readSnapshot());
        return { raw, after: localStorage.getItem('tt.platform'), custom: JSON.parse(localStorage.getItem('tt.custom')).text };
      });
      assert.equal(result.after, result.raw); assert.equal(result.custom, 'legacy import');
    });
    await scenario('v2 invalid platform structure is rejected before writes', async page => {
      const result = await page.evaluate(() => {
        const before = JSON.stringify(readSnapshot());
        const bad = JSON.parse(backupText()); bad.entries['tt.platform'] = JSON.stringify({ version: 999 });
        let message = ''; try { parseBackup(JSON.stringify(bad)); } catch (e) { message = e.message; }
        return { before, after: JSON.stringify(readSnapshot()), message };
      });
      assert.equal(result.after, result.before); assert.match(result.message, /version|верси/i);
    });
    await scenario('failed eighth-key write rolls back all eight records', async page => {
      const result = await page.evaluate(() => {
        const state = TT2.storage.create(); localStorage.setItem('tt.platform', JSON.stringify(state));
        const before = readSnapshot(); const b = JSON.parse(backupText());
        b.entries['tt.custom'] = JSON.stringify({ text: 'must roll back', offset: 0 });
        const replacement = TT2.storage.create(); replacement.preferences.languageId = 'de';
        b.entries['tt.platform'] = JSON.stringify(replacement);
        const set = Storage.prototype.setItem; let failed = false, message = '';
        Storage.prototype.setItem = function(k, v) { if (k === 'tt.platform' && !failed) { failed = true; throw new Error('injected eighth-key fault'); } return set.call(this, k, v); };
        try { replaceData(b, before); } catch (e) { message = e.message; } finally { Storage.prototype.setItem = set; }
        return { before, after: readSnapshot(), journal: localStorage.getItem(JOURNAL), message };
      });
      assert.deepEqual(result.after, result.before); assert.equal(result.journal, null);
      assert.match(result.message, /прежние данные сохранены/);
    });
    await scenario('old seven-key recovery journal never removes platform data', async page => {
      await page.evaluate(() => {
        const state = TT2.storage.create(); state.preferences.languageId = 'de';
        localStorage.setItem('tt.platform', JSON.stringify(state));
        const before = Object.fromEntries(LEGACY_USER_KEYS.map(k => [k, localStorage.getItem(k)]));
        before['tt.custom'] = JSON.stringify({ text: 'recovered v1', offset: 0 });
        localStorage.setItem(JOURNAL, JSON.stringify({ version: 1, before }));
      });
      await page.reload();
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('tt.platform')).preferences.languageId), 'de');
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('tt.custom')).text), 'recovered v1');
      assert.equal(await page.evaluate(() => localStorage.getItem(JOURNAL)), null);
    });
    await scenario('reload-equivalent events are safe but genuine external changes freeze writes', async page => {
      const result=await page.evaluate(()=>{
        const raw=JSON.stringify(TT2.appState);localStorage.setItem('tt.platform',raw);
        window.dispatchEvent(new StorageEvent('storage',{key:'tt.platform',newValue:raw,storageArea:localStorage,url:location.href}));
        const equivalentFrozen=storageFrozen;
        const changed=JSON.parse(raw);changed.preferences.uiLanguage=changed.preferences.uiLanguage==='ru'?'en':'ru';const incoming=JSON.stringify(changed);localStorage.setItem('tt.platform',incoming);
        window.dispatchEvent(new StorageEvent('storage',{key:'tt.platform',newValue:incoming,storageArea:localStorage,url:location.href}));
        return {equivalentFrozen,conflictFrozen:storageFrozen,preserved:localStorage.getItem('tt.platform')===incoming};
      });assert.deepEqual(result,{equivalentFrozen:false,conflictFrozen:true,preserved:true});
    });
    await scenario('damaged platform source is retained and measured learning is blocked safely',async page=>{
      await page.evaluate(()=>localStorage.setItem('tt.platform','{damaged'));await page.reload();
      const result=await page.evaluate(()=>{TT2.app.start({text:'ab',context:{languageId:'en',layoutId:'en-us',geometry:'ANSI'}});return {source:localStorage.getItem('tt.platform'),exported:JSON.parse(backupText()).entries['tt.platform'],started:!!S.platform};});
      assert.deepEqual(result,{source:'{damaged',exported:'{damaged',started:false});
    });
    console.log(passed + ' platform backup scenarios passed');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
