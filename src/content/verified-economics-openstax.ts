import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent economics concepts checked against OpenStax Principles of
 * Economics 3e.  This file is intentionally one row per concept: it does
 * not expand a seed into wording variants or current-data claims.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Principles of Economics 3e';
// The current OpenStax page identifies this title as CC BY-NC-SA 4.0.
// Keep the exact license in provenance instead of assuming the license used
// by another OpenStax title.
const LICENSE = 'CC BY-NC-SA 4.0';
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
  row('scarcity', 'Fondamentaux', 'Que signifie la rareté en économie ?', 'Les ressources sont limitées par rapport aux besoins et aux usages possibles', 'La rareté oblige les personnes et les sociétés à choisir entre des usages concurrents des ressources.', 1, '1-introduction'),
  row('positive-normative', 'Fondamentaux', 'Quelle différence distingue une affirmation positive d’une affirmation normative ?', 'Une affirmation positive décrit ce qui est, tandis qu’une affirmation normative exprime ce qui devrait être', 'Les affirmations positives peuvent être confrontées à des observations ; les affirmations normatives comportent un jugement de valeur.', 2, '1-introduction'),
  row('marginal-analysis', 'Fondamentaux', 'Que compare une analyse marginale ?', 'Le bénéfice et le coût d’une unité supplémentaire', 'Une décision rationnelle compare le bénéfice marginal au coût marginal de l’action envisagée.', 2, '1-introduction'),
  row('production-possibilities', 'Fondamentaux', 'Que représente une frontière des possibilités de production ?', 'Les combinaisons maximales de productions réalisables avec les ressources et la technologie disponibles', 'Les points sur la frontière sont efficaces dans le modèle ; les points intérieurs indiquent une capacité inutilisée.', 2, '1-introduction'),
  row('budget-constraint', 'Choix du consommateur', 'Que limite une contrainte budgétaire ?', 'Les paniers de biens accessibles avec un revenu et des prix donnés', 'Le revenu disponible et les prix déterminent les combinaisons que le consommateur peut acheter.', 1, '2-1-how-individuals-make-choices-based-on-their-budget-constraint'),
  row('diminishing-marginal-utility', 'Choix du consommateur', 'Que décrit la loi de l’utilité marginale décroissante ?', 'L’utilité supplémentaire d’une unité tend à diminuer quand la consommation augmente', 'Dans le modèle usuel, chaque unité supplémentaire apporte moins de satisfaction que la précédente.', 2, '2-1-how-individuals-make-choices-based-on-their-budget-constraint'),
  row('utility-maximization', 'Choix du consommateur', 'Quel objectif le modèle du consommateur rationnel cherche-t-il à représenter ?', 'Maximiser l’utilité sous sa contrainte budgétaire', 'Le consommateur choisit le panier accessible qui lui procure l’utilité la plus élevée selon ses préférences.', 1, '2-1-how-individuals-make-choices-based-on-their-budget-constraint'),
  row('demand-definition', 'Demande et offre', 'Que désigne la demande d’un bien ?', 'La quantité que les acheteurs sont disposés et capables d’acheter à chaque prix', 'La demande associe des quantités à différents prix ; elle ne se réduit pas à une quantité unique.', 1, '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services'),
  row('law-of-demand', 'Demande et offre', 'Que prévoit la loi de la demande, toutes choses égales par ailleurs ?', 'Une hausse du prix réduit généralement la quantité demandée', 'Le mouvement décrit se fait le long de la courbe de demande lorsque seul le prix du bien change.', 1, '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services'),
  row('supply-definition', 'Demande et offre', 'Que désigne l’offre d’un bien ?', 'La quantité que les vendeurs sont disposés et capables de vendre à chaque prix', 'L’offre décrit la relation entre le prix et la quantité que les producteurs proposent.', 1, '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services'),
  row('law-of-supply', 'Demande et offre', 'Que prévoit la loi de l’offre, toutes choses égales par ailleurs ?', 'Une hausse du prix augmente généralement la quantité offerte', 'Un prix plus élevé rend généralement la production de davantage d’unités plus attractive.', 1, '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services'),
  row('market-equilibrium', 'Demande et offre', 'À quoi correspond l’équilibre d’un marché ?', 'Au prix où la quantité demandée égale la quantité offerte', 'À l’équilibre, les projets d’achat et de vente sont compatibles dans le modèle.', 1, '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services'),
  row('demand-shift-income-normal', 'Demande et offre', 'Pour un bien normal, que provoque généralement une hausse du revenu ?', 'Un déplacement de la demande vers la droite', 'À prix inchangés, les consommateurs souhaitent généralement acheter davantage d’un bien normal.', 2, '3-2-shifts-in-demand-and-supply-for-goods-and-services'),
  row('substitute-price-demand', 'Demande et offre', 'Que se passe-t-il généralement pour la demande d’un bien si le prix d’un substitut augmente ?', 'Elle augmente', 'Les acheteurs peuvent se tourner vers le bien devenu relativement moins cher.', 2, '3-2-shifts-in-demand-and-supply-for-goods-and-services'),
  row('complement-price-demand', 'Demande et offre', 'Que se passe-t-il généralement pour la demande d’un bien si le prix de son complément augmente ?', 'Elle diminue', 'Des compléments plus coûteux rendent moins attractif l’achat du bien associé.', 2, '3-2-shifts-in-demand-and-supply-for-goods-and-services'),
  row('supply-input-cost', 'Demande et offre', 'Comment une hausse du prix d’un intrant affecte-t-elle généralement l’offre ?', 'Elle la réduit', 'Le coût de production augmente, ce qui rend moins de quantités rentables à chaque prix de vente.', 1, '3-2-shifts-in-demand-and-supply-for-goods-and-services'),
  row('shortage-equilibrium', 'Demande et offre', 'Que signifie une pénurie au prix courant ?', 'La quantité demandée dépasse la quantité offerte', 'Une pénurie exerce une pression à la hausse sur le prix dans le modèle de marché.', 1, '3-3-changes-in-equilibrium-price-and-quantity-the-four-step-process'),
  row('surplus-equilibrium', 'Demande et offre', 'Que signifie un excédent au prix courant ?', 'La quantité offerte dépasse la quantité demandée', 'Un excédent exerce une pression à la baisse sur le prix dans le modèle de marché.', 1, '3-3-changes-in-equilibrium-price-and-quantity-the-four-step-process'),
  row('price-ceiling-binding', 'Politique des prix', 'Quand un prix plafond est-il contraignant ?', 'Quand il est fixé sous le prix d’équilibre', 'Un plafond inférieur à l’équilibre empêche le prix de s’ajuster et peut créer une pénurie.', 2, '3-4-price-ceilings-and-price-floors'),
  row('price-floor-binding', 'Politique des prix', 'Quand un prix plancher est-il contraignant ?', 'Quand il est fixé au-dessus du prix d’équilibre', 'Un plancher supérieur à l’équilibre peut créer un excédent au prix imposé.', 2, '3-4-price-ceilings-and-price-floors'),
  row('elasticity-definition', 'Élasticité', 'Que mesure l’élasticité-prix de la demande ?', 'La sensibilité relative de la quantité demandée à une variation du prix', 'Elle compare le pourcentage de variation de la quantité au pourcentage de variation du prix.', 1, '5-1-price-elasticity-of-demand-and-price-elasticity-of-supply'),
  row('elastic-demand', 'Élasticité', 'Comment qualifie-t-on une demande dont l’élasticité-prix absolue est supérieure à un ?', 'Élastique', 'La quantité demandée varie proportionnellement davantage que le prix.', 1, '5-1-price-elasticity-of-demand-and-price-elasticity-of-supply'),
  row('inelastic-demand', 'Élasticité', 'Comment qualifie-t-on une demande dont l’élasticité-prix absolue est inférieure à un ?', 'Inélastique', 'La quantité demandée varie proportionnellement moins que le prix.', 1, '5-1-price-elasticity-of-demand-and-price-elasticity-of-supply'),
  row('unit-elastic-demand', 'Élasticité', 'Que signifie une élasticité-prix unitaire de la demande ?', 'Le pourcentage de variation de la quantité égale en valeur absolue celui du prix', 'La recette totale peut rester inchangée pour un déplacement le long d’une demande à élasticité unitaire.', 2, '5-1-price-elasticity-of-demand-and-price-elasticity-of-supply'),
  row('total-revenue-elastic', 'Élasticité', 'Que devient généralement la recette totale si le prix augmente sur une demande élastique ?', 'Elle diminue', 'La baisse proportionnelle de la quantité vendue dépasse la hausse proportionnelle du prix.', 2, '5-3-elasticity-and-pricing'),
  row('income-elasticity', 'Élasticité', 'Que mesure l’élasticité-revenu de la demande ?', 'La réaction de la quantité demandée à une variation du revenu', 'Elle indique comment la demande d’un bien évolue lorsque le revenu change.', 1, '5-3-elasticity-and-pricing'),
  row('consumer-surplus', 'Efficience', 'Qu’est-ce que le surplus du consommateur ?', 'La différence entre la disposition à payer et le prix effectivement payé', 'Il mesure le gain net des acheteurs par rapport au maximum qu’ils auraient accepté de payer.', 1, '6-1-consumption-choices'),
  row('producer-surplus', 'Efficience', 'Qu’est-ce que le surplus du producteur ?', 'La différence entre le prix reçu et le coût minimal accepté par le vendeur', 'Il représente le gain des vendeurs au-dessus de leur coût d’opportunité.', 1, '6-1-consumption-choices'),
  row('total-surplus', 'Efficience', 'Comment obtient-on le surplus total d’un marché ?', 'En additionnant le surplus du consommateur et celui du producteur', 'Dans le modèle, le surplus total mesure les gains mutuels issus des échanges.', 1, '6-1-consumption-choices'),
  row('deadweight-loss', 'Efficience', 'Qu’est-ce qu’une perte sèche ?', 'Une réduction du surplus total qui ne devient le gain d’aucun autre acteur', 'Elle correspond à des échanges mutuellement avantageux qui ne se réalisent pas.', 2, '6-1-consumption-choices'),
  row('explicit-cost', 'Production', 'Qu’est-ce qu’un coût explicite ?', 'Une dépense monétaire directement payée par l’entreprise', 'Les salaires, loyers ou achats comptabilisés sont des exemples de coûts explicites.', 1, '7-1-explicit-and-implicit-costs-and-accounting-and-economic-profit'),
  row('implicit-cost', 'Production', 'Qu’est-ce qu’un coût implicite ?', 'Le coût d’opportunité d’une ressource appartenant à l’entreprise', 'L’usage du temps du propriétaire ou d’un bâtiment lui appartenant a un coût d’opportunité.', 2, '7-1-explicit-and-implicit-costs-and-accounting-and-economic-profit'),
  row('economic-profit', 'Production', 'Comment définit-on le profit économique ?', 'Le revenu total moins les coûts explicites et implicites', 'Le profit économique inclut le coût d’opportunité des ressources de l’entreprise.', 1, '7-1-explicit-and-implicit-costs-and-accounting-and-economic-profit'),
  row('accounting-profit', 'Production', 'Comment définit-on le profit comptable ?', 'Le revenu total moins les coûts explicites', 'Le profit comptable ne déduit pas les coûts implicites dans sa définition usuelle.', 1, '7-1-explicit-and-implicit-costs-and-accounting-and-economic-profit'),
  row('marginal-product', 'Production', 'Que mesure le produit marginal d’un facteur ?', 'La production supplémentaire obtenue grâce à une unité supplémentaire de ce facteur', 'Il mesure la contribution additionnelle du facteur lorsque les autres facteurs sont maintenus constants.', 1, '7-2-production-in-the-short-run'),
  row('diminishing-marginal-product', 'Production', 'Que décrit la loi du produit marginal décroissant ?', 'Le produit marginal finit par diminuer quand on ajoute un facteur à d’autres facteurs fixes', 'La capacité limitée des facteurs fixes explique ce résultat dans le court terme.', 2, '7-2-production-in-the-short-run'),
  row('fixed-cost', 'Production', 'Qu’est-ce qu’un coût fixe à court terme ?', 'Un coût qui ne varie pas avec la quantité produite', 'Le loyer d’un équipement est un exemple de coût fixe sur une période donnée.', 1, '7-2-production-in-the-short-run'),
  row('variable-cost', 'Production', 'Qu’est-ce qu’un coût variable ?', 'Un coût qui évolue avec la quantité produite', 'Les matières premières et certaines heures de travail varient généralement avec la production.', 1, '7-2-production-in-the-short-run'),
  row('economies-of-scale', 'Production', 'Que sont les économies d’échelle ?', 'Une baisse du coût moyen de long terme quand la production augmente', 'Elles peuvent résulter d’une spécialisation ou d’une meilleure utilisation des équipements.', 2, '7-3-costs-in-the-long-run'),
  row('diseconomies-of-scale', 'Production', 'Que sont les déséconomies d’échelle ?', 'Une hausse du coût moyen de long terme quand la production augmente', 'Une organisation trop grande peut devenir plus difficile à coordonner.', 2, '7-3-costs-in-the-long-run'),
  row('perfect-competition-price-taker', 'Structures de marché', 'Pourquoi une entreprise parfaitement concurrentielle est-elle preneuse de prix ?', 'Parce qu’une entreprise individuelle est trop petite pour influencer le prix de marché', 'Elle considère le prix de marché comme donné lorsqu’elle choisit sa production.', 1, '8-1-perfect-competition-and-why-it-matters'),
  row('perfect-competition-homogeneous', 'Structures de marché', 'Quelle propriété caractérise le produit d’un marché parfaitement concurrentiel ?', 'Les produits sont homogènes aux yeux des acheteurs', 'Les acheteurs considèrent les produits des vendeurs comme des substituts parfaits dans le modèle.', 1, '8-1-perfect-competition-and-why-it-matters'),
  row('profit-maximization-mc-mr', 'Structures de marché', 'Quelle règle guide le choix de production d’une entreprise qui maximise son profit ?', 'Produire jusqu’à ce que le revenu marginal égale le coût marginal', 'Tant que le revenu marginal dépasse le coût marginal, une unité supplémentaire augmente le profit.', 2, '8-2-how-perfectly-competitive-firms-make-output-decisions'),
  row('shutdown-point', 'Structures de marché', 'À court terme, quand une entreprise devrait-elle fermer temporairement selon le modèle ?', 'Quand le prix est inférieur au coût variable moyen minimal', 'La fermeture évite alors de produire et de payer des coûts variables qui dépasseraient les recettes.', 3, '8-2-how-perfectly-competitive-firms-make-output-decisions'),
  row('barrier-to-entry', 'Monopole', 'Qu’est-ce qu’une barrière à l’entrée ?', 'Un obstacle qui rend difficile l’arrivée de nouveaux concurrents', 'Les barrières peuvent être légales, technologiques, financières ou liées aux économies d’échelle.', 1, '9-1-how-monopolies-form-barriers-to-entry'),
  row('natural-monopoly', 'Monopole', 'Quand parle-t-on de monopole naturel ?', 'Quand une seule entreprise peut fournir le marché à un coût moyen inférieur à plusieurs entreprises', 'De fortes économies d’échelle peuvent rendre une structure unique moins coûteuse dans le modèle.', 2, '9-1-how-monopolies-form-barriers-to-entry'),
  row('monopoly-marginal-revenue', 'Monopole', 'Pourquoi le revenu marginal d’un monopole est-il inférieur au prix sur une demande décroissante ?', 'Pour vendre une unité supplémentaire, le monopole doit généralement baisser le prix des unités vendues', 'La baisse appliquée aux unités précédentes réduit le revenu additionnel de la nouvelle vente.', 2, '9-2-how-monopolies-compete-with-perfect-competition'),
  row('monopoly-efficiency', 'Monopole', 'Pourquoi un monopole peut-il produire une quantité inefficace ?', 'Il restreint la production sous le niveau où le prix égale le coût marginal', 'Cette restriction crée généralement une perte sèche dans le modèle standard.', 2, '9-2-how-monopolies-compete-with-perfect-competition'),
  row('monopolistic-differentiation', 'Concurrence monopolistique', 'Quelle caractéristique distingue la concurrence monopolistique ?', 'De nombreuses entreprises vendent des produits différenciés', 'La différenciation donne à chaque entreprise un certain pouvoir de marché malgré la présence de concurrents.', 1, '10-1-monopolistic-competition'),
  row('monopolistic-entry', 'Concurrence monopolistique', 'Que provoque généralement l’entrée de nouvelles entreprises en concurrence monopolistique ?', 'Elle réduit la demande adressée à chaque entreprise existante', 'Les nouveaux produits offrent davantage de choix et captent une partie des clients.', 2, '10-1-monopolistic-competition'),
  row('oligopoly-interdependence', 'Oligopole', 'Pourquoi les entreprises d’un oligopole sont-elles interdépendantes ?', 'Le résultat de chacune dépend des décisions des autres grandes entreprises', 'Chaque firme doit anticiper les réactions de ses concurrentes.', 1, '10-2-oligopoly'),
  row('game-theory-strategy', 'Oligopole', 'À quoi sert la théorie des jeux dans l’étude d’un oligopole ?', 'À analyser des décisions stratégiques où le résultat dépend des choix des autres', 'Elle formalise les interactions entre acteurs qui tiennent compte des réponses possibles de leurs rivaux.', 1, '10-2-oligopoly'),
  row('labor-demand-derived', 'Marché du travail', 'De quoi la demande de travail d’une entreprise est-elle dérivée ?', 'De la demande pour les biens et services qu’elle produit', 'Une entreprise embauche parce que le travail contribue à produire une production vendable.', 2, '14-1-the-theory-of-labor-markets'),
  row('human-capital', 'Marché du travail', 'Qu’est-ce que le capital humain ?', 'L’ensemble des connaissances et compétences qui augmentent la productivité d’une personne', 'L’éducation et l’expérience peuvent accroître les compétences productives.', 1, '14-1-the-theory-of-labor-markets'),
  row('equilibrium-wage', 'Marché du travail', 'Dans le modèle concurrentiel du travail, que coordonne le salaire d’équilibre ?', 'La quantité de travail offerte et la quantité de travail demandée', 'Le salaire est le prix du travail et l’emploi d’équilibre égalise offre et demande.', 2, '14-1-the-theory-of-labor-markets'),
  row('minimum-wage-surplus', 'Marché du travail', 'Que peut créer un salaire minimum contraignant dans le modèle ?', 'Un excédent d’offre de travail, c’est-à-dire du chômage', 'Un plancher salarial au-dessus de l’équilibre augmente l’offre et réduit la demande de travail.', 2, '14-2-demand-and-supply-of-labor'),
  row('poverty-line', 'Pauvreté', 'À quoi sert un seuil de pauvreté ?', 'À définir un niveau de ressources en dessous duquel une personne ou un ménage est considéré comme pauvre selon une méthode donnée', 'Le seuil est une convention de mesure qui dépend du pays et de la méthode utilisée.', 1, '15-1-the-poverty-trap'),
  row('poverty-trap', 'Pauvreté', 'Qu’est-ce qu’un piège de pauvreté ?', 'Une situation où la sortie de la pauvreté est difficile en raison de mécanismes qui se renforcent', 'Le manque d’épargne, de capital ou d’accès aux opportunités peut maintenir un revenu faible.', 2, '15-1-the-poverty-trap'),
  row('asymmetric-information', 'Information', 'Que signifie l’asymétrie d’information ?', 'Une partie d’un échange dispose de plus d’informations pertinentes que l’autre', 'Cette différence d’information peut modifier les décisions et les résultats du marché.', 1, '16-1-the-problem-of-information'),
  row('moral-hazard', 'Information', 'Qu’est-ce que l’aléa moral ?', 'Le changement de comportement d’une personne après qu’elle est protégée contre une conséquence', 'Une assurance peut réduire l’incitation à éviter un risque, car une partie du coût est couverte.', 2, '16-1-the-problem-of-information'),
  row('adverse-selection', 'Information', 'Qu’est-ce que la sélection adverse ?', 'La sélection de participants liée au fait que les parties disposent d’informations différentes sur le risque ou la qualité', 'Les personnes les plus exposées à un risque peuvent être davantage attirées par une assurance.', 2, '16-1-the-problem-of-information'),
  row('externality-definition', 'Externalités', 'Qu’est-ce qu’une externalité ?', 'Un effet d’une activité sur un tiers qui n’est pas reflété par le prix de marché', 'L’effet peut être favorable ou défavorable et toucher des personnes non parties à l’échange.', 1, '19-1-how-markets-address-negative-externalities'),
  row('negative-externality', 'Externalités', 'Qu’est-ce qu’une externalité négative de production ?', 'Un coût imposé à des tiers par la production d’un bien ou service', 'La pollution d’une activité productive est l’exemple classique d’un coût externe.', 1, '19-1-how-markets-address-negative-externalities'),
  row('positive-externality', 'Externalités', 'Qu’est-ce qu’une externalité positive ?', 'Un bénéfice reçu par des tiers sans paiement direct correspondant', 'Une activité crée un bénéfice externe lorsque d’autres personnes en profitent aussi.', 1, '19-1-how-markets-address-negative-externalities'),
  row('social-cost', 'Externalités', 'Comment obtient-on le coût social d’une activité ?', 'En additionnant le coût privé et le coût externe', 'Le coût social inclut les conséquences supportées par l’ensemble de la société.', 2, '20-1-pollution-and-negative-externalities'),
  row('cap-and-trade', 'Externalités', 'Que crée un système de plafonnement et d’échange de droits d’émission ?', 'Un nombre total de droits limité qui peuvent être échangés', 'Le plafond fixe la quantité autorisée tandis que l’échange permet aux entreprises de répartir les réductions.', 2, '20-1-pollution-and-negative-externalities'),
  row('public-good-definition', 'Biens publics', 'Quelles propriétés caractérisent un bien public pur ?', 'Il est non rival et non excluable', 'La consommation d’une personne ne réduit pas celle des autres et il est difficile d’empêcher l’accès.', 1, '21-1-how-public-goods-differ-from-private-goods'),
  row('free-rider', 'Biens publics', 'Qu’est-ce qu’un passager clandestin ?', 'Une personne qui profite d’un bien sans contribuer à son financement', 'La difficulté d’exclure les non-payeurs peut conduire à un financement insuffisant.', 1, '21-1-how-public-goods-differ-from-private-goods'),
  row('common-resource', 'Biens publics', 'Qu’est-ce qu’une ressource commune ?', 'Une ressource rivale mais difficile à réserver aux seuls payeurs', 'La rivalité et la difficulté d’exclusion peuvent conduire à sa surexploitation.', 2, '21-2-how-public-goods-differ-from-private-goods'),
  row('gini-coefficient', 'Inégalités', 'Que mesure le coefficient de Gini ?', 'Le degré d’inégalité dans une distribution de revenus ou de ressources', 'Un coefficient plus élevé correspond à une distribution plus inégale selon la convention habituelle.', 1, '22-1-how-economic-inequality-impacts-individuals-and-nations'),
  row('poverty-vs-inequality', 'Inégalités', 'Une baisse des inégalités implique-t-elle nécessairement une baisse de la pauvreté ?', 'Non', 'La pauvreté dépend du niveau de ressources, tandis que l’inégalité compare leur répartition.', 2, '22-1-how-economic-inequality-impacts-individuals-and-nations'),
  row('nominal-gdp', 'Macroéconomie', 'Que mesure le PIB nominal ?', 'La valeur de la production finale aux prix de la période considérée', 'Le PIB nominal varie à la fois avec les quantités produites et avec les prix.', 1, '25-1-how-to-measure-real-gdp'),
  row('real-gdp', 'Macroéconomie', 'Pourquoi utilise-t-on le PIB réel ?', 'Pour mesurer la production en neutralisant l’effet des variations de prix', 'Le PIB réel valorise la production avec des prix de référence afin de comparer les quantités.', 1, '25-1-how-to-measure-real-gdp'),
  row('gdp-expenditure', 'Macroéconomie', 'Quelles composantes additionne l’approche par les dépenses du PIB ?', 'La consommation, l’investissement, les dépenses publiques et les exportations nettes', 'L’identité est souvent écrite Y = C + I + G + (X − M).', 2, '25-1-how-to-measure-real-gdp'),
  row('unemployment-rate', 'Macroéconomie', 'Comment calcule-t-on le taux de chômage ?', 'En divisant le nombre de chômeurs par la population active', 'La population active regroupe les personnes en emploi et celles qui recherchent activement un emploi.', 1, '26-1-how-to-measure-unemployment'),
  row('frictional-unemployment', 'Macroéconomie', 'Qu’est-ce que le chômage frictionnel ?', 'Le chômage lié à la recherche et à la transition entre emplois', 'Il peut exister même lorsque les compétences et les emplois sont globalement disponibles.', 1, '26-1-how-to-measure-unemployment'),
  row('structural-unemployment', 'Macroéconomie', 'Qu’est-ce que le chômage structurel ?', 'Le chômage dû à un décalage durable entre les compétences offertes et les emplois disponibles', 'Les changements technologiques ou sectoriels peuvent modifier les compétences demandées.', 2, '26-1-how-to-measure-unemployment'),
  row('consumer-price-index', 'Macroéconomie', 'Que mesure un indice des prix à la consommation ?', 'L’évolution du coût d’un panier de biens et services consommés par les ménages', 'L’indice suit le prix d’un panier défini au fil du temps.', 1, '27-1-the-theory-of-inflation'),
  row('money-functions', 'Monnaie', 'Quelles sont les trois fonctions classiques de la monnaie ?', 'Moyen d’échange, unité de compte et réserve de valeur', 'La monnaie facilite les échanges, exprime les prix et conserve du pouvoir d’achat dans le temps.', 1, '28-1-how-the-federal-reserve-banking-system'),
  row('reserve-requirement', 'Monnaie', 'Que représente le taux de réserves obligatoires d’une banque ?', 'La fraction des dépôts qu’elle doit conserver en réserves selon la règle applicable', 'Les réserves servent notamment à répondre aux retraits et aux obligations de règlement.', 2, '28-1-how-the-federal-reserve-banking-system'),
  row('expansionary-monetary-policy', 'Politique monétaire', 'Quel est l’objectif général d’une politique monétaire expansionniste ?', 'Soutenir la demande en facilitant les conditions monétaires et financières', 'Dans le modèle, des taux plus bas peuvent stimuler l’emprunt et les dépenses, toutes choses égales par ailleurs.', 2, '31-1-how-monetary-policy-impacts-the-economy'),
  row('contractionary-monetary-policy', 'Politique monétaire', 'Quel est l’objectif général d’une politique monétaire restrictive ?', 'Freiner la demande et les pressions inflationnistes', 'Des conditions financières plus strictes réduisent généralement les dépenses sensibles au taux d’intérêt.', 2, '31-1-how-monetary-policy-impacts-the-economy'),
  row('fiscal-policy', 'Politique budgétaire', 'Qu’est-ce que la politique budgétaire ?', 'L’utilisation des dépenses publiques et des impôts pour influencer l’économie', 'Elle agit par les recettes et les dépenses du budget public.', 1, '30-1-how-the-government-uses-fiscal-policy-to-stabilize-the-economy'),
  row('automatic-stabilizer', 'Politique budgétaire', 'Qu’est-ce qu’un stabilisateur automatique ?', 'Un mécanisme budgétaire qui amortit le cycle sans nouvelle décision discrétionnaire', 'Les impôts et certaines prestations réagissent automatiquement à l’activité et aux revenus.', 2, '30-1-how-the-government-uses-fiscal-policy-to-stabilize-the-economy'),
  row('budget-deficit', 'Politique budgétaire', 'Que signifie un déficit budgétaire ?', 'Les dépenses publiques dépassent les recettes sur une période', 'Le déficit est un flux mesuré sur une période, à distinguer de la dette qui est un stock.', 1, '30-1-how-the-government-uses-fiscal-policy-to-stabilize-the-economy'),
  row('exchange-rate-definition', 'Commerce international', 'Qu’est-ce qu’un taux de change ?', 'Le prix d’une monnaie exprimé dans une autre monnaie', 'Il permet de convertir les prix et les paiements entre deux zones monétaires.', 1, '32-1-how-exchange-rates-are-determined'),
  row('currency-appreciation', 'Commerce international', 'Que signifie l’appréciation d’une monnaie ?', 'Une hausse de sa valeur par rapport à une autre monnaie', 'Une monnaie appréciée permet d’acheter davantage d’unités de la monnaie étrangère considérée.', 1, '32-1-how-exchange-rates-are-determined'),
  row('comparative-advantage', 'Commerce international', 'Que signifie un avantage comparatif ?', 'La capacité à produire un bien à un coût d’opportunité inférieur à celui d’un autre producteur', 'L’avantage comparatif fonde les gains potentiels de la spécialisation et de l’échange.', 1, '34-1-protectionism-an-indirect-subsidy-from-consumers-to-producers'),
  row('tariff-definition', 'Commerce international', 'Qu’est-ce qu’un droit de douane ?', 'Une taxe appliquée aux biens importés', 'Il augmente le prix intérieur du bien importé dans le modèle d’un petit pays.', 1, '34-1-protectionism-an-indirect-subsidy-from-consumers-to-producers'),
  row('import-quota', 'Commerce international', 'Qu’est-ce qu’un quota d’importation ?', 'Une limite quantitative imposée aux importations d’un bien', 'Le quota restreint directement le volume pouvant entrer sur le marché intérieur.', 1, '34-1-protectionism-an-indirect-subsidy-from-consumers-to-producers'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/principles-economics-3e/pages/${chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_ECONOMICS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-economics-openstax-${id}`;
  return {
    id: `economics-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Économie',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['économie', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_ECONOMICS_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-principles-economics-3e-facts',
  questions: VERIFIED_ECONOMICS_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/principles-economics-3e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent concepts against the cited chapter; no generated variants',
  status: 'approved',
};

export default VERIFIED_ECONOMICS_OPENSTAX_BATCH;
