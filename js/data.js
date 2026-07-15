/* ============================================================
   hey EU – Daten: Länder, Wahrzeichen, Fakten, Quiz, Brücken
   Jedes Land ist bewusst klein (nur Umriss + Wahrzeichen),
   wie ein kleiner Schulhof (~70 m² Spielgefühl).
   ============================================================ */

const TILE = 16;          // Pixelgröße einer Kachel in der Vorlage
const WORLD_W = 112;      // Kacheln breit
const WORLD_H = 80;       // Kacheln hoch

/* Kachel-Typen */
const T_SEA = 0, T_GRASS = 1, T_BRIDGE = 2, T_TREE = 3, T_MOUNTAIN = 4,
      T_FLOWER = 5, T_LANDMARK = 6;

/* Länder: shape = '#' ist Land, '.' ist Meer.
   lm = Wahrzeichen (dx/dy relativ zur Form, muss auf '#' liegen). */
const COUNTRIES = [
  {
    id: 'is', name: 'Island', flag: '🇮🇸', x: 6, y: 8, grass: '#9ed489',
    shape: ['..###..', '.#####.', '#######', '.#####.'],
    lm: { emoji: '🌋', name: 'Geysir Strokkur', dx: 3, dy: 2,
      info: 'Island ist die Insel aus Feuer und Eis! Hier schießen heiße Wasserfontänen – Geysire – aus dem Boden.' },
    fact: 'Bei uns gibt es Vulkane, Geysire und im Winter tanzen Nordlichter am Himmel!',
    food: 'Ich esse gern Skyr – das ist ein leckerer isländischer Joghurt.',
    hobby: 'Ich bade super gern in heißen Quellen, sogar wenn es schneit!',
    kids: ['Elín', 'Jón'],
    quiz: { q: 'Wie heißt die Hauptstadt von Island?', correct: 'Reykjavík', wrong: ['Oslo', 'Helsinki'] }
  },
  {
    id: 'ie', name: 'Irland', flag: '🇮🇪', x: 16, y: 26, grass: '#6fc95f',
    shape: ['.####', '#####', '#####', '.###.'],
    lm: { emoji: '☘️', name: 'Cliffs of Moher', dx: 2, dy: 1,
      info: 'Irland nennt man die „Grüne Insel“. Die Klippen von Moher ragen 200 Meter hoch aus dem Atlantik!' },
    fact: 'Irland ist so grün, dass man es die Grüne Insel nennt. Und wir lieben Musik und Geschichten!',
    food: 'Ich mag Irish Stew – ein warmer Eintopf, perfekt bei Regenwetter.',
    hobby: 'Ich tanze irischen Stepptanz – die Füße bewegen sich superschnell!',
    kids: ['Aoife', 'Liam'],
    quiz: { q: 'Welche Farbe verbindet man mit Irland?', correct: 'Grün', wrong: ['Rot', 'Schwarz'] }
  },
  {
    id: 'uk', name: 'Großbritannien', flag: '🇬🇧', x: 26, y: 18, grass: '#8ccb66',
    shape: ['...##', '..###', '..##.', '.###.', '.####', '#####', '.####'],
    lm: { emoji: '🕰️', name: 'Big Ben', dx: 2, dy: 5,
      info: 'Big Ben ist die riesige Glocke im Uhrturm von London. Ihr Schlag ist in der ganzen Stadt zu hören!' },
    fact: 'In London fahren rote Doppeldeckerbusse und die Königsfamilie wohnt im Palast!',
    food: 'Ich liebe Fish and Chips – Fisch mit Pommes, direkt aus der Tüte.',
    hobby: 'Ich spiele Fußball im Park, fast jeden Tag – auch im Regen!',
    kids: ['Amelia', 'Oliver'],
    quiz: { q: 'Wie heißt die berühmte Glocke in London?', correct: 'Big Ben', wrong: ['Ding Dong', 'Tower Bell'] }
  },
  {
    id: 'pt', name: 'Portugal', flag: '🇵🇹', x: 22, y: 60, grass: '#a8d46a',
    shape: ['.##', '###', '###', '###', '##.'],
    lm: { emoji: '🚋', name: 'Tram 28 in Lissabon', dx: 1, dy: 2,
      info: 'Die gelbe Straßenbahn 28 klettert durch die steilen Gassen von Lissabon – wie eine Achterbahn in der Stadt!' },
    fact: 'Portugal liegt am Atlantik. Von hier segelten früher mutige Entdecker um die ganze Welt!',
    food: 'Pastéis de Nata! Das sind warme Puddingtörtchen – einfach himmlisch.',
    hobby: 'Ich surfe gern – bei uns gibt es einige der größten Wellen der Welt!',
    kids: ['Beatriz', 'Tiago'],
    quiz: { q: 'An welchem Ozean liegt Portugal?', correct: 'Atlantik', wrong: ['Ostsee', 'Schwarzes Meer'] }
  },
  {
    id: 'es', name: 'Spanien', flag: '🇪🇸', x: 27, y: 58, grass: '#d4c96a',
    shape: ['.#######', '########', '########', '.######.'],
    lm: { emoji: '⛪', name: 'Sagrada Família', dx: 5, dy: 1,
      info: 'Die Sagrada Família in Barcelona wird seit über 140 Jahren gebaut – und sieht aus wie eine Sandburg aus Stein!' },
    fact: 'Bei uns scheint fast immer die Sonne, und abends essen alle zusammen Tapas – viele kleine Leckereien!',
    food: 'Ich esse gern Paella – Reis mit Gemüse und Meeresfrüchten aus einer riesigen Pfanne.',
    hobby: 'Ich tanze Flamenco – mit Klatschen und Stampfen!',
    kids: ['Lucía', 'Pablo'],
    quiz: { q: 'Wer hat die Sagrada Família entworfen?', correct: 'Antoni Gaudí', wrong: ['Pablo Picasso', 'Lionel Messi'] }
  },
  {
    id: 'fr', name: 'Frankreich', flag: '🇫🇷', x: 40, y: 44, grass: '#8fce5e',
    shape: ['..####..', '.######.', '########', '########', '.######.', '..####..'],
    lm: { emoji: '🗼', name: 'Eiffelturm', dx: 3, dy: 2,
      info: 'Der Eiffelturm in Paris ist etwa 330 Meter hoch und funkelt nachts jede Stunde mit tausenden Lichtern!' },
    fact: 'Frankreich ist berühmt für Paris, Käse, Baguette und den Eiffelturm, der nachts glitzert!',
    food: 'Croissants zum Frühstück – außen knusprig, innen fluffig!',
    hobby: 'Ich fahre gern Fahrrad – wie bei der Tour de France, nur langsamer.',
    kids: ['Chloé', 'Louis'],
    quiz: { q: 'Wie hoch ist der Eiffelturm ungefähr?', correct: '330 Meter', wrong: ['30 Meter', '3000 Meter'] }
  },
  {
    id: 'be', name: 'Belgien', flag: '🇧🇪', x: 47, y: 38, grass: '#7cc95c',
    shape: ['####.', '.####'],
    lm: { emoji: '⚛️', name: 'Atomium', dx: 1, dy: 0,
      info: 'Das Atomium in Brüssel sieht aus wie ein Riesen-Molekül aus glänzenden Kugeln – man kann sogar hineingehen!' },
    fact: 'Belgien ist klein, aber berühmt: für Schokolade, Waffeln und Pommes!',
    food: 'Belgische Waffeln mit Erdbeeren und Schokosoße. Mmmmh!',
    hobby: 'Ich lese gern Comics – die Schlümpfe und Tim & Struppi kommen aus Belgien!',
    kids: ['Noor', 'Arthur'],
    quiz: { q: 'Wofür ist Belgien besonders berühmt?', correct: 'Schokolade & Pommes', wrong: ['Sushi', 'Iglus'] }
  },
  {
    id: 'nl', name: 'Niederlande', flag: '🇳🇱', x: 50, y: 32, grass: '#9ad06b',
    shape: ['.###', '####', '###.'],
    lm: { emoji: '🌷', name: 'Tulpenfelder & Windmühlen', dx: 1, dy: 1,
      info: 'Im Frühling leuchten die Tulpenfelder in allen Farben, und alte Windmühlen drehen sich im Wind!' },
    fact: 'Bei uns fahren fast alle mit dem Fahrrad – es gibt mehr Fahrräder als Menschen!',
    food: 'Poffertjes! Mini-Pfannkuchen mit Puderzucker.',
    hobby: 'Ich fahre im Winter Schlittschuh auf den zugefrorenen Kanälen.',
    kids: ['Sanne', 'Daan'],
    quiz: { q: 'Welche Blume ist typisch für die Niederlande?', correct: 'Die Tulpe', wrong: ['Der Kaktus', 'Die Palme'] }
  },
  {
    id: 'de', name: 'Deutschland', flag: '🇩🇪', x: 58, y: 36, grass: '#84c86a',
    shape: ['.#####.', '#######', '#######', '.######', '.#####.', '..####.'],
    lm: { emoji: '🏛️', name: 'Brandenburger Tor', dx: 3, dy: 2,
      info: 'Das Brandenburger Tor in Berlin ist über 230 Jahre alt und das berühmteste Tor Deutschlands!' },
    fact: 'Deutschland liegt mitten in Europa und hat neun Nachbarländer – mehr als fast jedes andere Land!',
    food: 'Ich esse gern Brezeln – außen braun und salzig, innen weich.',
    hobby: 'Ich spiele im Fußballverein und baue gern Lego-Städte.',
    kids: ['Mia', 'Ben'],
    quiz: { q: 'In welcher Stadt steht das Brandenburger Tor?', correct: 'Berlin', wrong: ['München', 'Hamburg'] }
  },
  {
    id: 'dk', name: 'Dänemark', flag: '🇩🇰', x: 62, y: 28, grass: '#95d078',
    shape: ['.##.#', '###..', '####.', '.##..'],
    lm: { emoji: '🧜‍♀️', name: 'Kleine Meerjungfrau', dx: 1, dy: 2,
      info: 'Am Hafen von Kopenhagen sitzt die kleine Meerjungfrau aus Bronze – wie im Märchen von Hans Christian Andersen.' },
    fact: 'Dänemark besteht aus über 400 Inseln! Und Lego wurde hier erfunden.',
    food: 'Smørrebrød – kunstvoll belegte Brote, fast zu schön zum Essen.',
    hobby: 'Ich baue mit Lego – das kommt nämlich aus Dänemark!',
    kids: ['Freja', 'Emil'],
    quiz: { q: 'Welche Märchenfigur sitzt am Hafen von Kopenhagen?', correct: 'Die kleine Meerjungfrau', wrong: ['Pinocchio', 'Rapunzel'] }
  },
  {
    id: 'no', name: 'Norwegen', flag: '🇳🇴', x: 64, y: 3, grass: '#8cc98c',
    shape: ['....##', '...###', '...##.', '..###.', '..##..', '.###..', '.##...', '###...', '##....', '###...', '.##...'],
    lm: { emoji: '⛵', name: 'Fjorde & Wikingerschiffe', dx: 1, dy: 8,
      info: 'Norwegens Fjorde sind lange Meeresarme zwischen hohen Bergen. Früher segelten hier die Wikinger!' },
    fact: 'Im Sommer wird es bei uns im Norden nachts gar nicht dunkel – Mitternachtssonne!',
    food: 'Ich esse gern Lachs – frisch aus dem kalten Meer.',
    hobby: 'Skifahren kann ich fast so lange wie laufen!',
    kids: ['Ingrid', 'Magnus'],
    quiz: { q: 'Wie heißen die langen Meeresarme in Norwegen?', correct: 'Fjorde', wrong: ['Kanäle', 'Lagunen'] }
  },
  {
    id: 'se', name: 'Schweden', flag: '🇸🇪', x: 72, y: 8, grass: '#9cd280',
    shape: ['..###', '..###', '.####', '.###.', '####.', '###..', '###..', '####.', '.###.', '..##.'],
    lm: { emoji: '🐴', name: 'Dalapferd', dx: 2, dy: 4,
      info: 'Das Dalapferd ist ein knallrot bemaltes Holzpferd – das berühmteste Souvenir Schwedens!' },
    fact: 'In Schweden gibt es riesige Wälder, tausende Seen und viele Elche!',
    food: 'Köttbullar! Kleine Fleischbällchen mit Preiselbeeren.',
    hobby: 'Im Sommer feiern wir Mittsommer und tanzen um eine Blumenstange.',
    kids: ['Elsa', 'Hugo'],
    quiz: { q: 'Aus welchem Land kommt das rote Dalapferd?', correct: 'Schweden', wrong: ['Italien', 'Spanien'] }
  },
  {
    id: 'fi', name: 'Finnland', flag: '🇫🇮', x: 86, y: 5, grass: '#8ed0a0',
    shape: ['.####.', '######', '######', '.#####', '.####.', '..###.', '..##..'],
    lm: { emoji: '🌌', name: 'Nordlichter in Lappland', dx: 2, dy: 2,
      info: 'In Lappland tanzen im Winter grüne und lila Nordlichter am Himmel – und Rentiere laufen durch den Schnee!' },
    fact: 'Finnland ist das Land der tausend Seen – genauer gesagt sind es fast 188.000!',
    food: 'Zimtschnecken – bei uns heißen sie Korvapuusti.',
    hobby: 'Wir gehen in die Sauna und springen danach in den See – auch im Winter!',
    kids: ['Aino', 'Onni'],
    quiz: { q: 'Was kann man in Finnland nachts am Himmel sehen?', correct: 'Nordlichter', wrong: ['Jeden Tag Feuerwerk', 'Fliegende Wale'] }
  },
  {
    id: 'ee', name: 'Estland', flag: '🇪🇪', x: 98, y: 24, grass: '#93cf75',
    shape: ['####', '####'],
    lm: { emoji: '🏰', name: 'Altstadt von Tallinn', dx: 1, dy: 0,
      info: 'Die Altstadt von Tallinn sieht aus wie aus einem Ritter-Märchen: Stadtmauern, Türme und bunte Häuser!' },
    fact: 'Estland ist superdigital – bei uns kann man fast alles online machen, sogar wählen!',
    food: 'Kama – ein süßer Brei, den es nur bei uns gibt.',
    hobby: 'Ich singe im Chor. Estland ist berühmt für riesige Sängerfeste!',
    kids: ['Kertu', 'Oskar'],
    quiz: { q: 'Wie heißt die Hauptstadt von Estland?', correct: 'Tallinn', wrong: ['Riga', 'Vilnius'] }
  },
  {
    id: 'lv', name: 'Lettland', flag: '🇱🇻', x: 97, y: 29, grass: '#a0d16e',
    shape: ['.#####', '####..'],
    lm: { emoji: '🕊️', name: 'Freiheitsdenkmal Riga', dx: 2, dy: 0,
      info: 'Das Freiheitsdenkmal in Riga hält drei goldene Sterne hoch in den Himmel.' },
    fact: 'Lettland hat wunderschöne Ostsee-Strände mit ganz feinem, weißem Sand!',
    food: 'Ich mag Piragi – kleine warme Teigtaschen mit Speck.',
    hobby: 'Im Sommer sammeln wir Beeren und Pilze im Wald.',
    kids: ['Līga', 'Kārlis'],
    quiz: { q: 'Wie heißt die Hauptstadt von Lettland?', correct: 'Riga', wrong: ['Tallinn', 'Warschau'] }
  },
  {
    id: 'lt', name: 'Litauen', flag: '🇱🇹', x: 95, y: 33, grass: '#8bc86e',
    shape: ['..####', '#####.'],
    lm: { emoji: '🏀', name: 'Basketball-Arena Kaunas', dx: 3, dy: 0,
      info: 'Basketball ist in Litauen fast eine zweite Religion – das ganze Land fiebert bei jedem Spiel mit!' },
    fact: 'Litauen liegt fast genau in der geografischen Mitte Europas!',
    food: 'Cepelinai – Kartoffelklöße, die wie kleine Zeppeline aussehen.',
    hobby: 'Basketball natürlich! Ich werfe jeden Tag Körbe.',
    kids: ['Gabija', 'Matas'],
    quiz: { q: 'Welcher Sport ist in Litauen superbeliebt?', correct: 'Basketball', wrong: ['Surfen', 'Skispringen'] }
  },
  {
    id: 'pl', name: 'Polen', flag: '🇵🇱', x: 76, y: 36, grass: '#96cc60',
    shape: ['.######', '#######', '#######', '.#####.'],
    lm: { emoji: '🐉', name: 'Wawel-Drache in Krakau', dx: 3, dy: 1,
      info: 'Unter dem Wawel-Hügel in Krakau soll ein Drache gewohnt haben! Heute speit seine Statue echtes Feuer.' },
    fact: 'In Polen gibt es eine Drachensage, wunderschöne Altstädte und die Ostsee!',
    food: 'Pierogi! Teigtaschen mit ganz vielen Füllungen.',
    hobby: 'Ich spiele Schach – und suche im Sommer Bernstein am Strand.',
    kids: ['Zuzanna', 'Jakub'],
    quiz: { q: 'Welches Fabelwesen wohnt der Sage nach in Krakau?', correct: 'Ein Drache', wrong: ['Ein Einhorn', 'Ein Yeti'] }
  },
  {
    id: 'cz', name: 'Tschechien', flag: '🇨🇿', x: 70, y: 46, grass: '#88ca74',
    shape: ['######', '.####.'],
    lm: { emoji: '🌉', name: 'Karlsbrücke in Prag', dx: 2, dy: 0,
      info: 'Die Karlsbrücke in Prag ist über 600 Jahre alt und voller Statuen, Musiker und Maler!' },
    fact: 'Prag nennt man die „Goldene Stadt“ – mit hundert Türmen und einer riesigen Burg!',
    food: 'Ich liebe Trdelník – süße Teigrollen mit Zimt und Zucker.',
    hobby: 'Ich spiele Eishockey, unseren Lieblingssport!',
    kids: ['Eliška', 'Jan'],
    quiz: { q: 'Wie heißt die berühmte Brücke in Prag?', correct: 'Karlsbrücke', wrong: ['Tower Bridge', 'Golden Gate'] }
  },
  {
    id: 'at', name: 'Österreich', flag: '🇦🇹', x: 68, y: 52, grass: '#90cc82',
    shape: ['..#####', '######.'],
    lm: { emoji: '🎡', name: 'Wiener Riesenrad', dx: 4, dy: 0,
      info: 'Das Riesenrad im Wiener Prater dreht sich seit 1897 – von oben sieht man ganz Wien!' },
    fact: 'Österreich ist das Land der Alpen und der Musik – Mozart kam von hier!',
    food: 'Kaiserschmarrn! Zerrupfter süßer Pfannkuchen mit Apfelmus.',
    hobby: 'Im Winter fahre ich Ski, im Sommer wandere ich auf Almen.',
    kids: ['Anna', 'Felix'],
    quiz: { q: 'Wie heißen die hohen Berge in Österreich?', correct: 'Die Alpen', wrong: ['Die Anden', 'Die Pyrenäen'] }
  },
  {
    id: 'ch', name: 'Schweiz', flag: '🇨🇭', x: 58, y: 52, grass: '#a2d28c',
    shape: ['.####', '#####'],
    lm: { emoji: '🏔️', name: 'Matterhorn', dx: 2, dy: 1,
      info: 'Das Matterhorn ist der berühmteste Berg der Schweiz – seine Spitze sieht aus wie ein Zacken aus Stein!' },
    fact: 'Die Schweiz hat vier Sprachen, hohe Berge und die besten Schokoladen-Erfinder!',
    food: 'Käsefondue – geschmolzener Käse, in den man Brot tunkt.',
    hobby: 'Ich rodle im Winter die Berge hinunter!',
    kids: ['Lina', 'Luca'],
    quiz: { q: 'Wie heißt der berühmte spitze Berg der Schweiz?', correct: 'Matterhorn', wrong: ['Zuckerhut', 'Mount Everest'] }
  },
  {
    id: 'it', name: 'Italien', flag: '🇮🇹', x: 62, y: 62, grass: '#b0d46e',
    shape: ['###...', '.###..', '.####.', '..###.', '...###', '...###', '....##'],
    lm: { emoji: '🏟️', name: 'Kolosseum', dx: 2, dy: 2,
      info: 'Das Kolosseum in Rom ist fast 2000 Jahre alt! Hier schauten sich 50.000 Römer Wettkämpfe an.' },
    fact: 'Italien sieht auf der Karte aus wie ein Stiefel – und ist die Heimat von Pizza und Gelato!',
    food: 'Pizza Margherita und danach ein Eis – am liebsten Stracciatella!',
    hobby: 'Ich spiele Fußball auf der Piazza, bis es dunkel wird.',
    kids: ['Giulia', 'Marco'],
    quiz: { q: 'Was schauten die alten Römer im Kolosseum an?', correct: 'Wettkämpfe', wrong: ['Kinofilme', 'Fußballspiele'] }
  },
  {
    id: 'hu', name: 'Ungarn', flag: '🇭🇺', x: 80, y: 52, grass: '#c2cf6a',
    shape: ['.#####', '######'],
    lm: { emoji: '♨️', name: 'Thermalbäder Budapest', dx: 2, dy: 1,
      info: 'In Budapest sprudelt warmes Wasser aus der Erde – man badet draußen in dampfenden Becken, sogar im Winter!' },
    fact: 'In Budapest kann man in riesigen warmen Bädern planschen – mitten in der Stadt!',
    food: 'Gulasch! Und Lángos – frittiertes Brot mit Käse.',
    hobby: 'Ich schwimme im Verein – Ungarn hat viele Schwimm-Champions.',
    kids: ['Hanna', 'Bence'],
    quiz: { q: 'Wofür ist Budapest berühmt?', correct: 'Warme Thermalbäder', wrong: ['Schneeberge', 'Wüsten'] }
  },
  {
    id: 'hr', name: 'Kroatien', flag: '🇭🇷', x: 74, y: 58, grass: '#a6ce7c',
    shape: ['####.', '.####', '..###'],
    lm: { emoji: '🏖️', name: 'Altstadt von Dubrovnik', dx: 3, dy: 2,
      info: 'Dubrovnik hat eine riesige Stadtmauer direkt am blauen Meer – wie eine Burg am Strand!' },
    fact: 'Kroatien hat über 1000 Inseln in der glasklaren, blauen Adria!',
    food: 'Frisch gegrillter Fisch am Meer – und Eis danach.',
    hobby: 'Ich schnorchle und suche Muscheln.',
    kids: ['Petra', 'Ivan'],
    quiz: { q: 'An welchem Meer liegt Kroatien?', correct: 'An der Adria (Mittelmeer)', wrong: ['An der Nordsee', 'Am Atlantik'] }
  },
  {
    id: 'gr', name: 'Griechenland', flag: '🇬🇷', x: 82, y: 66, grass: '#d0cd7a',
    shape: ['#####', '.####', '..##.', '..###'],
    lm: { emoji: '🏺', name: 'Akropolis', dx: 2, dy: 1,
      info: 'Die Akropolis thront über Athen. Der Tempel ist 2500 Jahre alt – aus der Zeit der alten Griechen und ihrer Götter-Sagen!' },
    fact: 'Griechenland ist das Land der alten Sagen: Zeus, Herkules und die Olympischen Spiele kommen von hier!',
    food: 'Gyros mit Tzatziki – und süßes Baklava!',
    hobby: 'Ich schwimme im Meer und höre gern griechische Sagen.',
    kids: ['Eleni', 'Nikos'],
    quiz: { q: 'Wie heißt der berühmte Tempelberg in Athen?', correct: 'Akropolis', wrong: ['Olymp-Center', 'Kolosseum'] }
  },
  {
    id: 'ro', name: 'Rumänien', flag: '🇷🇴', x: 88, y: 54, grass: '#9cc96e',
    shape: ['..#####', '#######', '######.'],
    lm: { emoji: '🦇', name: 'Schloss Bran', dx: 3, dy: 1,
      info: 'Schloss Bran steht auf einem Felsen in den Karpaten – viele erzählen sich hier Gruselgeschichten über Graf Dracula. Huuu!' },
    fact: 'In unseren Karpaten-Wäldern leben echte Bären! Und wir haben ein berühmtes Gruselschloss.',
    food: 'Ich mag Mămăligă – goldgelber Maisbrei mit Käse.',
    hobby: 'Ich wandere in den Bergen und erzähle abends Gruselgeschichten.',
    kids: ['Ioana', 'Andrei'],
    quiz: { q: 'Welches Schloss in Rumänien ist durch Gruselgeschichten berühmt?', correct: 'Schloss Bran', wrong: ['Schloss Neuschwanstein', 'Hogwarts'] }
  }
];

