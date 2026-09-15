import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent physics facts checked against OpenStax College Physics 2e
 * (CC BY 4.0).  Each row is an editorial claim, not a
 * wording variant of another card.  Chapter URLs are kept on each question
 * so a reviewer can go back to the relevant textbook section.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax College Physics 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax chapter; no generated variants';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: string];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  // Vectors, kinematics and dynamics
  row('displacement-vector', 'Cinématique', 'La distance parcourue et le déplacement sont-ils de même nature ?', 'Non : la distance est scalaire et le déplacement est vectoriel', 'La distance ne possède qu’une valeur, tandis que le déplacement possède une norme et une direction entre les positions initiale et finale.', 1, '2-vectors'),
  row('average-velocity-displacement', 'Cinématique', 'Comment définit-on la vitesse moyenne d’un mobile ?', 'Comme son déplacement divisé par la durée écoulée', 'La vitesse moyenne est vectorielle : elle utilise le déplacement, contrairement à la vitesse moyenne fondée sur la distance parcourue.', 1, '3-motion-along-a-straight-line'),
  row('acceleration-velocity-rate', 'Cinématique', 'Que mesure l’accélération d’un objet ?', 'La variation de sa vitesse par unité de temps', 'Une accélération peut modifier la valeur de la vitesse, sa direction, ou les deux.', 1, '3-motion-along-a-straight-line'),
  row('free-fall-mass-independent', 'Cinématique', 'En chute libre idéale, l’accélération dépend-elle de la masse de l’objet ?', 'Non, elle est approximativement g près de la surface terrestre', 'En négligeant la résistance de l’air, tous les objets subissent la même accélération gravitationnelle locale.', 1, '5-newtons-laws-of-motion'),
  row('inertia-first-law', 'Dynamique', 'Que décrit le principe d’inertie ?', 'Un objet conserve son état de mouvement si la force résultante est nulle', 'Sans force résultante, un objet au repos reste au repos et un objet en mouvement rectiligne uniforme le demeure.', 1, '5-newtons-laws-of-motion'),
  row('newton-second-law', 'Dynamique', 'Quelle relation relie la force résultante, la masse et l’accélération ?', 'F = ma', 'La deuxième loi de Newton relie la force résultante exercée sur un objet à son accélération.', 1, '5-newtons-laws-of-motion'),
  row('action-reaction', 'Dynamique', 'Les forces d’action et de réaction s’exercent-elles sur le même objet ?', 'Non, elles s’exercent sur deux objets différents', 'Ces forces ont même direction opposée et même intensité, mais appartiennent à deux interactions réciproques.', 2, '5-newtons-laws-of-motion'),
  row('normal-force-direction', 'Dynamique', 'Dans quelle direction agit idéalement la force normale d’un support ?', 'Perpendiculairement à la surface de contact', 'La force normale est la composante de contact qui empêche l’interpénétration des surfaces.', 1, '5-newtons-laws-of-motion'),
  row('kinetic-friction-opposes', 'Dynamique', 'Dans quelle direction agit le frottement cinétique ?', 'À l’opposé du mouvement relatif des surfaces', 'Le frottement cinétique s’oppose au glissement relatif au niveau du contact.', 1, '5-newtons-laws-of-motion'),
  row('static-friction-limit', 'Dynamique', 'Le frottement statique a-t-il toujours sa valeur maximale ?', 'Non, il s’adapte jusqu’à une valeur maximale', 'Avant le glissement, son intensité prend la valeur nécessaire à l’équilibre, dans la limite imposée par les surfaces.', 2, '5-newtons-laws-of-motion'),
  row('centripetal-acceleration-direction', 'Mouvement circulaire', 'Vers où pointe l’accélération centripète d’un mouvement circulaire ?', 'Vers le centre de la trajectoire', 'Elle change la direction de la vitesse et est dirigée radialement vers le centre.', 1, '6-applications-of-newtons-laws'),
  row('centripetal-acceleration-formula', 'Mouvement circulaire', 'Quelle expression donne l’accélération centripète pour une vitesse v et un rayon r ?', 'a_c = v²/r', 'Cette accélération est nécessaire pour courber la trajectoire d’un mouvement circulaire.', 2, '6-applications-of-newtons-laws'),
  row('work-perpendicular-force', 'Travail et énergie', 'Quel travail une force perpendiculaire au déplacement fournit-elle ?', 'Un travail nul', 'Le travail dépend du produit scalaire de la force et du déplacement ; l’angle droit donne zéro.', 1, '7-work-and-kinetic-energy'),
  row('kinetic-energy-formula', 'Travail et énergie', 'Quelle est l’expression de l’énergie cinétique d’une masse m de vitesse v ?', 'E_c = ½mv²', 'L’énergie cinétique augmente avec la masse et avec le carré de la vitesse.', 1, '7-work-and-kinetic-energy'),
  row('work-energy-theorem', 'Travail et énergie', 'À quoi est égal le travail de la force résultante ?', 'À la variation de l’énergie cinétique', 'Le théorème travail-énergie relie les forces appliquées au changement d’énergie cinétique.', 2, '7-work-and-kinetic-energy'),
  row('conservative-force-path', 'Énergie potentielle', 'Le travail d’une force conservative dépend-il du chemin suivi ?', 'Non, il dépend seulement des positions initiale et finale', 'Le poids et la force élastique sont des exemples de forces conservatives idéales.', 2, '8-potential-energy-and-conservation-of-energy'),
  row('mechanical-energy-conservation', 'Énergie potentielle', 'Quand l’énergie mécanique se conserve-t-elle ?', 'Quand seules des forces conservatives réalisent un travail', 'Dans ce cas, la somme de l’énergie cinétique et de l’énergie potentielle reste constante.', 2, '8-potential-energy-and-conservation-of-energy'),
  row('power-work-rate', 'Travail et énergie', 'Que mesure la puissance mécanique ?', 'Le taux auquel un travail est effectué', 'La puissance moyenne est le travail fourni divisé par la durée correspondante.', 1, '7-work-and-kinetic-energy'),
  // Momentum, rotation and elasticity
  row('momentum-vector', 'Quantité de mouvement', 'Comment définit-on la quantité de mouvement linéaire ?', 'p = mv', 'La quantité de mouvement est un vecteur orienté comme la vitesse.', 1, '9-linear-momentum-and-collisions'),
  row('impulse-momentum', 'Quantité de mouvement', 'À quoi est égal l’impulsion d’une force résultante ?', 'À la variation de la quantité de mouvement', 'L’impulsion est l’intégrale temporelle de la force et permet d’analyser les chocs.', 2, '9-linear-momentum-and-collisions'),
  row('momentum-isolated-system', 'Quantité de mouvement', 'Quelle grandeur se conserve dans un système isolé lors d’une collision ?', 'La quantité de mouvement totale', 'Les forces internes se compensent dans le bilan du système isolé.', 1, '9-linear-momentum-and-collisions'),
  row('elastic-collision-kinetic', 'Collisions', 'Quelle grandeur supplémentaire se conserve dans une collision parfaitement élastique ?', 'L’énergie cinétique totale', 'Une collision élastique conserve à la fois la quantité de mouvement et l’énergie cinétique.', 2, '9-linear-momentum-and-collisions'),
  row('torque-lever-arm', 'Rotation', 'De quoi dépend le moment d’une force par rapport à un axe ?', 'De la force et de la distance perpendiculaire à sa ligne d’action', 'Le bras de levier est la distance perpendiculaire entre l’axe et la ligne d’action.', 1, '10-fixed-axis-rotation'),
  row('angular-velocity-unit', 'Rotation', 'Quelle unité SI mesure une vitesse angulaire ?', 'Le radian par seconde', 'La vitesse angulaire décrit le changement d’angle par unité de temps.', 1, '10-fixed-axis-rotation'),
  row('rotational-inertia-resistance', 'Rotation', 'Que traduit le moment d’inertie d’un solide ?', 'Sa résistance aux variations de rotation autour d’un axe', 'Il dépend de la masse et de sa répartition par rapport à l’axe.', 2, '10-fixed-axis-rotation'),
  row('angular-momentum-definition', 'Rotation', 'Comment définit-on le moment cinétique d’un point matériel ?', 'Comme le produit vectoriel r × p', 'Il dépend de la position par rapport à l’axe et de la quantité de mouvement.', 2, '11-angular-momentum'),
  row('angular-momentum-torque', 'Rotation', 'Quelle grandeur est égale au taux de variation du moment cinétique ?', 'Le moment résultant des forces', 'Le couple résultant joue pour la rotation un rôle analogue à la force pour la translation.', 2, '11-angular-momentum'),
  row('angular-momentum-conserved', 'Rotation', 'Quand le moment cinétique total se conserve-t-il ?', 'Quand le moment résultant extérieur est nul', 'Les interactions internes ne modifient pas le moment cinétique total du système.', 2, '11-angular-momentum'),
  row('hooke-law-spring', 'Élasticité', 'Dans le domaine élastique idéal, comment varie la force d’un ressort ?', 'Elle est proportionnelle à son allongement et opposée à celui-ci', 'La loi de Hooke s’écrit F = −kx pour une déformation suffisamment faible.', 1, '12-static-equilibrium-and-elasticity'),
  // Gravitation and fluids
  row('universal-gravitation-distance', 'Gravitation', 'Comment varie la force gravitationnelle entre deux masses quand leur distance double ?', 'Elle est divisée par quatre', 'La loi en carré inverse donne une force proportionnelle à 1/r².', 2, '13-gravitation'),
  row('gravitational-field-definition', 'Gravitation', 'Que représente un champ gravitationnel en un point ?', 'La force gravitationnelle par unité de masse d’essai', 'Il décrit l’action gravitationnelle indépendamment de la masse de l’objet d’essai.', 2, '13-gravitation'),
  row('orbital-speed-radius', 'Gravitation', 'Pour une orbite circulaire autour d’un même astre, comment varie la vitesse avec le rayon ?', 'Elle diminue quand le rayon orbital augmente', 'La vitesse orbitale circulaire vaut une constante dépendant de l’astre divisée par la racine du rayon.', 2, '13-gravitation'),
  row('kepler-third-law', 'Gravitation', 'Que relie la troisième loi de Kepler pour des orbites autour du même astre ?', 'Le carré de la période au cube du demi-grand axe', 'Le rapport T²/a³ est constant pour des objets orbitant le même corps central.', 2, '13-gravitation'),
  row('fluid-pressure-depth', 'Fluides', 'Comment varie la pression dans un fluide au repos quand la profondeur augmente ?', 'Elle augmente', 'La pression hydrostatique ajoute le poids de la colonne de fluide située au-dessus.', 1, '14-fluid-mechanics'),
  row('pascal-principle', 'Fluides', 'Que dit le principe de Pascal ?', 'Une variation de pression appliquée à un fluide confiné se transmet intégralement', 'Ce principe explique le fonctionnement idéal d’une presse hydraulique.', 1, '14-fluid-mechanics'),
  row('buoyant-force-volume', 'Fluides', 'De quoi dépend la poussée d’Archimède exercée sur un objet immergé ?', 'Du poids du fluide déplacé', 'La poussée est dirigée vers le haut et vaut le poids du volume de fluide déplacé.', 1, '14-fluid-mechanics'),
  row('continuity-incompressible', 'Fluides', 'Dans un écoulement stationnaire incompressible, que conserve le débit volumique ?', 'Le produit de la section par la vitesse', 'La relation A₁v₁ = A₂v₂ traduit la conservation de la matière.', 2, '14-fluid-mechanics'),
  row('bernoulli-pressure-speed', 'Fluides', 'Dans un écoulement idéal horizontal, que devient la pression lorsque la vitesse augmente ?', 'Elle diminue', 'L’équation de Bernoulli relie pression, vitesse et altitude le long d’une ligne de courant.', 2, '14-fluid-mechanics'),
  // Oscillations and waves
  row('simple-harmonic-restoring', 'Oscillations', 'Quelle propriété caractérise une oscillation harmonique simple ?', 'La force de rappel est proportionnelle et opposée au déplacement', 'Cette relation produit une évolution sinusoïdale dans le modèle idéal.', 1, '15-oscillations'),
  row('spring-period-mass', 'Oscillations', 'Que devient la période d’un oscillateur masse-ressort si sa masse augmente ?', 'Elle augmente', 'La période vaut 2π√(m/k) : elle croît comme la racine carrée de la masse.', 2, '15-oscillations'),
  row('pendulum-period-length', 'Oscillations', 'Pour de petites oscillations, que devient la période d’un pendule si sa longueur augmente ?', 'Elle augmente', 'La période idéale vaut 2π√(L/g) et ne dépend pas de la masse du pendule.', 1, '15-oscillations'),
  row('wave-amplitude-energy', 'Ondes', 'À fréquence identique, que traduit une plus grande amplitude d’une onde mécanique ?', 'Une perturbation plus intense', 'Pour de nombreux modèles, l’énergie transportée augmente avec le carré de l’amplitude.', 2, '16-waves'),
  row('wave-superposition', 'Ondes', 'Que prévoit le principe de superposition pour deux ondes qui se rencontrent ?', 'Le déplacement résultant est la somme des déplacements', 'Les ondes peuvent se traverser dans un milieu linéaire sans se détruire définitivement.', 1, '16-waves'),
  row('standing-wave-nodes', 'Ondes', 'Comment appelle-t-on les points immobiles d’une onde stationnaire ?', 'Des nœuds', 'Les ventres ont au contraire une amplitude maximale.', 1, '16-waves'),
  row('sound-longitudinal', 'Acoustique', 'Dans l’air, une onde sonore est-elle principalement longitudinale ou transversale ?', 'Longitudinale', 'Les particules d’air oscillent principalement dans la direction de propagation de l’onde.', 1, '18-sound'),
  row('sound-intensity-distance', 'Acoustique', 'Pour une source ponctuelle isotrope, comment varie l’intensité sonore avec la distance ?', 'Elle diminue selon l’inverse du carré de la distance', 'L’énergie se répartit sur des sphères dont la surface augmente comme r².', 2, '18-sound'),
  row('doppler-effect', 'Acoustique', 'Que décrit l’effet Doppler ?', 'La variation de fréquence observée due au mouvement relatif de la source et de l’observateur', 'La fréquence perçue augmente à l’approche et diminue à l’éloignement dans le cas usuel.', 1, '18-sound'),
  // Temperature and thermodynamics (avoiding chemistry gas-law duplicates)
  row('thermal-equilibrium-zero-law', 'Thermodynamique', 'Que formalise le principe zéro de la thermodynamique ?', 'Deux systèmes en équilibre thermique avec un troisième sont en équilibre entre eux', 'Il fonde la notion de température et la mesure thermométrique.', 1, '20-the-first-law-of-thermodynamics'),
  row('heat-transfer-conduction', 'Thermodynamique', 'Quel mode de transfert thermique se fait par interactions locales dans un matériau ?', 'La conduction', 'La conduction transfère l’énergie sans transport macroscopique global de matière.', 1, '20-the-first-law-of-thermodynamics'),
  row('first-law-thermodynamics', 'Thermodynamique', 'Que relie le premier principe de la thermodynamique ?', 'La variation d’énergie interne, la chaleur reçue et le travail', 'Il exprime la conservation de l’énergie pour un système thermodynamique.', 2, '20-the-first-law-of-thermodynamics'),
  row('adiabatic-process-heat', 'Thermodynamique', 'Que vaut le transfert thermique lors d’une transformation adiabatique ?', 'Il est nul', 'Adiabatique signifie qu’aucune chaleur n’est échangée avec l’environnement, même si le travail peut modifier l’énergie interne.', 1, '20-the-first-law-of-thermodynamics'),
  row('second-law-entropy', 'Thermodynamique', 'Quelle grandeur augmente ou reste constante dans un système isolé selon le deuxième principe ?', 'L’entropie', 'Les transformations réelles produisent de l’entropie ; une transformation réversible idéale la conserve.', 2, '22-the-second-law-of-thermodynamics'),
  row('heat-engine-efficiency', 'Machines thermiques', 'Le rendement d’un moteur thermique peut-il atteindre 100 % ?', 'Non', 'Le deuxième principe impose qu’une partie de l’énergie thermique soit rejetée vers une source froide.', 1, '22-the-second-law-of-thermodynamics'),
  row('carnot-efficiency-temperatures', 'Machines thermiques', 'De quoi dépend le rendement maximal d’un moteur de Carnot ?', 'Des températures absolues des sources chaude et froide', 'Le rendement idéal vaut 1 − T_froide/T_chaude, avec les températures en kelvins.', 2, '22-the-second-law-of-thermodynamics'),
  // Electric charge and fields
  row('charge-conservation', 'Électricité', 'Que dit le principe de conservation de la charge électrique ?', 'La charge totale d’un système isolé reste constante', 'La charge peut se transférer entre corps mais n’est pas créée ni détruite dans le modèle classique.', 1, '18-electric-charge-and-electric-field'),
  row('coulomb-law-distance', 'Électricité', 'Comment varie la force électrostatique quand la distance entre deux charges double ?', 'Elle est divisée par quatre', 'La loi de Coulomb suit également une dépendance en inverse du carré de la distance.', 2, '18-electric-charge-and-electric-field'),
  row('electric-field-direction-positive', 'Électricité', 'Dans quelle direction définit-on un champ électrique ?', 'Dans la direction de la force sur une charge positive d’essai', 'Le champ est la force électrique par unité de charge positive placée au point considéré.', 1, '18-electric-charge-and-electric-field'),
  row('conductors-electrostatic-equilibrium', 'Électricité', 'Que vaut le champ électrique à l’intérieur d’un conducteur en équilibre électrostatique ?', 'Il est nul', 'Les charges libres se redistribuent jusqu’à annuler le champ interne dans cette situation idéale.', 2, '20-gausss-law'),
  row('gauss-law-flux', 'Électricité', 'Que relie la loi de Gauss à travers une surface fermée ?', 'Le flux électrique à la charge enfermée', 'Le flux total est proportionnel à la charge nette contenue dans la surface.', 2, '20-gausss-law'),
  row('electric-potential-energy-charge', 'Potentiel électrique', 'Comment relie-t-on l’énergie potentielle électrique d’une charge q au potentiel V ?', 'U = qV', 'Le potentiel électrique représente l’énergie potentielle par unité de charge.', 1, '21-electric-potential'),
  row('equipotential-work', 'Potentiel électrique', 'Quel travail la force électrique fournit-elle lors d’un déplacement sur une équipotentielle ?', 'Un travail nul', 'Le potentiel reste constant le long d’une équipotentielle, donc la variation d’énergie potentielle est nulle.', 1, '21-electric-potential'),
  row('electric-field-potential-gradient', 'Potentiel électrique', 'Comment le champ électrique est-il orienté par rapport aux équipotentielles ?', 'Perpendiculairement, vers les potentiels décroissants', 'Le champ est le gradient négatif du potentiel.', 2, '21-electric-potential'),
  // Capacitance and circuits
  row('capacitance-definition', 'Circuits', 'Comment définit-on la capacité électrique d’un condensateur ?', 'C = Q/V', 'La capacité mesure la charge stockée par unité de différence de potentiel.', 1, '24-capacitance'),
  row('capacitor-energy', 'Circuits', 'Quelle énergie est stockée dans un condensateur chargé ?', 'U = ½CV²', 'L’énergie est stockée dans le champ électrique créé entre les armatures.', 2, '24-capacitance'),
  row('dielectric-capacitance', 'Circuits', 'Quel est l’effet idéal d’un diélectrique inséré entre les armatures d’un condensateur ?', 'Il augmente sa capacité', 'La polarisation du matériau réduit le champ effectif pour une charge donnée.', 2, '24-capacitance'),
  row('ohm-law', 'Circuits', 'Quelle relation exprime la loi d’Ohm pour un conducteur ohmique ?', 'V = RI', 'La tension est proportionnelle au courant, le coefficient étant la résistance.', 1, '25-current-resistance-and-ohms-law'),
  row('resistance-series', 'Circuits', 'Comment se combinent les résistances en série ?', 'La résistance équivalente est la somme des résistances', 'Le même courant traverse les résistances et les chutes de tension s’additionnent.', 1, '26-direct-current-circuits'),
  row('resistance-parallel', 'Circuits', 'Comment se combinent les résistances en parallèle ?', 'Les inverses des résistances s’additionnent', 'Les branches en parallèle ont la même tension et leurs courants s’additionnent.', 2, '26-direct-current-circuits'),
  row('kirchhoff-junction', 'Circuits', 'Que traduit la règle des nœuds de Kirchhoff ?', 'La somme des courants entrants égale la somme des courants sortants', 'Elle découle de la conservation de la charge électrique au nœud.', 1, '26-direct-current-circuits'),
  row('electrical-power', 'Circuits', 'Quelles expressions donnent la puissance dissipée par une résistance ?', 'P = VI, soit aussi P = I²R ou V²/R', 'Ces formes sont équivalentes lorsqu’elles sont combinées avec la loi d’Ohm.', 2, '25-current-resistance-and-ohms-law'),
  // Magnetism and induction
  row('magnetic-force-moving-charge', 'Magnétisme', 'Une charge immobile subit-elle une force magnétique selon le modèle de Lorentz ?', 'Non, la force magnétique dépend de sa vitesse', 'La force magnétique vaut q v × B et s’annule lorsque v est nul.', 1, '27-magnetic-fields-and-forces'),
  row('magnetic-force-perpendicular', 'Magnétisme', 'Quand la force magnétique sur une charge en mouvement est-elle maximale ?', 'Quand sa vitesse est perpendiculaire au champ magnétique', 'Sa valeur est proportionnelle à sin θ et atteint qvB pour θ = 90°.', 2, '27-magnetic-fields-and-forces'),
  row('magnetic-force-no-work', 'Magnétisme', 'La force magnétique réalise-t-elle un travail sur une charge ponctuelle ?', 'Non', 'Elle est perpendiculaire à la vitesse et modifie la direction du mouvement sans modifier directement son énergie cinétique.', 2, '27-magnetic-fields-and-forces'),
  row('right-hand-rule-wire', 'Magnétisme', 'Que permet de déterminer la règle de la main droite autour d’un fil parcouru par un courant ?', 'Le sens des lignes de champ magnétique', 'Le pouce suit le courant conventionnel et les doigts indiquent le sens circulaire du champ.', 1, '28-sources-of-magnetic-field'),
  row('solenoid-field', 'Magnétisme', 'Comment est approximativement le champ magnétique à l’intérieur d’un long solénoïde idéal ?', 'Uniforme et parallèle à son axe', 'Loin des extrémités, les contributions des spires produisent un champ presque uniforme.', 2, '28-sources-of-magnetic-field'),
  row('faraday-induction', 'Induction', 'Que relie la loi de Faraday à une force électromotrice induite ?', 'La variation temporelle du flux magnétique', 'Une variation de flux à travers un circuit produit une f.é.m. induite.', 1, '29-electromagnetic-induction'),
  row('lenz-law-direction', 'Induction', 'Que précise la loi de Lenz sur le courant induit ?', 'Il s’oppose à la variation de flux qui l’a produit', 'Le signe moins de la loi de Faraday encode cette opposition.', 1, '29-electromagnetic-induction'),
  row('transformer-frequency', 'Courant alternatif', 'Dans un transformateur idéal, la fréquence change-t-elle entre primaire et secondaire ?', 'Non, elle reste la même', 'Le rapport de tension dépend du nombre de spires, mais la fréquence imposée par la source est conservée.', 2, '31-alternating-current'),
  // Electromagnetic waves and optics
  row('em-wave-no-medium', 'Ondes électromagnétiques', 'Les ondes électromagnétiques ont-elles besoin d’un milieu matériel pour se propager dans le vide ?', 'Non', 'Les champs électrique et magnétique variables peuvent se propager dans le vide.', 1, '33-electromagnetic-waves'),
  row('em-spectrum-order', 'Ondes électromagnétiques', 'Dans le spectre électromagnétique, quelle grandeur augmente du rouge vers le violet ?', 'La fréquence', 'La lumière violette a une fréquence plus élevée et une longueur d’onde plus courte que la lumière rouge.', 1, '33-electromagnetic-waves'),
  row('polarization-transverse', 'Ondes électromagnétiques', 'Que révèle la polarisation d’une onde électromagnétique ?', 'La direction d’oscillation de son champ électrique', 'La polarisation est une propriété des ondes transversales.', 2, '33-electromagnetic-waves'),
  row('reflection-angle', 'Optique géométrique', 'Que dit la loi de la réflexion ?', 'L’angle de réflexion égale l’angle d’incidence', 'Les deux angles sont mesurés par rapport à la normale à la surface.', 1, '34-image-formation-by-geometric-optics'),
  row('refraction-snells-law', 'Optique géométrique', 'Que relie la loi de Snell-Descartes lors d’une réfraction ?', 'Les indices, les angles d’incidence et de réfraction', 'Elle s’écrit n₁ sin θ₁ = n₂ sin θ₂.', 1, '34-image-formation-by-geometric-optics'),
  row('total-internal-reflection', 'Optique géométrique', 'Dans quelle situation une réflexion totale interne peut-elle se produire ?', 'Quand la lumière passe d’un milieu plus réfringent vers un milieu moins réfringent avec un angle suffisant', 'Au-delà de l’angle critique, aucune onde propagative ne traverse la surface.', 2, '34-image-formation-by-geometric-optics'),
  row('convex-lens-converging', 'Optique géométrique', 'Quel effet idéal possède une lentille convergente sur des rayons parallèles à son axe ?', 'Elle les fait converger vers un foyer', 'Une lentille convergente est plus épaisse au centre qu’aux bords dans le modèle usuel.', 1, '34-image-formation-by-geometric-optics'),
  row('interference-double-slit', 'Optique ondulatoire', 'Que produit l’interférence constructive de deux ondes lumineuses ?', 'Une intensité renforcée', 'Les amplitudes s’ajoutent en phase et forment une frange claire dans une expérience à deux fentes.', 1, '35-interference'),
  row('diffraction-aperture', 'Optique ondulatoire', 'Que devient la diffraction quand la taille d’une ouverture approche la longueur d’onde ?', 'Elle devient importante', 'La diffraction limite alors la capacité à former une image parfaitement ponctuelle.', 2, '36-diffraction'),
  // Quantum and nuclear physics
  row('photoelectric-threshold', 'Physique quantique', 'Que faut-il dépasser pour qu’un métal émette des électrons par effet photoélectrique ?', 'Une fréquence seuil liée au travail d’extraction', 'Une lumière plus intense sous le seuil ne suffit pas à arracher des électrons dans le modèle de l’effet photoélectrique.', 2, '37-quantum-nature-of-light'),
  row('photon-momentum', 'Physique quantique', 'Quelle relation relie l’impulsion d’un photon à sa longueur d’onde ?', 'p = h/λ', 'Même sans masse au repos, un photon transporte une énergie et une quantité de mouvement.', 2, '38-photons-and-matter-waves'),
  row('de-broglie-wavelength', 'Physique quantique', 'Comment varie la longueur d’onde de De Broglie quand l’impulsion d’une particule augmente ?', 'Elle diminue', 'La relation λ = h/p associe une onde à toute particule matérielle.', 1, '38-photons-and-matter-waves'),
  row('radioactive-half-life', 'Physique nucléaire', 'Que représente la demi-vie d’un radionucléide ?', 'Le temps nécessaire pour que la moitié des noyaux initiaux se désintègrent', 'Après chaque demi-vie, la moitié de la quantité restante se désintègre à son tour.', 1, '40-nuclear-physics-and-radioactivity'),
  row('alpha-radiation-nucleus', 'Physique nucléaire', 'De quoi est constituée une particule alpha ?', 'De deux protons et de deux neutrons', 'Une particule alpha est le noyau d’un atome d’hélium-4.', 1, '40-nuclear-physics-and-radioactivity'),
  row('beta-minus-decay', 'Physique nucléaire', 'Que se transforme-t-il dans une désintégration bêta moins ?', 'Un neutron devient un proton en émettant un électron et un antineutrino', 'Cette transformation augmente le numéro atomique d’une unité sans changer le nombre de masse.', 2, '40-nuclear-physics-and-radioactivity'),
  row('gamma-radiation-photon', 'Physique nucléaire', 'Qu’est-ce qu’un rayonnement gamma ?', 'Un photon électromagnétique de très haute énergie émis par un noyau', 'Une émission gamma désexcite le noyau sans changer son nombre de protons ni de neutrons.', 1, '40-nuclear-physics-and-radioactivity'),
  row('mass-energy-equivalence', 'Relativité', 'Que signifie la relation E = mc² ?', 'La masse possède une énergie équivalente', 'La conversion entre masse et énergie est amplifiée par le carré de la vitesse de la lumière.', 1, '39-nuclear-physics'),
  row('nuclear-fission-definition', 'Physique nucléaire', 'Que se passe-t-il lors d’une fission nucléaire ?', 'Un noyau lourd se scinde en noyaux plus légers', 'La fission peut libérer de l’énergie et des neutrons supplémentaires.', 1, '39-nuclear-physics'),
  row('nuclear-fusion-definition', 'Physique nucléaire', 'Que se passe-t-il lors d’une fusion nucléaire ?', 'Des noyaux légers s’assemblent en un noyau plus lourd', 'La fusion libère de l’énergie lorsque la masse des produits est inférieure à celle des réactifs.', 1, '39-nuclear-physics'),
  row('standard-model-quarks', 'Physique des particules', 'De quelles particules sont composés les protons et les neutrons dans le modèle standard ?', 'De quarks', 'Les protons et les neutrons sont des hadrons constitués de quarks liés par l’interaction forte.', 2, '41-particle-physics'),
  row('neutrino-electric-charge', 'Physique des particules', 'Quelle est la charge électrique d’un neutrino ?', 'Nulle', 'Les neutrinos sont des leptons électriquement neutres qui interagissent très faiblement avec la matière.', 1, '41-particle-physics'),
];

