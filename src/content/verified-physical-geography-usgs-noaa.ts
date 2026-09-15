import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent physical-geography claims reviewed against USGS, NOAA and NASA
 * Earth Observatory educational pages. This is an editorial batch: one row is
 * one fact, and no row is a wording variant of another row.
 */
const CHECKED_AT = '2026-09-15';
const SOURCE = 'USGS, NOAA Ocean Service et NASA Earth Observatory';
const LICENSE = 'Domaine public américain (USGS, NOAA et NASA, sauf mention contraire sur la page source)';
const METHOD = 'Relecture éditoriale de la page officielle indiquée; fait descriptif stable, distinct et sans variante générée.';

const URLS = {
  maps: 'https://www.usgs.gov/programs/national-geospatial-program/topographic-maps',
  topo: 'https://www.usgs.gov/programs/national-geospatial-program/topographic-maps/what-is-a-topographic-map',
  hazards: 'https://www.usgs.gov/programs/natural-hazards',
  coasts: 'https://oceanservice.noaa.gov/education/tutorial_coastal/',
  ocean: 'https://oceanservice.noaa.gov/facts/oceanwater.html',
  currents: 'https://oceanservice.noaa.gov/education/tutorial_currents/01intro.html',
  tides: 'https://oceanservice.noaa.gov/education/tutorial_tides/tides01_intro.html',
  tsunami: 'https://oceanservice.noaa.gov/facts/tsunami.html',
  atmosphere: 'https://www.noaa.gov/jetstream/layers-of-atmosphere',
  climate: 'https://www.noaa.gov/education/resource-collections/weather-atmosphere',
  glaciers: 'https://www.usgs.gov/programs/water-resources/science/glaciers',
  floods: 'https://www.usgs.gov/mission-areas/water-resources/science/floods',
  soil: 'https://www.nrcs.usda.gov/resources/education-and-teaching-materials/soil-basics',
  earth: 'https://earthobservatory.nasa.gov/features/WorldOfChange',
} as const;

type Row = readonly [id: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, sourceUrl: string];

