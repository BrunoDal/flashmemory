import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent introductory-statistics concepts checked against OpenStax
 * Introductory Statistics 2e (CC BY 4.0). Each row is one concept, not a
 * wording variant. Chapter URLs are kept at question level so every claim
 * has an auditable source location.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Introductory Statistics 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax chapter';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('parameter-statistic', 'Données', 'Qu’est-ce qu’un paramètre ?', 'Une mesure numérique décrivant une population', 'Un paramètre concerne la population entière ; une statistique décrit généralement un échantillon.', 1, '1-introduction'),
  row('statistic-definition', 'Données', 'Qu’est-ce qu’une statistique ?', 'Une mesure numérique calculée à partir d’un échantillon', 'Une statistique peut servir à estimer un paramètre de la population.', 1, '1-introduction'),
  row('qualitative-variable', 'Données', 'Qu’est-ce qu’une variable qualitative ?', 'Une variable qui décrit une catégorie ou une qualité', 'Ses modalités sont des catégories plutôt que des mesures numériques ayant un sens arithmétique.', 1, '1-introduction'),
  row('quantitative-variable', 'Données', 'Qu’est-ce qu’une variable quantitative ?', 'Une variable exprimée par des valeurs numériques mesurables ou comptables', 'Les valeurs quantitatives peuvent être étudiées avec des résumés numériques appropriés.', 1, '1-introduction'),
  row('discrete-variable', 'Données', 'Qu’est-ce qu’une variable quantitative discrète ?', 'Une variable qui prend des valeurs séparées, souvent issues d’un dénombrement', 'Le nombre d’objets est un exemple de variable discrète.', 1, '1-introduction'),
  row('continuous-variable', 'Données', 'Qu’est-ce qu’une variable quantitative continue ?', 'Une variable pouvant prendre toute valeur dans un intervalle', 'Une mesure comme une durée ou une longueur est modélisée comme continue.', 1, '1-introduction'),
  row('observational-study', 'Plans d’étude', 'Qu’est-ce qu’une étude observationnelle ?', 'Une étude où les chercheurs observent les variables sans imposer de traitement', 'Elle permet de décrire des associations mais ne justifie pas toujours une relation causale.', 1, '1-introduction'),
  row('experiment', 'Plans d’étude', 'Qu’est-ce qu’une expérience statistique ?', 'Une étude où les chercheurs imposent un traitement ou une condition', 'La manipulation et la comparaison des conditions peuvent aider à étudier un effet causal.', 1, '1-introduction'),
  row('simple-random-sample', 'Échantillonnage', 'Qu’est-ce qu’un échantillon aléatoire simple ?', 'Un échantillon où chaque groupe de taille donnée a la même chance d’être choisi', 'Ce mécanisme réduit certains biais de sélection lorsqu’il est correctement appliqué.', 2, '1-introduction'),

  row('frequency-table', 'Résumé des données', 'À quoi sert un tableau de fréquences ?', 'À compter les observations appartenant à chaque valeur ou catégorie', 'Il organise les données brutes en effectifs par modalité.', 1, '2-descriptive-statistics'),
  row('relative-frequency', 'Résumé des données', 'Qu’est-ce qu’une fréquence relative ?', 'La proportion d’observations d’une catégorie parmi toutes les observations', 'Elle s’obtient en rapportant l’effectif de la catégorie à l’effectif total.', 1, '2-descriptive-statistics'),
  row('histogram', 'Graphiques', 'À quoi sert un histogramme ?', 'À représenter la distribution d’une variable quantitative par intervalles', 'Les rectangles contigus montrent les effectifs ou fréquences des classes.', 1, '2-descriptive-statistics'),
  row('bar-chart', 'Graphiques', 'À quoi sert un diagramme en barres ?', 'À comparer les effectifs ou fréquences de catégories', 'Les catégories sont séparées et la hauteur des barres représente leur fréquence.', 1, '2-descriptive-statistics'),
  row('pie-chart', 'Graphiques', 'Que représente un diagramme circulaire ?', 'La part de chaque catégorie dans un total', 'Chaque secteur correspond à une fréquence relative.', 1, '2-descriptive-statistics'),
  row('stem-leaf', 'Graphiques', 'Que conserve un diagramme tige-et-feuilles ?', 'Les valeurs individuelles tout en montrant leur distribution', 'Les chiffres sont répartis en une tige commune et une feuille représentant la précision restante.', 2, '2-descriptive-statistics'),
  row('mean-definition', 'Centre', 'Comment définit-on la moyenne arithmétique ?', 'La somme des valeurs divisée par leur nombre', 'La moyenne utilise toutes les observations et peut être sensible aux valeurs extrêmes.', 1, '2-descriptive-statistics'),
  row('median-definition', 'Centre', 'Comment définit-on la médiane ?', 'La valeur qui partage les données ordonnées en deux moitiés', 'Pour un effectif pair, elle est obtenue à partir des deux valeurs centrales.', 1, '2-descriptive-statistics'),
  row('mode-definition', 'Centre', 'Qu’est-ce que le mode d’une distribution ?', 'La valeur ou catégorie la plus fréquente', 'Une distribution peut avoir plusieurs modes ou n’en avoir aucun d’unique.', 1, '2-descriptive-statistics'),
  row('range-definition', 'Dispersion', 'Qu’est-ce que l’étendue ?', 'La différence entre la plus grande et la plus petite valeur', 'Elle mesure une dispersion simple mais dépend fortement des valeurs extrêmes.', 1, '2-descriptive-statistics'),
  row('variance-definition', 'Dispersion', 'Que mesure la variance ?', 'La moyenne des carrés des écarts à la moyenne', 'Elle quantifie la dispersion autour de la moyenne en unités au carré.', 2, '2-descriptive-statistics'),
  row('standard-deviation', 'Dispersion', 'Que représente l’écart-type ?', 'La racine carrée de la variance', 'Il mesure la dispersion dans les mêmes unités que les données.', 1, '2-descriptive-statistics'),
  row('quartile-definition', 'Position', 'Que sont les quartiles ?', 'Des valeurs qui divisent les données ordonnées en quatre parts', 'Le premier et le troisième quartiles encadrent la moitié centrale des observations.', 1, '2-descriptive-statistics'),
  row('iqr-definition', 'Dispersion', 'Comment définit-on l’écart interquartile ?', 'La différence entre le troisième et le premier quartile', 'Il décrit la dispersion des 50 % centraux et résiste mieux aux valeurs extrêmes que l’étendue.', 1, '2-descriptive-statistics'),
  row('five-number-summary', 'Résumé des données', 'Quels éléments composent le résumé à cinq nombres ?', 'Le minimum, le premier quartile, la médiane, le troisième quartile et le maximum', 'Ce résumé décrit position et dispersion sans conserver chaque observation.', 1, '2-descriptive-statistics'),
  row('box-plot', 'Graphiques', 'Que montre une boîte à moustaches ?', 'La médiane, les quartiles et des valeurs extrêmes potentielles', 'La boîte couvre l’intervalle interquartile et les moustaches indiquent l’étendue retenue par la convention.', 1, '2-descriptive-statistics'),
  row('z-score', 'Position', 'Que mesure un score z ?', 'Le nombre d’écarts-types séparant une valeur de la moyenne', 'Il permet de comparer la position relative de valeurs provenant d’échelles différentes.', 2, '2-descriptive-statistics'),
  row('outlier-definition', 'Dispersion', 'Qu’est-ce qu’une valeur aberrante ?', 'Une observation nettement éloignée du reste de la distribution', 'Une règle fondée sur l’écart interquartile est couramment utilisée pour la signaler.', 1, '2-descriptive-statistics'),

  row('event-definition', 'Probabilité', 'Qu’est-ce qu’un événement ?', 'Un ensemble de résultats possibles d’une expérience aléatoire', 'Un événement peut contenir un ou plusieurs résultats élémentaires.', 1, '3-probability-topics'),
  row('addition-rule', 'Probabilité', 'Que calcule la règle d’addition pour deux événements ?', 'La probabilité de leur union à partir de leurs probabilités et de leur intersection', 'La probabilité de l’intersection doit être retirée pour éviter un double comptage.', 2, '3-probability-topics'),
  row('mutually-exclusive', 'Probabilité', 'Que signifie que deux événements sont incompatibles ?', 'Ils ne peuvent pas se produire simultanément', 'Leur intersection est alors l’événement impossible.', 1, '3-probability-topics'),
  row('multiplication-rule', 'Probabilité', 'À quoi sert la règle de multiplication ?', 'À calculer la probabilité d’une intersection avec une probabilité conditionnelle', 'Elle relie la probabilité conjointe à une probabilité marginale et conditionnelle.', 2, '3-probability-topics'),
  row('bayes-theorem', 'Probabilité', 'Que permet le théorème de Bayes ?', 'De mettre à jour une probabilité conditionnelle en inversant le conditionnement', 'Il combine une information observée avec des probabilités initiales.', 2, '3-probability-topics'),
  row('discrete-random-variable', 'Variables aléatoires', 'Qu’est-ce qu’une variable aléatoire discrète ?', 'Une variable dont les valeurs possibles sont dénombrables', 'Elle associe un nombre à chaque résultat d’une expérience aléatoire.', 1, '4-discrete-random-variables'),
  row('probability-distribution', 'Variables aléatoires', 'Que décrit une distribution de probabilité discrète ?', 'Les valeurs possibles et leurs probabilités', 'Les probabilités sont non négatives et leur somme vaut 1.', 1, '4-discrete-random-variables'),
  row('binomial-trial', 'Lois discrètes', 'Qu’est-ce qu’un essai de Bernoulli ?', 'Une expérience à deux issues, généralement appelée succès ou échec', 'La probabilité de succès est fixée pour les essais d’un modèle binomial.', 1, '4-discrete-random-variables'),
  row('binomial-conditions', 'Lois discrètes', 'Quelles conditions caractérisent un modèle binomial ?', 'Un nombre fixé d’essais indépendants, deux issues et une probabilité de succès constante', 'Ces conditions permettent de modéliser le nombre de succès.', 2, '4-discrete-random-variables'),
  row('binomial-variable', 'Lois discrètes', 'Que compte une variable binomiale ?', 'Le nombre de succès dans un nombre fixé d’essais de Bernoulli', 'Elle ne compte pas la position des succès mais leur total.', 1, '4-discrete-random-variables'),
  row('geometric-variable', 'Lois discrètes', 'Que mesure une variable géométrique ?', 'Le nombre d’essais jusqu’au premier succès', 'Le modèle suppose des essais de Bernoulli indépendants et une probabilité de succès constante.', 2, '4-discrete-random-variables'),
  row('continuous-random-variable', 'Variables aléatoires', 'Qu’est-ce qu’une variable aléatoire continue ?', 'Une variable pouvant prendre une infinité non dénombrable de valeurs dans un intervalle', 'Sa loi est décrite par une densité ou une fonction de répartition.', 1, '5-continuous-random-variables'),
  row('density-function', 'Variables continues', 'Que représente une densité de probabilité ?', 'La répartition de la probabilité sur les valeurs d’une variable continue', 'Une probabilité sur un intervalle correspond à une aire sous la courbe de densité.', 2, '5-continuous-random-variables'),
  row('continuous-point-probability', 'Variables continues', 'Quelle est la probabilité d’une valeur exacte pour une variable continue ?', 'Elle est nulle dans le modèle continu', 'La probabilité est portée par des intervalles, même si une valeur peut être mesurée ou observée.', 2, '5-continuous-random-variables'),
  row('uniform-distribution', 'Lois continues', 'Que caractérise une loi uniforme continue ?', 'Une densité constante sur un intervalle donné', 'Toutes les sous-intervalles de même longueur ont la même probabilité.', 1, '5-continuous-random-variables'),
  row('normal-distribution', 'Loi normale', 'Quelles propriétés décrivent une loi normale ?', 'Une distribution continue, symétrique et en cloche déterminée par sa moyenne et son écart-type', 'La forme et la position dépendent de ses deux paramètres.', 1, '6-the-normal-distribution'),
  row('standard-normal', 'Loi normale', 'Qu’est-ce que la loi normale standard ?', 'La loi normale de moyenne 0 et d’écart-type 1', 'Les scores z permettent de ramener une loi normale à cette référence.', 1, '6-the-normal-distribution'),
  row('empirical-rule', 'Loi normale', 'Que décrit la règle empirique pour une distribution normale ?', 'Environ 68 %, 95 % et 99,7 % des valeurs se trouvent à un, deux et trois écarts-types de la moyenne', 'Ces proportions sont des approximations pour une loi normale.', 2, '6-the-normal-distribution'),
  row('normal-area', 'Loi normale', 'Que représente une aire sous une courbe normale ?', 'Une probabilité ou une proportion de valeurs dans un intervalle', 'L’aire totale sous la densité vaut 1.', 1, '6-the-normal-distribution'),
  row('central-limit-theorem', 'Échantillonnage', 'Que dit le théorème central limite ?', 'La distribution des moyennes d’échantillons tend vers une loi normale quand la taille des échantillons augmente sous des conditions usuelles', 'Il concerne la distribution d’échantillonnage et non la normalité de chaque donnée.', 2, '7-the-central-limit-theorem'),
  row('sampling-distribution', 'Échantillonnage', 'Qu’est-ce qu’une distribution d’échantillonnage ?', 'La distribution d’une statistique calculée sur tous les échantillons possibles d’une taille donnée', 'Elle décrit la variabilité de la statistique entre échantillons.', 2, '7-the-central-limit-theorem'),
  row('standard-error', 'Échantillonnage', 'Que mesure l’erreur standard ?', 'L’écart-type d’une distribution d’échantillonnage', 'Elle mesure la variabilité attendue d’une statistique d’un échantillon à l’autre.', 1, '7-the-central-limit-theorem'),
  row('sampling-bias', 'Échantillonnage', 'Qu’est-ce qu’un biais d’échantillonnage ?', 'Une erreur systématique due à une méthode de sélection qui ne représente pas la population', 'Augmenter la taille d’un échantillon biaisé ne supprime pas nécessairement le biais.', 2, '7-the-central-limit-theorem'),
  row('confidence-interval', 'Estimation', 'Qu’est-ce qu’un intervalle de confiance ?', 'Un intervalle construit par une méthode qui capture le paramètre dans une proportion connue de répétitions', 'Le niveau de confiance décrit la performance de la méthode, pas une probabilité attachée au paramètre fixe.', 3, '8-confidence-intervals'),
  row('margin-of-error', 'Estimation', 'Que représente la marge d’erreur ?', 'La demi-largeur d’un intervalle d’estimation', 'Elle quantifie l’incertitude d’une estimation au niveau choisi.', 1, '8-confidence-intervals'),
  row('confidence-level', 'Estimation', 'Que signifie le niveau de confiance d’une méthode ?', 'La proportion à long terme d’intervalles construits par la méthode qui contiennent le paramètre', 'Il ne signifie pas que le paramètre a cette probabilité d’être dans un intervalle déjà calculé.', 3, '8-confidence-intervals'),
  row('t-distribution', 'Estimation', 'Quand utilise-t-on souvent la loi t de Student ?', 'Pour inférer sur une moyenne quand l’écart-type de la population est inconnu', 'Ses queues dépendent des degrés de liberté et deviennent proches de celles de la loi normale avec un grand échantillon.', 2, '8-confidence-intervals'),
  row('sample-size-margin', 'Estimation', 'Quel effet a une hausse de la taille d’échantillon sur la marge d’erreur, toutes choses égales par ailleurs ?', 'Elle la réduit généralement', 'Une information issue de davantage d’observations rend l’estimation plus précise dans le modèle.', 1, '8-confidence-intervals'),
  row('null-hypothesis', 'Tests', 'Qu’est-ce que l’hypothèse nulle ?', 'L’énoncé de référence testé dans une procédure d’inférence', 'Elle représente généralement l’absence d’effet ou une valeur de référence.', 1, '9-hypothesis-testing-with-one-sample'),
  row('alternative-hypothesis', 'Tests', 'Qu’est-ce que l’hypothèse alternative ?', 'L’énoncé qui décrit les valeurs ou effets compatibles avec la question de recherche', 'Elle est évaluée contre l’hypothèse nulle.', 1, '9-hypothesis-testing-with-one-sample'),
  row('p-value', 'Tests', 'Que mesure une valeur p ?', 'La probabilité, sous l’hypothèse nulle, d’obtenir un résultat au moins aussi extrême que celui observé', 'Elle est calculée conditionnellement au modèle nul et ne mesure pas directement la probabilité que l’hypothèse nulle soit vraie.', 3, '9-hypothesis-testing-with-one-sample'),
  row('significance-level', 'Tests', 'Qu’est-ce que le seuil de signification ?', 'La probabilité maximale fixée à l’avance de rejeter à tort une hypothèse nulle vraie', 'Il est souvent noté alpha et doit être choisi avant l’examen du résultat.', 2, '9-hypothesis-testing-with-one-sample'),
  row('type-i-error', 'Tests', 'Qu’est-ce qu’une erreur de type I ?', 'Rejeter l’hypothèse nulle alors qu’elle est vraie', 'Le seuil de signification contrôle la probabilité de cette erreur dans les conditions du test.', 1, '9-hypothesis-testing-with-one-sample'),
  row('type-ii-error', 'Tests', 'Qu’est-ce qu’une erreur de type II ?', 'Ne pas rejeter l’hypothèse nulle alors qu’elle est fausse', 'Sa probabilité dépend notamment de la taille de l’effet, de l’échantillon et du seuil.', 1, '9-hypothesis-testing-with-one-sample'),
  row('statistical-power', 'Tests', 'Que représente la puissance d’un test ?', 'La probabilité de rejeter l’hypothèse nulle lorsqu’une alternative donnée est vraie', 'La puissance vaut un moins la probabilité d’une erreur de type II pour cette alternative.', 2, '9-hypothesis-testing-with-one-sample'),
  row('reject-null', 'Tests', 'Que conclut-on quand la valeur p est au plus égale au seuil choisi ?', 'On rejette l’hypothèse nulle selon la règle du test', 'Cette décision indique une incompatibilité avec le modèle nul au seuil retenu ; elle ne prouve pas l’alternative.', 2, '9-hypothesis-testing-with-one-sample'),
  row('two-sample-independent', 'Comparaison', 'Que compare un test à deux échantillons indépendants ?', 'Une différence de paramètres entre deux populations sans appariement des observations', 'Les observations des deux groupes proviennent de groupes distincts dans le plan considéré.', 2, '10-hypothesis-testing-with-two-samples'),
  row('paired-samples', 'Comparaison', 'Que caractérise une comparaison par données appariées ?', 'Chaque observation d’un groupe est liée à une observation de l’autre groupe', 'On analyse souvent les différences au sein de chaque paire.', 1, '10-hypothesis-testing-with-two-samples'),
  row('pooled-proportion', 'Comparaison', 'Pourquoi utilise-t-on parfois une proportion combinée dans un test de deux proportions ?', 'Pour estimer une proportion commune sous l’hypothèse nulle d’égalité', 'Le regroupement correspond au modèle nul spécifique de ce test.', 3, '10-hypothesis-testing-with-two-samples'),
  row('chi-square-goodness-fit', 'Chi-deux', 'Que teste un test d’adéquation du chi-deux ?', 'Si les effectifs observés sont compatibles avec des proportions théoriques', 'Il compare les effectifs observés aux effectifs attendus sous une loi spécifiée.', 2, '11-the-chi-square-distribution'),
  row('chi-square-independence', 'Chi-deux', 'Que teste un test du chi-deux d’indépendance ?', 'L’absence d’association entre deux variables qualitatives dans une population', 'Les effectifs observés dans un tableau de contingence sont comparés aux effectifs attendus sous indépendance.', 2, '11-the-chi-square-distribution'),
  row('chi-square-statistic', 'Chi-deux', 'Que compare la statistique du chi-deux ?', 'Les écarts entre effectifs observés et effectifs attendus, pondérés par les effectifs attendus', 'De grands écarts relatifs produisent une statistique plus grande.', 2, '11-the-chi-square-distribution'),
  row('contingency-table', 'Chi-deux', 'Qu’est-ce qu’un tableau de contingence ?', 'Un tableau qui croise les effectifs de catégories de deux variables qualitatives', 'Les lignes et colonnes représentent les modalités des variables.', 1, '11-the-chi-square-distribution'),
  row('scatterplot', 'Régression', 'À quoi sert un nuage de points ?', 'À visualiser la relation entre deux variables quantitatives', 'Il peut révéler direction, forme, force et valeurs atypiques d’une association.', 1, '12-linear-regression-and-correlation'),
  row('correlation-coefficient', 'Régression', 'Que mesure le coefficient de corrélation linéaire ?', 'La direction et la force d’une association linéaire entre deux variables quantitatives', 'Il est sans unité et se situe entre -1 et 1.', 1, '12-linear-regression-and-correlation'),
  row('correlation-zero', 'Régression', 'Une corrélation nulle implique-t-elle l’absence de toute relation ?', 'Non', 'Elle indique l’absence d’association linéaire mesurée ; une relation non linéaire peut subsister.', 2, '12-linear-regression-and-correlation'),
  row('least-squares-line', 'Régression', 'Que minimise la droite des moindres carrés ?', 'La somme des carrés des résidus verticaux', 'La droite est ajustée pour rendre minimale cette quantité parmi les droites candidates.', 2, '12-linear-regression-and-correlation'),
  row('residual-definition', 'Régression', 'Qu’est-ce qu’un résidu en régression ?', 'La différence entre la valeur observée et la valeur prédite', 'Le résidu mesure l’erreur de prédiction pour une observation.', 1, '12-linear-regression-and-correlation'),
  row('coefficient-determination', 'Régression', 'Que mesure le coefficient de détermination R carré ?', 'La proportion de variation de la réponse expliquée par le modèle linéaire', 'Il résume l’ajustement du modèle dans le contexte des données étudiées.', 2, '12-linear-regression-and-correlation'),
  row('anova-purpose', 'ANOVA', 'À quoi sert une ANOVA à un facteur ?', 'À comparer les moyennes de plusieurs groupes dans un modèle commun', 'Elle teste d’abord si toutes les moyennes de population sont compatibles avec une égalité.', 1, '13-f-distribution-and-one-way-anova'),
  row('anova-null', 'ANOVA', 'Quelle est l’hypothèse nulle d’une ANOVA à un facteur ?', 'Toutes les moyennes de population comparées sont égales', 'L’alternative affirme qu’au moins une moyenne diffère.', 1, '13-f-distribution-and-one-way-anova'),
  row('between-group-variation', 'ANOVA', 'Que mesure la variation intergroupes en ANOVA ?', 'La variation des moyennes de groupes autour de la moyenne globale', 'Elle contribue au numérateur de la statistique F.', 2, '13-f-distribution-and-one-way-anova'),
  row('within-group-variation', 'ANOVA', 'Que mesure la variation intragroupe en ANOVA ?', 'La dispersion des observations autour de leur moyenne de groupe', 'Elle représente le bruit ou la variabilité résiduelle dans les groupes.', 2, '13-f-distribution-and-one-way-anova'),
  row('f-statistic', 'ANOVA', 'Que compare la statistique F en ANOVA ?', 'La variation intergroupes à la variation intragroupe', 'Une valeur F élevée indique que les différences entre moyennes sont grandes relativement au bruit intra-groupe.', 2, '13-f-distribution-and-one-way-anova'),
  row('qualitative-nominal', 'Données', 'Que caractérise une variable nominale ?', 'Des catégories sans ordre naturel', 'Les modalités servent à identifier des groupes mais leur ordre n’a pas de sens quantitatif.', 1, '1-introduction'),
  row('ordinal-variable', 'Données', 'Que caractérise une variable ordinale ?', 'Des catégories qui peuvent être rangées', 'L’ordre est informatif, mais les écarts entre catégories ne sont pas nécessairement mesurables.', 1, '1-introduction'),
  row('random-sampling-frame', 'Échantillonnage', 'Qu’est-ce qu’une base de sondage ?', 'La liste ou le dispositif qui identifie les unités accessibles au tirage', 'Une base incomplète peut créer une couverture insuffisante de la population cible.', 2, '1-introduction'),
  row('stratified-sample', 'Échantillonnage', 'Comment fonctionne un échantillonnage stratifié ?', 'On divise la population en strates puis on tire un échantillon dans chaque strate', 'Les strates sont formées avant le tirage et permettent de représenter certains sous-groupes.', 2, '1-introduction'),
  row('cluster-sample', 'Échantillonnage', 'Comment fonctionne un échantillonnage par grappes ?', 'On sélectionne des groupes naturels puis on observe leurs unités selon le plan prévu', 'Les grappes peuvent réduire les coûts de collecte quand les unités sont géographiquement regroupées.', 2, '1-introduction'),
  row('sampling-variability', 'Échantillonnage', 'Qu’est-ce que la variabilité d’échantillonnage ?', 'La variation d’une statistique entre échantillons tirés de la même population', 'Deux échantillons aléatoires peuvent produire des estimations différentes.', 1, '1-introduction'),
  row('skewness', 'Forme', 'Que décrit l’asymétrie d’une distribution ?', 'Le déséquilibre de sa forme autour de son centre', 'Une longue queue d’un côté indique une asymétrie dans cette direction.', 1, '2-descriptive-statistics'),
  row('symmetric-distribution', 'Forme', 'Que signifie qu’une distribution est symétrique ?', 'Ses deux côtés se correspondent autour d’un axe ou d’un centre', 'Dans une distribution parfaitement symétrique, les positions correspondantes ont une structure miroir.', 1, '2-descriptive-statistics'),
  row('resistant-statistic', 'Résumé des données', 'Qu’est-ce qu’une statistique résistante ?', 'Une statistique peu influencée par des valeurs extrêmes', 'La médiane et l’écart interquartile sont généralement plus résistants que la moyenne et l’étendue.', 2, '2-descriptive-statistics'),
  row('law-large-numbers', 'Probabilité', 'Que décrit la loi des grands nombres ?', 'La stabilisation d’une moyenne observée autour de son espérance quand le nombre d’essais augmente', 'Elle explique pourquoi des fréquences relatives deviennent plus stables dans des répétitions nombreuses.', 2, '3-probability-topics'),
  row('odds-probability', 'Probabilité', 'Que sont les odds d’un événement ?', 'Le rapport entre sa probabilité et celle de son complément', 'Les odds constituent une autre façon de décrire la vraisemblance d’un événement.', 2, '3-probability-topics'),
  row('expected-value-linearity', 'Variables aléatoires', 'Quelle propriété possède l’espérance d’une somme ?', 'L’espérance d’une somme est la somme des espérances', 'Cette linéarité vaut même lorsque les variables ne sont pas indépendantes.', 2, '4-discrete-random-variables'),
  row('poisson-distribution', 'Lois discrètes', 'Que modélise souvent une loi de Poisson ?', 'Le nombre d’occurrences d’un événement dans un intervalle donné', 'Le modèle suppose un taux moyen et des occurrences appropriées au contexte étudié.', 2, '4-discrete-random-variables'),
  row('exponential-distribution', 'Lois continues', 'Que modélise souvent une loi exponentielle ?', 'Le temps d’attente jusqu’à une occurrence dans un processus à taux constant', 'Elle est associée à la propriété sans mémoire dans le modèle exponentiel.', 2, '5-continuous-random-variables'),
  row('normal-approximation', 'Loi normale', 'À quoi sert une approximation normale ?', 'À approcher certaines probabilités discrètes par des aires sous une loi normale', 'La qualité de l’approximation dépend des conditions et de la correction éventuellement utilisée.', 2, '6-the-normal-distribution'),
  row('finite-population-correction', 'Échantillonnage', 'Quand une correction de population finie peut-elle être pertinente ?', 'Quand l’échantillon représente une fraction importante d’une population finie', 'Elle ajuste la variabilité d’échantillonnage lorsque les tirages ne sont pas approximativement indépendants.', 3, '7-the-central-limit-theorem'),
  row('confidence-interval-width', 'Estimation', 'Quels facteurs élargissent généralement un intervalle de confiance ?', 'Un niveau de confiance plus élevé ou une variabilité plus grande', 'À taille d’échantillon constante, ces facteurs augmentent l’incertitude exprimée par l’intervalle.', 2, '8-confidence-intervals'),
  row('practical-significance', 'Tests', 'Pourquoi distinguer significativité statistique et importance pratique ?', 'Un effet peut être détectable sans être assez grand pour avoir une conséquence utile', 'La décision pratique doit considérer la taille de l’effet et son contexte, pas seulement la valeur p.', 2, '9-hypothesis-testing-with-one-sample'),
  row('multiple-comparisons', 'ANOVA', 'Pourquoi une ANOVA globale précède-t-elle souvent les comparaisons de groupes ?', 'Pour tester d’abord une différence globale avant d’examiner les paires', 'Multiplier les tests séparés peut augmenter le risque d’au moins une fausse alerte.', 3, '13-f-distribution-and-one-way-anova'),
  row('randomized-block-design', 'Plans d’étude', 'Quel est le rôle d’un bloc dans un plan expérimental ?', 'Regrouper des unités similaires afin de réduire une source connue de variabilité', 'La comparaison des traitements à l’intérieur des blocs peut améliorer la précision.', 2, '1-introduction'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/introductory-statistics-2e/pages/${chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_STATISTICS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-statistics-openstax-${id}`;
  return {
    id: `statistics-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Mathématiques',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['statistiques', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_STATISTICS_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-introductory-statistics-2e-facts',
  questions: VERIFIED_STATISTICS_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/introductory-statistics-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent concepts against the cited chapter; no generated variants',
  status: 'approved',
};

export default VERIFIED_STATISTICS_OPENSTAX_BATCH;
