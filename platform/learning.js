/* Typing Trainer learning model. Pure local data: no DOM, storage or network. */
(function (global) {
  'use strict';
  const TT = global.TT2 = global.TT2 || {};
  const THRESHOLDS = Object.freeze({
    knownAttempts: 8, knownLessons: 2, textCoverage: 1,
    masteredAttempts: 24, masteredLessons: 3, masteredAccuracy: .97, masteredLatencyMs: 700, masteredLatencySamples: 5,
    consolidatedAttempts: 60, consolidatedLessons: 6, consolidatedDays: 3, consolidatedAccuracy: .98, consolidatedLatencyMs: 550,
    reviewDays: 7, consolidatedReviewDays: 14,
    minimumXpActiveMs: 15000, minimumXpCharacters: 20, minimumXpAccuracy: .80,
    xpPerNodePerDay: 30, xpPerDay: 150, rewardedActiveMsPerDay: 20 * 60000,
    maximumProcessedLessons: 20000, maximumStateBytes: 3 * 1024 * 1024
  });
  const STATES = ['insufficient', 'learning', 'improving', 'mastered', 'consolidated', 'review'];
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const finite = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
  const assert = (condition, message) => { if (!condition) throw new Error('Learning: ' + message); };
  const normalize = text => String(text).normalize('NFC');
  const chars = text => Array.from(normalize(text));
  const dayKey = now => {
    const d = new Date(now);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  const identifier = value => typeof value === 'string' && value.length > 0 && value.length <= 160 && !['__proto__', 'prototype', 'constructor'].includes(value);
  function emptyState() {
    return { version: 1, xp: 0, processed: {}, perDay: {}, skills: { physical: {}, character: {}, bigram: {}, text: {} }, nodes: {}, achievements: {} };
  }
  function validate(state) {
    assert(object(state) && state.version === 1, 'unsupported state version');
    assert(finite(state.xp), 'invalid XP');
    for (const name of ['processed', 'perDay', 'skills', 'nodes', 'achievements']) assert(object(state[name]), 'invalid ' + name);
    assert(Object.keys(state.processed).length <= THRESHOLDS.maximumProcessedLessons, 'processed history too large');
    for (const [id, result] of Object.entries(state.processed)) {
      assert(identifier(id) && object(result) && finite(result.xp) && finite(result.at), 'invalid processed lesson');
      assert(identifier(result.languageId) && identifier(result.layoutId), 'invalid processed context');
    }
    for (const [date, entry] of Object.entries(state.perDay)) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && object(entry) && object(entry.nodes), 'invalid day');
      assert(finite(entry.xp) && finite(entry.activeMs), 'invalid daily counters');
      for (const [node, xp] of Object.entries(entry.nodes)) assert(identifier(node) && finite(xp), 'invalid daily node');
    }
    for (const kind of ['physical', 'character', 'bigram', 'text']) {
      assert(object(state.skills[kind]) && Object.keys(state.skills[kind]).length <= 30000, 'invalid skill collection');
      for (const [token, s] of Object.entries(state.skills[kind])) {
        assert(identifier(token) && object(s), 'invalid skill');
        for (const field of ['attempts','errors','rawAttempts','hinted','repeated','latencyMs','latencySamples','lastAt']) assert(finite(s[field]), 'invalid skill ' + field);
        assert(s.errors <= s.attempts && s.attempts <= s.rawAttempts, 'inconsistent skill counters');
        assert(Array.isArray(s.lessons) && s.lessons.length <= 10 && s.lessons.every(identifier), 'invalid skill lessons');
        assert(Array.isArray(s.days) && s.days.length <= 7 && s.days.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d)), 'invalid skill days');
      }
    }
    for (const [id, n] of Object.entries(state.nodes)) {
      assert(identifier(id) && object(n), 'invalid node');
      for (const key of ['lessons','challenges','lastAt','activeMs']) assert(finite(n[key]), 'invalid node counter');
    }
    for (const [id, at] of Object.entries(state.achievements)) assert(identifier(id) && finite(at), 'invalid achievement');
    // Reject prototype-sensitive or oversized imported trees while preserving unknown ordinary metadata.
    function tree(value, depth) {
      assert(depth <= 12, 'state nesting too deep');
      if (typeof value === 'number') assert(finite(value), 'invalid number');
      if (value && typeof value === 'object') for (const key of Object.keys(value)) {
        assert(!['__proto__','prototype','constructor'].includes(key), 'unsafe property'); tree(value[key], depth + 1);
      }
    }
    tree(state, 0);
    assert(serializedBytes(state)<=THRESHOLDS.maximumStateBytes, 'state too large');
    return state;
  }
  function metricKey(context, token, kind) {
    if (kind === 'physical') return token;
    if (kind === 'text') return context.languageId + '|' + context.layoutId;
    return context.layoutId + '|' + normalize(token);
  }
  function emptyMetric() {
    return { attempts: 0, errors: 0, rawAttempts: 0, hinted: 0, repeated: 0, latencyMs: 0, latencySamples: 0, lessons: [], days: [], lastAt: 0 };
  }
  function observe(state, context, token, kind, event, lesson, date, now) {
    if (!token) return;
    const key = metricKey(context, token, kind);
    if (!identifier(key)) return;
    const table = state.skills[kind];
    if (!own(table, key)) table[key] = emptyMetric();
    const s = table[key];
    s.rawAttempts++;
    const hinted = !!event.hinted || lesson.hintLevel === 'full';
    if (hinted) s.hinted++;
    if (event.repeated) s.repeated++;
    if (hinted || event.repeated) return; // Practice is useful; evidence of independent skill is different.
    s.attempts++; if (event.error) s.errors++;
    if (!event.error && finite(event.ms) && event.ms > 0 && event.ms <= 2000) { s.latencyMs += event.ms; s.latencySamples++; }
    if (!s.lessons.includes(lesson.id)) s.lessons = [...s.lessons, lesson.id].slice(-10);
    if (!s.days.includes(date)) s.days = [...s.days, date].slice(-7);
    s.lastAt = now;
  }
  function metricStatus(s, now, thresholds = THRESHOLDS) {
    if (!s) return { state: 'insufficient', attempts: 0, accuracy: null, latencyMs: null, lessons: 0, days: 0, confidence: 'unknown' };
    const accuracy = s.attempts ? 1 - s.errors / s.attempts : null;
    const latency = s.latencySamples ? s.latencyMs / s.latencySamples : null;
    let status = 'insufficient';
    if (s.attempts >= thresholds.knownAttempts && s.lessons.length >= thresholds.knownLessons) status = accuracy >= .90 ? 'improving' : 'learning';
    if (s.attempts >= thresholds.masteredAttempts && s.lessons.length >= thresholds.masteredLessons && accuracy >= thresholds.masteredAccuracy && s.latencySamples >= thresholds.masteredLatencySamples && latency <= thresholds.masteredLatencyMs) status = 'mastered';
    if (status === 'mastered' && s.attempts >= thresholds.consolidatedAttempts && s.lessons.length >= thresholds.consolidatedLessons && s.days.length >= thresholds.consolidatedDays && accuracy >= thresholds.consolidatedAccuracy && latency <= thresholds.consolidatedLatencyMs) status = 'consolidated';
    if (['mastered','consolidated'].includes(status) && now - s.lastAt >= (status === 'consolidated' ? thresholds.consolidatedReviewDays : thresholds.reviewDays) * 86400000) status = 'review';
    return { state: status, attempts: s.attempts, accuracy, latencyMs: latency, lessons: s.lessons.length, days: s.days.length, hinted: s.hinted, repeated: s.repeated, confidence: status === 'insufficient' ? 'unknown' : 'observed' };
  }
  function skill(state, context, token, kind = 'character', now = Date.now(), thresholds = THRESHOLDS) {
    assert(['physical','character','bigram','text'].includes(kind), 'unknown skill kind');
    const result=metricStatus(state.skills[kind][metricKey(context, token, kind)], now, thresholds);
    if(kind==='text'){
      const alphabet=[...new Set(chars(TT.languages?.[context.languageId]?.alphabet||''))];
      const known=alphabet.filter(char=>metricStatus(state.skills.character[metricKey(context,char,'character')],now,thresholds).state!=='insufficient').length;
      result.coverage=alphabet.length?known/alphabet.length:0;
      if(['mastered','consolidated','review'].includes(result.state)&&result.coverage<thresholds.textCoverage)result.state='improving';
    }
    return result;
  }
  function level(xp) { return 1 + Math.floor(Math.sqrt(xp / 50)); }
  function recordInto(state, lesson, now) {
    validate(state);
    assert(object(lesson) && identifier(lesson.id) && identifier(lesson.languageId) && identifier(lesson.layoutId), 'invalid lesson identity');
    assert(finite(now) && finite(lesson.activeMs) && finite(lesson.wpmMs) && lesson.activeMs <= lesson.wpmMs, 'invalid lesson time');
    assert(Array.isArray(lesson.events) && lesson.events.length <= 20000, 'invalid events');
    if (own(state.processed, lesson.id)) return { applied: false, xp: 0, level: level(state.xp), achievements: [] };
    assert(Object.keys(state.processed).length < THRESHOLDS.maximumProcessedLessons, 'processed limit reached; preserve/export data before starting another model');
    const context = { languageId: lesson.languageId, layoutId: lesson.layoutId };
    const date = lesson.dayKey || dayKey(now);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(date), 'invalid lesson day');
    const events = lesson.events.map(event => {
      assert(object(event) && typeof event.char === 'string' && chars(event.char).length === 1, 'event must contain one NFC character');
      assert(event.ms === undefined || finite(event.ms), 'invalid event delay');
      assert(event.code === undefined || typeof event.code === 'string' && event.code.length <= 80, 'invalid physical code');
      for (const flag of ['error','hinted','repeated']) assert(event[flag] === undefined || typeof event[flag] === 'boolean', 'invalid event flag');
      return { ...event, char: normalize(event.char) };
    });
    let previous = null;
    for (const event of events) {
      observe(state, context, event.char, 'character', event, lesson, date, now);
      if (event.code) observe(state, context, event.code, 'physical', event, lesson, date, now);
      if (['ShiftLeft','ShiftRight'].includes(event.shiftSide)) observe(state, context, event.shiftSide, 'physical', {...event,error:!!event.shiftError}, lesson, date, now);
      if (previous && !event.error && !previous.error && !/\s/u.test(previous.char + event.char)) {
        observe(state, context, previous.char + event.char, 'bigram', { ...event, hinted: previous.hinted || event.hinted, repeated: previous.repeated || event.repeated }, lesson, date, now);
      }
      previous = event;
    }
    // Text skill is about material language+layout, independent of a letter's cross-language transfer.
    for (const event of events) observe(state, context, 'text', 'text', event, lesson, date, now);
    const nodeId = identifier(lesson.nodeId) ? lesson.nodeId : 'free:' + lesson.languageId + ':' + lesson.layoutId;
    const nodeKey = context.languageId + '|' + context.layoutId + '|' + nodeId;
    const progress = state.nodes[nodeKey] || (state.nodes[nodeKey] = { lessons: 0, challenges: 0, lastAt: 0, activeMs: 0 });
    progress.lessons++; progress.activeMs += lesson.activeMs; progress.lastAt = now;
    const independent = events.filter(e => !e.repeated && !e.hinted && lesson.hintLevel !== 'full');
    const accurate = independent.length ? independent.filter(e => !e.error).length / independent.length : 0;
    if (lesson.completed && lesson.kind === 'challenge' && independent.length >= THRESHOLDS.minimumXpCharacters && accurate >= THRESHOLDS.masteredAccuracy) progress.challenges++;
    const day = state.perDay[date] || (state.perDay[date] = { xp: 0, activeMs: 0, nodes: {} });
    const meaningful = events.filter(e => !e.repeated);
    const accuracy = meaningful.length ? meaningful.filter(e => !e.error).length / meaningful.length : 0;
    const remainingTime = Math.max(0, THRESHOLDS.rewardedActiveMsPerDay - day.activeMs);
    const rewardedMs = Math.min(lesson.activeMs, remainingTime, 120000);
    let xp = 0;
    if (lesson.completed && meaningful.length >= THRESHOLDS.minimumXpCharacters && lesson.activeMs >= THRESHOLDS.minimumXpActiveMs && accuracy >= THRESHOLDS.minimumXpAccuracy && rewardedMs >= THRESHOLDS.minimumXpActiveMs) {
      const base = Math.floor(rewardedMs / 5000) + Math.floor(Math.min(meaningful.length, 300) / 10);
      const hintFactor = lesson.hintLevel === 'full' ? .5 : 1;
      xp = Math.max(0, Math.min(Math.floor(base * accuracy * hintFactor), THRESHOLDS.xpPerNodePerDay - (own(day.nodes, nodeId) ? day.nodes[nodeId] : 0), THRESHOLDS.xpPerDay - day.xp));
    }
    day.activeMs += lesson.activeMs; day.xp += xp; day.nodes[nodeId] = (own(day.nodes, nodeId) ? day.nodes[nodeId] : 0) + xp;
    state.xp += xp;
    state.processed[lesson.id] = { xp, at: now, languageId: lesson.languageId, layoutId: lesson.layoutId };
    const unlocked = [];
    function achievement(id, condition) { if (condition && !own(state.achievements, id)) { state.achievements[id] = now; unlocked.push(id); } }
    achievement('first-practice', xp > 0);
    achievement('careful-practice', lesson.completed && independent.length >= 50 && accurate >= .98 && lesson.activeMs >= 30000);
    achievement('three-practice-days', Object.values(state.perDay).filter(d => d.xp > 0).length >= 3);
    achievement('bilingual-practice', new Set(Object.values(state.processed).filter(r => r.xp > 0).map(r => r.languageId)).size >= 2);
    achievement('first-challenge', progress.challenges > 0);
    return { applied: true, xp, level: level(state.xp), achievements: unlocked };
  }

  function serializedBytes(value) {
    let size=0;
    for (const char of JSON.stringify(value)) {
      const cp=char.codePointAt(0);size+=cp<=0x7f?1:cp<=0x7ff?2:cp<=0xffff?3:4;
    }
    return size;
  }
  function record(state, lesson, now = Date.now()) {
    validate(state);
    if (lesson && identifier(lesson.id) && own(state.processed, lesson.id)) return {applied:false,xp:0,level:level(state.xp),achievements:[]};
    const draft=JSON.parse(JSON.stringify(state));
    const result=recordInto(draft,lesson,now);
    assert(serializedBytes(draft)<=THRESHOLDS.maximumStateBytes,'state capacity reached; export data before continuing. Original learning data retained');
    for(const key of Object.keys(state))delete state[key];
    Object.assign(state,draft);
    return result;
  }

  const titles = {
    foundation: ['Основные буквы','Core letters'], common: ['Частые буквы','Frequent letters'], combinations: ['Сочетания','Letter combinations'], sentences: ['Предложения','Sentences'], accents: ['Регистр и особые буквы','Case and special letters'], fluency: ['Свободное владение','Fluent text'],
    digits: ['Цифры','Digits'], symbols: ['Знаки','Symbols'], technique: ['Техника','Technique']
  };
  function pack(context) { return TT.languages && TT.languages[context.languageId]; }
  function routes(layoutId, char, geometry = 'ANSI') {
    if (typeof TT.layoutRoutes === 'function') return TT.layoutRoutes(layoutId, char, geometry) || [];
    if (typeof TT.availableCharacters === 'function') return TT.availableCharacters(layoutId).includes(char) ? [{}] : [];
    return [];
  }
  function nodes(context = { languageId: 'ru', layoutId: 'ru-pc-mac' }) {
    const list = [];
    for (const [languageId, language] of Object.entries(TT.languages || {})) {
      const order = [...new Set(chars(language.frequency || language.alphabet))];
      const special = language.specials || language.alphabet.toLocaleUpperCase(language.locale);
      const targets = [order.slice(0,8).join(''),order.slice(0,16).join(''),order.slice(0,24).join(''),language.alphabet,special,language.alphabet];
      ['foundation','common','combinations','sentences','accents','fluency'].forEach((type, i) => {
        const name = [language.names?.ru||language.title||languageId,language.names?.en||language.title||languageId];
        list.push({ id: languageId + '-' + type, group: languageId, languageId, type, title: { ru: name[0] + ': ' + titles[type][0], en: name[1] + ': ' + titles[type][1] }, targetChars: targets[i], unlocked: true, criteria: { attempts: THRESHOLDS.masteredAttempts, lessons: THRESHOLDS.masteredLessons, accuracy: THRESHOLDS.masteredAccuracy, consolidationDays: THRESHOLDS.consolidatedDays }, description: { ru: 'Короткая практика, затем проверка без подсказок. Все узлы доступны сразу.', en: 'Short practice, then an independent challenge. Every node is available immediately.' }, difficultyAdvice: { ru: 'Замедлитесь, включите подсказку и потренируйте слабые сочетания.', en: 'Slow down, enable hints, and practise difficult combinations.' } });
      });
    }
    const digitGroups = ['12','34','56','78','90','0123456789'];
    const symbolGroups = ['.,','!?',':;','()[]{}','"\'','+-=*/\\|'];
    const techniqueGroups = ['shift-left','shift-right','switching','rhythm','accuracy','review'];
    for (let i = 0; i < 6; i++) {
      for (const [group, target] of [['digits',digitGroups[i]],['symbols',symbolGroups[i]],['technique',techniqueGroups[i]]]) {
        list.push({ id: group + '-' + (i + 1), group, languageId: null, type: group === 'technique' ? target : group, targetChars: group === 'technique' ? '' : target, unlocked: true,
          title: { ru: titles[group][0] + ' ' + (i + 1), en: titles[group][1] + ' ' + (i + 1) }, criteria: { attempts: THRESHOLDS.masteredAttempts, lessons: THRESHOLDS.masteredLessons, accuracy: THRESHOLDS.masteredAccuracy, consolidationDays: THRESHOLDS.consolidatedDays },
          description: { ru: 'Материал зависит от выбранного языка и раскладки. Ограничений по уровню нет.', en: 'Material follows the selected language and layout. No level locks.' },
          difficultyAdvice: { ru: 'Сначала точность, затем ровный ритм. Проверяйте рекомендованную сторону Shift.', en: 'Prioritize accuracy, then steady rhythm. Check the recommended Shift side.' } });
      }
    }
    for(const node of list) {
      node.skill={kind:node.group==='digits'?'digits':node.group==='symbols'?'punctuation':node.type,characters:node.targetChars};
      node.learning={ru:'Проверьте физическую клавишу и модификаторы каждого целевого символа в подсказке. Сначала точность, затем ровный ритм.',en:'Check the physical key and modifiers for each target character in the hint. Prioritize accuracy, then steady rhythm.'};
      node.practice={generator:'node-material',minimumCharacters:180,adaptive:true};
      node.challenge={generator:'node-material',minimumCharacters:240,hintLevel:'none',minimumAccuracy:THRESHOLDS.masteredAccuracy};
      node.consolidation={lessons:THRESHOLDS.consolidatedLessons,days:THRESHOLDS.consolidatedDays,accuracy:THRESHOLDS.consolidatedAccuracy};
    }
    return list;
  }
  function resolveNode(node, context) { return typeof node === 'string' ? nodes(context).find(n => n.id === node) : node; }
  function targetCharacters(node, context) {
    if (node.targetChars) return [...new Set(chars(node.targetChars))];
    const language = pack(context);
    if (!language) return [];
    if (node.type.startsWith('shift-')) {
      const candidates=[...new Set(chars(language.frequency || language.alphabet).map(c=>c.toUpperCase()))];
      const right=code=>/^(Digit[6-90]|Key[YUIOPHJKLNM]|Bracket|Backslash|Semicolon|Quote|Comma|Period|Slash|Minus|Equal)/.test(code);
      return candidates.filter(c=>routes(context.layoutId,c,context.geometry).some(r=>(r.modifiers||[]).includes('Shift')&&(node.type==='shift-left'?right(r.code):!right(r.code)))).slice(0,8);
    }
    return [...new Set(chars(language.frequency || language.alphabet).slice(0,12))];
  }
  function nodeStatus(state, node, context, now = Date.now()) {
    node = resolveNode(node, context);
    if (!node) return { state: 'insufficient', observed: 0, total: 0 };
    const effective = { ...context, languageId: node.languageId || context.languageId };
    const tokens = targetCharacters(node, effective);
    const statuses = tokens.map(c=>skill(state,effective,c,'character',now));
    const observed = statuses.filter(s=>s.state !== 'insufficient').length;
    let status = 'insufficient';
    if (observed) status = statuses.some(s=>s.state==='learning') ? 'learning' : 'improving';
    if (statuses.length && statuses.every(s=>['mastered','consolidated','review'].includes(s.state))) status = statuses.some(s=>s.state==='review') ? 'review' : statuses.every(s=>s.state==='consolidated') ? 'consolidated' : 'mastered';
    return { state: status, observed, total: statuses.length };
  }
  function recommend(state, context, now = Date.now()) {
    const candidates = nodes(context).filter(n=>(!n.languageId || n.languageId===context.languageId) && material(n,'practice',context).available);
    return candidates.map(node=>{
      const s=nodeStatus(state,node,context,now);
      const score={review:100,learning:90,insufficient:60,improving:70,mastered:20,consolidated:10}[s.state]+({foundation:6,common:5,combinations:4,sentences:3,accents:2,fluency:1}[node.type]||0);
      const weakChars=targetCharacters(node,context).map(char=>({char,...skill(state,context,char,'character',now)})).sort((a,b)=>({review:6,learning:5,insufficient:3,improving:4,mastered:2,consolidated:1}[b.state])-({review:6,learning:5,insufficient:3,improving:4,mastered:2,consolidated:1}[a.state])).slice(0,6).map(s=>s.char);
      return { nodeId:node.id,state:s.state,score,weakChars,reason:s.state==='insufficient'?'collect-evidence':s.state==='review'?'spaced-review':s.state==='learning'?'accuracy-practice':'steady-practice' };
    }).sort((a,b)=>b.score-a.score || a.nodeId.localeCompare(b.nodeId)).slice(0,3);
  }
  function material(node, kind = 'practice', context = { languageId:'ru',layoutId:'ru-pc-mac' }) {
    node=resolveNode(node,context);
    if (!node) return {available:false,text:'',missing:[],reason:'unknown-node',context};
    const effective={...context,languageId:node.languageId || context.languageId};
    const language=pack(effective);
    if (!language) return {available:false,text:'',missing:[],reason:'unknown-language',context:effective};
    const targets=targetCharacters(node,effective);
    let pieces=[];
    if (node.group==='digits') pieces=[node.targetChars, ...chars(node.targetChars).map(c=>c+c), node.targetChars.split('').reverse().join('')];
    else if (node.group==='symbols') pieces=targets.map((c,i)=>(language.words[i%language.words.length]||'')+c);
    else if (node.type.startsWith('shift-')) {
      const wantedSide=node.type==='shift-left'?'ShiftLeft':'ShiftRight';
      const codes=code=>/^(Digit[6-90]|Key[YUIOPHJKLNM]|Bracket|Backslash|Semicolon|Quote|Comma|Period|Slash|Minus|Equal)/.test(code);
      pieces=targets.filter(c=>routes(context.layoutId,c).some(r=>(r.modifiers||[]).includes('Shift') && (wantedSide==='ShiftLeft'?codes(r.code):!codes(r.code))));
      if(!pieces.length)pieces=targets;
    } else if (node.type==='combinations') pieces=language.bigrams || [];
    else if (['sentences','fluency','rhythm','accuracy','review','switching'].includes(node.type)) pieces=language.sentences || [];
    else if (node.type==='accents') pieces=targets;
    else {
      const allowed=new Set(targets);
      pieces=(language.words||[]).filter(w=>chars(w).every(c=>allowed.has(c.toLowerCase())));
      if(pieces.length<4)pieces=targets;
    }
    if (kind === 'practice' && Array.isArray(context.weakChars) && context.weakChars.length && !['digits','symbols'].includes(node.group)) {
      const weak=new Set(context.weakChars.map(normalize));
      const focused=(language.words||[]).filter(word=>chars(word).some(c=>weak.has(c)) && chars(word).every(c=>routes(effective.layoutId,c,effective.geometry).length));
      if(focused.length)pieces=focused;
    }
    if (!pieces.length) pieces=targets;
    const seed=Number.isSafeInteger(context.seed)?Math.abs(context.seed):0;
    pieces=pieces.map(normalize).filter(Boolean);
    if (kind === 'practice' && Array.isArray(context.weakChars) && context.weakChars.length) {
      const weak = new Set(context.weakChars.map(normalize).filter(c=>targets.includes(c)));
      const focused = pieces.filter(piece => chars(piece).some(c => weak.has(c.toLowerCase())));
      if(!focused.length&&weak.size){const vowel=chars(language.frequency||language.alphabet)[0];focused.push(...[...weak].map(c=>c+vowel));}
      if (focused.length) pieces = [...focused, ...focused, ...pieces];
    }
    let text=''; const min=kind==='challenge'?240:180;
    for(let i=0;pieces.length && text.length<min && i<200;i++)text+=(text?' ':'')+pieces[(i+seed)%pieces.length];
    const unseen=targets.filter(c=>!text.includes(c));
    if(unseen.length)text+=' '+unseen.join(' ');
    const absent=targets.filter(c=>!text.includes(c));
    if(absent.length)text+=' '+absent.join(' ');
    const required=[...new Set([...targets,...chars(text)])];
    const missing=required.filter(c=>!routes(effective.layoutId,c,effective.geometry).length);
    return { available:missing.length===0 && !!text,text:missing.length?'':text,missing,reason:missing.length?'unsupported-characters':null,context:effective,nodeId:node.id,kind };
  }
  function diagnostic(context, full = false) {
    const language=pack(context);
    if (!language) return {available:false,text:'',missing:[],reason:'unknown-language',context};
    const canType = text => chars(text).every(c => routes(context.layoutId,c,context.geometry).length);
    const letters=[...new Set(chars(language.frequency || language.alphabet))];
    const allWords=(language.words||[]).slice(0,full?30:10);
    const allParts=[letters.join(' '),...allWords,...(full?language.bigrams||[]:[]),...(full?(language.sentences||[]).slice(0,3):[])];
    const missing=[...new Set(chars(allParts.join(' ')))].filter(c=>!routes(context.layoutId,c,context.geometry).length);
    const parts=[letters.filter(canType).join(' '),...allWords.filter(canType)];
    if(full)parts.push(...(language.bigrams||[]).filter(canType),...(language.sentences||[]).slice(0,3).filter(canType));
    const text=parts.filter(Boolean).join(' ');
    return {available:!!text,text,missing,partial:missing.length>0,reason:missing.length?'partial-coverage':null,context,kind:full?'diagnostic-full':'diagnostic-quick'};
  }
  TT.learning={emptyState,validate,record,nodes,skill,nodeStatus,recommend,material,diagnostic,level,THRESHOLDS,STATES};
})(typeof globalThis !== 'undefined' ? globalThis : window);
