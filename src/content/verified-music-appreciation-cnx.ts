import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent music-literacy facts checked against the openly licensed CNX
 * reader *Music: Its Language, History and Culture*.  Each row represents one
 * claim; this file intentionally does not manufacture wording variants.
 *
 * The reader is the OpenStax-CNX collection col11803, released under CC BY
 * 4.0.  Chapter URLs below point to the exact module used for editorial
 * checking and are kept on every card for later review.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax-CNX — Music: Its Language, History and Culture';
const LICENSE = 'CC BY 4.0';
const METHOD = 'vérification éditoriale manuelle dans le chapitre CNX cité; un fait indépendant par carte; aucune variante générée';

const CHAPTERS = {
  elements: 'https://legacy.cnx.org/content/m55670/1.2/',
  instruments: 'https://legacy.cnx.org/content/m55724/1.1/',
  roles: 'https://legacy.cnx.org/content/m55730/1.1/',
  history: 'https://legacy.cnx.org/content/m55721/1.1/',
  modern: 'https://legacy.cnx.org/content/m55732/1.1/',
  vernacular: 'https://legacy.cnx.org/content/m55737/1.1/',
  jazz: 'https://legacy.cnx.org/content/m55739/1.1/',
  world: 'https://legacy.cnx.org/content/m55740/1.1/',
} as const;

type Chapter = keyof typeof CHAPTERS;
type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  chapter: Chapter,
];

