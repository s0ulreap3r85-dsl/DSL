/* Idiomas que se pueden anadir a la web.
   Cada uno lleva su nombre en su propio idioma, su nombre en espanol, las
   banderas entre las que elegir (la primera es la de por defecto), el
   sentido de escritura, y el tipo de escritura, que decide que tipografia
   se carga para que se lea bien. */

(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.CatalogoIdiomas = fabrica();
})(this, function () {
  'use strict';

  var L = [
    ['es', 'Español',          'Español',    ['🇪🇸', '🇲🇽', '🇦🇷', '🇨🇴', '🇨🇱', '🇵🇪'], 'ltr', 'latin'],
    ['en', 'English',          'Inglés',     ['🇬🇧', '🇺🇸', '🇨🇦', '🇦🇺', '🇮🇪'], 'ltr', 'latin'],
    ['fr', 'Français',         'Francés',    ['🇫🇷', '🇧🇪', '🇨🇦', '🇨🇭', '🇲🇦'], 'ltr', 'latin'],
    ['de', 'Deutsch',          'Alemán',     ['🇩🇪', '🇦🇹', '🇨🇭'], 'ltr', 'latin'],
    ['ar', 'العربية',          'Árabe',      ['🇸🇦', '🇦🇪', '🇪🇬', '🇲🇦', '🇩🇿', '🇯🇴', '🇮🇶'], 'rtl', 'arabic'],
    ['tr', 'Türkçe',           'Turco',      ['🇹🇷'], 'ltr', 'latin'],
    ['el', 'Ελληνικά',         'Griego',     ['🇬🇷', '🇨🇾'], 'ltr', 'greek'],
    ['pt', 'Português',        'Portugués',  ['🇵🇹', '🇧🇷'], 'ltr', 'latin'],
    ['it', 'Italiano',         'Italiano',   ['🇮🇹', '🇨🇭'], 'ltr', 'latin'],
    ['nl', 'Nederlands',       'Neerlandés', ['🇳🇱', '🇧🇪'], 'ltr', 'latin'],
    ['pl', 'Polski',           'Polaco',     ['🇵🇱'], 'ltr', 'latin'],
    ['ro', 'Română',           'Rumano',     ['🇷🇴', '🇲🇩'], 'ltr', 'latin'],
    ['cs', 'Čeština',          'Checo',      ['🇨🇿'], 'ltr', 'latin'],
    ['hu', 'Magyar',           'Húngaro',    ['🇭🇺'], 'ltr', 'latin'],
    ['hr', 'Hrvatski',         'Croata',     ['🇭🇷'], 'ltr', 'latin'],
    ['sv', 'Svenska',          'Sueco',      ['🇸🇪'], 'ltr', 'latin'],
    ['no', 'Norsk',            'Noruego',    ['🇳🇴'], 'ltr', 'latin'],
    ['da', 'Dansk',            'Danés',      ['🇩🇰'], 'ltr', 'latin'],
    ['fi', 'Suomi',            'Finés',      ['🇫🇮'], 'ltr', 'latin'],
    ['ru', 'Русский',          'Ruso',       ['🇷🇺'], 'ltr', 'cyrillic'],
    ['uk', 'Українська',       'Ucraniano',  ['🇺🇦'], 'ltr', 'cyrillic'],
    ['bg', 'Български',        'Búlgaro',    ['🇧🇬'], 'ltr', 'cyrillic'],
    ['sr', 'Српски',           'Serbio',     ['🇷🇸'], 'ltr', 'cyrillic'],
    ['he', 'עברית',            'Hebreo',     ['🇮🇱'], 'rtl', 'hebrew'],
    ['fa', 'فارسی',            'Persa',      ['🇮🇷', '🇦🇫'], 'rtl', 'arabic'],
    ['ur', 'اردو',             'Urdu',       ['🇵🇰', '🇮🇳'], 'rtl', 'arabic'],
    ['hi', 'हिन्दी',            'Hindi',      ['🇮🇳'], 'ltr', 'devanagari'],
    ['th', 'ไทย',              'Tailandés',  ['🇹🇭'], 'ltr', 'thai'],
    ['vi', 'Tiếng Việt',       'Vietnamita', ['🇻🇳'], 'ltr', 'latin'],
    ['id', 'Bahasa Indonesia', 'Indonesio',  ['🇮🇩'], 'ltr', 'latin'],
    ['ms', 'Bahasa Melayu',    'Malayo',     ['🇲🇾', '🇸🇬', '🇧🇳'], 'ltr', 'latin'],
    ['tl', 'Filipino',         'Filipino',   ['🇵🇭'], 'ltr', 'latin'],
    ['zh', '中文',             'Chino',      ['🇨🇳', '🇹🇼', '🇭🇰', '🇸🇬'], 'ltr', 'sc'],
    ['ja', '日本語',           'Japonés',    ['🇯🇵'], 'ltr', 'jp'],
    ['ko', '한국어',           'Coreano',    ['🇰🇷'], 'ltr', 'kr']
  ];

  return L.map(function (x) {
    return { code: x[0], name: x[1], nameEs: x[2], flags: x[3], direction: x[4], script: x[5] };
  });
});
