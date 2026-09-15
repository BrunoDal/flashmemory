import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Stable literary concepts reviewed against the openly licensed Lumen
 * Introduction to Literature collection on Humanities LibreTexts.  This
 * module contains one claim per card; it does not create wording variants.
 * The collection is marked Public Domain by LibreTexts.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'Introduction to Literature (Lumen), Humanities LibreTexts';
const LICENSE = 'Public Domain (LibreTexts metadata)';
const METHOD = 'manual editorial check against the cited LibreTexts chapter; one independent concept per card; no quotations';
const BOOK = 'https://human.libretexts.org/Bookshelves/Literature_and_Literacy/World_Literature/Introduction_to_Literature_(Lumen)';
const CHAPTERS = {
  genre: `${BOOK}/01%3A_Genre_Introduction`,
  pov: `${BOOK}/02%3A_Literary_Conventions/2.1%3A_Point_of_View`,
  terms: `${BOOK}/02%3A_Literary_Conventions/2.3%3A_Literary_Terms`,
  style: `${BOOK}/02%3A_Literary_Conventions/2.5%3A_The_Rough_Guide_to_Literary_Style%2C_a_Historical_Overview`,
  theme: `${BOOK}/02%3A_Literary_Conventions/2.6%3A_Theme`,
  conflict: `${BOOK}/02%3A_Literary_Conventions/2.7%3A_Conflict`,
  symbols: `${BOOK}/02%3A_Literary_Conventions/2.8%3A_Symbols_in_Literature`,
  characters: `${BOOK}/02%3A_Literary_Conventions/2.10%3A_Characters_and_Characterization`,
  metaphor: `${BOOK}/02%3A_Literary_Conventions/2.11%3A_Metaphor`,
} as const;

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: keyof typeof CHAPTERS];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('literature-oer-fiction', 'Genres', 'Qu’est-ce que la fiction ?', 'Une forme littéraire qui invente ou imagine des événements et des personnages', 'La fiction peut s’inspirer du réel sans prétendre rapporter tous ses événements comme des faits.', 1, 'genre'),
  row('literature-oer-nonfiction', 'Genres', 'Qu’est-ce que la non-fiction ?', 'Une écriture qui traite de faits, d’idées ou d’expériences présentés comme réels', 'La non-fiction peut employer des procédés littéraires tout en se référant au monde réel.', 1, 'genre'),
  row('literature-oer-novel', 'Genres', 'Qu’est-ce qu’un roman ?', 'Une œuvre narrative généralement longue, le plus souvent en prose', 'Le roman peut développer plusieurs personnages, intrigues et temporalités.', 1, 'genre'),
  row('literature-oer-short-story', 'Genres', 'Qu’est-ce qu’une nouvelle ?', 'Un récit de fiction bref', 'Sa brièveté conduit souvent à une intrigue et un nombre de personnages plus resserrés.', 1, 'genre'),
  row('literature-oer-drama', 'Genres', 'Qu’est-ce que le drame au sens littéraire ?', 'Une œuvre destinée à être représentée par des acteurs', 'Le texte dramatique organise notamment des dialogues, des actions et des indications scéniques.', 1, 'genre'),
  row('literature-oer-poetry', 'Genres', 'Qu’est-ce qui caractérise la poésie ?', 'Un usage esthétique et rythmé du langage', 'La poésie peut produire du sens par le rythme, les sons, les images et la disposition des mots.', 1, 'genre'),
  row('literature-oer-creative-nonfiction', 'Genres', 'Que désigne la non-fiction créative ?', 'Une écriture fondée sur des faits mais organisée avec des procédés littéraires', 'Elle peut raconter une expérience ou une enquête avec une attention particulière à la forme.', 2, 'genre'),
  row('literature-oer-genre', 'Genres', 'Qu’est-ce qu’un genre littéraire ?', 'Une catégorie de textes partageant des formes ou des conventions', 'Les genres donnent des attentes de lecture, mais leurs frontières restent perméables.', 1, 'genre'),
  row('literature-oer-form', 'Genres', 'Que désigne la forme d’une œuvre ?', 'La manière dont ses éléments sont organisés', 'La forme comprend notamment la structure, le langage, le rythme et le point de vue.', 1, 'genre'),
  row('literature-oer-literary-merit', 'Définitions', 'Que signifie l’expression « mérite littéraire » ?', 'Une appréciation de qualités esthétiques ou formelles attribuées à une œuvre', 'La notion est évaluative et dépend des traditions et des lecteurs, plutôt qu’une mesure universelle.', 2, 'genre'),

  row('literature-oer-first-person', 'Narration', 'Qu’est-ce qu’un récit à la première personne ?', 'Un récit raconté par un narrateur qui emploie « je »', 'Le narrateur raconte depuis sa propre position et ne donne pas automatiquement accès à tous les faits.', 1, 'pov'),
  row('literature-oer-third-person', 'Narration', 'Qu’est-ce qu’un récit à la troisième personne ?', 'Un récit raconté avec des pronoms comme « il » ou « elle »', 'La troisième personne peut être omnisciente, limitée ou objective.', 1, 'pov'),
  row('literature-oer-second-person', 'Narration', 'Qu’est-ce qu’un récit à la deuxième personne ?', 'Un récit qui s’adresse au personnage ou au lecteur avec « tu » ou « vous »', 'Ce dispositif est moins courant et crée une relation directe avec la personne désignée.', 2, 'pov'),
  row('literature-oer-reliable-narrator', 'Narration', 'Qu’est-ce qu’un narrateur fiable ?', 'Un narrateur dont le récit est présenté comme digne de confiance', 'La fiabilité est une relation de lecture construite par la cohérence et les indices du texte.', 2, 'pov'),
  row('literature-oer-unreliable-narrator', 'Narration', 'Qu’est-ce qu’un narrateur non fiable ?', 'Un narrateur dont le récit comporte des limites ou des distorsions repérables', 'Le lecteur doit alors évaluer l’écart entre le récit et les indices fournis par l’œuvre.', 2, 'pov'),
  row('literature-oer-omniscient-narrator', 'Narration', 'Que sait un narrateur omniscient ?', 'Il peut connaître les pensées et les actions de plusieurs personnages', 'Son savoir dépasse le point de vue d’un seul personnage.', 1, 'pov'),
  row('literature-oer-limited-narrator', 'Narration', 'Que caractérise un narrateur à focalisation limitée ?', 'L’accès privilégié à l’expérience d’un personnage ou d’un groupe restreint', 'Les informations narratives sont filtrées par une perspective particulière.', 2, 'pov'),
  row('literature-oer-objective-narrator', 'Narration', 'Que caractérise un narrateur objectif ?', 'Une présentation détachée qui laisse surtout les actions et paroles produire leur effet', 'Ce type de narration limite les commentaires explicites et l’accès direct aux pensées.', 2, 'pov'),
  row('literature-oer-narrator', 'Narration', 'Qu’est-ce qu’un narrateur ?', 'La voix ou l’instance qui raconte une histoire', 'Le narrateur ne doit pas être confondu automatiquement avec l’auteur réel.', 1, 'pov'),
  row('literature-oer-narrative-perspective', 'Narration', 'Que désigne la perspective narrative ?', 'La position à partir de laquelle une histoire est perçue et racontée', 'Elle détermine notamment quelles informations le lecteur reçoit et comment il les reçoit.', 1, 'pov'),
  row('literature-oer-pov-shift', 'Narration', 'Un point de vue narratif peut-il changer au cours d’un récit ?', 'Oui', 'Un texte peut passer d’une perspective de personnage à une autre ou à celle d’un narrateur plus large.', 1, 'pov'),

  row('literature-oer-allegory', 'Procédés', 'Qu’est-ce qu’une allégorie ?', 'Un récit ou une représentation dont les éléments renvoient à des idées plus générales', 'Les personnages, actions ou lieux peuvent fonctionner à la fois dans le récit et comme figures d’une idée.', 2, 'terms'),
  row('literature-oer-allusion', 'Procédés', 'Qu’est-ce qu’une allusion ?', 'Une référence indirecte à une personne, une œuvre, un événement ou une idée', 'L’allusion suppose souvent que le lecteur reconnaisse la référence pour en saisir l’effet.', 2, 'terms'),
  row('literature-oer-analogy', 'Procédés', 'Qu’est-ce qu’une analogie ?', 'Une comparaison fondée sur une relation de ressemblance entre deux domaines', 'Elle aide à éclairer une idée en la rapprochant d’une autre relation connue.', 1, 'terms'),
  row('literature-oer-ambiguity', 'Procédés', 'Que désigne l’ambiguïté littéraire ?', 'La possibilité qu’un passage comporte plusieurs interprétations plausibles', 'L’ambiguïté peut être produite par le langage, la situation ou l’absence d’information.', 2, 'terms'),
  row('literature-oer-anachronism', 'Procédés', 'Qu’est-ce qu’un anachronisme ?', 'La présence d’un élément dans une époque où il n’existe pas ou ne correspond pas', 'L’anachronisme peut être une erreur, mais aussi un choix artistique délibéré.', 2, 'terms'),
  row('literature-oer-archetype', 'Procédés', 'Qu’est-ce qu’un archétype narratif ?', 'Un modèle récurrent de personnage, de situation ou de motif', 'Les archétypes sont reconnaissables tout en pouvant être transformés par chaque œuvre.', 2, 'terms'),
  row('literature-oer-assonance', 'Poésie', 'Qu’est-ce que l’assonance ?', 'La répétition d’un son vocalique', 'Elle produit un effet sonore sans exiger la répétition de consonnes identiques.', 2, 'terms'),
  row('literature-oer-consonance', 'Poésie', 'Qu’est-ce que la consonance ?', 'La répétition de sons consonantiques', 'La consonance est un procédé sonore distinct de la répétition des voyelles.', 2, 'terms'),
  row('literature-oer-alliteration', 'Poésie', 'Qu’est-ce qu’une allitération ?', 'La répétition d’un même son consonantique, souvent au début de mots proches', 'Elle peut créer un rythme ou attirer l’attention sur une séquence de mots.', 1, 'terms'),
  row('literature-oer-euphemism', 'Procédés', 'Qu’est-ce qu’un euphémisme ?', 'Une expression atténuée qui remplace une formulation jugée plus directe ou pénible', 'L’euphémisme modifie la force ou la tonalité d’une énonciation.', 1, 'terms'),
  row('literature-oer-hyperbole', 'Procédés', 'Qu’est-ce qu’une hyperbole ?', 'Une exagération destinée à produire un effet', 'Elle amplifie un trait ou une situation sans être comprise comme une mesure littérale.', 1, 'terms'),
  row('literature-oer-irony', 'Procédés', 'Qu’est-ce que l’ironie ?', 'Un procédé où le sens communiqué diffère du sens littéral ou attendu', 'Le contexte et le ton permettent souvent de percevoir cet écart.', 2, 'terms'),
  row('literature-oer-litotes', 'Procédés', 'Qu’est-ce qu’une litote ?', 'Une formulation atténuée qui suggère souvent davantage que ce qui est dit', 'La litote s’appuie sur une retenue expressive et sur l’inférence du lecteur.', 2, 'terms'),
  row('literature-oer-metonymy', 'Procédés', 'Qu’est-ce qu’une métonymie ?', 'Une désignation par un terme lié au terme attendu', 'Le lien peut être spatial, causal, matériel ou institutionnel.', 2, 'terms'),
  row('literature-oer-oxymoron', 'Procédés', 'Qu’est-ce qu’un oxymore ?', 'Une association condensée de termes apparemment contradictoires', 'La tension entre les termes crée une expression frappante.', 1, 'terms'),
  row('literature-oer-paradox', 'Procédés', 'Qu’est-ce qu’un paradoxe ?', 'Une affirmation qui semble contradictoire mais peut révéler une idée cohérente', 'Le paradoxe invite à dépasser une lecture immédiate.', 1, 'terms'),
  row('literature-oer-personification', 'Procédés', 'Qu’est-ce qu’une personnification ?', 'L’attribution de traits ou d’actions humaines à une chose non humaine', 'Elle rend une idée, un objet ou un phénomène plus concret dans le texte.', 1, 'terms'),
  row('literature-oer-simile', 'Procédés', 'Qu’est-ce qu’une comparaison ?', 'Un rapprochement explicite entre deux éléments au moyen d’un outil comparatif', 'Elle se distingue de la métaphore par la présence d’un marqueur de comparaison.', 1, 'terms'),
  row('literature-oer-metaphor-definition', 'Procédés', 'Qu’est-ce qu’une métaphore ?', 'Une comparaison implicite qui présente un élément comme un autre', 'La métaphore rapproche des domaines pour produire une image ou une compréhension nouvelle.', 1, 'metaphor'),
  row('literature-oer-symbol', 'Procédés', 'Qu’est-ce qu’un symbole en littérature ?', 'Un élément qui possède un sens au-delà de lui-même', 'Le sens symbolique dépend du contexte de l’œuvre et de l’interprétation.', 1, 'symbols'),
  row('literature-oer-symbol-context', 'Procédés', 'De quoi dépend notamment l’interprétation d’un symbole ?', 'Du contexte et de la culture', 'Un même élément peut prendre des significations différentes selon l’œuvre et ses lecteurs.', 1, 'symbols'),

  row('literature-oer-plot', 'Structure', 'Qu’est-ce que l’intrigue ?', 'Le déroulement organisé des événements d’un récit', 'L’intrigue sélectionne et ordonne les actions qui composent la situation dramatique.', 1, 'terms'),
  row('literature-oer-exposition', 'Structure', 'Que fait l’exposition d’un récit ?', 'Elle présente le contexte, les personnages ou la situation initiale', 'Elle fournit les informations nécessaires pour entrer dans l’action.', 1, 'terms'),
  row('literature-oer-rising-action', 'Structure', 'Que désigne la montée de l’action ?', 'La progression des complications et de la tension vers un point culminant', 'Les obstacles et enjeux deviennent généralement plus importants.', 2, 'terms'),
  row('literature-oer-climax', 'Structure', 'Qu’est-ce que le point culminant ?', 'Le moment de tension ou de décision le plus intense d’un récit', 'Il constitue souvent un tournant majeur pour l’intrigue.', 1, 'terms'),
  row('literature-oer-falling-action', 'Structure', 'Que désigne la retombée de l’action ?', 'La partie qui suit le point culminant et montre ses conséquences', 'Elle conduit fréquemment vers le dénouement.', 2, 'terms'),
  row('literature-oer-resolution', 'Structure', 'Qu’est-ce que le dénouement ?', 'La partie où les principales tensions de l’intrigue trouvent une issue', 'Le dénouement peut résoudre les conflits ou laisser certaines questions ouvertes.', 1, 'terms'),
  row('literature-oer-chronological-order', 'Structure', 'Que signifie raconter des événements dans l’ordre chronologique ?', 'Les présenter selon l’ordre où ils se produisent dans le temps', 'Cet ordre suit la succession temporelle de l’histoire racontée.', 1, 'terms'),
  row('literature-oer-flashback', 'Structure', 'Qu’est-ce qu’un retour en arrière ?', 'Une narration qui revient à un événement antérieur', 'Le retour en arrière interrompt l’ordre présent du récit pour apporter une information passée.', 1, 'terms'),
  row('literature-oer-foreshadowing', 'Structure', 'Qu’est-ce qu’une anticipation narrative ?', 'Un indice ou une annonce qui prépare un événement ultérieur', 'Elle peut créer une attente ou une ironie dramatique.', 2, 'terms'),
  row('literature-oer-frame-narrative', 'Structure', 'Qu’est-ce qu’un récit-cadre ?', 'Un récit qui contient ou encadre un autre récit', 'Le cadre peut fournir la situation de narration et relier plusieurs histoires.', 2, 'terms'),
  row('literature-oer-subplot', 'Structure', 'Qu’est-ce qu’une intrigue secondaire ?', 'Une ligne d’action distincte qui accompagne l’intrigue principale', 'Elle peut éclairer le thème ou croiser l’action principale.', 1, 'terms'),
  row('literature-oer-setting', 'Structure', 'Que désigne le cadre spatio-temporel ?', 'Le lieu et le moment où se déroule l’action', 'Le cadre influence les possibilités d’action et l’atmosphère du récit.', 1, 'terms'),
  row('literature-oer-pacing', 'Structure', 'Que désigne le rythme narratif ?', 'La vitesse à laquelle le récit présente les événements', 'Le rythme peut varier par la longueur des scènes, des descriptions et des ellipses.', 2, 'terms'),
  row('literature-oer-foreshadowing-suspense', 'Structure', 'Quel effet un indice préparatoire peut-il produire ?', 'De l’attente ou du suspense', 'Le lecteur anticipe un événement sans nécessairement en connaître l’issue.', 1, 'terms'),
  row('literature-oer-theme', 'Interprétation', 'Qu’est-ce qu’un thème ?', 'Une idée centrale explorée par une œuvre', 'Le thème est plus général qu’un simple sujet et se construit à travers les motifs et les événements.', 1, 'theme'),
  row('literature-oer-motif', 'Interprétation', 'Qu’est-ce qu’un motif littéraire ?', 'Un élément récurrent qui contribue à développer un thème', 'Un motif peut être une image, une situation, un objet ou une action répétée.', 1, 'theme'),
  row('literature-oer-theme-universal', 'Interprétation', 'Comment un thème peut-il dépasser l’intrigue particulière ?', 'En faisant émerger une idée sur l’expérience humaine ou la société', 'Une histoire située peut ainsi susciter une réflexion plus générale.', 2, 'theme'),
  row('literature-oer-theme-inference', 'Interprétation', 'Comment le lecteur repère-t-il souvent un thème ?', 'En reliant des éléments narratifs ou des motifs répétés', 'L’interprétation s’appuie sur des indices du texte plutôt que sur une seule phrase isolée.', 1, 'theme'),
  row('literature-oer-theme-moral', 'Interprétation', 'Un thème littéraire est-il toujours une morale explicite ?', 'Non', 'Une œuvre peut explorer une idée sans donner une leçon formulée directement.', 1, 'theme'),

  row('literature-oer-external-conflict', 'Conflit', 'Qu’est-ce qu’un conflit externe ?', 'Un affrontement entre un personnage et une force extérieure', 'La force peut être un autre personnage, la société, la nature ou une circonstance.', 1, 'conflict'),
  row('literature-oer-internal-conflict', 'Conflit', 'Qu’est-ce qu’un conflit interne ?', 'Une lutte psychologique au sein d’un personnage', 'Le personnage peut hésiter entre des désirs, des valeurs ou des décisions incompatibles.', 1, 'conflict'),
  row('literature-oer-character-vs-character', 'Conflit', 'Quel type de conflit oppose deux personnages ?', 'Un conflit personnage contre personnage', 'Les objectifs ou les intérêts des deux personnages entrent directement en opposition.', 1, 'conflict'),
  row('literature-oer-character-vs-society', 'Conflit', 'Quel type de conflit oppose un personnage aux normes collectives ?', 'Un conflit personnage contre société', 'L’affrontement porte sur les règles, valeurs ou institutions du groupe.', 1, 'conflict'),
  row('literature-oer-character-vs-nature', 'Conflit', 'Quel type de conflit oppose un personnage à un environnement naturel ?', 'Un conflit personnage contre nature', 'La nature devient une force qui entrave, menace ou met à l’épreuve le personnage.', 1, 'conflict'),
  row('literature-oer-conflict-tension', 'Conflit', 'Quel rôle le conflit joue-t-il souvent dans un récit ?', 'Il crée une tension qui fait progresser l’action', 'Les obstacles donnent aux personnages des décisions et des enjeux à affronter.', 1, 'conflict'),
  row('literature-oer-conflict-external-internal', 'Conflit', 'Un récit peut-il associer conflit externe et conflit interne ?', 'Oui', 'Un obstacle extérieur peut provoquer ou révéler une lutte intérieure.', 1, 'conflict'),
  row('literature-oer-character', 'Personnages', 'Qu’est-ce qu’un personnage ?', 'Une figure qui participe à l’action ou à la situation d’une œuvre', 'Un personnage peut être humain, animal, surnaturel ou personnifié.', 1, 'characters'),
  row('literature-oer-protagonist', 'Personnages', 'Qu’est-ce qu’un protagoniste ?', 'Le personnage principal d’un récit', 'L’intrigue est généralement organisée autour de ses objectifs ou de son expérience.', 1, 'characters'),
  row('literature-oer-antagonist', 'Personnages', 'Qu’est-ce qu’un antagoniste ?', 'Une force ou un personnage qui s’oppose au protagoniste', 'L’antagoniste n’est pas forcément moralement mauvais ; il remplit une fonction d’opposition.', 1, 'characters'),
  row('literature-oer-foil', 'Personnages', 'Qu’est-ce qu’un faire-valoir ?', 'Un personnage dont le contraste avec un autre fait ressortir des traits', 'Le contraste peut concerner les valeurs, les comportements ou la situation.', 2, 'characters'),
  row('literature-oer-flat-character', 'Personnages', 'Qu’est-ce qu’un personnage plat ?', 'Un personnage construit autour d’un nombre limité de traits', 'Il peut rester relativement constant au cours du récit.', 1, 'characters'),
  row('literature-oer-round-character', 'Personnages', 'Qu’est-ce qu’un personnage complexe ?', 'Un personnage présentant plusieurs dimensions et des traits parfois contradictoires', 'Sa complexité donne une impression de profondeur et de variété psychologique.', 1, 'characters'),
  row('literature-oer-static-character', 'Personnages', 'Qu’est-ce qu’un personnage statique ?', 'Un personnage qui change peu au cours du récit', 'Sa stabilité peut servir de contraste avec l’évolution d’un autre personnage.', 1, 'characters'),
  row('literature-oer-dynamic-character', 'Personnages', 'Qu’est-ce qu’un personnage dynamique ?', 'Un personnage qui évolue de manière importante au cours du récit', 'L’évolution peut concerner ses croyances, ses choix ou sa compréhension de la situation.', 1, 'characters'),
  row('literature-oer-characterization-direct', 'Personnages', 'Qu’est-ce que la caractérisation directe ?', 'La présentation explicite des traits d’un personnage par le narrateur', 'Le texte peut nommer directement une qualité, une apparence ou une attitude.', 2, 'characters'),
  row('literature-oer-characterization-indirect', 'Personnages', 'Qu’est-ce que la caractérisation indirecte ?', 'La présentation des traits d’un personnage par ses actes, paroles ou relations', 'Le lecteur infère alors les caractéristiques à partir d’indices narratifs.', 2, 'characters'),
  row('literature-oer-character-motivation', 'Personnages', 'Que désigne la motivation d’un personnage ?', 'La raison ou le désir qui orientent ses actions', 'Les motivations expliquent les choix et contribuent à construire le conflit.', 1, 'characters'),

  row('literature-oer-tone', 'Style', 'Que désigne le ton d’un texte ?', 'L’attitude ou la tonalité que le texte fait entendre', 'Le ton peut être notamment comique, sérieux, ironique ou tragique.', 1, 'style'),
  row('literature-oer-mood', 'Style', 'Que désigne l’atmosphère d’un texte ?', 'L’impression émotionnelle produite chez le lecteur', 'L’atmosphère est construite par le cadre, les images, le rythme et le choix des mots.', 1, 'style'),
  row('literature-oer-diction', 'Style', 'Que désigne la diction en analyse littéraire ?', 'Le choix et l’usage des mots', 'La diction contribue au registre, au ton et à la caractérisation d’une voix.', 2, 'style'),
  row('literature-oer-syntax', 'Style', 'Que désigne la syntaxe ?', 'La manière dont les mots et les propositions sont agencés', 'La longueur et la structure des phrases peuvent modifier le rythme et l’effet du texte.', 1, 'style'),
  row('literature-oer-register', 'Style', 'Qu’est-ce qu’un registre de langue ?', 'Un niveau de langue associé à un contexte ou à un effet social', 'Le registre peut être soutenu, courant, familier ou spécialisé selon la situation.', 1, 'style'),
  row('literature-oer-imagery', 'Style', 'Que désigne l’imagerie littéraire ?', 'L’ensemble des images et des descriptions qui sollicitent les sens ou l’imagination', 'Elle rend des idées ou des scènes plus concrètes pour le lecteur.', 1, 'style'),
  row('literature-oer-figurative-language', 'Style', 'Qu’est-ce que le langage figuré ?', 'Un usage du langage qui produit un sens non strictement littéral', 'Les métaphores, comparaisons et personnifications sont des formes de langage figuré.', 1, 'style'),
  row('literature-oer-literal-language', 'Style', 'Qu’est-ce que le langage littéral ?', 'Un usage des mots dans leur sens direct ou conventionnel', 'Il se distingue du langage figuré, qui invite à interpréter un rapprochement ou une image.', 1, 'style'),
  row('literature-oer-rhythm-prose', 'Style', 'De quoi le rythme de la prose peut-il dépendre ?', 'De la longueur des phrases, des répétitions et de la ponctuation', 'Ces éléments organisent la vitesse et les accents de la lecture.', 2, 'style'),
  row('literature-oer-literary-style', 'Style', 'Qu’est-ce que le style littéraire ?', 'La manière particulière dont une œuvre emploie le langage et organise sa forme', 'Le style se manifeste par le vocabulaire, la syntaxe, les images et la structure.', 1, 'style'),
  row('literature-oer-historical-style', 'Style', 'Le style littéraire peut-il varier selon les périodes historiques ?', 'Oui', 'Les conventions de langue, de forme et de goût changent avec les contextes historiques.', 1, 'style'),
];

const provenance = (factId: string, chapter: keyof typeof CHAPTERS): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: CHAPTERS[chapter],
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_LITERATURE_LIBRETEXTS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-literature-libretexts-${id}`;
  return {
    id: `literature-libretexts-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Littérature',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['littérature', 'oer', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_LITERATURE_LIBRETEXTS_BATCH: VerifiedContentBatch = {
  id: 'libretexts-literature-concepts',
  questions: VERIFIED_LITERATURE_LIBRETEXTS_QUESTIONS,
  source: SOURCE,
  sourceUrl: BOOK,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent concepts against the cited LibreTexts chapter; public-domain source; no generated variants',
  status: 'approved',
};

export default VERIFIED_LITERATURE_LIBRETEXTS_BATCH;
