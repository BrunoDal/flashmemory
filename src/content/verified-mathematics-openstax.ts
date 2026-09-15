import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent mathematics facts checked against OpenStax Algebra and
 * Trigonometry 2e (CC BY 4.0).  The cards deliberately test definitions,
 * properties and interpretations rather than asking for long calculations.
 * Each claim has a stable id and a direct chapter URL for editorial review.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Algebra and Trigonometry 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax chapter; independent claims only; no generated variants';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  // Real numbers, exponents, radicals and polynomials — chapter 1
  row('real-number-rational-definition', 'Nombres réels', 'Comment définit-on un nombre rationnel ?', 'Un nombre qui peut s’écrire comme le quotient de deux entiers avec un dénominateur non nul', 'Les entiers et les fractions appartiennent aux rationnels ; leur écriture décimale est finie ou périodique.', 1, '1-prerequisites'),
  row('real-number-irrational-definition', 'Nombres réels', 'Qu’est-ce qu’un nombre irrationnel ?', 'Un nombre réel qui ne peut pas s’écrire comme le quotient de deux entiers', 'Sa représentation décimale est infinie et non périodique.', 1, '1-prerequisites'),
  row('real-number-order-completeness', 'Nombres réels', 'Quel ensemble contient à la fois les rationnels et les irrationnels ?', 'Les nombres réels', 'La droite réelle représente tous les nombres rationnels et irrationnels.', 1, '1-prerequisites'),
  row('absolute-value-distance', 'Nombres réels', 'Que représente la valeur absolue d’un nombre réel ?', 'Sa distance à zéro sur la droite réelle', 'La valeur absolue est toujours positive ou nulle et ne dépend pas du signe du nombre.', 1, '1-prerequisites'),
  row('interval-closed-endpoints', 'Nombres réels', 'Que signifie qu’un intervalle est fermé à une extrémité ?', 'L’extrémité appartient à l’intervalle', 'Un crochet indique l’inclusion de la borne, tandis qu’une parenthèse indique son exclusion.', 1, '1-prerequisites'),
  row('exponent-zero', 'Puissances', 'Quelle est la valeur de a⁰ lorsque a est non nul ?', '1', 'La règle des puissances impose a⁰ = aᵐ/aᵐ = 1.', 1, '1-prerequisites'),
  row('negative-exponent', 'Puissances', 'Comment réécrire une puissance de la forme a⁻ⁿ ?', 'Comme 1/aⁿ, pour a non nul', 'Un exposant négatif indique l’inverse de la puissance correspondante.', 1, '1-prerequisites'),
  row('product-powers-rule', 'Puissances', 'Comment simplifie-t-on le produit de deux puissances de même base ?', 'On conserve la base et on additionne les exposants', 'Pour une base non nulle, aᵐaⁿ = aᵐ⁺ⁿ.', 1, '1-prerequisites'),
  row('power-of-power-rule', 'Puissances', 'Comment simplifie-t-on une puissance de puissance ?', 'On conserve la base et on multiplie les exposants', 'La propriété (aᵐ)ⁿ = aᵐⁿ évite de développer la puissance.', 1, '1-prerequisites'),
  row('scientific-notation-form', 'Notation scientifique', 'Quelle forme a une notation scientifique normalisée ?', 'Un nombre entre 1 et 10 multiplié par une puissance entière de 10', 'Cette forme sépare l’ordre de grandeur et les chiffres significatifs.', 1, '1-prerequisites'),
  row('square-root-principal', 'Racines', 'Que désigne √a pour a positif ou nul ?', 'La racine carrée principale non négative de a', 'Les deux solutions de x² = a sont √a et −√a, mais le symbole √a désigne la seule valeur non négative.', 2, '1-prerequisites'),
  row('even-root-domain', 'Racines', 'Quelle condition doit respecter le radicande d’une racine d’indice pair dans les réels ?', 'Il doit être positif ou nul', 'Une racine paire réelle d’un nombre négatif n’est pas définie dans les réels.', 1, '1-prerequisites'),
  row('polynomial-definition', 'Polynômes', 'Qu’est-ce qu’un polynôme en une variable ?', 'Une somme finie de termes constants multipliés par des puissances entières positives ou nulles de la variable', 'Les exposants d’un polynôme sont des entiers naturels ; ils ne sont pas négatifs ou fractionnaires.', 1, '1-prerequisites'),
  row('polynomial-degree', 'Polynômes', 'Comment définit-on le degré d’un polynôme non nul ?', 'Le plus grand exposant dont le coefficient est non nul', 'Le degré indique le comportement dominant du polynôme pour de grandes valeurs absolues de la variable.', 1, '1-prerequisites'),
  row('monomial-definition', 'Polynômes', 'Qu’est-ce qu’un monôme ?', 'Un produit d’un coefficient et de puissances de variables à exposants entiers naturels', 'Un monôme ne comporte pas de somme entre plusieurs termes.', 1, '1-prerequisites'),
  row('difference-squares-factor', 'Factorisation', 'Quelle identité remarquable factorise a² − b² ?', '(a − b)(a + b)', 'C’est la différence de deux carrés et son développement redonne a² − b².', 1, '1-prerequisites'),
  row('perfect-square-trinomial', 'Factorisation', 'Quelle forme développe (a + b)² ?', 'a² + 2ab + b²', 'Le terme du milieu vient des deux produits croisés ab.', 1, '1-prerequisites'),
  row('rational-expression-domain', 'Expressions rationnelles', 'Quelle valeur est exclue du domaine d’une expression rationnelle ?', 'Toute valeur qui annule son dénominateur', 'Une division par zéro est impossible ; la simplification algébrique ne réintroduit pas cette valeur.', 2, '1-prerequisites'),

  // Equations and inequalities — chapter 2
  row('linear-equation-definition', 'Équations', 'Qu’est-ce qu’une équation linéaire à une variable ?', 'Une équation dans laquelle la variable apparaît au premier degré au plus', 'Elle peut être mise sous la forme ax + b = 0, avec a et b constants.', 1, '2-equations-and-inequalities'),
  row('equation-solution', 'Équations', 'Qu’est-ce qu’une solution d’équation ?', 'Une valeur qui rend l’égalité vraie', 'On vérifie une solution en la remplaçant dans les deux membres.', 1, '2-equations-and-inequalities'),
  row('equivalent-equations', 'Équations', 'Que préservent les opérations réversibles appliquées aux deux membres d’une équation ?', 'L’ensemble de ses solutions', 'Ajouter une même quantité ou multiplier par un nombre non nul produit une équation équivalente.', 1, '2-equations-and-inequalities'),
  row('identity-equation', 'Équations', 'Comment appelle-t-on une équation vraie pour toute valeur de son domaine ?', 'Une identité', 'Après simplification, ses deux membres sont la même expression sur le domaine autorisé.', 2, '2-equations-and-inequalities'),
  row('contradiction-equation', 'Équations', 'Que signifie une contradiction obtenue en résolvant une équation ?', 'L’équation n’a aucune solution', 'Une égalité impossible comme 0 = 1 décrit l’ensemble vide.', 1, '2-equations-and-inequalities'),
  row('inequality-reversal-negative', 'Inégalités', 'Que se passe-t-il lorsqu’on multiplie une inégalité par un nombre négatif ?', 'Le sens de l’inégalité s’inverse', 'Par exemple, multiplier −2 < 3 par −1 donne 2 > −3.', 1, '2-equations-and-inequalities'),
  row('compound-inequality-and', 'Inégalités', 'Que représente une inégalité composée reliée par « et » ?', 'L’intersection des deux ensembles de solutions', 'Une valeur doit satisfaire simultanément les deux contraintes.', 1, '2-equations-and-inequalities'),
  row('compound-inequality-or', 'Inégalités', 'Que représente une inégalité composée reliée par « ou » ?', 'La réunion des deux ensembles de solutions', 'Une valeur qui satisfait au moins une des deux contraintes est retenue.', 1, '2-equations-and-inequalities'),
  row('absolute-value-equation-cases', 'Valeur absolue', 'Comment traite-t-on |x| = a lorsque a est positif ?', 'On considère x = a ou x = −a', 'Deux nombres opposés sont à la même distance de zéro.', 1, '2-equations-and-inequalities'),
  row('absolute-value-inequality-inside', 'Valeur absolue', 'Que signifie |x| < a pour a positif ?', '−a < x < a', 'La distance de x à zéro est strictement inférieure à a.', 1, '2-equations-and-inequalities'),
  row('absolute-value-inequality-outside', 'Valeur absolue', 'Que signifie |x| > a pour a positif ?', 'x < −a ou x > a', 'La distance à zéro dépasse a sur l’une ou l’autre demi-droite.', 1, '2-equations-and-inequalities'),
  row('quadratic-equation-definition', 'Équations du second degré', 'Qu’est-ce qu’une équation quadratique ?', 'Une équation pouvant s’écrire ax² + bx + c = 0 avec a non nul', 'Le terme de plus haut degré est alors le carré de la variable.', 1, '2-equations-and-inequalities'),
  row('quadratic-discriminant', 'Équations du second degré', 'Que permet de déterminer le discriminant d’une équation quadratique réelle ?', 'Le nombre de solutions réelles', 'Pour ax² + bx + c, le discriminant b² − 4ac distingue zéro, une ou deux racines réelles.', 1, '2-equations-and-inequalities'),
  row('quadratic-discriminant-negative', 'Équations du second degré', 'Que peut-on conclure si le discriminant d’une équation quadratique est négatif ?', 'Elle n’a pas de solution réelle', 'Les racines sont alors complexes non réelles.', 1, '2-equations-and-inequalities'),
  row('quadratic-vertex-axis', 'Équations du second degré', 'Quel axe de symétrie possède la parabole y = ax² + bx + c ?', 'La droite x = −b/(2a)', 'Le sommet de la parabole se trouve sur cet axe vertical.', 2, '2-equations-and-inequalities'),

  // Functions and linear functions — chapters 3 and 4
  row('function-input-unique-output', 'Fonctions', 'Quelle condition caractérise une fonction ?', 'Chaque entrée du domaine possède une seule sortie', 'Une même entrée ne peut pas être associée à deux valeurs de sortie différentes.', 1, '3-functions'),
  row('function-domain', 'Fonctions', 'Qu’appelle-t-on domaine d’une fonction ?', 'L’ensemble des valeurs d’entrée autorisées', 'Le domaine exclut notamment les valeurs qui provoquent une division par zéro ou une racine réelle impossible.', 1, '3-functions'),
  row('function-range', 'Fonctions', 'Qu’appelle-t-on image ou ensemble des valeurs d’une fonction ?', 'L’ensemble des sorties effectivement obtenues', 'L’image est déterminée par le domaine et la règle de la fonction.', 1, '3-functions'),
  row('vertical-line-test', 'Fonctions', 'Que vérifie le test de la droite verticale sur un graphe ?', 'Qu’une courbe représente une fonction de x', 'Si une droite verticale coupe le graphe en plusieurs points, une entrée aurait plusieurs sorties.', 1, '3-functions'),
  row('function-notation', 'Fonctions', 'Que signifie f(a) ?', 'La valeur de la fonction f lorsque l’entrée vaut a', 'Le symbole f(a) n’est pas une multiplication de f par a.', 1, '3-functions'),
  row('increasing-function', 'Fonctions', 'Comment décrit-on une fonction croissante sur un intervalle ?', 'Ses valeurs augmentent lorsque l’entrée augmente', 'La définition compare les sorties pour deux entrées dans l’ordre.', 1, '3-functions'),
  row('even-function-symmetry', 'Fonctions', 'Quelle symétrie possède le graphe d’une fonction paire ?', 'Une symétrie par rapport à l’axe des ordonnées', 'Une fonction paire vérifie f(−x) = f(x) lorsque les deux valeurs sont définies.', 1, '3-functions'),
  row('odd-function-symmetry', 'Fonctions', 'Quelle symétrie possède le graphe d’une fonction impaire ?', 'Une symétrie centrale par rapport à l’origine', 'Une fonction impaire vérifie f(−x) = −f(x).', 1, '3-functions'),
  row('composition-functions', 'Fonctions', 'Que signifie (f ∘ g)(x) ?', 'f(g(x))', 'On applique d’abord g à x, puis f au résultat, sous réserve des domaines.', 1, '3-functions'),
  row('inverse-function-reflection', 'Fonctions inverses', 'Quelle relation géométrique relie les graphes d’une fonction et de sa réciproque ?', 'Ils sont symétriques par rapport à la droite y = x', 'Les coordonnées d’un point sont échangées par l’inversion.', 2, '3-functions'),
  row('one-to-one-horizontal-test', 'Fonctions inverses', 'Que vérifie le test de la droite horizontale ?', 'Qu’une fonction est injective sur son domaine', 'Une droite horizontale ne doit pas couper le graphe plus d’une fois pour qu’une réciproque soit une fonction.', 2, '3-functions'),
  row('linear-function-form', 'Fonctions linéaires', 'Quelle forme décrit une fonction affine ?', 'f(x) = mx + b', 'm est la pente et b l’ordonnée à l’origine.', 1, '4-linear-functions'),
  row('slope-definition', 'Fonctions linéaires', 'Comment calcule-t-on la pente d’une droite entre deux points distincts ?', 'La variation verticale divisée par la variation horizontale', 'Pour (x₁,y₁) et (x₂,y₂), la pente vaut (y₂ − y₁)/(x₂ − x₁).', 1, '4-linear-functions'),
  row('zero-slope-line', 'Fonctions linéaires', 'Quelle direction a une droite de pente nulle ?', 'Elle est horizontale', 'Les ordonnées restent constantes lorsque l’abscisse varie.', 1, '4-linear-functions'),
  row('undefined-slope-vertical', 'Fonctions linéaires', 'Pourquoi la pente d’une droite verticale est-elle non définie ?', 'Sa variation horizontale est nulle', 'Le quotient de la variation verticale par zéro n’est pas défini.', 1, '4-linear-functions'),
  row('parallel-lines-slope', 'Fonctions linéaires', 'Quand deux droites non verticales sont-elles parallèles ?', 'Quand elles ont la même pente et des ordonnées à l’origine différentes', 'Deux droites confondues constituent le cas particulier où les deux constantes coïncident.', 2, '4-linear-functions'),
  row('perpendicular-lines-slope', 'Fonctions linéaires', 'Quel lien existe entre les pentes de deux droites non verticales perpendiculaires ?', 'Leurs pentes sont des opposées réciproques', 'Le produit des pentes vaut −1 lorsque les deux pentes sont définies.', 2, '4-linear-functions'),
  row('direct-variation', 'Fonctions linéaires', 'Comment s’écrit une relation de variation directe ?', 'y = kx', 'Le graphe est une droite passant par l’origine et k est la constante de proportionnalité.', 1, '4-linear-functions'),
  row('linear-model-intercept', 'Fonctions linéaires', 'Que représente l’ordonnée à l’origine dans un modèle affine ?', 'La valeur de sortie lorsque l’entrée vaut zéro', 'Elle correspond au point où le graphe coupe l’axe des ordonnées.', 1, '4-linear-functions'),

  // Polynomial and rational functions — chapter 5
  row('polynomial-root-zero', 'Fonctions polynomiales', 'Qu’est-ce qu’une racine d’un polynôme ?', 'Une valeur qui annule le polynôme', 'Graphiquement, une racine réelle correspond à une intersection avec l’axe des abscisses.', 1, '5-polynomial-and-rational-functions'),
  row('factor-theorem', 'Fonctions polynomiales', 'Que dit le théorème des facteurs ?', 'Si r est une racine de p, alors x − r est un facteur de p', 'La divisibilité par x − r et l’annulation en r sont équivalentes pour un polynôme.', 2, '5-polynomial-and-rational-functions'),
  row('remainder-theorem', 'Fonctions polynomiales', 'Que donne le théorème du reste lors de la division de p(x) par x − r ?', 'Le reste est p(r)', 'Il permet de calculer un reste sans effectuer toute la division polynomiale.', 2, '5-polynomial-and-rational-functions'),
  row('fundamental-theorem-algebra', 'Fonctions polynomiales', 'Que garantit le théorème fondamental de l’algèbre pour un polynôme non constant ?', 'Il possède au moins une racine complexe', 'Comptées avec leurs multiplicités, ses racines complexes totalisent son degré.', 2, '5-polynomial-and-rational-functions'),
  row('multiplicity-even-crossing', 'Fonctions polynomiales', 'Que se passe-t-il souvent au voisinage d’une racine réelle de multiplicité paire ?', 'Le graphe touche l’axe puis repart du même côté', 'Une multiplicité impaire favorise au contraire un changement de signe au voisinage de la racine.', 2, '5-polynomial-and-rational-functions'),
  row('polynomial-end-behavior-even', 'Fonctions polynomiales', 'Quel comportement ont les deux extrémités d’un polynôme de degré pair à coefficient dominant positif ?', 'Elles montent toutes deux vers +∞', 'Le terme dominant positif et de degré pair domine lorsque |x| devient grand.', 2, '5-polynomial-and-rational-functions'),
  row('rational-function-definition', 'Fonctions rationnelles', 'Qu’est-ce qu’une fonction rationnelle ?', 'Le quotient de deux polynômes', 'Son domaine exclut les zéros du polynôme dénominateur.', 1, '5-polynomial-and-rational-functions'),
  row('rational-vertical-asymptote', 'Fonctions rationnelles', 'Quand une droite verticale peut-elle être une asymptote d’une fonction rationnelle ?', 'Lorsqu’une valeur exclue fait diverger la fonction au voisinage de cette valeur', 'Les facteurs communs simplifiés peuvent produire un trou plutôt qu’une asymptote.', 2, '5-polynomial-and-rational-functions'),
  row('horizontal-asymptote-degree', 'Fonctions rationnelles', 'Que compare-t-on pour déterminer l’asymptote horizontale d’une fonction rationnelle ?', 'Les degrés du numérateur et du dénominateur', 'Le rapport des coefficients dominants intervient lorsque les degrés sont égaux.', 2, '5-polynomial-and-rational-functions'),
  row('complex-number-i', 'Nombres complexes', 'Comment définit-on l’unité imaginaire i ?', 'Par la relation i² = −1', 'Elle permet d’écrire les nombres complexes sous la forme a + bi.', 1, '5-polynomial-and-rational-functions'),

  // Exponential and logarithmic functions — chapter 6
  row('exponential-function-base', 'Exponentielles', 'Quelles conditions doit respecter la base b d’une fonction exponentielle bˣ réelle ?', 'b doit être positive et différente de 1', 'Une base positive assure des valeurs réelles et b = 1 donnerait une fonction constante.', 1, '6-exponential-and-logarithmic-functions'),
  row('exponential-growth-base', 'Exponentielles', 'Quand une fonction exponentielle bˣ est-elle croissante ?', 'Lorsque b > 1', 'Multiplier l’entrée par une augmentation produit alors une sortie plus grande.', 1, '6-exponential-and-logarithmic-functions'),
  row('exponential-decay-base', 'Exponentielles', 'Quand une fonction exponentielle bˣ est-elle décroissante ?', 'Lorsque 0 < b < 1', 'Les puissances diminuent lorsque l’exposant augmente dans ce cas.', 1, '6-exponential-and-logarithmic-functions'),
  row('natural-exponential-base', 'Exponentielles', 'Quelle constante est la base de la fonction exponentielle naturelle ?', 'La constante e', 'La fonction eˣ possède des propriétés particulières en calcul différentiel.', 1, '6-exponential-and-logarithmic-functions'),
  row('logarithm-definition', 'Logarithmes', 'Que signifie log_b(x) = y ?', 'bʸ = x', 'Le logarithme est l’exposant auquel il faut élever b pour obtenir x.', 1, '6-exponential-and-logarithmic-functions'),
  row('logarithm-domain', 'Logarithmes', 'Quel est le domaine réel de la fonction logarithme log_b(x) ?', 'Les nombres strictement positifs', 'La base doit également être positive et différente de 1.', 1, '6-exponential-and-logarithmic-functions'),
  row('log-product-rule', 'Logarithmes', 'Comment se transforme le logarithme d’un produit positif ?', 'En somme des logarithmes des facteurs', 'log_b(xy) = log_b(x) + log_b(y) pour x,y positifs.', 1, '6-exponential-and-logarithmic-functions'),
  row('log-quotient-rule', 'Logarithmes', 'Comment se transforme le logarithme d’un quotient positif ?', 'En différence des logarithmes du numérateur et du dénominateur', 'log_b(x/y) = log_b(x) − log_b(y) pour x,y positifs.', 1, '6-exponential-and-logarithmic-functions'),
  row('log-power-rule', 'Logarithmes', 'Comment se transforme le logarithme d’une puissance positive ?', 'L’exposant devient un facteur devant le logarithme', 'log_b(xᵖ) = p log_b(x) dans les conditions usuelles.', 1, '6-exponential-and-logarithmic-functions'),
  row('change-of-base-formula', 'Logarithmes', 'À quoi sert la formule de changement de base ?', 'À calculer un logarithme avec une autre base disponible', 'log_b(x) = ln(x)/ln(b) pour x positif et b admissible.', 2, '6-exponential-and-logarithmic-functions'),
  row('log-exp-inverse', 'Logarithmes', 'Quel lien existe entre une fonction exponentielle et son logarithme de même base ?', 'Elles sont réciproques', 'Les compositions log_b(bˣ) et b^(log_b x) redonnent l’entrée dans leurs domaines.', 1, '6-exponential-and-logarithmic-functions'),
  row('logistic-function-range', 'Modèles exponentiels', 'Vers quelles bornes une fonction logistique standard est-elle limitée ?', 'Deux asymptotes horizontales représentant ses limites basse et haute', 'Le modèle décrit une croissance qui ralentit à l’approche d’une capacité maximale.', 2, '6-exponential-and-logarithmic-functions'),

  // Trigonometric functions — chapter 7
  row('radian-definition', 'Trigonométrie', 'Quelle relation définit un angle d’un radian ?', 'Il sous-tend un arc dont la longueur égale le rayon', 'Sur le cercle unité, la mesure en radians est directement la longueur de l’arc.', 1, '7-trigonometric-functions'),
  row('degree-radian-half-turn', 'Trigonométrie', 'Combien de radians mesure un angle plat ?', 'π radians', 'Un tour complet mesure 2π radians et un angle plat en représente la moitié.', 1, '7-trigonometric-functions'),
  row('unit-circle-coordinate', 'Trigonométrie', 'Que représentent les coordonnées d’un point du cercle unité associé à un angle θ ?', '(cos θ, sin θ)', 'Le cosinus est l’abscisse et le sinus l’ordonnée du point.', 1, '7-trigonometric-functions'),
  row('sine-cosine-identity', 'Identites trigonométriques', 'Quelle identité fondamentale relie le sinus et le cosinus ?', 'sin²θ + cos²θ = 1', 'Elle découle du théorème de Pythagore appliqué au cercle unité.', 1, '7-trigonometric-functions'),
  row('tangent-sine-cosine', 'Identités trigonométriques', 'Comment exprime-t-on la tangente avec le sinus et le cosinus ?', 'tan θ = sin θ / cos θ lorsque cos θ est non nul', 'La tangente n’est donc pas définie lorsque le cosinus s’annule.', 1, '7-trigonometric-functions'),
  row('sine-period', 'Fonctions trigonométriques', 'Quelle est la période de la fonction sinus ?', '2π', 'Ajouter 2π à l’angle ramène au même point du cercle unité.', 1, '7-trigonometric-functions'),
  row('cosine-period', 'Fonctions trigonométriques', 'Quelle est la période de la fonction cosinus ?', '2π', 'Le cosinus répète ses valeurs après un tour complet.', 1, '7-trigonometric-functions'),
  row('tangent-period', 'Fonctions trigonométriques', 'Quelle est la période de la fonction tangente ?', 'π', 'La tangente retrouve sa valeur après un demi-tour, hors de ses points non définis.', 1, '7-trigonometric-functions'),
  row('sine-range', 'Fonctions trigonométriques', 'Dans quel intervalle se trouvent les valeurs du sinus réel ?', '[-1, 1]', 'Le sinus est l’ordonnée d’un point du cercle unité.', 1, '7-trigonometric-functions'),
  row('cosine-range', 'Fonctions trigonométriques', 'Dans quel intervalle se trouvent les valeurs du cosinus réel ?', '[-1, 1]', 'Le cosinus est l’abscisse d’un point du cercle unité.', 1, '7-trigonometric-functions'),
  row('tangent-domain', 'Fonctions trigonométriques', 'Pour quelles valeurs la tangente n’est-elle pas définie ?', 'Lorsque cos θ = 0', 'La formule tan θ = sin θ/cos θ contient alors une division par zéro.', 1, '7-trigonometric-functions'),
  row('sine-odd-function', 'Fonctions trigonométriques', 'Le sinus est-il une fonction paire ou impaire ?', 'Impaire', 'Il vérifie sin(−θ) = −sin(θ).', 1, '7-trigonometric-functions'),
  row('cosine-even-function', 'Fonctions trigonométriques', 'Le cosinus est-il une fonction paire ou impaire ?', 'Paire', 'Il vérifie cos(−θ) = cos(θ).', 1, '7-trigonometric-functions'),
  row('law-of-sines', 'Triangles', 'Que relie la loi des sinus dans un triangle ?', 'Chaque côté et le sinus de l’angle qui lui est opposé', 'Elle donne a/sin A = b/sin B = c/sin C = 2R pour un triangle non dégénéré.', 2, '8-further-applications-of-trigonometry'),
  row('law-of-cosines', 'Triangles', 'À quelle généralisation du théorème de Pythagore correspond la loi des cosinus ?', 'c² = a² + b² − 2ab cos C', 'Lorsque C est droit, le terme en cosinus disparaît et on retrouve Pythagore.', 2, '8-further-applications-of-trigonometry'),
  row('triangle-angle-sum', 'Triangles', 'Quelle est la somme des angles intérieurs d’un triangle euclidien ?', 'π radians, soit 180 degrés', 'Cette propriété permet de déterminer un angle lorsque les deux autres sont connus.', 1, '8-further-applications-of-trigonometry'),
  row('ambiguous-law-of-sines', 'Triangles', 'Pourquoi la loi des sinus peut-elle produire deux triangles dans certains cas ?', 'Parce qu’un sinus donné peut correspondre à un angle aigu ou à son supplémentaire', 'C’est le cas ambigu SSA ; les longueurs et l’angle connu doivent être examinés ensemble.', 3, '8-further-applications-of-trigonometry'),

  // Systems and analytic geometry — chapters 9 and 10
  row('linear-system-solution', 'Systèmes', 'Qu’est-ce qu’une solution d’un système d’équations ?', 'Un ensemble de valeurs qui satisfait simultanément toutes les équations', 'Pour deux variables, la solution est souvent l’intersection des deux graphes.', 1, '9-systems-of-equations-and-inequalities'),
  row('consistent-system', 'Systèmes', 'Comment appelle-t-on un système qui possède au moins une solution ?', 'Un système compatible', 'Un système incompatible n’a aucune solution.', 1, '9-systems-of-equations-and-inequalities'),
  row('dependent-system', 'Systèmes', 'Que signifie que deux équations linéaires sont dépendantes ?', 'Elles représentent la même droite et donnent une infinité de solutions communes', 'L’une des équations est une multiple de l’autre.', 2, '9-systems-of-equations-and-inequalities'),
  row('independent-system', 'Systèmes', 'Que signifie que deux droites sont indépendantes et sécantes ?', 'Elles ont une unique intersection', 'Les deux équations imposent alors une solution unique au système.', 1, '9-systems-of-equations-and-inequalities'),
  row('gaussian-elimination', 'Systèmes', 'À quoi sert l’élimination de Gauss ?', 'À transformer un système en un système équivalent plus facile à résoudre', 'Des opérations élémentaires sur les lignes permettent d’obtenir une forme échelonnée.', 2, '9-systems-of-equations-and-inequalities'),
  row('matrix-dimensions', 'Matrices', 'Que signifie qu’une matrice est de dimension m × n ?', 'Elle possède m lignes et n colonnes', 'La première dimension compte les lignes et la seconde les colonnes.', 1, '9-systems-of-equations-and-inequalities'),
  row('matrix-identity', 'Matrices', 'Quel rôle joue la matrice identité dans un produit matriciel ?', 'Elle laisse une matrice compatible inchangée', 'Comme le nombre 1, elle est l’élément neutre de la multiplication matricielle.', 1, '9-systems-of-equations-and-inequalities'),
  row('matrix-product-compatibility', 'Matrices', 'Quand le produit AB de deux matrices est-il défini ?', 'Lorsque le nombre de colonnes de A égale le nombre de lignes de B', 'La matrice produit a alors le nombre de lignes de A et le nombre de colonnes de B.', 2, '9-systems-of-equations-and-inequalities'),
  row('circle-standard-equation', 'Géométrie analytique', 'Quelle est l’équation standard d’un cercle de centre (h,k) et de rayon r ?', '(x − h)² + (y − k)² = r²', 'Chaque point du cercle est à distance r du centre.', 1, '10-analytic-geometry'),
  row('parabola-focus-directrix', 'Coniques', 'Comment définit-on une parabole par une propriété de distance ?', 'Comme l’ensemble des points équidistants d’un foyer et d’une directrice', 'Cette définition explique sa forme et sa symétrie.', 2, '10-analytic-geometry'),
  row('ellipse-foci-definition', 'Coniques', 'Quelle propriété caractérise une ellipse par ses foyers ?', 'La somme des distances à ses deux foyers est constante', 'Le cercle est un cas particulier d’ellipse où les foyers coïncident.', 2, '10-analytic-geometry'),
  row('hyperbola-foci-definition', 'Coniques', 'Quelle propriété caractérise une hyperbole par ses foyers ?', 'La valeur absolue de la différence des distances à ses deux foyers est constante', 'Ses deux branches s’approchent de ses asymptotes.', 2, '10-analytic-geometry'),

  // Sequences, counting and probability — chapter 11
  row('sequence-definition', 'Suites', 'Qu’est-ce qu’une suite numérique ?', 'Une fonction dont le domaine est un ensemble d’entiers, souvent les entiers naturels', 'Ses termes sont indexés par un rang n.', 1, '11-sequences-probability-and-counting-theory'),
  row('arithmetic-sequence-difference', 'Suites', 'Comment caractérise-t-on une suite arithmétique ?', 'La différence entre deux termes consécutifs est constante', 'Cette constante est appelée raison de la suite.', 1, '11-sequences-probability-and-counting-theory'),
  row('geometric-sequence-ratio', 'Suites', 'Comment caractérise-t-on une suite géométrique ?', 'Le quotient de deux termes consécutifs est constant lorsque le dénominateur est non nul', 'Cette constante est appelée raison géométrique.', 1, '11-sequences-probability-and-counting-theory'),
  row('arithmetic-explicit-form', 'Suites', 'Quelle forme explicite possède une suite arithmétique de premier terme a₁ et de raison d ?', 'aₙ = a₁ + (n − 1)d', 'Chaque rang ajoute une fois de plus la même différence.', 1, '11-sequences-probability-and-counting-theory'),
  row('geometric-explicit-form', 'Suites', 'Quelle forme explicite possède une suite géométrique de premier terme a₁ et de raison r ?', 'aₙ = a₁rⁿ⁻¹', 'Chaque passage au terme suivant multiplie par r.', 1, '11-sequences-probability-and-counting-theory'),
  row('finite-geometric-sum', 'Suites', 'À quelle condition la formule usuelle de somme géométrique s’applique-t-elle ?', 'La raison doit être différente de 1', 'Pour r = 1, tous les termes sont identiques et la somme se traite séparément.', 2, '11-sequences-probability-and-counting-theory'),
  row('factorial-definition', 'Dénombrement', 'Que représente n! pour un entier naturel n ?', 'Le produit des entiers positifs de 1 à n, avec 0! = 1', 'La factorielle compte notamment les permutations de n objets distincts.', 1, '11-sequences-probability-and-counting-theory'),
  row('permutation-order-matters', 'Dénombrement', 'Dans une permutation, l’ordre des objets compte-t-il ?', 'Oui', 'Changer l’ordre produit une disposition différente.', 1, '11-sequences-probability-and-counting-theory'),
  row('combination-order-not-matter', 'Dénombrement', 'Dans une combinaison, l’ordre des objets compte-t-il ?', 'Non', 'Une combinaison sélectionne un sous-ensemble sans distinguer son ordre.', 1, '11-sequences-probability-and-counting-theory'),
  row('binomial-coefficient-meaning', 'Dénombrement', 'Que compte le coefficient binomial « n parmi k » ?', 'Les sous-ensembles de k éléments choisis parmi n', 'Il est noté C(n,k) ou binom(n,k) selon les conventions.', 1, '11-sequences-probability-and-counting-theory'),
  row('sample-space-definition', 'Probabilités', 'Qu’est-ce que l’espace échantillonnal d’une expérience aléatoire ?', 'L’ensemble de toutes les issues possibles', 'Un événement est un sous-ensemble de cet espace.', 1, '11-sequences-probability-and-counting-theory'),
  row('probability-range', 'Probabilités', 'Dans quel intervalle se trouve toujours une probabilité ?', '[0, 1]', '0 correspond à l’impossibilité et 1 à la certitude.', 1, '11-sequences-probability-and-counting-theory'),
  row('complement-probability', 'Probabilités', 'Quelle relation relie la probabilité d’un événement et celle de son complément ?', 'P(Aᶜ) = 1 − P(A)', 'Un événement et son complément sont incompatibles et couvrent toutes les issues.', 1, '11-sequences-probability-and-counting-theory'),
  row('addition-rule-disjoint', 'Probabilités', 'Comment se simplifie P(A ou B) lorsque A et B sont incompatibles ?', 'P(A) + P(B)', 'Aucune issue n’est comptée deux fois dans ce cas.', 1, '11-sequences-probability-and-counting-theory'),
  row('conditional-probability-definition', 'Probabilités', 'Que mesure P(A|B) ?', 'La probabilité de A sachant que B est réalisé', 'Le conditionnement restreint l’univers aux issues de B.', 2, '11-sequences-probability-and-counting-theory'),
  row('independent-events', 'Probabilités', 'Quand deux événements sont-ils indépendants ?', 'Lorsque la réalisation de l’un ne modifie pas la probabilité de l’autre', 'Dans ce cas, P(A et B) = P(A)P(B).', 2, '11-sequences-probability-and-counting-theory'),
  row('expected-value-discrete', 'Probabilités', 'Que représente l’espérance d’une variable aléatoire discrète ?', 'Sa moyenne théorique pondérée par les probabilités des issues', 'Elle n’est pas nécessairement une valeur que la variable prend effectivement.', 2, '11-sequences-probability-and-counting-theory'),
];

const sourceUrl = (chapter: string) => `https://openstax.org/books/algebra-and-trigonometry-2e/pages/${chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({ factId, source: SOURCE, url: sourceUrl(chapter), license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' });

export const VERIFIED_MATHEMATICS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-mathematics-openstax-${id}`;
  return {
    id: `mathematics-openstax-${id}`,
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
    tags: ['mathématiques', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_MATHEMATICS_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-algebra-and-trigonometry-2e-facts',
  questions: VERIFIED_MATHEMATICS_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/algebra-and-trigonometry-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_MATHEMATICS_OPENSTAX_BATCH;
