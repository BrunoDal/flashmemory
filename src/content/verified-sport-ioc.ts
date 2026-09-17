import type { Question } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Olympic Movement facts checked against the International Olympic Committee's
 * official pages. Each card keeps one independently reviewable claim.
 */
const CHECKED_AT = '2026-09-17';
const SOURCE = 'Comité International Olympique — site officiel';
const LICENSE = 'Lien institutionnel — consulter les conditions du site';
const METHOD = 'manual editorial check against the cited official IOC page; one independent fact per card';

type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  url: string,
];

const IOC = 'https://olympics.com/ioc';

const ROWS: readonly Row[] = [
  ['ioc-founded-1894', 'Mouvement olympique', 'En quelle année le Comité International Olympique a-t-il été fondé ?', '1894', 'Le CIO a été fondé à Paris en 1894 pour organiser le mouvement olympique moderne.', 1, `${IOC}/organisation`],
  ['ioc-first-president-vikelas', 'Mouvement olympique', 'Qui fut le premier président du Comité International Olympique ?', 'Démétrius Vikelas', 'Le Grec Démétrius Vikelas présida le CIO de 1894 à 1896, avant Pierre de Coubertin.', 2, `${IOC}/ioc-presidents`],
  ['ioc-second-president-coubertin', 'Mouvement olympique', 'Qui succéda à Démétrius Vikelas à la présidence du CIO ?', 'Pierre de Coubertin', 'Pierre de Coubertin devint le deuxième président du CIO en 1896.', 1, `${IOC}/ioc-presidents`],
  ['ioc-headquarters-lausanne', 'Mouvement olympique', 'Dans quelle ville se trouve le siège du Comité International Olympique ?', 'Lausanne', 'Le siège du CIO est installé à Lausanne, en Suisse, ville souvent appelée capitale olympique.', 1, `${IOC}/organisation`],
  ['ioc-olympic-charter', 'Gouvernance', 'Quel texte codifie les règles fondamentales et les principes de l’olympisme ?', 'La Charte olympique', 'La Charte olympique fixe les principes, les règles et les textes d’application qui régissent le mouvement olympique.', 1, `${IOC}/olympic-charter`],
  ['ioc-values-excellence-friendship-respect', 'Valeurs', 'Quelles sont les trois valeurs fondamentales de l’olympisme ?', 'L’excellence, l’amitié et le respect', 'Ces valeurs structurent l’éducation et la pratique sportives défendues par le mouvement olympique.', 1, `${IOC}/olympic-values`],
  ['ioc-motto-citius-altius-fortius', 'Symboles', 'Que signifie la devise olympique « Citius, Altius, Fortius » ?', 'Plus vite, plus haut, plus fort', 'La devise latine invite à se dépasser dans l’effort sportif et a été adoptée par le mouvement olympique.', 1, `${IOC}/olympic-motto`],
  ['ioc-motto-together', 'Symboles', 'Quel mot complète aujourd’hui la devise olympique « Citius, Altius, Fortius » ?', 'Communiter (« ensemble »)', 'La devise est devenue « Citius, Altius, Fortius — Communiter », pour souligner la force de l’action collective.', 2, `${IOC}/olympic-motto`],
  ['ioc-flag-antwerp-1920', 'Symboles', 'Dans quelle édition les anneaux olympiques apparurent-ils pour la première fois sur le drapeau olympique ?', 'Anvers 1920', 'Le drapeau olympique fut utilisé pour la première fois aux Jeux d’Anvers en 1920.', 2, `${IOC}/olympic-flag`],
  ['ioc-flame-olympia', 'Flamme olympique', 'Où la flamme olympique est-elle traditionnellement allumée avant les Jeux ?', 'À Olympie, en Grèce', 'La cérémonie d’allumage se déroule à Olympie, sur le site associé aux Jeux antiques.', 1, `${IOC}/olympic-flame`],
  ['ioc-torch-relay-berlin-1936', 'Flamme olympique', 'Lors de quelle édition le relais de la flamme olympique a-t-il été organisé pour la première fois ?', 'Berlin 1936', 'Le premier relais de la flamme jusqu’à la ville hôte a eu lieu pour les Jeux de Berlin en 1936.', 2, `${IOC}/olympic-flame`],
  ['ioc-cauldron-opening-ceremony', 'Flamme olympique', 'À quel moment la vasque olympique est-elle généralement allumée ?', 'Lors de la cérémonie d’ouverture', 'L’allumage de la vasque marque l’ouverture symbolique des Jeux et la flamme brûle pendant la compétition.', 1, `${IOC}/olympic-flame`],
  ['ioc-anthem-samaras', 'Musique', 'Quel compositeur a écrit la musique de l’hymne olympique ?', 'Spyridon Samaras', 'La musique de l’hymne olympique a été composée par le Grec Spyridon Samaras.', 2, `${IOC}/olympic-anthem`],
  ['ioc-anthem-palamas', 'Musique', 'Qui a écrit les paroles originales de l’hymne olympique ?', 'Kostis Palamas', 'Le poète grec Kostis Palamas a écrit le texte de l’hymne olympique.', 2, `${IOC}/olympic-anthem`],
  ['ioc-athletes-oath-antwerp', 'Cérémonies', 'Dans quelle édition le serment des athlètes a-t-il été prononcé pour la première fois ?', 'Anvers 1920', 'Le serment des athlètes a été introduit aux Jeux d’Anvers en 1920.', 2, `${IOC}/olympic-oath`],
  ['ioc-first-olympic-village-paris', 'Organisation', 'Dans quelle édition un village olympique a-t-il été organisé pour la première fois ?', 'Paris 1924', 'Paris 1924 est généralement considéré comme la première édition avec un village olympique destiné à regrouper les athlètes.', 2, `${IOC}/olympic-village`],
  ['ioc-first-winter-games-chamonix', 'Jeux d’hiver', 'Où les premiers Jeux Olympiques d’hiver ont-ils été organisés ?', 'À Chamonix, en France', 'Les premiers Jeux d’hiver se sont tenus à Chamonix en 1924.', 1, `${IOC}/olympic-games`],
  ['ioc-first-youth-games-singapore', 'Jeunesse', 'Où les premiers Jeux Olympiques de la Jeunesse d’été ont-ils eu lieu ?', 'À Singapour', 'Singapour a accueilli la première édition des Jeux Olympiques de la Jeunesse d’été en 2010.', 1, `${IOC}/youth-olympic-games`],
  ['ioc-host-city-session', 'Organisation', 'Quelle instance choisit la ville hôte des Jeux Olympiques ?', 'La Session du CIO', 'La Session, assemblée des membres du CIO, élit la ville hôte selon la procédure prévue par la Charte olympique.', 2, `${IOC}/host-city-election`],
  ['ioc-olympic-truce', 'Paix', 'Quel principe appelle à suspendre les conflits autour des Jeux Olympiques ?', 'La Trêve olympique', 'La Trêve olympique est un appel à cesser les hostilités et à favoriser la paix pendant la période des Jeux.', 1, `${IOC}/olympic-truce`],
  ['ioc-games-four-year-cycle', 'Organisation', 'À quel rythme chaque édition des Jeux Olympiques est-elle organisée ?', 'Tous les quatre ans', 'Chaque édition des Jeux d’été ou d’hiver suit un cycle de quatre ans, même si les éditions d’été et d’hiver sont décalées.', 1, `${IOC}/olympic-games`],
  ['ioc-olympic-ancient-olympia', 'Histoire', 'Dans quel sanctuaire grec les Jeux Olympiques antiques étaient-ils célébrés ?', 'À Olympie', 'Les Jeux antiques étaient célébrés dans le sanctuaire d’Olympie, en l’honneur de Zeus.', 1, `${IOC}/ancient-olympic-games`],
];

export const VERIFIED_SPORT_IOC_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, url]) => {
  const factId = `fact-sport-ioc-${id}`;
  return {
    id: `sport-ioc-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Sport',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['sport', 'jeux-olympiques', 'cio'],
    provenance: { factId, source: SOURCE, url, license: LICENSE, checkedAt: CHECKED_AT, method: METHOD, status: 'approved' },
  } satisfies Question;
});

export const VERIFIED_SPORT_IOC_BATCH: VerifiedContentBatch = {
  id: 'sport-ioc',
  questions: VERIFIED_SPORT_IOC_QUESTIONS,
  source: SOURCE,
  sourceUrl: `${IOC}/olympic-games`,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_SPORT_IOC_BATCH;
