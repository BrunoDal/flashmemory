import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Stable, independently worded facts about stars, galaxies and cosmology.
 * Claims were checked against the linked NASA Science pages; this batch does
 * not include mission status or measurements that change frequently.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'NASA Science — Universe and Exoplanets';
const LICENSE = 'NASA content; NASA media usage guidelines';

const SOURCES = {
  stars: 'https://science.nasa.gov/universe/stars/',
  galaxies: 'https://science.nasa.gov/universe/galaxies/',
  blackHoles: 'https://science.nasa.gov/universe/black-holes/',
  bigBang: 'https://science.nasa.gov/universe/the-big-bang/',
  darkMatter: 'https://science.nasa.gov/universe/dark-matter/',
  darkEnergy: 'https://science.nasa.gov/universe/dark-energy/',
  exoplanets: 'https://science.nasa.gov/exoplanets/',
} as const;

type SourceKey = keyof typeof SOURCES;
type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, source: SourceKey];

const ROWS: readonly Row[] = [
  ['star-definition', 'Étoiles', 'Qu’est-ce qu’une étoile ?', 'Une boule de gaz qui produit sa propre lumière et son énergie', 'Une étoile est un objet céleste de gaz chaud dont l’énergie vient de réactions nucléaires.', 1, 'stars'],
  ['star-hydrogen', 'Étoiles', 'Quel élément constitue principalement les étoiles ?', 'L’hydrogène', 'L’hydrogène est l’élément le plus abondant dans les étoiles.', 1, 'stars'],
  ['star-helium', 'Étoiles', 'Quel élément est produit par la fusion de l’hydrogène dans une étoile ?', 'L’hélium', 'Dans les étoiles comme le Soleil, la fusion transforme l’hydrogène en hélium.', 1, 'stars'],
  ['star-fusion', 'Étoiles', 'Quelle réaction fournit l’énergie de la plupart des étoiles ?', 'La fusion nucléaire', 'La fusion de noyaux légers libère l’énergie qui alimente une étoile.', 1, 'stars'],
  ['star-core', 'Étoiles', 'Dans quelle partie d’une étoile la fusion de l’hydrogène se produit-elle ?', 'Le cœur', 'La température et la pression nécessaires à la fusion se trouvent au cœur stellaire.', 1, 'stars'],
  ['star-gravity', 'Étoiles', 'Quelle force maintient une étoile globalement assemblée ?', 'La gravité', 'La gravité attire la matière vers le centre de l’étoile.', 1, 'stars'],
  ['star-equilibrium', 'Étoiles', 'Quel équilibre maintient une étoile stable pendant sa phase principale ?', 'La gravité et la pression produite par l’énergie', 'La gravité comprime l’étoile tandis que la pression interne s’y oppose.', 2, 'stars'],
  ['star-color-temperature', 'Étoiles', 'Que révèle principalement la couleur d’une étoile ?', 'Sa température de surface', 'Les étoiles bleues sont en général plus chaudes que les étoiles rouges.', 1, 'stars'],
  ['star-blue-hot', 'Étoiles', 'Quelle couleur correspond généralement aux étoiles les plus chaudes ?', 'Le bleu', 'La température de surface élevée déplace le rayonnement vers le bleu.', 1, 'stars'],
  ['star-red-cool', 'Étoiles', 'Quelle couleur correspond généralement aux étoiles les moins chaudes ?', 'Le rouge', 'Les étoiles rouges ont une température de surface plus basse que les étoiles bleues.', 1, 'stars'],
  ['star-luminosity', 'Étoiles', 'Que mesure la luminosité intrinsèque d’une étoile ?', 'L’énergie qu’elle émet par unité de temps', 'La luminosité est une propriété réelle de l’étoile, distincte de son éclat apparent.', 2, 'stars'],
  ['star-apparent-brightness', 'Étoiles', 'De quoi dépend notamment l’éclat apparent d’une étoile ?', 'De sa luminosité et de sa distance', 'Une étoile lumineuse peut sembler faible si elle est très éloignée.', 1, 'stars'],
  ['star-distance-parallax', 'Étoiles', 'Quelle méthode mesure directement la distance de nombreuses étoiles proches ?', 'La parallaxe', 'La position apparente d’une étoile change légèrement lorsque la Terre se déplace sur son orbite.', 2, 'stars'],
  ['star-spectrum', 'Étoiles', 'Que peut révéler le spectre de la lumière d’une étoile ?', 'Sa composition chimique', 'Les éléments laissent des raies caractéristiques dans le spectre stellaire.', 1, 'stars'],
  ['star-spectral-lines', 'Étoiles', 'Comment les éléments chimiques sont-ils identifiés dans un spectre stellaire ?', 'Par leurs raies spectrales caractéristiques', 'Chaque élément absorbe ou émet des longueurs d’onde particulières.', 2, 'stars'],
  ['star-main-sequence', 'Étoiles', 'Comment s’appelle la longue phase où une étoile fusionne l’hydrogène dans son cœur ?', 'La séquence principale', 'La majorité des étoiles passent la plus grande partie de leur vie sur la séquence principale.', 1, 'stars'],
  ['star-sun-main-sequence', 'Étoiles', 'Dans quelle phase de son évolution le Soleil se trouve-t-il actuellement ?', 'La séquence principale', 'Le Soleil fusionne actuellement de l’hydrogène dans son cœur.', 1, 'stars'],
  ['star-mass-lifetime', 'Étoiles', 'Comment la masse d’une étoile influence-t-elle sa durée de vie ?', 'Les étoiles massives vivent généralement moins longtemps', 'Elles consomment leur carburant nucléaire beaucoup plus rapidement.', 2, 'stars'],
  ['star-low-mass-lifetime', 'Étoiles', 'Pourquoi les petites étoiles peuvent-elles vivre très longtemps ?', 'Elles brûlent leur carburant plus lentement', 'Leur fusion est moins intense que celle des étoiles massives.', 2, 'stars'],
  ['star-red-giant', 'Étoiles', 'Que devient une étoile semblable au Soleil après la séquence principale ?', 'Une géante rouge', 'Lorsque l’hydrogène du cœur est épuisé, l’étoile se dilate et refroidit en surface.', 1, 'stars'],
  ['star-white-dwarf', 'Étoiles', 'Quel est le résidu compact d’une étoile de faible ou moyenne masse ?', 'Une naine blanche', 'Le cœur restant est très dense après l’expulsion des couches externes.', 1, 'stars'],
  ['star-planetary-nebula', 'Étoiles', 'Comment s’appelle l’enveloppe expulsée par certaines étoiles en fin de vie ?', 'Une nébuleuse planétaire', 'Elle est formée par les couches externes rejetées d’une étoile semblable au Soleil.', 2, 'stars'],
  ['star-supernova', 'Étoiles', 'Comment s’appelle l’explosion finale de certaines étoiles massives ?', 'Une supernova', 'Une supernova libère une quantité considérable d’énergie et de matière.', 1, 'stars'],
  ['star-neutron', 'Étoiles', 'Quel objet peut rester après l’explosion d’une étoile massive ?', 'Une étoile à neutrons', 'Le cœur effondré peut devenir une étoile à neutrons extrêmement dense.', 1, 'stars'],
  ['star-pulsar', 'Étoiles', 'Qu’est-ce qu’un pulsar ?', 'Une étoile à neutrons qui émet des faisceaux réguliers', 'La rotation d’une étoile à neutrons magnétisée peut produire des impulsions observables.', 2, 'stars'],
  ['star-black-hole-origin', 'Étoiles', 'Que peut-il rester après l’effondrement du cœur d’une étoile très massive ?', 'Un trou noir', 'Dans certains cas, le cœur s’effondre jusqu’à former un trou noir.', 1, 'stars'],
  ['star-supernova-elements', 'Étoiles', 'Quel rôle les supernovas jouent-elles dans l’Univers ?', 'Elles dispersent des éléments fabriqués dans les étoiles', 'Les explosions enrichissent le milieu interstellaire en éléments lourds.', 2, 'stars'],
  ['star-nebula', 'Étoiles', 'Qu’est-ce qu’une nébuleuse ?', 'Un nuage de gaz et de poussière dans l’espace', 'Les nébuleuses peuvent être des régions de naissance ou des restes d’étoiles.', 1, 'stars'],
  ['star-formation', 'Étoiles', 'Comment naissent les étoiles ?', 'Par l’effondrement gravitationnel de régions denses d’un nuage', 'La gravité rassemble le gaz jusqu’à ce que le cœur devienne assez chaud pour démarrer la fusion.', 1, 'stars'],
  ['star-protostar', 'Étoiles', 'Comment s’appelle une étoile en formation avant le début durable de la fusion ?', 'Une protoétoile', 'La protoétoile se contracte et chauffe avant de devenir une étoile.', 1, 'stars'],
  ['star-accretion-disk', 'Étoiles', 'Quel disque peut entourer une étoile en formation ?', 'Un disque d’accrétion', 'Le gaz et la poussière en rotation peuvent alimenter la protoétoile.', 2, 'stars'],
  ['star-binary', 'Étoiles', 'Comment appelle-t-on un système de deux étoiles liées gravitationnellement ?', 'Un système binaire', 'Les deux étoiles orbitent autour de leur centre de masse commun.', 1, 'stars'],
  ['star-cluster-open', 'Étoiles', 'Qu’est-ce qu’un amas ouvert ?', 'Un groupe relativement jeune d’étoiles nées dans le même nuage', 'Les étoiles d’un amas ouvert restent liées moins fortement que celles d’un amas globulaire.', 2, 'stars'],
  ['star-cluster-globular', 'Étoiles', 'Qu’est-ce qu’un amas globulaire ?', 'Un ensemble sphérique dense de très vieilles étoiles', 'Les amas globulaires contiennent souvent des centaines de milliers d’étoiles.', 1, 'stars'],
  ['star-milky-center', 'Étoiles', 'Quel type d’objet se trouve au centre de la Voie lactée ?', 'Un trou noir supermassif', 'Le centre galactique abrite Sagittarius A*, un trou noir supermassif.', 1, 'blackHoles'],
  ['star-hubble-law', 'Étoiles', 'Que montre le décalage vers le rouge des galaxies lointaines ?', 'L’expansion de l’Univers', 'La lumière est étirée par l’expansion de l’espace pendant son trajet.', 2, 'bigBang'],

  ['galaxy-definition', 'Galaxies', 'Qu’est-ce qu’une galaxie ?', 'Un vaste ensemble d’étoiles, de gaz, de poussière et de matière noire lié par la gravité', 'Les galaxies sont des structures gravitationnelles qui contiennent souvent des milliards d’étoiles.', 1, 'galaxies'],
  ['galaxy-spiral', 'Galaxies', 'Quelle forme caractérise une galaxie spirale ?', 'Un disque avec des bras spiraux', 'Les bras spiraux contiennent beaucoup de gaz, de poussière et d’étoiles jeunes.', 1, 'galaxies'],
  ['galaxy-elliptical', 'Galaxies', 'Quelle forme caractérise une galaxie elliptique ?', 'Une forme arrondie ou ovale sans bras spiraux marqués', 'Les galaxies elliptiques contiennent surtout de vieilles étoiles.', 1, 'galaxies'],
  ['galaxy-irregular', 'Galaxies', 'Qu’est-ce qu’une galaxie irrégulière ?', 'Une galaxie sans forme régulière dominante', 'Les interactions gravitationnelles peuvent contribuer à leur apparence désordonnée.', 1, 'galaxies'],
  ['galaxy-local-group', 'Galaxies', 'Dans quel groupe de galaxies se trouvent la Voie lactée et Andromède ?', 'Le Groupe local', 'Le Groupe local rassemble la Voie lactée, Andromède et de nombreuses petites galaxies.', 1, 'galaxies'],
  ['galaxy-andromeda', 'Galaxies', 'Quel est le nom de la grande galaxie voisine de la Voie lactée ?', 'Andromède', 'Andromède, aussi appelée M31, est une grande galaxie du Groupe local.', 1, 'galaxies'],
  ['galaxy-halo', 'Galaxies', 'Quelle structure invisible entoure largement une galaxie ?', 'Un halo de matière noire', 'La matière noire contribue à la masse gravitationnelle qui maintient la galaxie.', 2, 'darkMatter'],
  ['galaxy-bulge', 'Galaxies', 'Comment s’appelle la région dense au centre d’une galaxie spirale ?', 'Le bulbe galactique', 'Le bulbe contient une forte concentration d’étoiles autour du centre.', 1, 'galaxies'],
  ['galaxy-disk', 'Galaxies', 'Dans quelle structure se trouvent les bras d’une galaxie spirale ?', 'Le disque galactique', 'Le disque est une structure aplatie en rotation.', 1, 'galaxies'],
  ['galaxy-bar', 'Galaxies', 'Que traverse la barre d’une galaxie spirale barrée ?', 'La région centrale de la galaxie', 'Une barre d’étoiles s’étend à travers le centre avant les bras spiraux.', 2, 'galaxies'],
  ['galaxy-star-formation', 'Galaxies', 'Dans quelles régions galactiques les étoiles se forment-elles souvent ?', 'Dans des nuages riches en gaz et en poussière', 'Le gaz froid et dense fournit la matière première des nouvelles étoiles.', 1, 'galaxies'],
  ['galaxy-collision', 'Galaxies', 'Que peut provoquer une interaction entre deux galaxies ?', 'Une déformation et une flambée de formation stellaire', 'La gravité perturbe les disques et comprime parfois le gaz.', 2, 'galaxies'],
  ['galaxy-merger', 'Galaxies', 'Une collision galactique détruit-elle nécessairement les étoiles ?', 'Non', 'Les distances entre les étoiles sont si grandes que les collisions directes sont rares.', 2, 'galaxies'],
  ['galaxy-active', 'Galaxies', 'Qu’est-ce qu’un noyau galactique actif ?', 'Une région centrale très lumineuse alimentée par un trou noir', 'La matière qui tombe vers le trou noir peut libérer beaucoup d’énergie.', 2, 'galaxies'],
  ['galaxy-quasar', 'Galaxies', 'Qu’est-ce qu’un quasar ?', 'Le noyau extrêmement lumineux d’une galaxie active', 'Les quasars sont alimentés par l’accrétion autour d’un trou noir supermassif.', 1, 'blackHoles'],
  ['galaxy-lenticular', 'Galaxies', 'Quelle forme combine un disque et un bulbe mais peu de bras ?', 'Une galaxie lenticulaire', 'Les galaxies lenticulaires ont un disque mais pas de bras spiraux proéminents.', 2, 'galaxies'],
  ['galaxy-redshift', 'Galaxies', 'Comment s’appelle le déplacement de la lumière galactique vers les grandes longueurs d’onde ?', 'Le décalage vers le rouge', 'Il peut résulter du mouvement de la source ou de l’expansion de l’Univers.', 1, 'bigBang'],
  ['galaxy-light-year', 'Galaxies', 'Quelle unité est adaptée aux distances entre galaxies ?', 'L’année-lumière', 'Une année-lumière est la distance parcourue par la lumière en une année.', 1, 'galaxies'],
  ['galaxy-cluster', 'Galaxies', 'Qu’est-ce qu’un amas de galaxies ?', 'Un ensemble de galaxies liées par la gravité', 'Les amas peuvent réunir des centaines ou des milliers de galaxies.', 1, 'galaxies'],
  ['galaxy-supercluster', 'Galaxies', 'Comment s’appelle une structure qui regroupe plusieurs amas de galaxies ?', 'Un superamas', 'Les superamas font partie de la structure à grande échelle de l’Univers.', 2, 'galaxies'],
  ['galaxy-cosmic-web', 'Galaxies', 'Comment appelle-t-on le réseau de filaments qui structure la matière à grande échelle ?', 'La toile cosmique', 'Les galaxies et les amas se répartissent le long de filaments séparés par des vides.', 2, 'galaxies'],
  ['galaxy-void', 'Galaxies', 'Qu’est-ce qu’un vide cosmique ?', 'Une vaste région qui contient relativement peu de galaxies', 'Les vides séparent les filaments de la toile cosmique.', 1, 'galaxies'],
  ['galaxy-lookback', 'Galaxies', 'Pourquoi observer des galaxies lointaines revient-il à regarder dans le passé ?', 'Parce que leur lumière met longtemps à nous parvenir', 'Plus une galaxie est éloignée, plus sa lumière a voyagé longtemps.', 1, 'galaxies'],
  ['galaxy-early', 'Galaxies', 'Les premières galaxies étaient-elles généralement plus simples que les grandes galaxies actuelles ?', 'Oui', 'Les jeunes galaxies observées dans l’Univers ancien sont souvent plus petites et moins structurées.', 2, 'galaxies'],
  ['galaxy-telescope', 'Galaxies', 'Pourquoi les télescopes infrarouges sont-ils utiles pour étudier les galaxies ?', 'Ils voient à travers une partie de la poussière et la lumière décalée vers le rouge', 'L’infrarouge révèle des régions masquées en lumière visible.', 2, 'galaxies'],
  ['galaxy-gravity-lens', 'Galaxies', 'Quel phénomène agrandit ou déforme l’image d’une galaxie lointaine ?', 'La lentille gravitationnelle', 'La gravité d’un objet massif courbe la trajectoire de la lumière.', 1, 'galaxies'],
  ['galaxy-dark-matter-evidence', 'Galaxies', 'Quelle observation indique la présence de matière noire dans les galaxies ?', 'La vitesse de rotation des étoiles', 'Les étoiles périphériques tournent plus vite que ne le prévoirait la matière visible seule.', 2, 'darkMatter'],
  ['galaxy-satellite', 'Galaxies', 'Comment appelle-t-on une petite galaxie liée gravitationnellement à une grande ?', 'Une galaxie satellite', 'La Voie lactée possède de nombreuses galaxies satellites.', 1, 'galaxies'],

  ['black-hole-event-horizon', 'Trous noirs', 'Comment s’appelle la limite au-delà de laquelle rien ne peut revenir d’un trou noir ?', 'L’horizon des événements', 'Il marque la frontière de la région dont la lumière ne peut pas s’échapper.', 1, 'blackHoles'],
  ['black-hole-singularity', 'Trous noirs', 'Quel nom donne-t-on au centre théorique d’un trou noir dans la relativité classique ?', 'La singularité', 'Les modèles classiques prédisent une région de densité extrême au centre.', 2, 'blackHoles'],
  ['black-hole-accretion', 'Trous noirs', 'Qu’est-ce qu’un disque d’accrétion autour d’un trou noir ?', 'Un disque de matière chaude en rotation qui tombe vers le trou noir', 'Les frottements dans le disque peuvent le rendre très lumineux.', 1, 'blackHoles'],
  ['black-hole-jets', 'Trous noirs', 'Que sont les jets relativistes associés à certains trous noirs ?', 'Des faisceaux de particules éjectés près du trou noir', 'Ils peuvent s’étendre sur de très grandes distances depuis le disque d’accrétion.', 2, 'blackHoles'],
  ['black-hole-stellar', 'Trous noirs', 'Comment se forme généralement un trou noir stellaire ?', 'Par l’effondrement d’une étoile massive', 'Une étoile massive peut laisser un cœur assez compact pour devenir un trou noir.', 1, 'blackHoles'],
  ['black-hole-supermassive', 'Trous noirs', 'Où trouve-t-on les trous noirs supermassifs ?', 'Au centre de la plupart des grandes galaxies', 'Les noyaux galactiques abritent des trous noirs pouvant atteindre des millions ou milliards de masses solaires.', 1, 'blackHoles'],
  ['black-hole-intermediate', 'Trous noirs', 'Entre quelles catégories se situent les trous noirs de masse intermédiaire ?', 'Entre les trous noirs stellaires et supermassifs', 'Ils sont plus massifs que les trous noirs stellaires mais plus légers que les supermassifs.', 2, 'blackHoles'],
  ['black-hole-gravity-light', 'Trous noirs', 'Un trou noir aspire-t-il toute la matière autour de lui comme un aspirateur ?', 'Non', 'À distance égale, sa gravité agit comme celle de tout objet de même masse.', 2, 'blackHoles'],
  ['black-hole-detection', 'Trous noirs', 'Comment détecte-t-on souvent un trou noir invisible ?', 'En observant son influence sur la matière ou les étoiles voisines', 'Son disque, ses jets ou son effet gravitationnel peuvent révéler sa présence.', 1, 'blackHoles'],
  ['black-hole-merger', 'Trous noirs', 'Que peut produire la fusion de deux trous noirs ?', 'Des ondes gravitationnelles', 'La déformation de l’espace-temps se propage sous forme d’ondes.', 1, 'blackHoles'],
  ['black-hole-gravitational-waves', 'Trous noirs', 'Que sont les ondes gravitationnelles ?', 'Des ondulations de l’espace-temps', 'Elles se propagent à partir d’événements massifs et accélérés.', 1, 'blackHoles'],
  ['black-hole-time', 'Trous noirs', 'Comment la gravité extrême d’un trou noir affecte-t-elle le temps vu de loin ?', 'Elle ralentit le temps apparent', 'La relativité générale prévoit une dilatation gravitationnelle du temps.', 2, 'blackHoles'],
  ['black-hole-spaghettification', 'Trous noirs', 'À quoi fait référence la spaghettification ?', 'À l’étirement dû aux forces de marée', 'La différence de gravité entre deux points d’un objet peut l’étirer fortement.', 2, 'blackHoles'],
  ['black-hole-xray', 'Trous noirs', 'Pourquoi les rayons X peuvent-ils révéler un trou noir ?', 'La matière chauffée dans son disque émet des rayons X', 'Le disque d’accrétion atteint des températures très élevées.', 1, 'blackHoles'],
  ['black-hole-no-light', 'Trous noirs', 'Pourquoi ne voit-on pas directement un trou noir en lumière visible ?', 'Parce qu’il n’émet ni ne réfléchit directement la lumière depuis l’horizon', 'On observe plutôt son environnement et ses effets.', 1, 'blackHoles'],
  ['black-hole-sagittarius-a', 'Trous noirs', 'Quel est le nom du trou noir supermassif au centre de la Voie lactée ?', 'Sagittarius A*', 'Sagittarius A* se trouve au centre de notre galaxie.', 1, 'blackHoles'],
  ['black-hole-event-observer', 'Trous noirs', 'Que permet d’étudier l’ombre d’un trou noir ?', 'La lumière déformée par sa gravité', 'L’ombre apparente résulte de la capture et de la déviation de la lumière.', 2, 'blackHoles'],

  ['cosmos-big-bang', 'Cosmologie', 'Quel modèle décrit l’Univers en expansion depuis un état initial très chaud et dense ?', 'Le modèle du Big Bang', 'Le Big Bang décrit l’évolution de l’Univers observable depuis son état primordial.', 1, 'bigBang'],
  ['cosmos-expansion', 'Cosmologie', 'L’Univers est-il actuellement en expansion ?', 'Oui', 'Les observations montrent que les distances entre grandes structures augmentent.', 1, 'bigBang'],
  ['cosmos-space-expands', 'Cosmologie', 'Dans le modèle cosmologique, qu’est-ce qui se dilate principalement ?', 'L’espace lui-même', 'L’expansion cosmique est une évolution de la géométrie de l’espace.', 2, 'bigBang'],
  ['cosmos-no-center', 'Cosmologie', 'L’expansion de l’Univers possède-t-elle un centre spatial unique ?', 'Non', 'À grande échelle, chaque observateur voit les galaxies lointaines s’éloigner.', 2, 'bigBang'],
  ['cosmos-cmb', 'Cosmologie', 'Comment s’appelle le rayonnement fossile de l’Univers primordial ?', 'Le fond diffus cosmologique', 'C’est une lumière ancienne libérée lorsque l’Univers est devenu transparent.', 1, 'bigBang'],
  ['cosmos-cmb-temperature', 'Cosmologie', 'Dans quelle partie du spectre observe-t-on principalement le fond diffus cosmologique ?', 'Les micro-ondes', 'L’expansion a étiré cette lumière jusqu’au domaine des micro-ondes.', 1, 'bigBang'],
  ['cosmos-cmb-recombination', 'Cosmologie', 'Que s’est-il produit lorsque l’Univers est devenu transparent ?', 'Les électrons se sont liés aux noyaux pour former des atomes', 'Cette recombinaison a permis aux photons de voyager librement.', 2, 'bigBang'],
  ['cosmos-light-elements', 'Cosmologie', 'Quels éléments légers ont été formés principalement dans l’Univers primordial ?', 'L’hydrogène et l’hélium', 'La nucléosynthèse primordiale a produit surtout les éléments les plus légers.', 1, 'bigBang'],
  ['cosmos-first-stars', 'Cosmologie', 'Quand les premières étoiles sont-elles apparues par rapport au Big Bang ?', 'Après le Big Bang, lorsque les premiers nuages se sont effondrés', 'Les premières étoiles se sont formées après une période sans étoiles.', 1, 'bigBang'],
  ['cosmos-reionization', 'Cosmologie', 'Quel événement les premières étoiles ont-elles contribué à provoquer ?', 'La réionisation du gaz intergalactique', 'Leur rayonnement ultraviolet a ionisé une partie de l’hydrogène primordial.', 2, 'bigBang'],
  ['cosmos-age', 'Cosmologie', 'Quel âge approximatif l’Univers a-t-il selon les mesures cosmologiques modernes ?', 'Environ 13,8 milliards d’années', 'Les observations cosmologiques convergent vers un Univers âgé d’environ 13,8 milliards d’années.', 1, 'bigBang'],
  ['cosmos-observable', 'Cosmologie', 'Qu’appelle-t-on l’Univers observable ?', 'La région dont la lumière a eu le temps de nous parvenir', 'La limite observable dépend de l’âge de l’Univers et de la vitesse de la lumière.', 1, 'bigBang'],
  ['cosmos-speed-light', 'Cosmologie', 'Pourquoi la lumière limite-t-elle notre observation du cosmos ?', 'Parce que sa vitesse est finie', 'Observer loin revient à recevoir des informations qui ont voyagé pendant longtemps.', 1, 'bigBang'],
  ['cosmos-hubble-constant', 'Cosmologie', 'Que relie la loi de Hubble-Lemaître ?', 'La vitesse apparente d’éloignement et la distance des galaxies', 'En moyenne, les galaxies plus lointaines présentent un décalage vers le rouge plus important.', 2, 'bigBang'],
  ['cosmos-redshift-expansion', 'Cosmologie', 'Quel indice observationnel a révélé l’expansion cosmique ?', 'Le décalage vers le rouge des galaxies', 'La lumière de nombreuses galaxies est décalée vers les grandes longueurs d’onde.', 1, 'bigBang'],
  ['cosmos-fate', 'Cosmologie', 'Quel phénomène influence fortement l’évolution future de l’Univers ?', 'L’expansion cosmique', 'Le rythme et la nature de l’expansion déterminent l’évolution des grandes structures.', 2, 'darkEnergy'],

  ['dark-matter-invisible', 'Matière et énergie sombres', 'Pourquoi la matière noire est-elle dite « noire » ?', 'Elle n’émet ni n’absorbe directement la lumière détectable', 'Sa présence est déduite principalement de ses effets gravitationnels.', 1, 'darkMatter'],
  ['dark-matter-gravity', 'Matière et énergie sombres', 'Par quelle interaction détecte-t-on surtout la matière noire ?', 'Par la gravité', 'La matière noire influence les mouvements et la lumière par son champ gravitationnel.', 1, 'darkMatter'],
  ['dark-matter-galaxy-rotation', 'Matière et énergie sombres', 'Pourquoi les courbes de rotation galactique suggèrent-elles de la matière noire ?', 'La matière visible seule ne suffit pas à expliquer les vitesses observées', 'Les étoiles externes tournent trop vite selon la masse lumineuse mesurée.', 2, 'darkMatter'],
  ['dark-matter-lensing', 'Matière et énergie sombres', 'Quel phénomène cartographie la matière invisible autour des amas ?', 'La lentille gravitationnelle', 'La matière courbe la lumière des objets situés derrière elle.', 1, 'darkMatter'],
  ['dark-matter-cosmic-web', 'Matière et énergie sombres', 'Quel rôle joue la matière noire dans la toile cosmique ?', 'Elle fournit une grande partie de la structure gravitationnelle', 'Les filaments de matière noire guident la formation des galaxies et des amas.', 2, 'darkMatter'],
  ['dark-matter-not-antimatter', 'Matière et énergie sombres', 'La matière noire est-elle simplement de l’antimatière ?', 'Non', 'La matière noire désigne une composante inconnue déduite gravitationnellement, pas l’antimatière ordinaire.', 2, 'darkMatter'],
  ['dark-energy-definition', 'Matière et énergie sombres', 'Qu’est-ce que l’énergie sombre ?', 'Le nom donné à la composante associée à l’accélération de l’expansion cosmique', 'Sa nature physique reste inconnue.', 1, 'darkEnergy'],
  ['dark-energy-acceleration', 'Matière et énergie sombres', 'Quel effet est associé à l’énergie sombre ?', 'L’accélération de l’expansion de l’Univers', 'Les observations indiquent que l’expansion cosmique accélère.', 1, 'darkEnergy'],
  ['dark-energy-unknown', 'Matière et énergie sombres', 'La nature de l’énergie sombre est-elle connue avec certitude ?', 'Non', 'L’énergie sombre est une description observationnelle, pas une substance identifiée.', 1, 'darkEnergy'],
  ['dark-energy-space', 'Matière et énergie sombres', 'Quelle hypothèse simple associe l’énergie sombre à une propriété de l’espace vide ?', 'La constante cosmologique', 'Dans ce modèle, l’énergie du vide reste présente lorsque l’espace s’étend.', 2, 'darkEnergy'],
  ['dark-matter-energy-distinct', 'Matière et énergie sombres', 'La matière noire et l’énergie sombre désignent-elles le même phénomène ?', 'Non', 'La matière noire renforce la gravité à petite et grande échelle, tandis que l’énergie sombre est liée à l’expansion accélérée.', 1, 'darkEnergy'],
  ['dark-matter-majority', 'Matière et énergie sombres', 'La matière noire est-elle plus abondante que la matière ordinaire dans le modèle cosmologique ?', 'Oui', 'Le modèle cosmologique indique que la matière noire constitue une part plus importante que la matière atomique.', 2, 'darkMatter'],

  ['exoplanet-definition', 'Exoplanètes', 'Qu’est-ce qu’une exoplanète ?', 'Une planète qui orbite autour d’une étoile autre que le Soleil', 'Les exoplanètes appartiennent à d’autres systèmes planétaires.', 1, 'exoplanets'],
  ['exoplanet-first-detection', 'Exoplanètes', 'Pourquoi les exoplanètes sont-elles difficiles à voir directement ?', 'Elles sont très faibles par rapport à leur étoile', 'La lumière de l’étoile masque généralement celle de la planète.', 1, 'exoplanets'],
  ['exoplanet-transit', 'Exoplanètes', 'Que mesure la méthode des transits ?', 'La baisse périodique de luminosité d’une étoile', 'Une planète passant devant son étoile bloque une petite partie de sa lumière.', 1, 'exoplanets'],
  ['exoplanet-transit-size', 'Exoplanètes', 'Que permet d’estimer principalement la profondeur d’un transit ?', 'La taille relative de la planète', 'Une planète plus grande bloque une fraction plus importante de la lumière stellaire.', 2, 'exoplanets'],
  ['exoplanet-radial-velocity', 'Exoplanètes', 'Que mesure la méthode des vitesses radiales ?', 'Le mouvement de va-et-vient de l’étoile causé par la planète', 'La gravité de la planète fait légèrement osciller l’étoile autour du centre de masse.', 1, 'exoplanets'],
  ['exoplanet-direct-imaging', 'Exoplanètes', 'Que fait l’imagerie directe d’une exoplanète ?', 'Elle sépare la faible lumière de la planète de celle de l’étoile', 'Des instruments et techniques de contraste bloquent ou réduisent la lumière stellaire.', 2, 'exoplanets'],
  ['exoplanet-microlensing', 'Exoplanètes', 'Que détecte la microlentille gravitationnelle d’une exoplanète ?', 'Une amplification temporaire de la lumière d’une étoile d’arrière-plan', 'La gravité du système lentille déforme et amplifie la lumière distante.', 2, 'exoplanets'],
  ['exoplanet-astrometry', 'Exoplanètes', 'Que mesure l’astrométrie pour découvrir une exoplanète ?', 'Le déplacement apparent de l’étoile sur le ciel', 'L’étoile décrit une petite boucle autour du centre de masse du système.', 2, 'exoplanets'],
  ['exoplanet-habitable-zone', 'Exoplanètes', 'Qu’est-ce que la zone habitable autour d’une étoile ?', 'La région où l’eau liquide pourrait exister à la surface d’une planète', 'C’est un critère de distance et non une preuve de vie.', 1, 'exoplanets'],
  ['exoplanet-habitable-not-life', 'Exoplanètes', 'Une planète dans la zone habitable abrite-t-elle nécessairement la vie ?', 'Non', 'L’atmosphère, la géologie et de nombreux autres facteurs sont déterminants.', 1, 'exoplanets'],
  ['exoplanet-hot-jupiter', 'Exoplanètes', 'Qu’est-ce qu’un « Jupiter chaud » ?', 'Une géante gazeuse très proche de son étoile', 'Son orbite courte entraîne généralement une température élevée.', 1, 'exoplanets'],
  ['exoplanet-super-earth', 'Exoplanètes', 'Que désigne généralement le terme « super-Terre » ?', 'Une planète plus massive que la Terre mais moins massive que les géantes de glace', 'Le terme décrit surtout une gamme de masse, pas nécessairement une habitabilité.', 2, 'exoplanets'],
  ['exoplanet-mini-neptune', 'Exoplanètes', 'Qu’est-ce qu’une mini-Neptune ?', 'Une planète plus petite que Neptune mais souvent entourée d’une enveloppe gazeuse', 'Ces planètes ont des tailles intermédiaires entre la Terre et Neptune.', 2, 'exoplanets'],
  ['exoplanet-orbit', 'Exoplanètes', 'Que décrit la période orbitale d’une exoplanète ?', 'Le temps nécessaire pour accomplir une révolution autour de son étoile', 'La période dépend de l’orbite et de la masse de l’étoile.', 1, 'exoplanets'],
  ['exoplanet-atmosphere', 'Exoplanètes', 'Comment peut-on étudier l’atmosphère d’une exoplanète ?', 'En analysant la lumière qui la traverse ou s’y réfléchit', 'Les molécules peuvent laisser des signatures dans le spectre lumineux.', 2, 'exoplanets'],
  ['exoplanet-spectroscopy', 'Exoplanètes', 'Quelle technique identifie des molécules dans une atmosphère d’exoplanète ?', 'La spectroscopie', 'Les molécules absorbent des longueurs d’onde spécifiques.', 1, 'exoplanets'],
  ['exoplanet-orbital-plane', 'Exoplanètes', 'Pourquoi la méthode des transits ne détecte-t-elle pas tous les systèmes ?', 'L’orbite doit être correctement alignée avec notre ligne de visée', 'Sans alignement, la planète ne passe pas devant son étoile depuis la Terre.', 2, 'exoplanets'],
  ['exoplanet-star-wobble', 'Exoplanètes', 'Quelle loi explique que la planète et son étoile orbitent autour d’un centre de masse commun ?', 'La gravitation', 'Les deux corps s’attirent et leur mouvement dépend de leurs masses.', 1, 'exoplanets'],
  ['exoplanet-diversity', 'Exoplanètes', 'Les systèmes exoplanétaires ont-ils tous la même architecture que le Système solaire ?', 'Non', 'Les observations montrent une grande diversité de tailles et d’orbites.', 1, 'exoplanets'],
  ['exoplanet-planet-formation', 'Exoplanètes', 'Dans quel type de disque les planètes se forment-elles autour d’une jeune étoile ?', 'Un disque protoplanétaire', 'Le gaz et la poussière du disque peuvent s’agglomérer en planètes.', 1, 'exoplanets'],
];

function provenanceFor(source: SourceKey, factId: string): QuestionProvenance {
  return { factId, source: `${SOURCE} — ${source}`, url: SOURCES[source], license: LICENSE, checkedAt: CHECKED_AT, method: 'manual-check-of-independent-claims-against-linked-NASA-Science-page', status: 'approved' };
}

export const VERIFIED_ASTRONOMY_STARS_COSMOLOGY_QUESTIONS: Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, source]) => {
  const factId = `fact-astronomy-${id}`;
  return { id: `astronomy-nasa-${id}`, factId, version: 1, type: 'flashcard', category: 'Astronomie', subcategory, question, answer, acceptedAnswers: [answer], explanation, difficulty, tags: ['astronomie', 'étoiles', 'galaxies', 'cosmologie'], provenance: provenanceFor(source, factId) } satisfies Question;
});

export const VERIFIED_ASTRONOMY_STARS_COSMOLOGY_BATCH: VerifiedContentBatch = {
  id: 'nasa-stars-galaxies-cosmology',
  questions: VERIFIED_ASTRONOMY_STARS_COSMOLOGY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://science.nasa.gov/universe/',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual-check-of-120-independent-foundational-claims-against-linked-NASA-Science-pages',
  status: 'approved',
};
