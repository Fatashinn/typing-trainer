/* UI localization only. Typing materials, keyboard maps and persisted data are independent. */
(function (global) {
  'use strict';
  const TT2 = global.TT2 = global.TT2 || {};
  const messages = {
    ru: {
      'app.title':'Тренажёр печати', 'nav.train':'Тренировка', 'nav.stats':'Статистика', 'nav.settings':'Настройки',
      'nav.map':'Карта обучения', 'nav.practice':'Свободная практика', 'nav.diagnostic':'Диагностика',
      'settings.uiLanguage':'Язык интерфейса', 'settings.typingLanguage':'Язык обучения', 'settings.inputLayout':'Раскладка ввода',
      'settings.geometry':'Физическая клавиатура', 'settings.manualLayout':'Выберите раскладку вручную. Системную раскладку приложение не переключает.',
      'settings.layoutSupport':'Уровень поддержки', 'settings.layoutExperimental':'Экспериментальная раскладка — нужна проверка на устройстве',
      'settings.layoutReference':'Карта сверена с источником; аппаратная проверка ещё нужна',
      'settings.geometryNote':'ANSI и ISO описывают геометрию, а не язык или программную раскладку.',
      'language.ru':'Русский', 'language.en':'Английский', 'language.fr':'Французский', 'language.de':'Немецкий',
      'diagnostic.title':'Диагностика', 'diagnostic.quick':'Быстрая диагностика', 'diagnostic.full':'Полная диагностика',
      'diagnostic.skip':'Пропустить диагностику', 'diagnostic.start':'Начать диагностику',
      'diagnostic.note':'Диагностика не блокирует упражнения. Неизвестный навык ещё не означает слабый.',
      'diagnostic.result':'Результаты диагностики', 'diagnostic.complete':'Диагностика завершена',
      'diagnostic.skipped':'Диагностика пропущена. Все упражнения доступны.',
      'map.title':'Карта обучения', 'map.learn':'Материал', 'map.practice':'Практика', 'map.challenge':'Испытание',
      'map.recommended':'Рекомендуется', 'map.open':'Открыть', 'map.allAvailable':'Все упражнения доступны сразу',
      'map.noLocks':'Рекомендации помогают выбрать следующий шаг, но не блокируют карту.',
      'map.requirements':'Тренируемые символы', 'map.guidance':'Если трудно', 'map.progress':'Прогресс узла',
      'map.ru':'Русская печать', 'map.en':'Английская печать', 'map.fr':'Французская печать', 'map.de':'Немецкая печать',
      'map.digits':'Цифры', 'map.symbols':'Знаки и пунктуация', 'map.technique':'Техника и переключение раскладок',
      'map.home':'Основная позиция', 'map.top':'Верхний ряд', 'map.bottom':'Нижний ряд', 'map.words':'Частые слова',
      'map.combinations':'Сочетания', 'map.sentences':'Предложения', 'map.accents':'Диакритика', 'map.shift':'Противоположный Shift',
      'practice.title':'Свободная практика', 'practice.start':'Начать практику', 'practice.adaptive':'Адаптивная практика',
      'practice.words':'Слова', 'practice.sentences':'Предложения', 'practice.custom':'Свой текст',
      'practice.unsupported':'Часть символов недоступна в выбранной раскладке', 'practice.empty':'Для этого набора пока нет материала.',
      'practice.selectNode':'Выберите упражнение на карте', 'practice.notAvailable':'Символы недоступны на выбранной раскладке или геометрии.',
      'skill.unknown':'Недостаточно данных', 'skill.learning':'Изучается', 'skill.progressing':'Прогрессирует',
      'skill.mastered':'Освоен', 'skill.consolidated':'Закреплён', 'skill.review':'Пора повторить',
      'skill.physical':'Физические клавиши', 'skill.symbols':'Символы в раскладке', 'skill.language':'Печать на языке',
      'skill.note':'Скорость, точность и подсказки учитываются отдельно. Рекомендация пальца не определяет фактический палец.',
      'skill.attempts':'Попытки', 'skill.accuracy':'Точность', 'skill.speed':'Скорость', 'skill.latency':'Задержка', 'skill.confidence':'Достаточность данных',
      'game.xp':'XP', 'game.level':'Уровень', 'game.achievements':'Достижения', 'game.noAchievements':'Достижений пока нет',
      'game.xpNote':'XP отражает практику, а не доказанное мастерство.', 'game.practice':'Первые шаги',
      'game.accurate':'Точная практика', 'game.multilingual':'Несколько языков', 'game.regular':'Регулярная практика',
      'game.firstLesson':'Первое завершённое упражнение', 'game.firstPractice':'Первая осмысленная практика',
      'game.reward':'Получено {xp} XP', 'game.levelValue':'Уровень {level}',
      'progress.title':'Прогресс обучения', 'progress.empty':'Пока нет подтверждённых результатов для этой пары языка и раскладки.',
      'progress.legacy':'Историческая статистика 1.x сохранена отдельно и не считается подтверждённым мастерством.',
      'common.start':'Начать', 'common.continue':'Продолжить', 'common.cancel':'Отмена', 'common.close':'Закрыть',
      'common.save':'Сохранить', 'common.back':'Назад', 'common.none':'Нет', 'common.unknown':'Неизвестно',
      'common.experimental':'Экспериментально', 'common.available':'Доступно', 'common.loading':'Загрузка',
      'input.compose':'Заверши составной ввод', 'input.unavailable':'Этот символ недоступен в выбранной раскладке.',
      'input.layoutMismatch':'Проверь системную раскладку. Приложение не переключает её автоматически.',
      'input.uncertain':'Раскладку нельзя надёжно определить по этому символу.',
      'input.correct':'Верно', 'input.error':'Ошибка', 'input.deadKey':'Мёртвая клавиша',
      'input.option':'Option', 'input.altgr':'AltGr', 'input.sequence':'Последовательность ввода',
      'backup.platformPreserved':'Копия v1 заменит данные 1.x; текущие данные платформы 2.0 будут сохранены.',
      'backup.platformIncluded':'Копия включает данные платформы 2.0.',
      'storage.platformInvalid':'Данные платформы повреждены. Исходная запись сохранена; новые записи приостановлены.',
      'storage.failed':'Не удалось сохранить данные. Скачайте резервную копию перед закрытием страницы.'
    },
    en: {
      'app.title':'Typing Trainer', 'nav.train':'Training', 'nav.stats':'Statistics', 'nav.settings':'Settings',
      'nav.map':'Learning map', 'nav.practice':'Free practice', 'nav.diagnostic':'Assessment',
      'settings.uiLanguage':'Interface language', 'settings.typingLanguage':'Typing language', 'settings.inputLayout':'Input layout',
      'settings.geometry':'Physical keyboard', 'settings.manualLayout':'Select a layout manually. The app does not change your system input source.',
      'settings.layoutSupport':'Support level', 'settings.layoutExperimental':'Experimental layout — needs testing on your device',
      'settings.layoutReference':'Map checked against a reference; hardware testing is still needed',
      'settings.geometryNote':'ANSI and ISO describe geometry, not the language or input layout.',
      'language.ru':'Russian', 'language.en':'English', 'language.fr':'French', 'language.de':'German',
      'diagnostic.title':'Assessment', 'diagnostic.quick':'Quick assessment', 'diagnostic.full':'Full assessment',
      'diagnostic.skip':'Skip assessment', 'diagnostic.start':'Start assessment',
      'diagnostic.note':'Assessment never locks exercises. Unknown skill does not mean weak skill.',
      'diagnostic.result':'Assessment results', 'diagnostic.complete':'Assessment complete',
      'diagnostic.skipped':'Assessment skipped. Every exercise remains available.',
      'map.title':'Learning map', 'map.learn':'Learn', 'map.practice':'Practice', 'map.challenge':'Challenge',
      'map.recommended':'Recommended', 'map.open':'Open', 'map.allAvailable':'Every exercise is available immediately',
      'map.noLocks':'Recommendations suggest the next step without locking the map.',
      'map.requirements':'Target characters', 'map.guidance':'If this is difficult', 'map.progress':'Node progress',
      'map.ru':'Russian typing', 'map.en':'English typing', 'map.fr':'French typing', 'map.de':'German typing',
      'map.digits':'Digits', 'map.symbols':'Symbols and punctuation', 'map.technique':'Technique and layout switching',
      'map.home':'Home row', 'map.top':'Top row', 'map.bottom':'Bottom row', 'map.words':'Frequent words',
      'map.combinations':'Combinations', 'map.sentences':'Sentences', 'map.accents':'Diacritics', 'map.shift':'Opposite-hand Shift',
      'practice.title':'Free practice', 'practice.start':'Start practice', 'practice.adaptive':'Adaptive practice',
      'practice.words':'Words', 'practice.sentences':'Sentences', 'practice.custom':'Custom text',
      'practice.unsupported':'Some characters are unavailable in the selected layout', 'practice.empty':'No material is available for this selection yet.',
      'practice.selectNode':'Choose an exercise on the map', 'practice.notAvailable':'Characters are unavailable in this layout or geometry.',
      'skill.unknown':'Insufficient data', 'skill.learning':'Learning', 'skill.progressing':'Improving',
      'skill.mastered':'Mastered', 'skill.consolidated':'Consolidated', 'skill.review':'Time to review',
      'skill.physical':'Physical keys', 'skill.symbols':'Layout-specific characters', 'skill.language':'Typing language',
      'skill.note':'Speed, accuracy and hints are measured separately. A finger suggestion cannot identify the finger you actually used.',
      'skill.attempts':'Attempts', 'skill.accuracy':'Accuracy', 'skill.speed':'Speed', 'skill.latency':'Latency', 'skill.confidence':'Evidence',
      'game.xp':'XP', 'game.level':'Level', 'game.achievements':'Achievements', 'game.noAchievements':'No achievements yet',
      'game.xpNote':'XP reflects practice, not proven mastery.', 'game.practice':'First steps',
      'game.accurate':'Accurate practice', 'game.multilingual':'Multiple languages', 'game.regular':'Regular practice',
      'game.firstLesson':'First completed exercise', 'game.firstPractice':'First meaningful practice',
      'game.reward':'Earned {xp} XP', 'game.levelValue':'Level {level}',
      'progress.title':'Learning progress', 'progress.empty':'No confirmed results for this language and layout yet.',
      'progress.legacy':'Historical 1.x statistics are kept separately and do not establish confirmed mastery.',
      'common.start':'Start', 'common.continue':'Continue', 'common.cancel':'Cancel', 'common.close':'Close',
      'common.save':'Save', 'common.back':'Back', 'common.none':'None', 'common.unknown':'Unknown',
      'common.experimental':'Experimental', 'common.available':'Available', 'common.loading':'Loading',
      'input.compose':'Complete the composed character', 'input.unavailable':'This character is unavailable in the selected layout.',
      'input.layoutMismatch':'Check your system input layout. The app cannot switch it automatically.',
      'input.uncertain':'This character does not reliably identify the input layout.',
      'input.correct':'Correct', 'input.error':'Error', 'input.deadKey':'Dead key',
      'input.option':'Option', 'input.altgr':'AltGr', 'input.sequence':'Input sequence',
      'backup.platformPreserved':'A v1 backup replaces 1.x data; current 2.0 platform data is preserved.',
      'backup.platformIncluded':'This backup includes 2.0 platform data.',
      'storage.platformInvalid':'Platform data is damaged. The original record is preserved and new writes are paused.',
      'storage.failed':'Data could not be saved. Download a backup before closing the page.'
    }
  };
  // Exact legacy messages are translated at the presentation boundary. Their data contracts remain unchanged.
  const legacy = {
    'Тренажёр знаков':'Typing Trainer', 'Тренировка':'Training','Статистика':'Statistics','Настройки':'Settings',
    'Тренировка дня':'Daily training','Цифры':'Digits','Слабые места':'Weak spots','Знаки RU':'RU symbols','Знаки EN':'EN symbols',
    'Смешанный':'Mixed','Свой текст':'Custom text','Новый текст':'New text','Пауза':'Pause','Продолжить':'Continue',
    'Подсказка':'Hint','полная':'full','по запросу':'on demand','без подсказок':'no hints','Клавиатура':'Keyboard',
    'с подписями':'labels','только цвета':'colors only','скрыта':'hidden','Отчёт для Claude':'Report for Claude',
    'Короткая сводка простым текстом: вставь её в чат с Claude и попроси советов.':'A short text summary: paste it into a chat with Claude and ask for advice.',
    'По символам':'By character','Раскладка:':'Layout:','обе':'both','только знаки и цифры':'symbols and digits only',
    'Сверху — худшие. Красный: ошибок ≥ 15% или нажатие ≥ 1 с; жёлтый: ошибок ≥ 5% или ≥ 0,6 с. Паузы дольше 2 с не учитываются.':'Weakest first. Red: errors ≥ 15% or latency ≥ 1 s; yellow: errors ≥ 5% or ≥ 0.6 s. Pauses longer than 2 s are excluded.',
    'Последние уроки':'Recent lessons','Сброс':'Reset','Строгий Shift':'Strict Shift',
    'Shift не той рукой — ошибка, курсор стоит. Если выключено — только предупреждение.':'Using the wrong Shift hand is an error and stops the cursor. When disabled, it is only a warning.',
    'ISO-клавиатура':'ISO keyboard','(лишняя клавиша слева от Z)':'(extra key to the left of Z)',
    'На Mac с ISO браузер иногда путает коды клавиш слева от 1 и слева от Z. Тренажёр проверяет нажатие по символу, так что на проверку это не влияет.':'On an ISO Mac, browsers can mix up the codes to the left of 1 and Z. Character validation still uses the typed character.',
    'Раскладка в режиме «Цифры»':'Layout in Digits mode',
    'Влияет на подсказку и статистику. Знаки, общие для обеих раскладок, принимаются из любой.':'Used for hints and statistics. Characters shared by both layouts are accepted from either.',
    'Потолок скорости':'Speed ceiling','выкл':'off','вкл':'on',
    'Скорость считается по каждому слову. Слово быстрее потолка подсвечивается оранжевым и не входит в wpm урока: так видно, где гонишь в ущерб точности.':'Speed is measured per word. Words above the ceiling turn orange and are excluded from lesson WPM to help prioritize accuracy.',
    'Перепечатать слово с ошибкой':'Retype a word with an error','2 раза':'2 times','3 раза':'3 times',
    'После слова с ошибкой оно вставляется в текст ещё N раз подряд (выделено фоном).':'A word with an error is inserted N more times, with a distinct background.',
    'Резервная копия данных':'Data backup',
    'Копия содержит настройки, статистику, историю и собственный текст. Храните файл в безопасном месте. Это не аналитический отчёт для ИИ.':'The backup contains settings, statistics, history and custom text. Keep it safe. It is separate from an AI analytics report.',
    'Скачать JSON':'Download JSON','Импорт JSON':'Import JSON','Скачать текущие данные перед заменой':'Download current data before replacing',
    'Подтверждаю замену всех текущих данных этой копией':'I confirm replacing all current data with this backup',
    'Заменить данные':'Replace data','Отмена':'Cancel','Повторить восстановление':'Retry recovery',
    'Мало данных, сначала пройди другие режимы: нужно хотя бы 5 знаков, на каждом от 5 попыток.':'Not enough data yet. Practice other modes first: at least 5 symbols with 5 attempts each are needed.',
    'Перейти в «Цифры»':'Go to Digits','Вставь текст в поле выше и нажми «Начать».':'Paste text above and choose Start.',
    'Нет текста: включи хотя бы один знак.':'No text: enable at least one symbol.',
    'Option не нужен: нажми клавишу без Option.':'Option is not needed: press the key without Option.',
    'Shift не той рукой.':'Wrong Shift hand.','Переключи раскладку (Ctrl+Space).':'Switch input layout (Ctrl+Space).','Ошибка.':'Error.',
    'точность':'accuracy','ошибок всего':'total errors','ошибок раскладки':'layout errors','ошибок Shift':'Shift errors',
    'слов быстрее потолка':'words above the ceiling','Ещё':'Again','Enter или пробел — следующий урок':'Enter or Space — next lesson',
    'Enter — продолжить':'Enter — continue','вчера пропущено':'yesterday missed','есть историческая оценка времени':'includes historical time estimates',
    'осталось активно':'active time remaining','Прервать':'Stop','Смешанный (для «Слабых мест» пока мало данных)':'Mixed (not enough data for Weak spots yet)',
    'Считаются интервалы между нажатиями, до 5 секунд. Пауза и ожидание между блоками не учитываются.':'Intervals between keystrokes count, up to 5 seconds. Pauses and waiting between blocks do not count.',
    'Тренировка дня завершена':'Daily training complete','Дальше:':'Next:',
    'цифры':'digits','Плотность знаков':'Symbol density','знак в каждом слове':'a symbol in every word',
    'Вставь сюда любой текст. Длинный текст пойдёт кусками по ~300 знаков.':'Paste any text here. Long text is split into sections of about 300 characters.',
    'Начать':'Start','«Ёлочки» и “лапки” заменяются на ", длинное тире — на -, символы, которых нет на клавиатуре, пропускаются.':'Curly quotes become straight quotes, long dashes become hyphens, and unavailable characters are omitted.',
    'Пока пусто — пройди урок.':'Nothing yet — complete a lesson.','Символ':'Character','Раскл.':'Layout','Как нажать':'How to type',
    'Попыток':'Attempts','Ошибок':'Errors','Раскладка':'Layout','Ср. время':'Avg. latency','Пока нет уроков.':'No lessons yet.',
    'Когда':'When','Режим':'Mode','Статус':'Status','Активно':'Active','Знаков':'Characters','Точность':'Accuracy',
    'завершён':'completed','прерван':'interrupted','конец блока':'block ended','исторический':'historical',
    'Сбросить статистику':'Reset statistics','Да, удалить всё':'Yes, delete all',
    'Точно? Статистика и история уроков удалятся без возврата.':'Are you sure? Statistics and lesson history will be permanently deleted.',
    'Скопируй вручную: Cmd+C':'Copy manually: Cmd+C','Скопировано':'Copied',
    'Скачана копия исходных записей, включая повреждённые. Для импорта их потребуется исправить; исходники не удалены.':'Original records were downloaded, including damaged ones. Fix their structure before importing; the originals were not deleted.',
    'Файл подготовлен. Проверьте, что браузер сохранил загрузку.':'File prepared. Check that your browser saved the download.',
    'Импорт отменён.':'Import cancelled.','Файл проверен. Замена ещё не выполнена.':'File validated. Nothing has been replaced yet.',
    'Хранилище изменено в другой вкладке. Перезагрузите страницу перед импортом.':'Storage changed in another tab. Reload before importing.',
    'localStorage недоступен: статистика и настройки не сохранятся после закрытия страницы.':'localStorage is unavailable: statistics and settings will not survive closing this page.',
    'Незавершённый импорт отменён: прежние данные восстановлены.':'Incomplete import cancelled: previous data was restored.',
    'Сначала завершите восстановление хранилища':'Complete storage recovery first',
    'Данные изменились после просмотра. Выберите файл заново.':'Data changed after preview. Select the file again.',
    'Есть незавершённое восстановление':'Storage recovery is still pending','Не удалось сохранить журнал':'Could not save the recovery journal',
    'Слишком глубокая структура':'The structure is nested too deeply','Недопустимое число':'Invalid number','Недопустимое имя поля':'Invalid field name',
    'Неизвестный режим':'Unknown mode','Неверная раскладка':'Invalid layout','Слишком много символов':'Too many characters',
    'Неверная статистика символа':'Invalid character statistics','Неверные путаницы':'Invalid confusion data','Неверный счётчик':'Invalid counter',
    'Неверная история':'Invalid history','Неверный урок':'Invalid lesson','Неверная версия времени урока':'Invalid lesson timing version',
    'Неверные временные показатели':'Invalid timing metrics','Неверные показатели урока':'Invalid lesson metrics','Неверные счётчики':'Invalid counters',
    'Слишком большой или неверный текст':'Custom text is invalid or too large','Неверная позиция текста':'Invalid custom text position',
    'Неверный журнал активного времени':'Invalid active time ledger','Неверный день':'Invalid day','Неверный дневной план':'Invalid daily plan',
    'Копия должна содержать ровно семь пользовательских ключей':'The backup must contain exactly seven user data keys',
    'Неизвестный журнал восстановления':'Unknown recovery journal','Файл больше 8 МиБ':'File exceeds 8 MiB',
    'Неподдерживаемый формат или версия резервной копии':'Unsupported backup format or version','Неверная дата копии':'Invalid backup date',
    'Копия превышает 8 МиБ':'Backup exceeds 8 MiB',
    'Будут заменены семь разделов версии 1.x. Данные обучения и XP платформы 2.0 сохранятся без изменений.':'The seven 1.x sections will be replaced. Current 2.0 learning and XP data will be preserved.',
    'Будут заменены все восемь разделов, включая обучение и XP платформы 2.0.':'All eight sections will be replaced, including 2.0 learning and XP data.'
  };
  // Longer phrases first so that generic word translations never destroy a more specific phrase.
  const terms = {
    'левый безымянный':'left ring finger','правый безымянный':'right ring finger','левый указательный':'left index finger','правый указательный':'right index finger',
    'левый мизинец':'left little finger','правый мизинец':'right little finger','левый средний':'left middle finger','правый средний':'right middle finger','большой палец':'thumb',
    'левый Shift':'left Shift','правый Shift':'right Shift','левый вместо правого':'left instead of right','правый вместо левого':'right instead of left',
    'расхождение часов':'clock discontinuity','пробел':'Space','раскладка':'layout','путаницы':'confusions',
    'Дней подряд:':'Day streak:','Сегодня':'Today','сегодня':'today','активно':'active','ожидание':'waiting','пауза':'paused',
    'предупр.':'warnings','по 5 минут.':'5 minutes each.','— 5 мин.':'— 5 min.','Дальше:':'Next:',
    'Слабые знаки':'Weak symbols','Слабые места':'Weak spots','Знаки RU':'RU symbols','Знаки EN':'EN symbols','Смешанный':'Mixed','Свой текст':'Custom text','Цифры':'Digits',
    'историческая оценка':'historical estimate','завершён':'completed','прерван':'interrupted','конец блока':'block ended',
    'Тренажёр знаков: отчёт':'Typing Trainer: report','Настройки':'Settings','Тренировка дня':'Daily training',
    'Уроков всего:':'Lessons total:','за 7 дней:':'in 7 days:','мин по старому/урочному учёту':'min by historical/lesson timing',
    'активно после обновления':'active since the update','Данных мало: меньше 5 завершённых уроков в доступной истории, выводы предварительные.':'Limited data: fewer than 5 completed lessons in available history; conclusions are preliminary.',
    'Строгий Shift:':'Strict Shift:','Клавиатура':'Keyboard','Потолок скорости:':'Speed ceiling:','Перепечатка слова с ошибкой:':'Retype a word with an error:',
    'Плотность знаков:':'Symbol density:','Подсказка / клавиатура:':'Hint / keyboard:',
    'Минуты за 7 дней:':'Minutes in 7 days:','Режимы: последние 10 завершённых уроков (предыдущие 10)':'Modes: last 10 completed lessons (previous 10)',
    'раньше уроков не было':'no previous lessons','Уроков пока нет.':'No lessons yet.','Мало данных.':'Not enough data.',
    'Худшие знаки':'Weakest symbols','символ, клавиша: попыток / ошибок / мс':'character, key: attempts / errors / ms',
    'Среднее время нажатия':'Average typing latency','Частые путаницы (ожидалось → нажато)':'Frequent confusions (expected → typed)',
    'Пока нет.':'None yet.','Буква ':'Letter ','вчера':'yesterday','Russian – PC и English (US)':'Russian – PC and English (US)',
    'Пока не записаны.':'None recorded yet.','Ошибки раскладки':'Layout errors','Ошибки Shift':'Shift errors',
    'Чаще всего:':'Most frequent:','Последние уроки':'Recent lessons','Нет.':'None.',
    'Раскладки:':'Layouts:','Клавиши указаны по US-маркировке; Shift нужен противоположной рукой.':'Keys use US labels; use Shift with the opposite hand.',
    'Сохраните текущую копию перед заменой. Закройте другие вкладки тренажёра.':'Save your current backup before replacing data. Close other trainer tabs.',
    'Будут заменены семь разделов версии 1.x. Данные обучения и XP платформы 2.0 сохранятся без изменений.':'The seven 1.x sections will be replaced. Current 2.0 learning and XP data will be preserved.',
    'Будут заменены все восемь разделов, включая обучение и XP платформы 2.0.':'All eight sections will be replaced, including 2.0 learning and XP data.',
    'Неверная настройка ':'Invalid setting ','Неверная запись ':'Invalid record ','Слишком большая запись ':'Record is too large: ',
    'Запись не подтверждена: ':'Write verification failed: ',': нужен объект':': expected an object',': неверное поле ':': invalid field ',
    ': повреждённая запись сохранена без изменений. ':': damaged record preserved unchanged. ',
    'Не удалось сохранить данные: ':'Could not save data: ','Импорт отклонён: ':'Import rejected: ',
    'Импорт не начат: не удалось сохранить журнал. ':'Import not started: could not save the recovery journal. ',
    'Импорт отменён, прежние данные сохранены. ':'Import cancelled; previous data was preserved. ',
    'Импорт не завершён; журнал сохранён. Не продолжайте тренировку. Освободите место и повторите восстановление. ':'Import incomplete; recovery journal retained. Stop training, free storage space and retry recovery. ',
    'Хранилище недоступно или восстановление не завершено. Запись приостановлена. Освободите место и нажмите «Повторить восстановление». ':'Storage is unavailable or recovery is incomplete. Writes are paused. Free storage space and choose Retry recovery. '
  };
  let language = 'ru';
  const textSources = new WeakMap(), attributeSources = new WeakMap();
  let observedRoot = null, observer = null;
  const excluded = 'script,style,textarea,input,#kb,.key,[data-i18n-ignore]';
  function t(key, params = {}) {
    const value = messages[language][key] ?? messages.ru[key] ?? key;
    return value.replace(/\{(\w+)\}/g, (_, name) => Object.hasOwn(params, name) ? String(params[name]) : '{' + name + '}');
  }
  function translateEnglish(text) {
    if (legacy[text]) return legacy[text];
    let s = text;
    s = s.replace(/^Копия от (.+?)\. Уроков в истории: (\d+)\./, 'Backup from $1. Lessons in history: $2.');
    // Structured fragments are kept as fragments because surrounding controls use their own nodes.
    s = s.replace(/Shift не той рукой: для «(.+?)» нужен (левый|правый) Shift\./g, (_, ch, side) => `Wrong Shift hand: «${ch}» needs ${side === 'левый' ? 'left' : 'right'} Shift.`)
      .replace(/Переключи раскладку \(Ctrl\+Space\): нужна (.+?)\./g, 'Switch input layout (Ctrl+Space): $1 is needed.')
      .replace(/знак примерно в каждом ([1-4])-м слове/g, 'a symbol approximately every $1 words')
      .replace(/Знаки (.+?) \(галочки\)/g, '$1 symbols (selection)')
      .replace(/Блок (\d+) из (\d+) готов/g, 'Block $1 of $2 complete')
      .replace(/ · блок (\d+) из (\d+): /g, ' · block $1 of $2: ')
      .replace(/ · всего (\d+)%/g, ' · total $1%')
      .replace(/^всего (\d+)%$/, 'total $1%')
      .replace(/ из 10 мин/g, ' of 10 min')
      .replace(/(\d+) мин\./g, '$1 min.')
      .replace(/Копия от (.+?)\. Уроков в истории: (\d+)\. Будут заменены все семь разделов данных, включая отсутствующие в копии записи\. Сохраните текущую копию перед заменой\. Закройте другие вкладки тренажёра\./g, 'Backup from $1. Lessons in history: $2. All seven data sections will be replaced, including missing records. Save your current backup first. Close other trainer tabs.')
      .replace(/Знаки (.+?): сколько раз встретились \(последние (\d+) ур\.\)/g, '$1 symbols: occurrence counts (last $2 lessons)')
      .replace(/Дней подряд: (\d+) \(день засчитывается от 10 мин\)/g, 'Day streak: $1 (a day requires 10 min)')
      .replace(/в каждом (\d+)-м слове/g, 'every $1 words')
      .replace(/\(было (.+?)\)/g, '(previously $1)')
      .replace(/, уроков (\d+)/g, ', lessons $1')
      .replace(/, быстрых слов (\d+)/g, ', words above ceiling $1')
      .replace(/, Shift (\d+)/g, ', Shift $1');
    for (const [ru, en] of Object.entries({ ...legacy, ...terms }).sort((a,b) => b[0].length - a[0].length)) s = s.split(ru).join(en);
    s = s.replace(/(\d+) мс/g, '$1 ms').replace(/(\d+) мин/g, '$1 min').replace(/(\d+) с(?=[,.;\s]|$)/g, '$1 s');
    s = s.replace(/\bБуква /g, 'Letter ').replace(/, знак /g, ', symbol ').replace(/, цифра /g, ', digit ');
    return s;
  }
  function translateText(text) {
    if (language !== 'en' || typeof text !== 'string') return text;
    const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
    return match ? match[1] + translateEnglish(match[2]) + match[3] : text;
  }
  function shouldSkip(node) {
    const el = node.nodeType === 1 ? node : node.parentElement;
    if (!el || el.closest(excluded)) return true;
    // Actual exercise spans and character cells are data, not UI strings.
    if (el.closest('#text span, #stTable td.ch, #hint b')) return true;
    return false;
  }
  function translateNode(node) {
    if (node.nodeType !== 3 || shouldSkip(node) || !node.nodeValue.trim()) return;
    let entry = textSources.get(node);
    if (!entry || node.nodeValue !== entry.rendered) entry = { source: node.nodeValue, rendered: node.nodeValue };
    const rendered = translateText(entry.source);
    entry.rendered = rendered; textSources.set(node, entry);
    if (node.nodeValue !== rendered) node.nodeValue = rendered;
  }
  function translateAttributes(el) {
    if (el.closest('script,style,#kb,.key,[data-i18n-ignore]')) return;
    for (const attr of ['title','placeholder','aria-label']) {
      const key = el.getAttribute('data-i18n-' + attr);
      if (key) { const value = t(key); if (el.getAttribute(attr) !== value) el.setAttribute(attr, value); continue; }
      if (!el.hasAttribute(attr)) continue;
      let all = attributeSources.get(el); if (!all) { all = {}; attributeSources.set(el, all); }
      const current = el.getAttribute(attr);
      let entry = all[attr]; if (!entry || current !== entry.rendered) entry = {source:current,rendered:current};
      entry.rendered = translateText(entry.source); all[attr] = entry;
      if (current !== entry.rendered) el.setAttribute(attr, entry.rendered);
    }
  }
  function render(root) {
    if (!root) return;
    const doc = root.ownerDocument || root;
    const elements = root.nodeType === 1 ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')];
    for (const el of elements) {
      if (el.matches('[data-i18n]') && !shouldSkip(el)) {
        const value = t(el.getAttribute('data-i18n'));
        if (el.textContent !== value) el.textContent = value;
      }
      translateAttributes(el);
    }
    const walker = doc.createTreeWalker(root, 4);
    let node; while ((node = walker.nextNode())) translateNode(node);
    if (root.nodeType === 3) translateNode(root);
  }
  function init(root = global.document) {
    if (!root) return;
    observedRoot = root;
    if (observer) observer.disconnect();
    render(root);
    if (global.document) global.document.documentElement.lang = language;
    observer = new MutationObserver(records => {
      const seen = new Set();
      for (const record of records) {
        const target = record.type === 'characterData' ? record.target : record.target;
        if (!seen.has(target)) { seen.add(target); if (target.nodeType === 3) translateNode(target); else render(target); }
      }
    });
    observer.observe(root, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['title','placeholder','aria-label','data-i18n']});
  }
  function setLanguage(next) {
    if (!Object.hasOwn(messages, next)) throw new Error('Unsupported UI language: ' + next);
    language = next;
    if (global.document) global.document.documentElement.lang = next;
    if (observedRoot) render(observedRoot);
    if (global.dispatchEvent && global.CustomEvent) global.dispatchEvent(new CustomEvent('tt:ui-language', {detail:{language:next}}));
  }
  function register(locale, dictionary) {
    if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale) || !dictionary || typeof dictionary !== 'object') throw new Error('Invalid UI locale');
    messages[locale] = { ...dictionary };
  }
  function extend(locale, dictionary) { if(!messages[locale])throw new Error('Unsupported UI locale');Object.assign(messages[locale],dictionary); }
  TT2.i18n = { t, init, setLanguage, register, extend, translateText, translateReport: translateText,
    get language() { return language; }, get keys() { return Object.keys(messages.ru); } };
})(globalThis);
