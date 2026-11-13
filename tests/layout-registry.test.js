const assert=require('node:assert/strict');require('../platform/languages.js');require('../platform/layouts.js');
let cases=0;
for(const definition of Object.values(TT2.layouts)){
 assert.equal(definition.version,1);assert.ok(definition.source.url);assert.ok(definition.geometry.ANSI);assert.ok(definition.geometry.ISO);
 for(const geometry of ['ANSI','ISO'])for(const char of TT2.availableCharacters(definition.id,geometry)){
  assert.equal(char,char.normalize('NFC'));assert.equal(Array.from(char).length,1);
  const routes=TT2.layoutRoutes(definition.id,char,geometry);assert.ok(routes.length);
  for(const route of routes){
   if(geometry==='ANSI')assert.notEqual(route.code,'IntlBackslash');
   if(route.sequence){assert.equal(route.sequence.length,2);assert.equal(route.sequence[0].dead,true);}
   else {
    const mods=route.modifiers;const event={code:route.code,key:char,shiftKey:mods.includes('Shift'),altKey:mods.includes('Alt')||mods.includes('AltGr'),ctrlKey:mods.includes('AltGr'),getModifierState:name=>name==='AltGraph'&&mods.includes('AltGr')};
    assert.equal(TT2.layoutCharacter(definition.id,event),char,`${definition.id} ${route.code} ${mods}`);assert.equal(TT2.routeMatches(definition.id,char,event,geometry),true);
   }cases++;
  }
 }
}
for(const [layout,char,code,modifier] of [['ru-pc-mac',':','Digit6','Shift'],['ru-mac',',','Digit6','Shift'],['en-us','@','Digit2','Shift'],['fr-pc','a','KeyQ',null],['de-pc','z','KeyY',null]]){
 assert.ok(TT2.layoutRoutes(layout,char).some(r=>r.code===code&&(!modifier||r.modifiers.includes(modifier))),`${layout} ${char}`);
}
assert.ok(TT2.layoutRoutes('fr-pc','ê').some(r=>r.sequence));assert.ok(TT2.layoutRoutes('de-pc','ä').some(r=>r.code==='Quote'));
assert.equal(Object.keys(TT2.languages).length,4);for(const pack of Object.values(TT2.languages)){assert.ok(pack.words.length>=40);assert.ok(pack.sentences.length>=8);assert.ok(pack.bigrams.length);assert.ok(pack.tasks.length);}
assert.throws(()=>TT2.registerLayout(TT2.layouts['en-us']));assert.throws(()=>TT2.registerLanguage(TT2.languages.en));
const fake={id:'test-layout',version:1,name:'Test',languages:['en'],source:{url:'test-fixture'},geometry:{ANSI:'test',ISO:'test'},keys:{KeyA:{base:'a',shift:'A'}}};TT2.registerLayout(fake);assert.equal(TT2.layoutRoutes(fake.id,'a')[0].code,'KeyA');
console.log(cases+' reference routes/geometry combinations passed');
