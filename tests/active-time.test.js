// Deterministic practice time tests; no real-time sleeps.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const path = require('node:path');
const URL = process.env.TT_TEST_URL || 'file://' + path.resolve(__dirname, '..', 'index.html');
(async()=>{
 const browser=await chromium.launch(); let passed=0;
 try {
  async function scenario(name, fn, seed) {
   const ctx=await browser.newContext({timezoneId:'Europe/Moscow'});
   if(seed) await ctx.addInitScript(seed=>{for(const[k,v]of Object.entries(seed))localStorage.setItem(k,JSON.stringify(v))},seed);
   const p=await ctx.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.clock.install({time:new Date('2026-11-13T20:59:50Z')});
   await p.clock.pauseAt(new Date('2026-11-13T20:59:58.100Z'));await p.goto(URL);
   await p.evaluate(()=>{window.__tt.settings.retype=0;window.__tt.load('abcdefghijklmnop');});
   const press=key=>p.evaluate(key=>window.dispatchEvent(new KeyboardEvent('keydown',{key,code:'Key'+key.toUpperCase(),bubbles:true,cancelable:true})),key);
   const state=()=>p.evaluate(()=>({active:window.__tt.state.activeMs,wpmMs:window.__tt.state.wpmMs,breaks:window.__tt.state.longBreaks,days,totals,history,done:window.__tt.state.done,pos:window.__tt.state.pos}));
   await fn({p,press,state,advance:ms=>p.clock.runFor(ms)});
   assert.deepEqual(errors,[],name+': JS errors');await ctx.close();passed++;console.log('ok '+name);
  }
  await scenario('continuous input and zero credit for a single key',async({p,press,state,advance})=>{
   await press('a');await advance(1000);assert.equal((await state()).active,0);
   await press('b');assert.equal((await state()).active,1000);assert.equal((await state()).wpmMs,1000);
  });
  for(const delay of [3000,10000,60000,600000]) await scenario('pause '+delay,async({press,state,advance})=>{
   await press('a');await advance(delay);await press('b');const s=await state();assert.equal(s.active,Math.min(delay,5000));assert.equal(s.wpmMs,delay);assert.equal(s.breaks,delay>5000?1:0);
  });
  for(const event of ['blur','hidden','manual','menu']) await scenario('suspend '+event,async({p,press,state,advance})=>{
   await press('a');await advance(1000);await press('b');
   if(event==='blur')await p.evaluate(()=>window.dispatchEvent(new Event('blur')));
   if(event==='hidden')await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
   if(event==='manual')await p.click('#pauseBtn');
   if(event==='menu')await p.click('[data-tab="settings"]');
   await advance(60000);
   if(event==='blur')await p.evaluate(()=>window.dispatchEvent(new Event('focus')));
   if(event==='hidden')await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
   if(event==='manual')await p.click('#pauseBtn');
   if(event==='menu')await p.click('[data-tab="train"]');
   await press('c');assert.equal((await state()).active,1000);assert.equal((await state()).wpmMs,1000);
   await advance(1000);await press('d');assert.equal((await state()).active,2000);
  });
  await scenario('midnight splits interval and reload never credits twice',async({p,press,state,advance})=>{
   await press('a');await advance(4000);await press('b');
   let s=await state();assert.equal(s.totals.timingV2.activeDays['2026-11-13'],1900);assert.equal(s.totals.timingV2.activeDays['2026-11-14'],2100);
   await p.reload();s=await state();assert.equal(s.totals.timingV2.activeMs,4000);assert.equal(s.history.length,1);assert.equal(s.history[0].status,'interrupted');
   await p.reload();s=await state();assert.equal(s.history.length,1);assert.equal(s.totals.timingV2.activeMs,4000);
  });
  await scenario('completion then results wait does not accrue',async({p,press,state,advance})=>{
   await p.evaluate(()=>window.__tt.load('ab'));await press('a');await advance(2000);await press('b');await advance(60000);
   const s=await state();assert.equal(s.history.at(-1).activeMs,2000);assert.equal(s.history.at(-1).wpmMs,2000);assert.equal(s.history.at(-1).status,'completed');
   assert.equal(s.totals.timingV2.activeMs,2000);
  });
  await scenario('new text preserves partial lesson and errors count as attempts',async({p,press,state,advance})=>{
   await press('x');await advance(1000);await press('a');await p.click('#newBtn');
   const h=(await state()).history.at(-1);assert.equal(h.activeMs,1000);assert.equal(h.acc,50);assert.equal(h.status,'interrupted');
  });
  await scenario('three daily blocks require actual input intervals',async({p,press,state,advance})=>{
   await p.evaluate(()=>window.__tt.setBlockMs(2000));await p.click('#dailyBtn');await p.keyboard.press('Enter');
   for(let i=0;i<3;i++){
    await press('x');await advance(60000);assert.equal(await p.evaluate(()=>window.__tt.daily.idx),i);
    await press('x');assert.equal((await state()).history.at(-1).activeMs,2000);
    if(i<2){assert.equal(await p.evaluate(()=>window.__tt.daily.waiting),true);await advance(30000);await p.keyboard.press('Enter');}
   }
   assert.equal(await p.evaluate(()=>window.__tt.daily),null);assert.equal((await state()).totals.timingV2.activeMs,6000);
  });
  await scenario('daily pause, resume and interruption retain practice',async({p,press,state,advance})=>{
   await p.click('#dailyBtn');await p.keyboard.press('Enter');await press('x');await advance(2000);await press('x');
   await p.click('#pauseBtn');await advance(60000);await p.click('#pauseBtn');await press('x');await advance(1000);await press('x');
   assert.equal(await p.evaluate(()=>window.__tt.daily.blockMs),3000);await p.click('#dailyStop');assert.equal((await state()).history.at(-1).activeMs,3000);
  });
  await scenario('legacy series preserved without promoting partial old minutes',async({p,press,state,advance})=>{
   assert.equal(await p.evaluate(()=>window.__tt.streakInfo().streak),1);
   await press('a');await advance(1000);await press('b');assert.equal(await p.evaluate(()=>window.__tt.streakInfo().streak),1);
   assert.equal((await state()).totals.timingV2.legacyDays['2026-11-13'],599000);
   assert.equal((await state()).totals.timingV2.activeMs,1000);
  },{'tt.days':{'2026-11-12':600000,'2026-11-13':599000}});
  await scenario('new time fields survive backup validation and reload',async({p,press,state,advance})=>{
   await press('a');await advance(2000);await press('b');await p.click('#newBtn');
   const before=await state();await p.evaluate(()=>{const b=parseBackup(backupText());replaceData(b,readSnapshot());});await p.reload();const after=await state();
   assert.equal(after.totals.timingV2.activeMs,2000);assert.equal(after.history.length,before.history.length);assert.equal(after.history.at(-1).wpmMs,2000);
  });
  await scenario('first-letter correction belongs to word speed; all excluded has no sample',async({p,press,state,advance})=>{
   await p.evaluate(()=>{settings.ceiling=40;window.__tt.load('ab');});
   await press('x');await advance(10000);await press('a');await advance(100);await press('b');
   let h=(await state()).history.at(-1);assert.equal(h.fast,0);assert.equal(h.wpmMs,10100);assert.equal(h.acc,66.7);
   await p.evaluate(()=>window.__tt.load('ab'));await press('a');await advance(100);await press('b');
   h=(await state()).history.at(-1);assert.equal(h.fast,1);assert.equal(h.noSpeedSample,true);
   assert.match(await p.locator('#result').textContent(),/–/);
  });
  await scenario('sleep clock discontinuity does not create practice',async({p,press,state,advance})=>{
   await press('a');await p.clock.setSystemTime(new Date('2026-11-14T09:00:00Z'));await press('b');
   const s=await state();assert.equal(s.active,0);assert.equal(s.wpmMs,0);assert.equal(s.breaks,1);
  });
  await scenario('old history is retained through practice and reload',async({p,press,state,advance})=>{
   const old=(await state()).history[0];await press('a');await advance(1000);await press('b');await p.reload();
   const s=await state();assert.deepEqual(s.history[0],old);assert.equal(s.history.length,2);
  },{'tt.history':[{t:1,mode:'digits',chars:50,wpm:20,acc:95,errors:1,layoutErr:0,shiftErr:0}]});
  await scenario('history publication failure replays once from authoritative time ledger',async({p,press,state,advance})=>{
   await p.evaluate(()=>{window.__tt.load('ab');window.savedSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='tt.history')throw new Error('history unavailable');return window.savedSet.call(this,k,v);};});
   await press('a');await advance(2000);await press('b');
   assert.equal((await state()).totals.timingV2.records.length,1);
   await p.evaluate(()=>{Storage.prototype.setItem=window.savedSet;});
   await p.reload();let s=await state();assert.equal(s.history.length,1);assert.equal(s.totals.timingV2.activeMs,2000);assert.equal(s.totals.lessons,1);
   await p.reload();s=await state();assert.equal(s.history.length,1);assert.equal(s.totals.lessons,1);
  });
  console.log(passed+' active-time scenarios passed');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
