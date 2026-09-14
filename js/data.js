/* ============================================================
   hey EU – Daten: Länder, Wahrzeichen, Fakten, Quiz, Brücken
   45 Länder: alle 27 EU-Mitglieder, die europäischen Zwerg-
   staaten und die weiteren Länder des Kontinents.
   Flaggen werden in js/flags.js gezeichnet (keine Emojis),
   Wahrzeichen in js/landmarks.js.
   ============================================================ */

const TILE = 16;              // Pixelgröße einer Kachel
const MAP_SCALE = 2;          // die Europakarte wird 2x vergrößert
/* WORLD_W / WORLD_H stehen in js/mapdata.js */

/* Kachel-Typen */
const T_SEA = 0, T_GRASS = 1, T_BRIDGE = 2, T_TREE = 3, T_MOUNTAIN = 4,
      T_FLOWER = 5, T_LANDMARK = 6, T_BOARD = 7, T_PATH = 8, T_HOUSE = 9,
      T_ROCK = 10, T_BUSH = 11;

/* tiny: true  = Zwergstaat, auf der Karte bewusst übergroß gezeichnet
   lm.art      = Name der Zeichenfunktion in js/landmarks.js */
const COUNTRIES = [
  {
    id: 'is', name: 'Island', grass: '#93c98a', eu: false,
    lm: { art: 'geysir', name: 'Geysir Strokkur',
      info: 'Island ist die Insel aus Feuer und Eis. Der Geysir Strokkur schießt alle paar Minuten eine kochend heiße Wasserfontäne bis zu 20 Meter hoch in die Luft!' },
    fact: 'Bei uns gibt es Vulkane, Geysire und im Winter tanzen Nordlichter am Himmel!',
    food: 'Ich esse gern Skyr – das ist ein dicker, cremiger Joghurt aus Island.',
    hobby: 'Ich bade super gern in heißen Quellen, sogar wenn es draußen schneit!',
    kids: ['Elín', 'Jón'],
    quiz: { q: 'Wie heißt die Hauptstadt von Island?', correct: 'Reykjavík', wrong: ['Oslo', 'Helsinki'] }
  },
  {
    id: 'ie', name: 'Irland', grass: '#63c455', eu: true,
    lm: { art: 'cliffs', name: 'Cliffs of Moher',
      info: 'Die Klippen von Moher fallen über 200 Meter steil ins Meer – so hoch wie ein Haus mit 70 Stockwerken. Unten brechen sich die Wellen des Atlantiks.' },
    fact: 'Irland ist so grün, dass man es die Grüne Insel nennt. Wir lieben Musik und alte Geschichten!',
    food: 'Ich mag Irish Stew – ein warmer Eintopf, perfekt bei Regenwetter.',
    hobby: 'Ich tanze irischen Stepptanz – dabei bewegen sich nur die Füße, superschnell!',
    kids: ['Aoife', 'Liam'],
    quiz: { q: 'Welche Farbe verbindet man mit Irland?', correct: 'Grün', wrong: ['Rot', 'Schwarz'] }
  },
  {
    id: 'uk', name: 'Großbritannien', grass: '#86c563', eu: false,
    lm: { art: 'bigben', name: 'Big Ben',
      info: 'Big Ben ist eigentlich der Name der riesigen Glocke im Uhrturm des Parlaments in London. Sie wiegt 13 Tonnen – so viel wie zwei Elefanten!' },
    fact: 'In London fahren rote Doppeldeckerbusse, und wir haben einen König im Buckingham-Palast!',
    food: 'Ich liebe Fish and Chips – Fisch mit dicken Pommes, direkt aus dem Papier.',
    hobby: 'Ich spiele Fußball im Park, fast jeden Tag – auch im Regen!',
    kids: ['Amelia', 'Oliver'],
    quiz: { q: 'Wie heißt die berühmte Glocke im Londoner Uhrturm?', correct: 'Big Ben', wrong: ['Ding Dong', 'Tower Bell'] }
  },
  {
    id: 'pt', name: 'Portugal', grass: '#a6cf63', eu: true,
    lm: { art: 'belem', name: 'Turm von Belém',
      info: 'Der Turm von Belém steht seit 500 Jahren am Wasser in Lissabon. Von hier stachen früher die Segelschiffe der Entdecker in See.' },
    fact: 'Von Portugal aus segelten mutige Entdecker als Erste um die ganze Welt!',
    food: 'Pastéis de Nata! Warme Puddingtörtchen mit Zimt – einfach himmlisch.',
    hobby: 'Ich surfe gern. Bei uns in Nazaré gibt es die größten Wellen der Welt!',
    kids: ['Beatriz', 'Tiago'],
    quiz: { q: 'An welchem Ozean liegt Portugal?', correct: 'Atlantik', wrong: ['Ostsee', 'Schwarzes Meer'] }
  },
  {
    id: 'es', name: 'Spanien', grass: '#cfc563', eu: true,
    lm: { art: 'sagrada', name: 'Sagrada Família',
      info: 'An dieser Kirche in Barcelona wird seit über 140 Jahren gebaut! Ihr Erfinder Antoni Gaudí ließ sich von Bäumen und Höhlen inspirieren.' },
    fact: 'Bei uns scheint fast immer die Sonne, und abends teilen alle zusammen Tapas – viele kleine Gerichte!',
    food: 'Paella – Reis mit Gemüse und Meeresfrüchten aus einer riesigen flachen Pfanne.',
    hobby: 'Ich tanze Flamenco, mit Klatschen und Stampfen!',
    kids: ['Lucía', 'Pablo'],
    quiz: { q: 'Wer hat die Sagrada Família entworfen?', correct: 'Antoni Gaudí', wrong: ['Pablo Picasso', 'Lionel Messi'] }
  },
  {
    id: 'ad', name: 'Andorra', grass: '#9fc27a', eu: false, tiny: true,
    lm: { art: 'pyrenees', name: 'Die Pyrenäen-Täler',
      info: 'Andorra ist winzig: Es passt 600-mal in die Niederlande! Das ganze Land liegt hoch oben in den Bergen zwischen Spanien und Frankreich. Auf unserer Karte haben wir es extra viel größer gemalt – sonst wärst du größer als das Land.' },
    fact: 'Andorra hat kein einziges Flugzeug-Flughafengebäude und keine Armee – dafür ganz viele Berge!',
    food: 'Trinxat – ein Pfannengericht aus Kartoffeln, Kohl und Speck. Genau richtig nach dem Skifahren.',
    hobby: 'Ich fahre Snowboard. Bei uns liegt von Dezember bis April Schnee!',
    kids: ['Nuria', 'Marc'],
    quiz: { q: 'Zwischen welchen zwei Ländern liegt Andorra?', correct: 'Spanien und Frankreich', wrong: ['Italien und Schweiz', 'Polen und Tschechien'] }
  },
  {
    id: 'fr', name: 'Frankreich', grass: '#8bc95a', eu: true,
    lm: { art: 'eiffel', name: 'Eiffelturm',
      info: 'Der Eiffelturm ist 330 Meter hoch und besteht aus 18.000 Eisenteilen. Im Sommer dehnt sich das Eisen aus – dann ist der Turm bis zu 15 Zentimeter größer!' },
    fact: 'Frankreich ist berühmt für Paris, für über 1000 Käsesorten und für knuspriges Baguette!',
    food: 'Croissants zum Frühstück – außen knusprig, innen ganz fluffig.',
    hobby: 'Ich fahre gern Rad, wie bei der Tour de France – nur etwas langsamer.',
    kids: ['Chloé', 'Louis'],
    quiz: { q: 'Wie hoch ist der Eiffelturm ungefähr?', correct: '330 Meter', wrong: ['30 Meter', '3000 Meter'] }
  },
  {
    id: 'mc', name: 'Monaco', grass: '#b8c775', eu: false, tiny: true,
    lm: { art: 'harbor', name: 'Hafen von Monte-Carlo',
      info: 'Monaco ist das zweitkleinste Land der Welt – du kannst es in 40 Minuten zu Fuß durchqueren! Einmal im Jahr wird mitten durch die Straßen ein Formel-1-Rennen gefahren.' },
    fact: 'Ganz Monaco ist kleiner als der Flughafen München. Trotzdem wohnen hier 38.000 Menschen!',
    food: 'Barbagiuan – kleine frittierte Teigtaschen mit Mangold und Käse.',
    hobby: 'Ich schaue jedes Jahr das Autorennen – die Boxengasse ist gleich neben unserem Hafen.',
    kids: ['Sophie', 'Louis-Marie'],
    quiz: { q: 'Was findet jedes Jahr auf Monacos Straßen statt?', correct: 'Ein Formel-1-Rennen', wrong: ['Ein Kamelrennen', 'Ein Skisprung-Wettbewerb'] }
  },
  {
    id: 'be', name: 'Belgien', grass: '#76c657', eu: true,
    lm: { art: 'atomium', name: 'Atomium',
      info: 'Das Atomium in Brüssel ist ein 102 Meter hohes Modell eines Eisenkristalls – 165 Milliarden Mal vergrößert! In den Kugeln kann man herumlaufen.' },
    fact: 'Belgien ist klein, aber berühmt: für Schokolade, Waffeln, Pommes und Comics!',
    food: 'Belgische Waffeln mit Erdbeeren und warmer Schokosoße.',
    hobby: 'Ich lese gern Comics – die Schlümpfe und Tim & Struppi wurden hier erfunden!',
    kids: ['Noor', 'Arthur'],
    quiz: { q: 'Welches Bauwerk in Brüssel sieht aus wie ein Riesen-Kristall?', correct: 'Das Atomium', wrong: ['Der Schiefe Turm', 'Die Glaspyramide'] }
  },
  {
    id: 'lu', name: 'Luxemburg', grass: '#8fc96f', eu: true,
    lm: { art: 'bockfels', name: 'Kasematten am Bockfelsen',
      info: 'Unter der Stadt Luxemburg liegen 17 Kilometer Gänge im Felsen – wie ein riesiges Labyrinth. Früher versteckten sich dort tausende Menschen.' },
    fact: 'In Luxemburg spricht man drei Sprachen: Luxemburgisch, Französisch und Deutsch – oft alle drei an einem Tag!',
    food: 'Judd mat Gaardebounen – geräucherter Schweinenacken mit dicken Bohnen.',
    hobby: 'Ich fahre mit dem Bus und der Bahn herum – bei uns ist das für alle kostenlos!',
    kids: ['Lena', 'Mats'],
    quiz: { q: 'Wie viele Amtssprachen hat Luxemburg?', correct: 'Drei', wrong: ['Eine', 'Sieben'] }
  },
  {
    id: 'nl', name: 'Niederlande', grass: '#95cd68', eu: true,
    lm: { art: 'windmill', name: 'Windmühlen von Kinderdijk',
      info: 'Ein Viertel der Niederlande liegt unter dem Meeresspiegel! Die alten Windmühlen pumpten früher das Wasser aus dem Land, damit niemand nasse Füße bekam.' },
    fact: 'Bei uns gibt es mehr Fahrräder als Menschen – und überall Radwege!',
    food: 'Poffertjes! Winzige dicke Pfannkuchen mit Butter und Puderzucker.',
    hobby: 'Im Winter laufe ich Schlittschuh auf den zugefrorenen Kanälen.',
    kids: ['Sanne', 'Daan'],
    quiz: { q: 'Wofür wurden die alten Windmühlen gebraucht?', correct: 'Wasser aus dem Land pumpen', wrong: ['Strom für Lampen', 'Eis herstellen'] }
  },
  {
    id: 'de', name: 'Deutschland', grass: '#7fc765', eu: true,
    lm: { art: 'brandenburg', name: 'Brandenburger Tor',
      info: 'Das Brandenburger Tor in Berlin ist über 230 Jahre alt. Oben steht eine Siegesgöttin auf einem Wagen mit vier Pferden.' },
    fact: 'Deutschland hat neun Nachbarländer – mehr als fast jedes andere Land Europas!',
    food: 'Ich esse gern Brezeln – außen braun und salzig, innen ganz weich.',
    hobby: 'Ich spiele im Fußballverein und baue zu Hause große Lego-Städte.',
    kids: ['Mia', 'Ben'],
    quiz: { q: 'In welcher Stadt steht das Brandenburger Tor?', correct: 'Berlin', wrong: ['München', 'Hamburg'] }
  },
  {
    id: 'dk', name: 'Dänemark', grass: '#8fcd72', eu: true,
    lm: { art: 'mermaid', name: 'Die kleine Meerjungfrau',
      info: 'Am Hafen von Kopenhagen sitzt seit 1913 die kleine Meerjungfrau aus Bronze. Sie stammt aus einem Märchen von Hans Christian Andersen.' },
    fact: 'Dänemark besteht aus über 400 Inseln! Und Lego wurde hier erfunden.',
    food: 'Smørrebrød – kunstvoll belegte Butterbrote, fast zu schön zum Essen.',
    hobby: 'Ich baue mit Lego. Der Name kommt von „leg godt“ – spiel gut!',
    kids: ['Freja', 'Emil'],
    quiz: { q: 'Welches beliebte Spielzeug kommt aus Dänemark?', correct: 'Lego', wrong: ['Playmobil', 'Der Zauberwürfel'] }
  },
  {
    id: 'no', name: 'Norwegen', grass: '#83c684', eu: false,
    lm: { art: 'viking', name: 'Fjorde und Wikingerschiffe',
      info: 'Fjorde sind tiefe Meeresarme zwischen steilen Bergen – von Gletschern geformt. Der Sognefjord ist 200 Kilometer lang!' },
    fact: 'Im Sommer geht bei uns im Norden die Sonne wochenlang gar nicht unter – Mitternachtssonne!',
    food: 'Ich esse gern Lachs, frisch aus dem kalten Meer.',
    hobby: 'Skifahren! Bei uns heißt es: Norweger werden mit Skiern an den Füßen geboren.',
    kids: ['Ingrid', 'Magnus'],
    quiz: { q: 'Wie heißen die langen Meeresarme in Norwegen?', correct: 'Fjorde', wrong: ['Kanäle', 'Lagunen'] }
  },
  {
    id: 'se', name: 'Schweden', grass: '#96d075', eu: true,
    lm: { art: 'dalahorse', name: 'Das Dalapferd',
      info: 'Das rote Dalapferd wird seit über 400 Jahren aus Holz geschnitzt und von Hand bemalt. Jedes Pferd ist ein Einzelstück.' },
    fact: 'In Schweden gibt es riesige Wälder, fast 100.000 Seen und etwa 300.000 Elche!',
    food: 'Köttbullar! Kleine Fleischbällchen mit Kartoffelbrei und Preiselbeeren.',
    hobby: 'Im Sommer feiern wir Mittsommer und tanzen um eine geschmückte Stange.',
    kids: ['Elsa', 'Hugo'],
    quiz: { q: 'Welche Farbe hat das berühmte Dalapferd?', correct: 'Rot', wrong: ['Blau', 'Schwarz'] }
  },
  {
    id: 'fi', name: 'Finnland', grass: '#88cf9a', eu: true,
    lm: { art: 'aurora', name: 'Nordlichter in Lappland',
      info: 'Nordlichter entstehen, wenn Teilchen von der Sonne auf die Luft über der Erde treffen. In Lappland leuchten sie an bis zu 200 Nächten im Jahr grün und violett.' },
    fact: 'Finnland ist das Land der tausend Seen – genauer gesagt sind es 188.000!',
    food: 'Korvapuusti – finnische Zimtschnecken, am besten noch ofenwarm.',
    hobby: 'Wir gehen in die Sauna und springen danach in den See. Auch im Winter!',
    kids: ['Aino', 'Onni'],
    quiz: { q: 'Was kann man in Lappland nachts am Himmel sehen?', correct: 'Nordlichter', wrong: ['Jeden Tag Feuerwerk', 'Fliegende Wale'] }
  },
  {
    id: 'ee', name: 'Estland', grass: '#8ecc71', eu: true,
    lm: { art: 'tallinn', name: 'Altstadt von Tallinn',
      info: 'Tallinns Altstadt ist fast vollständig von einer mittelalterlichen Mauer mit 20 Wehrtürmen umgeben – eine der besterhaltenen in ganz Europa.' },
    fact: 'Estland ist super digital: Bei uns kann man sogar per Internet wählen!',
    food: 'Kama – ein Pulver aus geröstetem Getreide, das man mit Buttermilch verrührt.',
    hobby: 'Ich singe im Chor. Bei unserem Sängerfest singen 30.000 Menschen gleichzeitig!',
    kids: ['Kertu', 'Oskar'],
    quiz: { q: 'Wie heißt die Hauptstadt von Estland?', correct: 'Tallinn', wrong: ['Riga', 'Vilnius'] }
  },
  {
    id: 'lv', name: 'Lettland', grass: '#9ccf69', eu: true,
    lm: { art: 'column', name: 'Freiheitsdenkmal in Riga',
      info: 'Das 42 Meter hohe Freiheitsdenkmal in Riga wurde von den Menschen selbst bezahlt – jeder spendete, was er konnte. Oben hält eine Frau drei goldene Sterne.' },
    fact: 'Über die Hälfte von Lettland ist Wald – und an der Ostsee gibt es feine weiße Sandstrände.',
    food: 'Pīrāgi – kleine warme Teigtaschen mit Speck und Zwiebeln.',
    hobby: 'Im Sommer sammeln wir Blaubeeren und Pilze im Wald.',
    kids: ['Līga', 'Kārlis'],
    quiz: { q: 'Wie heißt die Hauptstadt von Lettland?', correct: 'Riga', wrong: ['Tallinn', 'Warschau'] }
  },
  {
    id: 'lt', name: 'Litauen', grass: '#85c669', eu: true,
    lm: { art: 'crosses', name: 'Der Berg der Kreuze',
      info: 'Auf diesem Hügel bei Šiauliai stehen über 100.000 Kreuze. Die Menschen stellen seit 200 Jahren immer neue dazu – klein wie eine Hand oder größer als ein Mensch.' },
    fact: 'Litauen liegt fast genau im geografischen Mittelpunkt Europas!',
    food: 'Cepelinai – große Kartoffelklöße, die wie kleine Zeppeline aussehen.',
    hobby: 'Basketball! Bei uns fiebert das ganze Land bei jedem Spiel mit.',
    kids: ['Gabija', 'Matas'],
    quiz: { q: 'Welcher Sport ist in Litauen besonders beliebt?', correct: 'Basketball', wrong: ['Surfen', 'Skispringen'] }
  },
  {
    id: 'by', name: 'Belarus', grass: '#8ac876', eu: false,
    lm: { art: 'mircastle', name: 'Schloss Mir',
      info: 'Das Schloss Mir ist über 500 Jahre alt und hat fünf Türme aus rotem Backstein. Drumherum liegen ein See und ein alter Park.' },
    fact: 'In unserem Urwald Belowescher Heide leben noch echte Wisente – die größten Landtiere Europas!',
    food: 'Draniki – knusprige Kartoffelpuffer mit saurer Sahne.',
    hobby: 'Ich fahre im Winter Langlaufski durch den verschneiten Wald.',
    kids: ['Alesia', 'Ihar'],
    quiz: { q: 'Welches große Wildtier lebt in den Wäldern von Belarus?', correct: 'Der Wisent', wrong: ['Der Tiger', 'Das Nashorn'] }
  },
  {
    id: 'pl', name: 'Polen', grass: '#90ca5c', eu: true,
    lm: { art: 'dragon', name: 'Der Wawel-Drache',
      info: 'Der Sage nach wohnte unter dem Wawel-Hügel in Krakau ein Drache. Heute steht dort eine Drachenstatue, die alle paar Minuten echtes Feuer speit!' },
    fact: 'In Polen gibt es über 2000 Seen, alte Königsstädte und die Ostsee mit Bernstein am Strand.',
    food: 'Pierogi! Teigtaschen mit Kartoffeln, Quark oder Blaubeeren.',
    hobby: 'Ich spiele Schach – und suche im Sommer Bernstein am Strand.',
    kids: ['Zuzanna', 'Jakub'],
    quiz: { q: 'Welches Fabelwesen wohnt der Sage nach unter dem Wawel-Hügel?', correct: 'Ein Drache', wrong: ['Ein Einhorn', 'Ein Yeti'] }
  },
  {
    id: 'cz', name: 'Tschechien', grass: '#83c66e', eu: true,
    lm: { art: 'charlesbridge', name: 'Karlsbrücke in Prag',
      info: 'Die Karlsbrücke wurde vor über 660 Jahren gebaut. 30 Statuen stehen auf ihr Spalier, und darunter fließt die Moldau.' },
    fact: 'Prag nennt man die Goldene Stadt – mit hundert Türmen und der größten Burg der Welt!',
    food: 'Trdelník – süße Teigrollen über dem Feuer gebacken, mit Zimt und Zucker.',
    hobby: 'Ich spiele Eishockey. Das ist bei uns der Lieblingssport!',
    kids: ['Eliška', 'Jan'],
    quiz: { q: 'Wie heißt die berühmte Steinbrücke in Prag?', correct: 'Karlsbrücke', wrong: ['Tower Bridge', 'Golden Gate'] }
  },
  {
    id: 'sk', name: 'Slowakei', grass: '#8bc873', eu: true,
    lm: { art: 'castle4', name: 'Burg Bratislava',
      info: 'Die Burg von Bratislava thront auf einem Felsen über der Donau. Sie hat vier Ecktürme und sieht von Weitem aus wie ein umgedrehter Tisch.' },
    fact: 'Die Slowakei hat über 6000 Höhlen und mehr Burgen pro Einwohner als jedes andere Land der Welt!',
    food: 'Bryndzové halušky – kleine Kartoffelnocken mit Schafskäse.',
    hobby: 'Ich wandere in der Hohen Tatra, unseren höchsten Bergen.',
    kids: ['Nina', 'Samuel'],
    quiz: { q: 'An welchem großen Fluss liegt Bratislava?', correct: 'An der Donau', wrong: ['Am Rhein', 'An der Themse'] }
  },
  {
    id: 'at', name: 'Österreich', grass: '#8bc97d', eu: true,
    lm: { art: 'ferris', name: 'Wiener Riesenrad',
      info: 'Das Riesenrad im Wiener Prater dreht sich seit 1897. Seine Gondeln sind so groß wie kleine Zimmer – man kann darin sogar essen!' },
    fact: 'Fast zwei Drittel von Österreich sind Berge. Und Mozart wurde hier geboren!',
    food: 'Kaiserschmarrn – zerrupfter süßer Pfannkuchen mit Apfelmus.',
    hobby: 'Im Winter fahre ich Ski, im Sommer wandere ich auf die Almen.',
    kids: ['Anna', 'Felix'],
    quiz: { q: 'Wie heißt das Gebirge, das durch Österreich zieht?', correct: 'Die Alpen', wrong: ['Die Anden', 'Die Pyrenäen'] }
  },
  {
    id: 'ch', name: 'Schweiz', grass: '#9cd087', eu: false,
    lm: { art: 'matterhorn', name: 'Matterhorn',
      info: 'Das Matterhorn ist 4478 Meter hoch und hat vier fast gleich steile Seiten – deshalb sieht es aus wie eine Pyramide aus Fels.' },
    fact: 'In der Schweiz spricht man vier Sprachen: Deutsch, Französisch, Italienisch und Rätoromanisch.',
    food: 'Käsefondue – geschmolzener Käse im Topf, in den man Brotstücke tunkt.',
    hobby: 'Ich rodle im Winter die Berghänge hinunter.',
    kids: ['Lina', 'Luca'],
    quiz: { q: 'Wie heißt der berühmte pyramidenförmige Berg der Schweiz?', correct: 'Matterhorn', wrong: ['Zuckerhut', 'Mount Everest'] }
  },
  {
    id: 'li', name: 'Liechtenstein', grass: '#a3cc84', eu: false, tiny: true,
    lm: { art: 'hillcastle', name: 'Schloss Vaduz',
      info: 'Liechtenstein ist nur 25 Kilometer lang – man kann es an einem Tag zu Fuß durchwandern. Über der Hauptstadt thront das Schloss, in dem der Fürst wirklich wohnt.' },
    fact: 'Liechtenstein hat keine eigene Armee und keinen Flughafen – aber einen echten Fürsten!',
    food: 'Käsknöpfle – kleine Teigknöpfe mit geschmolzenem Käse und Röstzwiebeln.',
    hobby: 'Ich wandere auf den Fürstensteig, einen schmalen Pfad hoch über dem Tal.',
    kids: ['Hanna', 'Jonas'],
    quiz: { q: 'Wer wohnt im Schloss über Vaduz?', correct: 'Der Fürst', wrong: ['Der Präsident', 'Ein Drache'] }
  },
  {
    id: 'si', name: 'Slowenien', grass: '#84c97e', eu: true,
    lm: { art: 'lakechurch', name: 'Bleder See mit Inselkirche',
      info: 'Mitten im Bleder See liegt Sloweniens einzige Insel mit einer kleinen Kirche. Wer heiratet, muss die Braut die 99 Stufen hinauftragen!' },
    fact: 'Mehr als die Hälfte Sloweniens ist Wald – und bei uns leben rund 1000 Braunbären.',
    food: 'Potica – ein gerollter Hefekuchen mit Nussfüllung.',
    hobby: 'Ich paddle mit dem Kajak auf der türkisgrünen Soča.',
    kids: ['Zala', 'Nejc'],
    quiz: { q: 'Was steht auf der Insel im Bleder See?', correct: 'Eine kleine Kirche', wrong: ['Ein Leuchtturm', 'Ein Fußballstadion'] }
  },
  {
    id: 'it', name: 'Italien', grass: '#abd069', eu: true,
    lm: { art: 'colosseum', name: 'Kolosseum',
      info: 'Im Kolosseum in Rom passten vor 2000 Jahren 50.000 Zuschauer. Es hatte sogar ein Sonnensegel aus Stoff, das über die Ränge gespannt wurde.' },
    fact: 'Italien sieht auf der Karte aus wie ein Stiefel – und ist die Heimat von Pizza und Eis!',
    food: 'Pizza Margherita und danach ein Gelato – am liebsten Stracciatella.',
    hobby: 'Ich spiele Fußball auf der Piazza, bis es dunkel wird.',
    kids: ['Giulia', 'Marco'],
    quiz: { q: 'Wie viele Zuschauer passten ins Kolosseum?', correct: 'Etwa 50.000', wrong: ['Etwa 500', 'Etwa 5 Millionen'] }
  },
  {
    id: 'sm', name: 'San Marino', grass: '#b0cc78', eu: false, tiny: true,
    lm: { art: 'threetowers', name: 'Die drei Türme',
      info: 'San Marino liegt komplett innerhalb Italiens auf einem einzigen Berg. Es ist die älteste Republik der Welt – seit dem Jahr 301!' },
    fact: 'San Marino ist über 1700 Jahre alt und war noch nie Teil eines anderen Landes.',
    food: 'Torta Tre Monti – ein Waffelkuchen mit Schokolade, benannt nach unseren drei Bergspitzen.',
    hobby: 'Ich klettere zu den drei Türmen hinauf – von oben sieht man bis zum Meer.',
    kids: ['Chiara', 'Alessandro'],
    quiz: { q: 'Wie viele Türme stehen auf San Marinos Berg?', correct: 'Drei', wrong: ['Einer', 'Zwölf'] }
  },
  {
    id: 'va', name: 'Vatikanstadt', grass: '#c4c98a', eu: false, tiny: true,
    lm: { art: 'basilica', name: 'Petersdom',
      info: 'Die Vatikanstadt ist das kleinste Land der Welt – nur so groß wie 60 Fußballfelder. Trotzdem steht hier die größte Kirche der Welt.' },
    fact: 'Im Vatikan leben weniger als 900 Menschen. Das ist weniger als an vielen Schulen!',
    food: 'Bei uns isst man römisch: Pasta Cacio e Pepe, also Nudeln mit Käse und Pfeffer.',
    hobby: 'Ich schaue mir die Deckenbilder in der Sixtinischen Kapelle an – Michelangelo malte vier Jahre daran.',
    kids: ['Marta', 'Pietro'],
    quiz: { q: 'Welches ist das kleinste Land der Welt?', correct: 'Die Vatikanstadt', wrong: ['Malta', 'Island'] }
  },
  {
    id: 'mt', name: 'Malta', grass: '#cbc47c', eu: true, tiny: true,
    lm: { art: 'valletta', name: 'Hafen von Valletta',
      info: 'Malta besteht aus drei bewohnten Inseln mitten im Mittelmeer. Hier stehen Tempel, die älter sind als die Pyramiden von Ägypten!' },
    fact: 'Auf Malta scheint an über 300 Tagen im Jahr die Sonne. Und wir sprechen Maltesisch und Englisch.',
    food: 'Pastizzi – blättrige Teigtaschen mit Erbsen oder Ricotta.',
    hobby: 'Ich schnorchle in den Buchten – das Wasser ist so klar, dass man bis zum Grund sieht.',
    kids: ['Nina', 'Luca'],
    quiz: { q: 'In welchem Meer liegt Malta?', correct: 'Im Mittelmeer', wrong: ['In der Nordsee', 'Im Schwarzen Meer'] }
  },
  {
    id: 'hr', name: 'Kroatien', grass: '#a1cb78', eu: true,
    lm: { art: 'citywall', name: 'Stadtmauer von Dubrovnik',
      info: 'Die Mauer um Dubrovnik ist fast 2 Kilometer lang und bis zu 25 Meter hoch. Man kann oben einmal rund um die ganze Altstadt laufen.' },
    fact: 'Kroatien hat über 1000 Inseln in der glasklaren Adria!',
    food: 'Frisch gegrillter Fisch am Meer – und danach ein Eis in der Altstadt.',
    hobby: 'Ich schnorchle und sammle Muscheln.',
    kids: ['Petra', 'Ivan'],
    quiz: { q: 'An welchem Meer liegt Kroatien?', correct: 'An der Adria', wrong: ['An der Nordsee', 'Am Atlantik'] }
  },
  {
    id: 'ba', name: 'Bosnien-Herzegowina', grass: '#94c777', eu: false,
    lm: { art: 'mostar', name: 'Die Alte Brücke von Mostar',
      info: 'Die Alte Brücke von Mostar schwingt sich in einem hohen Bogen über den Fluss Neretva. Mutige springen von oben 24 Meter tief ins Wasser!' },
    fact: 'Bei uns stehen Moscheen, Kirchen und Synagogen oft in derselben Straße.',
    food: 'Ćevapi – kleine gegrillte Hackfleischröllchen im Fladenbrot.',
    hobby: 'Ich fahre Rafting auf der Neretva – das Wasser ist eiskalt und türkis!',
    kids: ['Amina', 'Emir'],
    quiz: { q: 'Was ist in Mostar besonders berühmt?', correct: 'Eine alte Bogenbrücke', wrong: ['Ein Riesenrad', 'Ein Vulkan'] }
  },
  {
    id: 'rs', name: 'Serbien', grass: '#9ac96c', eu: false,
    lm: { art: 'fortress', name: 'Festung Kalemegdan',
      info: 'Die Festung von Belgrad liegt genau dort, wo die Flüsse Save und Donau zusammenfließen. Sie wurde in ihrer Geschichte über 40-mal umkämpft und wieder aufgebaut.' },
    fact: 'Durch Serbien fließt die Donau – und bei uns wachsen die meisten Himbeeren Europas!',
    food: 'Ajvar – eine Paste aus gerösteten Paprika, die man aufs Brot streicht.',
    hobby: 'Ich spiele Tennis. Viele unserer Spieler:innen sind Weltklasse!',
    kids: ['Milica', 'Stefan'],
    quiz: { q: 'Welche zwei Flüsse treffen sich in Belgrad?', correct: 'Save und Donau', wrong: ['Rhein und Main', 'Seine und Loire'] }
  },
  {
    id: 'me', name: 'Montenegro', grass: '#8ec982', eu: false,
    lm: { art: 'kotor', name: 'Bucht von Kotor',
      info: 'Die Bucht von Kotor windet sich wie ein Fjord tief ins Land. Steile Berge fallen direkt ins Meer – dazwischen liegen winzige alte Städtchen.' },
    fact: 'Montenegro heißt „Schwarzer Berg“. Bei uns kann man morgens im Meer schwimmen und mittags Ski fahren.',
    food: 'Kačamak – ein cremiger Maisbrei mit Käse und Kartoffeln.',
    hobby: 'Ich fahre mit dem Boot durch die Bucht zur kleinen Insel mit der Kirche.',
    kids: ['Anja', 'Nikola'],
    quiz: { q: 'Was bedeutet der Name Montenegro?', correct: 'Schwarzer Berg', wrong: ['Blaues Meer', 'Weiße Insel'] }
  },
  {
    id: 'xk', name: 'Kosovo', grass: '#a5c96f', eu: false,
    lm: { art: 'stonecastle', name: 'Festung von Prizren',
      info: 'Über der Altstadt von Prizren liegt eine Festung aus Stein. Von oben sieht man die steinerne Brücke, die Minarette und die Kirchtürme der Stadt.' },
    fact: 'Kosovo ist eines der jüngsten Länder Europas – und eines mit den jüngsten Menschen: Die Hälfte ist unter 30!',
    food: 'Flija – ein Fladen aus vielen dünnen Teigschichten, über Stunden gebacken.',
    hobby: 'Ich wandere in den Bergen, die wir „Verwünschte Berge“ nennen.',
    kids: ['Elira', 'Arben'],
    quiz: { q: 'Was liegt über der Altstadt von Prizren?', correct: 'Eine alte Festung', wrong: ['Ein Skisprungturm', 'Ein Leuchtturm'] }
  },
  {
    id: 'al', name: 'Albanien', grass: '#a8cb6e', eu: false,
    lm: { art: 'stonecastle', name: 'Burg von Gjirokastra',
      info: 'Gjirokastra nennt man die Stadt aus Stein: Die Häuser haben Dächer aus grauen Steinplatten und sehen von oben aus wie Schildkrötenpanzer.' },
    fact: 'An Albaniens Küste liegt die Albanische Riviera mit türkisblauem Wasser und leeren Stränden.',
    food: 'Byrek – ein herzhafter Blätterteigkuchen mit Käse oder Spinat.',
    hobby: 'Ich schwimme im Ionischen Meer und suche danach Feigen am Wegrand.',
    kids: ['Enisa', 'Klodian'],
    quiz: { q: 'Woraus sind die Dächer in Gjirokastra?', correct: 'Aus Steinplatten', wrong: ['Aus Stroh', 'Aus Glas'] }
  },
  {
    id: 'mk', name: 'Nordmazedonien', grass: '#9fca74', eu: false,
    lm: { art: 'ohrid', name: 'Kirche am Ohridsee',
      info: 'Der Ohridsee ist einer der ältesten Seen der Welt – über eine Million Jahre alt. Auf einer Klippe darüber steht eine kleine Kirche aus dem Mittelalter.' },
    fact: 'Im Ohridsee leben Tiere, die es sonst nirgendwo auf der Welt gibt!',
    food: 'Tavče gravče – Bohnen in einer Tonpfanne, im Ofen gebacken.',
    hobby: 'Ich rudere auf dem Ohridsee und schaue den Pelikanen zu.',
    kids: ['Marija', 'Filip'],
    quiz: { q: 'Was ist am Ohridsee besonders?', correct: 'Er ist über eine Million Jahre alt', wrong: ['Er ist salzig', 'Er friert nie zu'] }
  },
  {
    id: 'bg', name: 'Bulgarien', grass: '#9ecd6d', eu: true,
    lm: { art: 'monastery', name: 'Rila-Kloster',
      info: 'Das Rila-Kloster liegt tief in den Bergen. Seine Bögen sind schwarz-weiß gestreift, und überall an den Wänden erzählen bunte Bilder Geschichten.' },
    fact: 'In Bulgarien wächst der meiste Rosenöl-Rosen der Welt – für ein Fläschchen braucht man 3000 Blüten!',
    food: 'Banitsa – ein gedrehter Blätterteig mit Schafskäse, oft zum Frühstück.',
    hobby: 'Im Winter fahre ich Ski im Rila-Gebirge, im Sommer bin ich am Schwarzen Meer.',
    kids: ['Ralitsa', 'Georgi'],
    quiz: { q: 'An welchem Meer liegt Bulgarien?', correct: 'Am Schwarzen Meer', wrong: ['Am Atlantik', 'An der Ostsee'] }
  },
  {
    id: 'ro', name: 'Rumänien', grass: '#97c86c', eu: true,
    lm: { art: 'brancastle', name: 'Schloss Bran',
      info: 'Schloss Bran steht auf einem Felsen in den Karpaten. Weil es so düster aussieht, erzählt man sich hier Geschichten über Graf Dracula.' },
    fact: 'In den Karpaten leben etwa 6000 Braunbären – mehr als irgendwo sonst in Europa!',
    food: 'Mămăligă – goldgelber Maisbrei mit Käse und saurer Sahne.',
    hobby: 'Ich wandere in den Bergen und erzähle abends Gruselgeschichten.',
    kids: ['Ioana', 'Andrei'],
    quiz: { q: 'In welchem Gebirge steht Schloss Bran?', correct: 'In den Karpaten', wrong: ['In den Alpen', 'In den Pyrenäen'] }
  },
  {
    id: 'md', name: 'Moldau', grass: '#a9cb6a', eu: false,
    lm: { art: 'cavemonastery', name: 'Höhlenkloster Orheiul Vechi',
      info: 'Dieses Kloster ist in einen Felsen über dem Fluss Răut gehauen. Mönche gruben die Räume vor 700 Jahren mit einfachen Werkzeugen in den Stein.' },
    fact: 'Unter Moldau liegen die längsten Weinkeller der Welt – über 200 Kilometer Gänge!',
    food: 'Plăcinte – gefüllte Teigfladen mit Kürbis, Käse oder Kirschen.',
    hobby: 'Ich tanze in einer Volkstanzgruppe – im Kreis und mit schnellen Schritten.',
    kids: ['Doina', 'Vlad'],
    quiz: { q: 'Wo wurde das Kloster Orheiul Vechi hineingebaut?', correct: 'In einen Felsen', wrong: ['In einen Baum', 'Unter Wasser'] }
  },
  {
    id: 'ua', name: 'Ukraine', grass: '#8fc96a', eu: false,
    lm: { art: 'sophia', name: 'Sophienkathedrale in Kyjiw',
      info: 'Die Sophienkathedrale ist fast 1000 Jahre alt und hat goldene Zwiebelkuppeln. Innen leuchten Bilder aus winzigen bunten Glassteinchen.' },
    fact: 'Die Ukraine ist das flächengrößte Land, das ganz in Europa liegt. Unsere schwarze Erde ist so fruchtbar, dass man uns Kornkammer Europas nennt.',
    food: 'Borschtsch – eine leuchtend rote Suppe aus Roter Bete mit saurer Sahne.',
    hobby: 'Ich male Pyssanky – kunstvoll verzierte Ostereier mit Wachs und Farbe.',
    kids: ['Sofiia', 'Mykyta'],
    quiz: { q: 'Welche Farbe hat die Suppe Borschtsch?', correct: 'Rot', wrong: ['Grün', 'Blau'] }
  },
  {
    id: 'hu', name: 'Ungarn', grass: '#bccb67', eu: true,
    lm: { art: 'parliament', name: 'Parlament in Budapest',
      info: 'Das ungarische Parlament an der Donau hat 691 Räume und wird nachts angestrahlt. Es ist das drittgrößte Parlamentsgebäude der Welt.' },
    fact: 'In Budapest sprudeln über 100 warme Quellen aus der Erde – man badet draußen, sogar im Winter!',
    food: 'Gulasch – und Lángos, ein frittierter Fladen mit Käse und Knoblauch.',
    hobby: 'Ich schwimme im Verein. Ungarn hat viele Schwimm-Weltmeister!',
    kids: ['Hanna', 'Bence'],
    quiz: { q: 'Wofür ist Budapest besonders bekannt?', correct: 'Für warme Thermalbäder', wrong: ['Für Schneeberge', 'Für Wüsten'] }
  },
  {
    id: 'gr', name: 'Griechenland', grass: '#cbc873', eu: true,
    lm: { art: 'acropolis', name: 'Akropolis',
      info: 'Der Parthenon-Tempel auf der Akropolis ist 2500 Jahre alt. Seine Säulen sind in der Mitte leicht dicker – dadurch wirken sie für unsere Augen schnurgerade.' },
    fact: 'Griechenland hat über 6000 Inseln – aber nur auf etwa 200 wohnen Menschen.',
    food: 'Gyros mit Tzatziki, und danach süßes Baklava mit Honig.',
    hobby: 'Ich schwimme im Meer und höre gern die alten Göttersagen.',
    kids: ['Eleni', 'Nikos'],
    quiz: { q: 'Wie heißt der berühmte Tempelberg in Athen?', correct: 'Akropolis', wrong: ['Olymp-Center', 'Kolosseum'] }
  },
  {
    id: 'cy', name: 'Zypern', grass: '#cdc271', eu: true, tiny: true,
    lm: { art: 'aphrodite', name: 'Der Felsen der Aphrodite',
      info: 'Aus dem Meer vor Zypern ragt ein großer Felsen. Der Sage nach wurde hier die griechische Göttin Aphrodite aus dem Schaum der Wellen geboren.' },
    fact: 'Zypern ist die drittgrößte Insel im Mittelmeer – und man kann im Frühling morgens Ski fahren und nachmittags baden.',
    food: 'Halloumi – ein Käse, den man grillen kann, ohne dass er zerläuft.',
    hobby: 'Ich beobachte im Sommer die Meeresschildkröten, die am Strand ihre Eier ablegen.',
    kids: ['Andrea', 'Christos'],
    quiz: { q: 'Welcher Käse aus Zypern lässt sich grillen?', correct: 'Halloumi', wrong: ['Mozzarella', 'Camembert'] }
  }
];

