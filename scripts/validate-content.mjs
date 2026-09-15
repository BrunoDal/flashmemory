import { QUESTIONS } from '../src/content/questions.ts';
import { TOPICS } from '../src/domain/types.ts';

const errors = [];
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;
const ids = new Set();
const factIds = new Set();
const provenanceKeys = new Set();

const normalize = value => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr-FR')
  .replace(/\[carte \d+\]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

for (const question of QUESTIONS) {
  if (ids.has(question.id)) errors.push(`ID dupliqué: ${question.id}`);
  ids.add(question.id);
  if (question.id.startsWith('generated-')) errors.push(`${question.id}: carte générée interdite dans le catalogue`);
  if (!idPattern.test(question.id)) errors.push(`ID illisible: ${question.id}`);
  if (!question.factId || factIds.has(question.factId)) errors.push(`${question.id}: factId absent ou dupliqué`);
  factIds.add(question.factId);
  if (!question.provenance || question.provenance.factId !== question.factId) errors.push(`${question.id}: provenance.factId incohérente`);
  else {
    if (question.provenance.status !== 'approved') errors.push(`${question.id}: statut de provenance non approuvé`);
    for (const field of ['source', 'url', 'license', 'method', 'checkedAt']) if (!question.provenance[field]?.toString().trim()) errors.push(`${question.id}: provenance.${field} vide`);
    const provenanceKey = `${question.factId}|${question.provenance.url}`;
    if (provenanceKeys.has(provenanceKey)) errors.push(`${question.id}: provenance réutilisée pour plusieurs faits`);
    provenanceKeys.add(provenanceKey);
  }
  for (const field of ['question', 'answer', 'explanation', 'category']) {
    if (typeof question[field] !== 'string' || question[field].trim() === '') errors.push(`${question.id}: ${field} vide`);
  }
  if (!TOPICS.includes(question.category)) errors.push(`${question.id}: catégorie inconnue ${question.category}`);
  if (!['flashcard', 'multiple-choice', 'true-false'].includes(question.type)) errors.push(`${question.id}: type inconnu`);
  if (question.type === 'multiple-choice') {
    if (!Array.isArray(question.choices) || question.choices.length < 3) errors.push(`${question.id}: QCM sans assez de choix`);
    else {
      if (new Set(question.choices).size !== question.choices.length) errors.push(`${question.id}: choix QCM dupliqués`);
      if (!Number.isInteger(question.correctChoice) || question.correctChoice < 0 || question.correctChoice >= question.choices.length) errors.push(`${question.id}: index QCM invalide`);
      else if (question.answer !== question.choices[question.correctChoice]) errors.push(`${question.id}: réponse QCM incohérente`);
      if (question.choices.some(choice => typeof choice !== 'string' || choice.trim() === '')) errors.push(`${question.id}: choix QCM vide`);
    }
  }
  if (question.type === 'true-false' && !['Vrai', 'Faux'].includes(question.answer)) errors.push(`${question.id}: réponse vrai/faux invalide`);
}

const countsByCategory = Object.fromEntries(TOPICS.map(category => [category, QUESTIONS.filter(question => question.category === category).length]));
const countsByType = Object.fromEntries(['flashcard', 'multiple-choice', 'true-false'].map(type => [type, QUESTIONS.filter(question => question.type === type).length]));
for (const [type, count] of Object.entries(countsByType)) if (count < 20) errors.push(`Type ${type} insuffisamment représenté: ${count}`);
const trueCount = countsByType['true-false'];
const trueAnswers = QUESTIONS.filter(question => question.type === 'true-false').filter(question => question.answer === 'Vrai').length;
if (trueCount && (trueAnswers / trueCount < 0.3 || trueAnswers / trueCount > 0.7)) errors.push(`Vrai/faux déséquilibré: Vrai=${trueAnswers}, Faux=${trueCount - trueAnswers}`);
const choicePositions = Object.fromEntries([0, 1, 2, 3].map(position => [position, QUESTIONS.filter(question => question.type === 'multiple-choice' && question.correctChoice === position).length]));
for (const [position, count] of Object.entries(choicePositions)) if (count === 0) errors.push(`Position QCM jamais correcte: ${position}`);

// Detect repeated wording without making intentional seed-based recall cards fail
// the build. We report a bounded sample so this remains useful in CI logs.
const buckets = new Map();
for (const question of QUESTIONS) {
  const key = `${question.category}|${normalize(question.answer)}`;
  const bucket = buckets.get(key) ?? [];
  bucket.push(question);
  buckets.set(key, bucket);
}
const nearDuplicateSamples = [];
let nearDuplicateCount = 0;
for (const bucket of buckets.values()) {
  for (let left = 0; left < bucket.length; left += 1) {
    const a = new Set(normalize(bucket[left].question).split(' '));
    if (a.size < 5) continue;
    for (let right = left + 1; right < bucket.length; right += 1) {
      const b = new Set(normalize(bucket[right].question).split(' '));
      const union = new Set([...a, ...b]);
      const intersection = [...a].filter(token => b.has(token)).length;
      const similarity = intersection / union.size;
      if (similarity >= 0.9) {
        nearDuplicateCount += 1;
        if (nearDuplicateSamples.length < 8) nearDuplicateSamples.push(`${bucket[left].id} ~ ${bucket[right].id}`);
      }
    }
  }
}
if (nearDuplicateCount) errors.push(`Near-duplicates détectés: ${nearDuplicateCount} paire(s); échantillon: ${nearDuplicateSamples.join(', ')}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Catalogue valide : ${QUESTIONS.length} faits/questions indépendants, ${TOPICS.length} thèmes.`);
console.log(`Répartition par type : ${Object.entries(countsByType).map(([type, count]) => `${type}=${count}`).join(', ')}`);
console.log(`Répartition par thème : ${Object.entries(countsByCategory).map(([category, count]) => `${category}=${count}`).join(', ')}`);
