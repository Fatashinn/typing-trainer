/* Language content is independent of UI strings, input layouts and keyboard geometry. */
(function (global) {
'use strict';
const TT2 = global.TT2 = global.TT2 || {};
const definitions = [
  {
    id: 'ru', version: 1, title: 'Русский', names: {ru:'Русский',en:'Russian'}, specials: 'ёЁ', locale: 'ru',
    alphabet: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', frequency: 'оеаинтсрвлкмдпуяыьгзбчйхжшюцщэфёъ',
    words: ('время человек работа слово место вопрос страна случай ребёнок жизнь город рука сторона голова дело день дом друг мир семья школа книга письмо язык начало конец дорога вода окно утро вечер сегодня завтра вчера быстро медленно точно легко трудно хороший новый большой маленький русский учить читать писать понимать помнить знать видеть идти делать думать говорить слушать помогать вместе всегда иногда снова рядом далеко здесь сейчас результат задача пример привычка внимание клавиша палец строка текст упражнение точность скорость').split(' '),
    bigrams: 'ст но то на ен ов ни ра во ко пр ро по не ос ал ли ре го ор ан те от ит'.split(' '),
    sentences: [
      'Точность важнее скорости: печатай спокойно и ровно.',
      'Сегодня я учусь находить клавиши без взгляда на руки.',
      'Небольшая ежедневная практика помогает закрепить навык.',
      'После короткого отдыха я возвращаюсь к упражнению.',
      'Мой друг прислал письмо и попросил ответить завтра.',
      'Вечером мы читаем книгу, обсуждаем новости и строим планы.',
      'Новая привычка появляется постепенно, шаг за шагом.',
      'Сначала проверь раскладку, затем начинай печатать текст.',
      'В этой строке есть цифры: 12, 34 и 56.',
      'Я помню правило: для большой буквы нужен противоположный Shift.'
    ],
    punctuation: ['.', ',', '!', '?', ':', ';', '"', '(', ')', '-', '%', '№'],
    tasks: ['letters', 'words', 'bigrams', 'sentences', 'punctuation', 'mixed']
  },
  {
    id: 'en', version: 1, title: 'English', names: {ru:'Английский',en:'English'}, specials: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', locale: 'en',
    alphabet: 'abcdefghijklmnopqrstuvwxyz', frequency: 'etaoinshrdlucmfwypvbgkjqxz',
    words: ('time person year way day thing world life hand part child eye woman place work week case point home water room mother area money story fact month right study book word business issue side kind head house service friend father power hour game line end member city name team minute idea body information face office door health art history party result change morning reason research moment teacher education task test course lesson note file open close read write learn think know speak listen help build try keep move start finish together always often again clear easy hard slow fast accurate practice keyboard finger sentence').split(' '),
    bigrams: 'th he in er an re on at en nd ti es or te of ed is it al ar st to nt ng se ha as ou io le'.split(' '),
    sentences: [
      'Accuracy comes first: keep a calm and steady rhythm.',
      'Today I am learning to type without looking at my hands.',
      'A little practice every day can build a lasting habit.',
      'Take a short break, then return to the next exercise.',
      'My friend sent a message and asked for a reply tomorrow.',
      'We read a book, discuss a question, and make a new plan.',
      'The keyboard stays in the same place when the language changes.',
      'Check the selected input layout before you start typing.',
      'This line includes numbers: 12, 34, and 56.',
      'Use the opposite Shift key when a capital letter is needed.'
    ],
    punctuation: ['.', ',', '!', '?', ':', ';', '"', "'", '(', ')', '-'],
    tasks: ['letters', 'words', 'bigrams', 'sentences', 'punctuation', 'mixed']
  },
  {
    id: 'fr', version: 1, title: 'Français', names: {ru:'Французский',en:'French'}, specials: 'éèêëàâîïôùûüçœÉ', locale: 'fr',
    alphabet: 'abcdefghijklmnopqrstuvwxyzàâæçéèêëîïôœùûüÿ', frequency: 'esaitnrulodcmpévqfbghjàxèyêzçôùâîûœëïü',
    words: ('temps personne jour chose monde vie main enfant femme place travail semaine maison eau chambre mère histoire mois étude livre mot question côté service ami père heure ville nom équipe minute idée corps visage bureau porte santé art résultat changement matin raison recherche moment professeur tâche cours leçon note fichier ouvrir fermer lire écrire apprendre penser savoir parler écouter aider essayer garder bouger commencer finir ensemble toujours souvent encore clair facile difficile lent rapide précis clavier doigt phrase français langue école été fenêtre forêt garçon café déjà bientôt cœur sœur Noël où après très première dernière réussir connaître déjeuner numéro qualité expérience liberté attention progrès rythme').split(' '),
    bigrams: 'es de le en re nt on er te el an se et la ai it me ou ne ue ée qu un is ur ar'.split(' '),
    sentences: [
      'La précision est plus importante que la vitesse.',
      "Aujourd'hui, je m'exerce à écrire sans regarder mes mains.",
      'Une courte leçon chaque jour aide à progresser régulièrement.',
      "Après une pause, je reprends l'exercice avec attention.",
      "Mon ami a envoyé un message et attend une réponse demain.",
      'Nous lisons un livre, échangeons des idées et préparons un projet.',
      'Le garçon ouvre la fenêtre près de la forêt.',
      'Ma sœur prépare un café et écrit une lettre à Noël.',
      'Cette ligne contient des nombres : 12, 34 et 56.',
      'Vérifiez la disposition du clavier avant de commencer.'
    ],
    punctuation: ['.', ',', '!', '?', ':', ';', '"', "'", '(', ')', '-'],
    tasks: ['letters', 'words', 'bigrams', 'sentences', 'punctuation', 'mixed']
  },
  {
    id: 'de', version: 1, title: 'Deutsch', names: {ru:'Немецкий',en:'German'}, specials: 'äöüßÄÖÜ', locale: 'de',
    alphabet: 'abcdefghijklmnopqrstuvwxyzäöüß', frequency: 'enisratdhulcgmobwfkzpvüäößjxyq',
    words: ('Zeit Mensch Jahr Weg Tag Welt Leben Hand Teil Kind Auge Frau Ort Arbeit Woche Haus Wasser Zimmer Mutter Geschichte Monat Recht Buch Wort Frage Seite Kopf Freund Vater Stunde Spiel Stadt Name Gruppe Minute Gedanke Körper Gesicht Büro Tür Gesundheit Kunst Ergebnis Morgen Grund Forschung Augenblick Lehrer Aufgabe Prüfung Kurs Übung Notiz Datei öffnen schließen lesen schreiben lernen denken wissen sprechen hören helfen versuchen bleiben bewegen beginnen beenden zusammen immer oft wieder klar leicht schwer langsam schnell genau Tastatur Finger Satz Deutsch Sprache Schule Straße Größe schön grün früh für über möglich müssen täglich regelmäßig schließlich Aufmerksamkeit Fortschritt Rhythmus Schlüssel Frühstück Grüße äußern heißen').split(' '),
    bigrams: 'en er ch de ei te in nd ie ge st ne be es un re an he au ng se it sc zu ic'.split(' '),
    sentences: [
      'Genauigkeit ist wichtiger als Geschwindigkeit.',
      'Heute übe ich das Schreiben, ohne auf meine Hände zu sehen.',
      'Eine kurze Übung an jedem Tag hilft beim Lernen.',
      'Nach einer Pause beginne ich die nächste Aufgabe.',
      'Mein Freund hat eine Nachricht geschickt und wartet auf eine Antwort.',
      'Wir lesen ein Buch, besprechen eine Frage und machen einen Plan.',
      'Die grüne Tür führt in ein großes und schönes Zimmer.',
      'Zum Frühstück gibt es Brötchen, Käse und heißen Tee.',
      'Diese Zeile enthält Zahlen: 12, 34 und 56.',
      'Prüfen Sie die Tastaturbelegung, bevor Sie anfangen.'
    ],
    punctuation: ['.', ',', '!', '?', ':', ';', '"', "'", '(', ')', '-'],
    tasks: ['letters', 'words', 'bigrams', 'sentences', 'punctuation', 'mixed']
  }
];
TT2.languages = Object.create(null);
TT2.registerLanguage = pack => {
  if (!pack || !/^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/.test(pack.id) || pack.version !== 1 || TT2.languages[pack.id]) throw new Error('Invalid or duplicate language pack');
  if (typeof pack.alphabet !== 'string' || !Array.isArray(pack.words) || !pack.words.length || !Array.isArray(pack.sentences) || !pack.sentences.length || !Array.isArray(pack.bigrams) || !Array.isArray(pack.punctuation)) throw new Error('Incomplete language pack');
  for (const name of ['words', 'sentences', 'bigrams', 'punctuation']) {
    if (pack[name].some(text => typeof text !== 'string' || text !== text.normalize('NFC'))) throw new Error('Language content must use NFC Unicode strings');
  }
  TT2.languages[pack.id] = pack;
  return pack;
};
for (const pack of definitions) TT2.registerLanguage(pack);
if (typeof module !== 'undefined' && module.exports) module.exports = TT2;
})(globalThis);