const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  // Chapter 1 — elements of sound and music
  row('music-sound-vibration', 'Éléments', 'Qu’est-ce qui produit généralement un son perceptible ?', 'Une vibration qui se propage dans un milieu', 'Le son résulte de vibrations transmises par un milieu matériel jusqu’à l’oreille.', 1, 'elements'),
  row('music-frequency-pitch', 'Éléments', 'À quelle caractéristique physique la hauteur d’un son est-elle principalement liée ?', 'À sa fréquence', 'Une fréquence plus élevée est généralement perçue comme une hauteur plus aiguë.', 1, 'elements'),
  row('music-amplitude-dynamics', 'Éléments', 'À quelle caractéristique physique l’intensité perçue d’un son est-elle principalement liée ?', 'À l’amplitude de la vibration', 'L’amplitude contribue à la sensation de son fort ou faible, décrite musicalement par la dynamique.', 1, 'elements'),
  row('music-timbre-definition', 'Éléments', 'Qu’est-ce qui permet de distinguer deux sons de même hauteur et de même intensité ?', 'Le timbre', 'Le timbre dépend notamment du spectre et de l’évolution du son.', 1, 'elements'),
  row('music-melody-definition', 'Éléments', 'Qu’est-ce qu’une mélodie ?', 'Une succession organisée de hauteurs', 'La mélodie est une ligne de sons perçue comme un tout musical.', 1, 'elements'),
  row('music-harmony-definition', 'Éléments', 'Que désigne l’harmonie en musique ?', 'L’organisation des sons simultanés et de leurs relations', 'L’harmonie étudie notamment les accords et leurs enchaînements.', 1, 'elements'),
  row('music-texture-definition', 'Éléments', 'Que décrit la texture musicale ?', 'La manière dont les lignes musicales sont combinées', 'La texture tient compte du nombre de parties et de leurs relations.', 2, 'elements'),
  row('music-monophony', 'Éléments', 'Comment appelle-t-on une texture avec une seule ligne mélodique sans accompagnement ?', 'La monophonie', 'La monophonie ne comporte qu’une partie mélodique indépendante.', 1, 'elements'),
  row('music-polyphony', 'Éléments', 'Comment appelle-t-on une texture où plusieurs lignes mélodiques indépendantes se superposent ?', 'La polyphonie', 'Dans la polyphonie, plusieurs voix possèdent chacune une certaine autonomie mélodique.', 1, 'elements'),
  row('music-homophony', 'Éléments', 'Comment appelle-t-on une texture où une mélodie domine avec un accompagnement ?', 'L’homophonie', 'Les parties d’accompagnement soutiennent généralement une ligne principale.', 1, 'elements'),
  row('music-syncopation-definition', 'Éléments', 'Que désigne la syncope en musique ?', 'Un déplacement de l’accent attendu vers un temps faible ou une partie faible du temps', 'La syncope crée une tension rythmique en faisant entendre un accent là où il n’est normalement pas attendu.', 2, 'elements'),
  row('music-meter-definition', 'Éléments', 'Que mesure le mètre musical ?', 'La répartition régulière des temps forts et faibles', 'Le mètre regroupe les pulsations en mesures selon des accents récurrents.', 2, 'elements'),
  row('music-tempo-definition', 'Éléments', 'Que désigne le tempo ?', 'La vitesse d’exécution d’une œuvre', 'Le tempo indique à quelle vitesse les pulsations se succèdent.', 1, 'elements'),
  row('music-octave-relation', 'Éléments', 'Quel intervalle sépare deux sons dont la fréquence de l’un est le double de l’autre ?', 'Une octave', 'Les deux notes portent le même nom dans la plupart des systèmes tonals occidentaux.', 1, 'elements'),
  row('music-scale-definition', 'Éléments', 'Qu’est-ce qu’une gamme ?', 'Une suite ordonnée de hauteurs', 'Une gamme organise les hauteurs selon un modèle donné.', 1, 'elements'),
  row('music-chromatic-scale', 'Éléments', 'Que contient une gamme chromatique occidentale ?', 'Les douze demi-tons de l’octave', 'La gamme chromatique divise l’octave en douze intervalles égaux dans le tempérament courant.', 2, 'elements'),
  row('music-diatonic-scale', 'Éléments', 'Que caractérise une gamme diatonique ?', 'Une organisation en sept degrés par octave', 'Les gammes majeures et mineures occidentales sont des exemples de gammes diatoniques.', 2, 'elements'),
  row('music-consonance-dissonance', 'Éléments', 'Comment appelle-t-on la stabilité relative perçue d’une combinaison de sons ?', 'La consonance', 'La consonance est une notion de relation entre sons, définie par le contexte culturel et musical.', 2, 'elements'),
  row('music-cadence-function', 'Éléments', 'À quoi sert généralement une cadence harmonique ?', 'À articuler ou conclure une phrase musicale', 'Une cadence produit un effet de repos, de suspension ou de transition.', 2, 'elements'),
  row('music-major-minor', 'Éléments', 'Quels deux modes sont particulièrement associés à la tonalité occidentale moderne ?', 'Le majeur et le mineur', 'Les modes majeur et mineur structurent une grande partie du répertoire tonal occidental.', 1, 'elements'),

  // Chapter 2 — instruments and ensembles
  row('music-string-instruments', 'Instruments', 'Quelle est la source sonore principale des instruments à cordes ?', 'La vibration d’une ou plusieurs cordes', 'La corde peut être frottée, pincée ou frappée selon l’instrument.', 1, 'instruments'),
  row('music-bowed-strings', 'Instruments', 'Quelle action produit le son d’un violon ?', 'Le frottement de ses cordes par un archet', 'Le violon est un cordophone à cordes frottées.', 1, 'instruments'),
  row('music-plucked-strings', 'Instruments', 'Comment une guitare produit-elle principalement son son ?', 'Par la vibration de cordes pincées', 'Les doigts ou un médiator mettent les cordes en vibration.', 1, 'instruments'),
  row('music-woodwind-air-column', 'Instruments', 'Qu’est-ce qui vibre principalement dans un instrument à vent ?', 'Une colonne d’air', 'La forme du tube et la manière de mettre l’air en vibration influencent la hauteur et le timbre.', 1, 'instruments'),
  row('music-brass-lip-vibration', 'Instruments', 'Comment le son est-il initié dans un instrument de la famille des cuivres ?', 'Par la vibration des lèvres du musicien', 'Les lèvres mettent l’air du tube en vibration, puis le pavillon rayonne le son.', 1, 'instruments'),
  row('music-percussion-definition', 'Instruments', 'Comment les instruments de percussion produisent-ils généralement leur son ?', 'En frappant, secouant ou frottant un matériau', 'La famille regroupe des instruments aux modes d’excitation très variés.', 1, 'instruments'),
  row('music-idiophone-definition', 'Instruments', 'Qu’est-ce qu’un idiophone ?', 'Un instrument dont le matériau lui-même vibre', 'Le xylophone et les cymbales sont des exemples d’idiophones.', 2, 'instruments'),
  row('music-membranophone-definition', 'Instruments', 'Qu’est-ce qu’un membranophone ?', 'Un instrument dont une membrane tendue vibre', 'Les tambours produisent leur son grâce à une membrane mise en vibration.', 1, 'instruments'),
  row('music-organ-pipes', 'Instruments', 'Comment un orgue à tuyaux produit-il ses sons ?', 'En faisant vibrer des colonnes d’air dans ses tuyaux', 'Les tuyaux et leurs mécanismes permettent de produire différentes hauteurs et couleurs.', 1, 'instruments'),
  row('music-piano-hammers', 'Instruments', 'Quelle action met les cordes d’un piano en vibration ?', 'La frappe de marteaux', 'Une touche commande un mécanisme qui frappe une ou plusieurs cordes.', 1, 'instruments'),
  row('music-synthesizer-sound', 'Instruments', 'Comment un synthétiseur produit-il généralement son son ?', 'Par génération ou transformation électronique d’un signal', 'Le synthétiseur peut créer et modeler des sons au moyen de circuits ou de logiciels.', 2, 'instruments'),
  row('music-orchestra-strings', 'Ensembles', 'Quelle famille est généralement la plus nombreuse dans un orchestre symphonique ?', 'Les cordes', 'Les violons, altos, violoncelles et contrebasses forment le groupe central de l’orchestre.', 1, 'instruments'),
  row('music-orchestra-woodwinds', 'Ensembles', 'Quels instruments appartiennent à la famille des bois ?', 'La flûte, le hautbois, la clarinette et le basson', 'La famille des bois est définie par la manière de produire le son et non uniquement par le matériau.', 1, 'instruments'),
  row('music-orchestra-brass', 'Ensembles', 'Quels instruments appartiennent à la famille des cuivres ?', 'La trompette, le cor, le trombone et le tuba', 'Ces instruments utilisent la vibration des lèvres dans une embouchure.', 1, 'instruments'),
  row('music-orchestra-percussion', 'Ensembles', 'Quelle famille d’orchestre comprend notamment la timbale et la grosse caisse ?', 'Les percussions', 'Les percussions ajoutent des couleurs, des accents et souvent une assise rythmique.', 1, 'instruments'),
  row('music-chamber-music', 'Ensembles', 'Qu’est-ce que la musique de chambre ?', 'De la musique instrumentale pour un petit ensemble', 'Elle est traditionnellement jouée sans grand orchestre et chaque partie peut être individualisée.', 1, 'instruments'),
  row('music-string-quartet', 'Ensembles', 'Quels instruments forment le quatuor à cordes classique ?', 'Deux violons, un alto et un violoncelle', 'Cette formation est l’un des ensembles de musique de chambre les plus importants du répertoire occidental.', 1, 'instruments'),
  row('music-conductor-role', 'Ensembles', 'Quel est le rôle principal d’un chef d’orchestre ?', 'Coordonner l’exécution d’un ensemble', 'Le chef indique notamment le tempo, les départs, les nuances et l’interprétation collective.', 1, 'roles'),

  // Chapter 3 — composition, performance and audience
  row('music-composition-definition', 'Création', 'Que désigne la composition musicale ?', 'La création et l’organisation d’une œuvre musicale', 'Composer consiste à concevoir des sons, des structures et des relations musicales.', 1, 'roles'),
  row('music-score-definition', 'Création', 'À quoi sert une partition ?', 'À noter et transmettre des informations musicales', 'La partition peut indiquer hauteurs, rythmes, nuances, tempo et consignes d’interprétation.', 1, 'roles'),
  row('music-improvisation-definition', 'Création', 'Qu’est-ce que l’improvisation musicale ?', 'La création de musique au moment de l’exécution', 'L’improvisateur prend des décisions musicales en temps réel dans un cadre donné.', 1, 'roles'),
  row('music-interpretation', 'Création', 'Que fait l’interprète d’une œuvre notée ?', 'Il transforme une notation en performance sonore', 'Une interprétation comporte des choix de tempo, de dynamique, d’articulation et de timbre.', 1, 'roles'),
  row('music-soloist-definition', 'Création', 'Comment appelle-t-on un musicien qui joue seul ou mis en avant avec un ensemble ?', 'Un soliste', 'Le soliste assume une partie particulièrement exposée ou indépendante.', 1, 'roles'),
  row('music-accompaniment-definition', 'Création', 'Que désigne l’accompagnement ?', 'Les parties qui soutiennent une mélodie ou un soliste', 'L’accompagnement peut être harmonique, rythmique, mélodique ou une combinaison des trois.', 1, 'roles'),
  row('music-rehearsal-purpose', 'Création', 'Pourquoi un ensemble répète-t-il une œuvre ?', 'Pour coordonner et affiner son exécution', 'La répétition permet de stabiliser les départs, l’équilibre, les nuances et l’interprétation.', 1, 'roles'),
  row('music-recording-performance', 'Création', 'Une représentation enregistrée est-elle identique à la partition ?', 'Non', 'L’enregistrement documente une interprétation particulière d’une œuvre notée ou improvisée.', 1, 'roles'),
  row('music-work-performance', 'Création', 'Dans une tradition notée, une œuvre existe-t-elle indépendamment de chacune de ses exécutions ?', 'Oui', 'La partition permet de concevoir l’œuvre comme une entité rejouable, distincte d’une performance particulière.', 2, 'roles'),
  row('music-oral-transmission', 'Création', 'Comment une tradition musicale orale transmet-elle principalement son répertoire ?', 'Par l’écoute, la mémoire et la pratique', 'La transmission orale ne signifie pas absence de structure, mais recours prioritaire à la performance et à la mémoire.', 1, 'roles'),

  // Chapter 4 — European art music from the Middle Ages to Romanticism
  row('music-medieval-monophony', 'Histoire', 'Quelle texture domine dans le chant grégorien médiéval ?', 'La monophonie', 'Le chant grégorien est traditionnellement présenté comme une ligne mélodique sans accompagnement harmonique indépendant.', 1, 'history'),
  row('music-neumatic-notation', 'Histoire', 'Quel système de signes a précédé la notation moderne pour mémoriser les contours mélodiques du chant ?', 'Les neumes', 'Les neumes médiévaux aidaient les chanteurs à se rappeler les mouvements mélodiques.', 2, 'history'),
  row('music-medieval-organum', 'Histoire', 'Comment appelle-t-on une des premières pratiques de superposition de voix au chant liturgique ?', 'L’organum', 'L’organum ajoute une ou plusieurs parties au chant existant.', 2, 'history'),
  row('music-renaissance-polyphony', 'Histoire', 'Quelle texture caractérise une grande partie de la musique vocale de la Renaissance ?', 'La polyphonie', 'Les compositeurs de la Renaissance développent des lignes vocales interdépendantes.', 1, 'history'),
  row('music-renaissance-madrigal', 'Histoire', 'Quel genre vocal profane est particulièrement associé à la Renaissance italienne ?', 'Le madrigal', 'Le madrigal met en musique un texte poétique profane pour plusieurs voix.', 1, 'history'),
  row('music-baroque-basso-continuo', 'Histoire', 'Quel procédé d’accompagnement est caractéristique de la musique baroque ?', 'La basse continue', 'Une ligne de basse et des indications harmoniques soutiennent l’ensemble musical.', 1, 'history'),
  row('music-baroque-concerto', 'Histoire', 'Que met en contraste un concerto baroque ?', 'Un soliste et un ensemble', 'Le dialogue entre le soliste et l’orchestre est central dans le genre du concerto.', 1, 'history'),
  row('music-concerto-grosso', 'Histoire', 'Dans un concerto grosso, quel groupe dialogue avec le grand ensemble ?', 'Un petit groupe de solistes', 'Le concertino contraste avec le ripieno ou tutti.', 2, 'history'),
  row('music-baroque-fugue', 'Histoire', 'Qu’est-ce qui caractérise le début d’une fugue ?', 'L’entrée successive d’un sujet dans plusieurs voix', 'Les voix imitent et développent un sujet selon une organisation contrapuntique.', 2, 'history'),
  row('music-classical-period', 'Histoire', 'Quelle période suit généralement la période baroque dans l’histoire de la musique européenne ?', 'La période classique', 'Dans le découpage courant, le classicisme vient après le baroque et avant le romantisme.', 1, 'history'),
  row('music-classical-homophony', 'Histoire', 'Quelle texture devient particulièrement courante dans le style classique ?', 'Une mélodie accompagnée', 'Le style classique privilégie souvent une ligne mélodique claire soutenue par l’harmonie.', 1, 'history'),
  row('music-sonata-form', 'Histoire', 'Quelles sont les grandes zones de la forme sonate ?', 'Exposition, développement et réexposition', 'La forme sonate organise un matériau thématique autour de ces trois fonctions principales.', 2, 'history'),
  row('music-symphony-definition', 'Histoire', 'Qu’est-ce qu’une symphonie dans la tradition classique ?', 'Une œuvre orchestrale généralement en plusieurs mouvements', 'La symphonie est écrite pour orchestre et suit souvent un plan de mouvements contrastés.', 1, 'history'),
  row('music-classical-string-quartet', 'Histoire', 'Quel genre de musique de chambre se développe fortement à l’époque classique ?', 'Le quatuor à cordes', 'La formation de deux violons, alto et violoncelle devient un laboratoire majeur de composition.', 1, 'history'),
  row('music-romantic-expression', 'Histoire', 'Quelle valeur esthétique est souvent associée au romantisme musical ?', 'L’expression personnelle', 'Le romantisme met fréquemment l’accent sur l’émotion, l’imagination et l’individualité.', 1, 'history'),
  row('music-program-music', 'Histoire', 'Qu’est-ce que la musique à programme ?', 'Une musique instrumentale associée à un récit ou une idée extra-musicale', 'Un titre, un texte ou un programme guide l’écoute d’une œuvre instrumentale.', 1, 'history'),
  row('music-romantic-nationalism', 'Histoire', 'Comment certains compositeurs romantiques expriment-ils le nationalisme musical ?', 'En intégrant des mélodies ou rythmes associés à leur culture', 'Les références aux traditions locales deviennent des marqueurs d’identité musicale.', 2, 'history'),
  row('music-opera-elements', 'Histoire', 'Quels éléments l’opéra associe-t-il principalement ?', 'Chant, musique instrumentale, théâtre et mise en scène', 'L’opéra est une forme scénique qui coordonne plusieurs arts.', 1, 'history'),
  row('music-art-song', 'Histoire', 'Qu’est-ce qu’un lied dans la tradition romantique germanique ?', 'Une chanson d’art pour voix et piano', 'Le lied associe une poésie à une écriture vocale et pianistique élaborée.', 2, 'history'),

  // Chapter 5 — European and American art music since 1900
  row('music-impressionism-timbre', 'Moderne', 'Quel aspect sonore les compositeurs impressionnistes mettent-ils souvent en avant ?', 'Le timbre et la couleur sonore', 'L’impressionnisme privilégie les sonorités, les nuances et les atmosphères.', 1, 'modern'),
  row('music-whole-tone-scale', 'Moderne', 'Qu’est-ce qui caractérise une gamme par tons entiers ?', 'Tous ses intervalles successifs sont des tons', 'La gamme par tons entiers ne contient pas de demi-ton diatonique.', 2, 'modern'),
  row('music-atonality-definition', 'Moderne', 'Que signifie atonalité dans ce contexte ?', 'Absence de centre tonal stable', 'La musique atonale évite l’organisation autour d’une tonique dominante.', 2, 'modern'),
  row('music-twelve-tone-row', 'Moderne', 'Quel principe organise une œuvre dodécaphonique sérielle ?', 'Une série des douze classes de hauteur', 'La série ordonne les douze sons chromatiques avant leurs transformations.', 2, 'modern'),
  row('music-neoclassicism', 'Moderne', 'Que cherche souvent le néoclassicisme musical ?', 'Un retour à des formes et textures plus claires', 'Le mouvement réemploie des modèles anciens avec un langage moderne.', 2, 'modern'),
  row('music-primitivism-rhythm', 'Moderne', 'Quel élément est souvent mis en avant dans le primitivisme musical ?', 'L’énergie rythmique', 'Des accents forts et des répétitions rythmiques contribuent à cette esthétique.', 2, 'modern'),
  row('music-electronic-music', 'Moderne', 'Que permet la musique électronique ?', 'De produire ou transformer des sons avec des dispositifs électroniques', 'Elle élargit les sources sonores au-delà des instruments acoustiques traditionnels.', 1, 'modern'),
  row('music-musique-concrete', 'Moderne', 'Sur quel matériau travaille la musique concrète ?', 'Des sons enregistrés du monde réel', 'Les sons sont sélectionnés, montés et transformés comme matériau de composition.', 2, 'modern'),
  row('music-aleatoric-music', 'Moderne', 'Que laisse volontairement ouvert la musique aléatoire ?', 'Certains choix de la composition ou de l’exécution', 'Le hasard ou l’indétermination participent à la forme finale.', 2, 'modern'),
  row('music-minimalism-repetition', 'Moderne', 'Quel procédé est central dans le minimalisme musical ?', 'La répétition de motifs avec de petits changements', 'Les transformations graduelles de motifs simples créent la forme et le mouvement.', 1, 'modern'),
  row('music-microtonality', 'Moderne', 'Que divise la microtonalité en unités plus petites que le demi-ton ?', 'L’octave', 'La microtonalité explore des hauteurs situées entre les notes du tempérament chromatique courant.', 2, 'modern'),
  row('music-tape-music', 'Moderne', 'Quel support a été central dans les premières œuvres de musique sur bande ?', 'La bande magnétique', 'La bande permettait de monter, répéter et transformer des sons enregistrés.', 1, 'modern'),

  // Chapter 6 — American vernacular music
  row('music-vernacular-definition', 'Traditions', 'Que signifie musique vernaculaire dans ce manuel ?', 'Une pratique musicale quotidienne et informelle hors des institutions de haute culture', 'Le terme renvoie aux musiques liées aux communautés, aux usages sociaux et à la transmission ordinaire.', 1, 'vernacular'),
  row('music-folk-oral-community', 'Traditions', 'Quelles sont deux caractéristiques souvent associées à la musique folk ?', 'La transmission orale et l’ancrage communautaire', 'La musique folk circule notamment par la participation et la mémoire collective.', 1, 'vernacular'),
  row('music-popular-mass-audience', 'Traditions', 'À quel public la musique populaire est-elle généralement destinée ?', 'À une large audience médiatisée', 'La diffusion par les médias et l’enregistrement joue un rôle important dans la musique populaire.', 1, 'vernacular'),
  row('music-spirituals-origin', 'Traditions', 'Dans quel contexte les spirituals afro-américains se sont-ils développés ?', 'Dans les communautés afro-américaines, notamment religieuses', 'Les spirituals associent héritages africains, christianisme et expérience historique des communautés réduites en esclavage.', 2, 'vernacular'),
  row('music-blues-twelve-bar', 'Traditions', 'Quelle structure est particulièrement associée au blues classique ?', 'Le blues en douze mesures', 'Le schéma de douze mesures est une forme fréquente, même si le blues connaît d’autres structures.', 1, 'vernacular'),
  row('music-blues-call-response', 'Traditions', 'Quel procédé de dialogue est fréquent dans le blues ?', 'L’appel et la réponse', 'Une phrase musicale ou vocale répond à une autre, selon une pratique présente dans plusieurs traditions.', 1, 'vernacular'),
  row('music-gospel-definition', 'Traditions', 'Quelle tradition musicale religieuse afro-américaine a fortement influencé la musique populaire ?', 'Le gospel', 'Le gospel associe chant religieux, expressivité vocale, chœurs et accompagnement instrumental.', 1, 'vernacular'),
  row('music-country-roots', 'Traditions', 'De quelles traditions la musique country américaine est-elle issue en partie ?', 'De traditions folk et de danses rurales', 'La country s’est formée par la rencontre de traditions rurales, de ballades et de musiques instrumentales.', 2, 'vernacular'),
  row('music-rock-roll-roots', 'Traditions', 'Quelles traditions ont contribué à la naissance du rock’n’roll ?', 'Le rhythm and blues, le gospel et la country', 'Le rock’n’roll est issu de croisements entre plusieurs traditions afro-américaines et blanches.', 2, 'vernacular'),
  row('music-tin-pan-alley', 'Traditions', 'Qu’était Tin Pan Alley ?', 'Un centre de l’édition et de la composition de chansons populaires aux États-Unis', 'Le nom désigne l’industrie new-yorkaise de chansons qui a précédé et accompagné l’essor des médias enregistrés.', 2, 'vernacular'),
  row('music-hip-hop-four-elements', 'Traditions', 'Quelles pratiques sont souvent citées parmi les éléments du hip-hop ?', 'DJing, rap, breakdance et graffiti', 'Le hip-hop réunit des pratiques musicales, corporelles et visuelles dans une culture urbaine.', 1, 'vernacular'),
  row('music-sampling-definition', 'Traditions', 'Que signifie sampler un enregistrement ?', 'Réutiliser un extrait enregistré comme matériau sonore', 'Le sampling permet de citer, transformer ou réorganiser un fragment sonore.', 1, 'vernacular'),

  // Chapter 7 — jazz
  row('music-jazz-improvisation', 'Jazz', 'Quelle pratique occupe une place centrale dans de nombreux styles de jazz ?', 'L’improvisation', 'Les musiciens inventent ou transforment une partie de la musique pendant la performance.', 1, 'jazz'),
  row('music-jazz-swing', 'Jazz', 'Que désigne le swing dans le jazz ?', 'Une manière de sentir et d’organiser le rythme', 'Le swing produit une sensation de propulsion et de souplesse rythmique.', 1, 'jazz'),
  row('music-jazz-ragtime', 'Jazz', 'Quel genre pianistique syncopé a précédé le développement du jazz ?', 'Le ragtime', 'Le ragtime met en avant des syncopes écrites et a influencé les premiers styles de jazz.', 1, 'jazz'),
  row('music-jazz-new-orleans-ensemble', 'Jazz', 'Quel type de formation est associé au jazz de La Nouvelle-Orléans ?', 'Un petit ensemble de cuivres, bois et section rythmique', 'Les premiers ensembles de jazz combinaient plusieurs instruments mélodiques et rythmiques.', 2, 'jazz'),
  row('music-jazz-big-band', 'Jazz', 'Qu’est-ce qu’un big band ?', 'Un grand orchestre de jazz organisé en sections', 'Les big bands regroupent notamment saxophones, trompettes, trombones et section rythmique.', 1, 'jazz'),
  row('music-jazz-bebop', 'Jazz', 'Quel style de jazz est associé à des tempos rapides et des mélodies complexes dans les années 1940 ?', 'Le bebop', 'Le bebop met l’accent sur l’improvisation virtuose et l’harmonie élaborée.', 2, 'jazz'),
  row('music-jazz-cool', 'Jazz', 'Quel courant de jazz est souvent décrit comme plus retenu et aux sonorités plus légères après le bebop ?', 'Le cool jazz', 'Le cool jazz privilégie souvent des timbres doux, des arrangements aérés et une dynamique contenue.', 2, 'jazz'),
  row('music-jazz-fusion', 'Jazz', 'Que mélange le jazz fusion ?', 'Le jazz avec des éléments du rock, du funk ou de la musique électronique', 'Le jazz fusion élargit les timbres, les grooves et les formats du jazz.', 1, 'jazz'),
  row('music-jazz-scat', 'Jazz', 'Qu’est-ce que le scat singing ?', 'Une improvisation vocale avec des syllabes sans texte fixé', 'La voix imite ou complète les instruments en improvisant des syllabes non lexicales.', 1, 'jazz'),
  row('music-jazz-head-solos', 'Jazz', 'Dans une forme jazz courante, que désigne le head ?', 'Le thème joué au début et à la fin', 'Les solistes improvisent souvent entre les présentations initiale et finale du thème.', 2, 'jazz'),

  // Chapter 8 — world music
  row('music-world-oral-tradition', 'Musiques du monde', 'Pourquoi la transmission orale est-elle importante dans de nombreuses traditions musicales ?', 'Elle permet d’apprendre par l’écoute et la participation', 'Les répertoires peuvent évoluer avec les performances et les communautés qui les transmettent.', 1, 'world'),
  row('music-call-response-world', 'Musiques du monde', 'Qu’est-ce que l’appel et la réponse ?', 'Un échange entre une voix ou un groupe et une réponse', 'Cette organisation participative existe dans de nombreuses cultures musicales.', 1, 'world'),
  row('music-polyrhythm-definition', 'Musiques du monde', 'Que désigne la polyrythmie ?', 'La superposition de rythmes différents', 'Plusieurs motifs rythmiques peuvent être exécutés simultanément et former une texture complexe.', 1, 'world'),
  row('music-west-african-drumming', 'Musiques du monde', 'Quel rôle joue souvent le tambour dans des ensembles ouest-africains ?', 'Un rôle rythmique et social', 'Les percussions peuvent structurer la danse, le dialogue musical et la participation communautaire.', 2, 'world'),
  row('music-indian-raga', 'Musiques du monde', 'Qu’est-ce qu’un raga dans la musique classique indienne ?', 'Un cadre mélodique pour l’improvisation et l’interprétation', 'Un raga définit des relations de hauteurs, des mouvements et une expression associés.', 2, 'world'),
  row('music-indian-tala', 'Musiques du monde', 'Que désigne le tala dans la musique classique indienne ?', 'Un cycle rythmique', 'Le tala organise les temps et les accents d’un cycle répété.', 1, 'world'),
  row('music-gamelan-ensemble', 'Musiques du monde', 'Qu’est-ce qu’un gamelan ?', 'Un ensemble instrumental d’Indonésie', 'Les gamelans regroupent notamment des gongs, métallophones et percussions accordées.', 1, 'world'),
  row('music-gamelan-tuning', 'Musiques du monde', 'Les gamelans utilisent-ils nécessairement le tempérament égal occidental ?', 'Non', 'Les systèmes d’accord du gamelan sont propres aux traditions et ensembles concernés.', 2, 'world'),
  row('music-andean-panpipes', 'Musiques du monde', 'Quel instrument andin est formé de plusieurs tuyaux assemblés ?', 'La flûte de Pan', 'Les flûtes de Pan andines, comme la antara ou la siku, regroupent des tuyaux de longueurs différentes.', 1, 'world'),
  row('music-african-polyrhythm', 'Musiques du monde', 'Quel procédé rythmique est fréquent dans de nombreuses traditions d’Afrique subsaharienne ?', 'La superposition de motifs rythmiques', 'Les lignes peuvent s’imbriquer pour créer une polyrythmie dansée et participative.', 2, 'world'),
  row('music-world-instrument-culture', 'Musiques du monde', 'Pourquoi l’étude d’un instrument renseigne-t-elle sur une culture ?', 'Parce que ses matériaux, ses usages et sa pratique sont liés à un contexte social', 'Un instrument est à la fois un objet sonore et un élément d’une histoire et d’une communauté.', 1, 'world'),
  row('music-world-music-label', 'Musiques du monde', 'Pourquoi l’expression « musiques du monde » doit-elle être utilisée avec prudence ?', 'Elle regroupe des traditions très diverses sous une catégorie large', 'Le terme est pratique mais peut masquer les différences historiques, sociales et musicales entre traditions.', 2, 'world'),
] as const;

function provenanceFor(id: string, chapter: Chapter): QuestionProvenance {
  return {
    factId: id,
    source: SOURCE,
    url: CHAPTERS[chapter],
    license: LICENSE,
    checkedAt: CHECKED_AT,
    method: METHOD,
    status: 'approved',
  };
}

export const VERIFIED_MUSIC_APPRECIATION_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => ({
  id: `verified-${id}`,
  factId: id,
  version: 1,
  type: 'flashcard',
  category: 'Musique',
  subcategory,
  question,
  answer,
  acceptedAnswers: [answer],
  explanation,
  difficulty,
  tags: ['musique', subcategory.toLowerCase()],
  source: SOURCE,
  provenance: provenanceFor(id, chapter),
}));

export const VERIFIED_MUSIC_APPRECIATION_BATCH: VerifiedContentBatch = {
  id: 'music-appreciation-cnx-2026-09',
  questions: VERIFIED_MUSIC_APPRECIATION_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://legacy.cnx.org/content/col11803/1.1/',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_MUSIC_APPRECIATION_BATCH;