/* Seebrücken / Wege zwischen den Ländern (begehbar) */
const BRIDGES = [
  ['is', 'uk'], ['ie', 'uk'], ['uk', 'fr'],
  ['fr', 'be'], ['be', 'nl'], ['nl', 'de'], ['be', 'de'], ['fr', 'de'],
  ['fr', 'es'], ['es', 'pt'], ['fr', 'ch'], ['ch', 'it'], ['ch', 'at'],
  ['at', 'de'], ['at', 'it'], ['at', 'cz'], ['at', 'hu'],
  ['cz', 'de'], ['cz', 'pl'], ['de', 'pl'], ['de', 'dk'],
  ['dk', 'se'], ['dk', 'no'], ['se', 'no'], ['se', 'fi'],
  ['fi', 'ee'], ['ee', 'lv'], ['lv', 'lt'], ['lt', 'pl'],
  ['hu', 'hr'], ['hu', 'ro'], ['it', 'hr'], ['hr', 'gr']
];

/* Moderator:innen – stellen Aufgaben (Quiz & Reise-Aufgaben) */
const MODERATORS = [
  { country: 'de', name: 'Moderator Jonas' },
  { country: 'fr', name: 'Moderatorin Marie' },
  { country: 'pl', name: 'Moderatorin Ola' },
  { country: 'it', name: 'Moderator Matteo' },
  { country: 'se', name: 'Moderatorin Astrid' },
  { country: 'es', name: 'Moderator Diego' }
];

