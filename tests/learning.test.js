// Pure deterministic model tests: no browser, storage or network.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const sandbox={Date,Math,Set,Number,Object,String,Array,Error};sandbox.globalThis=sandbox;
vm.createContext(sandbox);
for(const file of ['platform/languages.js','platform/layouts.js'])if(fs.existsSync(path.join(root,file)))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
if(!sandbox.TT2)sandbox.TT2={};
if(!sandbox.TT2.languages)sandbox.TT2.languages=Object.fromEntries(['ru','en','fr','de'].map(id=>[id,{id,alphabet:'abcdef',frequency:'abcdef',words:['abc','def','cab','fed'],bigrams:['ab','cd'],sentences:['abc def.']} ]));
if(!sandbox.TT2.layoutRoutes)sandbox.TT2.layoutRoutes=(_layout,c)=>c==='☃'?[]:[{code:'KeyA',modifiers:[]}];
vm.runInContext(fs.readFileSync(path.join(root,'platform/learning.js'),'utf8'),sandbox);
const L=sandbox.TT2.learning;
let passed=0;
function test(name,fn){fn();passed++;console.log('ok '+name)}
const context={languageId:'en',layoutId:'en-us'};
const now=new Date(2026,10,13,12).getTime();
function lesson(id,options={}){
 return {id,...context,activeMs:30000,wpmMs:40000,completed:true,hintLevel:'none',kind:'practice',events:Array.from({length:30},()=>({char:'a',code:'KeyA',ms:400,error:false,hinted:false,repeated:false})),...options};
}
test('empty state has no fictional XP or known skills',()=>{
 const s=L.emptyState();L.validate(s);assert.equal(s.xp,0);assert.equal(L.skill(s,context,'a').state,'insufficient');assert.equal(L.level(0),1);
});
test('one successful lesson is insufficient evidence',()=>{
 const s=L.emptyState();L.record(s,lesson('one'),now);assert.equal(L.skill(s,context,'a','character',now).state,'insufficient');
});
test('independent lessons, accuracy and latency govern mastery',()=>{
 const s=L.emptyState();for(let i=0;i<3;i++)L.record(s,lesson('lesson'+i),now+i*1000);
 assert.equal(L.skill(s,context,'a','character',now+5000).state,'mastered');
 assert.equal(L.skill(s,context,'a','character',now+8*86400000).state,'review');
 const dirty=L.emptyState();for(let i=0;i<3;i++)L.record(dirty,lesson('error'+i,{events:Array.from({length:20},()=>({char:'a',code:'KeyA',ms:400,error:true}))}),now+i*1000);
 assert.equal(L.skill(dirty,context,'a','character',now+5000).state,'learning');
});
test('hinted and immediate repeated input never masquerades as mastery',()=>{
 const s=L.emptyState();for(let i=0;i<6;i++)L.record(s,lesson('hints'+i,{events:Array.from({length:30},()=>({char:'a',code:'KeyA',ms:100,hinted:i%2===0,repeated:i%2===1}))}),now+i*1000);
 const skill=L.skill(s,context,'a');assert.equal(skill.state,'insufficient');assert.equal(skill.attempts,0);
});
test('layout, text language, physical key and bigram skills are separate',()=>{
 const s=L.emptyState();for(let i=0;i<3;i++)L.record(s,lesson('separate'+i,{events:Array.from({length:30},(_,k)=>({char:k%2?'b':'a',code:k%2?'KeyB':'KeyA',ms:400}))}),now+i*1000);
 assert.equal(L.skill(s,{languageId:'fr',layoutId:'fr-pc'},'a').state,'insufficient');
 assert.equal(L.skill(s,{languageId:'fr',layoutId:'en-us'},'a').state,'mastered');
 assert.equal(L.skill(s,{languageId:'fr',layoutId:'en-us'},'text','text').state,'insufficient');
 assert.equal(L.skill(s,{languageId:'fr',layoutId:'fr-pc'},'KeyA','physical').state,'mastered');
 assert.equal(L.skill(s,context,'ab','bigram').state,'mastered');
});
test('XP is idempotent across clone/import/reload',()=>{
 const s=L.emptyState();const first=L.record(s,lesson('uuid'),now);assert.ok(first.xp>0);const xp=s.xp;
 const restored=JSON.parse(JSON.stringify(s));L.validate(restored);assert.equal(L.record(restored,lesson('uuid'),now+1000).applied,false);assert.equal(restored.xp,xp);
});
test('daily caps stop trivial node farming and excessive duration',()=>{
 const s=L.emptyState();for(let i=0;i<100;i++)L.record(s,lesson('farm'+i,{nodeId:'en-foundation'}),now+i*1000);
 assert.equal(s.xp,L.THRESHOLDS.xpPerNodePerDay);
 const other=L.emptyState();for(let i=0;i<100;i++)L.record(other,lesson('many'+i,{nodeId:'node'+i}),now+i*1000);
 assert.ok(other.xp<=L.THRESHOLDS.xpPerDay);L.validate(other);
});
test('idle, tiny, incomplete and repeated-only lessons earn no XP',()=>{
 for(const options of [{activeMs:0},{activeMs:1000},{completed:false},{events:Array.from({length:30},()=>({char:'a',repeated:true,ms:100}))}]){
  const s=L.emptyState();assert.equal(L.record(s,lesson('no-reward',options),now).xp,0);
 }
});
test('consolidation requires distinct calendar days',()=>{
 const s=L.emptyState();for(let i=0;i<6;i++)L.record(s,lesson('day'+i,{dayKey:'2026-11-'+String(11+Math.floor(i/2))}),now+i*1000);
 assert.equal(L.skill(s,context,'a','character',now+7000).state,'consolidated');
});
test('all 42 nodes unlocked and include both learning and challenge metadata',()=>{
 const nodes=L.nodes(context);assert.equal(nodes.length,42);assert.ok(nodes.every(n=>n.unlocked&&n.criteria&&n.description&&n.difficultyAdvice));assert.equal(nodes.filter(n=>n.languageId==='fr').length,6);assert.equal(nodes.filter(n=>n.group==='digits').length,6);
 const rec=L.recommend(L.emptyState(),context,now);assert.equal(rec.length,3);assert.ok(rec.every(r=>nodes.some(n=>n.id===r.nodeId)));
});
test('unsupported essential characters are explicit, not silently stripped',()=>{
 const result=L.material({id:'snow',group:'symbols',type:'symbols',targetChars:'☃'},'practice',context);
 assert.equal(result.available,false);assert.equal(result.text,'');assert.ok(result.missing.includes('☃'));
});
test('NFC composition updates one symbol and malformed state is rejected',()=>{
 const s=L.emptyState();L.record(s,lesson('accent',{languageId:'fr',events:[{char:'e\u0301',code:'KeyE',ms:500}]}),now);
 assert.equal(L.skill(s,{languageId:'fr',layoutId:'en-us'},'é').attempts,1);
 for(const bad of [{}, {...L.emptyState(),version:99},{...L.emptyState(),xp:-1}])assert.throws(()=>L.validate(bad));
});
test('prototype-like node identifiers do not corrupt counters',()=>{
 const s=L.emptyState();L.record(s,lesson('safe',{nodeId:'toString'}),now);L.validate(s);assert.ok(Number.isFinite(s.xp));
});
test('adaptive practice focuses observed target weakness without changing challenge',()=>{
 const node=L.nodes(context).find(n=>n.id==='en-fluency');const normal=L.material(node,'practice',context).text;
 const focused=L.material(node,'practice',{...context,weakChars:['z']}).text;
 assert.ok((focused.match(/z/g)||[]).length>(normal.match(/z/g)||[]).length);
 assert.equal(L.material(node,'challenge',context).text,L.material(node,'challenge',{...context,weakChars:['z']}).text);
});
test('a new language package adds a branch without engine edits',()=>{
 sandbox.TT2.registerLanguage({id:'xx',version:1,title:'Example',alphabet:'abc',frequency:'bac',words:['ab','cab'],bigrams:['ab'],sentences:['Ab cab.'],punctuation:['.'],tasks:['letters']});
 const nodes=L.nodes(context);assert.equal(nodes.length,48);assert.equal(nodes.filter(n=>n.languageId==='xx').length,6);
});
test('single-letter practice cannot establish whole-language text mastery',()=>{const s=L.emptyState();for(let i=0;i<6;i++)L.record(s,lesson('limited'+i),now+i*1000);const text=L.skill(s,context,'text','text',now+7000);assert.equal(text.state,'improving');assert.ok(text.coverage<1);});
console.log(passed+' learning model tests passed');