/* Brücken und Fähren – nur dort, wo es sie ungefähr wirklich gibt.
   Alle anderen Länder hängen auf der Europakarte direkt zusammen. */
const BRIDGES = [
  ['uk', 'fr'],   // Eurotunnel
  ['ie', 'uk'],   // Fähre Dublin–Holyhead
  ['is', 'uk'],   // Fährlinie über die Färöer
  ['dk', 'se'],   // Öresundbrücke
  ['fi', 'ee'],   // Fähre Helsinki–Tallinn
  ['it', 'mt'],   // Fähre Sizilien–Malta
  ['gr', 'cy']    // Fähre in die östliche Mittelmeer-Insel
];

/* Moderator:innen – stellen Aufgaben (Quiz und Reise-Aufgaben) */
const MODERATORS = [
  { country: 'de', name: 'Jonas' },
  { country: 'fr', name: 'Marie' },
  { country: 'pl', name: 'Ola' },
  { country: 'it', name: 'Matteo' },
  { country: 'se', name: 'Astrid' },
  { country: 'es', name: 'Diego' },
  { country: 'ro', name: 'Elena' },
  { country: 'ie', name: 'Saoirse' }
];

/* Antworten der Schüler:innen im Chat */
const SMALLTALK = [
  'Voll cool, dass du hier bist!',
  'Warst du schon in vielen Ländern auf der Karte?',
  'Ich finde es toll, neue Leute aus ganz Europa zu treffen.',
  'Die Moderator:innen haben heute wieder neue Aufgaben. Hast du schon eine gemacht?',
  'Wenn du magst, schau dir mal unser Wahrzeichen an – es ist gleich hier in der Nähe!',
  'Ich lerne gerade ein paar Wörter in anderen Sprachen. Kennst du eins?',
  'Probier mal das Hüpfen – drück einfach den Sprung-Knopf!'
];

