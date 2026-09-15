import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Editorially checked astronomy facts from NASA's public Solar System fact
 * sheets. Each row is one independent claim; the catalogue must not treat
 * rewordings of the same row as additional facts.
 */
const CHECKED_AT = '2026-09-15';
const NASA_SOURCE = 'NASA Science — Solar System facts';
const NASA_LICENSE = 'NASA content; NASA media usage guidelines';

type Fact = {
  slug: string;
  prompt: string;
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
};

type Body = {
  slug: string;
  name: string;
  url: string;
  facts: Fact[];
};

const BODIES: Body[] = [
  {
    slug: 'mercure', name: 'Mercure', url: 'https://science.nasa.gov/mercury/facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Mercure à partir du Soleil ?', answer: 'La première', explanation: 'Mercure est la planète la plus proche du Soleil.', difficulty: 1 },
      { slug: 'type', prompt: 'Quel type de planète est Mercure ?', answer: 'Une planète rocheuse', explanation: 'Mercure fait partie des planètes telluriques, à surface solide.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien de jours terrestres dure une année sur Mercure ?', answer: '88 jours', explanation: 'Mercure accomplit une révolution autour du Soleil en 88 jours terrestres.', difficulty: 1 },
      { slug: 'rotation', prompt: 'Combien de jours terrestres dure une rotation de Mercure sur son axe ?', answer: '59 jours', explanation: 'Une rotation sidérale de Mercure dure environ 59 jours terrestres.', difficulty: 2 },
      { slug: 'jour-solaire', prompt: 'Combien de jours terrestres dure le jour solaire de Mercure ?', answer: '176 jours', explanation: 'Un cycle complet entre deux levers de Soleil sur Mercure dure 176 jours terrestres.', difficulty: 2 },
      { slug: 'rayon', prompt: 'Quel est le rayon approximatif de Mercure ?', answer: '2 440 kilomètres', explanation: 'NASA donne à Mercure un rayon d’environ 2 440 km.', difficulty: 2 },
      { slug: 'lunes', prompt: 'Combien de lunes naturelles Mercure possède-t-elle ?', answer: 'Aucune', explanation: 'Mercure ne possède pas de satellite naturel connu.', difficulty: 1 },
      { slug: 'anneaux', prompt: 'Mercure possède-t-elle des anneaux ?', answer: 'Non', explanation: 'Mercure ne possède pas d’anneaux.', difficulty: 1 },
      { slug: 'exosphere', prompt: 'Comment s’appelle l’enveloppe gazeuse très ténue de Mercure ?', answer: 'Une exosphère', explanation: 'Mercure possède une exosphère très mince plutôt qu’une atmosphère dense.', difficulty: 2 },
    ],
  },
  {
    slug: 'venus', name: 'Vénus', url: 'https://science.nasa.gov/venus/venus-facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Vénus à partir du Soleil ?', answer: 'La deuxième', explanation: 'Vénus est la deuxième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'temperature', prompt: 'Quelle planète est la plus chaude du Système solaire ?', answer: 'Vénus', explanation: 'L’effet de serre très intense de Vénus en fait la planète la plus chaude.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien de jours terrestres dure une année sur Vénus ?', answer: '225 jours', explanation: 'Vénus boucle son orbite en environ 225 jours terrestres.', difficulty: 1 },
      { slug: 'rotation', prompt: 'Combien de jours terrestres dure une rotation de Vénus ?', answer: '243 jours', explanation: 'La rotation de Vénus est très lente et dure environ 243 jours terrestres.', difficulty: 2 },
      { slug: 'sens-rotation', prompt: 'Dans quel sens Vénus tourne-t-elle par rapport à la plupart des planètes ?', answer: 'Dans le sens rétrograde', explanation: 'Vénus tourne dans le sens opposé à celui de la plupart des planètes.', difficulty: 2 },
      { slug: 'pression', prompt: 'À combien de fois la pression terrestre équivaut-elle environ à la pression au sol de Vénus ?', answer: '93 fois', explanation: 'La pression à la surface de Vénus est environ 93 fois celle du niveau de la mer terrestre.', difficulty: 2 },
      { slug: 'rayon', prompt: 'Quel est le rayon approximatif de Vénus ?', answer: '6 052 kilomètres', explanation: 'NASA donne à Vénus un rayon d’environ 6 052 km.', difficulty: 2 },
      { slug: 'lunes', prompt: 'Combien de lunes naturelles Vénus possède-t-elle ?', answer: 'Aucune', explanation: 'Vénus ne possède pas de satellite naturel connu.', difficulty: 1 },
      { slug: 'anneaux', prompt: 'Vénus possède-t-elle des anneaux ?', answer: 'Non', explanation: 'Vénus ne possède pas d’anneaux.', difficulty: 1 },
    ],
  },
  {
    slug: 'terre', name: 'Terre', url: 'https://science.nasa.gov/earth/facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de la Terre à partir du Soleil ?', answer: 'La troisième', explanation: 'La Terre est la troisième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'jour', prompt: 'Combien d’heures dure approximativement un jour terrestre ?', answer: '23,9 heures', explanation: 'NASA indique une durée de jour terrestre d’environ 23,9 heures.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien de jours dure approximativement une année terrestre ?', answer: '365,25 jours', explanation: 'Une révolution terrestre dure environ 365,25 jours.', difficulty: 1 },
      { slug: 'distance-soleil', prompt: 'Quelle est la distance moyenne de la Terre au Soleil ?', answer: 'Environ 150 millions de kilomètres', explanation: 'NASA indique environ 150,2 millions de kilomètres.', difficulty: 2 },
      { slug: 'eau-liquide', prompt: 'Sous quelle forme l’eau couvre-t-elle une grande partie de la surface terrestre ?', answer: 'Sous forme liquide', explanation: 'La Terre est la seule planète connue avec de l’eau liquide stable en surface.', difficulty: 1 },
      { slug: 'atmosphere-principale', prompt: 'Quel gaz est majoritaire dans l’atmosphère terrestre ?', answer: 'L’azote', explanation: 'L’atmosphère terrestre est majoritairement composée d’azote.', difficulty: 1 },
      { slug: 'inclinaison', prompt: 'Quelle est l’inclinaison approximative de l’axe terrestre ?', answer: '23,4 degrés', explanation: 'L’inclinaison de l’axe terrestre est d’environ 23,4 degrés.', difficulty: 2 },
      { slug: 'vie-connue', prompt: 'Sur quelle planète la vie est-elle actuellement connue ?', answer: 'La Terre', explanation: 'La Terre est le seul monde sur lequel la vie est actuellement connue.', difficulty: 1 },
    ],
  },
  {
    slug: 'mars', name: 'Mars', url: 'https://science.nasa.gov/mars/facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Mars à partir du Soleil ?', answer: 'La quatrième', explanation: 'Mars est la quatrième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien de jours terrestres dure une année martienne ?', answer: '687 jours', explanation: 'Mars met environ 687 jours terrestres à faire le tour du Soleil.', difficulty: 1 },
      { slug: 'rotation', prompt: 'Combien d’heures dure approximativement une rotation de Mars ?', answer: '24,6 heures', explanation: 'La rotation de Mars dure environ 24,6 heures.', difficulty: 1 },
      { slug: 'lunes', prompt: 'Combien de petites lunes Mars possède-t-elle ?', answer: 'Deux', explanation: 'Les deux lunes de Mars sont Phobos et Déimos.', difficulty: 1 },
      { slug: 'rayon', prompt: 'Quel est le rayon approximatif de Mars ?', answer: '3 390 kilomètres', explanation: 'NASA donne à Mars un rayon d’environ 3 390 km.', difficulty: 2 },
      { slug: 'canyon', prompt: 'Comment s’appelle le vaste système de canyons martien ?', answer: 'Valles Marineris', explanation: 'Valles Marineris est le grand système de canyons décrit par NASA.', difficulty: 2 },
      { slug: 'atmosphere', prompt: 'Quel gaz constitue principalement l’atmosphère ténue de Mars ?', answer: 'Le dioxyde de carbone', explanation: 'L’atmosphère martienne est très mince et principalement composée de CO₂.', difficulty: 2 },
    ],
  },
  {
    slug: 'jupiter', name: 'Jupiter', url: 'https://science.nasa.gov/jupiter/jupiter-facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Jupiter à partir du Soleil ?', answer: 'La cinquième', explanation: 'Jupiter est la cinquième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'jour', prompt: 'Combien d’heures dure approximativement un jour sur Jupiter ?', answer: '9,9 heures', explanation: 'Jupiter tourne très rapidement et son jour dure environ 9,9 heures.', difficulty: 2 },
      { slug: 'annee', prompt: 'Combien d’années terrestres dure une année jovienne ?', answer: 'Environ 12 ans', explanation: 'Jupiter accomplit une révolution en environ 11,86 années terrestres.', difficulty: 1 },
      { slug: 'type', prompt: 'Quel type de planète est Jupiter ?', answer: 'Une géante gazeuse', explanation: 'Jupiter est une planète géante principalement composée d’hydrogène et d’hélium.', difficulty: 1 },
      { slug: 'tache-rouge', prompt: 'Comment s’appelle la grande tempête visible dans l’atmosphère de Jupiter ?', answer: 'La Grande Tache rouge', explanation: 'La Grande Tache rouge est une vaste tempête atmosphérique jovienne.', difficulty: 1 },
      { slug: 'lunes-galileennes', prompt: 'Combien de lunes galiléennes Jupiter possède-t-elle ?', answer: 'Quatre', explanation: 'Io, Europe, Ganymède et Callisto sont les quatre lunes galiléennes.', difficulty: 2 },
      { slug: 'anneaux', prompt: 'Jupiter possède-t-elle un système d’anneaux ?', answer: 'Oui', explanation: 'Jupiter possède un système d’anneaux ténus.', difficulty: 2 },
      { slug: 'rayon', prompt: 'Quel est le rayon équatorial approximatif de Jupiter ?', answer: '69 911 kilomètres', explanation: 'NASA donne un rayon équatorial d’environ 69 911 km.', difficulty: 3 },
    ],
  },
  {
    slug: 'saturne', name: 'Saturne', url: 'https://science.nasa.gov/saturn/facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Saturne à partir du Soleil ?', answer: 'La sixième', explanation: 'Saturne est la sixième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'type', prompt: 'Quel type de planète est Saturne ?', answer: 'Une géante gazeuse', explanation: 'Saturne est une planète géante composée principalement de gaz.', difficulty: 1 },
      { slug: 'densite', prompt: 'Quelle planète du Système solaire a une densité moyenne inférieure à celle de l’eau ?', answer: 'Saturne', explanation: 'La densité moyenne de Saturne est inférieure à celle de l’eau.', difficulty: 2 },
      { slug: 'jour', prompt: 'Combien d’heures dure approximativement un jour sur Saturne ?', answer: '10,7 heures', explanation: 'Saturne tourne rapidement sur elle-même, en environ 10,7 heures.', difficulty: 2 },
      { slug: 'annee', prompt: 'Combien d’années terrestres dure une année saturnienne ?', answer: 'Environ 29,4 ans', explanation: 'Saturne met environ 29,4 années terrestres à orbiter le Soleil.', difficulty: 2 },
      { slug: 'lune-principale', prompt: 'Quelle est la plus grande lune de Saturne ?', answer: 'Titan', explanation: 'Titan est la plus grande lune de Saturne.', difficulty: 1 },
      { slug: 'hexagone', prompt: 'Quelle forme possède le courant atmosphérique au pôle nord de Saturne ?', answer: 'Un hexagone', explanation: 'Un courant atmosphérique à six côtés entoure le pôle nord de Saturne.', difficulty: 2 },
      { slug: 'rayon', prompt: 'Quel est le rayon équatorial approximatif de Saturne ?', answer: '58 232 kilomètres', explanation: 'NASA donne un rayon équatorial d’environ 58 232 km.', difficulty: 3 },
    ],
  },
  {
    slug: 'uranus', name: 'Uranus', url: 'https://science.nasa.gov/uranus/facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position d’Uranus à partir du Soleil ?', answer: 'La septième', explanation: 'Uranus est la septième planète à partir du Soleil.', difficulty: 1 },
      { slug: 'type', prompt: 'Quel type de planète est Uranus ?', answer: 'Une géante glacée', explanation: 'Uranus est classée parmi les géantes glacées avec Neptune.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien d’années terrestres dure une année sur Uranus ?', answer: 'Environ 84 ans', explanation: 'Uranus met environ 84 années terrestres à orbiter le Soleil.', difficulty: 1 },
      { slug: 'jour', prompt: 'Combien d’heures dure approximativement un jour sur Uranus ?', answer: '17 heures', explanation: 'Une rotation d’Uranus dure environ 17 heures.', difficulty: 2 },
      { slug: 'inclinaison', prompt: 'Quelle est l’inclinaison approximative de l’axe d’Uranus ?', answer: '97,8 degrés', explanation: 'Uranus est inclinée d’environ 97,8 degrés et semble rouler sur son orbite.', difficulty: 2 },
      { slug: 'couleur', prompt: 'Quelle substance contribue à la couleur bleu-vert d’Uranus ?', answer: 'Le méthane', explanation: 'Le méthane atmosphérique absorbe une partie de la lumière rouge.', difficulty: 2 },
      { slug: 'anneaux', prompt: 'Uranus possède-t-elle des anneaux ?', answer: 'Oui', explanation: 'Uranus possède un système d’anneaux ténus.', difficulty: 1 },
      { slug: 'lunes', prompt: 'Combien de lunes connues Uranus possède-t-elle ?', answer: '28', explanation: 'La fiche NASA consultée recense 28 lunes connues pour Uranus.', difficulty: 3 },
      { slug: 'rayon', prompt: 'Quel est le rayon équatorial approximatif d’Uranus ?', answer: '25 362 kilomètres', explanation: 'NASA donne un rayon équatorial d’environ 25 362 km.', difficulty: 3 },
    ],
  },
  {
    slug: 'neptune', name: 'Neptune', url: 'https://science.nasa.gov/neptune/neptune-facts/', facts: [
      { slug: 'ordre', prompt: 'Quelle est la position de Neptune à partir du Soleil ?', answer: 'La huitième', explanation: 'Neptune est la huitième et dernière planète connue du Système solaire.', difficulty: 1 },
      { slug: 'type', prompt: 'Quel type de planète est Neptune ?', answer: 'Une géante glacée', explanation: 'Neptune est une géante glacée, comme Uranus.', difficulty: 1 },
      { slug: 'annee', prompt: 'Combien d’années terrestres dure une année neptunienne ?', answer: 'Environ 165 ans', explanation: 'Neptune met environ 164,8 années terrestres à orbiter le Soleil.', difficulty: 2 },
      { slug: 'jour', prompt: 'Combien d’heures dure approximativement un jour sur Neptune ?', answer: '16 heures', explanation: 'Neptune tourne sur elle-même en environ 16 heures.', difficulty: 2 },
      { slug: 'couleur', prompt: 'Quelle couleur domine l’apparence de Neptune ?', answer: 'Le bleu', explanation: 'Le méthane atmosphérique contribue à l’apparence bleue de Neptune.', difficulty: 1 },
      { slug: 'vents', prompt: 'À quelle vitesse maximale approximative les vents de Neptune peuvent-ils souffler ?', answer: 'Environ 2 000 kilomètres par heure', explanation: 'NASA décrit les vents neptuniens comme pouvant atteindre environ 2 000 km/h.', difficulty: 3 },
      { slug: 'lune-principale', prompt: 'Quelle est la plus grande lune de Neptune ?', answer: 'Triton', explanation: 'Triton est la plus grande lune de Neptune.', difficulty: 1 },
      { slug: 'anneaux', prompt: 'Neptune possède-t-elle des anneaux ?', answer: 'Oui', explanation: 'Neptune possède plusieurs anneaux ténus.', difficulty: 1 },
      { slug: 'rayon', prompt: 'Quel est le rayon équatorial approximatif de Neptune ?', answer: '24 622 kilomètres', explanation: 'NASA donne un rayon équatorial d’environ 24 622 km.', difficulty: 3 },
    ],
  },
  {
    slug: 'lune', name: 'la Lune', url: 'https://science.nasa.gov/moon/facts/', facts: [
      { slug: 'orbite', prompt: 'Combien de jours faut-il environ à la Lune pour orbiter la Terre ?', answer: '27,3 jours', explanation: 'La période orbitale sidérale de la Lune est d’environ 27,3 jours.', difficulty: 2 },
      { slug: 'rotation', prompt: 'Pourquoi voit-on presque toujours la même face de la Lune ?', answer: 'Parce que sa rotation est synchronisée avec son orbite', explanation: 'La Lune tourne sur elle-même en environ le même temps qu’elle orbite la Terre.', difficulty: 2 },
      { slug: 'gravite', prompt: 'Quelle est la gravité de surface de la Lune par rapport à celle de la Terre ?', answer: 'Environ un sixième', explanation: 'La gravité lunaire vaut environ un sixième de la gravité terrestre.', difficulty: 1 },
      { slug: 'atmosphere', prompt: 'La Lune possède-t-elle une atmosphère dense comme celle de la Terre ?', answer: 'Non', explanation: 'La Lune possède une exosphère très ténue, pas une atmosphère dense.', difficulty: 1 },
      { slug: 'phases', prompt: 'Quelle source éclaire la Lune pendant ses phases ?', answer: 'La lumière du Soleil', explanation: 'Les phases correspondent à la portion éclairée par le Soleil visible depuis la Terre.', difficulty: 1 },
      { slug: 'anneaux', prompt: 'La Lune possède-t-elle des anneaux ?', answer: 'Non', explanation: 'La Lune ne possède pas d’anneaux.', difficulty: 1 },
      { slug: 'eau-glace', prompt: 'Sous quelle forme de l’eau a-t-elle été détectée dans des régions lunaires très froides ?', answer: 'Sous forme de glace', explanation: 'De la glace d’eau est présente notamment dans des régions polaires durablement ombragées.', difficulty: 2 },
      { slug: 'formation', prompt: 'Quel âge approximatif a la Lune selon les estimations de NASA ?', answer: 'Environ 4,5 milliards d’années', explanation: 'La Lune s’est formée au début de l’histoire du Système solaire, il y a environ 4,5 milliards d’années.', difficulty: 2 },
    ],
  },
  {
    slug: 'soleil', name: 'le Soleil', url: 'https://science.nasa.gov/sun/facts/', facts: [
      { slug: 'position', prompt: 'Où se trouve le Soleil dans le Système solaire ?', answer: 'Au centre', explanation: 'Les planètes et les autres corps du Système solaire orbitent autour du Soleil.', difficulty: 1 },
      { slug: 'masse', prompt: 'Quelle fraction approximative de la masse du Système solaire se trouve dans le Soleil ?', answer: 'Environ 99,8 %', explanation: 'Le Soleil concentre environ 99,8 % de la masse du Système solaire.', difficulty: 2 },
      { slug: 'lumiere', prompt: 'Combien de temps la lumière du Soleil met-elle environ pour atteindre la Terre ?', answer: '8 minutes 20 secondes', explanation: 'La lumière solaire met environ 8,3 minutes à parcourir la distance Soleil-Terre.', difficulty: 2 },
      { slug: 'energie', prompt: 'Quelle réaction produit l’énergie du cœur du Soleil ?', answer: 'La fusion nucléaire de l’hydrogène', explanation: 'Le Soleil produit son énergie par fusion nucléaire dans son cœur.', difficulty: 2 },
      { slug: 'surface-temperature', prompt: 'Quelle est la température approximative de la surface visible du Soleil ?', answer: 'Environ 5 500 °C', explanation: 'La photosphère solaire est à environ 5 500 °C.', difficulty: 2 },
      { slug: 'age', prompt: 'Quel âge approximatif a le Soleil ?', answer: 'Environ 4,6 milliards d’années', explanation: 'Le Soleil s’est formé il y a environ 4,6 milliards d’années.', difficulty: 1 },
      { slug: 'diametre', prompt: 'Quel est le diamètre approximatif du Soleil ?', answer: 'Environ 1,4 million de kilomètres', explanation: 'Le diamètre solaire est d’environ 1,4 million de kilomètres.', difficulty: 2 },
      { slug: 'rotation-equateur', prompt: 'Combien de jours met approximativement l’équateur solaire à tourner ?', answer: 'Environ 25 jours', explanation: 'Le Soleil étant gazeux, sa rotation différentielle est d’environ 25 jours à l’équateur.', difficulty: 3 },
    ],
  },
];

