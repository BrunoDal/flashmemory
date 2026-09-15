import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent anatomy and physiology facts checked against OpenStax Anatomy
 * and Physiology 2e (CC BY 4.0).  One row represents one claim; no wording
 * variants are generated.  Chapter URLs are kept on each row so a reviewer
 * can trace the claim to the relevant textbook chapter.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Anatomy and Physiology 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax Anatomy and Physiology 2e chapter';

type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  chapter: string,
];

const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('anatomical-position', 'Fondamentaux', 'Dans quelle position de référence les paumes sont-elles tournées vers l’avant ?', 'La position anatomique', 'En position anatomique, le corps est debout, les pieds sont parallèles et les paumes regardent vers l’avant.', 1, '1-introduction'),
  row('superior-direction', 'Fondamentaux', 'Que signifie le terme anatomique supérieur ?', 'Situé vers la tête', 'Une structure supérieure est plus proche de la tête qu’une autre structure de comparaison.', 1, '1-introduction'),
  row('distal-direction', 'Fondamentaux', 'Que signifie distal pour un membre ?', 'Plus éloigné de son point d’attache', 'Le poignet est distal par rapport au coude, car il est plus éloigné de l’épaule.', 1, '1-introduction'),
  row('sagittal-plane', 'Fondamentaux', 'Quel plan anatomique sépare le corps en parties droite et gauche ?', 'Le plan sagittal', 'Un plan sagittal est orienté verticalement et divise le corps selon un axe antéro-postérieur.', 1, '1-introduction'),
  row('homeostasis-definition', 'Physiologie', 'Comment appelle-t-on le maintien relativement stable du milieu intérieur ?', 'L’homéostasie', 'L’homéostasie repose sur des mécanismes de régulation qui compensent les variations internes et externes.', 1, '1-introduction'),
  row('negative-feedback', 'Physiologie', 'Quel type de rétroaction réduit l’écart par rapport à une valeur de référence ?', 'La rétroaction négative', 'Une rétroaction négative produit une réponse qui s’oppose au changement initial.', 1, '1-introduction'),
  row('covalent-bond', 'Chimie biologique', 'Que partagent deux atomes liés par une liaison covalente ?', 'Des électrons', 'Une liaison covalente résulte du partage d’une ou plusieurs paires d’électrons.', 1, '2-the-chemical-level-of-organization'),
  row('hydrogen-bond-water', 'Chimie biologique', 'Quel type de liaison relie partiellement les molécules d’eau entre elles ?', 'Une liaison hydrogène', 'Les charges partielles de l’eau permettent des attractions entre molécules voisines.', 1, '2-the-chemical-level-of-organization'),
  row('ph-scale-acid', 'Chimie biologique', 'Une solution dont le pH est inférieur à 7 est-elle acide ou basique ?', 'Acide', 'Sur l’échelle usuelle du pH, les valeurs inférieures à 7 correspondent aux solutions acides.', 1, '2-the-chemical-level-of-organization'),
  row('atp-cell-energy', 'Cellule', 'Quelle molécule fournit directement de l’énergie utilisable par de nombreuses réactions cellulaires ?', 'L’ATP', 'L’hydrolyse de l’ATP libère de l’énergie et peut être couplée à des réactions cellulaires.', 1, '3-the-cellular-level-of-organization'),
  row('nucleus-genetic', 'Cellule', 'Quel compartiment contient la majeure partie de l’ADN d’une cellule eucaryote ?', 'Le noyau', 'Le noyau enferme les chromosomes dans une enveloppe nucléaire.', 1, '3-the-cellular-level-of-organization'),
  row('rough-er-function', 'Cellule', 'Quel organite porte des ribosomes et participe à la synthèse des protéines ?', 'Le réticulum endoplasmique rugueux', 'Les ribosomes associés au réticulum endoplasmique rugueux synthétisent des protéines destinées notamment à la sécrétion ou aux membranes.', 2, '3-the-cellular-level-of-organization'),
  row('epithelial-tissue', 'Tissus', 'Quel tissu recouvre les surfaces du corps et tapisse de nombreuses cavités ?', 'Le tissu épithélial', 'Les épithéliums forment des barrières et peuvent aussi assurer absorption ou sécrétion.', 1, '4-the-tissue-level-of-organization'),
  row('connective-tissue-matrix', 'Tissus', 'Quelle caractéristique distingue généralement le tissu conjonctif ?', 'Une matrice extracellulaire abondante', 'La matrice extracellulaire entoure les cellules conjonctives et contribue aux propriétés mécaniques du tissu.', 1, '4-the-tissue-level-of-organization'),
  row('cartilage-flexible', 'Tissus', 'Quel tissu conjonctif est ferme mais plus flexible que l’os ?', 'Le cartilage', 'Le cartilage possède une matrice spécialisée qui soutient les structures tout en restant relativement flexible.', 1, '4-the-tissue-level-of-organization'),
  row('skeletal-muscle-control', 'Tissus', 'Quel type de muscle est généralement sous contrôle volontaire ?', 'Le muscle squelettique', 'Les muscles squelettiques sont commandés par le système moteur somatique et déplacent le squelette.', 1, '4-the-tissue-level-of-organization'),
  row('epidermis-layer', 'Peau', 'Quelle est la couche la plus superficielle de la peau ?', 'L’épiderme', 'L’épiderme est un épithélium qui constitue la barrière externe de la peau.', 1, '5-the-integumentary-system'),
  row('dermis-location', 'Peau', 'Quelle couche de la peau se trouve sous l’épiderme ?', 'Le derme', 'Le derme contient notamment des vaisseaux, des nerfs, des follicules et des glandes.', 1, '5-the-integumentary-system'),
  row('melanin-function', 'Peau', 'Quel pigment contribue à la couleur de la peau et absorbe une partie des ultraviolets ?', 'La mélanine', 'La mélanine est produite par les mélanocytes et contribue à protéger les cellules contre certains rayonnements ultraviolets.', 1, '5-the-integumentary-system'),
  row('sweat-gland', 'Peau', 'Quelle glande produit la sueur ?', 'La glande sudoripare', 'Les glandes sudoripares libèrent leur sécrétion à la surface de la peau ou dans un follicule.', 1, '5-the-integumentary-system'),
  row('hair-follicle', 'Peau', 'Dans quelle structure un poil prend-il naissance ?', 'Le follicule pileux', 'Le follicule est une invagination de l’épiderme dans laquelle se développe le poil.', 1, '5-the-integumentary-system'),
  row('bone-osteocyte', 'Squelette', 'Comment appelle-t-on une cellule osseuse mature ?', 'Un ostéocyte', 'Les ostéocytes résident dans la matrice osseuse et participent à son entretien.', 1, '6-bone-and-skeletal-tissue'),
  row('bone-osteoblast', 'Squelette', 'Quelle cellule forme une nouvelle matrice osseuse ?', 'L’ostéoblaste', 'Les ostéoblastes synthétisent la matrice organique de l’os et participent à sa minéralisation.', 1, '6-bone-and-skeletal-tissue'),
  row('bone-osteoclast', 'Squelette', 'Quelle cellule résorbe la matrice osseuse ?', 'L’ostéoclaste', 'Les ostéoclastes dégradent la matrice osseuse lors du remodelage.', 1, '6-bone-and-skeletal-tissue'),
  row('compact-bone-osteon', 'Squelette', 'Quelle unité structurelle caractérise l’os compact ?', 'L’ostéon', 'Un ostéon est organisé autour d’un canal central contenant des vaisseaux et des nerfs.', 2, '6-bone-and-skeletal-tissue'),
  row('bone-marrow-red', 'Squelette', 'Quel tissu produit de nombreuses cellules sanguines chez l’adulte ?', 'La moelle osseuse rouge', 'La moelle rouge est le siège de l’hématopoïèse, c’est-à-dire la production des cellules du sang.', 1, '6-bone-and-skeletal-tissue'),
  row('axial-skeleton', 'Squelette', 'Quels éléments composent principalement le squelette axial ?', 'Le crâne, la colonne vertébrale et la cage thoracique', 'Le squelette axial forme l’axe central du corps.', 1, '7-axial-skeleton'),
  row('vertebral-column-regions', 'Squelette', 'Quelles sont les cinq régions de la colonne vertébrale ?', 'Cervicale, thoracique, lombaire, sacrée et coccygienne', 'Ces régions se succèdent de la tête vers l’extrémité inférieure de la colonne.', 2, '7-axial-skeleton'),
  row('rib-true-definition', 'Squelette', 'Comment appelle-t-on les côtes directement reliées au sternum par leur cartilage ?', 'Les vraies côtes', 'Les sept premières paires de côtes sont reliées directement au sternum.', 1, '7-axial-skeleton'),
  row('scapula-bone', 'Squelette', 'Quel os plat triangulaire se trouve à l’arrière de l’épaule ?', 'La scapula', 'La scapula, ou omoplate, relie le membre supérieur au squelette axial par l’intermédiaire de la clavicule.', 1, '8-the-appendicular-skeleton'),
  row('femur-location', 'Squelette', 'Quel est l’os de la cuisse ?', 'Le fémur', 'Le fémur s’étend de l’articulation de la hanche à celle du genou.', 1, '8-the-appendicular-skeleton'),
  row('patella-function', 'Squelette', 'Quel os protège la face antérieure de l’articulation du genou ?', 'La patella', 'La patella, ou rotule, est un os sésamoïde inclus dans le tendon du quadriceps.', 1, '8-the-appendicular-skeleton'),
  row('synovial-joint', 'Articulations', 'Quelle caractéristique possède une articulation synoviale ?', 'Une cavité articulaire contenant du liquide synovial', 'Le liquide synovial lubrifie les surfaces articulaires et réduit les frottements.', 1, '9-joints-and-skeletal-movement'),
  row('ligament-definition', 'Articulations', 'Que relie principalement un ligament ?', 'Un os à un autre os', 'Les ligaments stabilisent les articulations en reliant les os.', 1, '9-joints-and-skeletal-movement'),
  row('tendon-definition', 'Articulations', 'Que relie principalement un tendon ?', 'Un muscle à un os', 'La traction du muscle est transmise à l’os par le tendon.', 1, '9-joints-and-skeletal-movement'),
  row('flexion-joint', 'Articulations', 'Quel mouvement diminue l’angle entre deux segments corporels ?', 'La flexion', 'Plier le coude diminue l’angle entre le bras et l’avant-bras.', 1, '9-joints-and-skeletal-movement'),
  row('skeletal-muscle-fiber', 'Muscle', 'Comment appelle-t-on une cellule du muscle squelettique ?', 'Une fibre musculaire', 'Une fibre musculaire squelettique est une cellule longue contenant de nombreuses myofibrilles.', 1, '10-muscle-tissue'),
  row('sarcomere-unit', 'Muscle', 'Quelle est l’unité contractile de base d’une myofibrille ?', 'Le sarcomère', 'Le sarcomère est délimité par deux lignes Z et contient les filaments responsables du raccourcissement.', 1, '10-muscle-tissue'),
  row('actin-thin-filament', 'Muscle', 'Quelle protéine constitue principalement les filaments fins du muscle ?', 'L’actine', 'Les filaments fins contiennent de l’actine et des protéines régulatrices.', 1, '10-muscle-tissue'),
  row('myosin-thick-filament', 'Muscle', 'Quelle protéine constitue principalement les filaments épais du muscle ?', 'La myosine', 'Les têtes de myosine se lient à l’actine et utilisent l’ATP pendant la contraction.', 1, '10-muscle-tissue'),
  row('neuromuscular-junction', 'Muscle', 'Comment appelle-t-on la zone de communication entre un neurone moteur et une fibre musculaire ?', 'La jonction neuromusculaire', 'Elle transmet le signal du neurone moteur à la membrane de la fibre musculaire.', 1, '10-muscle-tissue'),
  row('sliding-filament', 'Muscle', 'Lors de la contraction, les filaments d’actine et de myosine glissent-ils l’un par rapport à l’autre ?', 'Oui', 'Le modèle des filaments glissants explique le raccourcissement du sarcomère sans raccourcissement des filaments eux-mêmes.', 1, '10-muscle-tissue'),
  row('muscle-origin-insertion', 'Muscle', 'Comment appelle-t-on l’attache d’un muscle qui reste généralement la plus fixe pendant sa contraction ?', 'L’origine', 'L’origine est souvent située sur l’os le moins mobile, tandis que l’insertion est sur l’os déplacé.', 2, '11-the-muscular-system'),
  row('prime-mover-definition', 'Muscle', 'Quel muscle est appelé agoniste dans un mouvement ?', 'Le muscle principal qui produit le mouvement', 'L’agoniste fournit la contribution principale à une action donnée.', 1, '11-the-muscular-system'),
  row('peripheral-nervous-system', 'Système nerveux', 'Que comprend le système nerveux périphérique ?', 'Les nerfs et les ganglions situés hors de l’encéphale et de la moelle épinière', 'Il relie le système nerveux central aux récepteurs et aux effecteurs du corps.', 1, '13-the-anatomy-of-the-nervous-system'),
  row('sympathetic-division', 'Système nerveux', 'Quelle division autonome prépare généralement l’organisme à une action intense ?', 'La division sympathique', 'La division sympathique augmente notamment l’état d’alerte et mobilise des ressources énergétiques.', 1, '15-the-autonomic-nervous-system'),
  row('parasympathetic-division', 'Système nerveux', 'Quelle division autonome favorise généralement le repos et la digestion ?', 'La division parasympathique', 'La division parasympathique soutient les fonctions de récupération et de digestion.', 1, '15-the-autonomic-nervous-system'),
  row('reflex-arc', 'Système nerveux', 'Comment appelle-t-on le circuit neuronal d’une réponse réflexe ?', 'L’arc réflexe', 'Un arc réflexe comprend un récepteur, des voies nerveuses et un effecteur.', 1, '13-the-anatomy-of-the-nervous-system'),
  row('cerebrum-function', 'Encéphale', 'Quelle partie de l’encéphale intervient fortement dans la perception consciente et la pensée ?', 'Le cerveau', 'Les hémisphères cérébraux du cerveau participent notamment aux fonctions conscientes et cognitives.', 1, '14-the-brain-and-cranial-nerves'),
  row('cerebellum-coordination', 'Encéphale', 'Quelle structure contribue à la coordination des mouvements et à l’équilibre ?', 'Le cervelet', 'Le cervelet compare les mouvements prévus et réalisés et aide à les ajuster.', 1, '14-the-brain-and-cranial-nerves'),
  row('brainstem-function', 'Encéphale', 'Quelle région relie l’encéphale à la moelle épinière et contient des centres vitaux ?', 'Le tronc cérébral', 'Le tronc cérébral comprend notamment le mésencéphale, le pont et le bulbe rachidien.', 1, '14-the-brain-and-cranial-nerves'),
  row('endocrine-gland', 'Endocrinologie', 'Comment appelle-t-on une glande qui libère ses hormones dans le sang ?', 'Une glande endocrine', 'Les glandes endocrines sont dépourvues de canal excréteur et sécrètent leurs hormones dans le milieu intérieur.', 1, '17-the-endocrine-system'),
  row('pituitary-gland', 'Endocrinologie', 'Quelle glande est souvent appelée la glande maîtresse en raison de ses nombreuses régulations hormonales ?', 'L’hypophyse', 'L’hypophyse sécrète des hormones qui contrôlent ou influencent plusieurs autres glandes endocrines.', 1, '17-the-endocrine-system'),
  row('thyroid-hormone', 'Endocrinologie', 'Quelle glande produit principalement les hormones thyroïdiennes ?', 'La thyroïde', 'La thyroïde produit notamment la T3 et la T4, qui influencent le métabolisme.', 1, '17-the-endocrine-system'),
  row('insulin-source', 'Endocrinologie', 'Quelles cellules du pancréas sécrètent l’insuline ?', 'Les cellules bêta des îlots pancréatiques', 'L’insuline est produite par les cellules bêta endocrines du pancréas.', 2, '17-the-endocrine-system'),
  row('blood-plasma', 'Sang', 'Quel est le composant liquide du sang ?', 'Le plasma', 'Le plasma transporte l’eau, les protéines, les solutés et les cellules sanguines.', 1, '18-the-cardiovascular-system-blood'),
  row('leukocyte-function', 'Sang', 'Quelle fonction générale les leucocytes assurent-ils ?', 'La défense immunitaire', 'Les leucocytes participent à la reconnaissance et à la défense contre des agents étrangers.', 1, '18-the-cardiovascular-system-blood'),
  row('platelet-role', 'Sang', 'Quel rôle les plaquettes jouent-elles principalement ?', 'Participer à l’hémostase', 'Les plaquettes s’agrègent et contribuent à former le clou plaquettaire lors d’une lésion vasculaire.', 1, '18-the-cardiovascular-system-blood'),
  row('hemoglobin-protein', 'Sang', 'Quelle protéine des globules rouges fixe réversiblement l’oxygène ?', 'L’hémoglobine', 'L’hémoglobine contient des groupes hème capables de fixer l’oxygène.', 1, '18-the-cardiovascular-system-blood'),
  row('heart-four-chambers', 'Cœur', 'Combien de cavités principales le cœur humain possède-t-il ?', 'Quatre', 'Le cœur comprend deux atriums et deux ventricules.', 1, '19-the-cardiovascular-system-the-heart'),
  row('right-ventricle', 'Cœur', 'Vers quels vaisseaux le ventricule droit éjecte-t-il le sang ?', 'Vers le tronc pulmonaire', 'Le ventricule droit envoie le sang désoxygéné vers les poumons par la circulation pulmonaire.', 1, '19-the-cardiovascular-system-the-heart'),
  row('left-ventricle', 'Cœur', 'Quelle cavité éjecte le sang dans l’aorte ?', 'Le ventricule gauche', 'Le ventricule gauche propulse le sang dans la circulation systémique.', 1, '19-the-cardiovascular-system-the-heart'),
  row('mitral-valve', 'Cœur', 'Quelle valve se trouve entre l’atrium gauche et le ventricule gauche ?', 'La valve mitrale', 'La valve mitrale empêche le reflux du ventricule gauche vers l’atrium gauche pendant la contraction.', 1, '19-the-cardiovascular-system-the-heart'),
  row('systole-definition', 'Cœur', 'Comment appelle-t-on la phase de contraction du cycle cardiaque ?', 'La systole', 'Pendant la systole, une chambre cardiaque se contracte et éjecte ou propulse le sang.', 1, '19-the-cardiovascular-system-the-heart'),
  row('capillary-exchange', 'Vaisseaux', 'Dans quels vaisseaux les échanges entre le sang et les tissus sont-ils les plus importants ?', 'Les capillaires', 'Leurs parois très fines permettent les échanges de gaz, solutés et déchets avec le liquide interstitiel.', 1, '20-blood-vessels-and-circulation'),
  row('blood-pressure-definition', 'Vaisseaux', 'Que mesure la pression artérielle ?', 'La force exercée par le sang sur les parois des artères', 'La pression artérielle varie notamment avec le débit cardiaque et la résistance vasculaire.', 1, '20-blood-vessels-and-circulation'),
  row('lymph-function', 'Immunité', 'Quel liquide circule dans les vaisseaux lymphatiques ?', 'La lymphe', 'La lymphe provient du liquide interstitiel récupéré et retourne progressivement vers le sang.', 1, '21-the-lymphatic-and-immune-system'),
  row('lymph-node-function', 'Immunité', 'Quel organe lymphatique filtre la lymphe et abrite des cellules immunitaires ?', 'Le ganglion lymphatique', 'Les ganglions filtrent la lymphe et favorisent les rencontres entre antigènes et cellules immunitaires.', 1, '21-the-lymphatic-and-immune-system'),
  row('spleen-function', 'Immunité', 'Quel organe filtre le sang et participe aux réponses immunitaires ?', 'La rate', 'La rate élimine notamment des cellules sanguines âgées et participe à la surveillance immunitaire du sang.', 1, '21-the-lymphatic-and-immune-system'),
  row('trachea-function', 'Respiration', 'Quel conduit relie le larynx aux bronches ?', 'La trachée', 'La trachée conduit l’air vers les bronches et est maintenue ouverte par des anneaux cartilagineux.', 1, '22-the-respiratory-system'),
  row('oxygen-transport', 'Respiration', 'Sous quelle forme l’oxygène est-il principalement transporté dans le sang ?', 'Lié à l’hémoglobine', 'La majorité de l’oxygène sanguin est transportée par l’hémoglobine des érythrocytes.', 1, '22-the-respiratory-system'),
  row('digestive-tract-order', 'Digestion', 'Quel organe reçoit directement les aliments après le pharynx ?', 'L’œsophage', 'L’œsophage conduit le bol alimentaire vers l’estomac par des contractions péristaltiques.', 1, '23-the-digestive-system'),
  row('stomach-function', 'Digestion', 'Quel organe mélange les aliments avec des sécrétions acides ?', 'L’estomac', 'L’estomac stocke et brasse les aliments et commence notamment la digestion des protéines.', 1, '23-the-digestive-system'),
  row('small-intestine-absorption', 'Digestion', 'Dans quel organe se fait la majeure partie de l’absorption des nutriments ?', 'L’intestin grêle', 'Sa longueur et ses replis augmentent fortement la surface disponible pour l’absorption.', 1, '23-the-digestive-system'),
  row('pancreas-digestive', 'Digestion', 'Quel organe sécrète des enzymes digestives dans l’intestin grêle ?', 'Le pancréas', 'Le pancréas exocrine libère des enzymes et du bicarbonate dans le duodénum.', 1, '23-the-digestive-system'),
  row('nephron-unit', 'Urinaire', 'Quelle est l’unité fonctionnelle du rein ?', 'Le néphron', 'Chaque néphron filtre le sang et transforme le filtrat en urine par plusieurs étapes.', 1, '25-the-urinary-system'),
  row('glomerulus-filter', 'Urinaire', 'Dans quelle structure du néphron le sang est-il initialement filtré ?', 'Le glomérule', 'Le glomérule est un réseau capillaire contenu dans la capsule glomérulaire.', 1, '25-the-urinary-system'),
  row('kidney-homeostasis', 'Urinaire', 'Quelle fonction générale des reins contribue à l’homéostasie ?', 'Réguler la composition des liquides corporels', 'Les reins ajustent notamment l’eau, les électrolytes et l’élimination de déchets dans l’urine.', 1, '25-the-urinary-system'),
  row('urine-ureter', 'Urinaire', 'Quel conduit transporte l’urine d’un rein vers la vessie ?', 'L’uretère', 'Chaque rein est relié à la vessie par un uretère.', 1, '25-the-urinary-system'),
  row('ovary-function', 'Reproduction', 'Quelle structure produit les ovocytes et sécrète des hormones sexuelles chez la femme ?', 'L’ovaire', 'Les ovaires sont les gonades féminines et produisent notamment des œstrogènes et de la progestérone.', 1, '27-the-reproductive-system'),
  row('testis-function', 'Reproduction', 'Quelle structure produit les spermatozoïdes chez l’homme ?', 'Le testicule', 'Les testicules sont les gonades masculines et assurent la spermatogenèse.', 1, '27-the-reproductive-system'),
  row('uterus-function', 'Reproduction', 'Dans quel organe l’embryon s’implante-t-il et se développe-t-il pendant la grossesse ?', 'L’utérus', 'La muqueuse utérine peut accueillir l’implantation et soutenir le développement embryonnaire.', 1, '27-the-reproductive-system'),
  row('fertilization-location', 'Reproduction', 'Où la fécondation humaine a-t-elle généralement lieu ?', 'Dans la trompe utérine', 'La rencontre des gamètes se produit habituellement dans la trompe utérine avant l’arrivée de l’embryon dans l’utérus.', 2, '27-the-reproductive-system'),
  row('thoracic-cavity', 'Fondamentaux', 'Quelle cavité corporelle contient principalement les poumons et le cœur ?', 'La cavité thoracique', 'La cavité thoracique est délimitée notamment par la cage thoracique et séparée de l’abdomen par le diaphragme.', 1, '1-introduction'),
  row('serous-membrane', 'Fondamentaux', 'Comment appelle-t-on une membrane qui tapisse une cavité fermée et recouvre les organes qu’elle contient ?', 'Une membrane séreuse', 'Les membranes séreuses produisent un liquide qui réduit les frottements entre leurs feuillets.', 2, '1-introduction'),
  row('cellular-respiration', 'Cellule', 'Quel processus cellulaire extrait de l’énergie des molécules organiques pour produire de l’ATP ?', 'La respiration cellulaire', 'La respiration cellulaire comprend des réactions d’oxydation qui transfèrent l’énergie vers l’ATP.', 1, '3-the-cellular-level-of-organization'),
  row('tight-junction', 'Tissus', 'Quel type de jonction cellulaire limite le passage entre des cellules épithéliales voisines ?', 'La jonction serrée', 'Les jonctions serrées forment une barrière entre les cellules d’un épithélium.', 2, '4-the-tissue-level-of-organization'),
  row('bone-calcium-storage', 'Squelette', 'Quel minéral est largement stocké dans la matrice osseuse ?', 'Le calcium', 'La matrice minéralisée de l’os constitue une réserve importante de calcium pour l’organisme.', 1, '6-bone-and-skeletal-tissue'),
  row('cardiac-muscle', 'Muscle', 'Quel type de muscle forme la paroi du cœur ?', 'Le muscle cardiaque', 'Le muscle cardiaque est strié et possède des cellules spécialisées reliées par des disques intercalaires.', 1, '10-muscle-tissue'),
  row('action-potential', 'Système nerveux', 'Comment appelle-t-on la variation rapide du potentiel électrique qui se propage le long d’un axone ?', 'Le potentiel d’action', 'Le potentiel d’action est un signal tout-ou-rien déclenché lorsque le seuil est atteint.', 1, '12-nervous-tissue'),
  row('pulmonary-circuit', 'Cœur', 'Quel circuit transporte le sang du ventricule droit vers les poumons puis vers l’atrium gauche ?', 'La circulation pulmonaire', 'La circulation pulmonaire permet les échanges gazeux avant le retour du sang au cœur gauche.', 1, '19-the-cardiovascular-system-the-heart'),
  row('bicarbonate-pancreas', 'Digestion', 'Quelle substance alcaline sécrétée par le pancréas aide à neutraliser l’acidité du chyme ?', 'Le bicarbonate', 'Le bicarbonate pancréatique contribue à élever le pH du contenu qui entre dans le duodénum.', 2, '23-the-digestive-system'),
  row('bladder-storage', 'Urinaire', 'Quel organe stocke temporairement l’urine avant sa miction ?', 'La vessie', 'La vessie est un réservoir musculaire qui se remplit avant la vidange urinaire.', 1, '25-the-urinary-system'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/anatomy-and-physiology-2e/pages/${chapter}`;

const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_ANATOMY_QUESTIONS: Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-anatomy-openstax-${id}`;
  return {
    id: `anatomy-openstax-${id}`,
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
    tags: ['anatomie', 'physiologie', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_ANATOMY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-anatomy-and-physiology-2e-facts',
  questions: VERIFIED_ANATOMY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent claims against the cited chapter; no generated variants',
  status: 'approved',
};

export default VERIFIED_ANATOMY_OPENSTAX_BATCH;
