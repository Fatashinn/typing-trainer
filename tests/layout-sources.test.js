// Independent comparison against vendored Unicode CLDR release-38 XML references.
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');require('../platform/layouts.js');
const codes={E00:'Backquote',E11:'Minus',E12:'Equal',D11:'BracketLeft',D12:'BracketRight',D13:'Backslash',C10:'Semicolon',C11:'Quote',B00:'IntlBackslash',B08:'Comma',B09:'Period',B10:'Slash',A03:'Space'};
for(let i=1;i<=10;i++)codes['E'+String(i).padStart(2,'0')]='Digit'+(i%10);
for(const [row,letters]of [['D','QWERTYUIOP'],['C','ASDFGHJKL'],['B','ZXCVBNM']])for(let i=0;i<letters.length;i++)codes[row+String(i+1).padStart(2,'0')]='Key'+letters[i];
const decode=s=>s.replace(/\\u\{([0-9a-f ]+)\}/gi,(_,n)=>n.split(' ').map(n=>String.fromCodePoint(parseInt(n,16))).join('')).replace(/&(lt|gt|amp|apos|quot);/g,(_,n)=>({lt:'<',gt:'>',amp:'&',apos:"'",quot:'"'}[n])).normalize('NFC');
let count=0;
for(const layout of Object.values(TT2.layouts)){
 const xml=fs.readFileSync(path.join(__dirname,'fixtures/keyboards',layout.id+'.xml'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
 assert.ok(xml.includes('<keyboard'));assert.ok(layout.source.url.includes('d1c59aeea6a26cd1018e164e8c470e4873925cac'));
 if(layout.id==='ru-pc-mac')continue; // Explicit legacy base/Shift contract, not an Option reference claim.
 for(const block of xml.matchAll(/<keyMap([^>]*)>([\s\S]*?)<\/keyMap>/g)){
  const mods=block[1].match(/modifiers="([^"]*)"/)?.[1]||'';
  const layer=!mods?'base':/^shift(?:\+caps\?)?(?: |$)/.test(mods)?'shift':mods==='opt'?'alt':mods.startsWith('opt+shift')?'shiftAlt':mods.startsWith('altR+shift')?'shiftAltGr':mods.startsWith('altR+caps?')?'altGr':null;
  if(!layer)continue;
  for(const map of block[2].matchAll(/<map\s+([^>]+)\/>/g)){
   const iso=map[1].match(/iso="([^"]*)"/)?.[1],raw=map[1].match(/\bto="([^"]*)"/)?.[1],code=codes[iso];
   if(!code||raw===undefined)continue;
   assert.equal(layout.keys[code]?.[layer],decode(raw),`${layout.id} ${iso} ${code} ${layer}`);count++;
  }
 }
}
console.log(count+' source XML key/layer comparisons passed');