const provenanceFor = (body: Body, factId: string): QuestionProvenance => ({
  factId,
  source: NASA_SOURCE,
  url: body.url,
  license: NASA_LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual-check-against-the-NASA-body-fact-sheet',
  status: 'approved',
});

export const VERIFIED_ASTRONOMY_QUESTIONS: Question[] = BODIES.flatMap(body => body.facts.map((fact, index) => {
  const ordinal = String(index + 1).padStart(2, '0');
  const factId = `fact-astronomy-${body.slug}-${fact.slug}`;
  return {
    id: `astronomy-nasa-${body.slug}-${ordinal}-${fact.slug}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Astronomie',
    subcategory: 'Système solaire',
    question: fact.prompt,
    answer: fact.answer,
    acceptedAnswers: [fact.answer],
    explanation: fact.explanation,
    difficulty: fact.difficulty,
    tags: ['astronomie', 'système solaire', body.name.toLowerCase()],
    provenance: provenanceFor(body, factId),
  } satisfies Question;
}));

export const VERIFIED_ASTRONOMY_SOLAR_SYSTEM_BATCH: VerifiedContentBatch = {
  id: 'nasa-solar-system-facts',
  questions: VERIFIED_ASTRONOMY_QUESTIONS,
  source: NASA_SOURCE,
  sourceUrl: 'https://science.nasa.gov/solar-system/',
  license: NASA_LICENSE,
  checkedAt: CHECKED_AT,
  method: 'manual-check-of-independent-claims-against-body-specific-NASA-fact-sheets',
  status: 'approved',
};
