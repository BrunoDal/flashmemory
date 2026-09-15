import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent chemistry facts checked against OpenStax Chemistry 2e.
 * OpenStax publishes this textbook under CC BY 4.0.  Each row is one
 * editorial fact with a chapter-level URL; no wording variants are generated.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'OpenStax Chemistry 2e';
const LICENSE = 'CC BY 4.0';
const METHOD = 'manual editorial check against the cited OpenStax Chemistry 2e chapter';

type Chapter = '1-1-chemistry-in-context' | '1-2-phases-and-classification-of-matter' | '2-1-early-ideas-in-atomic-theory' | '2-2-evolution-of-atomic-theory' | '2-3-atomic-structure-and-symbolism' | '2-4-chemical-formulas' | '3-1-formula-mass-and-the-mole-concept' | '3-2-determining-empirical-and-molecular-formulas' | '3-3-molarity' | '4-1-writing-and-balancing-chemical-equations' | '4-2-classifying-chemical-reactions' | '4-3-reaction-stoichiometry' | '5-1-energy-basics' | '5-2-calorimetry' | '5-3-enthalpy' | '6-1-electromagnetic-energy' | '6-2-the-bohr-model' | '6-3-development-of-quantum-theory' | '6-4-electronic-structure-of-atoms' | '6-5-periodic-variations-in-element-properties' | '7-1-ionic-bonding' | '7-2-covalent-bonding' | '7-3-lewis-symbols-and-structures' | '7-4-formal-charges-and-resonance' | '7-6-molecular-structure-and-polarity' | '9-1-gas-pressure' | '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law' | '10-1-intermolecular-forces' | '10-2-properties-of-liquids' | '10-3-phase-transitions' | '11-1-the-dissolution-process' | '11-2-electrolytes' | '11-3-solubility' | '11-4-colligative-properties' | '12-1-chemical-reaction-rates' | '12-2-factors-affecting-reaction-rates' | '13-1-chemical-equilibria' | '13-3-shifting-equilibria-le-chateliers-principle' | '14-1-bronsted-lowry-acids-and-bases' | '17-1-balancing-oxidation-reduction-equations' | '17-2-galvanic-cells' | '18-1-periodicity' | '19-2-coordination-chemistry-of-transition-metals' | '12-1-types-of-solutions' | '12-2-solubility' | '12-4-colligative-properties' | '14-2-reaction-rates' | '14-1-factors-that-affect-reaction-rates' | '15-1-factors-that-affect-chemical-equilibria' | '16-1-acids-and-bases' | '16-2-bronsted-lowry-acid-base-theory' | '19-1-coordination-chemistry' | '14-2-ph-and-poh';

type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: Chapter];
const row = (...values: Row): Row => values;

