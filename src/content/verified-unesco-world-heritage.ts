import type { Question } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Distinct culture and nature facts checked against individual UNESCO World
 * Heritage Centre property pages.  A separate URL is kept on every card so
 * learners can inspect the exact property behind the claim.
 */
const CHECKED_AT = '2026-09-16';
const SOURCE = 'UNESCO — Centre du patrimoine mondial';
const LICENSE = 'CC BY-SA IGO 3.0';
const METHOD = 'manual editorial check against the cited UNESCO World Heritage Centre property page; one independent fact per card';

type Row = readonly [
  id: string,
  category: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  listId: number,
];

const ROWS: readonly Row[] = [
  ['angkor-khmer-capital', 'Histoire', 'Asie du Sud-Est', 'De quel empire Angkor fut-elle l’un des grands centres politiques et religieux ?', 'De l’Empire khmer', 'Le site d’Angkor rassemble les vestiges des capitales successives de l’Empire khmer, du IXe au XVe siècle.', 1, 668],
  ['machu-picchu-altitude', 'Géographie', 'Amérique du Sud', 'À quelle altitude environ se trouve la citadelle de Machu Picchu ?', 'Environ 2 430 mètres', 'Le sanctuaire historique de Machu Picchu est installé dans les Andes, à plus de 2 400 mètres d’altitude.', 2, 274],
  ['petra-nabataeans', 'Histoire', 'Proche-Orient', 'Quel peuple a fait de Petra sa capitale caravanière ?', 'Les Nabatéens', 'Petra fut la capitale des Nabatéens et un carrefour pour les échanges d’encens, de soie et d’épices.', 1, 326],
  ['acropolis-athena', 'Arts', 'Antiquité', 'À quelle divinité l’Acropole d’Athènes est-elle notamment consacrée ?', 'Athéna', 'Le Parthénon, monument majeur de l’Acropole, est consacré à Athéna, déesse tutélaire de la cité.', 1, 404],
  ['rome-historic-centre', 'Histoire', 'Antiquité', 'Quel vaste ensemble de monuments témoigne au cœur de Rome de plus d’un millénaire d’histoire ?', 'Le centre historique de Rome', 'Le bien UNESCO comprend notamment les grands témoignages de la Rome antique, de la Rome chrétienne et de la Rome pontificale.', 1, 91],
  ['fez-medina-foundation', 'Histoire', 'Monde arabe', 'Quelle ville marocaine est célèbre pour sa médina historique inscrite par l’UNESCO ?', 'Fès', 'La médina de Fès conserve un tissu urbain médiéval, des souks, des médersas et des fondouks.', 1, 170],
  ['timbuktu-learning', 'Histoire', 'Afrique de l’Ouest', 'Pour quelle activité intellectuelle Tombouctou fut-elle particulièrement réputée au Moyen Âge ?', 'L’enseignement et la conservation de manuscrits', 'Tombouctou fut un centre commercial et intellectuel majeur, notamment autour des mosquées de Djingareyber, Sankoré et Sidi Yahia.', 2, 119],
  ['anse-aux-meadows-vikings', 'Histoire', 'Amérique du Nord', 'Quel type de vestiges fait de L’Anse aux Meadows un site majeur de l’histoire des explorations ?', 'Un établissement nordique en Amérique du Nord', 'Le site de Terre-Neuve conserve les traces d’un établissement nordique daté autour de l’an 1000.', 1, 4],
  ['rapa-nui-moai', 'Arts', 'Océanie', 'Comment appelle-t-on les statues monumentales de l’île de Rapa Nui ?', 'Les moai', 'Les moai sont des statues de pierre qui témoignent de la créativité et de l’organisation de la société de Rapa Nui.', 1, 715],
  ['mont-saint-michel-abbey', 'Culture française', 'Patrimoine', 'Quel édifice domine le rocher du Mont-Saint-Michel ?', 'Une abbaye', 'L’abbaye bénédictine et le village fortifié forment un ensemble remarquable sur un îlot soumis aux marées.', 1, 80],
  ['kyoto-japanese-capital', 'Histoire', 'Japon', 'Pendant quelle longue période Kyoto fut-elle la capitale impériale du Japon ?', 'De 794 à 1868', 'L’ancienne Kyoto fut le centre politique et culturel du Japon pendant plus de mille ans.', 2, 688],
  ['himeji-castle-white-heron', 'Arts', 'Architecture', 'Quel surnom le château de Himeji doit-il à sa silhouette blanche ?', 'Le château du Héron blanc', 'Ses murs blanchis et ses formes élégantes lui valent le surnom de Shirasagi-jō, ou château du Héron blanc.', 1, 661],
  ['samarkand-registan', 'Histoire', 'Asie centrale', 'Quel ensemble de trois médersas est l’emblème de Samarcande ?', 'Le Régistan', 'Le Régistan est une place monumentale bordée de trois médersas, au cœur de l’ancienne Samarcande timouride.', 1, 603],
  ['bagan-temples', 'Histoire', 'Asie du Sud-Est', 'Quel type de monuments domine le paysage archéologique de Bagan ?', 'Des temples et des pagodes bouddhiques', 'La plaine de Bagan conserve un ensemble exceptionnel de temples, pagodes, monastères et peintures murales.', 1, 1588],
  ['lalibela-rock-churches', 'Arts', 'Afrique de l’Est', 'Dans quelle matière les églises médiévales de Lalibela sont-elles principalement taillées ?', 'Dans le roc', 'Les églises monolithiques de Lalibela ont été directement excavées dans la roche, selon un projet religieux et architectural ambitieux.', 1, 18],
  ['mohenjo-daro-indus', 'Histoire', 'Asie du Sud', 'À quelle grande civilisation ancienne le site de Mohenjo-daro est-il associé ?', 'À la civilisation de la vallée de l’Indus', 'Mohenjo-daro est l’un des témoignages urbains les plus importants de la civilisation de l’Indus, au IIIe millénaire avant notre ère.', 2, 138],
  ['oaxaca-monte-alban', 'Histoire', 'Mésoamérique', 'Quel ancien centre cérémoniel domine le site de Monte Albán près d’Oaxaca ?', 'Un centre zapotèque', 'Monte Albán fut un centre politique et cérémoniel majeur de la civilisation zapotèque.', 1, 415],
  ['havana-colonial-port', 'Histoire', 'Caraïbes', 'Quelle activité a contribué à l’essor historique de La Vieille Havane ?', 'Le commerce maritime', 'La Vieille Havane et ses fortifications témoignent du rôle stratégique de son port dans les échanges atlantiques.', 1, 204],
  ['valparaiso-port-hills', 'Géographie', 'Amérique du Sud', 'Quel élément géographique caractérise le paysage historique de Valparaíso ?', 'Ses collines dominant un port', 'La ville historique s’étage sur des collines autour d’une baie portuaire du Pacifique.', 1, 959],
  ['serengeti-migration', 'Nature', 'Afrique de l’Est', 'Quel phénomène naturel spectaculaire caractérise le Serengeti ?', 'La migration annuelle de grands troupeaux d’herbivores', 'La migration circulaire de gnous, de gazelles et de zèbres, suivis par leurs prédateurs, est l’un des grands spectacles naturels du monde.', 1, 156],
  ['galapagos-evolution', 'Nature', 'Évolution', 'Pourquoi les îles Galápagos sont-elles célèbres dans l’histoire des sciences ?', 'Elles ont contribué aux études de l’évolution', 'Leur isolement et leur diversité biologique ont nourri les observations qui ont marqué l’histoire de la théorie de l’évolution.', 2, 1],
  ['great-barrier-reef-coral', 'Nature', 'Océanie', 'Quel type d’écosystème domine la Grande Barrière australienne ?', 'Un vaste ensemble de récifs coralliens', 'La Grande Barrière de corail est le plus vaste ensemble corallien du monde et abrite une biodiversité marine exceptionnelle.', 1, 154],
  ['yellowstone-geysers', 'Nature', 'Amérique du Nord', 'Pour quelle particularité géothermique Yellowstone est-il mondialement connu ?', 'Ses geysers et sources chaudes', 'Yellowstone protège une forte concentration de phénomènes géothermiques, dont le geyser Old Faithful.', 1, 28],
  ['okavango-inland-delta', 'Géographie', 'Afrique australe', 'Quel phénomène géographique rend le delta de l’Okavango particulier ?', 'Il forme un delta intérieur', 'Les eaux de l’Okavango se dispersent dans les terres du Kalahari sans atteindre la mer.', 2, 1432],
  ['teide-highest-spain', 'Géographie', 'Îles Canaries', 'Quel sommet du parc national du Teide est le point culminant de l’Espagne ?', 'Le Teide', 'Le volcan Teide s’élève à 3 715 mètres sur l’île de Tenerife.', 1, 1258],
  ['virunga-mountain-gorillas', 'Nature', 'Afrique centrale', 'Quelle espèce emblématique est protégée dans le parc national des Virunga ?', 'Le gorille de montagne', 'Les Virunga abritent une grande diversité de milieux et une population importante de gorilles de montagne.', 1, 63],
  ['sumatra-rainforest-orangutan', 'Nature', 'Asie du Sud-Est', 'Quel grand singe menacé vit notamment dans les forêts tropicales de Sumatra ?', 'L’orang-outan de Sumatra', 'Les forêts tropicales du patrimoine de Sumatra constituent un habitat essentiel pour cette espèce et d’autres animaux endémiques.', 1, 1167],
  ['wadi-al-hitan-whales', 'Nature', 'Paléontologie', 'Quels fossiles remarquables sont conservés à Wadi Al-Hitan ?', 'Des fossiles de baleines anciennes', 'La Vallée des Baleines documente l’évolution des cétacés, notamment le passage d’animaux terrestres à des mammifères marins.', 2, 1186],
  ['papahanaumokuakea-cultural', 'Nature', 'Océan Pacifique', 'Quel type d’aire protégée est Papahānaumokuākea ?', 'Un vaste monument marin national', 'Cet archipel isolé associe des habitats marins et terrestres à une profonde importance culturelle pour les peuples hawaïens.', 2, 1326],
  ['saryarka-steppe-lakes', 'Nature', 'Asie centrale', 'Quels milieux Saryarka protège-t-il au Kazakhstan ?', 'Des steppes et des lacs', 'Saryarka rassemble des zones humides et des steppes qui servent d’étape à des oiseaux migrateurs.', 1, 1102],
];

export const VERIFIED_UNESCO_WORLD_HERITAGE_QUESTIONS: readonly Question[] = ROWS.map(([id, category, subcategory, question, answer, explanation, difficulty, listId]) => {
  const factId = `fact-unesco-world-heritage-${id}`;
  const url = `https://whc.unesco.org/en/list/${listId}`;
  return {
    id: `unesco-heritage-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category,
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['unesco', 'patrimoine', 'culture-generale'],
    provenance: { factId, source: SOURCE, url, license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' },
  } satisfies Question;
});

export const VERIFIED_UNESCO_WORLD_HERITAGE_BATCH: VerifiedContentBatch = {
  id: 'unesco-world-heritage',
  questions: VERIFIED_UNESCO_WORLD_HERITAGE_QUESTIONS,
  source: SOURCE,
  sourceUrl: 'https://whc.unesco.org/en/list',
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_UNESCO_WORLD_HERITAGE_BATCH;
