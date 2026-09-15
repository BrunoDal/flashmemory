import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent foundational sociology concepts checked against OpenStax
 * Introduction to Sociology 3e (CC BY 4.0). Each row represents one claim;
 * no wording variants or current statistics are generated here.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Introduction to Sociology 3e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax chapter';

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
  row('sociology-definition', 'Fondamentaux', 'Que cherche à étudier la sociologie ?', 'La vie sociale, les changements sociaux et les causes et conséquences sociales du comportement humain', 'La sociologie examine les interactions et les structures qui organisent la vie collective.', 1, '1-introduction'),
  row('sociological-imagination', 'Fondamentaux', 'Que permet l’imagination sociologique ?', 'Relier les expériences personnelles aux structures et aux enjeux sociaux', 'Elle met en relation les biographies individuelles et le contexte historique et social.', 1, '1-introduction'),
  row('social-facts', 'Fondamentaux', 'Comment Durkheim appelle-t-il les manières d’agir et de penser qui s’imposent aux individus ?', 'Les faits sociaux', 'Les faits sociaux sont des façons collectives d’agir, de penser et de sentir qui exercent une contrainte sociale.', 2, '1-introduction'),
  row('micro-sociology', 'Perspectives', 'Que privilégie la microsociologie ?', 'L’étude des interactions sociales à petite échelle', 'Elle observe notamment les échanges entre personnes et les significations produites dans les situations ordinaires.', 1, '1-introduction'),
  row('macro-sociology', 'Perspectives', 'Que privilégie la macrosociologie ?', 'L’étude des structures et des processus sociaux à grande échelle', 'Elle s’intéresse aux institutions, aux systèmes sociaux et aux changements qui touchent les sociétés.', 1, '1-introduction'),

  row('sociological-question', 'Méthodes', 'Qu’est-ce qu’une question sociologique ?', 'Une question qui examine les rapports entre les individus et la vie sociale', 'Elle dépasse l’explication purement individuelle pour rechercher des régularités et des contextes sociaux.', 1, '2-sociological-research'),
  row('hypothesis-sociology', 'Méthodes', 'Qu’est-ce qu’une hypothèse en recherche sociologique ?', 'Une proposition testable sur une relation entre des variables', 'Une hypothèse peut être confrontée à des observations recueillies selon une méthode explicite.', 1, '2-sociological-research'),
  row('quantitative-research', 'Méthodes', 'Que caractérise une recherche quantitative ?', 'L’utilisation de données numériques pour analyser des phénomènes sociaux', 'Les méthodes quantitatives permettent notamment de comparer des groupes et de rechercher des associations mesurables.', 1, '2-sociological-research'),
  row('qualitative-research', 'Méthodes', 'Que caractérise une recherche qualitative ?', 'L’étude détaillée des significations et des expériences sociales', 'Les entretiens, observations et analyses de contenu peuvent produire des données qualitatives.', 1, '2-sociological-research'),
  row('sample-population', 'Méthodes', 'Quelle différence existe entre une population et un échantillon ?', 'La population est l’ensemble étudié et l’échantillon en est une partie sélectionnée', 'L’échantillon sert à recueillir des données sans interroger nécessairement toute la population.', 1, '2-sociological-research'),

  row('culture-definition', 'Culture', 'Comment définir la culture en sociologie ?', 'L’ensemble des croyances, valeurs, normes, pratiques et objets partagés par un groupe', 'La culture est apprise et transmise socialement plutôt qu’héritée biologiquement.', 1, '3-culture'),
  row('material-culture', 'Culture', 'Que comprend la culture matérielle ?', 'Les objets et les technologies produits et utilisés par une société', 'Les vêtements, outils et bâtiments sont des exemples d’éléments matériels de la culture.', 1, '3-culture'),
  row('nonmaterial-culture', 'Culture', 'Que comprend la culture immatérielle ?', 'Les idées, valeurs, normes et symboles d’une société', 'Elle concerne les dimensions abstraites qui donnent du sens aux pratiques sociales.', 1, '3-culture'),
  row('cultural-relativism', 'Culture', 'Que signifie le relativisme culturel ?', 'Comprendre une culture selon ses propres références plutôt que celles d’une autre culture', 'Cette démarche suspend le jugement ethnocentrique pour analyser les pratiques dans leur contexte.', 2, '3-culture'),
  row('ethnocentrism', 'Culture', 'Qu’est-ce que l’ethnocentrisme ?', 'La tendance à évaluer une autre culture à partir des normes de sa propre culture', 'L’ethnocentrisme peut conduire à considérer à tort sa propre culture comme la norme universelle.', 1, '3-culture'),

  row('socialization', 'Socialisation', 'Qu’est-ce que la socialisation ?', 'Le processus par lequel les personnes apprennent les normes et les attentes de leur société', 'Elle contribue à la formation des identités et à l’apprentissage de la vie sociale.', 1, '5-socialization'),
  row('primary-socialization', 'Socialisation', 'Quand la socialisation primaire se produit-elle principalement ?', 'Pendant l’enfance', 'La famille et les premières relations jouent un rôle important dans les apprentissages sociaux de l’enfant.', 1, '5-socialization'),
  row('secondary-socialization', 'Socialisation', 'Que désigne la socialisation secondaire ?', 'Les apprentissages de rôles et de normes dans des contextes sociaux ultérieurs', 'L’école, le travail et d’autres institutions contribuent à la socialisation au cours de la vie.', 1, '5-socialization'),
  row('looking-glass-self', 'Socialisation', 'Que décrit le concept de soi-miroir de Cooley ?', 'La formation de l’image de soi à partir de la façon dont on imagine le regard des autres', 'Les réactions réelles ou supposées d’autrui participent à la construction de l’identité.', 2, '5-socialization'),
  row('agents-socialization', 'Socialisation', 'Que sont les agents de socialisation ?', 'Les personnes, groupes et institutions qui transmettent des normes et des valeurs', 'La famille, les pairs, l’école et les médias peuvent tous participer à la socialisation.', 1, '5-socialization'),

  row('status-role', 'Interaction', 'Quelle différence existe entre un statut et un rôle ?', 'Le statut est une position sociale et le rôle est l’ensemble des comportements attendus de cette position', 'Les rôles correspondent à la dimension dynamique des positions occupées dans la société.', 1, '4-society-and-social-interaction'),
  row('ascribed-status', 'Interaction', 'Qu’est-ce qu’un statut assigné ?', 'Un statut attribué sans choix volontaire, souvent à la naissance ou indépendamment de la volonté', 'L’âge ou la parenté sont des exemples de dimensions pouvant être assignées.', 2, '4-society-and-social-interaction'),
  row('achieved-status', 'Interaction', 'Qu’est-ce qu’un statut acquis ?', 'Un statut obtenu ou modifié grâce à des actions ou des choix', 'Une profession ou un diplôme peuvent constituer des statuts acquis.', 1, '4-society-and-social-interaction'),
  row('master-status', 'Interaction', 'Que désigne un statut principal ?', 'Un statut qui devient particulièrement important pour définir l’identité sociale d’une personne', 'Son importance dépend du contexte et peut influencer la manière dont les autres perçoivent la personne.', 2, '4-society-and-social-interaction'),
  row('dramaturgy', 'Interaction', 'Quelle perspective compare l’interaction sociale à une représentation théâtrale ?', 'La dramaturgie d’Erving Goffman', 'Cette perspective analyse les présentations de soi et les impressions gérées dans les interactions.', 1, '4-society-and-social-interaction'),

  row('group-definition', 'Groupes', 'Qu’est-ce qu’un groupe social ?', 'Un ensemble de personnes qui interagissent et partagent un sentiment d’appartenance', 'Le simple fait d’être plusieurs au même endroit ne suffit pas à constituer un groupe social.', 1, '6-groups-and-organizations'),
  row('primary-group', 'Groupes', 'Qu’est-ce qu’un groupe primaire ?', 'Un groupe caractérisé par des relations proches, personnelles et durables', 'La famille et les amis proches sont des exemples classiques de groupes primaires.', 1, '6-groups-and-organizations'),
  row('secondary-group', 'Groupes', 'Qu’est-ce qu’un groupe secondaire ?', 'Un groupe orienté vers un objectif avec des relations généralement plus impersonnelles', 'Une classe ou une équipe de travail peuvent fonctionner comme des groupes secondaires.', 1, '6-groups-and-organizations'),
  row('in-group-out-group', 'Groupes', 'Que distinguent les notions d’endogroupe et d’exogroupe ?', 'Le groupe auquel on s’identifie et les groupes auxquels on ne s’identifie pas', 'Cette distinction peut influencer les sentiments d’appartenance et les frontières sociales.', 1, '6-groups-and-organizations'),
  row('bureaucracy', 'Organisations', 'Qu’est-ce qu’une bureaucratie selon la sociologie des organisations ?', 'Une organisation formelle fondée sur des règles, une hiérarchie et une division du travail', 'La bureaucratie coordonne l’action au moyen de procédures et de responsabilités définies.', 1, '6-groups-and-organizations'),

  row('deviance-definition', 'Déviance', 'Comment définir la déviance en sociologie ?', 'La violation d’une norme sociale', 'La déviance dépend des normes d’un groupe et du contexte dans lequel un comportement est évalué.', 1, '7-deviance-social-control-and-crime'),
  row('social-control', 'Déviance', 'Qu’est-ce que le contrôle social ?', 'Les mécanismes qui encouragent la conformité aux normes', 'Les sanctions formelles et informelles sont des moyens de contrôle social.', 1, '7-deviance-social-control-and-crime'),
  row('formal-sanction', 'Déviance', 'Qu’est-ce qu’une sanction formelle ?', 'Une récompense ou une punition appliquée par une institution selon des règles explicites', 'Une amende ou un diplôme sont des exemples de sanctions formelles.', 1, '7-deviance-social-control-and-crime'),
  row('labeling-theory', 'Déviance', 'Que soutient la théorie de l’étiquetage ?', 'Que les réactions sociales et les étiquettes peuvent contribuer à définir un comportement comme déviant', 'L’attention porte sur les processus de désignation autant que sur l’acte lui-même.', 2, '7-deviance-social-control-and-crime'),
  row('stigma', 'Déviance', 'Qu’est-ce qu’un stigmate ?', 'Un attribut socialement discréditant qui réduit une personne aux yeux des autres', 'Le stigmate est produit dans une relation sociale et peut entraîner exclusion ou disqualification.', 2, '7-deviance-social-control-and-crime'),

  row('social-stratification', 'Stratification', 'Qu’est-ce que la stratification sociale ?', 'La hiérarchisation durable de catégories de personnes dans une société', 'Elle organise l’accès inégal aux ressources, au pouvoir et au prestige.', 1, '9-social-stratification-in-the-united-states'),
  row('social-mobility', 'Stratification', 'Que désigne la mobilité sociale ?', 'Le déplacement d’une personne ou d’un groupe dans la hiérarchie sociale', 'La mobilité peut être ascendante, descendante ou horizontale selon la position comparée.', 1, '9-social-stratification-in-the-united-states'),
  row('intragenerational-mobility', 'Stratification', 'Qu’est-ce que la mobilité intragénérationnelle ?', 'Le changement de position sociale d’une personne au cours de sa propre vie', 'Elle compare les positions occupées par la même personne à différents moments.', 2, '9-social-stratification-in-the-united-states'),
  row('intergenerational-mobility', 'Stratification', 'Qu’est-ce que la mobilité intergénérationnelle ?', 'La différence de position sociale entre une génération et la génération précédente', 'Elle compare par exemple la position d’un adulte à celle de ses parents.', 2, '9-social-stratification-in-the-united-states'),
  row('meritocracy', 'Stratification', 'Que désigne une méritocratie ?', 'Un système qui attribue les positions selon les réalisations et les capacités supposées', 'Le concept décrit un principe d’attribution, dont la réalisation peut être discutée empiriquement.', 2, '9-social-stratification-in-the-united-states'),

  row('race-social-construction', 'Race et ethnicité', 'Comment la sociologie considère-t-elle généralement la race ?', 'Comme une catégorie sociale construite et variable selon les sociétés et les époques', 'La signification sociale des différences physiques est produite par des processus historiques et institutionnels.', 2, '11-race-and-ethnicity'),
  row('ethnicity-definition', 'Race et ethnicité', 'Qu’est-ce qu’une ethnicité ?', 'Une identité fondée sur une culture, une histoire, une langue ou une origine partagées', 'L’ethnicité renvoie à une appartenance culturelle et sociale, pas à une classification biologique fixe.', 1, '11-race-and-ethnicity'),
  row('minority-group', 'Race et ethnicité', 'Comment définir un groupe minoritaire en sociologie ?', 'Un groupe qui subit une position sociale subordonnée et ne se définit pas seulement par sa taille', 'Le terme renvoie à des rapports de pouvoir et à une expérience d’inégalité sociale.', 2, '11-race-and-ethnicity'),
  row('prejudice-discrimination', 'Race et ethnicité', 'Quelle différence existe entre préjugé et discrimination ?', 'Le préjugé est une attitude et la discrimination est un traitement ou un comportement', 'Une attitude négative peut exister sans acte discriminatoire, même si les deux peuvent être liés.', 1, '11-race-and-ethnicity'),
  row('institutional-racism', 'Race et ethnicité', 'Que désigne le racisme institutionnel ?', 'Des inégalités produites ou maintenues par le fonctionnement d’institutions', 'L’analyse porte sur des règles et pratiques qui peuvent avoir des effets inégaux même sans intention individuelle explicite.', 2, '11-race-and-ethnicity'),

  row('sex-gender-distinction', 'Genre', 'Quelle distinction la sociologie fait-elle entre sexe et genre ?', 'Le sexe renvoie à des caractéristiques biologiques et le genre aux significations et attentes sociales', 'Les deux notions sont liées mais ne désignent pas le même niveau d’analyse.', 1, '12-gender-sex-and-sexuality'),
  row('gender-socialization', 'Genre', 'Qu’est-ce que la socialisation de genre ?', 'L’apprentissage social des attentes associées au genre', 'Les familles, pairs, écoles et médias peuvent transmettre des normes de genre.', 1, '12-gender-sex-and-sexuality'),
  row('gender-role', 'Genre', 'Qu’est-ce qu’un rôle de genre ?', 'Un ensemble d’attentes sociales liées à un genre dans un contexte donné', 'Les rôles de genre varient selon les cultures, les époques et les situations.', 1, '12-gender-sex-and-sexuality'),
  row('patriarchy', 'Genre', 'Que désigne le patriarcat ?', 'Un système social dans lequel le pouvoir est historiquement concentré entre les mains des hommes', 'Le concept analyse une structure de pouvoir, et non les caractéristiques de chaque individu.', 2, '12-gender-sex-and-sexuality'),
  row('sexuality-social-construction', 'Sexualité', 'Que signifie dire que la sexualité est socialement construite ?', 'Que ses catégories et significations sont façonnées par les normes et institutions sociales', 'Cela n’implique pas que les expériences individuelles soient irréelles ou choisies librement.', 2, '12-gender-sex-and-sexuality'),

  row('family-definition', 'Famille', 'Comment la sociologie définit-elle une famille ?', 'Un groupe social lié par des relations de parenté, de partenariat ou de soins', 'Les formes familiales varient entre sociétés et au cours du temps.', 1, '14-marriage-and-family'),
  row('kinship', 'Famille', 'Que désigne la parenté ?', 'Un système de relations sociales fondées sur la naissance, le mariage ou l’adoption', 'La parenté organise des droits, des devoirs et des appartenances dans de nombreuses sociétés.', 1, '14-marriage-and-family'),
  row('monogamy', 'Famille', 'Qu’est-ce que la monogamie ?', 'Une forme de partenariat ou de mariage entre deux personnes', 'La monogamie est une forme parmi d’autres d’organisation conjugale étudiée par la sociologie.', 1, '14-marriage-and-family'),
  row('polygamy', 'Famille', 'Qu’est-ce que la polygamie ?', 'Une forme de mariage ou de partenariat impliquant plus de deux conjoints', 'Le terme général recouvre notamment la polygynie et la polyandrie.', 1, '14-marriage-and-family'),
  row('endogamy-exogamy', 'Famille', 'Que distinguent endogamie et exogamie ?', 'L’endogamie privilégie le mariage dans un groupe et l’exogamie hors de ce groupe', 'Ces règles organisent les frontières de la parenté et les alliances sociales.', 2, '14-marriage-and-family'),

  row('education-social-institution', 'Éducation', 'Pourquoi l’éducation est-elle une institution sociale ?', 'Parce qu’elle organise la transmission des connaissances et la socialisation', 'L’école transmet des savoirs mais aussi des normes et des compétences sociales.', 1, '16-education'),
  row('hidden-curriculum', 'Éducation', 'Que désigne le curriculum caché ?', 'Les leçons implicites de normes et de comportements transmises par l’école', 'Les élèves apprennent aussi des attentes relatives au temps, à l’autorité et à la coopération.', 2, '16-education'),
  row('tracking', 'Éducation', 'Qu’est-ce que le tracking scolaire ?', 'La répartition des élèves dans des parcours ou niveaux distincts au sein d’un système scolaire', 'Cette organisation peut orienter les expériences et les possibilités scolaires.', 2, '16-education'),
  row('cultural-capital', 'Éducation', 'Que désigne le capital culturel ?', 'Des connaissances, dispositions et compétences valorisées par une société ou une institution', 'Le capital culturel peut influencer la manière dont une personne est évaluée dans le système scolaire.', 2, '16-education'),
  row('credentialism', 'Éducation', 'Qu’est-ce que le credentialisme ?', 'La place accordée aux diplômes comme titres requis pour accéder à des positions', 'Le diplôme peut devenir un filtre institutionnel au-delà des compétences directement nécessaires.', 2, '16-education'),

  row('religion-definition', 'Religion', 'Comment définir la religion en sociologie ?', 'Un système organisé de croyances, symboles, pratiques et expériences portant sur le sacré', 'La sociologie étudie les fonctions et formes sociales de la religion sans trancher sa vérité théologique.', 1, '15-religion'),
  row('sacred-profane', 'Religion', 'Que distinguent le sacré et le profane ?', 'Le sacré renvoie à ce qui est séparé ou vénéré et le profane à la vie ordinaire', 'Cette distinction est centrale dans l’analyse classique de Durkheim.', 1, '15-religion'),
  row('totemism', 'Religion', 'Qu’est-ce que le totémisme dans l’analyse de Durkheim ?', 'Un système où un symbole représente le groupe et fait l’objet d’une vénération collective', 'Le symbole sacré peut représenter la communauté elle-même.', 2, '15-religion'),
  row('secularization', 'Religion', 'Que désigne la sécularisation ?', 'La diminution de l’influence de la religion dans certaines institutions ou sphères sociales', 'La sécularisation ne signifie pas nécessairement la disparition de toute croyance religieuse.', 2, '15-religion'),
  row('religious-organization-types', 'Religion', 'Quels sont deux types d’organisation religieuse étudiés par les sociologues ?', 'L’Église et la secte', 'Ces catégories classiques décrivent notamment des différences d’organisation et de rapport à la société.', 2, '15-religion'),

  row('economy-definition', 'Travail', 'Qu’est-ce que l’économie comme institution sociale ?', 'L’institution qui organise la production, la distribution et la consommation des biens et services', 'Elle coordonne des activités nécessaires à la vie matérielle de la société.', 1, '18-work-and-the-economy'),
  row('alienation', 'Travail', 'Que désigne l’aliénation du travail chez Marx ?', 'La perte de contrôle et de sens du travailleur vis-à-vis de son activité et de son produit', 'Le concept décrit une relation sociale de production, pas un simple état psychologique.', 2, '18-work-and-the-economy'),
  row('emotional-labor', 'Travail', 'Qu’est-ce que le travail émotionnel ?', 'La gestion des émotions et de leur expression attendue dans le cadre du travail', 'Certains emplois demandent de produire ou de contenir des expressions émotionnelles selon des règles professionnelles.', 2, '18-work-and-the-economy'),
  row('unemployment-definition', 'Travail', 'Comment définir le chômage dans l’analyse sociale ?', 'La situation d’une personne sans emploi qui est disponible et cherche du travail', 'La définition distingue le chômage d’une absence volontaire du marché du travail.', 1, '18-work-and-the-economy'),

  row('politics-power', 'Politique', 'Qu’est-ce que le pouvoir en sociologie ?', 'La capacité d’imposer sa volonté dans une relation sociale, même face à une résistance', 'Le pouvoir peut être exercé par des individus, des groupes ou des institutions.', 1, '17-government-and-politics'),
  row('authority', 'Politique', 'Quelle différence existe entre pouvoir et autorité ?', 'L’autorité est un pouvoir considéré comme légitime', 'La légitimité explique pourquoi des personnes acceptent une directive ou une domination.', 1, '17-government-and-politics'),
  row('traditional-authority', 'Politique', 'Sur quoi repose l’autorité traditionnelle chez Weber ?', 'Sur la croyance dans le caractère légitime des traditions établies', 'Elle s’appuie sur l’ancienneté et la continuité des usages.', 2, '17-government-and-politics'),
  row('rational-legal-authority', 'Politique', 'Sur quoi repose l’autorité rationnelle-légale ?', 'Sur des règles formelles et le droit de ceux qui exercent une fonction', 'La légitimité vient des procédures et des normes impersonnelles plutôt que d’une personne particulière.', 2, '17-government-and-politics'),
  row('civil-society', 'Politique', 'Que désigne la société civile ?', 'L’espace des organisations et associations situées entre les individus, l’État et le marché', 'Les associations et mouvements peuvent permettre l’action collective hors des institutions étatiques.', 2, '17-government-and-politics'),

  row('health-social-construction', 'Santé', 'Que signifie analyser la santé comme une construction sociale ?', 'Que les définitions et expériences de la santé sont influencées par la société', 'Les normes, institutions, ressources et relations sociales façonnent la santé et la maladie.', 2, '19-health-and-medicine'),
  row('illness-disease', 'Santé', 'Quelle différence analytique existe entre maladie et expérience de la maladie ?', 'La maladie renvoie à une condition médicale et l’expérience de la maladie à son vécu social', 'La sociologie distingue le diagnostic biologique de la manière dont une personne vit et interprète son état.', 2, '19-health-and-medicine'),
  row('sick-role', 'Santé', 'Que décrit le rôle de malade de Parsons ?', 'Un ensemble d’attentes sociales associées à la maladie', 'Il inclut notamment une exemption temporaire de certaines responsabilités et l’obligation de rechercher de l’aide.', 2, '19-health-and-medicine'),
  row('medicalization', 'Santé', 'Qu’est-ce que la médicalisation ?', 'Le processus par lequel un problème est défini et traité comme un problème médical', 'La médicalisation transforme les catégories et les réponses institutionnelles appliquées à certains comportements.', 1, '19-health-and-medicine'),
  row('public-health', 'Santé', 'Que vise principalement la santé publique ?', 'La protection et l’amélioration de la santé des populations', 'Elle agit notamment par la prévention, la surveillance et des interventions collectives.', 1, '19-health-and-medicine'),

  row('demography', 'Population', 'Qu’est-ce que la démographie ?', 'L’étude de la taille, de la composition et de l’évolution des populations', 'Elle analyse notamment les naissances, les décès et les migrations.', 1, '20-population-urbanization-and-the-environment'),
  row('fertility-rate', 'Population', 'Que mesure le taux de fécondité ?', 'Le nombre de naissances rapporté à une population selon une période et une définition données', 'La fécondité concerne les naissances observées, distinctes de la capacité biologique à procréer.', 2, '20-population-urbanization-and-the-environment'),
  row('mortality-rate', 'Population', 'Que mesure le taux de mortalité ?', 'Le nombre de décès rapporté à une population selon une période donnée', 'Les comparaisons doivent tenir compte de la période et de la structure des populations.', 1, '20-population-urbanization-and-the-environment'),
  row('urbanization', 'Population', 'Qu’est-ce que l’urbanisation ?', 'Le processus par lequel une part croissante de la population vit dans des espaces urbains', 'L’urbanisation modifie les formes d’habitat, de travail et d’organisation sociale.', 1, '20-population-urbanization-and-the-environment'),
  row('environmental-sociology', 'Environnement', 'Que cherche à étudier la sociologie de l’environnement ?', 'Les relations réciproques entre les sociétés humaines et leur environnement', 'Elle analyse notamment la manière dont les institutions et les pratiques sociales transforment les milieux.', 1, '20-population-urbanization-and-the-environment'),

  row('collective-behavior', 'Changement social', 'Qu’est-ce qu’un comportement collectif ?', 'Une action ou réaction relativement spontanée de personnes qui ne forment pas nécessairement un groupe organisé', 'Les foules et les modes sont des formes étudiées de comportement collectif.', 2, '21-social-movements-and-social-change'),
  row('social-movement', 'Changement social', 'Qu’est-ce qu’un mouvement social ?', 'Une organisation ou un réseau qui cherche à provoquer ou empêcher un changement social', 'Les mouvements coordonnent des actions collectives autour d’objectifs communs.', 1, '21-social-movements-and-social-change'),
  row('alternative-movement', 'Changement social', 'Que vise généralement un mouvement social alternatif ?', 'Un changement limité du comportement de certaines personnes', 'Il cherche à modifier un aspect précis de la conduite plutôt qu’à transformer toute la société.', 2, '21-social-movements-and-social-change'),
  row('reform-movement', 'Changement social', 'Que vise un mouvement réformateur ?', 'Un changement partiel des structures ou des politiques sociales', 'Il cherche à modifier certaines règles sans renverser l’ensemble de l’ordre social.', 1, '21-social-movements-and-social-change'),
  row('revolutionary-movement', 'Changement social', 'Que vise un mouvement révolutionnaire ?', 'Une transformation profonde et globale de l’ordre social', 'Il se distingue d’un mouvement réformateur par l’ampleur du changement recherché.', 1, '21-social-movements-and-social-change'),
];

const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: `https://openstax.org/books/introduction-sociology-3e/pages/${chapter}`,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_SOCIOLOGY_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-sociology-openstax-${id}`;
  return {
    id: `sociology-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Sociologie',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['sociologie', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_SOCIOLOGY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-sociology-3e-facts',
  questions: VERIFIED_SOCIOLOGY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/introduction-sociology-3e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent claims against the cited chapter; no generated variants; no current statistics',
  status: 'approved',
};

export default VERIFIED_SOCIOLOGY_OPENSTAX_BATCH;