const FAREWELLS = [
  'Tschüss! Komm bald wieder vorbei!',
  'Bis bald! Gute Reise durch Europa!',
  'Ciao! War schön, mit dir zu schreiben.'
];

/* ---------- Pinnwände ----------
   In jedem Land steht eine Pinnwand mit Mitmach-Aufgaben.
   Eingereichte Beiträge müssen von Administrator:innen freigegeben werden.
   country: null = hängt an allen Pinnwänden
   icon: Name eines Symbols aus js/icons.js */
const BOARD_TASKS = [
  { id: 'foto-klasse', country: null, icon: 'camera',
    title: 'Foto aus deinem Klassenraum',
    desc: 'Mach ein Foto aus deinem Klassenraum und lade es hier hoch. Zeig den anderen, wie ihr lernt! Achte darauf, dass keine Mitschüler:innen darauf zu erkennen sind.' },
  { id: 'wahrzeichen-malen', country: null, icon: 'brush',
    title: 'Male ein Wahrzeichen',
    desc: 'Male dein Lieblings-Wahrzeichen aus Europa, fotografiere dein Bild und lade es hoch!' },
  { id: 'drei-saetze', country: null, icon: 'pen',
    title: 'Drei Sätze über dein Land',
    desc: 'Schreibe drei Sätze über dein Heimatland – gern auch in einer anderen Sprache!' },
  { id: 'gericht', country: null, icon: 'plate',
    title: 'Dein Lieblingsgericht',
    desc: 'Beschreibe oder fotografiere ein typisches Gericht aus deinem Land.' },
  { id: 'wort-des-tages', country: null, icon: 'speech',
    title: 'Wort des Tages',
    desc: 'Bring den anderen ein schönes Wort aus deiner Sprache bei. Wie spricht man es aus, was bedeutet es?' },
  { id: 'de-nachbarn', country: 'de', icon: 'compass',
    title: 'Deutschlands Nachbarn',
    desc: 'Deutschland hat neun Nachbarländer. Finde sie heraus und schreibe sie auf!' },
  { id: 'fr-flagge', country: 'fr', icon: 'flag',
    title: 'Die Trikolore',
    desc: 'Welche drei Farben hat die französische Flagge? Schreibe sie in der richtigen Reihenfolge auf.' },
  { id: 'it-pizza', country: 'it', icon: 'plate',
    title: 'Erfinde eine Pizza',
    desc: 'Erfinde deine eigene Pizza! Gib ihr einen Namen und beschreibe die Zutaten.' },
  { id: 'es-tanz', country: 'es', icon: 'note',
    title: 'Tanz und Musik',
    desc: 'Finde einen spanischen Tanz oder ein spanisches Lied und beschreibe es in zwei Sätzen.' },
  { id: 'pl-sage', country: 'pl', icon: 'book',
    title: 'Die Drachensage',
    desc: 'Erzähle die Sage vom Wawel-Drachen in deinen eigenen Worten – oder male den Drachen!' },
  { id: 'se-natur', country: 'se', icon: 'tree',
    title: 'Tiere des Nordens',
    desc: 'Welche Tiere leben in Schwedens Wäldern? Nenne mindestens drei.' },
  { id: 'gr-sage', country: 'gr', icon: 'book',
    title: 'Eine Göttersage',
    desc: 'Such dir eine griechische Sage aus und erzähle sie in fünf Sätzen nach.' }
];