const CHAPTER_URLS: Record<string, string> = {
  '2-vectors': '2-kinematics',
  '3-motion-along-a-straight-line': '2-kinematics',
  '5-newtons-laws-of-motion': '4-dynamics-force-and-newtons-laws-of-motion',
  '6-applications-of-newtons-laws': '5-further-applications-of-newtons-laws-of-motion',
  '7-work-and-kinetic-energy': '7-work-energy-and-energy-resources',
  '8-potential-energy-and-conservation-of-energy': '7-work-energy-and-energy-resources',
  '9-linear-momentum-and-collisions': '8-linear-momentum-and-collisions',
  '10-fixed-axis-rotation': '10-rotational-motion-and-angular-momentum',
  '11-angular-momentum': '10-rotational-motion-and-angular-momentum',
  '12-static-equilibrium-and-elasticity': '9-statics-and-torque',
  '13-gravitation': '6-gravitation-and-uniform-circular-motion',
  '14-fluid-mechanics': '12-fluid-dynamics-and-its-biological-and-medical-applications',
  '15-oscillations': '16-oscillatory-motion-and-waves',
  '16-waves': '16-oscillatory-motion-and-waves',
  '18-sound': '17-physics-of-hearing',
  '20-the-first-law-of-thermodynamics': '15-thermodynamics',
  '22-the-second-law-of-thermodynamics': '15-thermodynamics',
  '18-electric-charge-and-electric-field': '18-electric-charge-and-electric-field',
  '20-gausss-law': '18-electric-charge-and-electric-field',
  '21-electric-potential': '19-electric-potential-and-electric-field',
  '24-capacitance': '19-electric-potential-and-electric-field',
  '25-current-resistance-and-ohms-law': '20-electric-current-resistance-and-ohms-law',
  '26-direct-current-circuits': '21-circuits-bioelectricity-and-dc-instruments',
  '27-magnetic-fields-and-forces': '22-magnetism',
  '28-sources-of-magnetic-field': '22-magnetism',
  '29-electromagnetic-induction': '23-electromagnetic-induction-ac-circuits-and-electrical-technologies',
  '31-alternating-current': '23-electromagnetic-induction-ac-circuits-and-electrical-technologies',
  '33-electromagnetic-waves': '24-electromagnetic-waves',
  '34-image-formation-by-geometric-optics': '25-geometric-optics',
  '35-interference': '27-wave-optics',
  '36-diffraction': '27-wave-optics',
  '37-quantum-nature-of-light': '29-introduction-to-quantum-physics',
  '38-photons-and-matter-waves': '29-introduction-to-quantum-physics',
  '39-nuclear-physics': '31-radioactivity-and-nuclear-physics',
  '40-nuclear-physics-and-radioactivity': '31-radioactivity-and-nuclear-physics',
  '41-particle-physics': '33-particle-physics',
};

const sourceUrl = (chapter: string) => `https://openstax.org/books/college-physics-2e/pages/${CHAPTER_URLS[chapter] ?? chapter}`;
const provenance = (factId: string, chapter: string): QuestionProvenance => ({
  factId,
  source: SOURCE,
  url: sourceUrl(chapter),
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
});

export const VERIFIED_PHYSICS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => {
  const factId = `fact-physics-openstax-${id}`;
  return {
    id: `physics-openstax-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Sciences',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['physique', subcategory.toLowerCase()],
    provenance: provenance(factId, chapter),
  } satisfies Question;
});

export const VERIFIED_PHYSICS_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-university-physics-facts',
  questions: VERIFIED_PHYSICS_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/college-physics-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_PHYSICS_OPENSTAX_BATCH;
