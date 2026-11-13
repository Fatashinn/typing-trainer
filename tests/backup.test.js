// Run: node tests/backup.test.js (Playwright + Chromium; same setup as trainer.test.js).
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const path = require('node:path');
const URL = process.env.TT_TEST_URL || 'file://' + path.resolve(__dirname, '..', 'index.html');
let passed = 0;
(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(URL);
    const test = async (name, fn) => { await fn(); passed++; console.log('ok ' + name); };
    const snapshot = () => page.evaluate(() => readSnapshot());
    const backup = () => page.evaluate(() => JSON.parse(backupText()));
    const select = async b => {
      await page.locator('#backupFile').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(typeof b === 'string' ? b : JSON.stringify(b)) });
      await page.waitForFunction(() => document.querySelector('#backupMessage').textContent.includes('проверен') || document.querySelector('#backupMessage').textContent.includes('отклонён'));
    };
    await page.click('[data-tab="settings"]');
    await test('versioned export includes eight keys and preserves unknown supported fields', async () => {
      await page.evaluate(() => {
        settings.futureNote = 'сохранить';
        stats['RU|6'] = { a: 5, e: 1, le: 0, se: 0, t: 400, n: 1 };
        history.push({t: Date.now(),mode:'digits',chars:20,wpm:30,acc:95,errors:1,layoutErr:0,shiftErr:0});
        store.set('tt.custom', { text: 'Мой текст abc', offset: 2 });
        store.set('tt.daily', {lastDate:'2026-10-29',lastLang:'RU'});
      });
      const b = await backup();
      assert.equal(b.version, 2); assert.equal(b.format, 'typing-trainer-backup');
      assert.equal(Object.keys(b.entries).length, 8);
      assert.equal(JSON.parse(b.entries['tt.settings']).futureNote, 'сохранить');
      const downloadEvent = page.waitForEvent('download'); await page.click('#backupExport');
      const download = await downloadEvent; assert.match(download.suggestedFilename(), /backup.*\.json$/);
    });
    const original = await backup();
    await test('preview and cancellation do not replace records', async () => {
      const before = await snapshot(); await select(original);
      assert.equal(await page.locator('#backupApply').isDisabled(), true);
      assert.match(await page.locator('#backupSummary').textContent(), /Уроков в истории: 1/);
      await page.click('#backupCancel'); assert.deepEqual(await snapshot(), before);
    });
    await test('invalid JSON, unknown format, version, schema and size are rejected without writes', async () => {
      const before = await snapshot();
      const cases = ['{bad', {...original,version:99}, {...original,format:'ai-report'}, {...original,entries:{...original.entries,'tt.history':'{}'}}, {...original,entries:{...original.entries,'tt.stats':'null'}}, {...original,entries:{...original.entries,'tt.custom':JSON.stringify({text:'x'.repeat(1000001)})}}];
      for (const b of cases) {
        await select(b); assert.match(await page.locator('#backupMessage').textContent(), /отклонён/);
        assert.deepEqual(await snapshot(), before);
      }
    });
    await test('explicit replacement restores legacy records in a different browser context', async () => {
      const other = await browser.newContext(); const p = await other.newPage(); await p.goto(URL);
      await p.evaluate(b => replaceData(b, readSnapshot()), original);
      await p.reload();
      assert.equal(await p.evaluate(() => window.__tt.stats['RU|6'].a), 5);
      assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('tt.history'))[0].ms), undefined);
      assert.equal(await p.evaluate(() => store.get('tt.custom', {}).text), 'Мой текст abc');
      const result = await p.evaluate(() => JSON.parse(backupText()));
      for (const k of Object.keys(original.entries)) assert.deepEqual(JSON.parse(result.entries[k]), JSON.parse(original.entries[k]));
      await other.close();
    });
    await test('confirmed UI import replaces data and reloads', async () => {
      const replacement = JSON.parse(JSON.stringify(original));
      replacement.entries['tt.custom'] = JSON.stringify({ text:'замена',offset:0 });
      await select(replacement); await page.check('#backupConfirm');
      await Promise.all([page.waitForEvent('load'), page.click('#backupApply')]);
      assert.equal(await page.evaluate(() => store.get('tt.custom', {}).text), 'замена');
    });
    await test('quota failure while saving journal leaves all data unchanged', async () => {
      const before = await snapshot();
      const error = await page.evaluate(b => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(k,v) { if(k === JOURNAL) throw new DOMException('full','QuotaExceededError'); return original.call(this,k,v); };
        try { replaceData(b, readSnapshot()); } catch(e) { return e.message; }
        finally { Storage.prototype.setItem = original; }
      }, original);
      assert.match(error, /не начат/); assert.deepEqual(await snapshot(), before);
    });
    await test('one failed write rolls back exact original records', async () => {
      const before = await snapshot();
      const error = await page.evaluate(b => {
        const original = Storage.prototype.setItem; let failed = false;
        Storage.prototype.setItem = function(k,v) { if(k === 'tt.custom' && !failed) { failed = true; throw new Error('injected'); } return original.call(this,k,v); };
        try { replaceData(b, readSnapshot()); } catch(e) { return e.message; }
        finally { Storage.prototype.setItem = original; }
      }, original);
      assert.match(error, /прежние данные сохранены/); assert.deepEqual(await snapshot(), before);
      assert.equal(await page.evaluate(() => localStorage.getItem(JOURNAL)), null);
    });
    await test('failed rollback keeps journal and next startup restores exact original values', async () => {
      const before = await snapshot();
      await page.evaluate(b => {
        const original = Storage.prototype.setItem;
        const changed = JSON.parse(JSON.stringify(b));
        changed.entries['tt.stats'] = '{}'; changed.entries['tt.custom'] = JSON.stringify({text:'другое',offset:0});
        let failed = false;
        Storage.prototype.setItem = function(k,v) { if(k === 'tt.custom') failed=true; if(failed && (k === 'tt.custom' || k === 'tt.stats')) throw new Error('persistent fault'); return original.call(this,k,v); };
        try { replaceData(changed, readSnapshot()); } catch(e) { document.body.dataset.failure = e.message; }
        finally { Storage.prototype.setItem = original; }
      }, original);
      assert.match(await page.getAttribute('body','data-failure'), /журнал сохранён/);
      assert.notEqual(await page.evaluate(() => localStorage.getItem(JOURNAL)), null);
      assert.equal(await page.evaluate(() => store.set('tt.stats', {})), false);
      await page.reload(); assert.deepEqual(await snapshot(), before);
      assert.equal(await page.evaluate(() => localStorage.getItem(JOURNAL)), null);
    });
    await test('quota failure still exports latest in-memory progress without writes', async () => {
      const result = await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function() { throw new DOMException('full','QuotaExceededError'); };
        try {
          store.set('tt.custom', {text:'не сохранено на диск',offset:0});
          stats['EN|7'] = {a:9,e:0,le:0,se:0,t:100,n:1}; saveStats();
          const b = parseBackup(backupText());
          return { text:JSON.parse(b.entries['tt.custom']).text, attempts:JSON.parse(b.entries['tt.stats'])['EN|7'].a };
        } finally { Storage.prototype.setItem = original; }
      });
      assert.equal(result.text, 'не сохранено на диск'); assert.equal(result.attempts, 9);
    });
    await test('stale preview refuses to overwrite changed records', async () => {
      const before = await snapshot();
      const error = await page.evaluate(({b,before}) => {
        localStorage.setItem('tt.custom', JSON.stringify({text:'новое изменение',offset:0}));
        try { replaceData(b,before); } catch(e) { return e.message; }
      }, {b:original,before});
      assert.match(error,/изменились/);
      assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tt.custom')).text), 'новое изменение');
    });
    await test('corrupt local records survive startup, training saves and export', async () => {
      for (const [key,value] of [['tt.history','{}'],['tt.stats','null'],['tt.settings','{bad']]) {
        const ctx = await browser.newContext(); await ctx.addInitScript(({key,value})=>localStorage.setItem(key,value),{key,value});
        const p = await ctx.newPage(); await p.goto(URL);
        assert.equal(await p.evaluate(() => !!window.__tt), true);
        assert.equal(await p.evaluate(k => JSON.parse(backupText()).entries[k], key), value);
        await p.evaluate(() => saveStats());
        assert.equal(await p.evaluate(k => localStorage.getItem(k), key), value);
        await ctx.close();
      }
    });
    await context.close();
    console.log(`${passed} backup tests passed`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