/* Demo-PIN für den Admin-Bereich.
   ACHTUNG: steht im Quelltext und ist damit für alle sichtbar.
   Echter Schutz kommt erst mit dem Server (siehe Konzeptpapier). */
const ADMIN_PIN = '2468';

/* Charakter-Editor-Paletten */
const SKIN_TONES = ['#ffe0c2', '#f5c99b', '#e0a878', '#c68a5a', '#9c6a42', '#7a4f30'];
const HAIR_COLORS = ['#3b2a1d', '#181512', '#a86325', '#e0b34c', '#c9432c', '#7d54c9', '#d9d2c8', '#2f6b8f'];
const SHIRT_COLORS = ['#e64a4a', '#3f7de0', '#3fae5c', '#e6a23c', '#9b59d0', '#e5679c', '#2ec4b6', '#f4d35e'];
const HAIR_STYLES = [
  { id: 'kurz', label: 'Kurz' },
  { id: 'lang', label: 'Lang' },
  { id: 'wuschel', label: 'Wuschelig' },
  { id: 'pony', label: 'Pony' },
  { id: 'zopf', label: 'Zöpfe' },
  { id: 'locken', label: 'Locken' }
];

/* ---------- Heimatland erkennen ----------
   Kinder tippen ihr Land selbst ein. Wir erkennen die Länder auf der
   Karte anhand vieler Schreibweisen (deutsch, englisch, Landessprache).
   Wird nichts erkannt, ist das völlig in Ordnung – dann startet man
   in Brüssel und der eingetippte Name wird trotzdem angezeigt. */
