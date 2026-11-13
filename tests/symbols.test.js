const assert=require('node:assert/strict');const {chromium}=require('playwright');const path=require('node:path');
(async()=>{const b=await chromium.launch();try{const p=await b.newPage();await p.goto(process.env.TT_TEST_URL||'file://'+path.resolve(__dirname,'..','index.html'));
const result=await p.evaluate(()=>{
 let count=0;const failures=[];
 for(const L of ['RU','EN']){
  const toggles=SYM_TOGGLES[L];
  // Every single toggle, every pair and all enabled at each density.
  const sets=[[],...toggles.map(t=>[t]),toggles,...toggles.flatMap((t,i)=>toggles.slice(i+1).map(u=>[t,u]))];
  for(const enabled of sets){
   settings['sym'+L]=Object.fromEntries(toggles.map(t=>[t,enabled.includes(t)]));
   settings.density=1+count%4;
   const text=generate('sym'+L);count++;
   if(!enabled.length){if(text!=='')failures.push('empty');continue;}
   if(text.length<200||text.length>300||!symLessonOk(text,enabled)||![...text].every(typeable))failures.push({L,enabled,text});
   const allowed=new Set(enabled.flatMap(toggleChars));
   const extra=[...text].filter(c=>!isLetter(c)&&c!==' '&&!allowed.has(c));
   if(extra.length)failures.push({L,enabled,extra,text});
  }
 }
 // An adversarial RNG must not turn coverage into a probabilistic promise.
 const random=Math.random;Math.random=()=>0;
 try{settings.symEN=Object.fromEntries(SYM_TOGGLES.EN.map(t=>[t,true]));const text=generate('symEN');if(text.length<200||text.length>300||!symLessonOk(text,SYM_TOGGLES.EN))failures.push({adversarial:text});count++;}finally{Math.random=random;}
 return {count,failures:failures.slice(0,5)};
});assert.deepEqual(result.failures,[]);console.log(result.count+' symbol combinations passed');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