/* Antworten der Schüler:innen im Chat */
const SMALLTALK = [
  'Voll cool, dass du hier bist! 😄',
  'Warst du schon in vielen Ländern auf der Karte?',
  'Ich finde es toll, neue Freunde aus ganz Europa zu treffen!',
  'Die Moderator:innen haben heute wieder neue Aufgaben, hast du schon eine gemacht?',
  'Wenn du magst, besuch mal unser Wahrzeichen – es ist gleich hier in der Nähe!',
  'Ich lerne gerade ein paar Wörter in anderen Sprachen. Kennst du eins?',
  'Auf der Karte kann man über die Seebrücken in jedes Land laufen!'
];

const FAREWELLS = [
  'Tschüss! Komm bald wieder vorbei! 👋',
  'Bis bald! Gute Reise durch Europa! 🧭',
  'Ciao! War schön, mit dir zu schreiben! 😊'
];

/* Charakter-Editor-Paletten */
const SKIN_TONES = ['#ffe0c2', '#f5c99b', '#e0a878', '#c68a5a', '#9c6a42', '#7a4f30'];
const HAIR_COLORS = ['#3b2a1d', '#181512', '#a86325', '#e0b34c', '#c9432c', '#7d54c9'];
const SHIRT_COLORS = ['#e64a4a', '#3f7de0', '#3fae5c', '#e6a23c', '#9b59d0', '#e5679c', '#2ec4b6', '#f4d35e'];
const HAIR_STYLES = [
  { id: 'kurz', label: 'Kurz' },
  { id: 'lang', label: 'Lang' },
  { id: 'wuschel', label: 'Wuschelig' },
  { id: 'pony', label: 'Pony' }
];