const COUNTRY_ALIASES = {
  is: ['island', 'iceland', 'islandia'],
  ie: ['irland', 'ireland', 'eire', 'ireland'],
  uk: ['grossbritannien', 'großbritannien', 'england', 'vereinigtes koenigreich', 'vereinigtes königreich',
       'united kingdom', 'great britain', 'britain', 'uk', 'schottland', 'scotland', 'wales', 'nordirland'],
  pt: ['portugal'],
  es: ['spanien', 'spain', 'espana', 'españa'],
  ad: ['andorra'],
  fr: ['frankreich', 'france', 'francia'],
  mc: ['monaco'],
  be: ['belgien', 'belgium', 'belgie', 'belgië', 'belgique'],
  lu: ['luxemburg', 'luxembourg', 'letzebuerg', 'lëtzebuerg'],
  nl: ['niederlande', 'netherlands', 'nederland', 'holland'],
  de: ['deutschland', 'germany', 'allemagne', 'alemania', 'niemcy', 'almanya'],
  dk: ['daenemark', 'dänemark', 'denmark', 'danmark'],
  no: ['norwegen', 'norway', 'norge'],
  se: ['schweden', 'sweden', 'sverige'],
  fi: ['finnland', 'finland', 'suomi'],
  ee: ['estland', 'estonia', 'eesti'],
  lv: ['lettland', 'latvia', 'latvija'],
  lt: ['litauen', 'lithuania', 'lietuva'],
  by: ['belarus', 'weissrussland', 'weißrussland', 'belarus'],
  pl: ['polen', 'poland', 'polska'],
  cz: ['tschechien', 'czech republic', 'czechia', 'cesko', 'česko', 'tschechische republik'],
  sk: ['slowakei', 'slovakia', 'slovensko'],
  at: ['oesterreich', 'österreich', 'austria'],
  ch: ['schweiz', 'switzerland', 'suisse', 'svizzera', 'helvetia'],
  li: ['liechtenstein'],
  si: ['slowenien', 'slovenia', 'slovenija'],
  it: ['italien', 'italy', 'italia'],
  sm: ['san marino', 'sanmarino'],
  va: ['vatikan', 'vatikanstadt', 'vatican', 'vatican city', 'heiliger stuhl'],
  mt: ['malta'],
  hr: ['kroatien', 'croatia', 'hrvatska'],
  ba: ['bosnien', 'bosnien-herzegowina', 'bosnien und herzegowina', 'bosnia', 'bosna', 'herzegowina'],
  rs: ['serbien', 'serbia', 'srbija'],
  me: ['montenegro', 'crna gora'],
  xk: ['kosovo', 'kosova'],
  al: ['albanien', 'albania', 'shqiperia', 'shqipëria'],
  mk: ['nordmazedonien', 'mazedonien', 'north macedonia', 'macedonia', 'makedonija'],
  bg: ['bulgarien', 'bulgaria', 'balgarija', 'българия'],
  ro: ['rumaenien', 'rumänien', 'romania', 'românia'],
  md: ['moldau', 'moldawien', 'moldova', 'republik moldau'],
  ua: ['ukraine', 'ukrajina', 'україна'],
  hu: ['ungarn', 'hungary', 'magyarorszag', 'magyarország'],
  gr: ['griechenland', 'greece', 'hellas', 'ellada', 'ελλάδα'],
  cy: ['zypern', 'cyprus', 'kypros', 'kibris', 'kıbrıs']
};

