import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent philosophy concepts reviewed against the CC BY 4.0 LibreTexts
 * edition of OpenStax Introduction to Philosophy. Each row is one claim;
 * this module intentionally contains no generated wording variants.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'Introduction to Philosophy (OpenStax), Humanities LibreTexts';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited LibreTexts chapter; one independent concept per card; descriptive wording; no quotations';
const BOOK = 'https://human.libretexts.org/Bookshelves/Philosophy/Introduction_to_Philosophy/Introduction_to_Philosophy_(OpenStax)';
const CHAPTERS = {
  introduction: `${BOOK}/01%3A_Introduction`,
  logic: `${BOOK}/05%3A_Logic_and_Reasoning`,
  metaphysics: `${BOOK}/06%3A_Metaphysics`,
  epistemology: `${BOOK}/07%3A_Epistemology`,
  value: `${BOOK}/08%3A_Value_Theory`,
  normative: `${BOOK}/09%3A_Normative_Moral_Theory`,
  applied: `${BOOK}/10%3A_Applied_Ethics`,
  political: `${BOOK}/11%3A_Political_Philosophy`,
  contemporary: `${BOOK}/12%3A_Contemporary_Philosophies_and_Social_Theories`,
} as const;

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: keyof typeof CHAPTERS];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('intro-philosophy-definition', 'Introduction', 'Que désigne généralement la philosophie ?', 'Une enquête rationnelle et critique sur des questions fondamentales', 'Elle examine notamment les concepts, les raisons et les présupposés qui orientent nos croyances.', 1, 'introduction'),
  row('intro-metaphysics-branch', 'Branches', 'Que cherche à étudier la métaphysique ?', 'La nature fondamentale de la réalité', 'Elle pose des questions sur ce qui existe, l’identité, la possibilité et la structure du réel.', 1, 'introduction'),
  row('intro-epistemology-branch', 'Branches', 'Que cherche à étudier l’épistémologie ?', 'La connaissance et sa justification', 'Elle étudie notamment les sources, les limites et les conditions de la connaissance.', 1, 'introduction'),
  row('intro-ethics-branch', 'Branches', 'Que cherche à étudier l’éthique ?', 'Les questions sur l’action, les valeurs et la vie bonne', 'L’éthique philosophique analyse des notions comme le devoir, le bien, la vertu et la responsabilité.', 1, 'introduction'),
  row('intro-aesthetics-branch', 'Branches', 'Que cherche à étudier l’esthétique ?', 'L’art, la beauté et l’expérience esthétique', 'Elle interroge la nature des œuvres, du jugement esthétique et de l’expérience de l’art.', 1, 'introduction'),
  row('intro-philosophical-argument', 'Méthode', 'Qu’est-ce qu’un argument philosophique ?', 'Un ensemble de propositions où des prémisses soutiennent une conclusion', 'La force d’un argument dépend de la relation entre ses prémisses et sa conclusion ainsi que de la qualité des prémisses.', 1, 'introduction'),
  row('intro-premise', 'Méthode', 'Qu’est-ce qu’une prémisse ?', 'Une proposition utilisée pour soutenir une conclusion', 'Les prémisses sont les points de départ explicites d’un raisonnement.', 1, 'introduction'),
  row('intro-conclusion', 'Méthode', 'Qu’est-ce qu’une conclusion dans un argument ?', 'La proposition que l’argument cherche à établir', 'Elle est soutenue par une ou plusieurs prémisses.', 1, 'introduction'),
  row('intro-thought-experiment', 'Méthode', 'Qu’est-ce qu’une expérience de pensée ?', 'Un scénario imaginé pour examiner les conséquences d’une idée', 'Elle permet de tester intuitions et principes sans réaliser matériellement la situation.', 2, 'introduction'),
  row('intro-philosophy-science', 'Méthode', 'En quoi une question philosophique diffère-t-elle souvent d’une question empirique ?', 'Elle porte sur les concepts, les raisons ou les présupposés d’un problème', 'Elle peut compléter les sciences sans se réduire à une mesure ou à une observation particulière.', 2, 'introduction'),

  row('logic-proposition', 'Logique', 'Qu’est-ce qu’une proposition en logique ?', 'Un énoncé susceptible d’être vrai ou faux', 'Une question ou un ordre n’est pas une proposition au même sens, car il ne possède pas une valeur de vérité.', 1, 'logic'),
  row('logic-deductive-argument', 'Logique', 'Qu’est-ce qu’un argument déductif ?', 'Un argument dont la conclusion est censée découler nécessairement des prémisses', 'Si les prémisses sont vraies et la forme valide, la conclusion ne peut pas être fausse.', 1, 'logic'),
  row('logic-inductive-argument', 'Logique', 'Qu’est-ce qu’un argument inductif ?', 'Un argument où les prémisses rendent la conclusion probable plutôt que nécessaire', 'L’induction généralise ou prévoit à partir d’informations qui ne garantissent pas logiquement la conclusion.', 1, 'logic'),
  row('logic-validity', 'Logique', 'Que signifie la validité d’un argument déductif ?', 'Qu’il est impossible que ses prémisses soient vraies et sa conclusion fausse', 'La validité concerne la structure de l’argument, indépendamment de la vérité effective de ses prémisses.', 2, 'logic'),
  row('logic-soundness', 'Logique', 'Qu’est-ce qu’un argument déductif solide ?', 'Un argument valide dont les prémisses sont vraies', 'La solidité combine une bonne forme logique et des prémisses acceptables comme vraies.', 2, 'logic'),
  row('logic-conditional', 'Logique', 'Quelle est la structure d’un énoncé conditionnel ?', 'Si P, alors Q', 'P est l’antécédent et Q le conséquent dans cette forme logique.', 1, 'logic'),
  row('logic-conjunction', 'Logique', 'Que signifie une conjonction logique ?', 'Que deux propositions sont affirmées ensemble', 'La conjonction « P et Q » est vraie seulement lorsque P et Q sont toutes deux vraies.', 1, 'logic'),
  row('logic-disjunction', 'Logique', 'Que signifie une disjonction logique inclusive ?', 'Qu’au moins une des deux propositions est vraie', 'Dans la disjonction inclusive « P ou Q », les deux peuvent aussi être vraies.', 2, 'logic'),
  row('logic-modus-ponens', 'Logique', 'Quelle forme possède le modus ponens ?', 'Si P alors Q ; P ; donc Q', 'Cette règle déductive applique l’antécédent affirmé d’un conditionnel.', 2, 'logic'),
  row('logic-modus-tollens', 'Logique', 'Quelle forme possède le modus tollens ?', 'Si P alors Q ; non-Q ; donc non-P', 'Cette règle raisonne par la négation du conséquent.', 2, 'logic'),
  row('logic-affirming-consequent', 'Erreurs', 'Pourquoi « si P alors Q ; Q ; donc P » est-il une forme invalide ?', 'Parce qu’elle affirme le conséquent', 'Q peut avoir une autre cause que P ; le conditionnel ne permet donc pas à lui seul d’inférer P.', 2, 'logic'),
  row('logic-denying-antecedent', 'Erreurs', 'Pourquoi « si P alors Q ; non-P ; donc non-Q » est-il une forme invalide ?', 'Parce qu’elle nie l’antécédent', 'Q pourrait être vrai pour une autre raison même si P est faux.', 2, 'logic'),
  row('logic-ad-hominem', 'Erreurs', 'Que caractérise l’attaque ad hominem ?', 'Elle critique la personne au lieu de répondre à son argument', 'La qualité personnelle d’un interlocuteur ne suffit pas à réfuter la proposition qu’il défend.', 1, 'logic'),
  row('logic-straw-man', 'Erreurs', 'Que caractérise l’homme de paille ?', 'Une reformulation déformée d’un argument, plus facile à réfuter', 'La critique porte alors sur une version affaiblie plutôt que sur la position originale.', 1, 'logic'),
  row('logic-false-dilemma', 'Erreurs', 'Que caractérise un faux dilemme ?', 'La présentation de deux options comme exhaustives alors que d’autres existent', 'L’erreur réduit artificiellement l’espace des possibilités.', 1, 'logic'),
  row('logic-circular-reasoning', 'Erreurs', 'Que caractérise un raisonnement circulaire ?', 'Une conclusion reprise comme prémisse, directement ou indirectement', 'L’argument ne fournit pas de soutien indépendant à sa conclusion.', 1, 'logic'),

  row('meta-ontology', 'Métaphysique', 'Que désigne l’ontologie ?', 'L’étude de ce qui existe et des catégories de l’être', 'Elle interroge par exemple la différence entre objets, propriétés, événements ou relations.', 2, 'metaphysics'),
  row('meta-substance', 'Métaphysique', 'Que désigne une substance dans une tradition métaphysique ?', 'Un être considéré comme existant de manière relativement indépendante', 'La notion est utilisée pour distinguer ce qui existe par soi de ce qui dépend d’autre chose.', 2, 'metaphysics'),
  row('meta-property', 'Métaphysique', 'Qu’est-ce qu’une propriété ?', 'Une caractéristique attribuable à une chose', 'La couleur, la masse ou la forme sont des exemples de propriétés dans des analyses métaphysiques.', 1, 'metaphysics'),
  row('meta-universal', 'Métaphysique', 'Que désigne un universel ?', 'Une caractéristique susceptible d’être instanciée par plusieurs particuliers', 'La rougeur, par exemple, est discutée comme caractéristique partageable entre plusieurs objets rouges.', 2, 'metaphysics'),
  row('meta-particular', 'Métaphysique', 'Que désigne un particulier ?', 'Une entité singulière et déterminée', 'Un particulier se distingue d’une propriété ou d’un type général.', 2, 'metaphysics'),
  row('meta-dualism', 'Esprit', 'Que soutient le dualisme des substances ?', 'Que l’esprit et le corps sont deux types de substances distincts', 'Dans la version cartésienne, la pensée et l’étendue caractérisent ces deux domaines.', 2, 'metaphysics'),
  row('meta-physicalism', 'Esprit', 'Que soutient le physicalisme ?', 'Que tout ce qui existe est ultimement physique ou dépend du physique', 'Cette thèse cherche à expliquer l’esprit dans le cadre d’une réalité physique.', 2, 'metaphysics'),
  row('meta-interactionism', 'Esprit', 'Que propose le dualisme interactionniste ?', 'Que l’esprit et le corps peuvent exercer une influence causale l’un sur l’autre', 'Il s’agit d’une réponse au problème de la relation entre états mentaux et états physiques.', 2, 'metaphysics'),
  row('meta-free-will', 'Action', 'Que désigne le libre arbitre dans le débat métaphysique ?', 'La capacité d’agir avec un contrôle pertinent sur ses choix', 'Les théories divergent sur les conditions exactes de ce contrôle et sur sa compatibilité avec le déterminisme.', 1, 'metaphysics'),
  row('meta-determinism', 'Causalité', 'Que soutient le déterminisme causal ?', 'Que les événements sont fixés par des conditions antérieures et les lois pertinentes', 'La thèse porte sur la structure causale des événements, pas sur l’idée qu’ils seraient faciles à prévoir.', 2, 'metaphysics'),
  row('meta-compatibilism', 'Action', 'Que soutient le compatibilisme ?', 'Que le libre arbitre peut être compatible avec le déterminisme', 'Il définit généralement la liberté en termes de contrôle, de raisons ou d’absence de contrainte externe.', 2, 'metaphysics'),
  row('meta-incompatibilism', 'Action', 'Que soutient l’incompatibilisme ?', 'Que le libre arbitre et le déterminisme ne peuvent pas être vrais ensemble', 'Cette position peut conduire soit au libertarianisme, soit à un déterminisme sans libre arbitre.', 2, 'metaphysics'),
  row('meta-personal-identity', 'Identité', 'Que cherche à déterminer le problème de l’identité personnelle ?', 'Ce qui fait qu’une personne reste la même à travers le temps', 'Les réponses invoquent notamment la continuité psychologique, le corps ou une conception narrative.', 1, 'metaphysics'),
  row('meta-essential-property', 'Identité', 'Qu’est-ce qu’une propriété essentielle ?', 'Une propriété qu’une entité ne peut perdre sans cesser d’être cette entité', 'Elle se distingue d’une propriété contingente, que l’entité peut avoir ou ne pas avoir.', 2, 'metaphysics'),
  row('meta-contingent', 'Modalité', 'Que signifie « contingent » en métaphysique ?', 'Qui pourrait être autrement ou ne pas exister', 'La contingence s’oppose à la nécessité dans l’analyse des possibilités.', 1, 'metaphysics'),
  row('meta-necessary', 'Modalité', 'Que signifie « nécessaire » en métaphysique ?', 'Qui ne peut pas être autrement dans le cadre considéré', 'Une vérité nécessaire ne dépend pas d’une circonstance contingente.', 1, 'metaphysics'),
  row('meta-cosmological-argument', 'Religion', 'Que cherche à établir un argument cosmologique ?', 'Une conclusion sur une cause ou une explication première à partir de l’existence du monde', 'Les différentes versions partent de la causalité, de la contingence ou du commencement de l’univers.', 2, 'metaphysics'),

  row('epi-belief', 'Épistémologie', 'Qu’est-ce qu’une croyance ?', 'Une attitude mentale qui tient une proposition pour vraie', 'Une croyance peut être vraie ou fausse ; elle n’est pas encore une connaissance par le seul fait d’être tenue.', 1, 'epistemology'),
  row('epi-truth', 'Épistémologie', 'Que désigne la vérité d’une proposition ?', 'Le fait qu’elle corresponde à la réalité ou à l’état de choses pertinent', 'La vérité est distincte de la certitude psychologique d’une personne.', 1, 'epistemology'),
  row('epi-justification', 'Épistémologie', 'Que désigne la justification ?', 'Les raisons ou éléments qui soutiennent rationnellement une croyance', 'La justification concerne le soutien disponible pour croire, même si la croyance peut finalement être fausse.', 1, 'epistemology'),
  row('epi-traditional-knowledge', 'Épistémologie', 'Quelle analyse traditionnelle définit la connaissance propositionnelle ?', 'Une croyance vraie et justifiée', 'Cette analyse en trois conditions est souvent appelée l’analyse tripartite de la connaissance.', 1, 'epistemology'),
  row('epi-gettier-problem', 'Épistémologie', 'Que montrent les cas de Gettier ?', 'Qu’une croyance vraie et justifiée peut ne pas sembler être une connaissance', 'Ils motivent la recherche d’une condition supplémentaire à l’analyse tripartite.', 2, 'epistemology'),
  row('epi-a-priori', 'Sources', 'Que signifie « a priori » ?', 'Qui peut être connu indépendamment de l’expérience particulière', 'Le terme concerne la justification ou la connaissance, et non l’ordre chronologique d’apprentissage.', 2, 'epistemology'),
  row('epi-a-posteriori', 'Sources', 'Que signifie « a posteriori » ?', 'Qui dépend de l’expérience ou de l’observation', 'Les connaissances empiriques sont typiquement justifiées par des données issues du monde.', 1, 'epistemology'),
  row('epi-rationalism', 'Théories', 'Que soutient le rationalisme épistémologique ?', 'Que la raison joue un rôle fondamental dans la connaissance', 'Les rationalistes accordent notamment une place importante aux principes ou connaissances non dérivés des sens.', 2, 'epistemology'),
  row('epi-empiricism', 'Théories', 'Que soutient l’empirisme épistémologique ?', 'Que l’expérience joue un rôle fondamental dans la connaissance', 'L’empirisme met l’accent sur les données des sens, l’observation ou l’apprentissage expérientiel.', 1, 'epistemology'),
  row('epi-skepticism', 'Théories', 'Que met en doute le scepticisme épistémologique ?', 'La possibilité ou la suffisance de certaines connaissances', 'Le sceptique peut demander quelles raisons justifient une croyance et si ces raisons sont elles-mêmes fiables.', 1, 'epistemology'),
  row('epi-testimony', 'Sources', 'Que désigne le témoignage comme source de connaissance ?', 'L’acquisition d’une croyance à partir de l’énoncé d’autrui', 'Le témoignage peut être rationnel lorsqu’il existe des raisons de juger la source et le contenu fiables.', 2, 'epistemology'),
  row('epi-memory', 'Sources', 'Pourquoi la mémoire est-elle étudiée en épistémologie ?', 'Parce qu’elle conserve ou restitue des croyances et des informations', 'Les débats portent notamment sur son rôle de source indépendante ou de moyen de préserver une justification antérieure.', 2, 'epistemology'),
  row('epi-perception', 'Sources', 'Que désigne la perception comme source de connaissance ?', 'L’accès cognitif au monde par les systèmes sensoriels', 'La perception fournit des informations mais peut aussi être affectée par des illusions ou des conditions particulières.', 1, 'epistemology'),
  row('epi-internalism', 'Justification', 'Que soutient l’internalisme épistémologique ?', 'Que les facteurs pertinents de justification doivent être accessibles au sujet d’une manière appropriée', 'La thèse concerne ce qui rend une croyance rationnelle du point de vue de l’agent.', 2, 'epistemology'),
  row('epi-externalism', 'Justification', 'Que soutient l’externalisme épistémologique ?', 'Que certains facteurs externes à l’accès conscient peuvent contribuer à la justification ou à la connaissance', 'La fiabilité d’un processus est un exemple de facteur invoqué par des théories externalistes.', 2, 'epistemology'),
  row('epi-reliabilism', 'Justification', 'Que propose le fiabilisme ?', 'Qu’une croyance peut être justifiée lorsqu’elle provient d’un processus fiable', 'La fiabilité est évaluée par la tendance du processus à produire des croyances vraies dans des conditions appropriées.', 2, 'epistemology'),

  row('value-instrumental', 'Valeur', 'Que signifie qu’une chose possède une valeur instrumentale ?', 'Qu’elle vaut comme moyen pour atteindre autre chose', 'Un instrument n’est pas nécessairement valorisé pour lui-même.', 1, 'value'),
  row('value-intrinsic', 'Valeur', 'Que signifie qu’une chose possède une valeur intrinsèque ?', 'Qu’elle est valorisée pour elle-même', 'La distinction porte sur la source de la valeur, pas sur la durée ou la rareté de la chose.', 1, 'value'),
  row('value-aesthetic-judgment', 'Esthétique', 'Qu’est-ce qu’un jugement esthétique ?', 'Une évaluation portant sur l’expérience ou les qualités esthétiques', 'Il peut concerner la beauté, le sublime, l’expression ou la forme d’une œuvre.', 1, 'value'),
  row('value-subjective-theory', 'Esthétique', 'Que soutient une théorie subjectiviste de la valeur esthétique ?', 'Que la valeur esthétique dépend principalement des réactions ou préférences des sujets', 'Elle contraste avec les théories qui attribuent une valeur esthétique indépendante des réactions particulières.', 2, 'value'),
  row('value-objectivist-theory', 'Esthétique', 'Que soutient une théorie objectiviste de la valeur esthétique ?', 'Que certaines propriétés esthétiques peuvent fournir des raisons qui ne se réduisent pas aux préférences individuelles', 'L’objectivisme n’implique pas que tous les jugements esthétiques soient faciles ou unanimement partagés.', 2, 'value'),
  row('value-art-definition', 'Esthétique', 'Pourquoi la définition de l’art est-elle une question philosophique ?', 'Parce qu’il faut déterminer les conditions qui font d’une chose une œuvre d’art', 'Les théories mobilisent notamment l’imitation, l’expression, la forme, l’histoire ou les institutions.', 1, 'value'),
  row('value-expression-theory', 'Esthétique', 'Que met en avant une théorie expressive de l’art ?', 'L’expression ou la communication d’états, d’idées ou d’émotions', 'Cette théorie explique l’art par ce qu’il exprime, sans réduire nécessairement toute œuvre à une émotion.', 2, 'value'),
  row('value-formalism', 'Esthétique', 'Que met en avant le formalisme esthétique ?', 'Les propriétés formelles et les relations internes d’une œuvre', 'Le formalisme accorde une importance particulière à la structure, à la composition et aux éléments perceptibles.', 2, 'value'),

  row('normative-consequentialism', 'Éthique', 'Que soutient le conséquentialisme ?', 'Que la valeur morale d’une action dépend de ses conséquences', 'La théorie évalue l’action par l’état de choses qu’elle produit ou contribue à produire.', 1, 'normative'),
  row('normative-deontology', 'Éthique', 'Que met en avant la déontologie ?', 'Les devoirs, règles ou contraintes qui encadrent l’action', 'Une approche déontologique ne réduit pas entièrement la moralité aux conséquences.', 1, 'normative'),
  row('normative-virtue-ethics', 'Éthique', 'Que met en avant l’éthique de la vertu ?', 'Le caractère et les dispositions vertueuses de l’agent', 'Elle s’intéresse à la personne que l’on devient et aux traits qui rendent l’action bonne ou appropriée.', 1, 'normative'),
  row('normative-rule-consequentialism', 'Éthique', 'Que distingue le conséquentialisme des actes du conséquentialisme des règles ?', 'Le niveau auquel sont évalués les choix moraux', 'Le premier évalue chaque acte, tandis que le second évalue des règles générales par les conséquences de leur adoption.', 2, 'normative'),
  row('normative-perfect-duty', 'Éthique', 'Que désigne une obligation parfaite dans une lecture kantienne ?', 'Un devoir strict qui ne souffre pas d’exception arbitraire', 'Elle se distingue d’un devoir imparfait, qui laisse une latitude dans la manière ou le moment de poursuivre sa fin.', 2, 'normative'),
  row('normative-hypothetical-imperative', 'Éthique', 'Qu’est-ce qu’un impératif hypothétique chez Kant ?', 'Une prescription conditionnelle relative à une fin', 'Sa forme générale est : si l’on veut une fin, il faut employer les moyens appropriés.', 2, 'normative'),
  row('normative-moral-relativism', 'Éthique', 'Que soutient le relativisme moral ?', 'Que la validité ou la vérité des jugements moraux dépend d’un cadre culturel ou individuel', 'Cette thèse est descriptive ou métaéthique selon sa formulation et ne se confond pas avec la tolérance.', 2, 'normative'),
  row('normative-moral-objectivism', 'Éthique', 'Que soutient l’objectivisme moral ?', 'Que certains jugements moraux peuvent être vrais indépendamment des opinions particulières', 'L’objectivisme n’impose pas une seule théorie de la manière de connaître ces vérités.', 2, 'normative'),
  row('normative-egoism', 'Éthique', 'Que soutient l’égoïsme éthique ?', 'Que l’agent doit agir selon son intérêt propre', 'Il s’agit d’une théorie normative, distincte de la simple constatation que les personnes poursuivent parfois leur intérêt.', 2, 'normative'),
  row('normative-natural-law', 'Éthique', 'Que cherche à fonder la théorie de la loi naturelle ?', 'Des normes morales sur des aspects de la nature ou de la raison humaines', 'Les versions de la théorie diffèrent sur la manière de passer des faits sur la nature aux normes.', 2, 'normative'),
  row('normative-moral-dilemma', 'Éthique', 'Qu’est-ce qu’un dilemme moral ?', 'Une situation où des exigences morales semblent entrer en conflit', 'Le problème consiste à déterminer si les exigences peuvent être hiérarchisées ou si aucun choix n’est pleinement satisfaisant.', 1, 'normative'),

  row('political-social-contract', 'Politique', 'Que désigne la théorie du contrat social ?', 'Une famille de théories expliquant l’autorité politique par un accord ou une justification entre individus', 'Les versions de Hobbes, Locke et Rousseau proposent des conceptions différentes de l’état de nature et du consentement.', 1, 'political'),
  row('political-state-of-nature', 'Politique', 'Que désigne l’état de nature dans les théories contractualistes ?', 'Une situation hypothétique sans autorité politique instituée', 'Il sert à examiner pourquoi des personnes pourraient accepter une organisation politique.', 1, 'political'),
  row('political-legitimacy', 'Politique', 'Que désigne la légitimité politique ?', 'Le droit ou la justification d’exercer une autorité sur une population', 'Elle est distincte de la seule capacité factuelle à imposer des décisions.', 1, 'political'),
  row('political-positive-liberty', 'Liberté', 'Que désigne la liberté positive ?', 'La capacité effective d’agir ou de se gouverner soi-même', 'Elle se distingue de la liberté négative, définie par l’absence d’interférence.', 2, 'political'),
  row('political-negative-liberty', 'Liberté', 'Que désigne la liberté négative ?', 'L’absence d’interférence ou de contrainte par autrui', 'La liberté négative porte sur les obstacles imposés, sans garantir à elle seule les moyens d’agir.', 2, 'political'),
  row('political-distributive-justice', 'Justice', 'Que cherche à déterminer la justice distributive ?', 'Comment répartir équitablement les biens, charges ou possibilités', 'Les théories divergent sur le principe pertinent : mérite, égalité, besoin, liberté ou avantage des plus défavorisés.', 2, 'political'),
  row('political-equality', 'Justice', 'Que signifie l’égalité politique ?', 'Que les personnes disposent d’un statut égal dans la participation et la considération politiques', 'Elle peut concerner le vote, les droits, l’accès aux institutions ou la valeur des intérêts.', 1, 'political'),
  row('political-civil-disobedience', 'Politique', 'Que désigne la désobéissance civile ?', 'Une violation publique et généralement non violente d’une règle pour contester une injustice', 'La notion inclut un rapport explicite à la publicité, à la conscience et à la réforme politique.', 2, 'political'),
  row('political-anarchism', 'Politique', 'Que critique l’anarchisme philosophique ?', 'La légitimité nécessaire d’une autorité politique centralisée', 'Les courants anarchistes diffèrent sur les formes d’organisation compatibles avec l’autonomie et la coopération.', 2, 'political'),
  row('political-liberalism', 'Politique', 'Que met généralement en avant le libéralisme politique ?', 'Les droits individuels, la liberté et des limites à l’autorité politique', 'Les libéralismes diffèrent notamment sur la conception de la justice et du rôle de l’État.', 1, 'political'),
  row('political-feminist-philosophy', 'Politique', 'Que cherche notamment à analyser la philosophie politique féministe ?', 'Les rapports entre pouvoir, genre, égalité et institutions', 'Elle étudie aussi la manière dont des concepts politiques traditionnels peuvent exclure certaines expériences.', 2, 'political'),
  row('political-cosmopolitanism', 'Politique', 'Que soutient le cosmopolitisme moral ?', 'Que les obligations de justice ne s’arrêtent pas nécessairement aux frontières politiques', 'Il traite les personnes comme membres d’une communauté morale mondiale, avec des variantes importantes.', 2, 'political'),

  row('contemporary-absurdism', 'Courants', 'Que désigne l’absurde dans une partie de la philosophie contemporaine ?', 'La tension entre la recherche humaine de sens et l’absence de réponse garantie par le monde', 'Cette notion ne signifie pas simplement que tout est illogique ; elle décrit une relation problématique entre attente de sens et silence du monde.', 2, 'contemporary'),
  row('contemporary-phenomenology', 'Courants', 'Que cherche à décrire la phénoménologie ?', 'La structure de l’expérience vécue telle qu’elle se manifeste à la conscience', 'Elle suspend certaines présuppositions théoriques pour décrire les phénomènes et leur mode d’apparition.', 2, 'contemporary'),
  row('contemporary-pragmatism', 'Courants', 'Que met en avant le pragmatisme philosophique ?', 'Les effets pratiques, l’enquête et la révisabilité des idées', 'La signification ou la valeur d’une croyance est souvent étudiée par ses conséquences dans l’expérience et l’action.', 2, 'contemporary'),
  row('contemporary-analytic-philosophy', 'Courants', 'Que caractérise souvent la philosophie analytique ?', 'L’analyse précise des concepts, du langage et des arguments', 'Il s’agit d’une tradition plurielle, mais la clarté argumentative y occupe une place importante.', 1, 'contemporary'),
  row('contemporary-critical-theory', 'Courants', 'Que cherche à examiner la théorie critique ?', 'Les rapports entre pouvoir, société, idéologie et émancipation', 'Elle analyse la manière dont des structures sociales peuvent produire domination ou exclusion.', 2, 'contemporary'),
  row('contemporary-structuralism', 'Courants', 'Que met en avant le structuralisme ?', 'Les structures relationnelles qui organisent les phénomènes et les systèmes de signes', 'Le sens d’un élément est étudié par ses relations avec les autres éléments du système.', 2, 'contemporary'),
  row('contemporary-postmodernism', 'Courants', 'Quel objet critique est souvent associé au postmodernisme ?', 'Les récits totalisants et les prétentions à une explication unique', 'Les approches postmodernes examinent les effets du langage, du pouvoir et du contexte sur les savoirs.', 2, 'contemporary'),
  row('contemporary-mind-body-problem', 'Esprit', 'Que désigne le problème esprit-corps ?', 'La question de la relation entre les états mentaux et les états physiques', 'Les réponses incluent notamment dualisme, physicalisme et théories fonctionnelles.', 1, 'contemporary'),
  row('contemporary-functionalism', 'Esprit', 'Que soutient le fonctionnalisme de l’esprit ?', 'Que les états mentaux se définissent par leurs rôles causaux ou fonctionnels', 'Un même rôle fonctionnel pourrait en principe être réalisé par des supports physiques différents.', 2, 'contemporary'),
  row('contemporary-artificial-intelligence', 'Esprit', 'Pourquoi l’intelligence artificielle intéresse-t-elle la philosophie de l’esprit ?', 'Parce qu’elle interroge les rapports entre calcul, cognition, compréhension et conscience', 'La possibilité d’un comportement intelligent ne tranche pas à elle seule toutes les questions sur l’expérience subjective.', 2, 'contemporary'),
  row('contemporary-feminist-standpoint', 'Épistémologie sociale', 'Que met en avant la théorie du point de vue féministe ?', 'L’influence de la position sociale sur l’accès aux savoirs et la perception des rapports de pouvoir', 'Elle étudie comment des expériences marginalisées peuvent révéler des aspects négligés d’une situation.', 2, 'contemporary'),
  row('contemporary-social-epistemology', 'Épistémologie sociale', 'Que cherche à étudier l’épistémologie sociale ?', 'La connaissance et la justification dans leurs dimensions collectives', 'Elle examine notamment le témoignage, le désaccord, les institutions et la répartition des ressources épistémiques.', 1, 'contemporary'),
  row('contemporary-epistemic-injustice', 'Épistémologie sociale', 'Que désigne une injustice épistémique ?', 'Un tort subi dans sa capacité à transmettre ou à faire reconnaître un savoir', 'Le concept relie crédibilité, préjugés et participation aux pratiques de connaissance.', 2, 'contemporary'),
  row('contemporary-environmental-ethics', 'Éthique appliquée', 'Que cherche à étudier l’éthique environnementale ?', 'Les rapports moraux entre les humains, les autres êtres vivants et les écosystèmes', 'Elle discute notamment la valeur de la nature, les générations futures et les responsabilités collectives.', 1, 'applied'),
  row('contemporary-bioethics', 'Éthique appliquée', 'Que désigne la bioéthique ?', 'L’analyse philosophique des questions morales liées à la santé, au vivant et aux biotechnologies', 'Elle traite de problèmes comme le consentement, la recherche, la fin de vie ou la répartition des soins.', 1, 'applied'),
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

export const VERIFIED_PHILOSOPHY_LIBRETEXTS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-philosophy-libretexts-${id}`;
  return {
    id: `philosophy-libretexts-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Philosophie',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['philosophie', 'oer', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_PHILOSOPHY_LIBRETEXTS_BATCH: VerifiedContentBatch = {
  id: 'libretexts-philosophy-concepts',
  questions: VERIFIED_PHILOSOPHY_LIBRETEXTS_QUESTIONS,
  source: SOURCE,
  sourceUrl: BOOK,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent concepts against the cited LibreTexts chapters; CC BY 4.0 source; no generated variants',
  status: 'approved',
};

export default VERIFIED_PHILOSOPHY_LIBRETEXTS_BATCH;
