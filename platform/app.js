/* Registry-driven platform adapter. Legacy exercises retain their compatibility path. */
(function () {
  'use strict';
  const T = globalThis.TT2;
  const existingPlatform = store.get('tt.platform', null);
  const state = T.appState = existingPlatform || T.storage.create();
  if(!existingPlatform)state.preferences.geometry=settings.iso?'ISO':'ANSI';
  const pref = state.preferences;
  const messages = {
    ru: { unsupported:'Эта раскладка не может набрать необходимые символы: ', reference:'Карта по справочному источнику; актуальная macOS и физическая геометрия требуют ручной проверки.', type:'Печатайте здесь — составной ввод поддерживается', layout:'Проверьте выбранную системную раскладку. Приложение не переключает её автоматически.', wrong:'Ошибка.', shift:'Используйте Shift противоположной рукой.', paste:'Вставка во время измеряемого упражнения не засчитывается. Используйте поле собственного текста.', context:'Учебная платформа', hint:'Подсказки', free:'Собственный текст', unavailable:'Недоступно в выбранной раскладке', learn:'Как тренировать', practice:'Практика', challenge:'Испытание', skip:'Пропустить диагностику', skipped:'Диагностика пропущена. Все упражнения доступны.', diagnostic:'Диагностика', unknown:'Недостаточно данных', save:'Не удалось сохранить прогресс. Скачайте резервную копию до закрытия страницы.', ready:'Все упражнения открыты. Рекомендация не является блокировкой.', legacy:'Старые режимы 1.x сохранены; их статистика не считается подтверждённым мастерством 2.0.', missingPack:'Пакет из копии пока не установлен. Выберите доступные язык и раскладку; сохранённые идентификаторы не удалены.', modifierUnknown:'Промежуточные клавиши составного ввода не считаются ошибками. Фактический палец определить нельзя.' },
    en: { unsupported:'The selected layout cannot type these required characters: ', reference:'Reference layout data; current macOS and physical geometry still need manual verification.', type:'Type here — composed input is supported', layout:'Check the selected system input layout. The app cannot switch it automatically.', wrong:'Incorrect character.', shift:'Use Shift with the opposite hand.', paste:'Pasting does not count as measured practice. Use the custom text field.', context:'Learning platform', hint:'Hints', free:'Custom text', unavailable:'Unavailable in the selected layout', learn:'How to practise', practice:'Practice', challenge:'Challenge', skip:'Skip diagnosis', skipped:'Diagnosis skipped. Every exercise is available.', diagnostic:'Diagnosis', unknown:'Insufficient data', save:'Progress could not be saved. Download a backup before closing this page.', ready:'Every exercise is open. Recommendations never lock other exercises.', legacy:'Legacy 1.x exercises remain available; their statistics do not establish confirmed 2.0 mastery.', missingPack:'A package referenced by this backup is not installed. Choose an available language and layout; saved identifiers have not been deleted.', modifierUnknown:'Intermediate composition keys do not count as errors. The actual finger used cannot be detected.' }
  };
  for(const [locale, dictionary]of Object.entries(messages))T.i18n.extend(locale,Object.fromEntries(Object.entries(dictionary).map(([key,value])=>['platform.'+key,value])));
  T.i18n.extend('ru',{'platform.dataProtected':'Сохранённые данные повреждены и защищены от перезаписи. Скачайте исходную копию и восстановите данные перед учебными упражнениями. Режимы 1.x остаются доступны.'});
  T.i18n.extend('en',{'platform.dataProtected':'Saved data is damaged and protected from overwrite. Download the original backup and restore the data before measured learning. Legacy exercises remain available.'});
  const tr = key => T.i18n.t('platform.'+key);
  const tx = key => T.i18n.t(key);
  const save = () => { const ok = store.set('tt.platform', state); if (!ok) setMsg(tr('save'), 'warn'); return ok; };
  const context = () => ({ languageId: pref.languageId, layoutId: pref.layoutId, geometry: pref.geometry });
  const esc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const title = x => typeof x === 'object' ? x[pref.uiLanguage] || x.en || x.ru : x;
  let composition = false, echo = null, echoUntil = 0, lastKey = null, keyTrail = [], keyboardSignature = '';
  let sessionSpec = null;
  let freeDraft = pref.freeText || '';
  let learningWarning = '';
  function syncContext(){if(!S?.platform?.segments)return;const segment=S.platform.segments.find(x=>S.pos>=x.start&&S.pos<x.end)||S.platform.segments.at(-1);if(segment){S.platform.languageId=segment.languageId;S.platform.layoutId=segment.layoutId;}}
  function saveFreeProgress(){
    const free=S?.platform?.free;if(!free||pref.freeText!==free.source)return;
    const typed=S.pos-[...S.sourceInserted].filter(i=>i<S.pos).length;
    pref.freeOffset=typed>=free.length?free.next:free.start+typed;save();
  }
  function startFree(){
    const text=String(pref.freeText||'').normalize('NFC').replace(/\s+/gu,' ').trim();let off=pref.freeOffset||0;if(off>=text.length)off=0;
    while(text[off]===' ')off++;let end=Math.min(text.length,off+300);if(end<text.length){const split=text.lastIndexOf(' ',end);if(split>off+150)end=split;}
    let next=end;while(text[next]===' ')next++;
    const chunk=text.slice(off,end).trimEnd();start({text:chunk,context:context(),kind:'free',hintLevel:'demand',free:{source:pref.freeText,start:off,length:chunk.length,next:next>=text.length?0:next}});
  }
  const oldAdvance = advance;
  advance = function(now, layout) {
    if (!S?.platform) return oldAdvance(now, layout);
    const char = S.text[S.pos];
    if (char !== ' ' && (S.pos === 0 || S.text[S.pos - 1] === ' ')) S.wStartPos = S.pos;
    S.lastT = now; S.correct++; S.pos++; S.posErr = S.posLayout = S.posShift = false;
    if (char === ' ') { S.wordErr = false; S.wStartMs = S.previousWpmMs || 0; }
    else if (S.pos >= S.text.length || S.text[S.pos] === ' ') wordDone(now);
    saveFreeProgress();
    if (S.pos >= S.text.length) return finish();
    armReveal(); update();
  };
  T.i18n.setLanguage(pref.uiLanguage);
  pref.secondaryLanguageId ||= 'en';pref.secondaryLayoutId ||= 'en-us';

  const mapPanel = document.createElement('section');mapPanel.id='tab-map';mapPanel.className='hidden';
  const statsPanel=document.createElement('div');statsPanel.id='platformStats';statsPanel.className='panel';$('tab-stats').prepend(statsPanel);
  const practicePanel = document.createElement('section');practicePanel.id='tab-practice';practicePanel.className='hidden';
  document.querySelector('.wrap').append(mapPanel,practicePanel);
  for (const [id,key] of [['map','nav.map'],['practice','nav.practice']]) {
    const b=document.createElement('button');b.dataset.tab=id;b.dataset.i18n=key;b.textContent=tx(key);$('tabs').append(b);
  }
  const config=document.createElement('div');config.className='panel platform-config';
  $('tab-settings').prepend(config);
  const banner=document.createElement('div');banner.className='platform-banner hidden';$('tab-train').prepend(banner);
  const input=document.createElement('input');input.id='platformInput';input.type='text';input.autocomplete='off';input.autocapitalize='off';input.spellcheck=false;input.className='hidden';
  $('practiceStage').append(input);
  const style=document.createElement('style');style.textContent=`
    .platform-config{margin-bottom:12px}.platform-config label{display:inline-flex;flex-wrap:wrap;gap:6px;margin:6px 12px 6px 0}
    .platform-config select{max-width:100%}.platform-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}
    .platform-card{min-width:0}.platform-card p{margin:8px 0}.platform-card button{margin:3px}.platform-banner{margin-bottom:8px;font-size:14px}
    #platformInput{flex:0 0 auto;width:100%;min-width:0;margin-top:8px;padding:7px;background:var(--panel);border:1px solid var(--border);border-radius:6px}
    .platform-overview{margin:12px 0}.platform-grid h2{margin:0}.platform-help{font-size:13px;color:var(--muted)}
  `;document.head.append(style);

  const oldTab=setTab;
  setTab=function(t){oldTab(t);mapPanel.classList.toggle('hidden',t!=='map');practicePanel.classList.toggle('hidden',t!=='practice');if(t==='map'||t==='practice')render();};
  const oldStart=startLesson;
  startLesson=function(text){keyboardSignature='';kbLayout=null;kbIso=null;input.classList.add('hidden');banner.classList.add('hidden');return oldStart(text);};
  const oldSnapshot=timeSnapshot;
  timeSnapshot=function(status){const result=oldSnapshot(status);if(S?.platform)result.platformLesson=platformLesson(status);return result;};
  const oldRecord=recordLesson;
  recordLesson=function(status){const result=oldRecord(status);replay();render();return result;};
  const oldPause = pauseButton;
  pauseButton = function(){oldPause();if(S?.platform&&!manualPause)input.focus();};
  const oldFinish=finish;
  finish=function(){oldFinish();if(S.platform){S.onContinue=()=>S.platform.free?startFree():start(sessionSpec);$('againBtn').onclick=S.onContinue;input.value='';
    const summary=document.createElement('p');const reward=Object.entries(state.learning.processed).filter(([id])=>id===S.id||id.startsWith(S.id+'@')).reduce((n,[,r])=>n+r.xp,0);summary.textContent=tx('game.reward').replace('{xp}',reward)+(S.platform.kind.startsWith('diagnostic')?' · '+tx('diagnostic.note'):'');$('result').append(summary);
    const back=document.createElement('button');back.textContent=tx('nav.map');back.onclick=()=>setTab('map');$('result').append(back);
  }};
  const oldHintChange=$('hintSel').onchange;
  $('hintSel').onchange=e=>{if(!S?.platform)return oldHintChange(e);S.platform.hintLevel=e.target.value;e.target.blur();armReveal();update();};
  const oldHint=hintLevel;
  hintLevel=function(){return S?.platform?S.platform.hintLevel:oldHint();};
  const oldKeyboard=renderKeyboard;
  renderKeyboard=function(L){
    if(!S?.platform)return oldKeyboard(L);
    const layout=T.layouts[S.platform.layoutId],signature=layout.id+'-'+S.platform.geometry;
    if(keyboardSignature===signature)return;
    keyboardSignature=signature;const kb=$('kb');kb.textContent='';
    for(const k of geometry(S.platform.geometry==='ISO')){
      const el=document.createElement('div');el.className='key f-'+(FINGER[k.code]||'none');el.dataset.code=k.code;
      const gap=.06;Object.assign(el.style,{left:((k.x+gap)/KB_W*100)+'%',top:((k.y+gap)/KB_H*100)+'%',width:((k.w-2*gap)/KB_W*100)+'%',height:((k.h-2*gap)/KB_H*100)+'%'});
      const map=layout.keys[k.code];
      el.innerHTML=SPECIAL[k.code]|| (map?'<span class="m"><span>'+esc(map.shift||'')+'</span><span>'+esc(map.base||'')+'</span></span>'+((map.alt||map.altGr)?'<span class="alt">'+esc(map.alt||map.altGr)+'</span>':''):'');
      kb.append(el);
    }
    setCaps(capsState);
  };
  const oldHighlight=highlightNext;
  highlightNext=function(){
    if(!S?.platform)return oldHighlight();
    for(const el of $('kb').querySelectorAll('.next'))el.classList.remove('next');
    $('hint').textContent='';if(S.done||!S.text||hintLevel()==='none'||(hintLevel()==='demand'&&!S.reveal))return;
    const char=S.text[S.pos],route=T.layoutRoutes(S.platform.layoutId,char,S.platform.geometry)[0];if(!route)return;
    const sequence=route.sequence||[route];
    for(const step of sequence){const el=keyEl(step.code);if(el)el.classList.add('next');}
    const first=sequence[0];const finger=FINGER[first.code];
    const shift=first.modifiers?.includes('Shift')&&finger?(finger[0]==='l'?'ShiftRight':'ShiftLeft'):null;
    if(shift)keyEl(shift)?.classList.add('next');
    $('hint').textContent=char+' → '+sequence.map(step=>[...(step.modifiers||[]),step.code].join(' + ')).join(' → ')+(shift?' · '+shift:'');
  };
  const oldUpdate=update;
  update=function(){syncContext();oldUpdate();if(S?.platform){$('hintSel').value=S.platform.hintLevel;input.classList.remove('hidden');banner.classList.remove('hidden');banner.textContent=tr('context')+' · '+S.platform.languageId+' · '+T.layouts[S.platform.layoutId].name+' · '+S.platform.geometry;}};
  const oldReport=makeReport;
  makeReport=function(){return T.i18n.translateReport(oldReport());};
  window.__tt.report=()=>makeReport();

  function platformLesson(status){
    return {id:S.id,languageId:S.platform.languageId,layoutId:S.platform.layoutId,geometry:S.platform.geometry,
      activeMs:S.activeMs,wpmMs:S.wpmMs,completed:status==='completed',accuracy:S.keys?100*S.correct/S.keys:100,
      hintLevel:S.platform.hintLevel,events:S.platform.events,nodeId:S.platform.nodeId,kind:S.platform.kind,dayKey:dayKey(Date.now())};
  }
  function replay(){
    let changed=false;
    for(const h of history)if(h.platformLesson){try { const lesson=h.platformLesson;const groups=new Map();for(const event of lesson.events){const languageId=event.languageId||lesson.languageId,layoutId=event.layoutId||lesson.layoutId;const key=languageId+'|'+layoutId;if(!groups.has(key))groups.set(key,{languageId,layoutId,events:[]});groups.get(key).events.push(event);}for(const [key,group]of groups){const activeMs=group.events.reduce((n,e)=>n+(e.activeMs||0),0),wpmMs=group.events.reduce((n,e)=>n+(e.ms||0),0);const resultId=groups.size===1?lesson.id:lesson.id+'@'+key;if(Object.hasOwn(state.learning.processed,resultId))continue;const r=T.learning.record(state.learning,groups.size===1?lesson:{...lesson,...group,id:lesson.id+'@'+key,activeMs,wpmMs:Math.max(activeMs,wpmMs)});changed=changed||r.applied;} }  catch(e) { T.lastLearningError=e.message;learningWarning=tr('save'); setMsg(learningWarning,'warn'); }}
    if(changed)save();
  }
  function canType(text,c){return [...new Set(Array.from(text.normalize('NFC')))].filter(ch=>!T.layoutRoutes(c.layoutId,ch,c.geometry).length);}
  function start(spec){
    if(storageFrozen||['tt.platform','tt.history','tt.totals','tt.days'].some(k=>protectedKeys.has(k))){notice(tr('dataProtected'));return;}
    const c=spec.context||context();
    if(!T.languages[c.languageId]||!T.layouts[c.layoutId]){notice(tr('missingPack'));return;}
    const text=String(spec.text||'').normalize('NFC').replace(/\s+/gu,' ').trim();
    const missing=spec.segments?spec.segments.flatMap(segment=>canType(text.slice(segment.start,segment.end),{...c,...segment})):canType(text,c);if(!text||missing.length){notice(tr('unsupported')+missing.join(' '));return;}
    stopDaily();startLesson(text);S.mode='platform';S.platform={...c,nodeId:spec.nodeId||'free',kind:spec.kind||'free',hintLevel:spec.hintLevel||'demand',segments:spec.segments,free:spec.free,events:[]};
    sessionSpec={...spec,text,context:c};composition=false;echo=null;lastKey=null;keyTrail=[];keyboardSignature='';
    input.value='';input.placeholder=tr('type');input.setAttribute('aria-label',tr('type'));
    banner.textContent=tr('context')+' · '+title(T.languages[c.languageId].title||T.languages[c.languageId].name||c.languageId)+' · '+T.layouts[c.layoutId].name+' · '+c.geometry;
    S.mixedLayouts=false;renderText();setTab('train');update();fitPractice();input.focus();
  }
  function notice(text){let el=document.getElementById('platformNotice');if(!el){el=document.createElement('p');el.id='platformNotice';el.setAttribute('role','status');practicePanel.prepend(el);}el.textContent=text;setMsg(text,'warn');}
  function consume(text){
    if(!S?.platform||S.done||manualPause||windowAway||document.hidden||tab!=='train')return;
    for(const char of Array.from(String(text).normalize('NFC'))){
      if(S.done)break;if(S.platform.events.length>=20000){suspendPractice();setMsg(tr('save'),'warn');break;}syncContext();const beforeActive=S.activeMs;if(!contentTime())break;
      const exp=S.text[S.pos],routes=T.layoutRoutes(S.platform.layoutId,exp,S.platform.geometry);
      const composed=keyTrail.some(k=>k.key==='Dead')||composition;
      const actual=lastKey||{};
      const simpleRoutes=routes.filter(r=>!r.sequence);
      const physicalKnown=!!actual.code&&!composed&&simpleRoutes.length>0;
      const selectedMatches=!physicalKnown||T.routeMatches(S.platform.layoutId,exp,actual,S.platform.geometry);
      const need=physicalKnown&&actual.shiftKey?wrongShift(actual):null;
      const error=char!==exp||!selectedMatches||(need&&settings.strict);
      const event={char:exp,languageId:S.platform.languageId,layoutId:S.platform.layoutId,activeMs:S.activeMs-beforeActive,code:physicalKnown?(selectedMatches?actual.code:simpleRoutes[0]?.code||''):'',actualCode:actual.code||'',ms:S.wpmMs-(S.platform.previousMs||0),error:!!error,hinted:hintLevel()!=='none'&&(hintLevel()==='full'||!!S.reveal),repeated:S.rep.has(S.pos)||S.sourceInserted.has(S.pos)};
      if(physicalKnown&&actual.shiftKey&&(shiftL||shiftR)){event.shiftSide=FINGER[actual.code]?.[0]==='l'?'ShiftRight':'ShiftLeft';event.shiftError=!!need;}
      S.platform.previousMs=S.wpmMs;S.platform.events.push(event);S.keys++;
      if(error){
        if(!selectedMatches&&char===exp){if(!S.posLayout)S.layoutErr++;S.posLayout=true;setMsg(tr('layout'),'warn');}
        else if(need&&char===exp){if(!S.posShift)S.shiftErr++;S.posShift=true;setMsg(tr('shift'),'warn');}
        else {const expectedOnCode=actual.code&&T.layoutCharacter(S.platform.layoutId,actual);const mismatch=expectedOnCode===exp;if(mismatch){if(!S.posLayout)S.layoutErr++;S.posLayout=true;}setMsg(mismatch?tr('layout'):tr('wrong'),'err');}
        miss($('msg').textContent,$('msg').className);flash(actual.code,'bad');
      } else {
        if(need){S.shiftWarn++;S.posShift=true;setMsg(tr('shift'),'warn');}else setMsg('','');
        advance(performance.now(),S.platform.languageId);flash(actual.code,'ok');
      }
      checkpointTime();renderStreak();
    }
    keyTrail=[];lastKey=null;
  }
  // Native text events are authoritative for final characters. Dead keys/IME prefixes
  // never reach consume() as independent wrong characters.
  window.removeEventListener('keydown',onKeyDown);
  window.addEventListener('keydown',e=>{
    if(!S?.platform)return onKeyDown(e);
    trackKeyDown(e);
    if(e.code==='ShiftLeft')shiftL=true;if(e.code==='ShiftRight')shiftR=true;if(!e.shiftKey&&e.key!=='Shift'){shiftL=false;shiftR=false;}
    if(composition||e.isComposing)return;
    if(e.metaKey||(e.ctrlKey&&!e.getModifierState('AltGraph')&&!(e.altKey&&S.platform.layoutId.endsWith('-pc'))))return;
    if(S.done){if(e.key==='Enter'||e.key===' '){e.preventDefault();start(sessionSpec);}return;}
    if(e.key==='Escape'){e.preventDefault();start(sessionSpec);return;}
    if(e.repeat){e.preventDefault();return;}
    if(e.target!==input)return;
    if(e.key==='Dead'||e.key.length===1){echo=null;lastKey={code:e.code,key:e.key,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,getModifierState:n=>e.getModifierState(n)};keyTrail.push(lastKey);}
  });
  input.addEventListener('beforeinput',e=>{if(e.inputType.startsWith('delete')){e.preventDefault();return;}if(!composition&&!['insertText','insertCompositionText','insertFromComposition'].includes(e.inputType)){e.preventDefault();setMsg(tr('paste'),'warn');}});
  input.addEventListener('compositionstart',()=>{composition=true;});
  input.addEventListener('compositionend',e=>{const text=String(e.data||input.value).normalize('NFC');consume(text);composition=false;echo=text;echoUntil=performance.now()+100;input.value='';});
  input.addEventListener('input',e=>{if(composition||e.isComposing)return;const text=String(e.data||input.value).normalize('NFC');if(echo===text&&performance.now()<=echoUntil){echo=null;input.value='';return;}if(['insertText','insertCompositionText','insertFromComposition'].includes(e.inputType)||!e.inputType)consume(text);input.value='';});

  function controls(){
    config.innerHTML='';
    const select=(label,key,values)=>{const l=document.createElement('label');l.append(tx(label));const el=document.createElement('select');el.dataset.platformPreference=key;el.setAttribute('aria-label',tx(label));for(const [id,name]of values){const o=document.createElement('option');o.value=id;o.textContent=name;el.append(o);}el.value=pref[key];el.onchange=()=>{pref[key]=el.value;if(key==='geometry'){settings.iso=el.value==='ISO';saveSettings();$('optIso').checked=settings.iso;}if(key==='uiLanguage')T.i18n.setLanguage(el.value);save();render();};l.append(el);config.append(l);};
    select('settings.uiLanguage','uiLanguage',[['ru','Русский'],['en','English']]);
    select('settings.typingLanguage','languageId',Object.values(T.languages).map(l=>[l.id,title(l.title||l.name||l.id)]));
    select('settings.inputLayout','layoutId',Object.values(T.layouts).map(l=>[l.id,l.name]));
    select('settings.typingLanguage','secondaryLanguageId',Object.values(T.languages).map(l=>[l.id,'② '+title(l.title||l.name||l.id)]));
    select('settings.inputLayout','secondaryLayoutId',Object.values(T.layouts).map(l=>[l.id,'② '+l.name]));
    select('settings.geometry','geometry',[['ANSI','ANSI'],['ISO','ISO — reference / experimental']]);
    const p=document.createElement('p');p.className='platform-help';p.textContent=(T.layouts[pref.layoutId]?.name||pref.layoutId)+' ['+({reference:pref.uiLanguage==='en'?'reference':'справочная','legacy-tested':pref.uiLanguage==='en'?'legacy tested':'проверено в 1.x',experimental:pref.uiLanguage==='en'?'experimental':'экспериментальная'}[T.layouts[pref.layoutId]?.support]||'—')+']. '+tr('reference')+' '+tr('modifierUnknown');config.append(p);
  }
  function button(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;return b;}
  function material(node,kind){
    if(node.type==='switching'){
      const primary=context(),secondary={...primary,languageId:pref.secondaryLanguageId||'en',layoutId:pref.secondaryLayoutId||'en-us'};
      const sections=[];for(const c of [primary,secondary,primary]){
        const words=(T.languages[c.languageId]?.words||[]).filter(word=>canType(word,c).length===0).slice(0,8);
        if(!words.length){notice(tr('unsupported')+c.languageId+' / '+c.layoutId);return;}
        sections.push({c,text:words.join(' ')});
      }
      let text='';const segments=[];for(const section of sections){const start=text.length;if(text)text+=' ';text+=section.text;segments.push({start,end:text.length,...section.c});}
      start({text,context:primary,segments,nodeId:node.id,kind,hintLevel:kind==='challenge'?'none':'demand'});return;
    }
    const c={...context(),languageId:node.languageId||pref.languageId};c.seed=state.learning.nodes[c.languageId+'|'+c.layoutId+'|'+node.id]?.lessons||0;const weak=Array.from(T.languages[c.languageId]?.alphabet||'').map(char=>({char,s:T.learning.skill(state.learning,c,char)})).filter(x=>x.s.state!=='insufficient').sort((a,b)=>(1-(b.s.accuracy||0))-(1-(a.s.accuracy||0))||(b.s.latencyMs||0)-(a.s.latencyMs||0)).slice(0,4).map(x=>x.char);c.weakChars=weak;const m=T.learning.material(node,kind,c);if(!m.available){notice(tr('unsupported')+(m.missing||[]).join(' '));return;}start({text:m.text,context:c,nodeId:node.id,kind,hintLevel:kind==='challenge'?'none':'demand'});}
  function render(){
    MODE_NAMES.platform=tr('context');
    controls();input.placeholder=tr('type');input.setAttribute('aria-label',tr('type'));
    mapPanel.textContent='';practicePanel.textContent='';
    const overview=document.createElement('div');overview.className='panel platform-overview';
    overview.textContent=tx('game.xp')+': '+state.learning.xp+' · '+tx('game.level')+': '+(T.learning.level?T.learning.level(state.learning.xp):1)+' · '+tx('game.achievements')+': '+Object.keys(state.learning.achievements||{}).length;
    mapPanel.append(overview);const contextText=()=>pref.languageId+' · '+(T.layouts[pref.layoutId]?.name||pref.layoutId)+' · '+pref.geometry;const contextMap=document.createElement('p');contextMap.textContent=contextText()+' ';contextMap.append(button(tx('nav.settings'),()=>setTab('settings')));mapPanel.append(contextMap);
    const awards = { 'first-practice': ['Первая осмысленная практика','First meaningful practice'], 'careful-practice':['Точная практика','Careful practice'], 'three-practice-days':['Три дня практики','Three practice days'], 'bilingual-practice':['Практика на двух языках','Practice in two languages'], 'first-challenge':['Первое испытание','First challenge'] };
    const awardList=document.createElement('ul');
    for(const id of Object.keys(state.learning.achievements||{})){const li=document.createElement('li');li.textContent=(awards[id]||[id,id])[pref.uiLanguage==='en'?1:0];awardList.append(li);}
    if(!awardList.children.length){const li=document.createElement('li');li.textContent=tx('game.noAchievements');awardList.append(li);}mapPanel.append(awardList);
    statsPanel.textContent='';const statsTitle=document.createElement('h2');statsTitle.textContent=tx('skill.symbols')+' · '+pref.languageId+' · '+pref.layoutId;statsPanel.append(statsTitle);
    const statsWrap=document.createElement('div');statsWrap.className='tscroll';const table=document.createElement('table');
    const head=document.createElement('tr');for(const text of [tx('skill.symbols'),tx('skill.attempts'),tx('skill.accuracy'),tx('skill.latency'),tx('skill.confidence')]){const th=document.createElement('th');th.textContent=text;head.append(th);}table.append(head);
    for(const char of Array.from(T.languages[pref.languageId]?.alphabet||'')){
      const skill=T.learning.skill(state.learning,context(),char);const row=document.createElement('tr');
      for(const text of [char,skill.attempts,skill.accuracy==null?'—':Math.round(skill.accuracy*100)+'%',skill.latencyMs==null?'—':Math.round(skill.latencyMs)+' ms',tx('skill.'+({insufficient:'unknown',improving:'progressing'}[skill.state]||skill.state))]){const td=document.createElement('td');td.textContent=text;row.append(td);}table.append(row);
    }statsWrap.append(table);statsPanel.append(statsWrap);
    const physical=document.createElement('p');const textSkill=T.learning.skill(state.learning,context(),'text','text');physical.textContent=tx('skill.physical')+': '+Object.keys(state.learning.skills.physical).length+' · '+tx('skill.language')+': '+tx('skill.'+({insufficient:'unknown',improving:'progressing'}[textSkill.state]||textSkill.state));statsPanel.append(physical);
    const physicalDetail=document.createElement('details'),physicalSummary=document.createElement('summary');physicalSummary.textContent=tx('skill.physical');physicalDetail.append(physicalSummary);
    for(const code of Object.keys(state.learning.skills.physical).sort()){const metric=T.learning.skill(state.learning,context(),code,'physical');const row=document.createElement('p');row.textContent=code+' · '+metric.attempts+' · '+tx('skill.'+({insufficient:'unknown',improving:'progressing'}[metric.state]||metric.state));physicalDetail.append(row);}statsPanel.append(physicalDetail);
    if(learningWarning){const warning=document.createElement('p');warning.textContent=learningWarning;statsPanel.append(warning);}
    const note=document.createElement('p');note.textContent=tr('ready');mapPanel.append(note);
    const c=context();let rec=[];try{rec=T.learning.recommend(state.learning,c);}catch(e){notice(e.message);}
    const recIds=new Set(rec.map(r=>r.nodeId));const grid=document.createElement('div');grid.className='platform-grid';
    for(const node of T.learning.nodes(c).sort((a,b)=>Number(b.languageId===c.languageId)-Number(a.languageId===c.languageId)||Number(recIds.has(b.id))-Number(recIds.has(a.id)))){
      const card=document.createElement('article');card.className='panel platform-card';card.dataset.nodeId=node.id;
      const h=document.createElement('h2');h.textContent=title(node.title);card.append(h);
      const nc={...c,languageId:node.languageId||c.languageId};
      const result=T.learning.nodeStatus(state.learning,node,nc);const status=typeof result==='string'?result:result.state||'insufficient';
      const p=document.createElement('p');p.textContent=(recIds.has(node.id)?tx('map.recommended')+' · ':'')+tx('skill.'+({insufficient:'unknown',improving:'progressing'}[status]||status));p.textContent+=' · '+result.observed+'/'+result.total;const nodeProgress=state.learning.nodes[nc.languageId+'|'+nc.layoutId+'|'+node.id];if(nodeProgress)p.textContent+=' · '+tr('challenge')+': '+nodeProgress.challenges;card.append(p);
      card.append(button(tr('learn'),()=>{let help=card.querySelector('.platform-help');if(!help){help=document.createElement('p');help.className='platform-help';card.append(help);}help.textContent=title(node.description||node.title)+' · '+Array.from(node.targetChars||'').join(' ')+' · '+title(node.difficultyAdvice)+' · ≥'+node.criteria.attempts+' / ≥'+node.criteria.lessons+' / '+Math.round(node.criteria.accuracy*100)+'%';}));
      card.append(button(tr('practice'),()=>material(node,'practice')),button(tr('challenge'),()=>material(node,'challenge')));grid.append(card);
    }
    mapPanel.append(grid);
    const contextPractice=document.createElement('p');contextPractice.textContent=contextText()+' ';contextPractice.append(button(tx('nav.settings'),()=>setTab('settings')));practicePanel.append(contextPractice);
    const titleEl=document.createElement('h2');titleEl.textContent=tr('diagnostic');practicePanel.append(titleEl);
    for(const full of [false,true]){practicePanel.append(button(tx(full?'diagnostic.full':'diagnostic.quick'),()=>{const m=T.learning.diagnostic(context(),full);if(!m.available){notice(tr('unsupported')+(m.missing||[]).join(' '));return;}start({text:m.text,context:context(),nodeId:'diagnostic',kind:full?'diagnostic-full':'diagnostic-quick',hintLevel:'none'});if(m.partial)setMsg(tr('unsupported')+m.missing.join(' '),'warn');}));practicePanel.lastElementChild.dataset.diagnostic=full?'full':'quick';}
    practicePanel.append(button(tr('skip'),()=>{pref.diagnosticSkipped=true;save();notice(tr('skipped'));}));practicePanel.lastElementChild.dataset.diagnostic='skip';
    const p=document.createElement('p');p.textContent=tr('legacy');practicePanel.append(p);
    const label=document.createElement('label');label.textContent=tr('free');const area=document.createElement('textarea');area.id='platformFreeText';area.value=freeDraft;area.maxLength=20000;area.oninput=()=>{freeDraft=area.value;};area.onchange=()=>{if(pref.freeText!==freeDraft)pref.freeOffset=0;pref.freeText=freeDraft;save();};label.append(area);practicePanel.append(label);
    practicePanel.append(button(tr('practice'),()=>{if(pref.freeText!==area.value)pref.freeOffset=0;pref.freeText=area.value;save();startFree();}));
  }
  T.app={start,context,render,replay,consume};
  MODE_NAMES.platform=tr('context');
  replay();render();T.i18n.init(document);
})();
