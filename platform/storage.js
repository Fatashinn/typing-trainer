/* Versioned platform state. Persistence stays in the application's checked store. */
(function (root) {
  'use strict';
  const TT2 = root.TT2 = root.TT2 || {};
  const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function check(ok, message) { if (!ok) throw new Error(message); }
  function create() {
    check(TT2.learning && TT2.learning.emptyState, 'Learning engine is unavailable');
    return {
      version: 1,
      preferences: { uiLanguage: 'ru', languageId: 'ru', layoutId: 'ru-pc-mac', geometry: 'ANSI' },
      learning: TT2.learning.emptyState()
    };
  }
  function validate(value) {
    check(plain(value) && value.version === 1, 'Unsupported platform state version');
    const prefs = value.preferences;
    check(plain(prefs) && ['ru','en'].includes(prefs.uiLanguage), 'Invalid UI language');
    check(typeof prefs.languageId === 'string' && /^[a-z][a-z0-9-]{1,39}$/.test(prefs.languageId), 'Invalid typing language identifier');
    check(typeof prefs.layoutId === 'string' && /^[a-z][a-z0-9-]{1,79}$/.test(prefs.layoutId), 'Invalid layout identifier');
    check(['ANSI','ISO'].includes(prefs.geometry), 'Invalid physical keyboard geometry');
    for(const key of ['secondaryLanguageId','secondaryLayoutId']) if(key in prefs) check(typeof prefs[key]==='string' && /^[a-z][a-z0-9-]{1,79}$/.test(prefs[key]), 'Invalid secondary context');
    if('freeText' in prefs)check(typeof prefs.freeText==='string'&&prefs.freeText.length<=20000,'Invalid free text');
    if('freeOffset' in prefs)check(Number.isSafeInteger(prefs.freeOffset)&&prefs.freeOffset>=0&&prefs.freeOffset<=20000,'Invalid free text offset');
    if('diagnosticSkipped' in prefs)check(typeof prefs.diagnosticSkipped==='boolean','Invalid diagnostic preference');
    check(TT2.learning && TT2.learning.validate, 'Learning engine is unavailable');
    TT2.learning.validate(value.learning);
    return value;
  }
  function validateLesson(lesson){
    const number=x=>Number.isFinite(x)&&x>=0&&x<=Number.MAX_SAFE_INTEGER;
    const id=x=>typeof x==='string'&&x.length>0&&x.length<=160&&!['__proto__','constructor','prototype'].includes(x);
    check(plain(lesson)&&id(lesson.id)&&id(lesson.languageId)&&id(lesson.layoutId),'Invalid platform lesson');
    check(number(lesson.activeMs)&&number(lesson.wpmMs)&&lesson.activeMs<=lesson.wpmMs&&typeof lesson.completed==='boolean','Invalid platform lesson time');
    check(Array.isArray(lesson.events)&&lesson.events.length<=20000,'Invalid platform events');
    for(const e of lesson.events){
      check(plain(e)&&typeof e.char==='string'&&Array.from(e.char.normalize('NFC')).length===1,'Invalid platform character');
      for(const key of ['ms','activeMs'])if(key in e)check(number(e[key]),'Invalid event time');
      for(const key of ['error','hinted','repeated'])if(key in e)check(typeof e[key]==='boolean','Invalid event flag');
      for(const key of ['languageId','layoutId'])if(key in e)check(id(e[key]),'Invalid event context');
      if('code' in e)check(typeof e.code==='string'&&e.code.length<=80,'Invalid physical key');
    }
    return lesson;
  }
  TT2.storage = Object.freeze({ key: 'tt.platform', version: 1, create, validate, validateLesson });
})(globalThis);
