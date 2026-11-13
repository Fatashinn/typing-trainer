# Раскладки: данные, источники и уровень поддержки

Источники — архив Unicode CLDR release-38, реальный commit
`d1c59aeea6a26cd1018e164e8c470e4873925cac` (аннотированный tag-object release-38
имеет другой SHA и не используется как ссылка на исходный файл).
Каждое определение содержит точный `source.url`, `source.file`, имя и версию
платформы из XML. Данные включены локально, runtime-загрузок нет.
Лицензия Unicode сохранена в `platform/UNICODE-LICENSE.txt`.

| id | Название | Источник | Уровень |
|---|---|---|---|
| en-us | English (US) | CLDR osx/en, U.S. | справочная карта; базовый ввод покрыт регрессией |
| ru-pc-mac | Russian – PC — macOS | прежний контракт 1.x, CLDR osx/ru extended как справка | базовый/Shift путь проверен тестами; Option не заявлен |
| ru-mac | Russian — macOS | CLDR osx/ru, платформа 10.9 | экспериментальная, требует современной macOS |
| fr-mac | French — macOS | CLDR osx/fr, платформа 10.9 | экспериментальная, требует современной macOS |
| fr-pc | French AZERTY — PC | CLDR windows/fr | справочная историческая AZERTY, не новая норма NF Z71-300 |
| de-mac | German — macOS | CLDR osx/de, платформа 10.9 | экспериментальная, требует современной macOS |
| de-pc | German QWERTZ — PC | CLDR windows/de | справочная карта, AltGr отдельно от Option |

Файлы источников доступны по шаблону:
`https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/fr-t-k0-osx.xml`.
`platform/layouts.js` содержит ссылки для каждого варианта.
Справочная карта и синтетический тест не заменяют современную ОС и реальную
клавиатуру. В особенности French macOS Backquote/IntlBackslash и ISO требуют
аппаратной проверки. ISO пока отображает дополнительную клавишу у Z;
полная физическая геометрия ISO Return не заявлена.

French PC из этого источника не имеет маршрута для `œ`. Диагностика явно
перечисляет непроверяемый символ и проводит доступную часть; учебный узел,
которому `œ` необходим, сообщает о несовместимости. Это не подмена символа
на `oe` и не заявление, что все французские варианты одинаковы.

## Формат определения v1

```javascript
TT2.registerLayout({
  id: 'example-layout', version: 1, name: 'Example', languages: ['en'],
  support: 'experimental', supportNotes: 'Needs hardware verification',
  source: { provider: 'Vendor', url: 'https://example.org/reference' },
  geometry: { ANSI: 'reference', ISO: 'unverified' },
  keys: {
    KeyA: { base: 'a', shift: 'A', alt: 'æ' },
    Space: { base: ' ', shift: ' ' },
    Quote: { base: '´', dead: { base: '´' } }
  },
  transforms: [{ from: '´a', to: 'á' }]
});
```

Слои: base, shift, alt, shiftAlt (Option), altGr, shiftAltGr.
`dead` помечает слой-префикс; `transforms` описывает NFC-результат двух шагов.
Маршруты содержат `code`, `modifiers`, при необходимости `sequence`.
ANSI исключает IntlBackslash. Реестр не ограничивает допустимый язык ввода.

Для нового варианта: найдите первичный источник ОС, укажите id/version,
добавьте определение через реестр, проверьте все слои и маршруты, затем
проведите реальную проверку code/key/beforeinput/composition в Zen/macOS.
Не маркируйте непроверенную карту как аппаратно подтверждённую.