/* ---------- Deutsche Beugung der Ländernamen ----------
   Die meisten Länder stehen ohne Artikel („nach Frankreich“), einige
   aber mit („in die Schweiz“, „aus den Niederlanden“). */
const COUNTRY_FORMS = {
  nl: { nach: 'in die Niederlande',   in: 'in den Niederlanden',   aus: 'aus den Niederlanden',   ueber: 'über die Niederlande' },
  ch: { nach: 'in die Schweiz',       in: 'in der Schweiz',        aus: 'aus der Schweiz',        ueber: 'über die Schweiz' },
  sk: { nach: 'in die Slowakei',      in: 'in der Slowakei',       aus: 'aus der Slowakei',       ueber: 'über die Slowakei' },
  ua: { nach: 'in die Ukraine',       in: 'in der Ukraine',        aus: 'aus der Ukraine',        ueber: 'über die Ukraine' },
  va: { nach: 'in die Vatikanstadt',  in: 'in der Vatikanstadt',   aus: 'aus der Vatikanstadt',   ueber: 'über die Vatikanstadt' },
  xk: { nach: 'in den Kosovo',        in: 'im Kosovo',             aus: 'aus dem Kosovo',         ueber: 'über den Kosovo' },
  uk: { nach: 'nach Großbritannien',  in: 'in Großbritannien',     aus: 'aus Großbritannien',     ueber: 'über Großbritannien' }
};

