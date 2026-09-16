import type { Question } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Nobel Prize facts checked against the official Nobel Prize website.  Each
 * card keeps the relevant prize or laureate page so the claim can be read in
 * its original institutional context.
 */
const CHECKED_AT = '2026-09-16';
const SOURCE = 'Nobel Prize — site officiel';
const LICENSE = 'Lien institutionnel — consulter les conditions du site';
const METHOD = 'manual editorial check against the cited official Nobel Prize page; one independent fact per card';

type Row = readonly [
  id: string,
  category: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  url: string,
];

const BASE_URL = 'https://www.nobelprize.org';
const prize = (discipline: string, year: number) => `${BASE_URL}/prizes/${discipline}/${year}/summary/`;
const laureate = (discipline: string, year: number, slug: string) => `${BASE_URL}/prizes/${discipline}/${year}/${slug}/facts/`;

const ROWS: readonly Row[] = [
  ['first-nobel-prizes', 'Histoire', 'Prix Nobel', 'En quelle année les premiers prix Nobel ont-ils été remis ?', '1901', 'Les premiers prix ont été attribués en 1901, quelques années après la mort d’Alfred Nobel.', 1, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['nobel-prize-categories', 'Histoire', 'Prix Nobel', 'Combien de catégories figurent dans le testament d’Alfred Nobel ?', 'Cinq', 'Le testament prévoit la physique, la chimie, la physiologie ou médecine, la littérature et la paix. Le prix d’économie a été créé plus tard.', 2, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['economics-prize-created', 'Économie', 'Prix Nobel', 'En quelle année le prix de la Banque de Suède en sciences économiques a-t-il été créé ?', '1968', 'Cette distinction a été créée par la Banque de Suède à l’occasion de son tricentenaire et remise pour la première fois en 1969.', 2, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['nobel-peace-prize-oslo', 'Histoire', 'Prix Nobel', 'Dans quelle ville le prix Nobel de la paix est-il remis ?', 'Oslo', 'Les autres prix Nobel sont remis à Stockholm, tandis que le prix de la paix est remis à Oslo, en Norvège.', 1, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['alfred-nobel-dynamite', 'Histoire', 'Alfred Nobel', 'Quelle invention d’Alfred Nobel a contribué à sa fortune ?', 'La dynamite', 'Alfred Nobel a breveté la dynamite en 1867 ; ses inventions et ses entreprises ont financé la fondation des prix.', 1, `${BASE_URL}/alfred-nobel/alfred-nobel/`],
  ['nobel-physics-medal', 'Sciences', 'Prix Nobel', 'Quel objet accompagne traditionnellement le diplôme et la dotation d’un prix Nobel ?', 'Une médaille', 'Les lauréats reçoivent une médaille, un diplôme et une somme d’argent dont le montant peut évoluer.', 1, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['curie-physics-1903', 'Sciences', 'Physique', 'Pourquoi Marie Curie a-t-elle reçu le prix Nobel de physique en 1903 ?', 'Pour ses recherches sur les phénomènes de radiation', 'Le prix de physique 1903 a récompensé les recherches sur les phénomènes de radiation menées par Henri Becquerel et Pierre et Marie Curie.', 2, laureate('physics', 1903, 'marie-curie')],
  ['curie-chemistry-1911', 'Sciences', 'Chimie', 'Pour quelle découverte Marie Curie a-t-elle reçu le prix Nobel de chimie en 1911 ?', 'Le radium et le polonium, ainsi que l’étude du radium', 'Le prix distingue la découverte du radium et du polonium, l’isolement du radium et l’étude de sa nature et de ses composés.', 2, laureate('chemistry', 1911, 'marie-curie')],
  ['einstein-photoelectric-effect', 'Sciences', 'Physique', 'Quel phénomène a valu à Albert Einstein le prix Nobel de physique 1921 ?', 'L’effet photoélectrique', 'Le comité a récompensé sa découverte de la loi de l’effet photoélectrique, plutôt que la relativité.', 1, laureate('physics', 1921, 'albert-einstein')],
  ['bohr-atomic-structure', 'Sciences', 'Physique', 'Pour quoi Niels Bohr a-t-il reçu le prix Nobel de physique 1922 ?', 'Ses recherches sur la structure des atomes et le rayonnement qui en émane', 'Bohr a développé une description quantifiée de la structure atomique qui a marqué la physique moderne.', 2, laureate('physics', 1922, 'niels-bohr')],
  ['rutherford-chemistry-1908', 'Sciences', 'Chimie', 'Quel domaine Ernest Rutherford a-t-il étudié pour son prix Nobel de chimie 1908 ?', 'La désintégration des éléments et la chimie des substances radioactives', 'Son prix a reconnu ses recherches sur la désintégration des éléments et la chimie des substances radioactives.', 2, laureate('chemistry', 1908, 'ernest-rutherford')],
  ['fleming-penicillin', 'Sciences', 'Médecine', 'Quelle découverte a été récompensée par le prix Nobel de physiologie ou médecine 1945 de Fleming ?', 'La pénicilline et son effet curatif dans les maladies infectieuses', 'Alexander Fleming partage le prix 1945 avec Ernst Chain et Howard Florey pour la découverte de la pénicilline et de son effet thérapeutique.', 1, laureate('medicine', 1945, 'alexander-fleming')],
  ['hodgkin-biomolecules', 'Sciences', 'Chimie', 'Quelle méthode Dorothy Crowfoot Hodgkin a-t-elle utilisée pour déterminer la structure de molécules biochimiques ?', 'La diffraction des rayons X', 'Ses travaux de cristallographie aux rayons X ont permis de déterminer la structure de substances biochimiques importantes.', 2, laureate('chemistry', 1964, 'dorothy-crowfoot-hodgkin')],
  ['feynman-quantum-electrodynamics', 'Sciences', 'Physique', 'Quelle théorie Richard Feynman a-t-il contribué à développer, récompensée en 1965 ?', 'L’électrodynamique quantique', 'Le prix 1965 a récompensé les travaux fondamentaux sur l’électrodynamique quantique et ses conséquences pour la physique des particules.', 3, laureate('physics', 1965, 'richard-p-feynman')],
  ['watson-crick-wilkins-dna', 'Sciences', 'Médecine', 'Quelle structure a été récompensée par le prix Nobel de physiologie ou médecine 1962 ?', 'La structure moléculaire des acides nucléiques et son importance pour le transfert de l’information', 'Le prix a été attribué à Francis Crick, James Watson et Maurice Wilkins pour leurs découvertes concernant la structure de l’ADN.', 2, prize('medicine', 1962)],
  ['tagore-literature-1913', 'Littérature', 'Prix Nobel', 'Pourquoi Rabindranath Tagore a-t-il reçu le prix Nobel de littérature en 1913 ?', 'Pour sa poésie profondément sensible et belle', 'Le comité a salué sa poésie, exprimée dans ses propres mots anglais, comme une œuvre d’une grande sensibilité et d’une grande beauté.', 2, laureate('literature', 1913, 'rabindranath-tagore')],
  ['garcia-marquez-literature', 'Littérature', 'Prix Nobel', 'Quel écrivain a reçu le prix Nobel de littérature 1982 pour ses romans et nouvelles mêlant fantastique et réel ?', 'Gabriel García Márquez', 'Le comité a distingué ses romans et nouvelles où le fantastique et le réel se combinent dans un univers imaginaire riche.', 1, laureate('literature', 1982, 'gabriel-garcia-marquez')],
  ['toni-morrison-literature', 'Littérature', 'Prix Nobel', 'Quelle écrivaine américaine a reçu le prix Nobel de littérature en 1993 ?', 'Toni Morrison', 'Le comité a récompensé une œuvre caractérisée par une force visionnaire et une portée poétique, donnant vie à un aspect essentiel de la réalité américaine.', 1, laureate('literature', 1993, 'toni-morrison')],
  ['wole-soyinka-literature', 'Littérature', 'Prix Nobel', 'Quel auteur nigérian fut le premier écrivain africain à recevoir le prix Nobel de littérature ?', 'Wole Soyinka', 'Soyinka a reçu le prix en 1986 pour une œuvre dramatique qui met en scène la complexité de l’existence humaine.', 2, laureate('literature', 1986, 'wole-soyinka')],
  ['maathai-peace-2004', 'Institutions', 'Prix Nobel', 'Quel mouvement Wangari Maathai a-t-elle fondé, en lien avec la paix et le développement durable ?', 'Le mouvement de la ceinture verte', 'Le mouvement de la ceinture verte associe plantation d’arbres, protection de l’environnement et participation des femmes.', 2, laureate('peace', 2004, 'wangari-maathai')],
  ['malala-youngest-laureate', 'Institutions', 'Prix Nobel', 'Quel âge Malala Yousafzai avait-elle lorsqu’elle a reçu le prix Nobel de la paix ?', 'Dix-sept ans', 'Récompensée en 2014 pour son combat en faveur du droit à l’éducation, Malala est la plus jeune lauréate de l’histoire des prix Nobel.', 1, laureate('peace', 2014, 'malala-yousafzai')],
  ['mandela-de-klerk-peace', 'Institutions', 'Prix Nobel', 'Pour quel processus Nelson Mandela et Frederik Willem de Klerk ont-ils reçu le prix Nobel de la paix 1993 ?', 'La fin pacifique de l’apartheid et la construction d’une nouvelle Afrique du Sud', 'Le prix a distingué leur travail pour mettre fin pacifiquement à l’apartheid et poser les bases d’une Afrique du Sud démocratique.', 2, prize('peace', 1993)],
  ['landmines-campaign-peace', 'Institutions', 'Prix Nobel', 'Quel objectif a valu le prix Nobel de la paix 1997 à la Campagne internationale pour l’interdiction des mines antipersonnel ?', 'L’interdiction et l’élimination des mines antipersonnel', 'La campagne a contribué à mobiliser les États et les organisations pour une interdiction internationale des mines antipersonnel.', 1, prize('peace', 1997)],
  ['world-food-programme-peace', 'Institutions', 'Prix Nobel', 'Quelle organisation a reçu le prix Nobel de la paix 2020 pour son action contre la faim ?', 'Le Programme alimentaire mondial', 'Le comité a mis en avant ses efforts pour combattre la faim, contribuer à la paix dans les zones de conflit et prévenir l’utilisation de la faim comme arme de guerre.', 1, prize('peace', 2020)],
  ['yunus-microcredit', 'Institutions', 'Prix Nobel', 'Quelle approche Muhammad Yunus et la Grameen Bank ont-ils développée, récompensée par le prix Nobel de la paix 2006 ?', 'Le microcrédit', 'Le comité a récompensé leurs efforts pour créer un développement économique et social à partir de la base, notamment par le microcrédit.', 1, prize('peace', 2006)],
  ['ostrom-common-pool-resources', 'Économie', 'Prix Nobel', 'Quel type de ressources Elinor Ostrom a-t-elle étudié dans ses travaux récompensés en 2009 ?', 'Les ressources communes', 'Ostrom a montré comment des usagers peuvent gérer durablement des ressources communes sans dépendre uniquement de l’État ou du marché.', 2, laureate('economic-sciences', 2009, 'elinor-ostrom')],
  ['amartya-sen-welfare-economics', 'Économie', 'Prix Nobel', 'Dans quel domaine Amartya Sen a-t-il apporté des contributions majeures, récompensées en 1998 ?', 'L’économie du bien-être', 'Le prix a distingué ses contributions à l’économie du bien-être, notamment à l’analyse de la pauvreté et des choix sociaux.', 2, laureate('economic-sciences', 1998, 'amartya-sen')],
  ['krugman-trade-patterns', 'Économie', 'Prix Nobel', 'Quel phénomène Paul Krugman a-t-il expliqué dans ses travaux récompensés par le prix 2008 ?', 'Les structures des échanges et la localisation de l’activité économique', 'Krugman a renouvelé l’analyse des structures des échanges et de la localisation de l’activité économique en reliant commerce et géographie.', 3, laureate('economic-sciences', 2008, 'paul-krugman')],
  ['goldin-women-labour-market', 'Économie', 'Prix Nobel', 'Qu’a étudié Claudia Goldin dans ses travaux récompensés par le prix d’économie 2023 ?', 'La participation des femmes au marché du travail', 'Goldin a mis en évidence les causes de l’évolution de la participation des femmes au marché du travail et les écarts persistants de revenus.', 2, laureate('economic-sciences', 2023, 'claudia-goldin')],
  ['nobel-physics-committee', 'Histoire', 'Organisation', 'Quelle institution attribue le prix Nobel de physique ?', 'L’Académie royale des sciences de Suède', 'L’Académie royale des sciences de Suède attribue les prix de physique, de chimie et d’économie.', 2, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['nobel-medicine-committee', 'Histoire', 'Organisation', 'Quelle institution attribue le prix Nobel de physiologie ou médecine ?', 'L’Assemblée Nobel de l’Institut Karolinska', 'L’Assemblée Nobel de l’Institut Karolinska est chargée de choisir le lauréat du prix de physiologie ou médecine.', 2, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
  ['nobel-literature-committee', 'Histoire', 'Organisation', 'Quelle institution attribue le prix Nobel de littérature ?', 'L’Académie suédoise', 'L’Académie suédoise attribue le prix Nobel de littérature.', 1, `${BASE_URL}/prizes/facts/nobel-prize-facts/`],
];

export const VERIFIED_NOBEL_PRIZE_QUESTIONS: readonly Question[] = ROWS.map(([id, category, subcategory, question, answer, explanation, difficulty, url]) => {
  const factId = `fact-nobel-prize-${id}`;
  return {
    id: `nobel-prize-${id}`,
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
    tags: ['nobel', 'prix-nobel', 'culture-generale'],
    provenance: { factId, source: SOURCE, url, license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' },
  } satisfies Question;
});

export const VERIFIED_NOBEL_PRIZE_BATCH: VerifiedContentBatch = {
  id: 'nobel-prize',
  questions: VERIFIED_NOBEL_PRIZE_QUESTIONS,
  source: SOURCE,
  sourceUrl: `${BASE_URL}/prizes/`,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_NOBEL_PRIZE_BATCH;
