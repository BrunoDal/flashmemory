import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent biology claims checked against OpenStax Biology 2e (CC BY 4.0).
 *
 * This module intentionally contains one row per fact.  It does not create
 * variants from a seed: every row has its own stable factId and chapter URL.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Biology 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax Biology 2e chapter';

type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  chapter: string,
];

const row = (id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string): Row => [id, subcategory, question, answer, explanation, difficulty, chapter];

const ROWS: readonly Row[] = [
  row('prokaryote-no-nucleus', 'Cellule', 'Quelle structure manque généralement aux cellules procaryotes ?', 'Un noyau délimité par une membrane', 'Chez les procaryotes, le matériel génétique se trouve dans une région nucléoïde et non dans un noyau membranaire.', 1, '4-cell-structure'),
  row('eukaryote-organelles', 'Cellule', 'Comment appelle-t-on les cellules qui possèdent des organites entourés de membranes ?', 'Les cellules eucaryotes', 'Les cellules eucaryotes possèdent notamment un noyau et divers organites membranaires.', 1, '4-cell-structure'),
  row('ribosome-protein', 'Cellule', 'Quelle est la fonction principale d’un ribosome ?', 'Synthétiser des protéines', 'Le ribosome assemble une chaîne d’acides aminés en suivant l’information portée par un ARN messager.', 1, '4-cell-structure'),
  row('cell-membrane-phospholipid', 'Cellule', 'De quelles molécules est principalement constituée la bicouche de la membrane plasmique ?', 'De phospholipides', 'Les phospholipides s’organisent en deux couches, avec leurs têtes hydrophiles vers les milieux aqueux.', 1, '5-structure-and-function-of-plasma-membranes'),
  row('membrane-selective', 'Cellule', 'Comment décrit-on une membrane qui laisse passer certaines substances et en retient d’autres ?', 'Sélectivement perméable', 'La perméabilité sélective permet à la cellule de contrôler ses échanges avec son environnement.', 1, '5-structure-and-function-of-plasma-membranes'),
  row('diffusion-gradient', 'Cellule', 'Dans quel sens net les molécules se déplacent-elles spontanément par diffusion ?', 'Du milieu le plus concentré vers le moins concentré', 'La diffusion suit le gradient de concentration jusqu’à l’équilibre.', 1, '5-structure-and-function-of-plasma-membranes'),
  row('osmosis-water', 'Cellule', 'Quel est le nom de la diffusion de l’eau à travers une membrane sélective ?', 'L’osmose', 'L’osmose est le déplacement net de l’eau en réponse à une différence de concentration en solutés.', 1, '5-structure-and-function-of-plasma-membranes'),
  row('active-transport-atp', 'Cellule', 'Quelle source d’énergie alimente directement de nombreux transports actifs membranaires ?', 'L’ATP', 'Les pompes membranaires utilisent l’énergie de l’hydrolyse de l’ATP pour déplacer des solutés contre leur gradient.', 2, '5-structure-and-function-of-plasma-membranes'),
  row('enzyme-substrate', 'Métabolisme', 'Comment appelle-t-on la molécule sur laquelle agit une enzyme ?', 'Le substrat', 'Le substrat se lie au site actif de l’enzyme et y est transformé en produit(s).', 1, '6-metabolism'),
  row('enzyme-catalyst', 'Métabolisme', 'Quel effet une enzyme a-t-elle sur une réaction chimique ?', 'Elle en accélère la vitesse', 'Une enzyme abaisse l’énergie d’activation sans être consommée par la réaction.', 1, '6-metabolism'),
  row('atp-phosphate', 'Métabolisme', 'Quelle partie de l’ATP est généralement transférée lors d’une phosphorylation ?', 'Un groupe phosphate', 'Le transfert d’un groupe phosphate peut modifier l’activité d’une molécule ou d’une protéine.', 2, '6-metabolism'),
  row('glycolysis-location', 'Respiration', 'Dans quelle partie de la cellule eucaryote la glycolyse se déroule-t-elle ?', 'Dans le cytosol', 'La glycolyse transforme le glucose en pyruvate dans le cytosol, avant les étapes mitochondriales de la respiration.', 2, '7-cellular-respiration'),
  row('krebs-cycle-matrix', 'Respiration', 'Dans quelle partie de la mitochondrie se déroule le cycle de Krebs ?', 'Dans la matrice mitochondriale', 'Chez les eucaryotes, les réactions du cycle de Krebs ont lieu dans la matrice de la mitochondrie.', 2, '7-cellular-respiration'),
  row('electron-transport-chain', 'Respiration', 'Quel est le rôle principal de la chaîne de transport d’électrons ?', 'Créer un gradient de protons', 'Le transfert d’électrons fournit l’énergie nécessaire pour pomper des protons à travers la membrane interne mitochondriale.', 2, '7-cellular-respiration'),
  row('fermentation-no-oxygen', 'Respiration', 'Dans quelle situation la fermentation permet-elle de régénérer du NAD+ ?', 'Quand l’oxygène ou la respiration aérobie ne suffit pas', 'La fermentation permet à la glycolyse de continuer en régénérant le NAD+ à partir du NADH.', 2, '7-cellular-respiration'),
  row('chloroplast-thylakoid', 'Végétaux', 'Dans quelle structure du chloroplaste se trouvent les thylakoïdes ?', 'Dans des empilements appelés grana', 'Les grana regroupent des sacs de thylakoïdes où se déroulent les réactions lumineuses.', 2, '8-photosynthesis'),
  row('photosystem-light', 'Végétaux', 'Que captent les pigments des photosystèmes ?', 'Des photons de lumière', 'Les pigments absorbent des photons et excitent des électrons lors des réactions dépendantes de la lumière.', 1, '8-photosynthesis'),
  row('calvin-cycle-stroma', 'Végétaux', 'Dans quelle partie du chloroplaste se déroule le cycle de Calvin ?', 'Dans le stroma', 'Le stroma contient les enzymes qui fixent le carbone lors des réactions indépendantes de la lumière.', 2, '8-photosynthesis'),
  row('plant-atp-photosynthesis', 'Végétaux', 'Quel composé énergétique produit par les réactions lumineuses est utilisé dans le cycle de Calvin ?', 'L’ATP', 'Les réactions lumineuses produisent de l’ATP et du NADPH utilisés ensuite pour fixer le carbone.', 2, '8-photosynthesis'),
  row('cell-cycle-interphase', 'Cellule', 'Quelle phase occupe la plus grande partie du cycle cellulaire ?', 'L’interphase', 'L’interphase comprend la croissance, la préparation et la réplication de l’ADN avant la division.', 1, '9-cell-reproduction'),
  row('dna-replication-semi', 'Génétique', 'Comment qualifie-t-on la réplication de l’ADN ?', 'Semi-conservative', 'Chaque molécule fille conserve un brin parental et possède un brin nouvellement synthétisé.', 2, '10-molecular-biology'),
  row('dna-polymerase', 'Génétique', 'Quelle enzyme ajoute les nucléotides lors de la réplication de l’ADN ?', 'L’ADN polymérase', 'L’ADN polymérase allonge un nouveau brin en ajoutant des nucléotides complémentaires.', 1, '10-molecular-biology'),
  row('base-pairing-at', 'Génétique', 'Quelles bases de l’ADN s’apparient normalement ?', 'L’adénine et la thymine', 'Dans l’ADN, l’adénine s’apparie avec la thymine par des liaisons hydrogène.', 1, '10-molecular-biology'),
  row('rna-uracil', 'Génétique', 'Quelle base azotée de l’ARN remplace la thymine de l’ADN ?', 'L’uracile', 'L’ARN utilise l’uracile à la place de la thymine pour s’apparier avec l’adénine.', 1, '10-molecular-biology'),
  row('transcription-rna', 'Génétique', 'Comment appelle-t-on la copie d’un gène d’ADN en ARN ?', 'La transcription', 'La transcription produit un ARN complémentaire d’une séquence d’ADN.', 1, '10-molecular-biology'),
  row('translation-ribosome', 'Génétique', 'Où se déroule la traduction de l’ARN messager ?', 'Au niveau des ribosomes', 'Le ribosome lit les codons de l’ARN messager et assemble les acides aminés correspondants.', 1, '10-molecular-biology'),
  row('codon-three', 'Génétique', 'Combien de nucléotides composent un codon de l’ARN messager ?', 'Trois', 'Chaque codon est un triplet de nucléotides qui spécifie un acide aminé ou un signal d’arrêt.', 1, '10-molecular-biology'),
  row('start-codon-aug', 'Génétique', 'Quel codon sert généralement de signal de départ de la traduction ?', 'AUG', 'AUG code la méthionine et marque généralement le début de la traduction.', 2, '10-molecular-biology'),
  row('mutation-definition', 'Génétique', 'Comment appelle-t-on une modification de la séquence de l’ADN ?', 'Une mutation', 'Une mutation est un changement de la séquence nucléotidique ; ses effets dépendent de son contexte.', 1, '10-molecular-biology'),
  row('meiosis-gametes', 'Reproduction', 'Quel type de cellules la méiose produit-elle ?', 'Des gamètes haploïdes', 'La méiose réduit de moitié le nombre de chromosomes pour former des cellules reproductrices.', 1, '11-genetics'),
  row('meiosis-crossing-over', 'Reproduction', 'Comment s’appelle l’échange de segments entre chromosomes homologues pendant la méiose ?', 'Le crossing-over', 'Cet échange crée de nouvelles combinaisons d’allèles et augmente la diversité génétique.', 2, '11-genetics'),
  row('homologous-chromosomes', 'Génétique', 'Que sont deux chromosomes homologues ?', 'Une paire portant les mêmes types de gènes', 'Les homologues ont des loci correspondants, l’un provenant de chaque parent.', 2, '11-genetics'),
  row('allele-definition', 'Génétique', 'Comment appelle-t-on une version particulière d’un gène ?', 'Un allèle', 'Des allèles différents peuvent produire des versions différentes d’un caractère.', 1, '11-genetics'),
  row('genotype-definition', 'Génétique', 'Comment appelle-t-on la composition allélique d’un individu ?', 'Le génotype', 'Le génotype décrit les allèles présents, contrairement au phénotype observable.', 1, '11-genetics'),
  row('phenotype-definition', 'Génétique', 'Comment appelle-t-on l’ensemble des caractères observables d’un organisme ?', 'Le phénotype', 'Le phénotype résulte de l’expression du génotype dans un environnement donné.', 1, '11-genetics'),
  row('mendel-segregation', 'Génétique', 'Que décrit la loi de ségrégation de Mendel ?', 'Les deux allèles d’un gène se séparent lors de la formation des gamètes', 'Chaque gamète reçoit un seul allèle de chaque gène dans le modèle mendélien.', 2, '12-mendelian-genetics'),
  row('independent-assortment', 'Génétique', 'Que décrit l’assortiment indépendant des chromosomes ?', 'La transmission indépendante de paires de chromosomes différentes', 'Les paires homologues s’orientent indépendamment lors de la méiose, si les gènes ne sont pas liés.', 2, '12-mendelian-genetics'),
  row('natural-selection', 'Évolution', 'Quel processus favorise les caractères héréditaires qui améliorent la survie ou la reproduction ?', 'La sélection naturelle', 'Les individus porteurs de variations avantageuses laissent en moyenne davantage de descendants.', 1, '18-evolution-and-the-origin-of-species'),
  row('homologous-structures', 'Évolution', 'Que suggèrent des structures homologues chez différentes espèces ?', 'Une origine évolutive commune', 'Des structures homologues partagent une organisation héritée d’un ancêtre commun, même si leurs fonctions diffèrent.', 2, '18-evolution-and-the-origin-of-species'),
  row('speciation-definition', 'Évolution', 'Comment appelle-t-on la formation de nouvelles espèces ?', 'La spéciation', 'La spéciation survient lorsque des populations divergent et deviennent reproductivement isolées.', 2, '18-evolution-and-the-origin-of-species'),
  row('binomial-nomenclature', 'Diversité', 'De combien de termes se compose le nom scientifique binominal d’une espèce ?', 'Deux', 'Le binôme comprend le genre et l’épithète spécifique, généralement écrits en italique.', 1, '20-phylogenies-and-the-history-of-life'),
  row('phylogenetic-tree', 'Évolution', 'Que représentent les nœuds d’un arbre phylogénétique ?', 'Des ancêtres communs', 'Un nœud indique une divergence à partir d’un ancêtre commun hypothétique ou connu.', 2, '20-phylogenies-and-the-history-of-life'),
  row('bacteria-cell-wall', 'Microbiologie', 'Quel polymère caractérise la paroi cellulaire des bactéries ?', 'Le peptidoglycane', 'Le peptidoglycane forme un réseau rigide autour de la membrane de nombreuses bactéries.', 2, '22-prokaryotes-bacteria-and-archaea'),
  row('archaea-distinct', 'Microbiologie', 'Les archées appartiennent-elles au même domaine que les bactéries ?', 'Non, elles constituent un domaine distinct', 'Les trois domaines du vivant sont les Bacteria, les Archaea et les Eukarya.', 1, '22-prokaryotes-bacteria-and-archaea'),
  row('virus-capsid', 'Microbiologie', 'Comment appelle-t-on l’enveloppe protéique qui entoure le génome d’un virus ?', 'La capside', 'La capside protège le matériel génétique viral et contribue souvent à l’entrée dans une cellule hôte.', 1, '21-viruses'),
  row('virus-genome-types', 'Microbiologie', 'Quel type de matériel génétique un virus peut-il posséder ?', 'De l’ADN ou de l’ARN', 'Selon l’espèce virale, le génome peut être constitué d’ADN ou d’ARN, simple ou double brin.', 1, '21-viruses'),
  row('fungi-chitin', 'Diversité', 'Quelle substance compose principalement la paroi cellulaire des champignons ?', 'La chitine', 'La chitine est un polysaccharide structural présent dans les parois des champignons.', 1, '24-fungi'),
  row('fungi-hyphae', 'Diversité', 'Comment appelle-t-on les filaments qui constituent le réseau d’un champignon ?', 'Des hyphes', 'L’ensemble des hyphes forme le mycélium, qui explore le substrat.', 1, '24-fungi'),
  row('plant-xylem', 'Végétaux', 'Quel tissu végétal transporte principalement l’eau et les sels minéraux depuis les racines ?', 'Le xylème', 'Le xylème conduit la sève brute des racines vers les parties aériennes.', 1, '30-plant-form-and-physiology'),
  row('plant-phloem', 'Végétaux', 'Quel tissu transporte les sucres produits par les feuilles ?', 'Le phloème', 'Le phloème distribue la sève élaborée vers les organes qui utilisent ou stockent les sucres.', 1, '30-plant-form-and-physiology'),
  row('stomata-gas', 'Végétaux', 'Quel est le rôle principal des stomates des feuilles ?', 'Réguler les échanges gazeux et la perte d’eau', 'Les stomates s’ouvrent ou se ferment pour contrôler l’entrée du CO₂ et la sortie de vapeur d’eau.', 1, '30-plant-form-and-physiology'),
  row('transpiration-plant', 'Végétaux', 'Comment appelle-t-on la perte de vapeur d’eau par les parties aériennes d’une plante ?', 'La transpiration', 'La transpiration se produit surtout par les stomates et contribue au flux d’eau dans le xylème.', 1, '30-plant-form-and-physiology'),
  row('plant-meristem', 'Végétaux', 'Quel tissu végétal contient des cellules capables de se diviser activement pour assurer la croissance ?', 'Le méristème', 'Les méristèmes produisent de nouvelles cellules qui permettent la croissance primaire ou secondaire.', 2, '30-plant-form-and-physiology'),
  row('root-hairs', 'Végétaux', 'Quelle structure augmente fortement la surface d’absorption d’une racine ?', 'Les poils absorbants', 'Ces prolongements des cellules épidermiques facilitent l’absorption d’eau et d’ions minéraux.', 1, '30-plant-form-and-physiology'),
  row('flower-anther', 'Reproduction', 'Quelle partie de l’étamine produit le pollen ?', 'L’anthère', 'L’anthère contient les sacs polliniques où se forment les grains de pollen.', 1, '32-plant-reproduction'),
  row('flower-ovary', 'Reproduction', 'Quelle partie du pistil contient les ovules ?', 'L’ovaire', 'Après fécondation, les ovules deviennent des graines et l’ovaire peut devenir un fruit.', 1, '32-plant-reproduction'),
  row('fruit-ovary', 'Végétaux', 'Quelle structure florale devient généralement le fruit après fécondation ?', 'L’ovaire', 'Le fruit se développe à partir de l’ovaire de la fleur chez les angiospermes.', 1, '32-plant-reproduction'),
  row('tropism-phototropism', 'Végétaux', 'Comment appelle-t-on la croissance orientée d’une plante en réponse à la lumière ?', 'Le phototropisme', 'Les tiges présentent souvent une croissance orientée vers la lumière.', 1, '30-plant-form-and-physiology'),
  row('small-intestine-villi', 'Digestion', 'Quelles structures augmentent la surface d’absorption de l’intestin grêle ?', 'Les villosités et les microvillosités', 'Ces replis multiplient la surface disponible pour absorber les nutriments.', 1, '34-digestive-system'),
  row('stomach-acid', 'Digestion', 'Quel acide est sécrété dans l’estomac ?', 'L’acide chlorhydrique', 'L’acide chlorhydrique contribue à l’environnement acide de l’estomac et à la digestion des protéines.', 1, '34-digestive-system'),
  row('liver-bile', 'Digestion', 'Quel organe produit la bile ?', 'Le foie', 'Le foie produit la bile, qui est ensuite stockée et concentrée dans la vésicule biliaire.', 1, '34-digestive-system'),
  row('alveoli-exchange', 'Respiration', 'Dans quelle structure pulmonaire les échanges de gaz avec le sang ont-ils lieu ?', 'Les alvéoles', 'Les alvéoles offrent une grande surface et une paroi fine pour les échanges d’oxygène et de dioxyde de carbone.', 1, '39-the-respiratory-system'),
  row('diaphragm-inhale', 'Respiration', 'Que fait le diaphragme lors d’une inspiration normale ?', 'Il se contracte et s’abaisse', 'Son abaissement augmente le volume de la cage thoracique et fait entrer l’air dans les poumons.', 1, '39-the-respiratory-system'),
  row('arteries-away', 'Circulation', 'Dans quelle direction les artères transportent-elles généralement le sang ?', 'Elles l’éloignent du cœur', 'Une artère est définie par la direction du flux par rapport au cœur, quelle que soit sa teneur en oxygène.', 1, '40-the-circulatory-system'),
  row('veins-toward', 'Circulation', 'Dans quelle direction les veines transportent-elles généralement le sang ?', 'Elles le ramènent vers le cœur', 'Les veines ramènent le sang au cœur et possèdent souvent des valvules anti-reflux.', 1, '40-the-circulatory-system'),
  row('capillary-exchange', 'Circulation', 'Quel type de vaisseau est spécialisé dans les échanges avec les tissus ?', 'Le capillaire', 'Les capillaires ont des parois très fines qui permettent les échanges de gaz, nutriments et déchets.', 1, '40-the-circulatory-system'),
  row('synapse-definition', 'Système nerveux', 'Comment appelle-t-on la jonction fonctionnelle entre deux neurones ?', 'Une synapse', 'La synapse permet la transmission d’un signal électrique ou chimique d’une cellule à une autre.', 1, '35-the-nervous-system'),
  row('myelin-function', 'Système nerveux', 'Quel est le rôle général de la myéline autour de certains axones ?', 'Accélérer la conduction du signal nerveux', 'La gaine de myéline isole l’axone et permet une conduction saltatoire plus rapide.', 2, '35-the-nervous-system'),
  row('endocrine-hormones', 'Système hormonal', 'Comment les glandes endocrines libèrent-elles leurs messagers ?', 'Dans le sang', 'Les hormones endocrines sont sécrétées dans le milieu intérieur et transportées par la circulation.', 1, '37-the-endocrine-system'),
  row('insulin-glucose', 'Système hormonal', 'Quelle hormone favorise l’entrée du glucose dans de nombreuses cellules après un repas ?', 'L’insuline', 'L’insuline est produite par le pancréas et contribue à faire baisser la concentration de glucose sanguin.', 1, '37-the-endocrine-system'),
  row('innate-immunity', 'Immunité', 'Comment appelle-t-on la défense présente dès la naissance et agissant rapidement ?', 'L’immunité innée', 'L’immunité innée comprend notamment des barrières et des réponses générales aux agents étrangers.', 1, '42-the-immune-system'),
  row('adaptive-immunity-memory', 'Immunité', 'Quelle propriété distingue notamment l’immunité adaptative ?', 'La mémoire immunitaire', 'Après une première rencontre, certaines cellules permettent une réponse plus rapide et plus ciblée lors d’une nouvelle rencontre.', 2, '42-the-immune-system'),
  row('fertilization-zygote', 'Reproduction', 'Comment appelle-t-on la cellule formée par la fusion de deux gamètes ?', 'Le zygote', 'Le zygote est la première cellule du nouvel organisme après la fécondation.', 1, '43-animal-reproduction'),
  row('placenta-exchange', 'Développement', 'Quel organe temporaire permet des échanges entre la circulation maternelle et celle de l’embryon ?', 'Le placenta', 'Le placenta assure des échanges de gaz, nutriments et déchets sans mélange direct normal des deux sangs.', 2, '44-human-reproduction'),
  row('metamorphosis-definition', 'Développement', 'Comment appelle-t-on une transformation marquée de la forme d’un animal au cours de son développement ?', 'La métamorphose', 'La métamorphose distingue nettement des stades comme la larve et l’adulte chez de nombreux animaux.', 1, '28-invertebrates'),
  row('population-definition', 'Écologie', 'Comment appelle-t-on un groupe d’individus de la même espèce vivant dans une zone donnée ?', 'Une population', 'Une population partage un espace et peut se reproduire au sein de la même espèce.', 1, '45-population-and-community-ecology'),
  row('carrying-capacity', 'Écologie', 'Que désigne la capacité de charge d’un milieu ?', 'Le nombre maximal d’individus qu’il peut soutenir durablement', 'Elle dépend des ressources, des interactions et des conditions environnementales.', 2, '45-population-and-community-ecology'),
  row('trophic-level-producer', 'Écologie', 'À quel niveau trophique se trouvent les producteurs dans une chaîne alimentaire ?', 'Au premier niveau', 'Les producteurs captent l’énergie et constituent la base des réseaux alimentaires.', 1, '46-ecosystems'),
  row('decomposer-role', 'Écologie', 'Quel rôle jouent les décomposeurs dans un écosystème ?', 'Ils recyclent la matière organique en éléments minéraux', 'Les bactéries et les champignons décomposent les restes et rendent des nutriments disponibles.', 1, '46-ecosystems'),
  row('nitrogen-fixation', 'Écologie', 'Que transforme la fixation de l’azote atmosphérique ?', 'Le diazote en composés azotés utilisables', 'Certaines bactéries convertissent N₂ en formes que les plantes peuvent intégrer au cycle de l’azote.', 2, '46-ecosystems'),
  row('food-web', 'Écologie', 'Comment appelle-t-on l’ensemble des chaînes alimentaires reliées d’un écosystème ?', 'Un réseau trophique', 'Un réseau trophique représente les multiples relations alimentaires entre organismes.', 1, '46-ecosystems'),
  row('primary-succession', 'Écologie', 'Sur quel type de milieu commence une succession primaire ?', 'Un milieu sans sol préexistant', 'La succession primaire commence sur une surface nue, par exemple après la formation d’une roche volcanique.', 2, '47-conservation-biology-and-biodiversity'),
  row('biodiversity-levels', 'Écologie', 'Quels trois niveaux sont souvent distingués pour décrire la biodiversité ?', 'Gènes, espèces et écosystèmes', 'La diversité biologique se mesure à ces trois niveaux complémentaires.', 1, '47-conservation-biology-and-biodiversity'),
  row('keystone-species', 'Écologie', 'Qu’est-ce qu’une espèce clé de voûte ?', 'Une espèce dont l’effet sur l’écosystème est disproportionné', 'La disparition d’une espèce clé de voûte peut modifier fortement la structure d’une communauté.', 2, '47-conservation-biology-and-biodiversity'),
  row('biome-climate', 'Écologie', 'Quel facteur détermine principalement la répartition des grands biomes terrestres ?', 'Le climat', 'La température et les précipitations influencent la végétation dominante et les communautés associées.', 1, '48-population-and-community-ecology'),
  row('carrying-capacity-density', 'Écologie', 'Quel type de facteur devient souvent plus important quand la densité d’une population augmente ?', 'Un facteur dépendant de la densité', 'La compétition, les maladies et la prédation peuvent augmenter avec la densité.', 2, '45-population-and-community-ecology'),
  row('mutualism-definition', 'Écologie', 'Comment appelle-t-on une interaction dans laquelle les deux espèces bénéficient de leur association ?', 'Le mutualisme', 'Le mutualisme est une interaction +/+ ; ses formes peuvent être obligatoires ou facultatives.', 1, '45-population-and-community-ecology'),
  row('commensalism-definition', 'Écologie', 'Comment appelle-t-on une interaction où une espèce bénéficie et l’autre n’est pas affectée ?', 'Le commensalisme', 'Le commensalisme est une interaction +/0 selon la classification écologique courante.', 2, '45-population-and-community-ecology'),
  row('ecological-niche', 'Écologie', 'Que décrit la niche écologique d’une espèce ?', 'Son rôle et ses conditions d’utilisation des ressources', 'La niche inclut les ressources, les conditions et les interactions qui caractérisent la façon de vivre d’une espèce.', 2, '45-population-and-community-ecology'),
  row('carbon-cycle-respiration', 'Écologie', 'Quel processus rejette du dioxyde de carbone dans l’atmosphère chez les organismes vivants ?', 'La respiration cellulaire', 'La respiration oxyde des molécules organiques et libère du CO₂ comme produit du métabolisme.', 1, '46-ecosystems'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/biology-2e/pages/${chapter}`;

const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_BIOLOGY_QUESTIONS: Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-biology-openstax-${id}`;
  return {
    id: `biology-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Biologie',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['biologie', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_BIOLOGY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-biology-2e-facts',
  questions: VERIFIED_BIOLOGY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/biology-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent claims against the cited chapter; no generated variants',
  status: 'approved',
};

export default VERIFIED_BIOLOGY_OPENSTAX_BATCH;
