const assert=require('node:assert/strict');const {chromium}=require('playwright');const path=require('node:path');
(async()=>{const b=await chromium.launch();let count=0;try{
 for(const [width,height] of [[1440,900],[1280,800],[1000,900],[800,650],[400,800],[320,568],[1280,480]])for(const colorScheme of ['light','dark']){
  const c=await b.newContext({viewport:{width,height},colorScheme});const p=await c.newPage();await p.goto(process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html'));
  await p.evaluate(()=>{window.__tt.settings.retype=0;window.__tt.load('ab cd '.repeat(200).trim());});
  await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const before=await p.evaluate(()=>({fitted:document.querySelector('#practiceStage').classList.contains('fitted'),overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(before.overflow,false,`${width} overflow`);
  if(width>=1000&&height>=800)assert.equal(before.fitted,true);
  await p.evaluate(()=>{for(let i=0;i<1000;i++)window.dispatchEvent(new KeyboardEvent('keydown',{key:S.text[S.pos],code:'',bubbles:true}));});
  const r=await p.evaluate(()=>{
   const text=document.querySelector('#textBox').getBoundingClientRect(),key=document.querySelector('#kbWrap').getBoundingClientRect(),current=document.querySelector('#text .c').getBoundingClientRect();
   return {text:{top:text.top,bottom:text.bottom},key:{top:key.top,bottom:key.bottom},current:{top:current.top,bottom:current.bottom},scroll:document.querySelector('#textBox').scrollTop,pageScroll:scrollY};
  });
  assert.ok(r.scroll>0,'text must scroll');assert.ok(r.current.top>=r.text.top&&r.current.bottom<=r.text.bottom,'current symbol visible');
  assert.ok(r.key.top>=r.text.bottom,'keyboard must not overlap exercise');
  if(before.fitted){assert.ok(r.key.bottom<=height,JSON.stringify({width,height,r}));assert.equal(r.pageScroll,0);}
  await p.selectOption('#kbSel','hidden');assert.equal(await p.locator('#kbWrap').isVisible(),false);
  await p.selectOption('#kbSel','labels');await p.screenshot({path:`/tmp/typing-layout-${width}-${height}-${colorScheme}.png`});
  await c.close();count++;
 }
 const c=await b.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();await p.goto(process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html'));
 await p.evaluate(()=>{document.body.style.zoom='2';window.__tt.settings.retype=3;window.__tt.load('ab '.repeat(180).trim());fitPractice();});
 await p.evaluate(()=>{for(let i=0;i<220;i++){if(S.text[S.pos]!==' '&&i%10===0)window.dispatchEvent(new KeyboardEvent('keydown',{key:'x',code:'KeyX',bubbles:true}));window.dispatchEvent(new KeyboardEvent('keydown',{key:S.text[S.pos],code:'',bubbles:true}));}});
 const zoom=await p.evaluate(()=>{const c=document.querySelector('#text .c').getBoundingClientRect(),t=document.querySelector('#textBox').getBoundingClientRect(),k=document.querySelector('#kbWrap').getBoundingClientRect();return {visible:c.top>=t.top&&c.bottom<=t.bottom,noOverlap:k.top>=t.bottom,repeats:document.querySelectorAll('.rep').length};});
 assert.equal(zoom.visible,true);assert.equal(zoom.noOverlap,true);assert.ok(zoom.repeats>0);await c.close();count++;
 console.log(count+' layout viewports/themes/zoom scenarios passed');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
