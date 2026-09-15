import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent foundational psychology claims checked against OpenStax
 * Psychology 2e (CC BY 4.0). One row is one fact; this module does not
 * generate wording variants and deliberately excludes diagnosis or advice.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Psychology 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax Psychology 2e chapter';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('psychology-definition', 'Fondamentaux', 'Comment la psychologie est-elle définie dans l’introduction du manuel ?', 'L’étude scientifique de l’esprit et du comportement', 'La psychologie utilise des méthodes scientifiques pour étudier les processus mentaux et les comportements.', 1, '1-introduction'),
  row('behavior-definition', 'Fondamentaux', 'Qu’étudie principalement le comportement en psychologie ?', 'Les actions et réactions observables d’un organisme', 'Le comportement désigne ce qu’un organisme fait et qui peut être observé ou mesuré.', 1, '1-introduction'),
  row('nature-nurture', 'Fondamentaux', 'Que désigne le débat nature-culture ?', 'La question de l’influence respective des facteurs biologiques et de l’environnement', 'Les caractéristiques psychologiques résultent souvent d’interactions entre héritage biologique et expérience.', 2, '1-introduction'),
  row('wilhelm-wundt-lab', 'Histoire', 'Quel chercheur est associé au premier laboratoire de psychologie expérimentale ?', 'Wilhelm Wundt', 'Wundt a fondé à Leipzig un laboratoire généralement considéré comme le premier laboratoire de psychologie expérimentale.', 1, '1-introduction'),
  row('functionalism-purpose', 'Histoire', 'Sur quoi le fonctionnalisme cherchait-il notamment à comprendre l’esprit ?', 'Sur le rôle et la fonction des processus mentaux', 'Le fonctionnalisme s’intéressait à la manière dont les processus servent l’adaptation.', 2, '1-introduction'),
  row('ethical-principle-consent', 'Éthique', 'Quel principe éthique informe normalement les participants de ce qu’implique une étude ?', 'Le consentement éclairé', 'Le consentement éclairé permet une participation volontaire après information sur l’étude.', 1, '2-psychological-research'),
  row('hypothesis-testable', 'Méthode', 'Quelle propriété doit posséder une hypothèse scientifique ?', 'Elle doit être testable', 'Une hypothèse testable conduit à des observations susceptibles de la soutenir ou de la contredire.', 1, '2-psychological-research'),
  row('correlation-causation', 'Méthode', 'Une corrélation suffit-elle à établir une relation de cause à effet ?', 'Non', 'Une corrélation indique une association, mais des variables tierces ou la direction causale restent possibles.', 1, '2-psychological-research'),
  row('independent-variable', 'Expérimentation', 'Comment appelle-t-on la variable manipulée par le chercheur dans une expérience ?', 'La variable indépendante', 'La variable indépendante est modifiée pour observer son effet éventuel sur une autre variable.', 1, '2-psychological-research'),
  row('dependent-variable', 'Expérimentation', 'Comment appelle-t-on la variable mesurée comme résultat d’une expérience ?', 'La variable dépendante', 'La variable dépendante est la mesure recueillie pour évaluer un effet.', 1, '2-psychological-research'),
  row('dendrite-receive', 'Biopsychologie', 'Quelle partie du neurone reçoit généralement les signaux entrants ?', 'Les dendrites', 'Les dendrites sont des prolongements qui reçoivent de nombreuses informations synaptiques.', 1, '3-biopsychology'),
  row('axon-transmit', 'Biopsychologie', 'Quelle partie du neurone conduit généralement le signal vers les terminaisons ?', 'L’axone', 'L’axone conduit le potentiel d’action depuis le corps cellulaire vers ses terminaisons.', 1, '3-biopsychology'),
  row('neurotransmitter', 'Biopsychologie', 'Comment appelle-t-on un messager chimique libéré par un neurone à une synapse ?', 'Un neurotransmetteur', 'Les neurotransmetteurs diffusent dans la fente synaptique et se lient à des récepteurs.', 1, '3-biopsychology'),
  row('circadian-rhythm', 'Conscience', 'Qu’est-ce qu’un rythme circadien ?', 'Un cycle biologique d’environ vingt-quatre heures', 'Le cycle veille-sommeil est un exemple de rythme circadien influencé par l’horloge biologique et l’environnement.', 1, '4-states-of-consciousness'),
  row('rem-sleep', 'Sommeil', 'Quelle phase du sommeil est associée à des mouvements oculaires rapides ?', 'Le sommeil paradoxal, ou sommeil REM', 'Le sommeil REM se caractérise notamment par des mouvements oculaires rapides et une activité cérébrale particulière.', 1, '4-states-of-consciousness'),
  row('sleep-spindle', 'Sommeil', 'Comment appelle-t-on les brèves salves d’activité observées notamment pendant le sommeil N2 ?', 'Les fuseaux du sommeil', 'Les fuseaux du sommeil sont des bouffées d’oscillations rapides caractéristiques du stade N2.', 2, '4-states-of-consciousness'),
  row('insomnia-definition', 'Sommeil', 'Comment le manuel décrit-il l’insomnie de façon générale ?', 'Une difficulté persistante liée au sommeil', 'Le terme désigne des difficultés de sommeil qui peuvent concerner l’endormissement, le maintien du sommeil ou le réveil précoce.', 2, '4-states-of-consciousness'),
  row('hypnosis-suggestion', 'Conscience', 'Quel rôle la suggestion joue-t-elle dans l’hypnose telle que présentée dans le manuel ?', 'Elle oriente les expériences ou réponses de la personne', 'L’hypnose implique une attention focalisée et une sensibilité accrue à certaines suggestions.', 2, '4-states-of-consciousness'),
  row('sensory-transduction', 'Perception', 'Comment appelle-t-on la conversion d’une énergie sensorielle en signal neuronal ?', 'La transduction', 'Les récepteurs sensoriels transforment une forme d’énergie en activité nerveuse exploitable par le système nerveux.', 1, '5-sensation-and-perception'),
  row('absolute-threshold', 'Perception', 'Que désigne le seuil absolu ?', 'La plus faible intensité détectable d’un stimulus', 'Le seuil absolu correspond conventionnellement à une détection dans environ la moitié des présentations.', 1, '5-sensation-and-perception'),
  row('difference-threshold', 'Perception', 'Que mesure le seuil différentiel ?', 'La plus petite différence détectable entre deux stimuli', 'Il indique la variation minimale perçue entre deux intensités.', 1, '5-sensation-and-perception'),
  row('signal-detection', 'Perception', 'De quoi dépend la détection d’un signal selon la théorie de la détection du signal ?', 'Du signal et de l’état ou des attentes de l’observateur', 'La détection dépend à la fois de l’intensité du signal et de facteurs comme l’attention et le critère de décision.', 2, '5-sensation-and-perception'),
  row('gestalt-proximity', 'Perception', 'Quel principe de la Gestalt regroupe les éléments proches les uns des autres ?', 'La proximité', 'La proximité favorise la perception d’éléments voisins comme appartenant à un même ensemble.', 1, '5-sensation-and-perception'),
  row('classical-conditioning', 'Apprentissage', 'Quel apprentissage associe un stimulus à une réponse par l’intermédiaire d’un autre stimulus ?', 'Le conditionnement classique', 'Dans le conditionnement classique, un stimulus initialement neutre acquiert une capacité à déclencher une réponse.', 1, '6-learning'),
  row('unconditioned-stimulus', 'Apprentissage', 'Comment appelle-t-on un stimulus qui déclenche naturellement une réponse ?', 'Un stimulus inconditionnel', 'Un stimulus inconditionnel provoque une réponse sans apprentissage préalable dans le cadre décrit.', 1, '6-learning'),
  row('operant-conditioning', 'Apprentissage', 'Quel apprentissage modifie la probabilité d’un comportement selon ses conséquences ?', 'Le conditionnement opérant', 'Les conséquences d’un comportement influencent sa fréquence future.', 1, '6-learning'),
  row('positive-reinforcement', 'Apprentissage', 'Que fait un renforcement positif dans le conditionnement opérant ?', 'Il ajoute une conséquence qui augmente la fréquence d’un comportement', 'Le mot positif signifie ici l’ajout d’un stimulus, et renforcement signifie une augmentation du comportement.', 2, '6-learning'),
  row('negative-reinforcement', 'Apprentissage', 'Que fait un renforcement négatif dans le conditionnement opérant ?', 'Il retire une conséquence aversive et augmente la fréquence d’un comportement', 'Négatif signifie retrait ; ce concept ne désigne pas une punition.', 2, '6-learning'),
  row('algorithm-definition', 'Cognition', 'Qu’est-ce qu’un algorithme en résolution de problèmes ?', 'Une procédure systématique qui peut conduire à une solution', 'Un algorithme suit des étapes définies, contrairement à une stratégie fondée sur une intuition rapide.', 1, '7-thinking-and-intelligence'),
  row('heuristic-definition', 'Cognition', 'Qu’est-ce qu’une heuristique ?', 'Une règle pratique qui simplifie la résolution d’un problème', 'Une heuristique peut accélérer la décision mais ne garantit pas toujours une solution correcte.', 1, '7-thinking-and-intelligence'),
  row('confirmation-bias', 'Cognition', 'Que décrit le biais de confirmation ?', 'La tendance à rechercher ou privilégier les informations compatibles avec ses croyances', 'Ce biais peut influencer la recherche, l’interprétation et le rappel d’informations.', 1, '7-thinking-and-intelligence'),
  row('fluid-intelligence', 'Intelligence', 'Que désigne l’intelligence fluide ?', 'La capacité à résoudre de nouveaux problèmes indépendamment des connaissances apprises', 'Elle concerne notamment le raisonnement face à des situations nouvelles.', 2, '7-thinking-and-intelligence'),
  row('crystallized-intelligence', 'Intelligence', 'Que désigne l’intelligence cristallisée ?', 'Les connaissances et compétences acquises', 'Elle s’appuie sur l’expérience, l’apprentissage et le vocabulaire accumulé.', 1, '7-thinking-and-intelligence'),
  row('encoding-memory', 'Mémoire', 'Quelle étape transforme une information en représentation pouvant être conservée ?', 'L’encodage', 'L’encodage est le traitement initial de l’information en vue de son stockage.', 1, '8-memory'),
  row('storage-memory', 'Mémoire', 'Quelle étape maintient une information au fil du temps ?', 'Le stockage', 'Le stockage conserve une représentation après l’encodage.', 1, '8-memory'),
  row('retrieval-memory', 'Mémoire', 'Quelle étape consiste à accéder à une information mémorisée ?', 'La récupération', 'La récupération rend une information stockée disponible à la conscience ou à la tâche.', 1, '8-memory'),
  row('working-memory', 'Mémoire', 'Que permet principalement la mémoire de travail ?', 'Maintenir et manipuler temporairement des informations', 'La mémoire de travail soutient des tâches comme le raisonnement et la compréhension.', 1, '8-memory'),
  row('episodic-memory', 'Mémoire', 'Que contient principalement la mémoire épisodique ?', 'Des souvenirs d’événements vécus situés dans un contexte', 'La mémoire épisodique concerne des épisodes personnels avec un contexte temporel et spatial.', 1, '8-memory'),
  row('teratogen-definition', 'Développement', 'Qu’est-ce qu’un tératogène ?', 'Un facteur environnemental susceptible d’affecter le développement prénatal', 'Le terme désigne des influences prénatales pouvant perturber le développement, selon leur dose et le moment d’exposition.', 2, '9-lifespan-development'),
  row('attachment-definition', 'Développement', 'Que désigne l’attachement en psychologie du développement ?', 'Le lien affectif durable entre un enfant et une figure qui prend soin de lui', 'La théorie de l’attachement étudie la formation et la fonction de liens affectifs précoces.', 1, '9-lifespan-development'),
  row('sensorimotor-stage', 'Développement', 'Quelle période correspond au stade sensori-moteur de Piaget ?', 'La période où l’enfant apprend principalement par ses actions et ses sens', 'Le stade sensori-moteur décrit les débuts du développement cognitif selon Piaget.', 1, '9-lifespan-development'),
  row('object-permanence', 'Développement', 'Que signifie la permanence de l’objet ?', 'Comprendre qu’un objet existe même lorsqu’il n’est plus visible', 'Cette compréhension marque une acquisition cognitive étudiée dans le développement du jeune enfant.', 1, '9-lifespan-development'),
  row('adolescent-identity', 'Développement', 'Quelle question Erikson associe-t-il principalement à l’adolescence ?', 'La construction de l’identité', 'Dans sa théorie psychosociale, l’adolescence est liée au conflit entre identité et confusion des rôles.', 1, '9-lifespan-development'),
  row('intrinsic-motivation', 'Motivation', 'Qu’est-ce que la motivation intrinsèque ?', 'Le fait d’agir pour l’intérêt ou le plaisir inhérent à l’activité', 'L’activité est réalisée pour elle-même plutôt que principalement pour une récompense externe.', 1, '10-emotion-and-motivation'),
  row('extrinsic-motivation', 'Motivation', 'Qu’est-ce que la motivation extrinsèque ?', 'Le fait d’agir en vue d’une conséquence externe', 'Une récompense, une note ou l’évitement d’une sanction sont des conséquences externes possibles.', 1, '10-emotion-and-motivation'),
  row('homeostasis-motivation', 'Motivation', 'Quel principe explique qu’un besoin physiologique puisse motiver un comportement visant à rétablir un équilibre ?', 'L’homéostasie', 'L’homéostasie désigne le maintien de conditions internes relativement stables.', 1, '10-emotion-and-motivation'),
  row('james-lange-theory', 'Émotion', 'Selon la théorie de James-Lange, comment l’émotion est-elle liée à la réaction corporelle ?', 'L’expérience émotionnelle suit la perception de changements corporels', 'Cette théorie propose que l’interprétation des réactions physiologiques participe à l’expérience émotionnelle.', 2, '10-emotion-and-motivation'),
  row('facial-feedback', 'Émotion', 'Que propose l’hypothèse du feedback facial ?', 'Les expressions faciales peuvent contribuer à l’expérience émotionnelle', 'Selon cette hypothèse, les informations provenant des muscles faciaux peuvent influencer l’émotion ressentie.', 2, '10-emotion-and-motivation'),
  row('trait-personality', 'Personnalité', 'Qu’est-ce qu’un trait de personnalité ?', 'Une tendance relativement stable à penser, ressentir ou agir d’une certaine manière', 'Les traits décrivent des différences individuelles relativement durables.', 1, '11-personality'),
  row('big-five-openness', 'Personnalité', 'À quoi renvoie l’ouverture dans le modèle des Big Five ?', 'À la curiosité et à l’intérêt pour la nouveauté et les idées', 'L’ouverture est associée à l’imagination, la curiosité et la préférence pour la variété.', 1, '11-personality'),
  row('big-five-conscientiousness', 'Personnalité', 'À quoi renvoie la conscienciosité dans le modèle des Big Five ?', 'À l’organisation, la persévérance et le sens des responsabilités', 'La conscienciosité décrit notamment la tendance à être organisé et orienté vers les objectifs.', 1, '11-personality'),
  row('big-five-extraversion', 'Personnalité', 'À quoi renvoie l’extraversion dans le modèle des Big Five ?', 'À la sociabilité et à la recherche de stimulation sociale', 'L’extraversion est généralement liée à l’enthousiasme, à l’affirmation de soi et à la sociabilité.', 1, '11-personality'),
  row('self-efficacy', 'Personnalité', 'Que désigne le sentiment d’efficacité personnelle chez Bandura ?', 'La croyance en sa capacité à réussir une action ou une tâche', 'Il s’agit d’une croyance sur ses propres capacités dans une situation donnée, pas d’une mesure générale de valeur personnelle.', 2, '11-personality'),
  row('social-norm', 'Social', 'Qu’est-ce qu’une norme sociale ?', 'Une règle ou attente partagée concernant les comportements', 'Les normes indiquent ce qui est considéré comme approprié dans un groupe ou une situation.', 1, '12-social-psychology'),
  row('conformity-definition', 'Social', 'Que signifie la conformité en psychologie sociale ?', 'Modifier son comportement ou son jugement pour correspondre à un groupe', 'La conformité peut résulter d’une influence réelle ou perçue du groupe.', 1, '12-social-psychology'),
  row('obedience-definition', 'Social', 'Que désigne l’obéissance dans les études d’influence sociale ?', 'Le fait de suivre une demande ou un ordre d’une autorité', 'L’obéissance concerne une influence provenant d’une figure perçue comme autorité.', 1, '12-social-psychology'),
  row('fundamental-attribution-error', 'Social', 'Que décrit l’erreur fondamentale d’attribution ?', 'La tendance à surestimer les causes personnelles du comportement d’autrui', 'L’observateur peut sous-estimer l’influence de la situation sur le comportement d’une autre personne.', 2, '12-social-psychology'),
  row('cognitive-dissonance', 'Social', 'Que désigne la dissonance cognitive ?', 'Un état de tension lié à des cognitions ou comportements incompatibles', 'La théorie prévoit une motivation à réduire l’incompatibilité perçue entre attitudes et actions.', 1, '12-social-psychology'),
  row('organizational-psychology', 'Travail', 'Quel est l’objet général de la psychologie industrielle et organisationnelle ?', 'L’étude des comportements au travail et dans les organisations', 'Ce domaine examine notamment la sélection, la performance, la motivation et les relations au travail.', 1, '13-industrial-organizational-psychology'),
  row('job-analysis', 'Travail', 'Que décrit une analyse de poste ?', 'Les tâches, responsabilités et exigences d’un emploi', 'L’analyse de poste sert à décrire le travail et les compétences nécessaires à sa réalisation.', 1, '13-industrial-organizational-psychology'),
  row('structured-interview', 'Travail', 'Qu’est-ce qu’un entretien structuré de sélection ?', 'Un entretien utilisant les mêmes questions et critères pour les candidats', 'La standardisation facilite une comparaison plus cohérente entre candidats.', 2, '13-industrial-organizational-psychology'),
  row('transformational-leadership', 'Travail', 'Que cherche à produire le leadership transformationnel ?', 'Une mobilisation autour d’une vision et d’un changement', 'Ce style de leadership met l’accent sur la vision, l’inspiration et la transformation collective.', 2, '13-industrial-organizational-psychology'),
  row('burnout-dimensions', 'Travail', 'Quelles dimensions sont classiquement associées à l’épuisement professionnel dans le manuel ?', 'L’épuisement, le cynisme et un sentiment d’inefficacité', 'Le manuel présente ces dimensions comme des caractéristiques conceptuelles du burnout, sans constituer un outil de diagnostic.', 2, '14-stress-lifestyle-and-health'),
  row('stress-stressor', 'Stress', 'Comment appelle-t-on un événement ou une situation qui déclenche une réponse de stress ?', 'Un stresseur', 'Un stresseur est une demande ou un événement évalué comme exigeant ou menaçant.', 1, '14-stress-lifestyle-and-health'),
  row('fight-flight', 'Stress', 'Que décrit la réponse de lutte ou de fuite ?', 'Une mobilisation physiologique face à une menace perçue', 'Cette réponse prépare l’organisme à agir rapidement face à une situation évaluée comme dangereuse.', 1, '14-stress-lifestyle-and-health'),
  row('general-adaptation', 'Stress', 'Quels sont les trois stades du syndrome général d’adaptation de Selye ?', 'Alarme, résistance et épuisement', 'Le modèle décrit une séquence de réponse physiologique à un stress prolongé.', 2, '14-stress-lifestyle-and-health'),
  row('social-support-stress', 'Santé', 'Quel facteur social est présenté comme pouvant aider à faire face au stress ?', 'Le soutien social', 'Les relations de soutien peuvent fournir des ressources émotionnelles, informationnelles ou pratiques.', 1, '14-stress-lifestyle-and-health'),
  row('diagnostic-classification', 'Histoire des concepts', 'À quoi sert principalement une classification des troubles psychologiques dans un manuel ?', 'À organiser et décrire des ensembles de symptômes selon des critères définis', 'Une classification fournit un langage commun ; elle ne remplace pas une évaluation clinique individualisée.', 2, '15-psychological-disorders'),
  row('anxiety-fear-distinction', 'Concepts', 'Quelle distinction générale le manuel fait-il entre peur et anxiété ?', 'La peur concerne une menace immédiate, tandis que l’anxiété anticipe une menace possible', 'Cette distinction porte sur l’objet et le moment de la menace perçue.', 2, '15-psychological-disorders'),
  row('stigma-definition', 'Concepts', 'Qu’est-ce que la stigmatisation ?', 'Un ensemble d’attitudes et de croyances négatives attribuées à un groupe', 'La stigmatisation peut produire des préjugés, de la discrimination et des obstacles à la demande d’aide.', 1, '15-psychological-disorders'),
  row('diathesis-stress', 'Concepts', 'Que propose le modèle diathèse-stress ?', 'Que certaines vulnérabilités interagissent avec des facteurs de stress', 'Le modèle met l’accent sur une interaction plutôt que sur une cause unique.', 2, '15-psychological-disorders'),
  row('biopsychosocial-model', 'Concepts', 'Que combine le modèle biopsychosocial pour comprendre la santé et les difficultés psychologiques ?', 'Des facteurs biologiques, psychologiques et sociaux', 'Ce modèle considère plusieurs niveaux d’influence qui interagissent.', 1, '15-psychological-disorders'),
  row('psychotherapy-definition', 'Thérapies', 'Comment définit-on généralement la psychothérapie ?', 'Un traitement psychologique fondé sur une relation et des méthodes structurées', 'Les psychothérapies utilisent différentes approches et objectifs définis avec un professionnel qualifié.', 1, '16-therapy-and-treatment'),
  row('cognitive-behavioral-therapy', 'Thérapies', 'Sur quoi la thérapie cognitivo-comportementale travaille-t-elle notamment ?', 'Sur les pensées, les émotions et les comportements liés à des difficultés', 'La TCC examine les liens entre ces éléments et utilise des exercices structurés.', 1, '16-therapy-and-treatment'),
  row('exposure-therapy', 'Thérapies', 'Quel principe général caractérise une thérapie d’exposition ?', 'Un contact progressif et encadré avec des situations redoutées', 'L’exposition est planifiée et encadrée dans certaines approches, avec des objectifs définis par le traitement.', 2, '16-therapy-and-treatment'),
  row('humanistic-therapy', 'Thérapies', 'Quel accent les approches humanistes mettent-elles généralement ?', 'L’expérience subjective et le potentiel de croissance de la personne', 'Ces approches accordent une place centrale à l’expérience vécue et à la relation thérapeutique.', 1, '16-therapy-and-treatment'),
  row('placebo-effect', 'Évaluation', 'Que désigne l’effet placebo dans un essai contrôlé ?', 'Une amélioration associée aux attentes ou au contexte du traitement plutôt qu’à son principe actif', 'Le placebo sert de comparaison méthodologique et ne permet pas à lui seul d’expliquer toutes les améliorations observées.', 2, '16-therapy-and-treatment'),
  row('descriptive-research', 'Méthode', 'Quel est l’objectif principal d’une recherche descriptive ?', 'Décrire un phénomène ou un comportement', 'Une recherche descriptive documente ce qui se passe sans nécessairement expliquer une cause.', 1, '2-psychological-research'),
  row('random-assignment', 'Expérimentation', 'Que permet principalement l’affectation aléatoire des participants aux groupes ?', 'De rendre les groupes comparables en moyenne au début de l’étude', 'L’affectation aléatoire réduit le risque que des différences préexistantes expliquent les résultats.', 2, '2-psychological-research'),
  row('placebo-control', 'Méthode', 'Pourquoi utiliser un groupe placebo dans un essai contrôlé ?', 'Pour comparer le traitement à une condition sans principe actif mais avec un contexte similaire', 'Cette comparaison aide à distinguer l’effet spécifique du traitement des attentes et du contexte.', 2, '2-psychological-research'),
  row('central-nervous-system', 'Biopsychologie', 'Quelles structures composent le système nerveux central ?', 'L’encéphale et la moelle épinière', 'Le système nerveux central reçoit et traite des informations avec l’encéphale et la moelle épinière.', 1, '3-biopsychology'),
  row('autonomic-nervous-system', 'Biopsychologie', 'Quel système régule notamment des fonctions internes involontaires ?', 'Le système nerveux autonome', 'Le système nerveux autonome participe à la régulation de fonctions comme le rythme cardiaque et la digestion.', 1, '3-biopsychology'),
  row('glial-cells', 'Biopsychologie', 'Quel rôle général les cellules gliales jouent-elles dans le système nerveux ?', 'Elles soutiennent, nourrissent et protègent les neurones', 'Les cellules gliales remplissent plusieurs fonctions de soutien et de régulation autour des neurones.', 1, '3-biopsychology'),
  row('top-down-processing', 'Perception', 'Que signifie un traitement perceptif de haut en bas ?', 'L’influence des connaissances et attentes sur l’interprétation sensorielle', 'Les expériences et attentes peuvent orienter la manière dont une information sensorielle est interprétée.', 2, '5-sensation-and-perception'),
  row('bottom-up-processing', 'Perception', 'Que signifie un traitement perceptif de bas en haut ?', 'La construction d’une perception à partir des caractéristiques du stimulus', 'Le traitement commence par les informations sensorielles disponibles avant leur interprétation plus globale.', 2, '5-sensation-and-perception'),
  row('observational-learning', 'Apprentissage', 'Quel apprentissage se produit en observant le comportement d’un modèle ?', 'L’apprentissage par observation', 'L’observation peut permettre d’acquérir un comportement sans l’exécuter immédiatement.', 1, '6-learning'),
  row('latent-learning', 'Apprentissage', 'Que désigne un apprentissage latent ?', 'Un apprentissage qui n’est pas immédiatement visible par une performance', 'Une connaissance peut être acquise mais ne se manifester qu’ultérieurement ou dans des conditions adéquates.', 2, '6-learning'),
  row('semantic-memory', 'Mémoire', 'Que contient principalement la mémoire sémantique ?', 'Des connaissances générales et des faits', 'La mémoire sémantique n’est pas nécessairement liée au souvenir d’un épisode personnel précis.', 1, '8-memory'),
  row('source-monitoring', 'Mémoire', 'Que désigne le contrôle de la source en mémoire ?', 'L’identification de l’origine d’une information rappelée', 'Il consiste à déterminer si une information vient d’une expérience, d’une conversation, d’une lecture ou d’une autre source.', 2, '8-memory'),
  row('secure-attachment', 'Développement', 'Quel comportement caractérise généralement un attachement sécure dans la situation étrange ?', 'L’enfant utilise la figure d’attachement comme base de sécurité et peut être réconforté à son retour', 'La classification décrit un comportement observé dans une procédure expérimentale, pas un jugement global sur l’enfant.', 2, '9-lifespan-development'),
  row('intrinsic-extrinsic-distinction', 'Motivation', 'Quelle différence distingue motivation intrinsèque et extrinsèque ?', 'La première vient de l’intérêt pour l’activité, la seconde d’une conséquence externe', 'La distinction porte sur la source de la motivation, et une activité peut être influencée par les deux.', 1, '10-emotion-and-motivation'),
  row('agreeableness-big-five', 'Personnalité', 'À quoi renvoie l’agréabilité dans le modèle des Big Five ?', 'À des tendances de coopération, de confiance et de considération d’autrui', 'L’agréabilité décrit une dimension de différences individuelles, pas une qualité morale absolue.', 1, '11-personality'),
  row('bystander-effect', 'Social', 'Que décrit l’effet du témoin ?', 'La diminution possible de l’aide apportée quand d’autres témoins sont présents', 'La présence d’autres personnes peut influencer l’interprétation de la situation et la diffusion de la responsabilité.', 2, '12-social-psychology'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/psychology-2e/pages/${chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_PSYCHOLOGY_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-psychology-openstax-${id}`;
  return {
    id: `psychology-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Psychologie',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['psychologie', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_PSYCHOLOGY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-psychology-2e-facts',
  questions: VERIFIED_PSYCHOLOGY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/psychology-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent claims against the cited chapter; no generated variants; no clinical advice',
  status: 'approved',
};

export default VERIFIED_PSYCHOLOGY_OPENSTAX_BATCH;