const ROWS: readonly Row[] = [
  row('matter-classification', 'Matière', 'Comment distingue-t-on une substance pure d’un mélange ?', 'Une substance pure a une composition constante, tandis qu’un mélange contient plusieurs substances', 'Une substance pure possède une composition et des propriétés caractéristiques constantes ; un mélange associe plusieurs substances.', 1, '1-2-phases-and-classification-of-matter'),
  row('homogeneous-mixture', 'Matière', 'Comment appelle-t-on un mélange dont la composition est uniforme à l’échelle observée ?', 'Un mélange homogène', 'Une solution est un exemple de mélange homogène.', 1, '1-2-phases-and-classification-of-matter'),
  row('heterogeneous-mixture', 'Matière', 'Comment appelle-t-on un mélange dont la composition varie selon la région observée ?', 'Un mélange hétérogène', 'Les constituants d’un mélange hétérogène ne sont pas répartis uniformément.', 1, '1-2-phases-and-classification-of-matter'),
  row('physical-change', 'Matière', 'Une transformation physique change-t-elle l’identité chimique d’une substance ?', 'Non', 'Une transformation physique modifie l’état ou l’aspect sans produire une nouvelle substance.', 1, '1-2-phases-and-classification-of-matter'),
  row('chemical-change', 'Matière', 'Quel type de transformation produit une ou plusieurs nouvelles substances ?', 'Une transformation chimique', 'La composition chimique change au cours d’une réaction chimique.', 1, '1-2-phases-and-classification-of-matter'),
  row('law-conservation-mass', 'Matière', 'Que dit la loi de conservation de la masse pour une réaction chimique dans un système fermé ?', 'La masse totale reste constante', 'Les atomes sont réarrangés, mais ne sont ni créés ni détruits dans la réaction.', 1, '1-1-chemistry-in-context'),
  row('dalton-postulate', 'Atome', 'Selon le modèle de Dalton, les composés sont-ils formés d’atomes dans des rapports entiers ?', 'Oui', 'Le modèle historique de Dalton décrit les composés comme des combinaisons d’atomes selon des rapports entiers simples.', 1, '2-1-early-ideas-in-atomic-theory'),
  row('electron-charge', 'Atome', 'Quelle est la charge électrique relative d’un électron ?', '−1', 'L’électron porte une charge négative de même grandeur que la charge positive relative du proton.', 1, '2-3-atomic-structure-and-symbolism'),
  row('proton-charge', 'Atome', 'Quelle est la charge électrique relative d’un proton ?', '+1', 'Le proton porte une charge positive élémentaire.', 1, '2-3-atomic-structure-and-symbolism'),
  row('neutron-charge', 'Atome', 'Quelle est la charge électrique relative d’un neutron ?', '0', 'Le neutron est électriquement neutre.', 1, '2-3-atomic-structure-and-symbolism'),
  row('atomic-number', 'Atome', 'Que représente le numéro atomique d’un élément ?', 'Le nombre de protons de son noyau', 'Le nombre de protons définit l’identité de l’élément.', 1, '2-3-atomic-structure-and-symbolism'),
  row('mass-number', 'Atome', 'Que représente le nombre de masse d’un isotope ?', 'Le nombre total de protons et de neutrons', 'Le nombre de masse est la somme des nucléons du noyau.', 1, '2-3-atomic-structure-and-symbolism'),
  row('isotopes-definition', 'Atome', 'Que sont deux isotopes d’un même élément ?', 'Des atomes ayant le même nombre de protons mais des nombres de neutrons différents', 'Ils ont le même numéro atomique mais des nombres de masse différents.', 1, '2-3-atomic-structure-and-symbolism'),
  row('cation-definition', 'Ions', 'Comment appelle-t-on un ion chargé positivement ?', 'Un cation', 'Un atome ou groupe d’atomes devient cation en perdant des électrons.', 1, '2-4-chemical-formulas'),
  row('anion-definition', 'Ions', 'Comment appelle-t-on un ion chargé négativement ?', 'Un anion', 'Un anion possède un excès d’électrons par rapport à l’espèce neutre.', 1, '2-4-chemical-formulas'),
  row('empirical-formula', 'Formules', 'Que donne une formule empirique ?', 'Le rapport entier minimal entre les éléments d’un composé', 'Elle ne donne pas forcément le nombre réel d’atomes dans une molécule.', 2, '2-4-chemical-formulas'),
  row('molecular-formula', 'Formules', 'Que donne une formule moléculaire ?', 'Le nombre réel de chaque type d’atome dans une molécule', 'La formule moléculaire est un multiple entier de la formule empirique.', 1, '2-4-chemical-formulas'),
  row('coefficient-equation', 'Réactions', 'Que modifie un coefficient placé devant une formule dans une équation chimique ?', 'La quantité de matière représentée', 'Un coefficient multiplie toutes les espèces de la formule, sans modifier la composition du composé.', 1, '4-1-writing-and-balancing-chemical-equations'),
  row('subscript-equation', 'Réactions', 'Pourquoi ne faut-il pas changer les indices d’une formule pour équilibrer une équation ?', 'Parce que cela changerait l’identité du composé', 'Les indices font partie de la formule chimique ; seuls les coefficients équilibrent une équation.', 1, '4-1-writing-and-balancing-chemical-equations'),
  row('synthesis-reaction', 'Réactions', 'Quel schéma général correspond à une réaction de synthèse ?', 'A + B → AB', 'Deux substances ou plus se combinent pour former un seul produit.', 1, '4-2-classifying-chemical-reactions'),
  row('decomposition-reaction', 'Réactions', 'Quel schéma général correspond à une réaction de décomposition ?', 'AB → A + B', 'Un seul composé se transforme en plusieurs substances plus simples.', 1, '4-2-classifying-chemical-reactions'),
  row('combustion-hydrocarbon', 'Réactions', 'Quels produits forment généralement la combustion complète d’un hydrocarbure dans le dioxygène ?', 'Du dioxyde de carbone et de l’eau', 'Une combustion complète d’un hydrocarbure forme CO₂ et H₂O lorsque le dioxygène est suffisant.', 1, '4-2-classifying-chemical-reactions'),
  row('limiting-reactant', 'Stœchiométrie', 'Quel réactif limite la quantité maximale de produit formé ?', 'Le réactif limitant', 'Il est consommé en premier selon les proportions de l’équation équilibrée.', 1, '4-3-reaction-stoichiometry'),
  row('mole-definition', 'Stœchiométrie', 'Que mesure une mole de substance ?', 'Une quantité contenant un nombre fixe d’entités', 'La mole est l’unité de quantité de matière et relie le monde microscopique aux mesures macroscopiques.', 1, '3-3-molarity'),
  row('molarity-definition', 'Solutions', 'Comment définit-on la molarité d’une solution ?', 'La quantité de soluté par volume de solution', 'La molarité s’exprime en moles par litre de solution.', 1, '3-3-molarity'),
  row('dilution-solvent', 'Solutions', 'Lors d’une dilution, ajoute-t-on principalement du solvant ou du soluté ?', 'Du solvant', 'La quantité de soluté reste constante tandis que le volume total augmente.', 1, '3-3-molarity'),
  row('electrolyte-definition', 'Solutions', 'Qu’est-ce qu’un électrolyte en solution aqueuse ?', 'Une substance qui produit des ions et rend la solution conductrice', 'Les ions mobiles transportent la charge électrique dans la solution.', 1, '11-2-electrolytes'),
  row('strong-electrolyte', 'Solutions', 'Comment se comporte un électrolyte fort dissous dans l’eau ?', 'Il est essentiellement dissocié ou ionisé', 'Un électrolyte fort produit une forte concentration d’ions en solution.', 2, '11-2-electrolytes'),
  row('precipitate-definition', 'Réactions aqueuses', 'Comment appelle-t-on un solide qui se forme dans une solution lors d’une réaction ?', 'Un précipité', 'Le précipité est une phase solide peu soluble dans le milieu réactionnel.', 1, '4-2-classifying-chemical-reactions'),
  row('spectator-ion', 'Réactions aqueuses', 'Qu’est-ce qu’un ion spectateur dans une équation ionique ?', 'Un ion présent avant et après la réaction sans transformation', 'Les ions spectateurs sont supprimés de l’équation ionique nette.', 2, '4-1-writing-and-balancing-chemical-equations'),
  row('net-ionic-equation', 'Réactions aqueuses', 'Que montre une équation ionique nette ?', 'Les espèces qui participent effectivement à la transformation', 'Elle omet les ions spectateurs et décrit le changement chimique essentiel.', 2, '4-1-writing-and-balancing-chemical-equations'),
  row('acid-arrhenius', 'Acides-bases', 'Selon Arrhenius, que produit un acide en solution aqueuse ?', 'Des ions H⁺ ou H₃O⁺', 'Dans l’eau, le proton est associé à une molécule d’eau sous forme d’ion hydronium.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('base-arrhenius', 'Acides-bases', 'Selon Arrhenius, que produit une base en solution aqueuse ?', 'Des ions OH⁻', 'La définition d’Arrhenius relie une base à l’augmentation de la concentration en hydroxyde.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('neutralization-products', 'Acides-bases', 'Quels produits résultent généralement d’une neutralisation entre un acide et une base ?', 'De l’eau et un sel', 'Les ions acides et basiques réagissent pour former de l’eau, les autres ions forment le sel.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('oxidation-definition', 'Oxydoréduction', 'Comment définit-on l’oxydation en termes d’électrons ?', 'Une perte d’électrons', 'L’espèce oxydée cède des électrons et son nombre d’oxydation augmente.', 1, '17-1-balancing-oxidation-reduction-equations'),
  row('reduction-definition', 'Oxydoréduction', 'Comment définit-on la réduction en termes d’électrons ?', 'Un gain d’électrons', 'L’espèce réduite reçoit des électrons et son nombre d’oxydation diminue.', 1, '17-1-balancing-oxidation-reduction-equations'),
  row('redox-agent', 'Oxydoréduction', 'Quel rôle joue un agent oxydant dans une réaction d’oxydoréduction ?', 'Il accepte des électrons et est réduit', 'L’agent oxydant provoque l’oxydation de l’autre espèce en captant ses électrons.', 2, '17-1-balancing-oxidation-reduction-equations'),
  row('system-surroundings', 'Thermochimie', 'Comment appelle-t-on tout ce qui est étudié dans une analyse thermochimique ?', 'Le système', 'Le reste de l’univers est appelé l’environnement ou les alentours.', 1, '5-1-energy-basics'),
  row('exothermic-reaction', 'Thermochimie', 'Une réaction exothermique libère-t-elle ou absorbe-t-elle de la chaleur ?', 'Elle libère de la chaleur', 'La chaleur quitte le système pour aller vers l’environnement.', 1, '5-1-energy-basics'),
  row('endothermic-reaction', 'Thermochimie', 'Une réaction endothermique libère-t-elle ou absorbe-t-elle de la chaleur ?', 'Elle absorbe de la chaleur', 'La chaleur entre dans le système depuis l’environnement.', 1, '5-1-energy-basics'),
  row('calorimetry-purpose', 'Thermochimie', 'À quoi sert la calorimétrie ?', 'À mesurer les transferts de chaleur', 'Un calorimètre permet de relier une variation de température à une quantité de chaleur.', 1, '5-2-calorimetry'),
  row('heat-capacity-definition', 'Thermochimie', 'Que représente la capacité thermique d’un objet ?', 'La chaleur nécessaire pour augmenter sa température d’une unité', 'Elle dépend de la quantité et de la nature de la matière.', 2, '5-2-calorimetry'),
  row('enthalpy-state-function', 'Thermochimie', 'L’enthalpie est-elle une fonction d’état ?', 'Oui', 'Sa variation dépend des états initial et final, pas du chemin suivi.', 2, '5-3-enthalpy'),
  row('hess-law', 'Thermochimie', 'Que permet la loi de Hess ?', 'Calculer une variation d’enthalpie en additionnant des équations connues', 'Les variations d’enthalpie s’additionnent car l’enthalpie est une fonction d’état.', 2, '5-3-enthalpy'),
  row('photon-energy-frequency', 'Structure électronique', 'Comment varie l’énergie d’un photon quand sa fréquence augmente ?', 'Elle augmente', 'L’énergie d’un photon est proportionnelle à sa fréquence.', 1, '6-1-electromagnetic-energy'),
  row('wavelength-frequency', 'Structure électronique', 'Pour une onde électromagnétique, comment varie la longueur d’onde quand la fréquence augmente ?', 'Elle diminue', 'Dans le vide, la vitesse de propagation est constante, donc fréquence et longueur d’onde varient en sens inverse.', 1, '6-1-electromagnetic-energy'),
  row('bohr-quantized-levels', 'Structure électronique', 'Dans le modèle de Bohr, les électrons occupent-ils des niveaux d’énergie continus ?', 'Non, des niveaux d’énergie quantifiés', 'Le modèle de Bohr associe aux électrons des niveaux discrets.', 1, '6-2-the-bohr-model'),
  row('emission-photon', 'Structure électronique', 'Que se passe-t-il lorsqu’un électron passe vers un niveau d’énergie inférieur ?', 'Un photon est émis', 'L’énergie libérée correspond à la différence entre les deux niveaux.', 1, '6-2-the-bohr-model'),
  row('orbital-capacity', 'Structure électronique', 'Combien d’électrons une orbitale peut-elle contenir au maximum ?', 'Deux', 'Le principe d’exclusion de Pauli impose des spins opposés dans une même orbitale.', 1, '6-4-electronic-structure-of-atoms'),
  row('s-orbitals-count', 'Structure électronique', 'Combien d’orbitales contient une sous-couche s ?', 'Une', 'Une sous-couche s correspond à une orbitale de forme sphérique.', 1, '6-4-electronic-structure-of-atoms'),
  row('p-orbitals-count', 'Structure électronique', 'Combien d’orbitales contient une sous-couche p ?', 'Trois', 'Les trois orbitales p ont des orientations différentes dans l’espace.', 1, '6-4-electronic-structure-of-atoms'),
  row('aufbau-principle', 'Structure électronique', 'Que décrit le principe de construction de l’ordre énergétique des électrons ?', 'Les électrons remplissent d’abord les orbitales de plus basse énergie', 'La configuration fondamentale suit un remplissage progressif des orbitales.', 1, '6-4-electronic-structure-of-atoms'),
  row('atomic-radius-trend', 'Propriétés périodiques', 'Comment varie généralement le rayon atomique de haut en bas dans une famille ?', 'Il augmente', 'De nouvelles couches électroniques sont ajoutées en descendant une famille.', 1, '6-5-periodic-variations-in-element-properties'),
  row('ionization-energy-trend', 'Propriétés périodiques', 'Comment varie généralement l’énergie d’ionisation de gauche à droite dans une période ?', 'Elle augmente', 'La charge nucléaire effective augmente généralement dans une période.', 2, '6-5-periodic-variations-in-element-properties'),
  row('electron-affinity-definition', 'Propriétés périodiques', 'Que décrit l’affinité électronique d’un atome ?', 'La variation d’énergie associée à l’ajout d’un électron', 'Elle caractérise le changement énergétique lors de la formation d’un anion gazeux.', 2, '6-5-periodic-variations-in-element-properties'),
  row('metal-conductivity', 'Propriétés périodiques', 'Quelle propriété électrique caractérise généralement les métaux ?', 'Une bonne conductivité électrique', 'Les électrons délocalisés des métaux peuvent transporter la charge.', 1, '18-1-periodicity'),
  row('ionic-bond-attraction', 'Liaisons', 'Quelle interaction maintient principalement ensemble les ions d’un solide ionique ?', 'L’attraction électrostatique entre charges opposées', 'Les ions forment un réseau stabilisé par les attractions coulombiennes.', 1, '7-1-ionic-bonding'),
  row('covalent-bond-definition', 'Liaisons', 'Que partagent deux atomes dans une liaison covalente ?', 'Un ou plusieurs doublets d’électrons', 'Le partage d’électrons permet aux atomes de former une liaison covalente.', 1, '7-2-covalent-bonding'),
  row('lewis-valence-electrons', 'Liaisons', 'Que représentent les points autour du symbole d’un élément dans un symbole de Lewis ?', 'Ses électrons de valence', 'Les électrons de valence participent principalement aux liaisons chimiques.', 1, '7-3-lewis-symbols-and-structures'),
  row('octet-rule', 'Liaisons', 'Que propose la règle de l’octet pour de nombreux éléments des groupes principaux ?', 'Qu’ils tendent à atteindre huit électrons de valence', 'La règle est un modèle utile mais comporte des exceptions.', 1, '7-3-lewis-symbols-and-structures'),
  row('resonance-structures', 'Liaisons', 'Que représentent plusieurs structures de résonance d’une même espèce ?', 'Des représentations limites d’une même structure électronique réelle', 'La structure réelle est un hybride de résonance, pas un basculement entre dessins.', 2, '7-4-formal-charges-and-resonance'),
  row('formal-charge-purpose', 'Liaisons', 'À quoi sert une charge formelle dans une structure de Lewis ?', 'À comptabiliser les électrons attribués à chaque atome dans le modèle', 'Elle aide à comparer des structures de Lewis possibles.', 2, '7-4-formal-charges-and-resonance'),
  row('vsepr-repulsion', 'Géométrie', 'Sur quoi repose le modèle VSEPR ?', 'Les domaines électroniques se repoussent et s’éloignent autant que possible', 'La répulsion entre domaines détermine la géométrie électronique approximative.', 2, '7-6-molecular-structure-and-polarity'),
  row('hydrogen-bond-definition', 'Interactions', 'Qu’est-ce qu’une liaison hydrogène ?', 'Une attraction entre un H lié à un atome électronégatif et un autre atome électronégatif', 'C’est une interaction directionnelle plus faible qu’une liaison covalente.', 1, '10-1-intermolecular-forces'),
  row('london-dispersion', 'Interactions', 'Quelle interaction intermoléculaire existe entre toutes les particules ?', 'Les forces de dispersion de London', 'Elles proviennent de fluctuations instantanées de la distribution électronique.', 1, '10-1-intermolecular-forces'),
  row('dipole-dipole', 'Interactions', 'Entre quelles molécules les interactions dipôle-dipôle apparaissent-elles ?', 'Entre molécules polaires', 'Les extrémités partiellement chargées de dipôles permanents s’attirent.', 1, '10-1-intermolecular-forces'),
  row('surface-tension', 'Liquides', 'Quelle propriété traduit la résistance de la surface d’un liquide à son extension ?', 'La tension superficielle', 'Elle résulte de forces de cohésion entre molécules à la surface.', 1, '10-2-properties-of-liquids'),
  row('viscosity-definition', 'Liquides', 'Que mesure la viscosité d’un liquide ?', 'Sa résistance à l’écoulement', 'Une viscosité élevée correspond à un écoulement plus difficile.', 1, '10-2-properties-of-liquids'),
  row('melting-transition', 'Changements d’état', 'Comment appelle-t-on le passage d’un solide à un liquide ?', 'La fusion', 'La fusion correspond à l’absorption d’énergie nécessaire pour désorganiser le réseau solide.', 1, '10-3-phase-transitions'),
  row('vaporization-transition', 'Changements d’état', 'Comment appelle-t-on le passage d’un liquide à un gaz ?', 'La vaporisation', 'La vaporisation comprend l’évaporation et l’ébullition.', 1, '10-3-phase-transitions'),
  row('ideal-gas-assumptions', 'Gaz', 'Dans le modèle du gaz idéal, le volume propre des particules est-il négligé ?', 'Oui', 'Le modèle suppose des particules ponctuelles dont le volume est négligeable devant le volume du récipient.', 2, '9-1-gas-pressure'),
  row('boyle-law', 'Gaz', 'À température constante, comment varie le volume d’un gaz quand sa pression augmente ?', 'Il diminue', 'La loi de Boyle relie pression et volume par une relation inverse à température et quantité constantes.', 1, '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law'),
  row('charles-law', 'Gaz', 'À pression constante, comment varie le volume d’un gaz quand sa température absolue augmente ?', 'Il augmente', 'La loi de Charles établit une proportionnalité entre volume et température absolue.', 1, '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law'),
  row('avogadro-law', 'Gaz', 'À température et pression constantes, comment varie le volume d’un gaz quand la quantité de matière augmente ?', 'Il augmente', 'La loi d’Avogadro relie volume et quantité de matière dans ces conditions.', 1, '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law'),
  row('ideal-gas-equation', 'Gaz', 'Quelle équation relie pression, volume, quantité et température d’un gaz idéal ?', 'PV = nRT', 'La loi des gaz parfaits rassemble les principales relations expérimentales des gaz.', 1, '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law'),
  row('gas-temperature-kelvin', 'Gaz', 'Quelle échelle de température faut-il utiliser dans la loi des gaz parfaits ?', 'L’échelle kelvin', 'Les relations des gaz utilisent la température absolue.', 1, '9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law'),
  row('solution-solute-solvent', 'Solutions', 'Dans une solution, comment appelle-t-on le composant dissous ?', 'Le soluté', 'Le solvant est le composant qui dissout le soluté.', 1, '11-1-the-dissolution-process'),
  row('saturated-solution', 'Solutions', 'Qu’est-ce qu’une solution saturée ?', 'Une solution qui contient la quantité maximale de soluté dissous dans les conditions données', 'Un excès de soluté peut alors rester non dissous.', 1, '11-3-solubility'),
  row('solubility-temperature', 'Solutions', 'La solubilité d’un solide dans un liquide dépend-elle généralement de la température ?', 'Oui', 'La solubilité est une propriété qui peut varier avec la température et la nature des substances.', 1, '11-3-solubility'),
  row('colligative-properties', 'Solutions', 'De quoi dépendent les propriétés colligatives d’une solution ?', 'Du nombre de particules de soluté dissoutes', 'Elles ne dépendent pas directement de l’identité chimique des particules, dans le modèle idéal.', 2, '11-4-colligative-properties'),
  row('reaction-rate-definition', 'Cinétique', 'Que mesure la vitesse d’une réaction chimique ?', 'La variation de concentration d’une espèce par unité de temps', 'La vitesse décrit l’évolution temporelle des réactifs ou des produits.', 1, '12-1-chemical-reaction-rates'),
  row('temperature-rate', 'Cinétique', 'Quel est généralement l’effet d’une hausse de température sur la vitesse d’une réaction ?', 'Elle l’augmente', 'Une plus grande fraction des collisions possède alors une énergie suffisante.', 1, '12-2-factors-affecting-reaction-rates'),
  row('catalyst-activation-energy', 'Cinétique', 'Comment un catalyseur modifie-t-il l’énergie d’activation ?', 'Il fournit un chemin réactionnel de plus faible énergie d’activation', 'Il accélère la réaction sans être consommé dans le bilan global.', 1, '12-2-factors-affecting-reaction-rates'),
  row('equilibrium-dynamic', 'Équilibre', 'À l’équilibre chimique, les réactions directe et inverse s’arrêtent-elles ?', 'Non, elles se poursuivent à des vitesses égales', 'L’équilibre est dynamique : les concentrations restent constantes macroscopiquement.', 2, '13-1-chemical-equilibria'),
  row('le-chatelier', 'Équilibre', 'Que prévoit le principe de Le Chatelier après une perturbation d’un équilibre ?', 'Le système évolue dans le sens qui s’oppose à la perturbation', 'Le système tend à réduire l’effet du changement imposé.', 2, '13-3-shifting-equilibria-le-chateliers-principle'),
  row('bronsted-acid', 'Acides-bases', 'Selon Brønsted-Lowry, qu’est-ce qu’un acide ?', 'Un donneur de proton', 'Un acide transfère un proton à une autre espèce.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('bronsted-base', 'Acides-bases', 'Selon Brønsted-Lowry, qu’est-ce qu’une base ?', 'Un accepteur de proton', 'Une base reçoit un proton lors de la réaction acide-base.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('conjugate-pair', 'Acides-bases', 'Que sont deux espèces conjuguées dans une réaction acide-base ?', 'Deux espèces qui diffèrent d’un seul proton', 'La base conjuguée s’obtient quand l’acide perd un proton.', 1, '14-1-bronsted-lowry-acids-and-bases'),
  row('ph-definition', 'Acides-bases', 'Que mesure le pH d’une solution aqueuse ?', 'Une mesure logarithmique de l’activité des ions hydronium', 'Dans l’approximation usuelle des solutions diluées, le pH est relié à la concentration en H₃O⁺.', 2, '14-2-ph-and-poh'),
  row('half-reaction', 'Électrochimie', 'Que représente une demi-équation d’oxydoréduction ?', 'Une partie séparée décrivant une oxydation ou une réduction', 'Les demi-équations permettent d’équilibrer séparément les électrons transférés.', 1, '17-1-balancing-oxidation-reduction-equations'),
  row('galvanic-cell-spontaneous', 'Électrochimie', 'Quelle transformation produit spontanément un courant dans une pile galvanique ?', 'Une réaction d’oxydoréduction spontanée', 'La pile convertit l’énergie chimique d’une réaction spontanée en énergie électrique.', 1, '17-2-galvanic-cells'),
  row('anode-oxidation', 'Électrochimie', 'Que se produit-il toujours à l’anode ?', 'Une oxydation', 'L’anode est définie par le lieu de l’oxydation, quel que soit le type de cellule.', 1, '17-2-galvanic-cells'),
  row('cathode-reduction', 'Électrochimie', 'Que se produit-il toujours à la cathode ?', 'Une réduction', 'La cathode est définie par le lieu de la réduction.', 1, '17-2-galvanic-cells'),
  row('coordination-complex', 'Chimie de coordination', 'Comment appelle-t-on une espèce formée d’un métal central lié à des ligands ?', 'Un complexe de coordination', 'Les ligands fournissent des doublets électroniques au centre métallique.', 1, '19-2-coordination-chemistry-of-transition-metals'),
  row('ligand-definition', 'Chimie de coordination', 'Quel rôle joue un ligand dans un complexe ?', 'Il donne un doublet électronique au centre métallique', 'La liaison ligand-métal est décrite comme une liaison de coordination.', 1, '19-2-coordination-chemistry-of-transition-metals'),
  row('coordination-number', 'Chimie de coordination', 'Que compte le nombre de coordination d’un complexe ?', 'Le nombre d’atomes donneurs directement liés au métal central', 'Il ne compte pas nécessairement le nombre total de ligands si certains sont polydentates.', 2, '19-2-coordination-chemistry-of-transition-metals'),
] as const;

const sourceUrl = (chapter: Chapter) => `https://openstax.org/books/chemistry-2e/pages/${chapter}`;
const provenance = (factId: string, chapter: Chapter): QuestionProvenance => ({ factId, source: SOURCE, url: sourceUrl(chapter), license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' });

export const VERIFIED_CHEMISTRY_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => ({
  id: `chemistry-openstax-${id}`,
  factId: `fact-chemistry-openstax-${id}`,
  version: 1,
  type: 'flashcard',
  category: 'Sciences',
  subcategory,
  question,
  answer,
  acceptedAnswers: [answer],
  explanation,
  difficulty,
  tags: ['chimie', subcategory.toLowerCase()],
  provenance: provenance(`fact-chemistry-openstax-${id}`, chapter),
} satisfies Question));

export const VERIFIED_CHEMISTRY_OPENSTAX_BATCH: VerifiedContentBatch = {
  id: 'openstax-chemistry-2e-facts',
  questions: VERIFIED_CHEMISTRY_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://openstax.org/details/books/chemistry-2e',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual editorial check of independent claims against the cited chapter; no generated variants',
  status: 'approved',
};

export default VERIFIED_CHEMISTRY_OPENSTAX_BATCH;
