import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent art-history facts checked against the open textbook
 * Introduction to Art History I (Myers et al.), Humanities LibreTexts.
 * The textbook is shared under CC BY-NC-SA 4.0. Each row is one claim;
 * this module does not create wording variants or infer new facts.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'Introduction to Art History I (Myers et al.), Humanities LibreTexts';
const LICENSE = 'CC BY-NC-SA 4.0';
const METHOD = 'manual editorial check against the cited textbook chapter; paraphrased independent claim; no generated variants';
const BASE_URL = 'https://human.libretexts.org/Bookshelves/Art/Art_History_and_Theory/Introduction_to_Art_History_I_(Myers)';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('art-line-element', 'Analyse visuelle', 'Quel élément visuel est produit par un point qui se déplace ?', 'Une ligne', 'La ligne est un tracé qui possède une direction, une longueur et parfois une épaisseur.', 1, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-shape-element', 'Analyse visuelle', 'Quelle différence fondamentale distingue une forme d’une ligne ?', 'Une forme délimite une surface', 'La forme possède une hauteur et une largeur, alors que la ligne est principalement directionnelle.', 1, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-value-light-dark', 'Analyse visuelle', 'Que désigne la valeur en analyse visuelle ?', 'Le degré de clarté ou d’obscurité', 'La valeur permet notamment de décrire les contrastes entre les zones claires et foncées d’une image.', 1, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-complementary-colors', 'Analyse visuelle', 'Comment appelle-t-on deux couleurs opposées sur un cercle chromatique ?', 'Des couleurs complémentaires', 'Deux couleurs complémentaires produisent un fort contraste lorsqu’elles sont rapprochées.', 1, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-texture-tactile', 'Analyse visuelle', 'Que décrit une texture tactile ?', 'La qualité de surface que l’on peut réellement toucher', 'La texture tactile est matérielle, contrairement à une texture visuelle qui est représentée par l’image.', 1, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-balance-composition', 'Analyse visuelle', 'Que concerne l’équilibre dans une composition ?', 'La répartition visuelle des poids et des forces', 'Une composition peut être symétrique, asymétrique ou radiale selon cette répartition.', 2, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-perspective-linear', 'Analyse visuelle', 'Quel procédé crée une impression de profondeur grâce à des lignes convergentes ?', 'La perspective linéaire', 'Les lignes parallèles dans l’espace sont représentées comme convergeant vers un ou plusieurs points de fuite.', 2, '03:_The_Visual_Elements_and_Principles_of_Composition'),
  row('art-olmec-colossal-heads', 'Amériques anciennes', 'Quel peuple mésoaméricain est associé aux têtes colossales en basalte ?', 'Les Olmèques', 'Les têtes colossales sont des sculptures monumentales caractéristiques du golfe du Mexique.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-maya-stelae', 'Amériques anciennes', 'Quel type de monument maya porte souvent des inscriptions et des représentations de dirigeants ?', 'La stèle', 'Les stèles mayas commémoraient notamment des événements et des souverains.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-aztec-sun-stone', 'Amériques anciennes', 'À quelle civilisation est généralement associée la Pierre du Soleil ?', 'La civilisation mexica (aztèque)', 'La Pierre du Soleil est un monument sculpté mexica dont l’interprétation est liée au calendrier et à la cosmologie.', 2, '04:_Art_of_the_Ancient_Americas'),
  row('art-inca-masonry', 'Amériques anciennes', 'Quelle caractéristique distingue certaines maçonneries incas ?', 'Des blocs de pierre ajustés avec précision', 'Les blocs polygonaux de certains sites incas s’emboîtent sans mortier visible.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-moche-pottery', 'Amériques anciennes', 'Quelle production est particulièrement connue dans l’art moche ?', 'La céramique, notamment les vases-portraits', 'Les vases moche peuvent représenter des visages, des personnages et des scènes rituelles.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-nazca-geoglyphs', 'Amériques anciennes', 'Quel type de tracés monumentaux est associé à la culture Nazca ?', 'Des géoglyphes', 'Les lignes et figures de Nazca sont dessinées sur le sol du désert côtier péruvien.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-teotihuacan-pyramid-sun', 'Amériques anciennes', 'Quelle grande pyramide se trouve à Teotihuacan ?', 'La pyramide du Soleil', 'La pyramide du Soleil est l’un des monuments majeurs de la cité mésoaméricaine de Teotihuacan.', 1, '04:_Art_of_the_Ancient_Americas'),
  row('art-lascaux-cave', 'Âge de pierre', 'Dans quel pays se trouve la grotte ornée de Lascaux ?', 'En France', 'Lascaux est une grotte ornée du Paléolithique située en Dordogne.', 1, '05:_Art_of_the_Stone_Age'),
  row('art-chauvet-cave', 'Âge de pierre', 'Quel type d’images domine dans la grotte Chauvet ?', 'Des peintures et gravures d’animaux', 'La grotte Chauvet est connue pour ses représentations animales paléolithiques.', 1, '05:_Art_of_the_Stone_Age'),
  row('art-cave-hand-stencils', 'Âge de pierre', 'Quelle technique a produit de nombreuses mains négatives dans l’art pariétal ?', 'La projection de pigment autour de la main', 'Le pigment est soufflé ou projeté sur la paroi en laissant la silhouette de la main.', 2, '05:_Art_of_the_Stone_Age'),
  row('art-venus-willendorf', 'Âge de pierre', 'De quelle matière est faite la Vénus de Willendorf ?', 'Du calcaire oolithique', 'Cette petite statuette paléolithique est sculptée dans un calcaire particulier.', 2, '05:_Art_of_the_Stone_Age'),
  row('art-venus-willendorf-period', 'Âge de pierre', 'À quelle période appartient la Vénus de Willendorf ?', 'Au Paléolithique supérieur', 'La statuette date du Paléolithique supérieur, une période de l’âge de pierre.', 1, '05:_Art_of_the_Stone_Age'),
  row('art-megalithic-stonehenge', 'Âge de pierre', 'Quel monument mégalithique britannique est formé de cercles de pierres dressées ?', 'Stonehenge', 'Stonehenge est un ensemble néolithique et de l’âge du bronze dans la plaine de Salisbury.', 1, '05:_Art_of_the_Stone_Age'),
  row('art-neolithic-pottery', 'Âge de pierre', 'Quelle technique permet de fabriquer un récipient en argile avant la cuisson ?', 'Le modelage ou le montage de l’argile', 'Les récipients néolithiques peuvent être formés à la main avant d’être cuits.', 1, '05:_Art_of_the_Stone_Age'),
  row('art-cuneiform-tablets', 'Proche-Orient ancien', 'Sur quel support l’écriture cunéiforme était-elle souvent inscrite ?', 'Des tablettes d’argile', 'Les signes étaient imprimés ou incisés dans l’argile fraîche avec un roseau taillé.', 1, '06:_The_Ancient_Near_East'),
  row('art-ziggurat-religious', 'Proche-Orient ancien', 'Quelle fonction principale avait une ziggurat mésopotamienne ?', 'Une plateforme monumentale liée à un temple', 'La ziggurat structurait un complexe religieux et dominait la ville.', 1, '06:_The_Ancient_Near_East'),
  row('art-hammurabi-stele', 'Proche-Orient ancien', 'Quel roi est représenté au sommet de la stèle du Code de Hammurabi ?', 'Hammurabi', 'La stèle montre Hammurabi devant une divinité, au-dessus du texte juridique.', 1, '06:_The_Ancient_Near_East'),
  row('art-hammurabi-stele-material', 'Proche-Orient ancien', 'Dans quelle matière la stèle du Code de Hammurabi est-elle réalisée ?', 'Dans la diorite', 'La stèle est une grande pierre sombre gravée de texte et d’une scène figurée.', 2, '06:_The_Ancient_Near_East'),
  row('art-assyrian-lamassu', 'Proche-Orient ancien', 'Quel être hybride gardait les entrées de palais assyriens ?', 'Le lamassu', 'Le lamassu combine un corps de taureau ou de lion, des ailes et une tête humaine.', 1, '06:_The_Ancient_Near_East'),
  row('art-assyrian-relief-hunting', 'Proche-Orient ancien', 'Quel sujet apparaît dans de nombreux reliefs des palais assyriens ?', 'La chasse royale', 'Les reliefs de chasse mettaient en scène le pouvoir et la maîtrise du roi.', 1, '06:_The_Ancient_Near_East'),
  row('art-ishtar-gate-brick', 'Proche-Orient ancien', 'Quel matériau coloré caractérise la porte d’Ishtar ?', 'La brique à glaçure bleue', 'La porte babylonienne est revêtue de briques glaçurées bleues ornées d’animaux.', 1, '06:_The_Ancient_Near_East'),
  row('art-egypt-hieroglyphs', 'Égypte ancienne', 'Quel type d’écriture combine des signes figuratifs et phonétiques dans l’Égypte ancienne ?', 'Les hiéroglyphes', 'Les hiéroglyphes pouvaient représenter des objets, des sons ou des idées selon le contexte.', 1, '07:_Ancient_Egypt'),
  row('art-egypt-ka-statue', 'Égypte ancienne', 'Quelle fonction avait notamment une statue de ka ?', 'Servir de support à la présence du ka du défunt', 'La statue participait aux pratiques funéraires destinées à maintenir la relation avec le défunt.', 2, '07:_Ancient_Egypt'),
  row('art-egypt-pyramids-giza', 'Égypte ancienne', 'Quel ensemble monumental comprend les pyramides de Khéops, Khéphren et Mykérinos ?', 'Le plateau de Gizeh', 'Le plateau de Gizeh rassemble trois grandes pyramides royales de l’Ancien Empire.', 1, '07:_Ancient_Egypt'),
  row('art-egypt-sphinx-giza', 'Égypte ancienne', 'Quelle créature représente le Grand Sphinx de Gizeh ?', 'Un lion à tête humaine', 'Le monument associe un corps de lion à une tête humaine et se trouve près des pyramides de Gizeh.', 1, '07:_Ancient_Egypt'),
  row('art-egypt-canon-proportions', 'Égypte ancienne', 'Quel système organisait souvent les proportions de la figure humaine égyptienne ?', 'Un canon de proportions', 'Un système de mesures aidait les artistes à conserver des proportions régulières.', 2, '07:_Ancient_Egypt'),
  row('art-egypt-composite-view', 'Égypte ancienne', 'Que combine la convention égyptienne de représentation composite du corps ?', 'Plusieurs points de vue dans une même figure', 'La tête et les jambes peuvent être montrées de profil tandis que le torse est frontal.', 1, '07:_Ancient_Egypt'),
  row('art-egypt-akhenaten-amarnian', 'Égypte ancienne', 'Quel pharaon est associé au style amarnien ?', 'Akhenaton', 'Le style amarnien, développé sous Akhenaton, représente les figures avec des formes plus souples et allongées.', 2, '07:_Ancient_Egypt'),
  row('art-minoan-palace-knossos', 'Égée ancienne', 'Quel palais est le principal site associé à la civilisation minoenne ?', 'Le palais de Knossos', 'Knossos, en Crète, est un vaste complexe palatial minoen.', 1, '08:_The_Ancient_Aegean'),
  row('art-minoan-fresco-bull', 'Égée ancienne', 'Quel animal est au centre de nombreuses images minoennes de saut ?', 'Le taureau', 'Les scènes de saut par-dessus le taureau sont un motif célèbre de l’art minoen.', 1, '08:_The_Ancient_Aegean'),
  row('art-minoan-fresco-technique', 'Égée ancienne', 'Sur quel support les fresques minoennes sont-elles peintes ?', 'Sur du plâtre', 'Les peintures murales sont appliquées sur des surfaces de plâtre préparées.', 1, '08:_The_Ancient_Aegean'),
  row('art-mycenaean-citadel', 'Égée ancienne', 'Quel site est une citadelle majeure de la civilisation mycénienne ?', 'Mycènes', 'Mycènes est un centre fortifié de l’âge du bronze en Grèce continentale.', 1, '08:_The_Ancient_Aegean'),
  row('art-lion-gate-mycenae', 'Égée ancienne', 'Quel monument monumental marque l’entrée de Mycènes ?', 'La porte des Lions', 'La porte est surmontée d’un relief de deux lions affrontés autour d’un pilier.', 1, '08:_The_Ancient_Aegean'),
  row('art-mycenaean-tholos-tomb', 'Égée ancienne', 'Comment appelle-t-on une tombe mycénienne à coupole en encorbellement ?', 'Une tombe à tholos', 'La chambre circulaire est couverte par des assises de pierre qui se rapprochent progressivement.', 2, '08:_The_Ancient_Aegean'),
  row('art-greek-orders-doric', 'Grèce antique', 'Quel ordre grec possède généralement un chapiteau sans volutes ?', 'L’ordre dorique', 'Le chapiteau dorique est sobre et l’entablement comprend une frise à triglyphes et métopes.', 1, '09:_Ancient_Greece'),
  row('art-greek-orders-ionic', 'Grèce antique', 'Quel élément caractérise le chapiteau ionique ?', 'Les volutes', 'Les volutes sont des enroulements latéraux typiques de l’ordre ionique.', 1, '09:_Ancient_Greece'),
  row('art-greek-orders-corinthian', 'Grèce antique', 'Quel motif végétal orne généralement le chapiteau corinthien ?', 'Des feuilles d’acanthe', 'L’ordre corinthien est reconnaissable à son chapiteau richement décoré de feuilles d’acanthe.', 1, '09:_Ancient_Greece'),
  row('art-parthenon-athena', 'Grèce antique', 'À quelle déesse le Parthénon d’Athènes est-il consacré ?', 'Athéna', 'Le temple est dédié à Athéna Parthénos, protectrice de la cité d’Athènes.', 1, '09:_Ancient_Greece'),
  row('art-parthenon-doric', 'Grèce antique', 'Quel ordre architectural domine l’extérieur du Parthénon ?', 'L’ordre dorique', 'Le péristyle extérieur du Parthénon est dorique, avec des éléments ioniques à l’intérieur.', 1, '09:_Ancient_Greece'),
  row('art-greek-black-figure', 'Grèce antique', 'Quelle technique de céramique grecque peint les figures en noir sur un fond rouge ?', 'La figure noire', 'Les silhouettes noires sont incisées et se détachent sur la couleur rouge de l’argile.', 1, '09:_Ancient_Greece'),
  row('art-greek-red-figure', 'Grèce antique', 'Quelle technique inverse les couleurs de la figure noire sur les vases ?', 'La figure rouge', 'Les figures conservent la couleur de l’argile tandis que le fond est couvert d’engobe noir.', 1, '09:_Ancient_Greece'),
  row('art-greek-contrapposto', 'Grèce antique', 'Que décrit le contrapposto dans la sculpture ?', 'Une posture qui répartit le poids sur une jambe', 'Le décalage entre les jambes et les hanches donne à la figure une apparence plus naturelle.', 2, '09:_Ancient_Greece'),
  row('art-greek-kouros', 'Grèce antique', 'Comment appelle-t-on une statue grecque archaïque représentant un jeune homme debout ?', 'Un kouros', 'Le kouros est généralement nu, frontal et présenté avec une jambe avancée.', 1, '09:_Ancient_Greece'),
  row('art-greek-kore', 'Grèce antique', 'Comment appelle-t-on une statue grecque archaïque représentant une jeune femme vêtue ?', 'Une korè', 'La korè est une figure féminine debout, souvent drapée et dédiée dans un sanctuaire.', 1, '09:_Ancient_Greece'),
  row('art-greek-theater-amphitheater', 'Grèce antique', 'Quelle forme architecturale accueille les représentations théâtrales grecques ?', 'Un théâtre en plein air à gradins', 'Les gradins suivent une pente autour de l’orchestra pour offrir une bonne visibilité et une bonne acoustique.', 1, '09:_Ancient_Greece'),
  row('art-etruscan-tomb-paintings', 'Étrusques', 'Quel type de décor se trouve dans plusieurs tombes étrusques ?', 'Des peintures murales', 'Les chambres funéraires étrusques sont parfois ornées de scènes de banquet, de danse et de musique.', 1, '10:_The_Etruscans'),
  row('art-etruscan-sarcophagus-spouses', 'Étrusques', 'Quel sujet représente le sarcophage des Époux ?', 'Un couple allongé sur un banquet', 'Le couvercle montre deux figures humaines dans une scène funéraire et sociale.', 1, '10:_The_Etruscans'),
  row('art-etruscan-arch', 'Étrusques', 'Quelle structure les Étrusques ont-ils contribué à diffuser en Italie ?', 'L’arc en voussoir', 'L’arc permet de franchir une ouverture grâce à des pierres disposées en coin.', 2, '10:_The_Etruscans'),
  row('art-etruscan-temple', 'Étrusques', 'Quel matériau était souvent utilisé pour les parties supérieures des temples étrusques ?', 'Le bois et la terre cuite', 'Les temples étrusques combinaient une structure périssable et des décors architecturaux en terre cuite.', 2, '10:_The_Etruscans'),
  row('art-roman-concrete', 'Empire romain', 'Quel matériau de construction a permis aux Romains de couvrir de grands espaces ?', 'Le béton romain', 'Le béton, associé à la maçonnerie, a favorisé les voûtes, les coupoles et les édifices monumentaux.', 1, '11:_The_Roman_Empire'),
  row('art-roman-aqueduct', 'Empire romain', 'Quel ouvrage conduisait l’eau vers les villes romaines ?', 'L’aqueduc', 'Les aqueducs utilisaient des canaux et parfois des ponts à arcades pour franchir les reliefs.', 1, '11:_The_Roman_Empire'),
  row('art-roman-basilica', 'Empire romain', 'Quelle était la fonction civile d’une basilique romaine ?', 'Un lieu de réunion, de justice ou de commerce', 'La basilique était un grand bâtiment public qui n’était pas d’abord une église chrétienne.', 1, '11:_The_Roman_Empire'),
  row('art-roman-colosseum', 'Empire romain', 'Quel édifice romain accueillait notamment des combats de gladiateurs ?', 'Le Colisée', 'L’amphithéâtre flavien accueillait des spectacles publics dans Rome.', 1, '11:_The_Roman_Empire'),
  row('art-roman-triumphal-arch', 'Empire romain', 'À quoi servait un arc de triomphe romain ?', 'À commémorer une victoire ou un événement politique', 'L’arc de triomphe portait souvent des reliefs et des inscriptions célébrant le pouvoir impérial.', 1, '11:_The_Roman_Empire'),
  row('art-roman-verism', 'Empire romain', 'Que caractérise le vérisme dans le portrait romain ?', 'Un réalisme accentuant les traits individuels et l’âge', 'Le portrait vériste met en avant les signes d’expérience et d’autorité.', 2, '11:_The_Roman_Empire'),
  row('art-roman-mosaic', 'Empire romain', 'De quoi est formée une mosaïque romaine ?', 'De petits éléments assemblés appelés tesselles', 'Les tesselles de pierre, de verre ou de céramique composent les images et motifs du pavement.', 1, '11:_The_Roman_Empire'),
  row('art-roman-pompeii-fresco', 'Empire romain', 'Quelle ville fournit de nombreux exemples de peintures murales romaines ?', 'Pompéi', 'Les éruptions du Vésuve ont préservé des décors peints dans des maisons et des bâtiments publics.', 1, '11:_The_Roman_Empire'),
  row('art-roman-pantheon-dome', 'Empire romain', 'Quel élément architectural est célèbre au Panthéon de Rome ?', 'Sa coupole à oculus', 'L’oculus est l’ouverture circulaire au sommet de la coupole.', 1, '11:_The_Roman_Empire'),
  row('art-roman-column-types', 'Empire romain', 'Quel ordre romain combine des volutes ioniques et des feuilles d’acanthe ?', 'L’ordre composite', 'Le chapiteau composite réunit des caractéristiques ioniques et corinthiennes.', 2, '11:_The_Roman_Empire'),
  row('art-late-antiquity-iconography', 'Antiquité tardive', 'Quel symbole chrétien associe les lettres grecques khi et rhô ?', 'Le chrisme', 'Le chrisme est un monogramme du nom du Christ utilisé dans l’art chrétien.', 1, '12:_Late_Antiquity'),
  row('art-catacomb-fresco', 'Antiquité tardive', 'Quel type de décor apparaît dans les catacombes chrétiennes ?', 'Des peintures murales à thèmes bibliques et symboliques', 'Les catacombes contiennent des images liées aux croyances et à l’espérance chrétiennes.', 1, '12:_Late_Antiquity'),
  row('art-early-christian-basilica', 'Antiquité tardive', 'Quel plan devient courant pour les basiliques chrétiennes primitives ?', 'Un plan longitudinal avec nef et abside', 'La nef conduit vers l’abside, qui accueille généralement l’espace liturgique principal.', 1, '12:_Late_Antiquity'),
  row('art-byzantine-dome-pendentive', 'Antiquité tardive', 'Quel dispositif permet de poser une coupole sur un plan carré ?', 'Le pendentif', 'Les pendentifs font passer progressivement du carré à la base circulaire de la coupole.', 2, '12:_Late_Antiquity'),
  row('art-ravenna-mosaics', 'Antiquité tardive', 'Quelle ville italienne est célèbre pour ses mosaïques paléochrétiennes et byzantines ?', 'Ravenne', 'Les monuments de Ravenne conservent d’importants décors de mosaïque de l’Antiquité tardive.', 1, '12:_Late_Antiquity'),
  row('art-byzantine-icon', 'Antiquité tardive', 'Comment appelle-t-on une image religieuse peinte dans la tradition byzantine ?', 'Une icône', 'L’icône représente une figure sacrée selon des conventions liturgiques et dévotionnelles.', 1, '12:_Late_Antiquity'),
  row('art-islamic-mosque-mihrab', 'Moyen Âge', 'Quel élément indique la direction de La Mecque dans une mosquée ?', 'Le mihrab', 'Le mihrab est une niche située dans le mur de la qibla.', 1, '13:_Medieval_I-_Reorganization_of_the_Roman_World_and_the_Birth_of_Islam'),
  row('art-islamic-mosque-minaret', 'Moyen Âge', 'Quelle structure est traditionnellement associée à l’appel à la prière dans une mosquée ?', 'Le minaret', 'Le minaret est une tour liée à la mosquée et à l’appel à la prière.', 1, '13:_Medieval_I-_Reorganization_of_the_Roman_World_and_the_Birth_of_Islam'),
  row('art-islamic-vegetal-arabesque', 'Moyen Âge', 'Quel motif ornemental stylisé est fréquent dans l’art islamique ?', 'L’arabesque végétale', 'L’arabesque développe des formes végétales répétées et entrelacées.', 1, '13:_Medieval_I-_Reorganization_of_the_Roman_World_and_the_Birth_of_Islam'),
  row('art-carolingian-manuscript', 'Moyen Âge', 'Quel objet enluminé est un support majeur de l’art carolingien ?', 'Le manuscrit', 'Les manuscrits carolingiens associent texte, lettrines et parfois peintures figurées.', 1, '13:_Medieval_I-_Reorganization_of_the_Roman_World_and_the_Birth_of_Islam'),
  row('art-roman-architecture-vault', 'Empires médiévaux', 'Quel type de couverture est fréquent dans l’architecture romane ?', 'La voûte en berceau', 'La voûte en berceau est une couverture semi-cylindrique qui prolonge un arc.', 1, '14:_Medieval_II-_Contested_Empires'),
  row('art-roman-portal-sculpture', 'Empires médiévaux', 'Quel emplacement accueille souvent une sculpture monumentale dans une église romane ?', 'Le portail', 'Le portail peut présenter un tympan sculpté et des figures liées au programme religieux.', 1, '14:_Medieval_II-_Contested_Empires'),
  row('art-bayeux-tapestry-embroidery', 'Empires médiévaux', 'La Tapisserie de Bayeux est-elle une tapisserie tissée ?', 'Non, c’est une broderie sur toile', 'L’œuvre est réalisée avec des fils brodés sur une toile de lin.', 2, '14:_Medieval_II-_Contested_Empires'),
  row('art-bayeux-conquest', 'Empires médiévaux', 'Quel événement est raconté par la Tapisserie de Bayeux ?', 'La conquête normande de l’Angleterre', 'La broderie raconte les événements qui mènent à la conquête de 1066.', 1, '14:_Medieval_II-_Contested_Empires'),
  row('art-buddhist-stupa', 'Moyen Âge asiatique', 'Quel monument bouddhique peut contenir des reliques et servir de support de circumambulation ?', 'Le stûpa', 'Le stûpa est un monument reliquaire autour duquel les fidèles peuvent circuler rituellement.', 1, '15:_Medieval_III-_Reorganization_of_the_East'),
  row('art-borobudur-stupa', 'Moyen Âge asiatique', 'Quel monument d’Indonésie est un vaste sanctuaire bouddhique en forme de mandala ?', 'Borobudur', 'Borobudur est construit en terrasses et comporte de nombreux stupas et reliefs.', 1, '15:_Medieval_III-_Reorganization_of_the_East'),
  row('art-jesus-buddha-gandhara', 'Moyen Âge asiatique', 'Quelle région est connue pour un art bouddhique mêlant influences grecques et indiennes ?', 'Le Gandhara', 'L’art du Gandhara a produit des images bouddhiques dont le style montre des influences hellénistiques.', 2, '15:_Medieval_III-_Reorganization_of_the_East'),
  row('art-gothic-pointed-arch', 'Gothique', 'Quel type d’arc est caractéristique de l’architecture gothique ?', 'L’arc brisé', 'L’arc brisé permet de répartir différemment les poussées et contribue à l’élévation des édifices.', 1, '16:_Gothic_Europe'),
  row('art-gothic-flying-buttress', 'Gothique', 'Quel dispositif reporte les poussées des voûtes vers l’extérieur d’une église gothique ?', 'L’arc-boutant', 'L’arc-boutant transmet les poussées à un contrefort extérieur.', 1, '16:_Gothic_Europe'),
  row('art-gothic-ribbed-vault', 'Gothique', 'Quel élément structurel compose une voûte d’ogives ?', 'Des nervures croisées', 'Les nervures forment l’ossature de la voûte et reportent les charges vers les supports.', 1, '16:_Gothic_Europe'),
  row('art-gothic-stained-glass', 'Gothique', 'Quel matériau coloré remplit les fenêtres des grandes églises gothiques ?', 'Le verre peint ou teinté', 'Les vitraux filtrent la lumière et développent des scènes et des motifs colorés.', 1, '16:_Gothic_Europe'),
  row('art-chartres-rose-window', 'Gothique', 'Quel type de fenêtre circulaire est emblématique des cathédrales gothiques ?', 'La rosace', 'La rosace organise des panneaux de vitrail autour d’un centre rayonnant.', 1, '16:_Gothic_Europe'),
  row('art-gothic-naturalism', 'Gothique', 'Quelle tendance caractérise une partie de la sculpture gothique tardive ?', 'Un naturalisme accru des figures', 'Les corps, les drapés et les expressions sont souvent observés avec davantage de variété et de mouvement.', 2, '16:_Gothic_Europe'),
  row('art-gothic-manuscript', 'Gothique', 'Quel type de livre est fréquemment enluminé dans l’Europe gothique ?', 'Le livre d’heures', 'Les livres d’heures sont des recueils de prières richement décorés pour des usages dévotionnels.', 1, '16:_Gothic_Europe'),
  row('art-gothic-sculpted-portal', 'Gothique', 'Quel espace d’une cathédrale gothique concentre souvent un programme sculpté monumental ?', 'Le portail', 'Les portails accueillent tympans, voussures et statues-colonnes formant un enseignement visuel.', 1, '16:_Gothic_Europe'),
] as const;

const chapterUrl = (chapter: string) => `${BASE_URL}/${chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: chapterUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_ART_HISTORY_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-art-history-myers-${id}`;
  return {
    id: `art-history-myers-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Arts',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['arts', 'histoire de l’art', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_ART_HISTORY_MYERS_BATCH: VerifiedContentBatch = {
  id: 'libretexts-art-history-myers-facts',
  questions: VERIFIED_ART_HISTORY_QUESTIONS,
  source: SOURCE,
  sourceUrl: BASE_URL,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_ART_HISTORY_MYERS_BATCH;
