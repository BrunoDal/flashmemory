import type { Question } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Accessibility concepts checked against the normative WCAG 2.2
 * Recommendation.  The cards deliberately cover different success criteria
 * rather than repeating the same contrast or keyboard fact.
 */
const CHECKED_AT = '2026-09-16';
const SOURCE = 'W3C — Web Content Accessibility Guidelines (WCAG) 2.2';
const URL = 'https://www.w3.org/TR/WCAG22/';
const LICENSE = 'W3C Document License';
const METHOD = 'manual editorial check against the cited WCAG 2.2 normative criterion or definition; one independent concept per card';

type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  anchor: string,
];

const ROWS: readonly Row[] = [
  ['wcag-acronym', 'Fondamentaux', 'Que signifie l’acronyme WCAG ?', 'Web Content Accessibility Guidelines', 'WCAG désigne les recommandations du W3C pour rendre les contenus web plus accessibles.', 1, '#intro'],
  ['wcag-principles-count', 'Fondamentaux', 'Combien de principes organisent WCAG ?', 'Quatre', 'Les quatre principes sont perceptible, utilisable, compréhensible et robuste.', 1, '#understanding-the-four-principles-of-accessibility'],
  ['wcag-perceivable', 'Principes', 'Que signifie le principe « perceptible » dans WCAG ?', 'L’information et les composants doivent pouvoir être présentés aux utilisateurs sous des formes qu’ils peuvent percevoir', 'Le contenu ne doit pas dépendre d’un seul canal sensoriel.', 2, '#perceivable'],
  ['wcag-operable', 'Principes', 'Que signifie le principe « utilisable » dans WCAG ?', 'Les composants d’interface et la navigation doivent pouvoir être utilisés', 'Le principe couvre notamment l’accès au clavier, le temps disponible et la navigation.', 2, '#operable'],
  ['wcag-understandable', 'Principes', 'Que signifie le principe « compréhensible » dans WCAG ?', 'Les informations et l’utilisation de l’interface doivent être compréhensibles', 'Le contenu doit rester lisible et le comportement de l’interface prévisible.', 2, '#understandable'],
  ['wcag-robust', 'Principes', 'Que signifie le principe « robuste » dans WCAG ?', 'Le contenu doit pouvoir être interprété de manière fiable par différents agents utilisateurs', 'La compatibilité avec les technologies d’assistance fait partie de ce principe.', 2, '#robust'],
  ['wcag-level-aa', 'Conformité', 'Quel niveau WCAG correspond au niveau généralement visé pour une conformité renforcée ?', 'Le niveau AA', 'Un site conforme au niveau AA satisfait les critères de niveau A et de niveau AA.', 1, '#conformance-levels'],
  ['wcag-text-alternatives', 'Perceptible', 'Que demande le critère 1.1.1 pour les contenus non textuels ?', 'Une alternative textuelle équivalente, sauf exceptions prévues', 'L’alternative transmet la fonction ou l’information portée par le contenu non textuel.', 1, '#non-text-content'],
  ['wcag-info-relationships', 'Structure', 'Que demande le critère 1.3.1 concernant les informations et relations ?', 'Qu’elles soient déterminables par programme ou disponibles dans le texte', 'La structure visuelle ne doit pas être le seul moyen de communiquer une relation.', 2, '#info-and-relationships'],
  ['wcag-meaningful-sequence', 'Structure', 'Que demande le critère 1.3.2 sur une séquence significative ?', 'Que l’ordre de lecture programmatique conserve le sens du contenu', 'Un lecteur d’écran ou un autre agent doit rencontrer les éléments dans un ordre cohérent.', 2, '#meaningful-sequence'],
  ['wcag-sensory-characteristics', 'Structure', 'Que limite le critère 1.3.3 sur les caractéristiques sensorielles ?', 'Les instructions ne doivent pas dépendre uniquement d’une forme, d’une taille, d’une position ou d’un son', 'Une instruction comme « cliquez sur le bouton rond à droite » doit être complétée par un repère textuel.', 2, '#sensory-characteristics'],
  ['wcag-use-of-color', 'Couleur', 'Que demande le critère 1.4.1 concernant la couleur ?', 'Que la couleur ne soit pas le seul moyen visuel de transmettre une information', 'Un état ou une erreur doit aussi être indiqué par du texte, une forme ou un autre indice.', 1, '#use-of-color'],
  ['wcag-contrast-minimum', 'Contraste', 'Quel ratio minimal WCAG AA est demandé pour le texte courant ?', '4,5:1', 'Le critère 1.4.3 demande au moins 4,5:1 pour le texte normal ; le grand texte bénéficie d’un seuil plus bas.', 1, '#contrast-minimum'],
  ['wcag-large-text-contrast', 'Contraste', 'Quel ratio minimal est demandé pour du grand texte au niveau AA ?', '3:1', 'Le grand texte est soumis à un seuil de contraste de 3:1 selon le critère 1.4.3.', 1, '#contrast-minimum'],
  ['wcag-resize-text', 'Responsive', 'Jusqu’à quel agrandissement le texte doit-il rester utilisable sans perte de contenu ou de fonctionnalité ?', '200 %', 'Le critère 1.4.4 demande que le texte puisse être agrandi jusqu’à 200 %, sauf exceptions limitées.', 1, '#resize-text'],
  ['wcag-reflow', 'Responsive', 'Quelle largeur CSS est utilisée comme référence de reflow au niveau AA ?', '320 pixels CSS', 'Le critère 1.4.10 vise une présentation sans défilement bidimensionnel pour une largeur équivalente à 320 pixels CSS, avec exceptions.', 2, '#reflow'],
  ['wcag-non-text-contrast', 'Contraste', 'Quel ratio minimal est demandé au niveau AA pour les composants d’interface et les objets graphiques nécessaires ?', '3:1', 'Le critère 1.4.11 vise notamment les états des contrôles et les éléments graphiques indispensables.', 2, '#non-text-contrast'],
  ['wcag-keyboard', 'Clavier', 'Que demande le critère 2.1.1 concernant le clavier ?', 'Toutes les fonctionnalités doivent être utilisables au clavier', 'Une action ne doit pas exiger un dispositif de pointage particulier, sauf exception liée à la trajectoire du geste.', 1, '#keyboard'],
  ['wcag-no-keyboard-trap', 'Clavier', 'Que demande le critère 2.1.2 sur le piège au clavier ?', 'Le focus clavier doit pouvoir sortir de chaque composant', 'Si une sortie standard ne suffit pas, l’utilisateur doit être informé de la méthode pour déplacer le focus.', 2, '#no-keyboard-trap'],
  ['wcag-timing-adjustable', 'Temps', 'Que demande le critère 2.2.1 pour une limite de temps ?', 'L’utilisateur doit pouvoir la désactiver, l’ajuster ou la prolonger, sauf exceptions', 'Le critère protège les personnes qui ont besoin de plus de temps pour lire ou agir.', 2, '#timing-adjustable'],
  ['wcag-bypass-blocks', 'Navigation', 'Que demande le critère 2.4.1 « éviter les blocs » ?', 'Un mécanisme pour contourner les blocs de contenu répétés', 'Un lien d’accès direct ou une structure équivalente permet d’atteindre rapidement le contenu principal.', 1, '#bypass-blocks'],
  ['wcag-focus-order', 'Navigation', 'Que demande le critère 2.4.3 sur l’ordre du focus ?', 'Un ordre de focus qui préserve le sens et l’utilisabilité', 'Le déplacement au clavier doit suivre une séquence logique dans l’interface.', 1, '#focus-order'],
  ['wcag-link-purpose', 'Navigation', 'Que demande le critère 2.4.4 sur la finalité des liens ?', 'Que la finalité de chaque lien soit déterminable à partir de son texte ou de son contexte', 'Un lien « En savoir plus » doit avoir un contexte suffisamment clair.', 1, '#link-purpose-in-context'],
  ['wcag-focus-visible', 'Focus', 'Que demande le critère 2.4.7 sur le focus visible ?', 'Que tout élément d’interface recevant le focus clavier ait un indicateur visible', 'Supprimer l’outline sans fournir un indicateur équivalent rend la navigation clavier difficile.', 1, '#focus-visible'],
  ['wcag-label-in-name', 'Commandes', 'Que demande le critère 2.5.3 « étiquette dans le nom » ?', 'Le nom accessible doit contenir le texte visible de l’étiquette', 'Cette correspondance aide les utilisateurs de commande vocale à cibler le contrôle qu’ils voient.', 2, '#label-in-name'],
  ['wcag-target-size', 'Commandes', 'Quelle taille minimale le critère 2.5.8 recommande-t-il au niveau AA pour une cible pointer ?', '24 × 24 pixels CSS', 'La cible doit mesurer au moins 24 par 24 pixels CSS, avec les exceptions prévues par le critère.', 2, '#target-size-minimum'],
  ['wcag-page-language', 'Lisibilité', 'Que demande le critère 3.1.1 sur la langue d’une page ?', 'Que la langue humaine par défaut soit déterminable par programme', 'L’attribut lang de l’élément html est le mécanisme habituel pour l’indiquer.', 1, '#language-of-page'],
  ['wcag-on-focus', 'Prévisibilité', 'Que demande le critère 3.2.1 lorsqu’un composant reçoit le focus ?', 'Qu’il ne provoque pas automatiquement un changement de contexte', 'Recevoir le focus ne doit pas, à lui seul, ouvrir une page ou soumettre un formulaire.', 2, '#on-focus'],
  ['wcag-error-identification', 'Formulaires', 'Que demande le critère 3.3.1 lorsqu’une erreur de saisie est détectée ?', 'Identifier l’élément en erreur et décrire l’erreur en texte', 'L’utilisateur doit savoir quel champ corriger et pourquoi sa valeur est refusée.', 1, '#error-identification'],
  ['wcag-labels-instructions', 'Formulaires', 'Que demande le critère 3.3.2 pour les champs nécessitant une saisie ?', 'Des étiquettes ou des instructions lorsque c’est nécessaire', 'Le nom, le format attendu et les contraintes utiles doivent être communiqués avant la saisie.', 1, '#labels-or-instructions'],
  ['wcag-name-role-value', 'Compatibilité', 'Que demande le critère 4.1.2 sur les composants d’interface ?', 'Un nom et un rôle déterminables par programme, ainsi que des états, propriétés et valeurs accessibles', 'Les technologies d’assistance doivent pouvoir identifier et suivre l’état du composant.', 2, '#name-role-value'],
  ['wcag-status-messages', 'Compatibilité', 'Que demande le critère 4.1.3 pour les messages d’état ?', 'Que les changements de statut soient présentés aux technologies d’assistance sans déplacer le focus', 'Un message comme « réponse enregistrée » doit pouvoir être annoncé sans interrompre l’action en cours.', 2, '#status-messages'],
];

export const VERIFIED_WCAG_W3C_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, anchor]) => {
  const factId = `fact-wcag-w3c-${id}`;
  return {
    id: `wcag-w3c-${id}`,
    factId,
    version: 1,
    type: 'flashcard',
    category: 'Informatique',
    subcategory,
    question,
    answer,
    acceptedAnswers: [answer],
    explanation,
    difficulty,
    tags: ['accessibilite', 'wcag', 'w3c'],
    provenance: {
      factId,
      source: SOURCE,
      url: `${URL}${anchor}`,
      license: LICENSE,
      checkedAt: CHECKED_AT,
      method: METHOD,
      status: 'approved',
    },
  } satisfies Question;
});

export const VERIFIED_WCAG_W3C_BATCH: VerifiedContentBatch = {
  id: 'wcag-w3c-22',
  questions: VERIFIED_WCAG_W3C_QUESTIONS,
  source: SOURCE,
  sourceUrl: URL,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_WCAG_W3C_BATCH;