const rows: readonly Row[] = [
  ['map-contour-line', 'Que relie une courbe de niveau sur une carte topographique ?', 'Des points de même altitude', 'Une courbe de niveau représente une altitude constante.', 1, URLS.topo],
  ['map-contour-interval', 'Que désigne l’équidistance d’une carte topographique ?', 'La différence d’altitude entre deux courbes de niveau voisines', 'L’équidistance est constante sur une carte donnée.', 2, URLS.topo],
  ['map-contour-close', 'Que signifie un espacement serré des courbes de niveau ?', 'Une pente forte', 'Des courbes proches indiquent un changement rapide d’altitude.', 1, URLS.topo],
  ['map-contour-wide', 'Que signifie un espacement large des courbes de niveau ?', 'Une pente douce', 'Des courbes éloignées indiquent un changement plus progressif d’altitude.', 1, URLS.topo],
  ['map-bench-mark', 'Quel symbole indique une altitude mesurée avec précision sur une carte topographique ?', 'Un point coté', 'Un point coté associe une position à une altitude connue.', 2, URLS.topo],
  ['map-scale', 'À quoi sert l’échelle d’une carte ?', 'À relier une distance sur la carte à une distance réelle', 'L’échelle permet de convertir les mesures cartographiques.', 1, URLS.maps],
  ['map-relief-shading', 'Que montre l’ombrage du relief sur une carte ?', 'La forme du terrain par des contrastes de lumière et d’ombre', 'L’ombrage rend les versants et les vallées plus lisibles.', 1, URLS.topo],
  ['map-stream-v', 'Dans quelle direction pointe généralement le V formé par des courbes de niveau dans une vallée ?', 'Vers l’amont', 'Le V des courbes de niveau remonte vers la source du cours d’eau.', 2, URLS.topo],
  ['map-ridge-u', 'Comment les courbes de niveau d’une crête se distinguent-elles d’une vallée ?', 'Elles forment des avancées orientées vers les altitudes plus basses', 'La forme des courbes permet de distinguer les lignes de partage et les vallées.', 3, URLS.topo],
  ['map-digital-elevation', 'Que représente un modèle numérique d’élévation ?', 'L’altitude du terrain sous forme de données numériques', 'Un MNE permet d’analyser le relief par ordinateur.', 1, URLS.maps],
  ['map-geographic-coordinate', 'Que localisent la latitude et la longitude ?', 'Un point à la surface de la Terre', 'Les coordonnées géographiques donnent une position sur le globe.', 1, URLS.maps],
  ['map-latitude-equator', 'Quelle latitude est attribuée à l’équateur ?', '0 degré', 'L’équateur est le plan de référence pour la latitude.', 1, URLS.maps],
  ['map-longitude-meridian', 'Quel méridien sert de référence aux longitudes ?', 'Le méridien de Greenwich', 'Les longitudes sont mesurées à partir de ce méridien d’origine.', 1, URLS.maps],
  ['map-north-arrow', 'Que précise une flèche du nord sur une carte ?', 'La direction du nord', 'Elle permet d’orienter les autres directions.', 1, URLS.maps],
  ['map-watershed-divide', 'Que sépare une ligne de partage des eaux ?', 'Deux bassins versants', 'Les précipitations tombant de chaque côté s’écoulent vers des exutoires différents.', 1, URLS.floods],

  ['coast-tide', 'Qu’est-ce qu’une marée ?', 'Une variation périodique du niveau de la mer', 'Les marées résultent surtout des attractions de la Lune et du Soleil.', 1, URLS.tides],
  ['coast-high-tide', 'Comment appelle-t-on le niveau marin le plus haut d’un cycle de marée ?', 'La pleine mer', 'La pleine mer correspond au maximum local du niveau de l’eau.', 1, URLS.tides],
  ['coast-low-tide', 'Comment appelle-t-on le niveau marin le plus bas d’un cycle de marée ?', 'La basse mer', 'La basse mer correspond au minimum local du niveau de l’eau.', 1, URLS.tides],
  ['coast-spring-tide', 'Quand les marées de vive-eau se produisent-elles ?', 'Près de la nouvelle lune et de la pleine lune', 'Les forces gravitationnelles du Soleil et de la Lune s’additionnent davantage.', 2, URLS.tides],
  ['coast-neap-tide', 'Quand les marées de morte-eau se produisent-elles ?', 'Près du premier et du dernier quartier', 'Les directions des attractions solaire et lunaire réduisent l’amplitude de la marée.', 2, URLS.tides],
  ['coast-wave-period', 'Que mesure la période d’une vague ?', 'Le temps entre deux crêtes successives', 'La période décrit le rythme de passage des vagues.', 1, URLS.coasts],
  ['coast-wave-height', 'Que mesure la hauteur d’une vague ?', 'La distance verticale entre sa crête et son creux', 'La hauteur est une mesure de l’amplitude du relief de la vague.', 1, URLS.coasts],
  ['coast-wave-refraction', 'Que fait la réfraction des vagues près du rivage ?', 'Elle courbe les fronts de vagues lorsque leur vitesse change', 'Le fond moins profond ralentit certaines parties du front.', 2, URLS.coasts],
  ['coast-longshore-drift', 'Quel transport suit souvent le courant littoral ?', 'Un déplacement parallèle à la côte', 'Les vagues obliques peuvent transporter les sédiments le long du rivage.', 2, URLS.coasts],
  ['coast-beach', 'Qu’est-ce qu’une plage ?', 'Une accumulation de sédiments au bord d’une étendue d’eau', 'Les vagues et les courants remanient le sable ou les graviers du rivage.', 1, URLS.coasts],
  ['coast-spit', 'Comment se forme une flèche littorale ?', 'Par accumulation de sédiments prolongeant la côte', 'Le transport littoral dépose des matériaux dans une zone abritée.', 2, URLS.coasts],
  ['coast-barrier-island', 'Qu’est-ce qu’une île-barrière ?', 'Une bande sableuse séparée du continent par une lagune ou un chenal', 'Ces cordons côtiers protègent partiellement le rivage intérieur.', 2, URLS.coasts],
  ['coast-lagoon', 'Qu’est-ce qu’une lagune côtière ?', 'Une étendue d’eau séparée de la mer par une barrière', 'Une île-barrière ou un cordon peut isoler une eau peu profonde.', 1, URLS.coasts],
  ['coast-estuary', 'Qu’est-ce qu’un estuaire ?', 'Une embouchure où se mélangent eau douce et eau marine', 'Les estuaires relient un bassin fluvial à la mer et subissent les marées.', 1, URLS.coasts],

  ['coast-coral-reef', 'Dans quel environnement marin les récifs coralliens se développent-ils généralement ?', 'Des eaux chaudes, peu profondes et claires', 'La lumière et la température favorisent les organismes symbiotiques des coraux.', 2, URLS.coasts],
  ['coast-cliff', 'Comment une falaise marine peut-elle reculer ?', 'Par érosion de sa base par les vagues', 'La sous-cavation fragilise puis fait tomber des blocs.', 1, URLS.coasts],
  ['coast-storm-surge', 'Qu’est-ce qu’une onde de tempête ?', 'Une hausse anormale du niveau marin due à une tempête', 'Les vents et la faible pression poussent l’eau vers le rivage.', 2, URLS.coasts],

  ['coast-tsunami-wavelength', 'Pourquoi un tsunami peut-il devenir plus haut près de la côte ?', 'La diminution de profondeur ralentit et comprime la vague', 'L’énergie se concentre dans une colonne d’eau moins profonde.', 2, URLS.tsunami],

  ['ocean-density', 'Quels facteurs contrôlent principalement la densité de l’eau de mer ?', 'La température et la salinité', 'L’eau froide et salée est généralement plus dense.', 2, URLS.ocean],
  ['ocean-thermocline', 'Qu’est-ce qu’une thermocline ?', 'Une zone où la température change rapidement avec la profondeur', 'Cette couche sépare souvent des eaux de température différente.', 2, URLS.ocean],
  ['ocean-surface-current', 'Qu’est-ce qu’un courant marin de surface ?', 'Un déplacement organisé d’eau près de la surface', 'Les vents et la rotation terrestre influencent ces courants.', 1, URLS.currents],
  ['ocean-deep-current', 'Qu’est-ce qui peut mettre en mouvement une circulation profonde ?', 'Les différences de densité de l’eau', 'La température et la salinité modifient la densité et la plongée des masses d’eau.', 2, URLS.currents],
  ['ocean-coriolis', 'Quel effet dévie les grands courants à cause de la rotation terrestre ?', 'L’effet de Coriolis', 'La rotation de la Terre dévie les mouvements à grande échelle.', 1, URLS.currents],
  ['ocean-upwelling', 'Qu’est-ce qu’une remontée d’eau profonde ?', 'La montée d’eau froide et riche en nutriments vers la surface', 'Les vents peuvent éloigner l’eau de surface et favoriser cette remontée.', 2, URLS.currents],
  ['ocean-gyre', 'Qu’est-ce qu’un gyre océanique ?', 'Un vaste système de courants circulaires', 'Les vents, Coriolis et continents organisent ces circulations.', 1, URLS.currents],
  ['ocean-seafloor', 'Comment appelle-t-on le relief situé sous l’océan ?', 'Le plancher océanique', 'Il comprend des plaines abyssales, dorsales et fosses.', 1, URLS.ocean],
  ['ocean-abyssal-plain', 'Qu’est-ce qu’une plaine abyssale ?', 'Une vaste zone profonde et relativement plane du fond marin', 'Les sédiments peuvent lisser le relief du plancher océanique.', 2, URLS.ocean],

  ['glacier-accumulation', 'Dans quelle zone d’un glacier les chutes de neige s’accumulent-elles durablement ?', 'La zone d’accumulation', 'L’accumulation y dépasse la perte de glace sur une période donnée.', 1, URLS.glaciers],
  ['glacier-ablation', 'Que signifie l’ablation d’un glacier ?', 'La perte de glace ou de neige', 'La fonte, le vêlage et la sublimation peuvent retirer de la masse.', 1, URLS.glaciers],
  ['glacier-equilibrium-line', 'Que sépare généralement la ligne d’équilibre d’un glacier ?', 'Les zones d’accumulation et d’ablation', 'Au voisinage de cette ligne, les gains et pertes annuels s’équilibrent.', 2, URLS.glaciers],
  ['glacier-crevasse', 'Qu’est-ce qu’une crevasse glaciaire ?', 'Une fissure dans la glace d’un glacier', 'La glace se fracture lorsque son écoulement impose des contraintes.', 1, URLS.glaciers],
  ['glacier-flow', 'Dans quelle direction un glacier s’écoule-t-il sous l’effet de la gravité ?', 'Vers l’aval', 'La glace se déforme et glisse vers les altitudes plus basses.', 1, URLS.glaciers],
  ['glacier-calving', 'Qu’est-ce que le vêlage d’un glacier ?', 'La rupture de blocs de glace à son front', 'Des icebergs peuvent ainsi se détacher d’un glacier flottant ou côtier.', 1, URLS.glaciers],
  ['glacier-till', 'Que désigne le till glaciaire ?', 'Un sédiment déposé directement par la glace', 'Le till est un mélange non trié de tailles variées.', 2, URLS.glaciers],
  ['glacier-outwash', 'Qu’est-ce qu’une plaine proglaciaire ?', 'Une surface construite par les eaux de fonte devant un glacier', 'Les eaux trient et déposent les sédiments en aval du front.', 2, URLS.glaciers],
  ['glacier-drumlin', 'Quelle forme est un drumlin ?', 'Une colline allongée modelée sous la glace', 'Son grand axe indique souvent la direction de l’écoulement glaciaire.', 3, URLS.glaciers],
  ['glacier-arete', 'Qu’est-ce qu’une arête glaciaire ?', 'Une crête rocheuse étroite entre deux cirques', 'L’érosion de glaciers voisins aiguise la crête.', 2, URLS.glaciers],
  ['glacier-horn', 'Qu’est-ce qu’un sommet en pyramide glaciaire ?', 'Un horn', 'Plusieurs cirques peuvent éroder un sommet sur plusieurs côtés.', 2, URLS.glaciers],
  ['glacier-fjord', 'Comment se forme un fjord ?', 'Par l’inondation marine d’une vallée glaciaire profonde', 'Un glacier creuse une vallée puis la mer envahit la dépression.', 2, URLS.glaciers],
  ['glacier-sea-level', 'Quel effet la fonte d’un glacier terrestre a-t-elle sur le niveau marin ?', 'Elle contribue à l’élévation du niveau marin', 'L’eau jusque-là stockée sur les continents rejoint l’océan.', 1, URLS.glaciers],
  ['glacier-ice-sheet', 'Quelle est une calotte glaciaire continentale ?', 'Une vaste masse de glace couvrant une grande partie d’un continent', 'Elle s’étend au-delà des reliefs locaux.', 1, URLS.glaciers],
  ['glacier-ice-shelf', 'Qu’est-ce qu’une plateforme de glace ?', 'Une extension flottante d’une calotte ou d’un glacier', 'Elle est attachée à la terre mais flotte sur l’océan.', 2, URLS.glaciers],

  ['flood-floodplain', 'Qu’est-ce qu’une zone inondable fluviale ?', 'Une surface susceptible d’être recouverte lors d’une crue', 'Elle se trouve souvent dans le lit majeur d’un cours d’eau.', 1, URLS.floods],
  ['flood-discharge', 'Comment mesure-t-on le débit d’un cours d’eau ?', 'Par un volume par unité de temps', 'Le débit associe la section mouillée et la vitesse de l’écoulement.', 1, URLS.floods],
  ['flood-gauge', 'À quoi sert une station hydrométrique ?', 'À mesurer le niveau ou le débit d’un cours d’eau', 'Les mesures servent notamment à suivre les crues.', 1, URLS.floods],
  ['flood-flash', 'Qu’est-ce qu’une crue éclair ?', 'Une montée très rapide des eaux', 'Elle peut survenir après des pluies intenses sur un bassin court ou raide.', 1, URLS.floods],
  ['flood-urban-runoff', 'Pourquoi l’urbanisation peut-elle augmenter le ruissellement ?', 'Les surfaces imperméables réduisent l’infiltration', 'Routes et toits accélèrent l’arrivée de l’eau dans les chenaux.', 1, URLS.floods],
  ['flood-peak', 'Que désigne le pic de crue ?', 'Le débit maximal atteint pendant une crue', 'Le pic correspond au sommet de l’hydrogramme.', 1, URLS.floods],
  ['flood-recurrence', 'Que décrit une période de retour en hydrologie ?', 'Une fréquence statistique estimée d’un événement', 'Elle ne signifie pas que l’événement revient à intervalles réguliers.', 3, URLS.floods],
  ['flood-hydrograph', 'Que représente un hydrogramme ?', 'L’évolution du débit dans le temps', 'La courbe permet d’étudier la réponse d’un bassin à une pluie.', 2, URLS.floods],
  ['flood-baseflow', 'Qu’est-ce que le débit de base d’une rivière ?', 'La part du débit alimentée entre autres par les eaux souterraines', 'Il soutient l’écoulement lorsque les précipitations immédiates sont faibles.', 2, URLS.floods],
  ['flood-reservoir', 'Comment un réservoir peut-il modifier une crue en aval ?', 'En stockant temporairement une partie de l’eau', 'Le stockage peut réduire et retarder le pic en aval.', 2, URLS.floods],

  ['soil-profile', 'Qu’est-ce qu’un profil de sol ?', 'La succession verticale des horizons d’un sol', 'On observe les propriétés du sol de la surface vers la roche sous-jacente.', 1, URLS.soil],
  ['soil-organic-matter', 'Quelle matière provient principalement des restes d’organismes dans le sol ?', 'La matière organique', 'Elle influence la structure, la fertilité et la rétention d’eau du sol.', 1, URLS.soil],
  ['soil-texture', 'De quoi dépend la texture d’un sol ?', 'Des proportions de sable, limon et argile', 'La taille des particules contrôle une partie du comportement de l’eau.', 1, URLS.soil],
  ['soil-sand', 'Quelle particule minérale est la plus grossière entre sable, limon et argile ?', 'Le sable', 'Les grains de sable sont plus grands que ceux du limon et de l’argile.', 1, URLS.soil],
  ['soil-clay', 'Quelle particule minérale est la plus fine entre sable, limon et argile ?', 'L’argile', 'Les particules argileuses ont une très petite taille et une grande surface spécifique.', 1, URLS.soil],
  ['soil-permeability', 'Que décrit la perméabilité d’un sol ?', 'La facilité avec laquelle l’eau le traverse', 'Elle dépend de la taille et de la connexion des pores.', 1, URLS.soil],
  ['soil-infiltration', 'Que se passe-t-il lorsque l’eau pénètre depuis la surface dans le sol ?', 'Elle s’infiltre', 'L’infiltration fait entrer l’eau dans les pores du sol.', 1, URLS.soil],
  ['soil-porosity', 'Que mesure la porosité d’un sol ?', 'La proportion de volume occupée par les pores', 'Les pores peuvent contenir de l’air ou de l’eau.', 2, URLS.soil],
  ['soil-compaction', 'Quel effet le tassement a-t-il généralement sur les pores du sol ?', 'Il réduit l’espace poreux', 'La compaction peut limiter l’infiltration et la circulation de l’air.', 1, URLS.soil],
  ['soil-erosion-cover', 'Quel rôle une couverture végétale peut-elle jouer contre l’érosion du sol ?', 'Elle protège et retient les particules', 'Les racines stabilisent le sol et le feuillage intercepte l’impact des gouttes.', 1, URLS.soil],
  ['soil-parent-material', 'Que désigne le matériau parental d’un sol ?', 'Le matériau minéral dont le sol se développe', 'Il peut provenir de la roche en place ou de dépôts transportés.', 2, URLS.soil],
  ['soil-horizon-o', 'Que contient principalement l’horizon O d’un sol ?', 'De la matière organique de surface', 'Il est formé de litière et de matériaux organiques décomposés.', 1, URLS.soil],
  ['soil-horizon-a', 'Comment appelle-t-on couramment l’horizon A ?', 'La couche arable ou horizon de surface', 'Il mélange souvent matière minérale et matière organique.', 1, URLS.soil],
  ['soil-horizon-b', 'Quel processus caractérise souvent l’horizon B ?', 'L’accumulation de matériaux lessivés depuis les horizons supérieurs', 'L’argile, le fer ou d’autres substances peuvent s’y accumuler.', 2, URLS.soil],
  ['soil-horizon-c', 'Que contient généralement l’horizon C ?', 'Un matériau parental peu transformé', 'Il se trouve entre les horizons pédologiques et la roche ou le dépôt d’origine.', 2, URLS.soil],

  ['atmosphere-troposphere', 'Dans quelle couche de l’atmosphère se produit la majeure partie du temps météorologique ?', 'La troposphère', 'Elle est la couche la plus basse et contient la plus grande partie de la vapeur d’eau.', 1, URLS.atmosphere],
  ['atmosphere-stratosphere', 'Dans quelle couche se trouve principalement la couche d’ozone ?', 'La stratosphère', 'L’ozone stratosphérique absorbe une partie des ultraviolets solaires.', 1, URLS.atmosphere],
  ['atmosphere-mesosphere', 'Quelle couche se trouve au-dessus de la stratosphère ?', 'La mésosphère', 'Les couches atmosphériques sont définies notamment par leur profil thermique.', 2, URLS.atmosphere],
  ['atmosphere-thermosphere', 'Quelle couche atmosphérique est située au-dessus de la mésosphère ?', 'La thermosphère', 'La thermosphère est une région très raréfiée où la température cinétique augmente avec l’altitude.', 2, URLS.atmosphere],
  ['atmosphere-exosphere', 'Quelle région est la limite externe très diffuse de l’atmosphère ?', 'L’exosphère', 'Elle se fond progressivement dans l’espace.', 2, URLS.atmosphere],
  ['atmosphere-pressure-altitude', 'Comment la pression atmosphérique évolue-t-elle généralement avec l’altitude ?', 'Elle diminue', 'La colonne d’air située au-dessus est moins importante en altitude.', 1, URLS.atmosphere],
  ['atmosphere-humidity', 'Que mesure l’humidité relative ?', 'La quantité de vapeur d’eau par rapport au maximum possible à une température donnée', 'Elle dépend de la quantité de vapeur et de la température.', 2, URLS.climate],
  ['atmosphere-dew-point', 'Qu’est-ce que le point de rosée ?', 'La température à laquelle l’air devient saturé par refroidissement', 'Un refroidissement supplémentaire peut provoquer la condensation.', 2, URLS.climate],
  ['atmosphere-front', 'Qu’est-ce qu’un front météorologique ?', 'Une zone de transition entre deux masses d’air', 'Les masses d’air y présentent des propriétés différentes.', 1, URLS.climate],
  ['atmosphere-cold-front', 'Que fait typiquement un front froid à une masse d’air chaud ?', 'Il la soulève en avançant dessous', 'L’air froid, plus dense, progresse sous l’air chaud.', 2, URLS.climate],
  ['atmosphere-warm-front', 'Que fait typiquement un front chaud ?', 'L’air chaud glisse au-dessus de l’air froid', 'La pente douce du front chaud produit souvent une couverture nuageuse étendue.', 2, URLS.climate],
  ['atmosphere-cyclone', 'Dans l’hémisphère Nord, dans quel sens tournent les vents autour d’une dépression ?', 'Dans le sens antihoraire', 'La rotation dépend du gradient de pression et de l’effet de Coriolis.', 3, URLS.climate],
  ['atmosphere-anticyclone', 'Dans l’hémisphère Nord, dans quel sens tournent les vents autour d’un anticyclone ?', 'Dans le sens horaire', 'Le mouvement est opposé à celui d’une dépression dans cet hémisphère.', 3, URLS.climate],
  ['atmosphere-convection', 'Quel transfert de chaleur met en mouvement l’air par ascendance et subsidence ?', 'La convection', 'L’air chaud moins dense monte et l’air plus froid descend.', 1, URLS.climate],
  ['atmosphere-radiation', 'Quelle source fournit l’essentiel de l’énergie du système climatique terrestre ?', 'Le rayonnement solaire', 'L’énergie solaire alimente la circulation atmosphérique et hydrologique.', 1, URLS.climate],
  ['atmosphere-greenhouse', 'Que fait l’effet de serre naturel ?', 'Il retient une partie du rayonnement infrarouge terrestre', 'Certains gaz atmosphériques absorbent puis réémettent ce rayonnement.', 1, URLS.climate],
  ['atmosphere-albedo', 'Que mesure l’albédo d’une surface ?', 'La fraction du rayonnement qu’elle réfléchit', 'Une surface claire a généralement un albédo plus élevé qu’une surface sombre.', 1, URLS.earth],
  ['atmosphere-jet-stream', 'Qu’est-ce qu’un courant-jet ?', 'Un ruban étroit de vents très rapides en altitude', 'Les forts gradients de température contribuent à ces vents.', 2, URLS.atmosphere],
  ['atmosphere-precipitation', 'Comment se forment les précipitations dans un nuage ?', 'Par croissance de gouttelettes ou de cristaux jusqu’à leur chute', 'La coalescence et les processus de glace peuvent produire des hydrométéores assez lourds.', 1, URLS.climate],
  ['earth-season-axis', 'Quelle propriété de la Terre contribue principalement à l’alternance des saisons ?', 'L’inclinaison de son axe de rotation', 'L’angle d’éclairement et la durée du jour varient au cours de l’orbite.', 1, URLS.earth],
  ['earth-day-night', 'Quelle rotation produit l’alternance du jour et de la nuit ?', 'La rotation de la Terre sur son axe', 'Chaque région fait successivement face au Soleil puis s’en éloigne.', 1, URLS.earth],
  ['earth-solstice', 'Que caractérise un solstice ?', 'Un maximum ou un minimum annuel de durée du jour selon l’hémisphère', 'Il correspond à une position particulière de l’axe incliné par rapport au Soleil.', 2, URLS.earth],
  ['earth-equinox', 'Que caractérise un équinoxe ?', 'Une durée du jour et de la nuit approximativement égales', 'Le Soleil traverse alors le plan de l’équateur terrestre.', 1, URLS.earth],
  ['earth-time-zone', 'Pourquoi les fuseaux horaires suivent-ils approximativement les longitudes ?', 'Parce que la Terre tourne d’ouest en est', 'Des longitudes différentes font face au Soleil à des moments différents.', 1, URLS.maps],
  ['earth-spherical-horizon', 'Pourquoi l’horizon s’éloigne-t-il quand on prend de l’altitude ?', 'Parce qu’une plus grande partie de la surface courbe devient visible', 'La courbure terrestre limite la ligne de visée depuis un point bas.', 2, URLS.maps],
  ['earth-remote-sensing', 'Que fait la télédétection ?', 'Elle observe la surface sans contact direct', 'Les satellites mesurent le rayonnement réfléchi ou émis par les surfaces.', 1, URLS.earth],
  ['earth-satellite-orbit', 'Que permet l’observation répétée par satellite ?', 'De suivre les changements de la surface terrestre', 'Des images prises à plusieurs dates rendent visibles les évolutions spatiales.', 1, URLS.earth],
  ['earth-land-cover', 'Que décrit l’occupation du sol ?', 'La couverture physique ou biologique d’une surface', 'Elle distingue par exemple eau, végétation, sol nu et zones bâties.', 1, URLS.earth],
  ['earth-land-use', 'Que décrit l’utilisation du sol ?', 'La manière dont les humains utilisent une surface', 'Elle concerne notamment l’agriculture, l’habitat ou la conservation.', 1, URLS.earth],
  ['earth-urban-heat', 'Pourquoi les villes peuvent-elles être plus chaudes que leurs environs ?', 'Les matériaux urbains stockent la chaleur et la végétation y est souvent moindre', 'Cet effet forme un îlot de chaleur urbain.', 2, URLS.earth],
  ['earth-deforestation-surface', 'Quel changement de couverture terrestre produit la déforestation ?', 'La conversion d’une surface boisée vers une couverture non forestière', 'Les satellites permettent d’identifier cette transition à partir des observations.', 1, URLS.earth],
  ['earth-desertification', 'Que désigne la désertification ?', 'La dégradation des terres dans les zones arides, semi-arides ou subhumides sèches', 'Le terme ne signifie pas que toute zone devient nécessairement un désert de sable.', 2, URLS.earth],
  ['earth-wetland', 'Qu’est-ce qu’une zone humide ?', 'Un milieu où l’eau recouvre ou sature les sols de façon durable ou saisonnière', 'Les zones humides relient les processus terrestres et aquatiques.', 1, URLS.earth],
  ['earth-permafrost', 'Qu’est-ce que le pergélisol ?', 'Un sol qui reste gelé pendant au moins deux années consécutives', 'La définition repose sur la durée de gel du sol, pas sur la présence de neige en surface.', 2, URLS.earth],
  ['earth-ice-albedo', 'Pourquoi la diminution de la glace peut-elle amplifier le réchauffement local ?', 'Une surface sombre réfléchit moins de rayonnement qu’une surface glacée', 'La baisse d’albédo augmente l’absorption solaire.', 2, URLS.earth],
] as const;

const provenance = (factId: string, sourceUrl: string): QuestionProvenance => ({ factId, source: SOURCE, url: sourceUrl, license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' });

export const VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_QUESTIONS: Question[] = rows.map(([id, question, answer, explanation, difficulty, sourceUrl]) => {
  const factId = `fact-physical-geography-${id}`;
  return {
    id: `physical-geography-usgs-noaa-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    category: 'Géographie',
    subcategory: 'Géographie physique',
    tags: ['géographie', 'relief', 'océan', 'atmosphère'],
    difficulty,
    source: SOURCE,
    provenance: provenance(factId, sourceUrl),
  } satisfies Question;
});

export const VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_BATCH: VerifiedContentBatch = {
  id: 'physical-geography-usgs-noaa-2026-09',
  questions: VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://www.usgs.gov/programs/national-geospatial-program/topographic-maps',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: `${METHOD} Le lot couvre cartes, littoraux, océanographie, glaciers, hydrologie, sols et atmosphère.`,
  status: 'approved',
};

export default VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_BATCH;
