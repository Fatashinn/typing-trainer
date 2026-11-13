const assert=require('node:assert/strict');const {chromium}=require('playwright');const path=require('node:path');
const URL=process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html');
(async()=>{const browser=await chromium.launch();let count=0;try{
 async function scenario(name,run){const c=await browser.newContext();const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(URL);await run(p);assert.deepEqual(errors,[],name);await c.close();count++;console.log('ok '+name);}
 const start=(p,text,languageId='en',layoutId='en-us',hintLevel='none')=>p.evaluate(({text,languageId,layoutId,hintLevel})=>{settings.retype=0;TT2.appState.preferences.languageId=languageId;TT2.appState.preferences.layoutId=layoutId;TT2.app.start({text,context:TT2.app.context(),hintLevel});},{text,languageId,layoutId,hintLevel});
 const commit=(p,text,props={})=>p.evaluate(({text,props})=>{const input=document.querySelector('#platformInput');input.dispatchEvent(new KeyboardEvent('keydown',{key:text,code:'',bubbles:true,...props}));input.value=text;input.dispatchEvent(new InputEvent('input',{data:text,inputType:'insertText',bubbles:true}));},{text,props});
 await scenario('native input completes without duplicate characters and keeps legacy stats isolated',async p=>{
  await start(p,'abc');await p.keyboard.type('abc');assert.equal(await p.evaluate(()=>S.pos),3);assert.equal(await p.evaluate(()=>S.keys),3);assert.equal(await p.evaluate(()=>Object.keys(stats).length),0);assert.equal(await p.evaluate(()=>Object.keys(TT2.appState.learning.processed).length),1);
  await p.reload();assert.equal(await p.evaluate(()=>Object.keys(TT2.appState.learning.processed).length),1);
 });
 await scenario('four content languages and seven selectable layouts are independent',async p=>{
  assert.equal(await p.locator('[data-platform-preference="layoutId"] option').count(),7);
  assert.equal(await p.locator('[data-node-id]').count(),42);
  for(const [language,layout,text]of [['ru','ru-pc-mac','да'],['ru','ru-mac','да'],['en','en-us','ab'],['fr','fr-pc','été'],['fr','fr-mac','été'],['de','de-pc','für'],['de','de-mac','für']]){await start(p,text,language,layout);for(const ch of text)await commit(p,ch);assert.equal(await p.evaluate(()=>S.done),true,layout);}
  assert.equal(await p.evaluate(()=>TT2.appState.preferences.uiLanguage),'ru');
 });
 await scenario('dead-key and composition intermediates are not errors and final echo is deduplicated',async p=>{
  await start(p,'ê','fr','fr-pc');await p.evaluate(()=>{const i=document.querySelector('#platformInput');i.dispatchEvent(new KeyboardEvent('keydown',{key:'Dead',code:'BracketLeft',bubbles:true}));i.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));i.value='e';i.dispatchEvent(new InputEvent('input',{data:'e',inputType:'insertCompositionText',isComposing:true,bubbles:true}));});
  assert.equal(await p.evaluate(()=>S.keys),0);
  await p.evaluate(()=>{const i=document.querySelector('#platformInput');i.dispatchEvent(new CompositionEvent('compositionend',{data:'e\u0302',bubbles:true}));i.dispatchEvent(new InputEvent('input',{data:'ê',inputType:'insertText',bubbles:true}));});
  assert.equal(await p.evaluate(()=>S.keys),1);assert.equal(await p.evaluate(()=>S.errors),0);assert.equal(await p.evaluate(()=>S.done),true);
 });
 await scenario('wrong selected layout does not get confirmed character mastery',async p=>{
  await start(p,'a','fr','fr-pc');await commit(p,'a',{code:'KeyA'});assert.equal(await p.evaluate(()=>S.pos),0);assert.equal(await p.evaluate(()=>S.layoutErr),1);await commit(p,'a',{code:'KeyQ'});assert.equal(await p.evaluate(()=>S.done),true);
 });
 await scenario('Option and AltGr routes accept actual reference modifiers',async p=>{
  for(const layout of ['fr-mac','de-mac','fr-pc','de-pc']){
   const route=await p.evaluate(id=>{for(const ch of TT2.availableCharacters(id)){const r=TT2.layoutRoutes(id,ch).find(r=>!r.sequence&&(r.modifiers.includes('Alt')||r.modifiers.includes('AltGr')));if(r)return {ch,...r};}},layout);
   assert.ok(route,layout);await start(p,route.character||route.ch,layout.startsWith('fr')?'fr':'de',layout);
   await commit(p,route.character||route.ch,{code:route.code,altKey:true,ctrlKey:route.modifiers.includes('AltGr'),shiftKey:route.modifiers.includes('Shift')});assert.equal(await p.evaluate(()=>S.done),true,layout);
  }
 });
 await scenario('UI switch preserves lesson, typed draft, XP and independent language/layout preferences',async p=>{
  await start(p,'abc');await p.keyboard.type('a');const id=await p.evaluate(()=>S.id);
  await p.click('[data-tab="practice"]');await p.fill('#platformFreeText','Mon texte éß');await p.click('[data-tab="settings"]');await p.selectOption('[data-platform-preference="uiLanguage"]','en');
  assert.equal(await p.evaluate(()=>S.id),id);assert.equal(await p.evaluate(()=>S.pos),1);assert.equal(await p.evaluate(()=>TT2.appState.preferences.languageId),'en');
  await p.click('[data-tab="practice"]');assert.equal(await p.inputValue('#platformFreeText'),'Mon texte éß');
  assert.equal(await p.locator('[data-tab="settings"]').textContent(),'Settings');await p.click('[data-tab="settings"]');await p.selectOption('[data-platform-preference="uiLanguage"]','ru');assert.equal(await p.locator('[data-tab="settings"]').textContent(),'Настройки');
 });
 await scenario('diagnostic quick/full/skip, all map nodes and unsupported cross-layout materials',async p=>{
  await p.click('[data-tab="practice"]');assert.equal(await p.locator('[data-diagnostic]').count(),3);
  await p.locator('[data-diagnostic=skip]').click();assert.equal(await p.evaluate(()=>TT2.appState.preferences.diagnosticSkipped),true);
  await p.locator('[data-diagnostic=quick]').click();assert.equal(await p.evaluate(()=>S.platform.kind),'diagnostic-quick');
  await p.click('[data-tab="map"]');assert.equal(await p.locator('[data-node-id] button:disabled').count(),0);
  await p.evaluate(()=>{TT2.appState.preferences.languageId='fr';TT2.appState.preferences.layoutId='ru-pc-mac';TT2.app.start({text:'été',context:TT2.app.context()});});assert.match(await p.locator('#msg').textContent(),/раскладка/);
 });
 await scenario('timed platform practice awards XP once and copy/reload cannot re-award',async p=>{
  await p.clock.install();await start(p,'a'.repeat(25));
  for(let i=0;i<25;i++){await p.clock.runFor(1000);await commit(p,'a',{code:'KeyA'});}
  const xp=await p.evaluate(()=>TT2.appState.learning.xp);assert.ok(xp>0);
  await p.evaluate(()=>TT2.app.replay());assert.equal(await p.evaluate(()=>TT2.appState.learning.xp),xp);
  await p.evaluate(()=>{const b=parseBackup(backupText());replaceData(b,readSnapshot());});await p.reload();assert.equal(await p.evaluate(()=>TT2.appState.learning.xp),xp);
 });
 await scenario('mixed exercise changes expected context and stores mastery separately',async p=>{
  await p.click('[data-tab="map"]');await p.locator('[data-node-id="technique-3"] button').nth(1).click();
  assert.ok(await p.evaluate(()=>S.platform.segments.length===3));
  while(!await p.evaluate(()=>S.done)){const ch=await p.evaluate(()=>S.text[S.pos]);await commit(p,ch);}
  const contexts=await p.evaluate(()=>Object.values(TT2.appState.learning.processed).map(x=>x.languageId+'|'+x.layoutId));assert.deepEqual([...new Set(contexts)].sort(),['en|en-us','ru|ru-pc-mac']);
  assert.equal(await p.evaluate(()=>Object.keys(stats).length),0);await p.reload();assert.equal(await p.evaluate(()=>Object.keys(TT2.appState.learning.processed).length),2);
 });
 await scenario('French PC partial assessment explicitly reports unavailable oe ligature',async p=>{
  await p.evaluate(()=>{TT2.appState.preferences.languageId='fr';TT2.appState.preferences.layoutId='fr-pc';TT2.app.render();});await p.click('[data-tab="practice"]');await p.locator('[data-diagnostic=full]').click();assert.equal(await p.evaluate(()=>S.platform.languageId),'fr');assert.match(await p.locator('#msg').textContent(),/œ/);assert.equal(await p.evaluate(()=>S.text.includes('œ')),false);
 });
 await scenario('hint control applies to platform sessions and does not reset progress',async p=>{
  await start(p,'abc');await p.keyboard.type('a');await p.selectOption('#hintSel','full');assert.equal(await p.evaluate(()=>S.platform.hintLevel),'full');assert.equal(await p.evaluate(()=>S.pos),1);assert.ok((await p.locator('#hint').textContent()).includes('KeyB'));
 });
 await scenario('platform Shift side and no-hint correction are measured independently',async p=>{
  await start(p,'A');await p.evaluate(()=>document.querySelector('#platformInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Shift',code:'ShiftLeft',shiftKey:true,bubbles:true})));
  await commit(p,'A',{code:'KeyA',shiftKey:true});assert.equal(await p.evaluate(()=>S.shiftErr),1);
  await p.evaluate(()=>{document.querySelector('#platformInput').dispatchEvent(new KeyboardEvent('keyup',{key:'Shift',code:'ShiftLeft',bubbles:true}));document.querySelector('#platformInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Shift',code:'ShiftRight',shiftKey:true,bubbles:true}));});
  await commit(p,'A',{code:'KeyA',shiftKey:true});assert.equal(await p.evaluate(()=>S.done),true);
  assert.equal(await p.evaluate(()=>TT2.appState.learning.skills.character['en-us|A'].hinted),0);assert.ok(await p.evaluate(()=>TT2.appState.learning.skills.physical.ShiftRight.errors>0));
 });
 await scenario('platform free text chunks and resumes without skipping source',async p=>{
  await p.evaluate(()=>{TT2.appState.preferences.languageId='en';TT2.appState.preferences.layoutId='en-us';TT2.app.render();});await p.click('[data-tab="practice"]');await p.fill('#platformFreeText','a'.repeat(300)+'b'+'c'.repeat(10));await p.locator('#tab-practice > button').last().click();assert.equal(await p.evaluate(()=>S.text.length),300);
  await p.keyboard.type('aa');await p.reload();await p.click('[data-tab="practice"]');await p.locator('#tab-practice > button').last().click();const resume=await p.evaluate(()=>({start:S.platform?.free?.start,notice:document.querySelector('#platformNotice')?.textContent,protected:[...protectedKeys],frozen:storageFrozen,warnings:[...storageWarnings]}));assert.equal(resume.start,2,JSON.stringify(resume));assert.equal(await p.evaluate(()=>S.text.includes('b')),true);
 });
 await scenario('unfinished platform lesson replays once without historical XP',async p=>{
  await start(p,'abc');await p.keyboard.type('a');await p.reload();const before=await p.evaluate(()=>({xp:TT2.appState.learning.xp,count:Object.keys(TT2.appState.learning.processed).length}));assert.deepEqual(before,{xp:0,count:1});await p.reload();assert.equal(await p.evaluate(()=>Object.keys(TT2.appState.learning.processed).length),1);
 });
 await scenario('platform input and keyboard remain visible on desktop',async p=>{
  await p.setViewportSize({width:1280,height:800});await start(p,'ab '.repeat(120));await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const bounds=await p.evaluate(()=>{const k=document.querySelector('#kbWrap').getBoundingClientRect(),i=document.querySelector('#platformInput').getBoundingClientRect(),t=document.querySelector('#textBox').getBoundingClientRect();return {keyboard:k.bottom,input:i.bottom,noOverlap:k.top>=t.bottom,fitted:document.querySelector('#practiceStage').classList.contains('fitted')};});assert.equal(bounds.fitted,true);assert.ok(bounds.keyboard<=800);assert.ok(bounds.input<=800);assert.equal(bounds.noOverlap,true);await p.screenshot({path:'/tmp/tt2-platform-desktop.png'});
 });
 await scenario('English UI covers all screens while preserving exercise text',async p=>{
  await p.click('[data-tab="settings"]');await p.selectOption('[data-platform-preference="uiLanguage"]','en');
  for(const tab of ['train','stats','settings','map','practice']){await p.click('[data-tab="'+tab+'"]');const leftover=await p.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];let n;while(n=w.nextNode()){const el=n.parentElement;if(!el||!el.getClientRects().length||el.closest('script,style,option,#text span,#kb,textarea,#platformStats td:first-child,#stTable td.ch'))continue;if(/[А-Яа-яЁё]/.test(n.textContent))out.push(n.textContent.trim());}return [...new Set(out)];});assert.deepEqual(leftover,[],tab);}
  await p.evaluate(()=>TT2.app.start({text:'ab',context:{languageId:'en',layoutId:'en-us',geometry:'ANSI'},hintLevel:'none'}));await p.keyboard.type('ab');assert.equal(await p.evaluate(()=>/[А-Яа-яЁё]/.test(makeReport())),false);
 });
 console.log(count+' platform browser scenarios passed');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