/* fall: 'nach' | 'in' | 'aus' | 'ueber' */
function landForm(c, fall) {
  const f = COUNTRY_FORMS[c.id];
  if (f) return f[fall];
  return {
    nach: 'nach ' + c.name,
    in: 'in ' + c.name,
    aus: 'aus ' + c.name,
    ueber: 'über ' + c.name
  }[fall];
}

/* Vereinheitlicht Eingaben: Kleinbuchstaben, ohne Akzente und Sonderzeichen */
function normalizeCountryText(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-zЀ-ӿͰ-Ͽ ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Gibt die Länder-ID zurück oder null, wenn das Land nicht auf der Karte liegt */
function matchCountry(text) {
  const n = normalizeCountryText(text);
  if (!n) return null;
  for (const id in COUNTRY_ALIASES) {
    for (const alias of COUNTRY_ALIASES[id]) {
      const a = normalizeCountryText(alias);
      if (a === n) return id;
    }
  }
  // zweite Runde: Eingabe steckt in einem Namen (z. B. „aus Deutschland“)
  for (const id in COUNTRY_ALIASES) {
    for (const alias of COUNTRY_ALIASES[id]) {
      const a = normalizeCountryText(alias);
      if (a.length >= 4 && (n.includes(a) || a.includes(n)) && Math.abs(a.length - n.length) <= 3) return id;
    }
  }
  return null;
}
