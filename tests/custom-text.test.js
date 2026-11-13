const assert=require('node:assert/strict');
const {chromium}=require('playwright');const path=require('node:path');
(async()=>{const b=await chromium.launch();let passed=0;try{
 for(const text of ['a'.repeat(299)+'b','a'.repeat(300)+'b','a'.repeat(301)+'b','a'.repeat(300)+'b'+'c'.repeat(300),'abc '.repeat(160),'ab cd']){
  const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html'));
  const result=await p.evaluate(text=>{
   store.set(K_CUSTOM,{text,offset:0});settings.mode='custom';settings.retype=0;startLesson();
   let typed='';const chunks=[];
   do {
    chunks.push(S.text);typed+=S.text;
    for(let i=0,n=S.text.length;i<n;i++)window.dispatchEvent(new KeyboardEvent('keydown',{key:S.text[S.pos],code:'',bubbles:true}));
    if(store.get(K_CUSTOM,{}).offset===0)break;
    startLesson();
   }while(chunks.length<20);
   return {typed,chunks,offset:store.get(K_CUSTOM,{}).offset};
  },text);
  assert.equal(result.typed.replace(/ /g,''),text.replace(/ /g,''));assert.equal(result.offset,0);assert.ok(result.chunks.every(x=>x.length<=300));
  await c.close();passed++;
 }
 const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html'));
 await p.evaluate(()=>{store.set(K_CUSTOM,{text:'abc def',offset:0});setMode('custom');settings.retype=0;});
 assert.equal(await p.evaluate(()=>store.get(K_CUSTOM,{}).offset),0,'generation alone does not skip a chunk');
 await p.keyboard.type('ab');assert.equal(await p.evaluate(()=>store.get(K_CUSTOM,{}).offset),2);
 await p.reload();assert.equal(await p.evaluate(()=>S.text),'c def','reload resumes at next original character');
 await p.evaluate(()=>{store.set(K_CUSTOM,{text:'ab cd',offset:0});settings.retype=2;startLesson();});
 await p.keyboard.type('axb');await p.keyboard.type(' ab');
 assert.equal(await p.evaluate(()=>store.get(K_CUSTOM,{}).offset),2,'repeated characters and separators do not consume source');
 await c.close();passed+=2;console.log(passed+' custom-text scenarios passed');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
