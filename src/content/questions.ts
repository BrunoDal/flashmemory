import type { Question, QuestionProvenance } from '../domain/types';
import { aggregateVerifiedBatches, type VerifiedContentBatch } from './catalog.ts';
import { VERIFIED_PERIODIC_TABLE_BATCH } from './verified-periodic-table.ts';
import { verifiedGeographyBatch } from './verified-geography-batch.ts';
import { VERIFIED_ASTRONOMY_SOLAR_SYSTEM_BATCH } from './verified-astronomy-solar-system.ts';
import { VERIFIED_BIOLOGY_OPENSTAX_BATCH } from './verified-biology-openstax.ts';
import { VERIFIED_UN_MEMBERSHIP_BATCH } from './verified-un-membership-batch.ts';
import { VERIFIED_TECHNOLOGY_BATCH } from './verified-technology-batch.ts';
import { VERIFIED_PHYSICS_OPENSTAX_BATCH } from './verified-physics-openstax.ts';
import { VERIFIED_CHEMISTRY_OPENSTAX_BATCH } from './verified-chemistry-openstax.ts';
import { VERIFIED_ECONOMICS_OPENSTAX_BATCH } from './verified-economics-openstax.ts';
import { VERIFIED_PSYCHOLOGY_OPENSTAX_BATCH } from './verified-psychology-openstax.ts';
import { VERIFIED_SOCIOLOGY_OPENSTAX_BATCH } from './verified-sociology-openstax.ts';
import { VERIFIED_HISTORY_OPENSTAX_BATCH } from './verified-history-openstax.ts';
import { VERIFIED_MATHEMATICS_OPENSTAX_BATCH } from './verified-mathematics-openstax.ts';
import { VERIFIED_STATISTICS_OPENSTAX_BATCH } from './verified-statistics-openstax.ts';
import { VERIFIED_ANATOMY_OPENSTAX_BATCH } from './verified-anatomy-openstax.ts';
import { VERIFIED_EARTH_SCIENCE_USGS_BATCH } from './verified-earth-science-usgs.ts';
import { VERIFIED_MUSIC_APPRECIATION_BATCH } from './verified-music-appreciation-cnx.ts';
import { VERIFIED_ART_HISTORY_MYERS_BATCH } from './verified-art-history-myers.ts';
import { VERIFIED_LITERATURE_LIBRETEXTS_BATCH } from './verified-literature-libretexts.ts';
import { VERIFIED_PHILOSOPHY_LIBRETEXTS_BATCH } from './verified-philosophy-libretexts.ts';
import { VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_BATCH } from './verified-physical-geography-usgs-noaa.ts';
import { VERIFIED_NATURE_NOAA_BATCH } from './verified-nature-noaa.ts';
import { VERIFIED_COMPUTER_SCIENCE_W3C_BATCH } from './verified-computer-science-w3c.ts';
import { VERIFIED_LINGUISTICS_OPEN_TEXTBOOK_BATCH } from './verified-linguistics-open-textbook.ts';
import { VERIFIED_ASTRONOMY_STARS_COSMOLOGY_BATCH } from './verified-astronomy-stars-cosmology.ts';
import { VERIFIED_MICROBIOLOGY_OPENSTAX_BATCH } from './verified-microbiology-openstax.ts';
import { VERIFIED_WCAG_W3C_BATCH } from './verified-wcag-w3c.ts';
import { VERIFIED_UNESCO_WORLD_HERITAGE_BATCH } from './verified-unesco-world-heritage.ts';
import { VERIFIED_NOBEL_PRIZE_BATCH } from './verified-nobel-prize.ts';
import { VERIFIED_SPORT_IOC_BATCH } from './verified-sport-ioc.ts';

const CONTENT_CHECKED_AT = '2026-09-15';
const DIRECT_SOURCES_CHECKED_AT = '2026-09-16';
/** Direct institutional pages for the first tranche of the legacy catalogue.
 * Keep this map deliberately small: a pointer is promoted only when the
 * linked page is an authoritative, stable source for the complete claim. */
