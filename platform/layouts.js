/* Reference maps adapted from Unicode CLDR release-38. Sources and limitations: docs/LAYOUTS.md. */
(function (global) {
'use strict';
const TT2 = global.TT2 = global.TT2 || {};
const definitions = {
  "en-us": {
    "id": "en-us",
    "version": 1,
    "name": "English (US)",
    "languages": [
      "en"
    ],
    "support": "reference",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/osx/en-t-k0-osx.xml",
      "platform": "10.9",
      "name": "U.S.",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/en-t-k0-osx.xml"
    },
    "geometry": {
      "ANSI": "reference-positions; hardware unverified",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "`",
        "shift": "~",
        "alt": "`",
        "shiftAlt": "`",
        "dead": {
          "alt": "`"
        }
      },
      "Digit1": {
        "base": "1",
        "shift": "!",
        "alt": "¡",
        "shiftAlt": "⁄"
      },
      "Digit2": {
        "base": "2",
        "shift": "@",
        "alt": "™",
        "shiftAlt": "€"
      },
      "Digit3": {
        "base": "3",
        "shift": "#",
        "alt": "£",
        "shiftAlt": "‹"
      },
      "Digit4": {
        "base": "4",
        "shift": "$",
        "alt": "¢",
        "shiftAlt": "›"
      },
      "Digit5": {
        "base": "5",
        "shift": "%",
        "alt": "∞",
        "shiftAlt": "ﬁ"
      },
      "Digit6": {
        "base": "6",
        "shift": "^",
        "alt": "§",
        "shiftAlt": "ﬂ"
      },
      "Digit7": {
        "base": "7",
        "shift": "&",
        "alt": "¶",
        "shiftAlt": "‡"
      },
      "Digit8": {
        "base": "8",
        "shift": "*",
        "alt": "•",
        "shiftAlt": "°"
      },
      "Digit9": {
        "base": "9",
        "shift": "(",
        "alt": "ª",
        "shiftAlt": "·"
      },
      "Digit0": {
        "base": "0",
        "shift": ")",
        "alt": "º",
        "shiftAlt": "‚"
      },
      "Minus": {
        "base": "-",
        "shift": "_",
        "alt": "–",
        "shiftAlt": "—"
      },
      "Equal": {
        "base": "=",
        "shift": "+",
        "alt": "≠",
        "shiftAlt": "±"
      },
      "KeyQ": {
        "base": "q",
        "shift": "Q",
        "alt": "œ",
        "shiftAlt": "Œ"
      },
      "KeyW": {
        "base": "w",
        "shift": "W",
        "alt": "∑",
        "shiftAlt": "„"
      },
      "KeyE": {
        "base": "e",
        "shift": "E",
        "alt": "´",
        "shiftAlt": "´",
        "dead": {
          "alt": "´"
        }
      },
      "KeyR": {
        "base": "r",
        "shift": "R",
        "alt": "®",
        "shiftAlt": "‰"
      },
      "KeyT": {
        "base": "t",
        "shift": "T",
        "alt": "†",
        "shiftAlt": "ˇ"
      },
      "KeyY": {
        "base": "y",
        "shift": "Y",
        "alt": "¥",
        "shiftAlt": "Á"
      },
      "KeyU": {
        "base": "u",
        "shift": "U",
        "alt": "¨",
        "shiftAlt": "¨",
        "dead": {
          "alt": "¨"
        }
      },
      "KeyI": {
        "base": "i",
        "shift": "I",
        "alt": "ˆ",
        "shiftAlt": "ˆ",
        "dead": {
          "alt": "ˆ"
        }
      },
      "KeyO": {
        "base": "o",
        "shift": "O",
        "alt": "ø",
        "shiftAlt": "Ø"
      },
      "KeyP": {
        "base": "p",
        "shift": "P",
        "alt": "π",
        "shiftAlt": "∏"
      },
      "BracketLeft": {
        "base": "[",
        "shift": "{",
        "alt": "“",
        "shiftAlt": "”"
      },
      "BracketRight": {
        "base": "]",
        "shift": "}",
        "alt": "‘",
        "shiftAlt": "’"
      },
      "Backslash": {
        "base": "\\",
        "shift": "|",
        "alt": "«",
        "shiftAlt": "»"
      },
      "KeyA": {
        "base": "a",
        "shift": "A",
        "alt": "å",
        "shiftAlt": "Å"
      },
      "KeyS": {
        "base": "s",
        "shift": "S",
        "alt": "ß",
        "shiftAlt": "Í"
      },
      "KeyD": {
        "base": "d",
        "shift": "D",
        "alt": "∂",
        "shiftAlt": "Î"
      },
      "KeyF": {
        "base": "f",
        "shift": "F",
        "alt": "ƒ",
        "shiftAlt": "Ï"
      },
      "KeyG": {
        "base": "g",
        "shift": "G",
        "alt": "©",
        "shiftAlt": "˝"
      },
      "KeyH": {
        "base": "h",
        "shift": "H",
        "alt": "˙",
        "shiftAlt": "Ó"
      },
      "KeyJ": {
        "base": "j",
        "shift": "J",
        "alt": "∆",
        "shiftAlt": "Ô"
      },
      "KeyK": {
        "base": "k",
        "shift": "K",
        "alt": "˚",
        "shiftAlt": ""
      },
      "KeyL": {
        "base": "l",
        "shift": "L",
        "alt": "¬",
        "shiftAlt": "Ò"
      },
      "Semicolon": {
        "base": ";",
        "shift": ":",
        "alt": "…",
        "shiftAlt": "Ú"
      },
      "Quote": {
        "base": "'",
        "shift": "\"",
        "alt": "æ",
        "shiftAlt": "Æ"
      },
      "IntlBackslash": {
        "base": "§",
        "shift": "±",
        "alt": "§",
        "shiftAlt": "±"
      },
      "KeyZ": {
        "base": "z",
        "shift": "Z",
        "alt": "Ω",
        "shiftAlt": "¸"
      },
      "KeyX": {
        "base": "x",
        "shift": "X",
        "alt": "≈",
        "shiftAlt": "˛"
      },
      "KeyC": {
        "base": "c",
        "shift": "C",
        "alt": "ç",
        "shiftAlt": "Ç"
      },
      "KeyV": {
        "base": "v",
        "shift": "V",
        "alt": "√",
        "shiftAlt": "◊"
      },
      "KeyB": {
        "base": "b",
        "shift": "B",
        "alt": "∫",
        "shiftAlt": "ı"
      },
      "KeyN": {
        "base": "n",
        "shift": "N",
        "alt": "˜",
        "shiftAlt": "˜",
        "dead": {
          "alt": "˜"
        }
      },
      "KeyM": {
        "base": "m",
        "shift": "M",
        "alt": "µ",
        "shiftAlt": "Â"
      },
      "Comma": {
        "base": ",",
        "shift": "<",
        "alt": "≤",
        "shiftAlt": "¯"
      },
      "Period": {
        "base": ".",
        "shift": ">",
        "alt": "≥",
        "shiftAlt": "˘"
      },
      "Slash": {
        "base": "/",
        "shift": "?",
        "alt": "÷",
        "shiftAlt": "¿"
      },
      "Space": {
        "base": " ",
        "shift": " ",
        "alt": " ",
        "shiftAlt": " "
      }
    },
    "transforms": [
      {
        "from": "` ",
        "to": "`"
      },
      {
        "from": "`a",
        "to": "à"
      },
      {
        "from": "`A",
        "to": "À"
      },
      {
        "from": "`e",
        "to": "è"
      },
      {
        "from": "`E",
        "to": "È"
      },
      {
        "from": "`i",
        "to": "ì"
      },
      {
        "from": "`I",
        "to": "Ì"
      },
      {
        "from": "`o",
        "to": "ò"
      },
      {
        "from": "`O",
        "to": "Ò"
      },
      {
        "from": "`u",
        "to": "ù"
      },
      {
        "from": "`U",
        "to": "Ù"
      },
      {
        "from": "´ ",
        "to": "´"
      },
      {
        "from": "´a",
        "to": "á"
      },
      {
        "from": "´A",
        "to": "Á"
      },
      {
        "from": "´e",
        "to": "é"
      },
      {
        "from": "´E",
        "to": "É"
      },
      {
        "from": "´i",
        "to": "í"
      },
      {
        "from": "´I",
        "to": "Í"
      },
      {
        "from": "´o",
        "to": "ó"
      },
      {
        "from": "´O",
        "to": "Ó"
      },
      {
        "from": "´u",
        "to": "ú"
      },
      {
        "from": "´U",
        "to": "Ú"
      },
      {
        "from": "˜ ",
        "to": "˜"
      },
      {
        "from": "˜a",
        "to": "ã"
      },
      {
        "from": "˜A",
        "to": "Ã"
      },
      {
        "from": "˜n",
        "to": "ñ"
      },
      {
        "from": "˜N",
        "to": "Ñ"
      },
      {
        "from": "˜o",
        "to": "õ"
      },
      {
        "from": "˜O",
        "to": "Õ"
      },
      {
        "from": "¨ ",
        "to": "¨"
      },
      {
        "from": "¨a",
        "to": "ä"
      },
      {
        "from": "¨A",
        "to": "Ä"
      },
      {
        "from": "¨e",
        "to": "ë"
      },
      {
        "from": "¨E",
        "to": "Ë"
      },
      {
        "from": "¨i",
        "to": "ï"
      },
      {
        "from": "¨I",
        "to": "Ï"
      },
      {
        "from": "¨o",
        "to": "ö"
      },
      {
        "from": "¨O",
        "to": "Ö"
      },
      {
        "from": "¨u",
        "to": "ü"
      },
      {
        "from": "¨U",
        "to": "Ü"
      },
      {
        "from": "¨y",
        "to": "ÿ"
      },
      {
        "from": "¨Y",
        "to": "Ÿ"
      },
      {
        "from": "ˆ ",
        "to": "ˆ"
      },
      {
        "from": "ˆa",
        "to": "â"
      },
      {
        "from": "ˆA",
        "to": "Â"
      },
      {
        "from": "ˆe",
        "to": "ê"
      },
      {
        "from": "ˆE",
        "to": "Ê"
      },
      {
        "from": "ˆi",
        "to": "î"
      },
      {
        "from": "ˆI",
        "to": "Î"
      },
      {
        "from": "ˆo",
        "to": "ô"
      },
      {
        "from": "ˆO",
        "to": "Ô"
      },
      {
        "from": "ˆu",
        "to": "û"
      },
      {
        "from": "ˆU",
        "to": "Û"
      }
    ]
  },
  "ru-pc-mac": {
    "id": "ru-pc-mac",
    "version": 1,
    "name": "Russian – PC (macOS)",
    "languages": [
      "ru"
    ],
    "support": "legacy-tested",
    "supportNotes": "Base/Shift preserve the shipped 1.x ANSI contract; Option combinations are intentionally unavailable until verified.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/osx/ru-t-k0-osx-extended.xml",
      "platform": "10.9",
      "name": "RussianWin",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/ru-t-k0-osx-extended.xml"
    },
    "geometry": {
      "ANSI": "legacy-regression-tested",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "ё",
        "shift": "Ё"
      },
      "Digit1": {
        "base": "1",
        "shift": "!"
      },
      "Digit2": {
        "base": "2",
        "shift": "\""
      },
      "Digit3": {
        "base": "3",
        "shift": "№"
      },
      "Digit4": {
        "base": "4",
        "shift": ";"
      },
      "Digit5": {
        "base": "5",
        "shift": "%"
      },
      "Digit6": {
        "base": "6",
        "shift": ":"
      },
      "Digit7": {
        "base": "7",
        "shift": "?"
      },
      "Digit8": {
        "base": "8",
        "shift": "*"
      },
      "Digit9": {
        "base": "9",
        "shift": "("
      },
      "Digit0": {
        "base": "0",
        "shift": ")"
      },
      "Minus": {
        "base": "-",
        "shift": "_"
      },
      "Equal": {
        "base": "=",
        "shift": "+"
      },
      "KeyQ": {
        "base": "й",
        "shift": "Й"
      },
      "KeyW": {
        "base": "ц",
        "shift": "Ц"
      },
      "KeyE": {
        "base": "у",
        "shift": "У"
      },
      "KeyR": {
        "base": "к",
        "shift": "К"
      },
      "KeyT": {
        "base": "е",
        "shift": "Е"
      },
      "KeyY": {
        "base": "н",
        "shift": "Н"
      },
      "KeyU": {
        "base": "г",
        "shift": "Г"
      },
      "KeyI": {
        "base": "ш",
        "shift": "Ш"
      },
      "KeyO": {
        "base": "щ",
        "shift": "Щ"
      },
      "KeyP": {
        "base": "з",
        "shift": "З"
      },
      "BracketLeft": {
        "base": "х",
        "shift": "Х"
      },
      "BracketRight": {
        "base": "ъ",
        "shift": "Ъ"
      },
      "Backslash": {
        "base": "\\",
        "shift": "/"
      },
      "KeyA": {
        "base": "ф",
        "shift": "Ф"
      },
      "KeyS": {
        "base": "ы",
        "shift": "Ы"
      },
      "KeyD": {
        "base": "в",
        "shift": "В"
      },
      "KeyF": {
        "base": "а",
        "shift": "А"
      },
      "KeyG": {
        "base": "п",
        "shift": "П"
      },
      "KeyH": {
        "base": "р",
        "shift": "Р"
      },
      "KeyJ": {
        "base": "о",
        "shift": "О"
      },
      "KeyK": {
        "base": "л",
        "shift": "Л"
      },
      "KeyL": {
        "base": "д",
        "shift": "Д"
      },
      "Semicolon": {
        "base": "ж",
        "shift": "Ж"
      },
      "Quote": {
        "base": "э",
        "shift": "Э"
      },
      "IntlBackslash": {
        "base": "\\",
        "shift": "/"
      },
      "KeyZ": {
        "base": "я",
        "shift": "Я"
      },
      "KeyX": {
        "base": "ч",
        "shift": "Ч"
      },
      "KeyC": {
        "base": "с",
        "shift": "С"
      },
      "KeyV": {
        "base": "м",
        "shift": "М"
      },
      "KeyB": {
        "base": "и",
        "shift": "И"
      },
      "KeyN": {
        "base": "т",
        "shift": "Т"
      },
      "KeyM": {
        "base": "ь",
        "shift": "Ь"
      },
      "Comma": {
        "base": "б",
        "shift": "Б"
      },
      "Period": {
        "base": "ю",
        "shift": "Ю"
      },
      "Slash": {
        "base": ".",
        "shift": ","
      },
      "Space": {
        "base": " ",
        "shift": " "
      }
    },
    "transforms": []
  },
  "ru-mac": {
    "id": "ru-mac",
    "version": 1,
    "name": "Russian (macOS)",
    "languages": [
      "ru"
    ],
    "support": "experimental",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified. CLDR macOS source is platform 10.9; Backquote/IntlBackslash mapping may differ on ANSI/ISO and in browser events.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/osx/ru-t-k0-osx.xml",
      "platform": "10.9",
      "name": "Russian",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/ru-t-k0-osx.xml"
    },
    "geometry": {
      "ANSI": "experimental; check Backquote/IntlBackslash",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "]",
        "shift": "[",
        "alt": "]",
        "shiftAlt": "["
      },
      "Digit1": {
        "base": "1",
        "shift": "!",
        "alt": "!",
        "shiftAlt": "|"
      },
      "Digit2": {
        "base": "2",
        "shift": "\"",
        "alt": "@",
        "shiftAlt": "\""
      },
      "Digit3": {
        "base": "3",
        "shift": "№",
        "alt": "#",
        "shiftAlt": "£"
      },
      "Digit4": {
        "base": "4",
        "shift": "%",
        "alt": "$",
        "shiftAlt": "€"
      },
      "Digit5": {
        "base": "5",
        "shift": ":",
        "alt": "%",
        "shiftAlt": "∞"
      },
      "Digit6": {
        "base": "6",
        "shift": ",",
        "alt": "^",
        "shiftAlt": "¬"
      },
      "Digit7": {
        "base": "7",
        "shift": ".",
        "alt": "&",
        "shiftAlt": "¶"
      },
      "Digit8": {
        "base": "8",
        "shift": ";",
        "alt": "*",
        "shiftAlt": "√"
      },
      "Digit9": {
        "base": "9",
        "shift": "(",
        "alt": "(",
        "shiftAlt": "'"
      },
      "Digit0": {
        "base": "0",
        "shift": ")",
        "alt": ")",
        "shiftAlt": "`"
      },
      "Minus": {
        "base": "-",
        "shift": "_",
        "alt": "–",
        "shiftAlt": "—"
      },
      "Equal": {
        "base": "=",
        "shift": "+",
        "alt": "»",
        "shiftAlt": "«"
      },
      "KeyQ": {
        "base": "й",
        "shift": "Й",
        "alt": "ј",
        "shiftAlt": "Ј"
      },
      "KeyW": {
        "base": "ц",
        "shift": "Ц",
        "alt": "џ",
        "shiftAlt": "Џ"
      },
      "KeyE": {
        "base": "у",
        "shift": "У",
        "alt": "ќ",
        "shiftAlt": "Ќ"
      },
      "KeyR": {
        "base": "к",
        "shift": "К",
        "alt": "®",
        "shiftAlt": "®"
      },
      "KeyT": {
        "base": "е",
        "shift": "Е",
        "alt": "†",
        "shiftAlt": "†"
      },
      "KeyY": {
        "base": "н",
        "shift": "Н",
        "alt": "њ",
        "shiftAlt": "Њ"
      },
      "KeyU": {
        "base": "г",
        "shift": "Г",
        "alt": "ѓ",
        "shiftAlt": "Ѓ"
      },
      "KeyI": {
        "base": "ш",
        "shift": "Ш",
        "alt": "ѕ",
        "shiftAlt": "Ѕ"
      },
      "KeyO": {
        "base": "щ",
        "shift": "Щ",
        "alt": "ў",
        "shiftAlt": "Ў"
      },
      "KeyP": {
        "base": "з",
        "shift": "З",
        "alt": "‘",
        "shiftAlt": "’"
      },
      "BracketLeft": {
        "base": "х",
        "shift": "Х",
        "alt": "“",
        "shiftAlt": "”"
      },
      "BracketRight": {
        "base": "ъ",
        "shift": "Ъ",
        "alt": "ъ",
        "shiftAlt": "Ъ"
      },
      "Backslash": {
        "base": "ё",
        "shift": "Ё",
        "alt": "ё",
        "shiftAlt": "Ё"
      },
      "KeyA": {
        "base": "ф",
        "shift": "Ф",
        "alt": "ƒ",
        "shiftAlt": "ƒ"
      },
      "KeyS": {
        "base": "ы",
        "shift": "Ы",
        "alt": "ы",
        "shiftAlt": "Ы"
      },
      "KeyD": {
        "base": "в",
        "shift": "В",
        "alt": "ћ",
        "shiftAlt": "Ћ"
      },
      "KeyF": {
        "base": "а",
        "shift": "А",
        "alt": "÷",
        "shiftAlt": "÷"
      },
      "KeyG": {
        "base": "п",
        "shift": "П",
        "alt": "©",
        "shiftAlt": "©"
      },
      "KeyH": {
        "base": "р",
        "shift": "Р",
        "alt": "}",
        "shiftAlt": "{"
      },
      "KeyJ": {
        "base": "о",
        "shift": "О",
        "alt": "°",
        "shiftAlt": "•"
      },
      "KeyK": {
        "base": "л",
        "shift": "Л",
        "alt": "љ",
        "shiftAlt": "Љ"
      },
      "KeyL": {
        "base": "д",
        "shift": "Д",
        "alt": "∆",
        "shiftAlt": "∆"
      },
      "Semicolon": {
        "base": "ж",
        "shift": "Ж",
        "alt": "…",
        "shiftAlt": "…"
      },
      "Quote": {
        "base": "э",
        "shift": "Э",
        "alt": "э",
        "shiftAlt": "Э"
      },
      "IntlBackslash": {
        "base": ">",
        "shift": "<",
        "alt": "§",
        "shiftAlt": "±"
      },
      "KeyZ": {
        "base": "я",
        "shift": "Я",
        "alt": "ђ",
        "shiftAlt": "Ђ"
      },
      "KeyX": {
        "base": "ч",
        "shift": "Ч",
        "alt": "≈",
        "shiftAlt": "≈"
      },
      "KeyC": {
        "base": "с",
        "shift": "С",
        "alt": "≠",
        "shiftAlt": "≠"
      },
      "KeyV": {
        "base": "м",
        "shift": "М",
        "alt": "µ",
        "shiftAlt": "µ"
      },
      "KeyB": {
        "base": "и",
        "shift": "И",
        "alt": "и",
        "shiftAlt": "И"
      },
      "KeyN": {
        "base": "т",
        "shift": "Т",
        "alt": "™",
        "shiftAlt": "™"
      },
      "KeyM": {
        "base": "ь",
        "shift": "Ь",
        "alt": "~",
        "shiftAlt": "~"
      },
      "Comma": {
        "base": "б",
        "shift": "Б",
        "alt": "≤",
        "shiftAlt": "<"
      },
      "Period": {
        "base": "ю",
        "shift": "Ю",
        "alt": "≥",
        "shiftAlt": ">"
      },
      "Slash": {
        "base": "/",
        "shift": "?",
        "alt": "“",
        "shiftAlt": "„"
      },
      "Space": {
        "base": " ",
        "shift": " ",
        "alt": " ",
        "shiftAlt": " "
      }
    },
    "transforms": []
  },
  "fr-mac": {
    "id": "fr-mac",
    "version": 1,
    "name": "French (macOS)",
    "languages": [
      "fr"
    ],
    "support": "experimental",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified. CLDR macOS source is platform 10.9; Backquote/IntlBackslash mapping may differ on ANSI/ISO and in browser events.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/osx/fr-t-k0-osx.xml",
      "platform": "10.9",
      "name": "French",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/fr-t-k0-osx.xml"
    },
    "geometry": {
      "ANSI": "experimental; check Backquote/IntlBackslash",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "<",
        "shift": ">",
        "alt": "≤",
        "shiftAlt": "≥"
      },
      "Digit1": {
        "base": "&",
        "shift": "1",
        "alt": "",
        "shiftAlt": "´",
        "dead": {
          "shiftAlt": "´"
        }
      },
      "Digit2": {
        "base": "é",
        "shift": "2",
        "alt": "ë",
        "shiftAlt": "„"
      },
      "Digit3": {
        "base": "\"",
        "shift": "3",
        "alt": "“",
        "shiftAlt": "”"
      },
      "Digit4": {
        "base": "'",
        "shift": "4",
        "alt": "‘",
        "shiftAlt": "’"
      },
      "Digit5": {
        "base": "(",
        "shift": "5",
        "alt": "{",
        "shiftAlt": "["
      },
      "Digit6": {
        "base": "§",
        "shift": "6",
        "alt": "¶",
        "shiftAlt": "å"
      },
      "Digit7": {
        "base": "è",
        "shift": "7",
        "alt": "«",
        "shiftAlt": "»"
      },
      "Digit8": {
        "base": "!",
        "shift": "8",
        "alt": "¡",
        "shiftAlt": "Û"
      },
      "Digit9": {
        "base": "ç",
        "shift": "9",
        "alt": "Ç",
        "shiftAlt": "Á"
      },
      "Digit0": {
        "base": "à",
        "shift": "0",
        "alt": "ø",
        "shiftAlt": "Ø"
      },
      "Minus": {
        "base": ")",
        "shift": "°",
        "alt": "}",
        "shiftAlt": "]"
      },
      "Equal": {
        "base": "-",
        "shift": "_",
        "alt": "—",
        "shiftAlt": "–"
      },
      "KeyQ": {
        "base": "a",
        "shift": "A",
        "alt": "æ",
        "shiftAlt": "Æ"
      },
      "KeyW": {
        "base": "z",
        "shift": "Z",
        "alt": "Â",
        "shiftAlt": "Å"
      },
      "KeyE": {
        "base": "e",
        "shift": "E",
        "alt": "ê",
        "shiftAlt": "Ê"
      },
      "KeyR": {
        "base": "r",
        "shift": "R",
        "alt": "®",
        "shiftAlt": "‚"
      },
      "KeyT": {
        "base": "t",
        "shift": "T",
        "alt": "†",
        "shiftAlt": "™"
      },
      "KeyY": {
        "base": "y",
        "shift": "Y",
        "alt": "Ú",
        "shiftAlt": "Ÿ"
      },
      "KeyU": {
        "base": "u",
        "shift": "U",
        "alt": "º",
        "shiftAlt": "ª"
      },
      "KeyI": {
        "base": "i",
        "shift": "I",
        "alt": "î",
        "shiftAlt": "ï"
      },
      "KeyO": {
        "base": "o",
        "shift": "O",
        "alt": "œ",
        "shiftAlt": "Œ"
      },
      "KeyP": {
        "base": "p",
        "shift": "P",
        "alt": "π",
        "shiftAlt": "∏"
      },
      "BracketLeft": {
        "base": "^",
        "shift": "¨",
        "alt": "ô",
        "shiftAlt": "Ô",
        "dead": {
          "base": "^",
          "shift": "¨"
        }
      },
      "BracketRight": {
        "base": "$",
        "shift": "*",
        "alt": "€",
        "shiftAlt": "¥"
      },
      "Backslash": {
        "base": "`",
        "shift": "£",
        "alt": "@",
        "shiftAlt": "#",
        "dead": {
          "base": "`"
        }
      },
      "KeyA": {
        "base": "q",
        "shift": "Q",
        "alt": "‡",
        "shiftAlt": "Ω"
      },
      "KeyS": {
        "base": "s",
        "shift": "S",
        "alt": "Ò",
        "shiftAlt": "∑"
      },
      "KeyD": {
        "base": "d",
        "shift": "D",
        "alt": "∂",
        "shiftAlt": "∆"
      },
      "KeyF": {
        "base": "f",
        "shift": "F",
        "alt": "ƒ",
        "shiftAlt": "·"
      },
      "KeyG": {
        "base": "g",
        "shift": "G",
        "alt": "ﬁ",
        "shiftAlt": "ﬂ"
      },
      "KeyH": {
        "base": "h",
        "shift": "H",
        "alt": "Ì",
        "shiftAlt": "Î"
      },
      "KeyJ": {
        "base": "j",
        "shift": "J",
        "alt": "Ï",
        "shiftAlt": "Í"
      },
      "KeyK": {
        "base": "k",
        "shift": "K",
        "alt": "È",
        "shiftAlt": "Ë"
      },
      "KeyL": {
        "base": "l",
        "shift": "L",
        "alt": "¬",
        "shiftAlt": "|"
      },
      "Semicolon": {
        "base": "m",
        "shift": "M",
        "alt": "µ",
        "shiftAlt": "Ó"
      },
      "Quote": {
        "base": "ù",
        "shift": "%",
        "alt": "Ù",
        "shiftAlt": "‰"
      },
      "IntlBackslash": {
        "base": "@",
        "shift": "#",
        "alt": "•",
        "shiftAlt": "Ÿ"
      },
      "KeyZ": {
        "base": "w",
        "shift": "W",
        "alt": "‹",
        "shiftAlt": "›"
      },
      "KeyX": {
        "base": "x",
        "shift": "X",
        "alt": "≈",
        "shiftAlt": "⁄"
      },
      "KeyC": {
        "base": "c",
        "shift": "C",
        "alt": "©",
        "shiftAlt": "¢"
      },
      "KeyV": {
        "base": "v",
        "shift": "V",
        "alt": "◊",
        "shiftAlt": "√"
      },
      "KeyB": {
        "base": "b",
        "shift": "B",
        "alt": "ß",
        "shiftAlt": "∫"
      },
      "KeyN": {
        "base": "n",
        "shift": "N",
        "alt": "~",
        "shiftAlt": "ı",
        "dead": {
          "alt": "~"
        }
      },
      "KeyM": {
        "base": ",",
        "shift": "?",
        "alt": "∞",
        "shiftAlt": "¿"
      },
      "Comma": {
        "base": ";",
        "shift": ".",
        "alt": "…",
        "shiftAlt": "•"
      },
      "Period": {
        "base": ":",
        "shift": "/",
        "alt": "÷",
        "shiftAlt": "\\"
      },
      "Slash": {
        "base": "=",
        "shift": "+",
        "alt": "≠",
        "shiftAlt": "±"
      },
      "Space": {
        "base": " ",
        "shift": " ",
        "alt": " ",
        "shiftAlt": " "
      }
    },
    "transforms": [
      {
        "from": "` ",
        "to": "`"
      },
      {
        "from": "`a",
        "to": "à"
      },
      {
        "from": "`A",
        "to": "À"
      },
      {
        "from": "`e",
        "to": "è"
      },
      {
        "from": "`E",
        "to": "È"
      },
      {
        "from": "`i",
        "to": "ì"
      },
      {
        "from": "`I",
        "to": "Ì"
      },
      {
        "from": "`o",
        "to": "ò"
      },
      {
        "from": "`O",
        "to": "Ò"
      },
      {
        "from": "`u",
        "to": "ù"
      },
      {
        "from": "`U",
        "to": "Ù"
      },
      {
        "from": "´ ",
        "to": "´"
      },
      {
        "from": "´a",
        "to": "á"
      },
      {
        "from": "´A",
        "to": "Á"
      },
      {
        "from": "´e",
        "to": "é"
      },
      {
        "from": "´E",
        "to": "É"
      },
      {
        "from": "´i",
        "to": "í"
      },
      {
        "from": "´I",
        "to": "Í"
      },
      {
        "from": "´o",
        "to": "ó"
      },
      {
        "from": "´O",
        "to": "Ó"
      },
      {
        "from": "´u",
        "to": "ú"
      },
      {
        "from": "´U",
        "to": "Ú"
      },
      {
        "from": "^ ",
        "to": "^"
      },
      {
        "from": "^a",
        "to": "â"
      },
      {
        "from": "^A",
        "to": "Â"
      },
      {
        "from": "^e",
        "to": "ê"
      },
      {
        "from": "^E",
        "to": "Ê"
      },
      {
        "from": "^i",
        "to": "î"
      },
      {
        "from": "^I",
        "to": "Î"
      },
      {
        "from": "^o",
        "to": "ô"
      },
      {
        "from": "^O",
        "to": "Ô"
      },
      {
        "from": "^u",
        "to": "û"
      },
      {
        "from": "^U",
        "to": "Û"
      },
      {
        "from": "¨ ",
        "to": "¨"
      },
      {
        "from": "¨a",
        "to": "ä"
      },
      {
        "from": "¨A",
        "to": "Ä"
      },
      {
        "from": "¨e",
        "to": "ë"
      },
      {
        "from": "¨E",
        "to": "Ë"
      },
      {
        "from": "¨i",
        "to": "ï"
      },
      {
        "from": "¨I",
        "to": "Ï"
      },
      {
        "from": "¨o",
        "to": "ö"
      },
      {
        "from": "¨O",
        "to": "Ö"
      },
      {
        "from": "¨u",
        "to": "ü"
      },
      {
        "from": "¨U",
        "to": "Ü"
      },
      {
        "from": "¨y",
        "to": "ÿ"
      },
      {
        "from": "¨Y",
        "to": "Ÿ"
      },
      {
        "from": "~ ",
        "to": "~"
      },
      {
        "from": "~a",
        "to": "ã"
      },
      {
        "from": "~A",
        "to": "Ã"
      },
      {
        "from": "~n",
        "to": "ñ"
      },
      {
        "from": "~N",
        "to": "Ñ"
      },
      {
        "from": "~o",
        "to": "õ"
      },
      {
        "from": "~O",
        "to": "Õ"
      }
    ]
  },
  "fr-pc": {
    "id": "fr-pc",
    "version": 1,
    "name": "French AZERTY (PC)",
    "languages": [
      "fr"
    ],
    "support": "reference",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/windows/fr-t-k0-windows.xml",
      "platform": "10",
      "name": "French",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/windows/fr-t-k0-windows.xml"
    },
    "geometry": {
      "ANSI": "reference-positions; hardware unverified",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "²"
      },
      "Digit1": {
        "base": "&",
        "shift": "1"
      },
      "Digit2": {
        "base": "é",
        "shift": "2",
        "altGr": "~",
        "dead": {
          "altGr": "~"
        }
      },
      "Digit3": {
        "base": "\"",
        "shift": "3",
        "altGr": "#"
      },
      "Digit4": {
        "base": "'",
        "shift": "4",
        "altGr": "{"
      },
      "Digit5": {
        "base": "(",
        "shift": "5",
        "altGr": "["
      },
      "Digit6": {
        "base": "-",
        "shift": "6",
        "altGr": "|"
      },
      "Digit7": {
        "base": "è",
        "shift": "7",
        "altGr": "`",
        "dead": {
          "altGr": "`"
        }
      },
      "Digit8": {
        "base": "_",
        "shift": "8",
        "altGr": "\\"
      },
      "Digit9": {
        "base": "ç",
        "shift": "9",
        "altGr": "^"
      },
      "Digit0": {
        "base": "à",
        "shift": "0",
        "altGr": "@"
      },
      "Minus": {
        "base": ")",
        "shift": "°",
        "altGr": "]"
      },
      "Equal": {
        "base": "=",
        "shift": "+",
        "altGr": "}"
      },
      "KeyQ": {
        "base": "a",
        "shift": "A"
      },
      "KeyW": {
        "base": "z",
        "shift": "Z"
      },
      "KeyE": {
        "base": "e",
        "shift": "E",
        "altGr": "€"
      },
      "KeyR": {
        "base": "r",
        "shift": "R"
      },
      "KeyT": {
        "base": "t",
        "shift": "T"
      },
      "KeyY": {
        "base": "y",
        "shift": "Y"
      },
      "KeyU": {
        "base": "u",
        "shift": "U"
      },
      "KeyI": {
        "base": "i",
        "shift": "I"
      },
      "KeyO": {
        "base": "o",
        "shift": "O"
      },
      "KeyP": {
        "base": "p",
        "shift": "P"
      },
      "BracketLeft": {
        "base": "^",
        "shift": "¨",
        "dead": {
          "base": "^",
          "shift": "¨"
        }
      },
      "BracketRight": {
        "base": "$",
        "shift": "£",
        "altGr": "¤"
      },
      "KeyA": {
        "base": "q",
        "shift": "Q"
      },
      "KeyS": {
        "base": "s",
        "shift": "S"
      },
      "KeyD": {
        "base": "d",
        "shift": "D"
      },
      "KeyF": {
        "base": "f",
        "shift": "F"
      },
      "KeyG": {
        "base": "g",
        "shift": "G"
      },
      "KeyH": {
        "base": "h",
        "shift": "H"
      },
      "KeyJ": {
        "base": "j",
        "shift": "J"
      },
      "KeyK": {
        "base": "k",
        "shift": "K"
      },
      "KeyL": {
        "base": "l",
        "shift": "L"
      },
      "Semicolon": {
        "base": "m",
        "shift": "M"
      },
      "Quote": {
        "base": "ù",
        "shift": "%"
      },
      "Backslash": {
        "base": "*",
        "shift": "µ"
      },
      "IntlBackslash": {
        "base": "<",
        "shift": ">"
      },
      "KeyZ": {
        "base": "w",
        "shift": "W"
      },
      "KeyX": {
        "base": "x",
        "shift": "X"
      },
      "KeyC": {
        "base": "c",
        "shift": "C"
      },
      "KeyV": {
        "base": "v",
        "shift": "V"
      },
      "KeyB": {
        "base": "b",
        "shift": "B"
      },
      "KeyN": {
        "base": "n",
        "shift": "N"
      },
      "KeyM": {
        "base": ",",
        "shift": "?"
      },
      "Comma": {
        "base": ";",
        "shift": "."
      },
      "Period": {
        "base": ":",
        "shift": "/"
      },
      "Slash": {
        "base": "!",
        "shift": "§"
      },
      "Space": {
        "base": " ",
        "shift": " "
      }
    },
    "transforms": [
      {
        "from": "` ",
        "to": "`"
      },
      {
        "from": "`a",
        "to": "à"
      },
      {
        "from": "`A",
        "to": "À"
      },
      {
        "from": "`e",
        "to": "è"
      },
      {
        "from": "`E",
        "to": "È"
      },
      {
        "from": "`i",
        "to": "ì"
      },
      {
        "from": "`I",
        "to": "Ì"
      },
      {
        "from": "`o",
        "to": "ò"
      },
      {
        "from": "`O",
        "to": "Ò"
      },
      {
        "from": "`u",
        "to": "ù"
      },
      {
        "from": "`U",
        "to": "Ù"
      },
      {
        "from": "^ ",
        "to": "^"
      },
      {
        "from": "^a",
        "to": "â"
      },
      {
        "from": "^A",
        "to": "Â"
      },
      {
        "from": "^e",
        "to": "ê"
      },
      {
        "from": "^E",
        "to": "Ê"
      },
      {
        "from": "^i",
        "to": "î"
      },
      {
        "from": "^I",
        "to": "Î"
      },
      {
        "from": "^o",
        "to": "ô"
      },
      {
        "from": "^O",
        "to": "Ô"
      },
      {
        "from": "^u",
        "to": "û"
      },
      {
        "from": "^U",
        "to": "Û"
      },
      {
        "from": "¨ ",
        "to": "¨"
      },
      {
        "from": "¨a",
        "to": "ä"
      },
      {
        "from": "¨A",
        "to": "Ä"
      },
      {
        "from": "¨e",
        "to": "ë"
      },
      {
        "from": "¨E",
        "to": "Ë"
      },
      {
        "from": "¨i",
        "to": "ï"
      },
      {
        "from": "¨I",
        "to": "Ï"
      },
      {
        "from": "¨o",
        "to": "ö"
      },
      {
        "from": "¨O",
        "to": "Ö"
      },
      {
        "from": "¨u",
        "to": "ü"
      },
      {
        "from": "¨U",
        "to": "Ü"
      },
      {
        "from": "¨y",
        "to": "ÿ"
      },
      {
        "from": "~ ",
        "to": "~"
      },
      {
        "from": "~a",
        "to": "ã"
      },
      {
        "from": "~A",
        "to": "Ã"
      },
      {
        "from": "~n",
        "to": "ñ"
      },
      {
        "from": "~N",
        "to": "Ñ"
      },
      {
        "from": "~o",
        "to": "õ"
      },
      {
        "from": "~O",
        "to": "Õ"
      }
    ]
  },
  "de-mac": {
    "id": "de-mac",
    "version": 1,
    "name": "German (macOS)",
    "languages": [
      "de"
    ],
    "support": "experimental",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified. CLDR macOS source is platform 10.9; Backquote/IntlBackslash mapping may differ on ANSI/ISO and in browser events.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/osx/de-t-k0-osx.xml",
      "platform": "10.9",
      "name": "German",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/osx/de-t-k0-osx.xml"
    },
    "geometry": {
      "ANSI": "experimental; check Backquote/IntlBackslash",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "<",
        "shift": ">",
        "shiftAlt": "≥",
        "alt": "≤"
      },
      "Digit1": {
        "base": "1",
        "shift": "!",
        "shiftAlt": "¬",
        "alt": "¡"
      },
      "Digit2": {
        "base": "2",
        "shift": "\"",
        "shiftAlt": "”",
        "alt": "“"
      },
      "Digit3": {
        "base": "3",
        "shift": "§",
        "shiftAlt": "#",
        "alt": "¶"
      },
      "Digit4": {
        "base": "4",
        "shift": "$",
        "shiftAlt": "£",
        "alt": "¢"
      },
      "Digit5": {
        "base": "5",
        "shift": "%",
        "shiftAlt": "ﬁ",
        "alt": "["
      },
      "Digit6": {
        "base": "6",
        "shift": "&",
        "shiftAlt": "^",
        "alt": "]",
        "dead": {
          "shiftAlt": "^"
        }
      },
      "Digit7": {
        "base": "7",
        "shift": "/",
        "shiftAlt": "\\",
        "alt": "|"
      },
      "Digit8": {
        "base": "8",
        "shift": "(",
        "shiftAlt": "˜",
        "alt": "{"
      },
      "Digit9": {
        "base": "9",
        "shift": ")",
        "shiftAlt": "·",
        "alt": "}"
      },
      "Digit0": {
        "base": "0",
        "shift": "=",
        "shiftAlt": "¯",
        "alt": "≠"
      },
      "Minus": {
        "base": "ß",
        "shift": "?",
        "shiftAlt": "˙",
        "alt": "¿"
      },
      "Equal": {
        "base": "´",
        "shift": "`",
        "shiftAlt": "˚",
        "alt": "'",
        "dead": {
          "base": "´",
          "shift": "`"
        }
      },
      "KeyQ": {
        "base": "q",
        "shift": "Q",
        "shiftAlt": "»",
        "alt": "«"
      },
      "KeyW": {
        "base": "w",
        "shift": "W",
        "shiftAlt": "„",
        "alt": "∑"
      },
      "KeyE": {
        "base": "e",
        "shift": "E",
        "shiftAlt": "‰",
        "alt": "€"
      },
      "KeyR": {
        "base": "r",
        "shift": "R",
        "shiftAlt": "¸",
        "alt": "®"
      },
      "KeyT": {
        "base": "t",
        "shift": "T",
        "shiftAlt": "˝",
        "alt": "†"
      },
      "KeyY": {
        "base": "z",
        "shift": "Z",
        "shiftAlt": "ˇ",
        "alt": "Ω"
      },
      "KeyU": {
        "base": "u",
        "shift": "U",
        "shiftAlt": "Á",
        "alt": "¨",
        "dead": {
          "alt": "¨"
        }
      },
      "KeyI": {
        "base": "i",
        "shift": "I",
        "shiftAlt": "Û",
        "alt": "⁄"
      },
      "KeyO": {
        "base": "o",
        "shift": "O",
        "shiftAlt": "Ø",
        "alt": "ø"
      },
      "KeyP": {
        "base": "p",
        "shift": "P",
        "shiftAlt": "∏",
        "alt": "π"
      },
      "BracketLeft": {
        "base": "ü",
        "shift": "Ü",
        "shiftAlt": "°",
        "alt": "•"
      },
      "BracketRight": {
        "base": "+",
        "shift": "*",
        "shiftAlt": "",
        "alt": "±"
      },
      "Backslash": {
        "base": "#",
        "shift": "'",
        "shiftAlt": "’",
        "alt": "‘"
      },
      "KeyA": {
        "base": "a",
        "shift": "A",
        "shiftAlt": "Å",
        "alt": "å"
      },
      "KeyS": {
        "base": "s",
        "shift": "S",
        "shiftAlt": "Í",
        "alt": "‚"
      },
      "KeyD": {
        "base": "d",
        "shift": "D",
        "shiftAlt": "™",
        "alt": "∂"
      },
      "KeyF": {
        "base": "f",
        "shift": "F",
        "shiftAlt": "Ï",
        "alt": "ƒ"
      },
      "KeyG": {
        "base": "g",
        "shift": "G",
        "shiftAlt": "Ì",
        "alt": "©"
      },
      "KeyH": {
        "base": "h",
        "shift": "H",
        "shiftAlt": "Ó",
        "alt": "ª"
      },
      "KeyJ": {
        "base": "j",
        "shift": "J",
        "shiftAlt": "ı",
        "alt": "º"
      },
      "KeyK": {
        "base": "k",
        "shift": "K",
        "shiftAlt": "ˆ",
        "alt": "∆"
      },
      "KeyL": {
        "base": "l",
        "shift": "L",
        "shiftAlt": "ﬂ",
        "alt": "@"
      },
      "Semicolon": {
        "base": "ö",
        "shift": "Ö",
        "shiftAlt": "Œ",
        "alt": "œ"
      },
      "Quote": {
        "base": "ä",
        "shift": "Ä",
        "shiftAlt": "Æ",
        "alt": "æ"
      },
      "IntlBackslash": {
        "base": "^",
        "shift": "°",
        "shiftAlt": "“",
        "alt": "„",
        "dead": {
          "base": "^"
        }
      },
      "KeyZ": {
        "base": "y",
        "shift": "Y",
        "shiftAlt": "‡",
        "alt": "¥"
      },
      "KeyX": {
        "base": "x",
        "shift": "X",
        "shiftAlt": "Ù",
        "alt": "≈"
      },
      "KeyC": {
        "base": "c",
        "shift": "C",
        "shiftAlt": "Ç",
        "alt": "ç"
      },
      "KeyV": {
        "base": "v",
        "shift": "V",
        "shiftAlt": "◊",
        "alt": "√"
      },
      "KeyB": {
        "base": "b",
        "shift": "B",
        "shiftAlt": "‹",
        "alt": "∫"
      },
      "KeyN": {
        "base": "n",
        "shift": "N",
        "shiftAlt": "›",
        "alt": "~",
        "dead": {
          "alt": "~"
        }
      },
      "KeyM": {
        "base": "m",
        "shift": "M",
        "shiftAlt": "˘",
        "alt": "µ"
      },
      "Comma": {
        "base": ",",
        "shift": ";",
        "shiftAlt": "˛",
        "alt": "∞"
      },
      "Period": {
        "base": ".",
        "shift": ":",
        "shiftAlt": "÷",
        "alt": "…"
      },
      "Slash": {
        "base": "-",
        "shift": "_",
        "shiftAlt": "—",
        "alt": "–"
      },
      "Space": {
        "base": " ",
        "shift": " ",
        "shiftAlt": " ",
        "alt": " "
      }
    },
    "transforms": [
      {
        "from": "` ",
        "to": "`"
      },
      {
        "from": "`a",
        "to": "à"
      },
      {
        "from": "`A",
        "to": "À"
      },
      {
        "from": "`e",
        "to": "è"
      },
      {
        "from": "`E",
        "to": "È"
      },
      {
        "from": "`i",
        "to": "ì"
      },
      {
        "from": "`I",
        "to": "Ì"
      },
      {
        "from": "`o",
        "to": "ò"
      },
      {
        "from": "`O",
        "to": "Ò"
      },
      {
        "from": "`u",
        "to": "ù"
      },
      {
        "from": "`U",
        "to": "Ù"
      },
      {
        "from": "´ ",
        "to": "´"
      },
      {
        "from": "´a",
        "to": "á"
      },
      {
        "from": "´A",
        "to": "Á"
      },
      {
        "from": "´e",
        "to": "é"
      },
      {
        "from": "´E",
        "to": "É"
      },
      {
        "from": "´i",
        "to": "í"
      },
      {
        "from": "´I",
        "to": "Í"
      },
      {
        "from": "´o",
        "to": "ó"
      },
      {
        "from": "´O",
        "to": "Ó"
      },
      {
        "from": "´u",
        "to": "ú"
      },
      {
        "from": "´U",
        "to": "Ú"
      },
      {
        "from": "^ ",
        "to": "^"
      },
      {
        "from": "^a",
        "to": "â"
      },
      {
        "from": "^A",
        "to": "Â"
      },
      {
        "from": "^e",
        "to": "ê"
      },
      {
        "from": "^E",
        "to": "Ê"
      },
      {
        "from": "^i",
        "to": "î"
      },
      {
        "from": "^I",
        "to": "Î"
      },
      {
        "from": "^o",
        "to": "ô"
      },
      {
        "from": "^O",
        "to": "Ô"
      },
      {
        "from": "^u",
        "to": "û"
      },
      {
        "from": "^U",
        "to": "Û"
      },
      {
        "from": "¨ ",
        "to": "¨"
      },
      {
        "from": "¨a",
        "to": "ä"
      },
      {
        "from": "¨A",
        "to": "Ä"
      },
      {
        "from": "¨e",
        "to": "ë"
      },
      {
        "from": "¨E",
        "to": "Ë"
      },
      {
        "from": "¨i",
        "to": "ï"
      },
      {
        "from": "¨I",
        "to": "Ï"
      },
      {
        "from": "¨o",
        "to": "ö"
      },
      {
        "from": "¨O",
        "to": "Ö"
      },
      {
        "from": "¨u",
        "to": "ü"
      },
      {
        "from": "¨U",
        "to": "Ü"
      },
      {
        "from": "¨y",
        "to": "ÿ"
      },
      {
        "from": "¨Y",
        "to": "Ÿ"
      },
      {
        "from": "~ ",
        "to": "~"
      },
      {
        "from": "~a",
        "to": "ã"
      },
      {
        "from": "~A",
        "to": "Ã"
      },
      {
        "from": "~n",
        "to": "ñ"
      },
      {
        "from": "~N",
        "to": "Ñ"
      },
      {
        "from": "~o",
        "to": "õ"
      },
      {
        "from": "~O",
        "to": "Õ"
      }
    ]
  },
  "de-pc": {
    "id": "de-pc",
    "version": 1,
    "name": "German QWERTZ (PC)",
    "languages": [
      "de"
    ],
    "support": "reference",
    "supportNotes": "Reference data is archived; current OS and physical hardware have not been verified.",
    "source": {
      "provider": "Unicode CLDR",
      "commit": "d1c59aeea6a26cd1018e164e8c470e4873925cac",
      "file": "keyboards/windows/de-t-k0-windows.xml",
      "platform": "10",
      "name": "German",
      "url": "https://github.com/unicode-org/cldr/blob/d1c59aeea6a26cd1018e164e8c470e4873925cac/keyboards/windows/de-t-k0-windows.xml"
    },
    "geometry": {
      "ANSI": "reference-positions; hardware unverified",
      "ISO": "reference-position map only; browser codes and physical Return geometry unverified"
    },
    "keys": {
      "Backquote": {
        "base": "^",
        "shift": "°",
        "dead": {
          "base": "^"
        }
      },
      "Digit1": {
        "base": "1",
        "shift": "!"
      },
      "Digit2": {
        "base": "2",
        "shift": "\"",
        "altGr": "²"
      },
      "Digit3": {
        "base": "3",
        "shift": "§",
        "altGr": "³"
      },
      "Digit4": {
        "base": "4",
        "shift": "$"
      },
      "Digit5": {
        "base": "5",
        "shift": "%"
      },
      "Digit6": {
        "base": "6",
        "shift": "&"
      },
      "Digit7": {
        "base": "7",
        "shift": "/",
        "altGr": "{"
      },
      "Digit8": {
        "base": "8",
        "shift": "(",
        "altGr": "["
      },
      "Digit9": {
        "base": "9",
        "shift": ")",
        "altGr": "]"
      },
      "Digit0": {
        "base": "0",
        "shift": "=",
        "altGr": "}"
      },
      "Minus": {
        "base": "ß",
        "shift": "?",
        "altGr": "\\",
        "shiftAltGr": "ẞ"
      },
      "Equal": {
        "base": "´",
        "shift": "`",
        "dead": {
          "base": "´",
          "shift": "`"
        }
      },
      "KeyQ": {
        "base": "q",
        "shift": "Q",
        "altGr": "@"
      },
      "KeyW": {
        "base": "w",
        "shift": "W"
      },
      "KeyE": {
        "base": "e",
        "shift": "E",
        "altGr": "€"
      },
      "KeyR": {
        "base": "r",
        "shift": "R"
      },
      "KeyT": {
        "base": "t",
        "shift": "T"
      },
      "KeyY": {
        "base": "z",
        "shift": "Z"
      },
      "KeyU": {
        "base": "u",
        "shift": "U"
      },
      "KeyI": {
        "base": "i",
        "shift": "I"
      },
      "KeyO": {
        "base": "o",
        "shift": "O"
      },
      "KeyP": {
        "base": "p",
        "shift": "P"
      },
      "BracketLeft": {
        "base": "ü",
        "shift": "Ü"
      },
      "BracketRight": {
        "base": "+",
        "shift": "*",
        "altGr": "~"
      },
      "KeyA": {
        "base": "a",
        "shift": "A"
      },
      "KeyS": {
        "base": "s",
        "shift": "S"
      },
      "KeyD": {
        "base": "d",
        "shift": "D"
      },
      "KeyF": {
        "base": "f",
        "shift": "F"
      },
      "KeyG": {
        "base": "g",
        "shift": "G"
      },
      "KeyH": {
        "base": "h",
        "shift": "H"
      },
      "KeyJ": {
        "base": "j",
        "shift": "J"
      },
      "KeyK": {
        "base": "k",
        "shift": "K"
      },
      "KeyL": {
        "base": "l",
        "shift": "L"
      },
      "Semicolon": {
        "base": "ö",
        "shift": "Ö"
      },
      "Quote": {
        "base": "ä",
        "shift": "Ä"
      },
      "Backslash": {
        "base": "#",
        "shift": "'"
      },
      "IntlBackslash": {
        "base": "<",
        "shift": ">",
        "altGr": "|"
      },
      "KeyZ": {
        "base": "y",
        "shift": "Y"
      },
      "KeyX": {
        "base": "x",
        "shift": "X"
      },
      "KeyC": {
        "base": "c",
        "shift": "C"
      },
      "KeyV": {
        "base": "v",
        "shift": "V"
      },
      "KeyB": {
        "base": "b",
        "shift": "B"
      },
      "KeyN": {
        "base": "n",
        "shift": "N"
      },
      "KeyM": {
        "base": "m",
        "shift": "M",
        "altGr": "µ"
      },
      "Comma": {
        "base": ",",
        "shift": ";"
      },
      "Period": {
        "base": ".",
        "shift": ":"
      },
      "Slash": {
        "base": "-",
        "shift": "_"
      },
      "Space": {
        "base": " ",
        "shift": " "
      }
    },
    "transforms": [
      {
        "from": "` ",
        "to": "`"
      },
      {
        "from": "`a",
        "to": "à"
      },
      {
        "from": "`A",
        "to": "À"
      },
      {
        "from": "`e",
        "to": "è"
      },
      {
        "from": "`E",
        "to": "È"
      },
      {
        "from": "`i",
        "to": "ì"
      },
      {
        "from": "`I",
        "to": "Ì"
      },
      {
        "from": "`o",
        "to": "ò"
      },
      {
        "from": "`O",
        "to": "Ò"
      },
      {
        "from": "`u",
        "to": "ù"
      },
      {
        "from": "`U",
        "to": "Ù"
      },
      {
        "from": "´ ",
        "to": "´"
      },
      {
        "from": "´a",
        "to": "á"
      },
      {
        "from": "´A",
        "to": "Á"
      },
      {
        "from": "´e",
        "to": "é"
      },
      {
        "from": "´E",
        "to": "É"
      },
      {
        "from": "´i",
        "to": "í"
      },
      {
        "from": "´I",
        "to": "Í"
      },
      {
        "from": "´o",
        "to": "ó"
      },
      {
        "from": "´O",
        "to": "Ó"
      },
      {
        "from": "´u",
        "to": "ú"
      },
      {
        "from": "´U",
        "to": "Ú"
      },
      {
        "from": "´y",
        "to": "ý"
      },
      {
        "from": "´Y",
        "to": "Ý"
      },
      {
        "from": "^ ",
        "to": "^"
      },
      {
        "from": "^a",
        "to": "â"
      },
      {
        "from": "^A",
        "to": "Â"
      },
      {
        "from": "^e",
        "to": "ê"
      },
      {
        "from": "^E",
        "to": "Ê"
      },
      {
        "from": "^i",
        "to": "î"
      },
      {
        "from": "^I",
        "to": "Î"
      },
      {
        "from": "^o",
        "to": "ô"
      },
      {
        "from": "^O",
        "to": "Ô"
      },
      {
        "from": "^u",
        "to": "û"
      },
      {
        "from": "^U",
        "to": "Û"
      }
    ]
  }
};
const layerModifiers = {base: [], shift: ['Shift'], alt: ['Alt'], shiftAlt: ['Shift', 'Alt'], altGr: ['AltGr'], shiftAltGr: ['Shift', 'AltGr']};
const normalize = value => String(value).normalize('NFC');
const codePoints = value => Array.from(normalize(value));
const cache = new Map();
TT2.layouts = Object.create(null);
TT2.normalizeText = normalize;
TT2.codePoints = codePoints;
TT2.registerLayout = definition => {
  if (!definition || !/^[a-z][a-z0-9-]*$/.test(definition.id) || definition.version !== 1 || !definition.keys || TT2.layouts[definition.id]) throw new Error('Invalid or duplicate layout definition');
  if (typeof definition.name !== 'string' || !Array.isArray(definition.languages) || !definition.source || typeof definition.source.url !== 'string' || !definition.geometry || !definition.geometry.ANSI || !definition.geometry.ISO) throw new Error('Layout provenance and geometry metadata are required');
  for (const transform of definition.transforms || []) if (typeof transform.from !== 'string' || typeof transform.to !== 'string' || codePoints(transform.from).length !== 2 || codePoints(transform.to).length !== 1) throw new Error('Invalid composition transform');
  for (const [code, key] of Object.entries(definition.keys)) {
    if (!/^(Key[A-Z]|Digit[0-9]|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|IntlBackslash|Space)$/.test(code)) throw new Error('Invalid physical code');
    for (const layer of Object.keys(layerModifiers)) if (layer in key && typeof key[layer] !== 'string') throw new Error('Invalid layout layer');
  }
  TT2.layouts[definition.id] = definition;
  cache.clear();
  return definition;
};
for (const definition of Object.values(definitions)) TT2.registerLayout(definition);
function indexes(id, geometry = 'ANSI') {
  const cacheKey = id + ':' + geometry;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const layout = TT2.layouts[id];
  const routes = new Map(), triggers = new Map();
  if (!layout) return routes;
  const add = (character, route) => {
    character = normalize(character);
    if (codePoints(character).length !== 1 || /[\p{Cc}\p{Cf}]/u.test(character)) return;
    if (!routes.has(character)) routes.set(character, []);
    routes.get(character).push({...route, character});
  };
  for (const [code, key] of Object.entries(layout.keys)) {
    if (geometry === 'ANSI' && code === 'IntlBackslash') continue;
    for (const [layer, modifiers] of Object.entries(layerModifiers)) {
      if (!(layer in key)) continue;
      const route = {code, modifiers, layer};
      if (key.dead && key.dead[layer]) {
        const trigger = normalize(key[layer]);
        if (!triggers.has(trigger)) triggers.set(trigger, []);
        triggers.get(trigger).push({...route, dead: true});
      } else add(key[layer], route);
    }
  }
  // Direct keys first. Transforms may compose only with a direct second key.
  const direct = new Map([...routes].map(([character, options]) => [character, [...options]]));
  for (const transform of layout.transforms || []) {
    const from = codePoints(transform.from);
    if (from.length !== 2) continue;
    for (const first of triggers.get(from[0]) || []) for (const second of direct.get(from[1]) || []) {
      add(transform.to, {code: first.code, modifiers: first.modifiers, layer: first.layer, sequence: [first, second]});
    }
  }
  cache.set(cacheKey, routes);
  return routes;
}
TT2.layoutRoutes = (id, character, geometry = 'ANSI') => indexes(id, geometry).get(normalize(character)) || [];
TT2.availableCharacters = (id, geometry = 'ANSI') => [...indexes(id, geometry).keys()];
TT2.eventModifiers = (id, event) => {
  if (!TT2.layouts[id]) return null;
  const isPC = id.endsWith('-pc');
  const altGraph = !!(event.getModifierState && event.getModifierState('AltGraph')) || isPC && event.ctrlKey && event.altKey;
  if (event.metaKey || event.ctrlKey && !altGraph) return null;
  const modifiers = [];
  if (event.shiftKey) modifiers.push('Shift');
  if (altGraph) modifiers.push('AltGr'); else if (event.altKey) modifiers.push('Alt');
  return modifiers;
};
TT2.layoutCharacter = (id, event) => {
  const modifiers = TT2.eventModifiers(id, event);
  if (!modifiers) return null;
  const layer = Object.keys(layerModifiers).find(name => layerModifiers[name].join('+') === modifiers.join('+'));
  const key = TT2.layouts[id]?.keys[event.code];
  if (!key || !layer || !(layer in key)) return null;
  if (key.dead && key.dead[layer]) return 'Dead';
  let value = key[layer];
  if (event.getModifierState && event.getModifierState('CapsLock') && /^\p{L}$/u.test(value) && !event.altKey) {
    value = event.shiftKey ? value.toLocaleLowerCase() : value.toLocaleUpperCase();
  }
  return normalize(value);
};
TT2.routeMatches = (id, character, event, geometry = 'ANSI') => {
  if (geometry === 'ANSI' && event.code === 'IntlBackslash') return false;
  return TT2.layoutCharacter(id, event) === normalize(character) && normalize(event.key || '') === normalize(character);
};
if (typeof module !== 'undefined' && module.exports) module.exports = TT2;
})(globalThis);