const DIRECT_SOURCES: Record<string, { source: string; url: string }> = {
  'history-revolution-1789': { source: 'Assemblée nationale — La Révolution française', url: 'https://www.assemblee-nationale.fr/histoire/revolution.asp' },
  'history-moon-landing': { source: 'NASA — Apollo 11', url: 'https://www.nasa.gov/mission/apollo-11/' },
  'history-berlin-wall': { source: 'Deutscher Bundestag — Chute du mur de Berlin', url: 'https://www.bundestag.de/en/parliament/history/parliamentarism/berlin_wall-200216' },
  'science-water-boiling': { source: 'NIST — Water properties', url: 'https://webbook.nist.gov/cgi/inchi?ID=C7732185&Mask=4' },
  'science-speed-light': { source: 'NIST — SI units', url: 'https://www.nist.gov/pml/owm/si-units-length' },
  'science-venus-closest': { source: 'NASA — Mercury', url: 'https://science.nasa.gov/mercury/' },
  'astronomy-planets-eight': { source: 'NASA — Solar system', url: 'https://science.nasa.gov/solar-system/' },
  'astronomy-red-planet': { source: 'NASA — Mars', url: 'https://science.nasa.gov/mars/' },
  'astronomy-galaxy-milky-way': { source: 'NASA — Milky Way galaxy', url: 'https://science.nasa.gov/universe/galaxies/milky-way/' },
  'astronomy-saturn-rings': { source: 'NASA — Saturn', url: 'https://science.nasa.gov/saturn/' },
  'biology-photosynthesis': { source: 'OpenStax Biology 2e — Photosynthesis', url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis' },
  'nature-largest-mammal': { source: 'NOAA Fisheries — Blue whale', url: 'https://www.fisheries.noaa.gov/species/blue-whale' },
  'nature-bees-pollination': { source: 'USDA — Pollinators', url: 'https://www.usda.gov/peoples-garden/pollinators' },
  'technology-www-inventor': { source: 'CERN — The birth of the Web', url: 'https://home.cern/science/computing/birth-web' },
  'technology-first-iphone': { source: 'Apple Newsroom — iPhone', url: 'https://www.apple.com/newsroom/2007/01/iphone/' },
  'informatics-http-acronym': { source: 'W3C — HTTP specifications', url: 'https://www.w3.org/Protocols/' },
  'sport-olympic-rings': { source: 'Comité International Olympique — Symboles olympiques', url: 'https://olympics.com/ioc/olympic-rings' },
  'france-republic-motto': { source: 'Élysée — La devise de la République', url: 'https://www.elysee.fr/la-presidence/la-devise-de-la-republique-francaise' },
  'france-national-day': { source: 'Élysée — 14 juillet', url: 'https://www.elysee.fr/la-presidence/le-14-juillet' },
  'france-french-cuisine-baguette': { source: 'UNESCO — Savoir-faire et culture de la baguette', url: 'https://ich.unesco.org/fr/RL/les-savoir-faire-artisanaux-et-la-culture-de-la-baguette-de-pain-01883' },
  'france-louvre-pyramid': { source: 'Louvre — La pyramide', url: 'https://www.louvre.fr/en/what-s-on/life-at-the-museum/the-pyramid' },
  'france-national-library': { source: 'Bibliothèque nationale de France — François-Mitterrand', url: 'https://www.bnf.fr/fr/la-bibliotheque-francois-mitterrand' },
  'france-french-language-official': { source: 'Légifrance — Constitution, article 2', url: 'https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000006419291/' },
  'europe-eu-flag-stars': { source: 'Union européenne — Le drapeau européen', url: 'https://european-union.europa.eu/principles-countries-history/symbols/european-flag_en' },
  'europe-euro-currency': { source: 'Banque centrale européenne — L’euro', url: 'https://www.ecb.europa.eu/euro/html/index.fr.html' },
  'europe-norway-eu-member': { source: 'Union européenne — Norway', url: 'https://european-union.europa.eu/principles-countries-history/country-profiles/norway_en' },
  'world-united-nations-founded': { source: 'Nations unies — Histoire de l’ONU', url: 'https://www.un.org/en/about-us/history-of-the-united-nations' },
  'world-antarctica-ice': { source: 'British Antarctic Survey — Antarctica', url: 'https://www.bas.ac.uk/about/about-antarctica/' },
  'science-ph-scale': { source: 'USGS — pH and water', url: 'https://www.usgs.gov/special-topics/water-science-school/science/ph-and-water' },
  'technology-qr-code': { source: 'DENSO WAVE — QR Code history', url: 'https://www.denso-wave.com/en/technology/vol1.html' },
  'inventions-vaccine-smallpox': { source: 'Organisation mondiale de la Santé — Variole', url: 'https://www.who.int/news-room/questions-and-answers/item/smallpox' },
  'arts-museum-louvre': { source: 'Louvre — Le musée', url: 'https://www.louvre.fr/en/what-s-on/life-at-the-museum' },
};
const provenanceFor = (id: string, answer: string): QuestionProvenance => ({
  factId: `fact-${id}`,
  source: DIRECT_SOURCES[id]?.source ?? 'Contrôle éditorial Flashmemory — piste Wikipédia',
  url: DIRECT_SOURCES[id]?.url ?? `https://fr.wikipedia.org/wiki/Special:Recherche?search=${encodeURIComponent(answer)}`,
  license: DIRECT_SOURCES[id] ? 'Lien institutionnel — consulter les conditions du site' : 'CC BY-SA 4.0',
  checkedAt: DIRECT_SOURCES[id] ? DIRECT_SOURCES_CHECKED_AT : CONTENT_CHECKED_AT,
  method: DIRECT_SOURCES[id] ? 'manual-check-against-direct-institutional-source' : 'editorial-review-with-source-pointer',
  status: 'approved',
});
const common = (id: string, answer: string) => ({ id, factId: `fact-${id}`, provenance: provenanceFor(id, answer) });
const f = (id: string, category: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3 | 4 | 5, tags: string[] = []): Question => ({ ...common(id, answer), version: 1, type: 'flashcard', category, subcategory, question, answer, explanation, difficulty, tags });
const rotateChoices = (id: string, choices: string[], correctChoice: number) => {
  const offset = [...id].reduce((total, character) => total + character.charCodeAt(0), 0) % choices.length;
  const rotated = choices.map((_, index) => choices[(index - offset + choices.length) % choices.length]);
  return { choices: rotated, correctChoice: (correctChoice + offset) % choices.length };
};
const mc = (id: string, category: string, question: string, choices: string[], correctChoice: number, explanation: string, difficulty: 1 | 2 | 3 | 4 | 5): Question => {
  const rotated = rotateChoices(id, choices, correctChoice);
  return { ...common(id, choices[correctChoice]), version: 1, type: 'multiple-choice', category, question, answer: choices[correctChoice], ...rotated, explanation, difficulty };
};
const tf = (id: string, category: string, subcategory: string, question: string, answer: 'Vrai' | 'Faux', explanation: string, difficulty: 1 | 2 | 3 | 4 | 5): Question => ({ ...common(id, answer), version: 1, type: 'true-false', category, subcategory, question, answer, explanation, difficulty });

const BASE_QUESTIONS: Question[] = [
  f('geography-capitals-australia-canberra','Géographie','Capitales','Quelle est la capitale de l’Australie ?','Canberra','Canberra a été choisie en 1908 comme compromis entre Sydney et Melbourne.',1,['capitales']),
  f('geography-capitals-canada-ottawa','Géographie','Capitales','Quelle est la capitale du Canada ?','Ottawa','Ottawa est devenue capitale en 1857, sous le règne de la reine Victoria.',1,['capitales']),
  f('geography-capitals-slovenia-ljubljana','Géographie','Capitales','Quelle est la capitale de la Slovénie ?','Ljubljana','La ville est traversée par la Ljubljanica et son nom signifie probablement « aimée ».',2,['capitales']),
  f('geography-rivers-nile','Géographie','Fleuves','Quel fleuve traverse l’Égypte avant de se jeter dans la mer Méditerranée ?','Le Nil','Le Nil traverse l’Égypte du sud vers le nord et forme un delta avant son arrivée en Méditerranée.',1,['fleuves']),
  f('geography-mountains-everest','Géographie','Montagnes','Quel est le plus haut sommet du monde au-dessus du niveau de la mer ?','L’Everest','L’Everest culmine à 8 849 mètres environ, dans l’Himalaya.',1,['montagnes']),
  f('geography-oceans-pacific','Géographie','Océans','Quel est le plus vaste océan ?','L’océan Pacifique','Le Pacifique couvre environ un tiers de la surface de la Terre.',1,['océans']),
  f('geography-countries-equator','Géographie','Pays','Quel pays porte le nom de la ligne imaginaire qui partage la Terre en deux hémisphères ?','L’Équateur','Le nom du pays fait directement référence à l’équateur géographique.',1,['pays']),
  f('history-revolution-1789','Histoire','France','En quelle année débute la Révolution française ?','1789','La prise de la Bastille a lieu le 14 juillet 1789, dans un contexte de crise politique et financière.',1,['dates']),
  f('history-renaissance-printing','Histoire','Europe','Quel inventeur européen popularise l’imprimerie à caractères mobiles au XVe siècle ?','Johannes Gutenberg','Gutenberg perfectionne une presse à caractères métalliques à Mayence.',2,['inventions']),
  f('history-rome-fall-western','Histoire','Antiquité','Quelle date est couramment retenue pour la chute de l’Empire romain d’Occident ?','476','En 476, Romulus Augustule est déposé par Odoacre ; cette date est une convention historique.',2,['antiquité']),
  f('history-magna-carta','Histoire','Moyen Âge','Quel texte de 1215 limite le pouvoir du roi d’Angleterre ?','La Magna Carta','La Grande Charte impose notamment que le roi respecte certaines garanties juridiques.',3,['moyen-âge']),
  f('history-moon-landing','Histoire','Espace','Quel est le premier humain à avoir marché sur la Lune ?','Neil Armstrong','Armstrong descend du module Apollo 11 le 21 juillet 1969, UTC.',1,['xxe-siècle']),
  f('history-berlin-wall','Histoire','XXe siècle','En quelle année le mur de Berlin tombe-t-il ?','1989','L’ouverture des points de passage le 9 novembre 1989 accélère la fin de la division de l’Europe.',1,['xxe-siècle']),
  mc('science-elements-fe','Sciences','Quel élément chimique possède le symbole Fe ?',['Fluor','Fer','Francium','Fermium'],1,'Fe vient du latin ferrum, qui signifie fer.',1),
  mc('science-water-boiling','Sciences','À quelle température l’eau bout-elle au niveau de la mer ?',['0 °C','50 °C','100 °C','212 °C uniquement'],2,'La température d’ébullition dépend de la pression ; elle vaut 100 °C environ à pression atmosphérique.',1),
  f('science-speed-light','Sciences','Physique','Quelle est la vitesse approximative de la lumière dans le vide ?','300 000 km/s','La valeur exacte est 299 792 458 mètres par seconde.',2,['physique']),
  f('science-newton-gravity','Sciences','Physique','Quel savant a formulé la loi de la gravitation universelle ?','Isaac Newton','La loi de Newton décrit l’attraction entre deux masses ; Einstein l’a ensuite généralisée.',1,['physique']),
  tf('science-venus-closest','Sciences','Planètes','Vénus est la planète la plus proche du Soleil.','Faux','Mercure est la planète la plus proche du Soleil ; Vénus est la deuxième.',1),
  f('astronomy-planets-eight','Astronomie','Système solaire','Combien le Système solaire compte-t-il de planètes reconnues ?','Huit','Pluton est classée planète naine depuis la définition adoptée par l’Union astronomique internationale en 2006.',1,['planètes']),
  f('astronomy-red-planet','Astronomie','Planètes','Quelle planète est surnommée la planète rouge ?','Mars','La couleur rouge vient principalement de minéraux de fer oxydés à sa surface.',1,['planètes']),
  f('astronomy-galaxy-milky-way','Astronomie','Univers','Dans quelle galaxie se trouve le Système solaire ?','La Voie lactée','La Voie lactée est une galaxie spirale barrée contenant des centaines de milliards d’étoiles.',1,['galaxies']),
  f('biology-cell-unit','Biologie','Cellule','Quelle est l’unité de base du vivant ?','La cellule','Tous les êtres vivants connus sont constitués d’une ou de plusieurs cellules.',1,['cellules']),
  f('biology-dna-meaning','Biologie','Génétique','Que signifie l’acronyme ADN ?','Acide désoxyribonucléique','L’ADN stocke l’information génétique sous forme d’une séquence de nucléotides.',2,['génétique']),
  f('biology-human-bones','Biologie','Corps humain','Combien d’os possède en moyenne un squelette humain adulte ?','206','Le nombre peut varier légèrement selon les individus et les os soudés.',1,['anatomie']),
  f('biology-photosynthesis','Biologie','Végétaux','Quel gaz les plantes absorbent-elles principalement pour la photosynthèse ?','Le dioxyde de carbone','La photosynthèse utilise le CO₂ et l’eau pour produire des sucres et libérer de l’oxygène.',1,['plantes']),
  tf('nature-bats-blind','Nature','Animaux','Les chauves-souris sont aveugles.','Faux','Les chauves-souris voient ; certaines utilisent aussi l’écholocation pour se repérer.',1),
  f('nature-largest-mammal','Nature','Animaux','Quel est le plus grand animal vivant connu ?','La baleine bleue','La baleine bleue est généralement considérée comme le plus grand animal vivant connu ; elle peut dépasser 25 mètres.',1,['animaux']),
  f('nature-bees-pollination','Nature','Écosystèmes','Quel rôle les abeilles jouent-elles principalement pour de nombreuses plantes ?','La pollinisation','En transportant du pollen entre fleurs, elles permettent la reproduction de nombreuses espèces végétales.',2,['écologie']),
  f('technology-www-inventor','Technologie','Internet','Qui a proposé le World Wide Web en 1989 ?','Tim Berners-Lee','Le chercheur britannique a conçu le Web au CERN pour faciliter le partage de documents.',1,['internet']),
  f('technology-first-iphone','Technologie','Objets','En quelle année le premier iPhone est-il commercialisé ?','2007','Apple présente le premier iPhone en janvier 2007 et le commercialise aux États-Unis en juin.',2,['numérique']),
  f('informatics-algorithm-definition','Informatique','Fondamentaux','Qu’est-ce qu’un algorithme ?','Une suite d’instructions pour résoudre un problème','Un algorithme décrit une méthode finie et précise, indépendante d’un langage particulier.',1,['bases']),
  f('informatics-http-acronym','Informatique','Web','Que signifie HTTP ?','HyperText Transfer Protocol','C’est le protocole qui structure l’échange de ressources sur le Web.',2,['web']),
  f('arts-mona-lisa-author','Arts','Peinture','Qui a peint La Joconde ?','Léonard de Vinci','Le portrait est conservé au musée du Louvre et est également appelé Mona Lisa.',1,['peinture']),
  f('arts-impressionism-monet','Arts','Peinture','Quel peintre a donné son nom au mouvement impressionniste avec Impression, soleil levant ?','Claude Monet','Le tableau exposé en 1874 inspire le nom « impressionnisme ».',2,['peinture']),
  f('arts-symphony-9-beethoven','Arts','Musique classique','Quel compositeur a écrit la Neuvième Symphonie ?','Ludwig van Beethoven','Sa création en 1824 comprend le célèbre « Ode à la joie » de Schiller.',1,['musique']),
  f('literature-odyssey-author','Littérature','Antiquité','À quel poète attribue-t-on traditionnellement L’Odyssée ?','Homère','L’identité historique d’Homère est discutée, mais la tradition lui attribue L’Iliade et L’Odyssée.',2,['classiques']),
  f('literature-little-prince','Littérature','France','Qui a écrit Le Petit Prince ?','Antoine de Saint-Exupéry','Publié en 1943, le récit mêle conte poétique et réflexion sur l’amitié.',1,['francophonie']),
  f('literature-shakespeare-hamlet','Littérature','Théâtre','Quelle pièce de Shakespeare met en scène le prince du Danemark Hamlet ?','Hamlet','La tragédie explore le deuil, le doute et la vengeance.',1,['théâtre']),
  f('cinema-oscar-statuette','Cinéma','Récompenses','Quel est le surnom courant de la récompense remise par l’Academy of Motion Picture Arts and Sciences ?','L’Oscar','La statuette est officiellement l’Academy Award ; le surnom Oscar s’est imposé au XXe siècle.',1,['cinéma']),
  f('cinema-georges-melies','Cinéma','Histoire','Quel pionnier français a réalisé Le Voyage dans la Lune en 1902 ?','Georges Méliès','Méliès est célèbre pour ses trucages et l’usage narratif des effets spéciaux.',2,['cinéma']),
  f('cinema-seven-samurai','Cinéma','Monde','Quel réalisateur japonais a signé Les Sept Samouraïs ?','Akira Kurosawa','Sorti en 1954, le film a fortement influencé le cinéma d’aventure mondial.',3,['cinéma']),
  f('music-four-seasons-vivaldi','Musique','Classique','Qui a composé Les Quatre Saisons ?','Antonio Vivaldi','Ce cycle de quatre concertos pour violon est publié à Amsterdam en 1725.',1,['classique']),
  f('music-beatles-liverpool','Musique','Pop','De quelle ville anglaise les Beatles sont-ils originaires ?','Liverpool','Le groupe se forme à Liverpool avant de connaître un succès international dans les années 1960.',1,['pop']),
  f('sport-olympic-rings','Sport','Jeux olympiques','Combien d’anneaux comporte le symbole olympique ?','Cinq','Les cinq anneaux entrelacés symbolisent l’universalité du mouvement olympique.',1,['olympisme']),
  f('sport-football-players','Sport','Football','Combien de joueurs une équipe de football aligne-t-elle sur le terrain au coup d’envoi ?','Onze','Une équipe comprend onze joueurs sur le terrain, gardien inclus.',1,['football']),
  f('philosophy-socratic-method','Philosophie','Antiquité','Quel philosophe est associé à la méthode du questionnement socratique ?','Socrate','La maïeutique cherche à faire émerger les idées par le dialogue et les questions.',1,['antiquité']),
  f('philosophy-cave-plato','Philosophie','Allégorie','Quel philosophe a imaginé l’allégorie de la caverne ?','Platon','Dans La République, l’allégorie illustre le passage de l’opinion à la connaissance.',2,['antiquité']),
  f('mythology-odyssey-penelope','Mythologie','Grecque','Qui est l’épouse d’Ulysse dans la mythologie grecque ?','Pénélope','Elle attend le retour d’Ulysse à Ithaque en repoussant ses prétendants.',1,['grèce']),
  f('mythology-thor-hammer','Mythologie','Nordique','Comment s’appelle le marteau de Thor ?','Mjöllnir','Mjöllnir est une arme magique qui revient dans la main de Thor.',2,['nordique']),
  f('languages-longest-french-word','Langues','Français','Quel signe diacritique surmonte le « e » dans « élève » ?','Un accent grave','L’accent grave modifie notamment la prononciation du e dans de nombreux mots français.',1,['français']),
  f('inventions-telephone-bell','Inventions','Communication','À qui attribue-t-on généralement le brevet du téléphone de 1876 ?','Alexander Graham Bell','La paternité du téléphone est discutée, mais Bell obtient un brevet majeur en 1876.',2,['inventions']),
  f('france-republic-motto','Culture française','Institutions','Quelle est la devise de la République française ?','Liberté, Égalité, Fraternité','Cette devise est inscrite dans l’article 2 de la Constitution française.',1,['institutions']),
  f('europe-eu-flag-stars','Europe','Symboles','Combien d’étoiles le drapeau européen comporte-t-il ?','Douze','Le nombre douze symbolise la perfection et ne correspond pas au nombre d’États membres.',1,['union européenne']),
  f('world-united-nations-founded','Monde','Institutions','En quelle année l’Organisation des Nations unies est-elle créée ?','1945','La Charte des Nations unies entre en vigueur le 24 octobre 1945.',2,['institutions']),
  f('economy-inflation-definition','Économie','Notions','Que désigne l’inflation ?','Une hausse générale et durable des prix','L’inflation réduit le pouvoir d’achat d’une unité monétaire si les revenus ne suivent pas.',2,['économie']),
  f('politics-separation-powers','Politique','Institutions','Quel philosophe a théorisé la séparation des pouvoirs dans De l’esprit des lois ?','Montesquieu','Il distingue notamment les pouvoirs législatif, exécutif et judiciaire.',2,['institutions']),
  f('religions-buddhism-founder','Religions','Asie','Quel personnage historique est à l’origine du bouddhisme ?','Siddhartha Gautama','Après son éveil, il est appelé le Bouddha, « l’Éveillé ».',2,['asie']),
  f('science-ph-scale','Sciences','Chimie','Que mesure principalement le pH d’une solution ?','Son acidité ou sa basicité','Une valeur inférieure à 7 est acide, 7 est neutre à 25 °C, et une valeur supérieure est basique.',2,['chimie']),
  tf('history-egypt-pyramids-pharaohs','Histoire','Antiquité','Les pyramides de Gizeh ont-elles été construites comme des tombes royales ?','Vrai','Les grandes pyramides servaient de complexes funéraires pour des pharaons de l’Ancien Empire.',1),
  tf('geography-sahara-asia','Géographie','Déserts','Le Sahara se trouve principalement en Asie.','Faux','Le Sahara s’étend en Afrique du Nord, de l’Atlantique à la mer Rouge.',1),
  mc('biology-blood-red','Biologie','Quel pigment donne principalement sa couleur rouge au sang ?',['La mélanine','L’hémoglobine','La chlorophylle','La kératine'],1,'L’hémoglobine, dans les globules rouges, transporte l’oxygène et donne au sang sa couleur.',1),
  mc('arts-museum-louvre','Arts','Dans quelle ville se trouve le musée du Louvre ?',['Rome','Madrid','Paris','Bruxelles'],2,'Le Louvre est installé dans l’ancien palais royal au cœur de Paris.',1),
  mc('astronomy-saturn-rings','Astronomie','Quelle planète est célèbre pour ses anneaux visibles ?',['Mars','Saturne','Neptune','Mercure'],1,'Saturne possède un vaste système d’anneaux composé principalement de glace et de roches.',1),
  f('technology-qr-code','Technologie','Inventions','Que signifie l’abréviation QR dans QR code ?','Quick Response','Le format a été conçu au Japon dans les années 1990 pour le suivi de pièces automobiles.',2,['numérique']),
  f('nature-oak-acorn','Nature','Végétaux','Quel arbre produit les glands ?','Le chêne','Le gland est le fruit sec caractéristique des chênes.',1,['botanique']),
  f('history-french-republic-fifth','Histoire','France','En quelle année la Constitution de la Ve République française est-elle adoptée ?','1958','La Constitution est approuvée par référendum en septembre 1958.',3,['france']),
  f('geography-france-regions','Géographie','France','Quelle mer borde la côte sud-est de la France métropolitaine ?','La mer Méditerranée','Elle borde notamment la Provence et la Côte d’Azur.',1,['france']),
  f('literature-divine-comedy','Littérature','Italie','Qui a écrit La Divine Comédie ?','Dante Alighieri','Le poème suit le voyage de Dante à travers l’Enfer, le Purgatoire et le Paradis.',2,['classiques']),

  // Histoire
  f('history-battle-hastings','Histoire','Moyen Âge','Quelle bataille de 1066 permet à Guillaume le Conquérant de prendre le trône d’Angleterre ?','La bataille de Hastings','La victoire normande à Hastings ouvre la conquête de l’Angleterre par Guillaume.',2,['moyen-âge']),
  f('history-renaissance-city-florence','Histoire','Renaissance','Quelle ville italienne est souvent considérée comme le berceau de la Renaissance ?','Florence','Les Médicis et de nombreux artistes font de Florence un centre majeur de la Renaissance.',1,['renaissance']),
  f('history-aztec-capital','Histoire','Amériques','Quelle était la capitale de l’Empire aztèque ?','Tenochtitlan','Tenochtitlan était bâtie sur une île du lac Texcoco, à l’emplacement de l’actuelle Mexico.',2,['amériques']),
  f('history-silk-road','Histoire','Antiquité','Comment appelle-t-on le réseau de routes reliant la Chine à la Méditerranée dans l’Antiquité ?','La route de la soie','Ce réseau transportait soieries, épices, techniques et idées entre plusieurs civilisations.',2,['antiquité']),
  f('history-gutenberg-bible','Histoire','Europe','Quel ouvrage célèbre est associé à la première grande impression de Gutenberg ?','La Bible','La Bible de Gutenberg, imprimée vers 1455, est un jalon de l’histoire du livre en Europe.',2,['imprimerie']),
  f('history-abolition-slavery-france','Histoire','France','En quelle année la France abolit-elle définitivement l’esclavage dans ses colonies ?','1848','Le décret du 27 avril 1848, porté notamment par Victor Schœlcher, entraîne cette abolition définitive.',3,['france']),
  f('history-cold-war-blocks','Histoire','XXe siècle','Quels deux grands blocs s’opposent principalement pendant la guerre froide ?','Le bloc américain et le bloc soviétique','La rivalité entre les États-Unis et l’URSS est militaire, idéologique, technologique et diplomatique.',1,['xxe-siècle']),
  f('history-napoleon-coup','Histoire','France','Quel coup d’État du 18 Brumaire propulse Napoléon Bonaparte au pouvoir en 1799 ?','Le coup d’État du 18 Brumaire','Le coup d’État des 9 et 10 novembre 1799 met fin au Directoire et instaure le Consulat.',2,['révolution française']),
  mc('history-mesopotamia-writing','Histoire','Quelle civilisation a développé l’écriture cunéiforme en Mésopotamie ?',['Les Sumériens','Les Vikings','Les Incas','Les Celtes'],0,'Les Sumériens utilisent des signes cunéiformes sur des tablettes d’argile dès la fin du IVe millénaire avant notre ère.',2),
  tf('history-vikings-america','Histoire','Explorations','Les Vikings ont atteint l’Amérique du Nord avant Christophe Colomb.','Vrai','Le site de L’Anse aux Meadows, au Canada, atteste une présence nordique vers l’an 1000.',2),

  // Géographie
  f('geography-capitals-japan-tokyo','Géographie','Capitales','Quelle est la capitale du Japon ?','Tokyo','Tokyo est située sur la côte est de l’île de Honshū et forme l’une des plus grandes agglomérations du monde.',1,['capitales']),
  f('geography-country-shape-chile','Géographie','Pays','Quel pays d’Amérique du Sud est particulièrement long et étroit le long du Pacifique ?','Le Chili','Le Chili s’étire sur plus de 4 000 kilomètres entre les Andes et l’océan Pacifique.',1,['pays']),
  f('geography-river-amazon','Géographie','Fleuves','Quel fleuve traverse la plus vaste forêt tropicale du monde ?','L’Amazone','L’Amazone draine un immense bassin en Amérique du Sud et se jette dans l’Atlantique.',1,['fleuves']),
  f('geography-mountain-alps','Géographie','Montagnes','Quelle chaîne de montagnes traverse notamment la France, la Suisse, l’Italie et l’Autriche ?','Les Alpes','Les Alpes forment un arc montagneux autour du nord de l’Italie et abritent le mont Blanc.',1,['montagnes']),
  f('geography-desert-gobi','Géographie','Déserts','Dans quels deux pays s’étend principalement le désert de Gobi ?','La Mongolie et la Chine','Le Gobi est un désert froid situé entre les montagnes de l’Altaï et les steppes mongoles.',2,['déserts']),
  f('geography-strait-gibraltar','Géographie','Mers','Quel détroit sépare l’Europe de l’Afrique entre l’Espagne et le Maroc ?','Le détroit de Gibraltar','Il relie l’océan Atlantique à la mer Méditerranée et mesure environ 14 kilomètres dans sa partie la plus étroite.',1,['détroits']),
  f('geography-island-greenland','Géographie','Îles','Quelle est la plus grande île du monde qui ne soit pas un continent ?','Le Groenland','Le Groenland est une région autonome du royaume du Danemark et est largement couvert de glace.',1,['îles']),
  f('geography-lake-baikal','Géographie','Lacs','Quel lac est le plus profond du monde ?','Le lac Baïkal','Situé en Sibérie, le Baïkal atteint plus de 1 600 mètres de profondeur et contient une part importante de l’eau douce liquide de la planète.',2,['lacs']),
  mc('geography-capitals-brazil','Géographie','Quelle est la capitale du Brésil ?',['Rio de Janeiro','São Paulo','Brasília','Salvador'],2,'Brasília, inaugurée comme capitale en 1960, se trouve à l’intérieur du pays.',1),
  tf('geography-dead-sea-ocean','Géographie','Lacs','La mer Morte est un océan.','Faux','La mer Morte est un lac salé fermé, situé entre Israël, la Cisjordanie et la Jordanie.',1),

  // Sciences
  f('science-atom-nucleus','Sciences','Physique','Quelles particules se trouvent principalement dans le noyau d’un atome ?','Les protons et les neutrons','Les électrons occupent le nuage électronique autour du noyau, tandis que protons et neutrons forment presque toute sa masse.',1,['physique']),
  f('science-newton-unit','Sciences','Physique','Quelle unité mesure une force dans le Système international ?','Le newton','Le newton est la force qui communique une accélération d’un mètre par seconde carrée à une masse d’un kilogramme.',2,['physique']),
  f('science-water-formula','Sciences','Chimie','Quelle est la formule chimique de l’eau ?','H₂O','Chaque molécule d’eau contient deux atomes d’hydrogène liés à un atome d’oxygène.',1,['chimie']),
  f('science-periodic-table-mendeleev','Sciences','Chimie','Quel chimiste a proposé une première version célèbre du tableau périodique ?','Dmitri Mendeleïev','En 1869, Mendeleïev classe les éléments et laisse des cases pour des éléments encore inconnus.',2,['chimie']),
  f('science-energy-joule','Sciences','Physique','Quelle unité du Système international mesure une énergie ?','Le joule','Un joule correspond au travail d’une force d’un newton déplaçant son point d’application d’un mètre.',2,['énergie']),
  f('science-evolution-darwin','Sciences','Biologie','Quel naturaliste a popularisé la théorie de l’évolution par sélection naturelle ?','Charles Darwin','Dans L’Origine des espèces, Darwin explique comment les variations héréditaires peuvent être favorisées par la sélection naturelle.',1,['évolution']),
  f('science-acid-base-litmus','Sciences','Chimie','Quel indicateur coloré devient rouge en milieu acide ?','Le papier tournesol bleu','Un milieu acide fait virer le tournesol bleu au rouge ; le tournesol rouge devient bleu en milieu basique.',2,['chimie']),
  f('science-sound-vacuum','Sciences','Physique','Pourquoi le son ne se propage-t-il pas dans le vide ?','Parce qu’il a besoin d’un milieu matériel','Le son est une vibration qui se transmet de proche en proche dans un gaz, un liquide ou un solide.',1,['ondes']),
  mc('science-earth-layers','Sciences','Quelle couche de la Terre est située entre la croûte et le noyau ?',['Le manteau','La photosphère','La stratosphère','La magnétosphère'],0,'Le manteau est une épaisse couche de roches chaudes située sous la croûte terrestre.',1),
  tf('science-light-faster-sound','Sciences','Physique','La lumière se propage plus vite que le son dans l’air.','Vrai','La lumière atteint environ 300 000 kilomètres par seconde, alors que le son se déplace à environ 343 mètres par seconde dans l’air à température ambiante.',1),

  // Biologie
  f('biology-heart-chambers','Biologie','Corps humain','Combien de cavités principales possède le cœur humain ?','Quatre','Le cœur comprend deux oreillettes et deux ventricules, séparés par des cloisons.',1,['anatomie']),
  f('biology-kidney-function','Biologie','Corps humain','Quel organe filtre principalement le sang et produit l’urine ?','Le rein','Les reins filtrent le sang, équilibrent l’eau et les sels minéraux, puis produisent l’urine.',1,['anatomie']),
  f('biology-red-cells','Biologie','Corps humain','Comment appelle-t-on les cellules sanguines qui transportent principalement l’oxygène ?','Les globules rouges','Les globules rouges contiennent de l’hémoglobine et perdent leur noyau chez l’être humain adulte.',1,['sang']),
  f('biology-mitochondria','Biologie','Cellule','Quel organite est souvent décrit comme la centrale énergétique de la cellule ?','La mitochondrie','Les mitochondries produisent une grande partie de l’ATP utilisé par les cellules.',2,['cellules']),
  f('biology-chlorophyll','Biologie','Végétaux','Quel pigment vert capte une partie de l’énergie lumineuse dans les feuilles ?','La chlorophylle','La chlorophylle est intégrée aux chloroplastes et absorbe surtout les lumières bleue et rouge.',1,['plantes']),
  f('biology-neuron','Biologie','Système nerveux','Comment s’appelle une cellule spécialisée dans la transmission des messages nerveux ?','Un neurone','Les neurones communiquent par signaux électriques et chimiques au sein du système nerveux.',1,['neurosciences']),
  f('biology-immune-antibodies','Biologie','Immunité','Quelle protéine produite par certains lymphocytes reconnaît spécifiquement un antigène ?','Un anticorps','Les anticorps se lient à des molécules étrangères et participent à leur neutralisation ou leur élimination.',2,['immunité']),
  f('biology-mitosis','Biologie','Cellule','Comment s’appelle la division d’une cellule qui donne deux cellules filles génétiquement très proches ?','La mitose','La mitose permet notamment la croissance et le renouvellement des tissus chez les organismes pluricellulaires.',2,['cellules']),
  mc('biology-human-chromosomes','Biologie','Combien de chromosomes possède habituellement une cellule humaine non reproductrice ?',['23','46','92','48'],1,'Les cellules humaines somatiques possèdent généralement 46 chromosomes, organisés en 23 paires.',1),
  tf('biology-viruses-cells','Biologie','Microbiologie','Les virus sont généralement capables de se reproduire seuls sans cellule hôte.','Faux','Les virus utilisent la machinerie d’une cellule hôte pour fabriquer leurs nouveaux composants.',1),

  // Nature
  f('nature-amphibian-frog','Nature','Animaux','À quelle grande classe appartient la grenouille ?','Aux amphibiens','Les amphibiens vivent généralement une partie de leur cycle dans l’eau et une autre sur terre.',1,['animaux']),
  f('nature-metamorphosis-butterfly','Nature','Animaux','Comment s’appelle la transformation d’une chenille en papillon ?','La métamorphose','La métamorphose complète comprend notamment les stades œuf, larve, nymphe et adulte.',1,['animaux']),
  f('nature-coral-animal','Nature','Écosystèmes','Les coraux sont-ils des animaux, des plantes ou des minéraux ?','Des animaux','Les coraux sont des cnidaires vivant souvent en symbiose avec des algues microscopiques.',2,['océans']),
  f('nature-food-chain-producer','Nature','Écosystèmes','Quel organisme occupe généralement le premier niveau d’une chaîne alimentaire ?','Un producteur primaire','Les plantes et les algues fabriquent de la matière organique grâce à l’énergie lumineuse ou chimique.',1,['écologie']),
  f('nature-mangrove-role','Nature','Écosystèmes','Quel rôle les mangroves jouent-elles souvent sur les côtes tropicales ?','Elles protègent les rivages et abritent de nombreuses espèces','Leurs racines ralentissent les vagues, retiennent les sédiments et servent de nurserie à des animaux.',2,['écologie']),
  f('nature-deciduous-tree','Nature','Végétaux','Comment appelle-t-on un arbre qui perd ses feuilles chaque année ?','Un arbre caduc','La chute saisonnière des feuilles limite notamment les pertes d’eau pendant la mauvaise saison.',1,['botanique']),
  f('nature-lichen-symbiosis','Nature','Écosystèmes','De quels deux organismes un lichen est-il principalement constitué ?','D’un champignon et d’une algue ou d’une cyanobactérie','Le champignon fournit une structure et retient l’eau, tandis que le partenaire photosynthétique produit des sucres.',2,['symbiose']),
  f('nature-migration-salmon','Nature','Animaux','Comment appelle-t-on le retour des saumons vers leur rivière de naissance pour s’y reproduire ?','La migration anadrome','Les saumons vivent en mer puis remontent les cours d’eau douce, souvent sur de longues distances.',2,['animaux']),
  mc('nature-fastest-land-animal','Nature','Quel est l’animal terrestre le plus rapide sur une courte distance ?',['Le guépard','Le cheval','L’autruche','Le léopard'],0,'Le guépard peut dépasser 90 kilomètres par heure sur une accélération brève.',1),
  tf('nature-fungi-plants','Nature','Classification','Les champignons appartiennent au règne des plantes.','Faux','Les champignons forment un règne distinct ; ils se nourrissent en absorbant des molécules organiques.',1),

  // Astronomie
  f('astronomy-earth-satellite','Astronomie','Système solaire','Quel est le satellite naturel de la Terre ?','La Lune','La Lune est le cinquième plus grand satellite naturel du Système solaire et influence les marées terrestres.',1,['système solaire']),
  f('astronomy-sun-star','Astronomie','Étoiles','De quelle catégorie d’astre le Soleil fait-il partie ?','D’une étoile','Le Soleil est une étoile de taille moyenne qui produit son énergie par fusion nucléaire.',1,['étoiles']),
  f('astronomy-moon-phases','Astronomie','Système solaire','Pourquoi la Lune présente-t-elle des phases vues depuis la Terre ?','Parce que nous voyons des portions variables de sa moitié éclairée','La Lune ne change pas de forme : son éclairage apparent dépend de sa position par rapport à la Terre et au Soleil.',1,['lune']),
  f('astronomy-light-year','Astronomie','Univers','Qu’est-ce qu’une année-lumière ?','Une distance parcourue par la lumière en un an','Une année-lumière mesure environ 9 461 milliards de kilomètres, malgré son nom lié au temps.',1,['mesures']),
  f('astronomy-black-hole','Astronomie','Univers','Comment décrit-on simplement un trou noir ?','Une région dont la gravité empêche même la lumière de s’échapper','La frontière appelée horizon des événements marque la limite au-delà de laquelle aucun signal ne revient.',2,['univers']),
  f('astronomy-milky-way-type','Astronomie','Galaxies','Quel type de galaxie est la Voie lactée ?','Une galaxie spirale barrée','Elle possède des bras spiraux et une barre centrale constituée d’étoiles.',2,['galaxies']),
  f('astronomy-comet-tail','Astronomie','Petits corps','Dans quelle direction la queue d’une comète est-elle généralement orientée ?','À l’opposé du Soleil','Le vent solaire et le rayonnement repoussent les gaz et les poussières loin du Soleil.',2,['comètes']),
  f('astronomy-eclipse-solar','Astronomie','Phénomènes','Que se passe-t-il lors d’une éclipse solaire totale ?','La Lune masque temporairement le Soleil pour une région de la Terre','Elle se produit lorsque la Lune passe entre le Soleil et la Terre et que son ombre atteint le sol.',1,['éclipses']),
  mc('astronomy-planet-largest','Astronomie','Quelle est la plus grande planète du Système solaire ?',['Saturne','Jupiter','Neptune','Uranus'],1,'Jupiter est une géante gazeuse dont le diamètre est environ onze fois celui de la Terre.',1),
  tf('astronomy-mars-has-rings','Astronomie','Planètes','Mars possède un système d’anneaux visible comme celui de Saturne.','Faux','Mars n’a pas d’anneaux ; elle possède en revanche deux petits satellites naturels, Phobos et Déimos.',1),

  // Technologie
  f('technology-gps-principle','Technologie','Navigation','Que permet principalement le système GPS ?','De déterminer une position grâce à des satellites','Un récepteur GPS compare les signaux de plusieurs satellites pour estimer sa position sur Terre.',1,['navigation']),
  f('technology-solar-panel','Technologie','Énergie','Quelle forme d’énergie un panneau photovoltaïque transforme-t-il directement en électricité ?','L’énergie lumineuse','Les cellules photovoltaïques utilisent l’effet photoélectrique pour produire un courant électrique.',1,['énergie']),
  f('technology-fiber-optic','Technologie','Communication','Quel phénomène transporte l’information dans une fibre optique ?','La lumière','La lumière se réfléchit à l’intérieur du cœur de la fibre et peut transmettre de grandes quantités de données.',2,['télécommunications']),
  f('technology-bluetooth-name','Technologie','Communication','À quoi sert principalement le Bluetooth ?','À relier des appareils proches sans câble','Cette technologie radio à courte portée connecte par exemple un casque et un téléphone.',1,['sans fil']),
  f('technology-3d-printing','Technologie','Fabrication','Quel principe caractérise l’impression 3D ?','Construire un objet couche par couche','Une imprimante 3D dépose ou solidifie progressivement un matériau à partir d’un modèle numérique.',1,['fabrication']),
  f('technology-robot-sensor','Technologie','Robotique','Quel composant permet à un robot de percevoir une distance ou une lumière ?','Un capteur','Un capteur convertit une grandeur physique en information exploitable par le système de commande.',1,['robotique']),
  f('technology-refrigerator-cycle','Technologie','Énergie','Quel transfert réalise un réfrigérateur pour refroidir son intérieur ?','Il évacue de la chaleur vers l’extérieur','Un fluide frigorigène circule dans un cycle qui absorbe de la chaleur à l’intérieur puis la rejette dehors.',2,['thermodynamique']),
  f('technology-archaeology-carbon','Technologie','Mesures','Quelle méthode permet de dater des restes organiques relativement récents ?','La datation au carbone 14','La proportion de carbone 14 encore présente aide à estimer l’âge d’un matériau organique jusqu’à plusieurs dizaines de milliers d’années.',2,['mesures']),
  mc('technology-internet-cable','Technologie','Quel support transporte une grande partie des communications Internet intercontinentales ?',['Des câbles sous-marins','Des dirigeables','Des rails électrifiés','Des canaux d’irrigation'],0,'Les câbles sous-marins en fibre optique relient les continents et transportent la majorité du trafic intercontinental.',1),
  tf('technology-plastic-biodegradable','Technologie','Matériaux','Tous les plastiques se décomposent rapidement dans la nature.','Faux','La plupart des plastiques courants persistent longtemps ; leur dégradation dépend de leur composition et des conditions du milieu.',1),

  // Informatique
  f('informatics-binary-base','Informatique','Fondamentaux','Quelle base numérique utilisent les nombres binaires ?','La base 2','Les nombres binaires n’emploient que les chiffres 0 et 1, adaptés aux deux états d’un circuit logique.',1,['bases']),
  f('informatics-operating-system','Informatique','Systèmes','Quel est le rôle principal d’un système d’exploitation ?','Gérer le matériel et fournir des services aux programmes','Il coordonne notamment la mémoire, les fichiers, les périphériques et l’exécution des applications.',1,['systèmes']),
  f('informatics-database','Informatique','Données','Qu’est-ce qu’une base de données ?','Un ensemble organisé de données que l’on peut consulter et modifier','Un système de gestion de base de données facilite le stockage, la recherche et la mise à jour des informations.',1,['données']),
  f('informatics-encryption','Informatique','Sécurité','Que fait le chiffrement d’un message ?','Il le transforme pour le rendre illisible sans la clé appropriée','Le destinataire utilise une clé ou un secret adapté pour retrouver le contenu original.',1,['sécurité']),
  f('informatics-open-source','Informatique','Logiciels','Que signifie logiciel libre ou open source ?','Son code source peut être consulté selon sa licence','Une licence libre autorise certaines utilisations, modifications et redistributions définies par ses termes.',2,['logiciels']),
  f('informatics-recursion','Informatique','Algorithmique','Qu’est-ce qu’une fonction récursive ?','Une fonction qui s’appelle elle-même avec un cas d’arrêt','Le cas d’arrêt est indispensable pour éviter une suite infinie d’appels.',2,['algorithmique']),
  f('informatics-cache','Informatique','Systèmes','À quoi sert un cache informatique ?','À conserver temporairement des données pour accélérer leur accès','Un cache évite de recalculer ou de recharger des données fréquemment utilisées.',1,['performance']),
  f('informatics-dns','Informatique','Réseaux','Quel service associe généralement un nom de domaine à une adresse IP ?','Le DNS','Le Domain Name System permet d’utiliser des noms lisibles plutôt que des adresses numériques.',1,['réseaux']),
  mc('informatics-html-role','Informatique','Quel est le rôle principal du HTML dans une page web ?',['Décrire la structure du contenu','Chiffrer le disque','Alimenter le serveur','Dessiner uniquement des pixels'],0,'Le HTML structure les titres, paragraphes, liens et autres éléments d’un document web.',1),
  tf('informatics-ram-permanent','Informatique','Matériel','La mémoire vive RAM conserve normalement ses données quand l’ordinateur est éteint.','Faux','La RAM est une mémoire volatile ; les données persistantes sont stockées sur un support comme un SSD.',1),

  // Arts
  f('arts-sculpture-david-michelangelo','Arts','Sculpture','Quel artiste a sculpté le David conservé à Florence ?','Michel-Ange','Le David de Michel-Ange, réalisé au début du XVIe siècle, représente le héros biblique avant son combat contre Goliath.',1,['sculpture']),
  f('arts-van-gogh-starry-night','Arts','Peinture','Quel peintre a réalisé La Nuit étoilée ?','Vincent van Gogh','La Nuit étoilée est peinte en 1889 depuis la fenêtre de la chambre de Van Gogh à Saint-Rémy-de-Provence.',1,['peinture']),
  f('arts-cubism-picasso','Arts','Peinture','Quel mouvement artistique est associé à Pablo Picasso et Georges Braque ?','Le cubisme','Le cubisme décompose les formes et multiplie les points de vue dans une même représentation.',1,['peinture']),
  f('arts-architecture-parthenon','Arts','Architecture','Dans quelle ville se trouve le Parthénon ?','Athènes','Le Parthénon domine l’Acropole d’Athènes et était consacré à la déesse Athéna.',1,['architecture']),
  f('arts-rodin-thinker','Arts','Sculpture','Quel sculpteur français est l’auteur du Penseur ?','Auguste Rodin','Le Penseur est devenu l’une des sculptures les plus connues de Rodin, liée à son projet de Porte de l’Enfer.',1,['sculpture']),
  f('arts-art-nouveau-guimard','Arts','Architecture','Quel architecte français est célèbre pour les entrées de métro parisiennes de style Art nouveau ?','Hector Guimard','Ses édicules et entourages en fonte ornés de formes végétales deviennent des emblèmes de Paris.',2,['architecture']),
  f('arts-perspective-renaissance','Arts','Peinture','Quelle technique donne l’illusion de la profondeur sur une surface plane ?','La perspective','La perspective organise les lignes et les tailles apparentes autour de points de fuite.',1,['peinture']),
  f('arts-museum-orsay','Arts','Musées','Dans quelle ville se trouve le musée d’Orsay ?','Paris','Installé dans une ancienne gare, le musée d’Orsay est particulièrement connu pour ses collections impressionnistes.',1,['musées']),
  mc('arts-bauhaus-country','Arts','Dans quel pays l’école du Bauhaus a-t-elle été fondée ?',['Allemagne','Italie','Japon','Mexique'],0,'Le Bauhaus est fondé à Weimar en 1919 avant de s’installer à Dessau puis à Berlin.',2),
  tf('arts-impressionism-photography','Arts','Peinture','L’impressionnisme s’est développé en partie en réaction aux conventions académiques de la peinture.','Vrai','Les impressionnistes privilégient notamment la lumière, les touches visibles et les scènes de la vie moderne.',2),

  // Littérature
  f('literature-miserables-author','Littérature','France','Quel écrivain français a écrit Les Misérables ?','Victor Hugo','Publié en 1862, le roman suit notamment Jean Valjean et dénonce la misère sociale du XIXe siècle.',1,['francophonie']),
  f('literature-don-quixote-author','Littérature','Espagne','Qui a écrit Don Quichotte ?','Miguel de Cervantès','Le roman paru en deux parties met en scène un lecteur de romans de chevalerie devenu chevalier errant.',1,['classiques']),
  f('literature-pride-prejudice','Littérature','Angleterre','Quelle romancière a écrit Orgueil et Préjugés ?','Jane Austen','Le roman publié en 1813 observe avec ironie les conventions sociales et matrimoniales de son époque.',1,['romans']),
  f('literature-fables-la-fontaine','Littérature','France','Quel auteur français est célèbre pour ses Fables mettant en scène des animaux ?','Jean de La Fontaine','Ses fables utilisent des récits animaliers pour proposer une réflexion morale et sociale.',1,['poésie']),
  f('literature-greek-tragedy','Littérature','Antiquité','Quel dramaturge grec a écrit Œdipe roi ?','Sophocle','La tragédie de Sophocle raconte la découverte progressive par Œdipe de son terrible destin.',2,['théâtre']),
  f('literature-1984-author','Littérature','Royaume-Uni','Qui a écrit le roman dystopique 1984 ?','George Orwell','Publié en 1949, le roman décrit une société de surveillance et de contrôle de la pensée.',1,['dystopie']),
  f('literature-nobel-proust','Littérature','France','Quel écrivain français a composé À la recherche du temps perdu ?','Marcel Proust','Cette œuvre monumentale explore la mémoire, le temps et les milieux mondains à travers un narrateur introspectif.',2,['romans']),
  f('literature-haiku-japan','Littérature','Poésie','Dans quel pays le haïku s’est-il développé comme forme poétique ?','Au Japon','Le haïku classique est un poème bref associé à l’observation de la nature et aux saisons.',1,['poésie']),
  mc('literature-candide-author','Littérature','Qui a écrit le conte philosophique Candide ?',['Voltaire','Rousseau','Molière','Diderot'],0,'Voltaire publie Candide en 1759 pour critiquer l’optimisme naïf et les injustices de son époque.',1),
  tf('literature-iliad-novel','Littérature','Antiquité','L’Iliade est un roman moderne écrit en prose.','Faux','L’Iliade est une épopée grecque en vers, traditionnellement attribuée à Homère.',1),

  // Cinéma
  f('cinema-citizen-kane-director','Cinéma','États-Unis','Quel réalisateur a signé Citizen Kane ?','Orson Welles','Sorti en 1941, le film est réputé pour sa narration, sa photographie et ses innovations de mise en scène.',2,['classiques']),
  f('cinema-journey-moon-year','Cinéma','Histoire','En quelle année sort Le Voyage dans la Lune de Georges Méliès ?','1902','Le film de 1902 est célèbre pour son décor lunaire et son image d’un projectile dans l’œil de la Lune.',1,['cinéma muet']),
  f('cinema-neorealism-italy','Cinéma','Mouvements','Dans quel pays le néoréalisme cinématographique s’est-il développé après la Seconde Guerre mondiale ?','En Italie','Le néoréalisme italien privilégie souvent les décors réels, les sujets sociaux et des interprètes non professionnels.',2,['mouvements']),
  f('cinema-spirited-away-director','Cinéma','Animation','Quel réalisateur japonais a créé Le Voyage de Chihiro ?','Hayao Miyazaki','Le film du Studio Ghibli suit Chihiro dans un monde peuplé d’esprits et remporte l’Oscar du meilleur film d’animation.',1,['animation']),
  f('cinema-film-editing','Cinéma','Technique','Comment appelle-t-on l’assemblage des plans pour construire un film ?','Le montage','Le montage organise les images et les sons pour créer rythme, continuité et sens.',1,['technique']),
  f('cinema-film-noir','Cinéma','Mouvements','Quel genre cinématographique est associé aux détectives, aux ombres contrastées et aux intrigues criminelles ?','Le film noir','Le film noir américain met souvent en scène le crime, l’ambiguïté morale et une atmosphère nocturne.',2,['genres']),
  f('cinema-cannes-festival-city','Cinéma','Récompenses','Dans quelle ville française se déroule le principal festival international du film connu pour sa Palme d’or ?','Cannes','Le Festival de Cannes se tient chaque année sur la Côte d’Azur et remet la Palme d’or à la compétition officielle.',1,['festivals']),
  f('cinema-silent-film-intertitles','Cinéma','Technique','Comment les films muets transmettaient-ils souvent les dialogues ?','Par des intertitres','Des cartons de texte étaient insérés entre les plans pour donner les dialogues ou des informations narratives.',1,['cinéma muet']),
  mc('cinema-jaws-director','Cinéma','Qui a réalisé le film Les Dents de la mer ?',['Steven Spielberg','Francis Ford Coppola','Ridley Scott','Billy Wilder'],0,'Steven Spielberg réalise Jaws en 1975, film qui contribue à populariser le blockbuster estival.',1),
  tf('cinema-color-before-sound','Cinéma','Histoire','Le cinéma en couleur est apparu après le cinéma sonore.','Faux','Des procédés de couleur existent avant la généralisation du son, même si leur usage est longtemps limité et coûteux.',2),

  // Séries
  f('series-sitcom-definition','Séries','Genres','Que signifie le terme sitcom ?','Une comédie de situation','Une sitcom suit des personnages récurrents dans des situations comiques souvent organisées autour de lieux familiers.',1,['genres']),
  f('series-bbc-doctor-who','Séries','Science-fiction','Quelle série britannique met en scène un voyageur appelé le Docteur dans le temps et l’espace ?','Doctor Who','La série créée en 1963 repose sur la possibilité de changer d’interprète pour le personnage du Docteur.',1,['science-fiction']),
  f('series-breaking-bad-creator','Séries','Dramatique','Quel créateur est à l’origine de la série Breaking Bad ?','Vince Gilligan','La série suit la transformation de Walter White, professeur de chimie devenu fabricant de méthamphétamine.',2,['drame']),
  f('series-game-thrones-source','Séries','Fantastique','De quelle série de romans la série Game of Thrones est-elle adaptée ?','A Song of Ice and Fire de George R. R. Martin','La série télévisée adapte une saga de fantasy politique publiée à partir de 1996.',1,['fantasy']),
  f('series-sherlock-bbc','Séries','Policier','Quel détective créé par Arthur Conan Doyle est au centre de la série Sherlock de la BBC ?','Sherlock Holmes','La série transpose Sherlock Holmes et le docteur Watson dans le Londres contemporain.',1,['policier']),
  f('series-anime-definition','Séries','Animation','Comment appelle-t-on couramment l’animation produite au Japon ?','L’anime','En français, anime désigne généralement les œuvres d’animation japonaises, quel que soit leur format.',1,['animation']),
  f('series-miniseries-definition','Séries','Formats','Qu’est-ce qu’une mini-série ?','Une série conçue pour une histoire limitée et un nombre fini d’épisodes','Elle se distingue d’une série à saisons ouvertes par une intrigue généralement prévue pour se conclure.',1,['formats']),
  f('series-documentary-series','Séries','Documentaire','Quel est le but principal d’une série documentaire ?','Présenter des faits ou un sujet réel sous forme de plusieurs épisodes','La série documentaire peut utiliser témoignages, archives, observations et explications.',1,['documentaire']),
  mc('series-friends-setting','Séries','Dans quelle ville se déroule principalement la sitcom Friends ?',['New York','Los Angeles','Chicago','Seattle'],0,'Les six personnages principaux vivent et se retrouvent principalement à Manhattan.',1),
  tf('series-season-episode','Séries','Formats','Une saison de série est toujours composée d’un seul épisode.','Faux','Une saison regroupe généralement plusieurs épisodes, même si leur nombre varie selon les productions.',1),

  // Musique
  f('music-piano-keys','Musique','Instruments','Combien de touches compte généralement un piano moderne standard ?','88','Un piano standard possède 52 touches blanches et 36 touches noires.',1,['instruments']),
  f('music-clef-sol','Musique','Notation','Quelle clé est aussi appelée clé de sol ?','La clé qui place le sol sur la deuxième ligne de la portée','La clé de sol indique la hauteur de référence du sol et convient notamment aux voix et instruments aigus.',1,['notation']),
  f('music-jazz-new-orleans','Musique','Genres','Dans quelle ville américaine le jazz s’est-il particulièrement développé à ses débuts ?','La Nouvelle-Orléans','La Nouvelle-Orléans mêle des traditions musicales africaines, européennes et caribéennes qui nourrissent le jazz.',1,['jazz']),
  f('music-reggae-jamaica','Musique','Genres','De quelle île le reggae est-il originaire ?','La Jamaïque','Le reggae se développe en Jamaïque à partir des années 1960, avec une forte influence du ska et du rocksteady.',1,['reggae']),
  f('music-opera-singers','Musique','Classique','Comment appelle-t-on une œuvre musicale et théâtrale entièrement ou principalement chantée ?','Un opéra','L’opéra combine musique, chant, texte, mise en scène et souvent orchestre.',1,['opéra']),
  f('music-bach-composer','Musique','Classique','Quel compositeur baroque a écrit les Concertos brandebourgeois ?','Jean-Sébastien Bach','Les six Concertos brandebourgeois illustrent la richesse de l’écriture instrumentale de Bach.',2,['classique']),
  f('music-rhythm-definition','Musique','Notions','Que désigne le rythme en musique ?','L’organisation des durées et des accents dans le temps','Le rythme structure le déroulement temporel d’une œuvre, indépendamment de sa mélodie.',1,['notions']),
  f('music-saxophone-adolphe','Musique','Instruments','Quel inventeur a donné son nom au saxophone ?','Adolphe Sax','Adolphe Sax, facteur d’instruments belge, met au point le saxophone au XIXe siècle.',2,['instruments']),
  mc('music-four-families-orchestra','Musique','Quelle famille d’instruments comprend le violon et le violoncelle ?',['Les cordes','Les cuivres','Les bois','Les percussions'],0,'Le violon et le violoncelle produisent leur son grâce à des cordes frottées par un archet.',1),
  tf('music-mozart-romantic','Musique','Histoire','Mozart est généralement classé parmi les compositeurs de la période classique.','Vrai','Mozart est une figure majeure du classicisme viennois, avant le plein développement du romantisme.',1),

  // Sport
  f('sport-tennis-grand-slam','Sport','Tennis','Combien de tournois composent le Grand Chelem de tennis ?','Quatre','Les quatre tournois sont l’Open d’Australie, Roland-Garros, Wimbledon et l’US Open.',1,['tennis']),
  f('sport-marathon-distance','Sport','Athlétisme','Quelle est la distance officielle d’un marathon ?','42,195 kilomètres','La distance moderne du marathon est fixée à 42,195 km, soit 26 miles et 385 yards.',1,['athlétisme']),
  f('sport-basketball-hoop-height','Sport','Basket-ball','À quelle hauteur se trouve généralement l’anneau d’un panier de basket-ball ?','3,05 mètres','La hauteur réglementaire de l’anneau est de 10 pieds, soit 3,05 mètres.',1,['basket-ball']),
  f('sport-rugby-try-value','Sport','Rugby','Comment appelle-t-on le fait d’aplatir le ballon derrière la ligne d’en-but au rugby ?','Un essai','L’essai rapporte des points et peut être suivi d’une transformation.',1,['rugby']),
  f('sport-cycling-yellow-jersey','Sport','Cyclisme','Quelle couleur porte le leader du classement général du Tour de France ?','Le jaune','Le maillot jaune distingue le coureur dont le temps cumulé est le plus faible.',1,['cyclisme']),
  f('sport-fencing-weapons','Sport','Escrime','Quelles sont les trois armes de l’escrime sportive ?','Le fleuret, l’épée et le sabre','Ces armes ont des règles de touche et des surfaces valables différentes.',1,['escrime']),
  f('sport-swimming-four-strokes','Sport','Natation','Quels sont les quatre nages de compétition reconnues ?','Le crawl, le dos, la brasse et le papillon','Les épreuves de quatre nages combinent dos, brasse, papillon et nage libre dans cet ordre réglementaire.',2,['natation']),
  f('sport-gymnastics-apparatus','Sport','Gymnastique','Quel agrès de gymnastique artistique masculine est constitué de deux arceaux parallèles ?','Les barres parallèles','Le gymnaste réalise des balancés, appuis et sorties sur deux barres surélevées.',1,['gymnastique']),
  mc('sport-football-offside','Sport','Dans quel sport la règle du hors-jeu est-elle emblématique ?',['Football','Judo','Natation','Boxe'],0,'Au football, un joueur peut être sanctionné s’il participe à l’action depuis une position de hors-jeu.',1),
  tf('sport-chess-physical','Sport','Esprit','Les échecs sont reconnus comme un sport par de nombreuses organisations sportives.','Vrai','Les échecs sont une discipline compétitive régie par des fédérations et reconnue comme sport dans plusieurs pays.',2),

  // Politique
  f('politics-democracy-definition','Politique','Régimes','Que signifie littéralement le mot démocratie ?','Le pouvoir du peuple','Le terme vient du grec dêmos, le peuple, et kratos, le pouvoir.',1,['institutions']),
  f('politics-universal-suffrage','Politique','Élections','Qu’est-ce que le suffrage universel ?','Le droit de vote accordé à l’ensemble des citoyens remplissant les conditions légales','Il s’oppose à un suffrage censitaire ou réservé à certaines catégories de population.',1,['élections']),
  f('politics-referendum','Politique','Élections','Qu’est-ce qu’un référendum ?','Une consultation directe des électeurs sur une question','Les électeurs répondent généralement par oui ou non à une proposition précise.',1,['élections']),
  f('politics-constitution','Politique','Institutions','Quel est le rôle général d’une constitution ?','Fixer les règles fondamentales d’organisation et de pouvoir d’un État','Une constitution définit les institutions, leurs compétences et les droits qu’elle protège.',1,['institutions']),
  f('politics-secularism','Politique','Principes','Quel principe organise la séparation des cultes et de l’État en France ?','La laïcité','La laïcité garantit la liberté de conscience et la neutralité de l’État à l’égard des religions.',2,['france']),
  f('politics-majority-minority','Politique','Parlement','Comment appelle-t-on les groupes qui ne soutiennent pas la majorité dans une assemblée ?','L’opposition','L’opposition contrôle, critique et propose des alternatives aux décisions de la majorité.',1,['parlement']),
  f('politics-diplomacy','Politique','Relations internationales','Quel terme désigne la conduite pacifique des relations entre États ?','La diplomatie','La diplomatie s’appuie sur la négociation, la représentation et la recherche d’accords.',1,['international']),
  f('politics-separation-church-state','Politique','Institutions','Quel texte français de 1905 affirme la séparation des Églises et de l’État ?','La loi de 1905','La loi du 9 décembre 1905 établit notamment la liberté de conscience et la neutralité de la République.',2,['france']),
  mc('politics-legislative-power','Politique','Quel pouvoir est principalement chargé de voter les lois ?',['Le pouvoir législatif','Le pouvoir judiciaire','Le pouvoir exécutif','Le pouvoir militaire'],0,'Le pouvoir législatif est exercé par un parlement ou une assemblée chargée de délibérer et voter les lois.',1),
  tf('politics-democracy-elections','Politique','Régimes','Une démocratie repose généralement sur la participation politique des citoyens, notamment par des élections.','Vrai','Les élections permettent aux citoyens de choisir des représentants ou de participer directement à certaines décisions.',1),

  // Institutions
  f('institutions-united-nations-security-council','Institutions','International','Quel organe de l’ONU peut adopter des résolutions contraignantes sur la paix et la sécurité internationales ?','Le Conseil de sécurité','Le Conseil de sécurité comprend quinze membres, dont cinq membres permanents disposant d’un droit de veto.',2,['onu']),
  f('institutions-european-parliament','Institutions','Europe','Quelle institution de l’Union européenne est élue directement par les citoyens ?','Le Parlement européen','Les députés européens sont élus au suffrage universel direct dans les États membres.',1,['union européenne']),
  f('institutions-constitution-council-france','Institutions','France','Quel organisme français contrôle notamment la conformité des lois à la Constitution ?','Le Conseil constitutionnel','Le Conseil constitutionnel peut examiner des lois avant leur promulgation et, dans certains cas, après.',2,['france']),
  f('institutions-cour-cassation','Institutions','Justice','Quelle juridiction française est la plus haute de l’ordre judiciaire ?','La Cour de cassation','Elle vérifie la correcte application du droit sans rejuger en principe les faits de l’affaire.',2,['justice']),
  f('institutions-mairie-commune','Institutions','France','Quelle institution administre une commune en France ?','La mairie, avec le conseil municipal','Le conseil municipal délibère et le maire exécute les décisions dans le cadre des compétences communales.',1,['collectivités']),
  f('institutions-constitution-preamble','Institutions','Droits','Quel texte de 1789 est intégré au bloc de constitutionnalité français ?','La Déclaration des droits de l’homme et du citoyen','La Déclaration de 1789 énonce des principes fondamentaux comme la liberté et l’égalité devant la loi.',1,['droits']),
  f('institutions-european-commission-role','Institutions','Europe','Quel rôle général joue la Commission européenne ?','Elle propose des textes européens et veille à l’application du droit de l’Union','La Commission représente l’intérêt général de l’Union et met en œuvre ses politiques.',2,['union européenne']),
  f('institutions-ombudsman','Institutions','Droits','Comment appelle-t-on une autorité chargée d’examiner les réclamations contre l’administration ?','Un médiateur ou ombudsman','Le médiateur cherche une solution aux litiges entre les usagers et les administrations.',1,['droits']),
  mc('institutions-eu-court','Institutions','Quelle juridiction interprète le droit de l’Union européenne ?',['La Cour de justice de l’Union européenne','La Cour pénale internationale','La Cour des comptes française','La Cour européenne des droits de l’homme'],0,'La Cour de justice de l’Union européenne assure une interprétation et une application uniformes du droit de l’Union.',2),
  tf('institutions-constitution-above-law','Institutions','Droit','Dans un État de droit, les pouvoirs publics doivent respecter les règles juridiques qui leur sont applicables.','Vrai','L’État de droit signifie notamment que l’action des autorités est encadrée et contrôlée par le droit.',1),

  // Économie
  f('economy-gdp-definition','Économie','Indicateurs','Que mesure principalement le produit intérieur brut ?','La valeur des biens et services finaux produits sur un territoire pendant une période','Le PIB mesure une activité économique, mais ne résume ni le bien-être ni la répartition des revenus.',2,['indicateurs']),
  f('economy-supply-demand','Économie','Marchés','Que décrit la loi de l’offre et de la demande ?','La relation entre les quantités proposées, demandées et le prix sur un marché','Toutes choses égales par ailleurs, une demande plus forte peut exercer une pression à la hausse sur le prix.',1,['marchés']),
  f('economy-bank-central','Économie','Monnaie','Quel est le rôle général d’une banque centrale ?','Émettre la monnaie et conduire la politique monétaire','Une banque centrale cherche notamment à préserver la stabilité des prix et la confiance dans la monnaie.',1,['monnaie']),
  f('economy-opportunity-cost','Économie','Notions','Qu’est-ce qu’un coût d’opportunité ?','La valeur de la meilleure option abandonnée lors d’un choix','Choisir une activité signifie renoncer aux bénéfices potentiels de la meilleure alternative.',2,['notions']),
  f('economy-division-labor','Économie','Production','Que désigne la division du travail ?','La répartition d’une production en tâches spécialisées','La spécialisation peut accroître la productivité, mais elle crée aussi une interdépendance entre les acteurs.',1,['production']),
  f('economy-taxes','Économie','Finances publiques','À quoi servent principalement les impôts ?','À financer les services et dépenses publics','Les impôts financent notamment l’éducation, la santé, les infrastructures et les mécanismes de solidarité.',1,['finances publiques']),
  f('economy-trade-balance','Économie','Commerce','Que compare une balance commerciale ?','La valeur des exportations et des importations de biens','Elle est excédentaire lorsque la valeur des exportations dépasse celle des importations.',2,['commerce']),
  f('economy-institutional-investor','Économie','Finance','Comment appelle-t-on un acteur qui place de l’argent dans un projet en espérant un rendement ?','Un investisseur','Un investisseur peut financer une entreprise, un titre financier ou un projet en acceptant un certain risque.',1,['finance']),
  mc('economy-deflation','Économie','Comment appelle-t-on une baisse générale et durable des prix ?',['La déflation','La croissance','La stagflation','La dévaluation'],0,'La déflation est une baisse générale des prix qui peut s’accompagner d’un recul de la demande et de l’activité.',2),
  tf('economy-gdp-happiness','Économie','Indicateurs','Le PIB suffit à lui seul pour mesurer parfaitement le bien-être d’une population.','Faux','Le PIB ignore notamment la répartition des revenus, le travail non rémunéré, la santé et les effets environnementaux.',1),

  // Philosophie
  f('philosophy-aristotle-ethics','Philosophie','Antiquité','Quel philosophe grec a écrit l’Éthique à Nicomaque ?','Aristote','L’ouvrage réfléchit à la vertu, au bonheur et à la vie bonne dans la cité.',2,['antiquité']),
  f('philosophy-stoicism','Philosophie','Antiquité','Quel courant philosophique recommande de distinguer ce qui dépend de nous de ce qui n’en dépend pas ?','Le stoïcisme','Les stoïciens cherchent la liberté intérieure en concentrant leur jugement et leur action sur ce qui dépend d’eux.',1,['antiquité']),
  f('philosophy-descartes-cogito','Philosophie','Époque moderne','Quelle formule résume le cogito de Descartes ?','Je pense, donc je suis','Descartes considère l’acte de penser comme une certitude que même le doute ne peut supprimer.',1,['modernité']),
  f('philosophy-kant-categorical-imperative','Philosophie','Morale','Quel concept moral est associé à Kant et à l’idée d’une règle valable universellement ?','L’impératif catégorique','Kant demande d’agir selon des maximes que l’on pourrait vouloir ériger en loi universelle.',2,['morale']),
  f('philosophy-existentialism','Philosophie','Époque contemporaine','Quel courant met l’accent sur la liberté et la responsabilité de l’existence individuelle ?','L’existentialisme','Les philosophes existentialistes examinent le choix, l’angoisse et la responsabilité dans un monde sans sens donné.',2,['contemporain']),
  f('philosophy-utilitarianism','Philosophie','Morale','Quel principe résume souvent l’utilitarisme ?','Rechercher le plus grand bonheur du plus grand nombre','L’utilitarisme évalue les actions selon leurs conséquences sur le bien-être collectif.',2,['morale']),
  f('philosophy-plato-forms','Philosophie','Antiquité','Comment Platon appelle-t-il les réalités intelligibles parfaites auxquelles les choses sensibles participent ?','Les Idées ou Formes','Dans la philosophie platonicienne, les Formes sont stables et connaissables par l’intelligence.',2,['antiquité']),
  f('philosophy-hannah-arendt','Philosophie','Politique','Quelle philosophe a analysé la banalité du mal dans son compte rendu du procès Eichmann ?','Hannah Arendt','Arendt décrit comment l’absence de pensée critique et l’obéissance peuvent participer à des actes monstrueux.',2,['politique']),
  mc('philosophy-tabula-rasa','Philosophie','À quel philosophe associe-t-on souvent l’idée de l’esprit comme une table rase à la naissance ?',['John Locke','Platon','Nietzsche','Épicure'],0,'Locke défend l’idée que l’expérience joue un rôle central dans la formation des connaissances.',2),
  tf('philosophy-socrates-wrote-books','Philosophie','Antiquité','Socrate a laissé lui-même de nombreux livres de philosophie.','Faux','Socrate n’a rien écrit de connu ; sa pensée est rapportée notamment par Platon et Xénophon.',1),

  // Mythologie
  f('mythology-zeus-greek-god','Mythologie','Grecque','Quel dieu est le maître de l’Olympe dans la mythologie grecque ?','Zeus','Zeus est associé au ciel, à la foudre et à l’autorité parmi les dieux olympiens.',1,['grèce']),
  f('mythology-athena-birth','Mythologie','Grecque','De quelle manière exceptionnelle Athéna serait-elle née selon le mythe grec ?','Elle serait sortie de la tête de Zeus','Le récit raconte que Zeus avale Métis puis qu’Héphaïstos ouvre son crâne pour faire naître Athéna.',2,['grèce']),
  f('mythology-minotaur-labyrinth','Mythologie','Grecque','Dans quel lieu le Minotaure est-il enfermé ?','Le labyrinthe de Crète','Le héros Thésée y entre grâce au fil d’Ariane pour vaincre le monstre.',1,['grèce']),
  f('mythology-icarus-wings','Mythologie','Grecque','Pourquoi Icare tombe-t-il dans la mer selon le mythe ?','Il vole trop près du Soleil et la cire de ses ailes fond','Le récit de Dédale et Icare est souvent interprété comme une mise en garde contre la démesure.',1,['grèce']),
  f('mythology-odin-norse','Mythologie','Nordique','Quel dieu nordique est associé à la sagesse, aux morts et à la poésie ?','Odin','Odin est le père de nombreux dieux et règne depuis Asgard dans les récits nordiques.',2,['nordique']),
  f('mythology-valhalla','Mythologie','Nordique','Comment s’appelle le séjour des guerriers morts au combat dans la mythologie nordique ?','Le Valhalla','Les guerriers choisis par les valkyries y festoient sous l’autorité d’Odin.',1,['nordique']),
  f('mythology-isis-egypt','Mythologie','Égyptienne','Quelle déesse égyptienne est l’épouse d’Osiris et la mère d’Horus ?','Isis','Isis est associée à la magie, à la maternité et à la protection dans la religion égyptienne antique.',1,['égypte']),
  f('mythology-quetzalcoatl','Mythologie','Mésoamérique','Quel dieu mésoaméricain est souvent représenté comme un serpent à plumes ?','Quetzalcóatl','Quetzalcóatl occupe une place importante dans les traditions religieuses de Mésoamérique.',2,['mésoamérique']),
  mc('mythology-three-headed-cerberus','Mythologie','Quel animal garde les Enfers dans la mythologie grecque ?',['Cerbère','Pégase','Le sphinx','Le griffon'],0,'Cerbère est le chien à plusieurs têtes qui garde l’entrée du royaume d’Hadès.',1),
  tf('mythology-medusa-gorgon','Mythologie','Grecque','Méduse est l’une des Gorgones de la mythologie grecque.','Vrai','Méduse est la seule Gorgone mortelle et son regard est réputé pétrifier ceux qui la fixent.',1),

  // Religions
  f('religions-christianity-bible','Religions','Christianisme','Quel livre constitue le texte sacré central du christianisme ?','La Bible','La Bible chrétienne rassemble notamment l’Ancien Testament et le Nouveau Testament.',1,['christianisme']),
  f('religions-islam-quran','Religions','Islam','Comment s’appelle le livre sacré de l’islam ?','Le Coran','Dans l’islam, le Coran est considéré comme la révélation transmise au prophète Muhammad.',1,['islam']),
  f('religions-judaism-torah','Religions','Judaïsme','Quel nom porte le texte fondateur qui rassemble les cinq premiers livres de la Bible hébraïque ?','La Torah','La Torah, ou Pentateuque, comprend notamment la Genèse, l’Exode, le Lévitique, les Nombres et le Deutéronome.',1,['judaïsme']),
  f('religions-hinduism-ganges','Religions','Hindouisme','Quel fleuve est particulièrement sacré dans l’hindouisme ?','Le Gange','Le Gange est vénéré comme une déesse et joue un rôle majeur dans de nombreux rites.',1,['hindouisme']),
  f('religions-sikhism-founder','Religions','Sikhisme','Quel maître est considéré comme le fondateur du sikhisme ?','Guru Nanak','Guru Nanak enseigne au XVe siècle une voie spirituelle fondée sur la dévotion et l’égalité.',2,['sikhisme']),
  f('religions-buddhism-eightfold','Religions','Bouddhisme','Comment s’appelle le chemin de pratique décrit dans le bouddhisme pour mettre fin à la souffrance ?','L’Octuple Sentier','Le Noble Sentier octuple rassemble notamment compréhension, parole, action et attention justes.',1,['bouddhisme']),
  f('religions-shinto-japan','Religions','Japon','Quelle religion traditionnelle japonaise vénère notamment des esprits appelés kami ?','Le shinto','Le shinto accorde une place importante aux sanctuaires, aux rites de purification et aux forces de la nature.',2,['shinto']),
  f('religions-pilgrimage-mecca','Religions','Islam','Quelle ville accueille le pèlerinage annuel du hajj ?','La Mecque','Le hajj est l’un des cinq piliers de l’islam et se déroule selon un calendrier rituel précis.',1,['islam']),
  mc('religions-vesak','Religions','Quelle fête bouddhiste commémore traditionnellement la naissance, l’éveil et la mort du Bouddha ?',['Vesak','Pessa’h','Diwali','Aïd al-Fitr'],0,'Vesak est une fête majeure du bouddhisme, dont les modalités varient selon les pays et les traditions.',2),
  tf('religions-religions-diverse','Religions','Comparaison','Les religions du monde forment toutes une tradition unique et identique.','Faux','Les religions et leurs courants sont très divers, avec des croyances, rites, textes et histoires distincts.',1),

  // Langues
  f('languages-alphabet-greek','Langues','Écriture','Quel alphabet est utilisé pour écrire le grec moderne ?','L’alphabet grec','L’alphabet grec a aussi influencé les alphabets latin et cyrillique.',1,['écriture']),
  f('languages-latin-origin','Langues','Histoire','De quelle langue ancienne le français est-il principalement issu ?','Du latin parlé','Le français appartient aux langues romanes, descendantes du latin vulgaire diffusé par l’Empire romain.',1,['français']),
  f('languages-sign-language','Langues','Communication','Une langue des signes est-elle un simple code gestuel universel ?','Non, c’est une langue à part entière propre à une communauté','Les langues des signes possèdent leur grammaire, leur lexique et des variations historiques ou régionales.',2,['linguistique']),
  f('languages-bilingualism','Langues','Linguistique','Comment appelle-t-on une personne qui utilise couramment deux langues ?','Une personne bilingue','Le bilinguisme peut prendre des formes variées selon les contextes, les compétences et les usages.',1,['linguistique']),
  f('languages-onomatopoeia','Langues','Lexique','Comment appelle-t-on un mot qui imite un bruit, comme « tic-tac » ?','Une onomatopée','Les onomatopées reproduisent ou évoquent des sons et diffèrent parfois d’une langue à l’autre.',1,['lexique']),
  f('languages-oxford-english','Langues','Anglais','Quel signe de ponctuation sépare deux propositions indépendantes fortement liées ?','Le point-virgule','Le point-virgule peut relier deux propositions autonomes sans employer une conjonction.',2,['ponctuation']),
  f('languages-translation','Langues','Linguistique','Comment appelle-t-on le passage d’un texte d’une langue à une autre ?','La traduction','La traduction cherche à restituer le sens et le style tout en tenant compte des différences culturelles.',1,['traduction']),
  f('languages-phoneme','Langues','Phonétique','Qu’est-ce qu’un phonème ?','Une unité sonore capable de distinguer des mots dans une langue','Remplacer un phonème par un autre peut changer le sens, comme dans « pain » et « bain » en français.',2,['phonétique']),
  mc('languages-romance-family','Langues','Le français, l’espagnol et l’italien appartiennent principalement à quelle famille ?',['Les langues romanes','Les langues slaves','Les langues germaniques','Les langues sémitiques'],0,'Ces langues descendent du latin et forment une branche de la famille indo-européenne.',1),
  tf('languages-all-languages-same-grammar','Langues','Linguistique','Toutes les langues du monde suivent exactement la même grammaire.','Faux','Les langues partagent parfois des propriétés, mais leurs structures grammaticales peuvent être très différentes.',1),

  // Inventions
  f('inventions-pen-gutenberg','Inventions','Objets','Quel objet d’écriture à réservoir d’encre est associé à un brevet de Lewis Waterman au XIXe siècle ?','Le stylo-plume','Le stylo-plume permet d’écrire avec une réserve d’encre liquide alimentant une plume.',1,['objets']),
  f('inventions-steam-engine-watt','Inventions','Énergie','Quel ingénieur a perfectionné la machine à vapeur au XVIIIe siècle ?','James Watt','Les améliorations de Watt rendent la machine à vapeur plus efficace et contribuent à la révolution industrielle.',1,['révolution industrielle']),
  f('inventions-lightbulb-edison','Inventions','Électricité','Quel inventeur est associé à la mise au point d’une lampe électrique à incandescence commercialement viable ?','Thomas Edison','Edison améliore une lampe à filament et développe un système complet de production et de distribution électrique.',2,['électricité']),
  f('inventions-airplane-wright','Inventions','Transport','Quels frères réalisent un vol motorisé contrôlé célèbre en 1903 ?','Orville et Wilbur Wright','Les frères Wright effectuent leurs essais à Kitty Hawk, en Caroline du Nord.',1,['aviation']),
  f('inventions-sewing-machine','Inventions','Objets','Quelle machine permet d’assembler rapidement des pièces de tissu par couture mécanique ?','La machine à coudre','La machine à coudre mécanise le passage du fil et transforme la confection textile.',1,['textile']),
  f('inventions-microscope-hooke','Inventions','Sciences','Quel instrument permet d’observer des objets trop petits pour l’œil nu ?','Le microscope','Le microscope agrandit des structures minuscules ; Robert Hooke popularise le terme cellule après ses observations.',1,['instruments']),
  f('inventions-telephone-history','Inventions','Communication','Quel appareil transforme la voix en signaux transmissibles à distance ?','Le téléphone','Le téléphone permet de transmettre la parole à un interlocuteur éloigné par un réseau de communication.',1,['communication']),
  f('inventions-compass-navigation','Inventions','Navigation','Quel instrument indique une direction grâce au champ magnétique terrestre ?','La boussole','L’aiguille aimantée d’une boussole s’aligne approximativement sur le champ magnétique terrestre.',1,['navigation']),
  mc('inventions-vaccine-smallpox','Inventions','Quelle maladie est associée aux premières vaccinations de Jenner ?',['La variole','Le choléra','La tuberculose','Le paludisme'],0,'En 1796, Edward Jenner observe que l’exposition à la vaccine protège contre la variole.',2),
  tf('inventions-wheel-ancient','Inventions','Histoire','La roue était déjà utilisée dans l’Antiquité.','Vrai','Des représentations et des vestiges montrent l’usage de la roue en Mésopotamie au IVe millénaire avant notre ère.',1),

  // Culture française
  f('france-eiffel-tower-engineer','Culture française','Patrimoine','Quel ingénieur donne son nom à la tour construite pour l’Exposition universelle de 1889 ?','Gustave Eiffel','La tour est conçue par les équipes de l’entreprise Eiffel et devient un symbole de Paris.',1,['patrimoine']),
  f('france-national-day','Culture française','Histoire','Quelle date est célébrée comme fête nationale française ?','Le 14 juillet','La date renvoie à la prise de la Bastille en 1789 et à la fête de la Fédération célébrée en 1790.',1,['traditions']),
  f('france-french-cuisine-baguette','Culture française','Gastronomie','Quel pain long et croustillant est emblématique de la boulangerie française ?','La baguette','La baguette est fabriquée à partir d’une pâte de farine, d’eau, de levure et de sel, avec une forme allongée.',1,['gastronomie']),
  f('france-louvre-pyramid','Culture française','Patrimoine','Quel architecte a conçu la pyramide de verre de la cour du Louvre ?','Ieoh Ming Pei','La pyramide inaugurée en 1989 sert d’entrée principale au musée du Louvre.',1,['architecture']),
  f('france-french-revolution-bastille','Culture française','Histoire','Quel événement du 14 juillet 1789 est devenu un symbole de la Révolution française ?','La prise de la Bastille','La forteresse-prison est prise par les insurgés parisiens et devient un symbole de la fin de l’absolutisme.',1,['histoire']),
  f('france-moliere-comedy','Culture française','Littérature','Quel dramaturge français a écrit Le Misanthrope et Tartuffe ?','Molière','Molière utilise la comédie pour observer les mœurs et les hypocrisies de la société de son temps.',1,['théâtre']),
  f('france-tour-de-france','Culture française','Sport','Quelle épreuve cycliste française se déroule traditionnellement en plusieurs étapes ?','Le Tour de France','Créé en 1903, le Tour de France traverse des régions et reliefs variés lors d’une course par étapes.',1,['sport']),
  f('france-camembert-origin','Culture française','Gastronomie','De quelle région française le camembert est-il originaire ?','La Normandie','Le camembert est un fromage à pâte molle et croûte fleurie associé au village de Camembert.',1,['gastronomie']),
  mc('france-national-library','Culture française','Dans quelle ville se trouve le site François-Mitterrand de la Bibliothèque nationale de France ?',['Paris','Lyon','Lille','Bordeaux'],0,'Le site François-Mitterrand, reconnaissable à ses quatre tours, se trouve dans le treizième arrondissement de Paris.',1),
  tf('france-french-language-official','Culture française','Institutions','Le français est la langue officielle de la République française.','Vrai','L’article 2 de la Constitution française dispose que la langue de la République est le français.',1),

  // Europe
  f('europe-danube-river','Europe','Géographie','Quel grand fleuve européen traverse notamment Vienne, Budapest et Belgrade ?','Le Danube','Le Danube traverse ou borde de nombreux pays avant de se jeter dans la mer Noire.',1,['fleuves']),
  f('europe-alps-continent','Europe','Géographie','Sur quel continent se trouve la plus grande partie des Alpes ?','En Europe','Les Alpes s’étendent dans plusieurs pays européens, de la France à la Slovénie.',1,['montagnes']),
  f('europe-renaissance-humanism','Europe','Histoire','Quel courant intellectuel de la Renaissance place l’étude de l’être humain et des textes antiques au centre ?','L’humanisme','Les humanistes redécouvrent les auteurs antiques et valorisent l’éducation, la philologie et l’esprit critique.',2,['histoire']),
  f('europe-euro-currency','Europe','Économie','Quelle monnaie commune est utilisée par plusieurs États de l’Union européenne ?','L’euro','L’euro est introduit sous forme scripturale en 1999 puis sous forme de billets et pièces en 2002.',1,['union européenne']),
  f('europe-schengen-principle','Europe','Institutions','Quel est le principe central de l’espace Schengen ?','La suppression de nombreux contrôles aux frontières intérieures entre pays participants','Les contrôles peuvent toutefois être réintroduits temporairement dans des circonstances prévues par les règles.',2,['union européenne']),
  f('europe-northern-lights','Europe','Nature','Comment appelle-t-on les aurores visibles dans le ciel des régions arctiques ?','Les aurores boréales','Elles résultent de l’interaction de particules solaires avec la haute atmosphère terrestre.',1,['phénomènes']),
  f('europe-mediterranean-sea','Europe','Géographie','Quelle mer borde le sud de nombreux pays européens ?','La mer Méditerranée','Elle relie l’Europe, l’Afrique et l’Asie et communique avec l’Atlantique par Gibraltar.',1,['mers']),
  f('europe-renaissance-printing','Europe','Histoire','Quel progrès technique accélère la diffusion des idées en Europe au XVe siècle ?','L’imprimerie à caractères mobiles','La multiplication des livres imprimés favorise la circulation des textes, des savoirs et des débats.',1,['histoire']),
  mc('europe-capital-portugal','Europe','Quelle est la capitale du Portugal ?',['Porto','Lisbonne','Coimbra','Faro'],1,'Lisbonne est la capitale portugaise, installée sur l’estuaire du Tage.',1),
  tf('europe-norway-eu-member','Europe','Institutions','La Norvège est membre de l’Union européenne.','Faux','La Norvège participe à l’espace économique européen et à Schengen, mais n’est pas membre de l’Union européenne.',2),

  // Monde
  f('world-largest-continent','Monde','Géographie','Quel est le plus grand continent par sa superficie ?','L’Asie','L’Asie couvre environ un tiers des terres émergées et rassemble une grande diversité de peuples et de milieux.',1,['continents']),
  f('world-sahara-continent','Monde','Géographie','Sur quel continent se trouve le Sahara ?','En Afrique','Le Sahara traverse une large partie de l’Afrique du Nord, du littoral atlantique à la mer Rouge.',1,['déserts']),
  f('world-amazon-rainforest','Monde','Environnement','Dans quel bassin se trouve la majeure partie de la forêt amazonienne ?','Dans le bassin de l’Amazone','La forêt amazonienne s’étend sur plusieurs pays d’Amérique du Sud, principalement le Brésil.',1,['forêts']),
  f('world-great-wall-china','Monde','Patrimoine','Dans quel pays se trouve la Grande Muraille ?','En Chine','La Grande Muraille est un ensemble de fortifications construit et remanié sur de nombreuses périodes.',1,['patrimoine']),
  f('world-taj-mahal','Monde','Patrimoine','Dans quel pays se trouve le Taj Mahal ?','En Inde','Le Taj Mahal est un mausolée de marbre construit à Agra par l’empereur moghol Shah Jahan.',1,['patrimoine']),
  f('world-pacific-ring-fire','Monde','Géologie','Comment appelle-t-on la zone volcanique et sismique qui entoure une grande partie du Pacifique ?','La ceinture de feu du Pacifique','Elle correspond à des limites de plaques tectoniques très actives et concentre de nombreux volcans.',1,['géologie']),
  f('world-antarctica-ice','Monde','Environnement','Quel continent est presque entièrement recouvert de glace ?','L’Antarctique','La calotte glaciaire antarctique contient la majorité de l’eau douce gelée de la planète.',1,['continents']),
  f('world-silk-road-cultures','Monde','Histoire','Quel type d’échanges la route de la soie a-t-elle favorisé en plus du commerce ?','Des échanges culturels, religieux et techniques','Les voyageurs et marchands ont contribué à diffuser des idées, des inventions, des langues et des croyances.',2,['histoire']),
  mc('world-nile-continent','Monde','Sur quel continent coule le Nil ?',['Afrique','Asie','Europe','Amérique du Sud'],0,'Le Nil traverse l’Afrique de l’Est et du Nord avant de se jeter dans la Méditerranée.',1),
  tf('world-equator-crosses-oceans','Monde','Géographie','L’équateur traverse uniquement des terres émergées.','Faux','L’équateur traverse aussi l’océan Atlantique, l’océan Indien et l’océan Pacifique.',1),
];

const CORE_BATCH: VerifiedContentBatch = {
  id: 'core-editorial',
  questions: BASE_QUESTIONS,
  source: 'Contrôle éditorial Flashmemory — Wikipédia comme piste de vérification',
  sourceUrl: 'https://fr.wikipedia.org/',
  license: 'CC BY-SA 4.0',
  checkedAt: CONTENT_CHECKED_AT,
  method: 'editorial-review-with-source-pointer',
  status: 'approved',
};

// Add independently reviewed modules here as they are created. Each module
// should export a `VerifiedContentBatch` and keep its own source manifest.
export const QUESTIONS: Question[] = aggregateVerifiedBatches([CORE_BATCH, VERIFIED_PERIODIC_TABLE_BATCH, verifiedGeographyBatch, VERIFIED_ASTRONOMY_SOLAR_SYSTEM_BATCH, VERIFIED_BIOLOGY_OPENSTAX_BATCH, VERIFIED_UN_MEMBERSHIP_BATCH, VERIFIED_TECHNOLOGY_BATCH, VERIFIED_PHYSICS_OPENSTAX_BATCH, VERIFIED_CHEMISTRY_OPENSTAX_BATCH, VERIFIED_ECONOMICS_OPENSTAX_BATCH, VERIFIED_PSYCHOLOGY_OPENSTAX_BATCH, VERIFIED_SOCIOLOGY_OPENSTAX_BATCH, VERIFIED_HISTORY_OPENSTAX_BATCH, VERIFIED_MATHEMATICS_OPENSTAX_BATCH, VERIFIED_STATISTICS_OPENSTAX_BATCH, VERIFIED_ANATOMY_OPENSTAX_BATCH, VERIFIED_EARTH_SCIENCE_USGS_BATCH, VERIFIED_MUSIC_APPRECIATION_BATCH, VERIFIED_ART_HISTORY_MYERS_BATCH, VERIFIED_LITERATURE_LIBRETEXTS_BATCH, VERIFIED_PHILOSOPHY_LIBRETEXTS_BATCH, VERIFIED_PHYSICAL_GEOGRAPHY_USGS_NOAA_BATCH, VERIFIED_NATURE_NOAA_BATCH, VERIFIED_COMPUTER_SCIENCE_W3C_BATCH, VERIFIED_LINGUISTICS_OPEN_TEXTBOOK_BATCH, VERIFIED_ASTRONOMY_STARS_COSMOLOGY_BATCH, VERIFIED_MICROBIOLOGY_OPENSTAX_BATCH, VERIFIED_WCAG_W3C_BATCH, VERIFIED_UNESCO_WORLD_HERITAGE_BATCH, VERIFIED_NOBEL_PRIZE_BATCH, VERIFIED_SPORT_IOC_BATCH]);
export const CATEGORIES = [...new Set(QUESTIONS.map(q => q.category))];
