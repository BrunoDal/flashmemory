import type { Question, QuestionProvenance } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Introductory linguistics facts reviewed against Essentials of Linguistics,
 * 2e (eCampusOntario).  One row is one concept; no wording variants are
 * generated.  The examples are descriptive and avoid reproducing textbook
 * exercises or copyrighted passages.
 */
const CHECKED_AT = '2026-09-15';
const BOOK = 'Essentials of Linguistics, 2nd edition — eCampusOntario';
const LICENSE = 'CC BY-NC-SA 4.0 International';
const BOOK_URL = 'https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/';

const CHAPTERS = {
  phonetics: `${BOOK_URL}part/3-phonetics/`,
  phonology: `${BOOK_URL}part/4-phonology/`,
  morphology: `${BOOK_URL}part/5-morphology/`,
  syntax: `${BOOK_URL}part/6-syntax/`,
  semantics: `${BOOK_URL}part/7-semantics/`,
  pragmatics: `${BOOK_URL}part/8-pragmatics/`,
  variation: `${BOOK_URL}part/10-language-variation-and-change/`,
  acquisition: `${BOOK_URL}part/11-child-language-acquisition/`,
  psycholinguistics: `${BOOK_URL}part/13-psycholinguistics-and-neurolinguistics/`,
} as const;

type Chapter = keyof typeof CHAPTERS;
type Row = readonly [id: string, subcategory: string, question: string, answer: string, explanation: string, difficulty: 1 | 2 | 3, chapter: Chapter];

const ROWS: readonly Row[] = [
  ['phonetics-articulatory', 'Phonétique', 'Quelle branche de la phonétique étudie la production des sons par les organes de la parole ?', 'La phonétique articulatoire', 'Elle décrit les gestes et les positions qui produisent les sons de la parole.', 1, 'phonetics'],
  ['phonetics-acoustic', 'Phonétique', 'Quelle branche de la phonétique étudie les propriétés physiques du signal sonore ?', 'La phonétique acoustique', 'Elle analyse notamment la fréquence, la durée et l’intensité du signal.', 1, 'phonetics'],
  ['phonetics-auditory', 'Phonétique', 'Quelle branche de la phonétique étudie la perception des sons de la parole ?', 'La phonétique auditive', 'Elle s’intéresse à la réception et à l’interprétation des signaux par l’auditeur.', 1, 'phonetics'],
  ['phonetics-ipa', 'Phonétique', 'Que représente l’Alphabet phonétique international ?', 'Un système de symboles pour transcrire les sons des langues', 'L’API fournit une notation commune pour décrire les sons de nombreuses langues.', 1, 'phonetics'],
  ['phonetics-phone', 'Phonétique', 'Comment appelle-t-on une réalisation phonétique concrète d’un son ?', 'Un phone', 'Un phone est un événement sonore observable, indépendamment de son rôle dans une langue.', 1, 'phonetics'],
  ['phonetics-vocal-tract', 'Phonétique', 'Quel ensemble anatomique façonne le flux d’air en parole ?', 'Le conduit vocal', 'Le conduit vocal comprend notamment le pharynx, la bouche et les cavités nasales.', 1, 'phonetics'],
  ['phonetics-lungs', 'Phonétique', 'Quelle source fournit habituellement le flux d’air de la parole humaine ?', 'Les poumons', 'La plupart des sons de la parole utilisent un flux d’air égressif initié par les poumons.', 1, 'phonetics'],
  ['phonetics-larynx', 'Phonétique', 'Quel organe contient les cordes vocales ?', 'Le larynx', 'Le larynx se trouve au sommet de la trachée et abrite les plis vocaux.', 1, 'phonetics'],
  ['phonetics-voicing', 'Phonétique', 'Que décrit le trait voisé pour un son de parole ?', 'La vibration des plis vocaux', 'Un son voisé est produit avec une vibration périodique des plis vocaux.', 1, 'phonetics'],
  ['phonetics-glottis', 'Phonétique', 'Comment s’appelle l’espace entre les plis vocaux ?', 'La glotte', 'La glotte est l’ouverture située entre les plis vocaux.', 1, 'phonetics'],
  ['phonetics-bilabial', 'Phonétique', 'Quel lieu d’articulation utilise les deux lèvres ?', 'Bilabial', 'Les deux lèvres se rapprochent ou se ferment pour produire un son bilabial.', 1, 'phonetics'],
  ['phonetics-labiodental', 'Phonétique', 'Quel lieu d’articulation met en contact la lèvre inférieure et les dents supérieures ?', 'Labiodental', 'La lèvre et les dents forment ensemble le lieu d’articulation.', 1, 'phonetics'],
  ['phonetics-dental', 'Phonétique', 'Quel lieu d’articulation implique les dents ?', 'Dental', 'Un articulateur se place contre ou près des dents supérieures.', 1, 'phonetics'],
  ['phonetics-alveolar', 'Phonétique', 'Quelle zone située derrière les dents supérieures est un lieu d’articulation ?', 'La crête alvéolaire', 'La crête alvéolaire est la zone osseuse juste derrière les incisives supérieures.', 1, 'phonetics'],
  ['phonetics-palatal', 'Phonétique', 'Quel lieu d’articulation correspond à la voûte osseuse du palais ?', 'Palatal', 'La langue se rapproche du palais dur pour produire un son palatal.', 1, 'phonetics'],
  ['phonetics-velar', 'Phonétique', 'Quel lieu d’articulation correspond au voile du palais ?', 'Vélaire', 'La partie arrière de la langue se rapproche du voile du palais.', 1, 'phonetics'],
  ['phonetics-glottal', 'Phonétique', 'Quel lieu d’articulation utilise la glotte ?', 'Glottal', 'Le geste articulatoire se réalise au niveau de la glotte.', 2, 'phonetics'],
  ['phonetics-stop', 'Phonétique', 'Quel mode d’articulation bloque puis relâche complètement le flux d’air ?', 'Une occlusive', 'Une occlusive comporte une fermeture suivie d’un relâchement.', 1, 'phonetics'],
  ['phonetics-fricative', 'Phonétique', 'Quel mode d’articulation produit un bruit de friction par un passage d’air étroit ?', 'Une fricative', 'Le rétrécissement du conduit crée de la turbulence et de la friction.', 1, 'phonetics'],
  ['phonetics-affricate', 'Phonétique', 'Quel mode d’articulation combine une fermeture et une friction dans une même consonne ?', 'Une affriquée', 'Une affriquée commence comme une occlusive et se poursuit comme une fricative.', 2, 'phonetics'],
  ['phonetics-nasal', 'Phonétique', 'Quel mode d’articulation abaisse le voile du palais pour laisser passer l’air par le nez ?', 'Une nasale', 'L’abaissement du voile ouvre la voie nasale pendant l’articulation.', 1, 'phonetics'],
  ['phonetics-approximant', 'Phonétique', 'Quel mode d’articulation rapproche les articulateurs sans créer de friction importante ?', 'Une approximante', 'Le passage reste suffisamment ouvert pour éviter une friction forte.', 2, 'phonetics'],
  ['phonetics-lateral', 'Phonétique', 'Comment l’air circule-t-il dans une consonne latérale ?', 'Sur un ou deux côtés de la langue', 'La partie centrale de la langue forme une obstruction tandis que l’air passe latéralement.', 2, 'phonetics'],
  ['phonetics-vowel', 'Phonétique', 'Quelle propriété distingue généralement une voyelle d’une consonne dans l’articulation ?', 'L’absence d’obstruction majeure du flux d’air', 'Les voyelles sont produites avec un conduit vocal relativement ouvert.', 1, 'phonetics'],
  ['phonetics-height', 'Phonétique', 'Que décrit la hauteur d’une voyelle ?', 'La position verticale de la langue', 'Elle indique à quel point la langue est haute ou basse dans la bouche.', 1, 'phonetics'],
  ['phonetics-backness', 'Phonétique', 'Que décrit l’antériorité d’une voyelle ?', 'La position avant-arrière de la langue', 'Elle situe la langue vers l’avant, le centre ou l’arrière de la bouche.', 1, 'phonetics'],
  ['phonetics-roundedness', 'Phonétique', 'Quel trait décrit la forme arrondie ou non des lèvres pour une voyelle ?', 'L’arrondissement', 'L’arrondissement des lèvres est une dimension indépendante de la hauteur et de l’antériorité.', 1, 'phonetics'],
  ['phonetics-diphthong', 'Phonétique', 'Comment appelle-t-on une voyelle dont la qualité change pendant sa réalisation ?', 'Une diphtongue', 'Une diphtongue implique un mouvement articulatoire à l’intérieur d’une même syllabe.', 2, 'phonetics'],
  ['phonetics-stress', 'Phonétique', 'Quel terme désigne la proéminence relative d’une syllabe ?', 'L’accent lexical ou prosodique', 'La proéminence peut dépendre de paramètres comme la durée, l’intensité ou la hauteur.', 2, 'phonetics'],
  ['phonetics-tone', 'Phonétique', 'Dans une langue à tons, que peut distinguer la hauteur mélodique ?', 'Des mots ou des morphèmes', 'La hauteur peut avoir une fonction lexicale ou grammaticale dans une langue à tons.', 2, 'phonetics'],
  ['phonetics-intonation', 'Phonétique', 'Comment appelle-t-on les variations mélodiques qui s’étendent sur un énoncé ?', 'L’intonation', 'L’intonation contribue notamment à la structure prosodique et à l’interprétation de l’énoncé.', 2, 'phonetics'],

  ['phonology-minimal-pair', 'Phonologie', 'Qu’est-ce qu’une paire minimale ?', 'Deux mots qui ne diffèrent que par un phonème et ont des sens différents', 'Une paire minimale sert à mettre en évidence un contraste phonémique.', 1, 'phonology'],
  ['phonology-allophone', 'Phonologie', 'Comment appelle-t-on une réalisation contextuelle d’un phonème ?', 'Un allophone', 'Des allophones peuvent appartenir à la même catégorie phonémique dans une langue.', 1, 'phonology'],
  ['phonology-complementary', 'Phonologie', 'Que signifie la distribution complémentaire de deux sons ?', 'Ils apparaissent dans des contextes qui ne se recouvrent pas', 'La distribution complémentaire est un indice qu’ils peuvent être des allophones.', 2, 'phonology'],
  ['phonology-contrastive', 'Phonologie', 'Que signifie une distribution contrastive ?', 'Le remplacement d’un son peut changer le sens dans un même contexte', 'Un contraste dans un contexte comparable indique une différence phonémique.', 2, 'phonology'],
  ['phonology-syllable', 'Phonologie', 'Quelle unité phonologique organise généralement une attaque et une rime ?', 'La syllabe', 'La syllabe peut être analysée en constituants comme l’attaque et la rime.', 1, 'phonology'],
  ['phonology-onset', 'Phonologie', 'Comment appelle-t-on la partie de la syllabe située avant le noyau ?', 'L’attaque', 'L’attaque contient les segments qui précèdent le noyau syllabique.', 1, 'phonology'],
  ['phonology-rime', 'Phonologie', 'Comment appelle-t-on la partie de la syllabe qui comprend le noyau et la coda ?', 'La rime', 'La rime est composée du noyau, et éventuellement d’une coda.', 1, 'phonology'],
  ['phonology-nucleus', 'Phonologie', 'Quel constituant syllabique porte généralement le sommet de sonorité ?', 'Le noyau', 'Le noyau est le centre sonorant de la syllabe.', 1, 'phonology'],
  ['phonology-coda', 'Phonologie', 'Quelle partie de la syllabe suit le noyau ?', 'La coda', 'La coda regroupe les segments postérieurs au noyau.', 1, 'phonology'],
  ['phonology-sonority', 'Phonologie', 'Que décrit l’échelle de sonorité ?', 'Le degré relatif d’ouverture ou de résonance des sons', 'Elle ordonne les classes de sons selon leur sonorité relative.', 2, 'phonology'],
  ['phonology-assimilation', 'Phonologie', 'Quel processus rend un son plus semblable à un son voisin ?', 'L’assimilation', 'L’assimilation modifie un segment en fonction de caractéristiques d’un autre segment.', 1, 'phonology'],
  ['phonology-dissimilation', 'Phonologie', 'Quel processus rend deux sons voisins moins semblables ?', 'La dissimilation', 'La dissimilation réduit une similarité entre segments dans certains contextes.', 2, 'phonology'],
  ['phonology-epenthesis', 'Phonologie', 'Comment appelle-t-on l’insertion d’un son dans une forme phonologique ?', 'L’épenthèse', 'L’épenthèse ajoute un segment, souvent pour satisfaire des contraintes phonotactiques.', 2, 'phonology'],
  ['phonology-deletion', 'Phonologie', 'Comment appelle-t-on la suppression d’un son dans une forme phonologique ?', 'L’effacement', 'L’effacement retire un segment dans un contexte déterminé.', 1, 'phonology'],
  ['phonology-metathesis', 'Phonologie', 'Quel processus échange l’ordre de deux segments ?', 'La métathèse', 'La métathèse réorganise la succession de segments.', 2, 'phonology'],
  ['phonology-phonotactics', 'Phonologie', 'Que décrivent les contraintes phonotactiques ?', 'Les combinaisons de sons possibles dans une langue', 'Chaque langue peut restreindre les séquences et positions de ses segments.', 1, 'phonology'],
  ['phonology-neutralization', 'Phonologie', 'Que se passe-t-il lors d’une neutralisation phonologique ?', 'Un contraste disparaît dans un contexte particulier', 'Deux catégories distinctes peuvent alors avoir une même réalisation dans ce contexte.', 3, 'phonology'],
  ['phonology-rule', 'Phonologie', 'À quoi sert une règle phonologique dans une analyse ?', 'À relier une représentation abstraite à une réalisation contextuelle', 'Une règle décrit une généralisation sur les alternances sonores.', 2, 'phonology'],
  ['phonology-feature', 'Phonologie', 'Que représente un trait distinctif ?', 'Une propriété phonologique utilisée pour distinguer des segments', 'Les traits permettent de formaliser les ressemblances et les contrastes entre sons.', 2, 'phonology'],

  ['morphology-morpheme', 'Morphologie', 'Qu’est-ce qu’un morphème ?', 'La plus petite unité linguistique porteuse de sens ou de fonction grammaticale', 'Un morphème peut être lexical ou grammatical.', 1, 'morphology'],
  ['morphology-free', 'Morphologie', 'Qu’est-ce qu’un morphème libre ?', 'Un morphème qui peut constituer un mot à lui seul', 'Sa réalisation ne dépend pas obligatoirement d’un autre morphème.', 1, 'morphology'],
  ['morphology-bound', 'Morphologie', 'Qu’est-ce qu’un morphème lié ?', 'Un morphème qui ne peut pas constituer un mot autonome', 'Il doit être combiné à une autre base ou à un autre morphème.', 1, 'morphology'],
  ['morphology-root', 'Morphologie', 'Qu’est-ce qu’une racine morphologique ?', 'Le noyau lexical d’un mot', 'La racine porte une partie centrale du contenu lexical.', 1, 'morphology'],
  ['morphology-stem', 'Morphologie', 'Comment appelle-t-on la base à laquelle s’ajoute une flexion ?', 'Le thème', 'Le thème est la forme qui reçoit un morphème flexionnel.', 2, 'morphology'],
  ['morphology-affix', 'Morphologie', 'Qu’est-ce qu’un affixe ?', 'Un morphème attaché à une base', 'Les affixes comprennent notamment les préfixes et les suffixes.', 1, 'morphology'],
  ['morphology-prefix', 'Morphologie', 'Où se place un préfixe par rapport à sa base ?', 'Avant la base', 'Le préfixe précède morphologiquement la base à laquelle il est attaché.', 1, 'morphology'],
  ['morphology-suffix', 'Morphologie', 'Où se place un suffixe par rapport à sa base ?', 'Après la base', 'Le suffixe suit morphologiquement la base à laquelle il est attaché.', 1, 'morphology'],
  ['morphology-infix', 'Morphologie', 'Où se place un infixe ?', 'À l’intérieur d’une base', 'Un infixe est inséré dans la structure interne d’une base.', 2, 'morphology'],
  ['morphology-circumfix', 'Morphologie', 'Qu’est-ce qu’un circonfixe ?', 'Un affixe réalisé en deux parties autour d’une base', 'Les deux parties encadrent la base dans une seule opération morphologique.', 3, 'morphology'],
  ['morphology-derivational', 'Morphologie', 'Que fait typiquement une affixation dérivationnelle ?', 'Elle forme un nouveau lexème', 'La dérivation peut changer le sens ou la catégorie grammaticale d’une base.', 1, 'morphology'],
  ['morphology-inflectional', 'Morphologie', 'Que marque typiquement une affixation flexionnelle ?', 'Une information grammaticale d’un lexème', 'La flexion produit généralement une forme grammaticale du même lexème.', 1, 'morphology'],
  ['morphology-compound', 'Morphologie', 'Qu’est-ce qu’un mot composé ?', 'Un mot formé de plusieurs bases lexicales', 'La composition combine plusieurs éléments lexicaux en une unité.', 1, 'morphology'],
  ['morphology-clitic', 'Morphologie', 'Qu’est-ce qu’un clitique ?', 'Un élément grammatical qui s’appuie phonologiquement sur un hôte', 'Un clitique possède des propriétés intermédiaires entre mot et affixe.', 2, 'morphology'],
  ['morphology-suppletion', 'Morphologie', 'Qu’est-ce que la supplétion ?', 'Le remplacement d’une forme par une forme non apparentée dans une série morphologique', 'La relation entre les formes ne s’explique pas par une simple addition de segments.', 3, 'morphology'],
  ['morphology-allomorph', 'Morphologie', 'Comment appelle-t-on une variante de forme d’un même morphème ?', 'Un allomorphe', 'Des allomorphes peuvent être conditionnés par le contexte.', 2, 'morphology'],
  ['morphology-productivity', 'Morphologie', 'Que signifie la productivité d’un procédé morphologique ?', 'Sa capacité à s’appliquer à de nouvelles bases', 'Un procédé productif peut créer des formes nouvelles selon les règles de la langue.', 2, 'morphology'],
  ['morphology-zero', 'Morphologie', 'Qu’est-ce qu’un morphème zéro ?', 'Une fonction morphologique sans réalisation phonétique audible', 'L’absence de segment peut néanmoins correspondre à une opposition grammaticale.', 3, 'morphology'],
  ['morphology-lexeme', 'Morphologie', 'Qu’est-ce qu’un lexème ?', 'Une unité lexicale abstraite regroupant ses formes grammaticales', 'Les formes fléchies d’un même lexème partagent une identité lexicale.', 2, 'morphology'],
  ['morphology-morphological-word', 'Morphologie', 'Que construit la morphologie flexionnelle à partir d’un lexème ?', 'Des formes de mots', 'Ces formes expriment les catégories grammaticales pertinentes dans une langue.', 1, 'morphology'],

  ['syntax-constituent', 'Syntaxe', 'Qu’est-ce qu’un constituant ?', 'Un groupe de mots qui forme une unité syntaxique', 'Les constituants se comportent comme des blocs dans la structure d’une phrase.', 1, 'syntax'],
  ['syntax-phrase', 'Syntaxe', 'Comment appelle-t-on un constituant construit autour d’une tête ?', 'Un syntagme', 'La tête détermine les propriétés essentielles du syntagme.', 1, 'syntax'],
  ['syntax-head', 'Syntaxe', 'Qu’est-ce que la tête d’un syntagme ?', 'L’élément qui détermine sa catégorie et certaines propriétés', 'Les autres éléments du syntagme dépendent de la tête ou la modifient.', 1, 'syntax'],
  ['syntax-np', 'Syntaxe', 'Quelle est la tête typique d’un syntagme nominal ?', 'Un nom', 'Un syntagme nominal est organisé autour d’un nom ou d’un élément nominal.', 1, 'syntax'],
  ['syntax-vp', 'Syntaxe', 'Quelle est la tête typique d’un syntagme verbal ?', 'Un verbe', 'Le verbe organise le syntagme verbal et ses compléments éventuels.', 1, 'syntax'],
  ['syntax-adjective-phrase', 'Syntaxe', 'Quelle est la tête d’un syntagme adjectival ?', 'Un adjectif', 'Les modifieurs et compléments de l’adjectif appartiennent au syntagme adjectival.', 1, 'syntax'],
  ['syntax-preposition-phrase', 'Syntaxe', 'Quelle est la tête d’un syntagme prépositionnel ?', 'Une préposition', 'La préposition introduit généralement son complément dans ce syntagme.', 1, 'syntax'],
  ['syntax-argument', 'Syntaxe', 'Qu’est-ce qu’un argument d’un prédicat ?', 'Un élément sélectionné ou requis par le prédicat', 'Les arguments participent à la structure fondamentale du prédicat.', 2, 'syntax'],
  ['syntax-adjunct', 'Syntaxe', 'Qu’est-ce qu’un adjoint ?', 'Un élément optionnel qui modifie un constituant', 'Un adjoint n’est pas sélectionné de la même façon qu’un argument.', 2, 'syntax'],
  ['syntax-transitive', 'Syntaxe', 'Comment appelle-t-on un verbe qui prend typiquement un objet ?', 'Un verbe transitif', 'La transitivité décrit les relations syntaxiques qu’un verbe peut établir.', 1, 'syntax'],
  ['syntax-intransitive', 'Syntaxe', 'Comment appelle-t-on un verbe qui ne prend pas d’objet direct ?', 'Un verbe intransitif', 'Un verbe intransitif peut néanmoins avoir un sujet ou d’autres compléments.', 1, 'syntax'],
  ['syntax-recursion', 'Syntaxe', 'Qu’est-ce que la récursivité en syntaxe ?', 'La possibilité d’imbriquer une structure dans une structure du même type', 'La récursivité permet de construire des structures potentiellement complexes.', 2, 'syntax'],
  ['syntax-agreement', 'Syntaxe', 'Que décrit l’accord grammatical ?', 'La correspondance de traits entre éléments syntaxiques', 'Les traits concernés peuvent inclure le nombre, le genre ou la personne.', 1, 'syntax'],
  ['syntax-word-order', 'Syntaxe', 'Que décrit l’ordre des mots ?', 'La disposition linéaire des constituants dans une phrase', 'Les langues peuvent privilégier des ordres différents pour leurs constituants.', 1, 'syntax'],
  ['syntax-grammaticality', 'Syntaxe', 'Que représente un jugement de grammaticalité en linguistique ?', 'Une évaluation de la conformité d’une structure à la grammaire d’une variété', 'Il concerne une variété et un contexte donnés, pas une valeur esthétique universelle.', 2, 'syntax'],

  ['semantics-compositionality', 'Sémantique', 'Que dit le principe de compositionnalité ?', 'Le sens d’une expression dépend de ses parties et de leur combinaison', 'La composition relie le sens lexical à la structure de l’expression.', 2, 'semantics'],
  ['semantics-denotation', 'Sémantique', 'Que désigne la dénotation d’une expression ?', 'Le type d’entité ou d’objet auquel elle renvoie dans une interprétation', 'La dénotation est une composante référentielle du sens.', 2, 'semantics'],
  ['semantics-reference', 'Sémantique', 'Que fait une expression référentielle ?', 'Elle peut être utilisée pour identifier une entité dans un contexte', 'La référence dépend de l’usage et du contexte d’énonciation.', 1, 'semantics'],
  ['semantics-synonymy', 'Sémantique', 'Quelle relation relie deux expressions de sens très proche ?', 'La synonymie', 'La synonymie concerne une proximité de sens, qui peut dépendre du contexte.', 1, 'semantics'],
  ['semantics-antonymy', 'Sémantique', 'Quelle relation relie des expressions dont les sens s’opposent ?', 'L’antonymie', 'Les antonymes forment une relation sémantique d’opposition.', 1, 'semantics'],
  ['semantics-polysemy', 'Sémantique', 'Qu’est-ce que la polysémie ?', 'Le fait qu’une même forme lexicale ait plusieurs sens liés', 'Les sens polysémiques sont associés par une relation sémantique.', 1, 'semantics'],
  ['semantics-homonymy', 'Sémantique', 'Qu’est-ce que l’homonymie ?', 'La coïncidence de forme entre des unités lexicales distinctes', 'Les homonymes peuvent avoir des sens sans relation particulière.', 2, 'semantics'],
  ['semantics-hyponymy', 'Sémantique', 'Quelle relation indique qu’un terme désigne un sous-type d’un autre ?', 'L’hyponymie', 'L’hyponyme est inclus dans l’extension de son hyperonyme.', 2, 'semantics'],
  ['semantics-prototype', 'Sémantique', 'Qu’est-ce qu’un prototype dans une catégorie conceptuelle ?', 'Un membre particulièrement représentatif de la catégorie', 'Les membres d’une catégorie peuvent être plus ou moins proches du prototype.', 2, 'semantics'],
  ['semantics-entailment', 'Sémantique', 'Que signifie l’implication sémantique ?', 'La vérité d’une proposition entraîne celle d’une autre', 'L’implication est une relation entre les conditions de vérité de propositions.', 2, 'semantics'],
  ['semantics-presupposition', 'Sémantique', 'Qu’est-ce qu’une présupposition ?', 'Une information tenue pour acquise par une expression ou une construction', 'Elle peut rester pertinente même quand la phrase est niée.', 2, 'semantics'],
  ['pragmatics-context', 'Pragmatique', 'Quel rôle joue le contexte en pragmatique ?', 'Il contribue à l’interprétation d’un énoncé en situation', 'Le contexte comprend notamment les participants, le lieu et le discours environnant.', 1, 'pragmatics'],
  ['pragmatics-deixis', 'Pragmatique', 'Que désigne la deixis ?', 'Le lien entre une expression et des éléments de la situation d’énonciation', 'Les expressions déictiques s’interprètent à partir du contexte.', 2, 'pragmatics'],
  ['pragmatics-speech-act', 'Pragmatique', 'Qu’est-ce qu’un acte de langage ?', 'Une action accomplie en produisant un énoncé', 'Promettre, demander ou informer sont des exemples de fonctions d’énoncés.', 1, 'pragmatics'],

  ['variation-dialect', 'Variation', 'Qu’est-ce qu’un dialecte en linguistique descriptive ?', 'Une variété d’une langue associée à des traits linguistiques et sociaux', 'Le terme décrit une variété sans impliquer une infériorité linguistique.', 1, 'variation'],
  ['variation-register', 'Variation', 'Qu’est-ce qu’un registre ?', 'Une variété associée à une situation ou à un degré de formalité', 'Les locuteurs peuvent adapter leur registre au contexte.', 1, 'variation'],
  ['variation-idiolect', 'Variation', 'Comment appelle-t-on l’ensemble des habitudes linguistiques d’un individu ?', 'Un idiolecte', 'L’idiolecte correspond à la variété propre à un locuteur donné.', 2, 'variation'],
  ['variation-code-switching', 'Variation', 'Qu’est-ce que l’alternance codique ?', 'L’usage alterné de plusieurs langues ou variétés dans une interaction', 'L’alternance peut être structurée et liée au contexte social ou discursif.', 1, 'variation'],
  ['variation-language-change', 'Variation', 'Comment une langue change-t-elle au fil du temps ?', 'Par des changements dans ses sons, ses formes, ses structures ou ses usages', 'Le changement linguistique peut toucher plusieurs niveaux de la langue.', 1, 'variation'],
  ['variation-sound-change', 'Variation', 'Que modifie un changement phonologique ?', 'Le système ou la distribution des sons d’une langue', 'Un changement phonologique peut modifier des contrastes ou des réalisations.', 2, 'variation'],
  ['variation-language-family', 'Variation', 'Qu’est-ce qu’une famille de langues ?', 'Un groupe de langues issues d’un ancêtre commun reconstruit ou attesté', 'La classification généalogique repose sur des correspondances historiques.', 1, 'variation'],
  ['variation-cognate', 'Variation', 'Qu’est-ce qu’un mot apparenté ?', 'Un mot issu historiquement d’un ancêtre commun avec un autre mot', 'Les ressemblances de forme et de sens doivent être évaluées historiquement.', 2, 'variation'],
  ['variation-descriptive', 'Variation', 'Que fait une approche descriptive de la grammaire ?', 'Elle décrit les régularités d’une variété telle qu’elle est utilisée', 'Elle observe les faits linguistiques sans les classer comme bons ou mauvais.', 1, 'variation'],
  ['variation-prescriptive', 'Variation', 'Que fait une règle prescriptive ?', 'Elle recommande une forme considérée comme appropriée dans un contexte', 'Une prescription est une norme sociale, distincte de la description d’un système.', 2, 'variation'],

  ['acquisition-babbling', 'Acquisition', 'Quelle activité vocale précède généralement les premiers mots chez le jeune enfant ?', 'Le babillage', 'Le babillage produit des séquences vocales exploratoires avant le lexique productif.', 1, 'acquisition'],
  ['acquisition-first-word', 'Acquisition', 'Que désigne le terme « premier mot » en acquisition du langage ?', 'Une forme utilisée de manière stable avec une intention lexicale', 'L’analyse tient compte de l’usage régulier et de l’intention, pas seulement de la ressemblance sonore.', 2, 'acquisition'],
  ['acquisition-telegraphic', 'Acquisition', 'Que caractérise le langage télégraphique de certains jeunes enfants ?', 'Des énoncés courts où certains éléments grammaticaux sont omis', 'Les éléments lexicaux principaux peuvent être produits avant toute la morphosyntaxe adulte.', 1, 'acquisition'],
  ['acquisition-overregularization', 'Acquisition', 'Qu’est-ce que la surgénéralisation en acquisition morphologique ?', 'L’application d’une règle régulière à une forme irrégulière', 'Elle montre que l’enfant construit des régularités au-delà de l’imitation de formes isolées.', 2, 'acquisition'],
  ['acquisition-input', 'Acquisition', 'Quel rôle l’exposition linguistique joue-t-elle dans l’acquisition ?', 'Elle fournit les données auxquelles l’enfant est exposé', 'L’enfant développe sa grammaire à partir d’interactions et de données linguistiques.', 1, 'acquisition'],
  ['acquisition-milestone', 'Acquisition', 'Pourquoi les étapes d’acquisition ne constituent-elles pas une chronologie universelle rigide ?', 'Les trajectoires varient selon les enfants et les langues', 'Les jalons décrivent des tendances, avec des variations individuelles et linguistiques.', 2, 'acquisition'],
  ['psycholinguistics-lexicon', 'Psycholinguistique', 'Qu’est-ce que le lexique mental ?', 'Le système de connaissances lexicales d’un locuteur', 'Il comprend des informations de forme, de sens et de relations entre mots.', 1, 'psycholinguistics'],
  ['psycholinguistics-ambiguity', 'Psycholinguistique', 'Que doit faire un auditeur face à une ambiguïté linguistique ?', 'Évaluer plusieurs interprétations possibles avec le contexte', 'Le traitement du langage combine l’information linguistique et contextuelle.', 2, 'psycholinguistics'],
  ['psycholinguistics-bilingual', 'Psycholinguistique', 'Que signifie le traitement bilingue ?', 'La mobilisation de connaissances liées à deux langues', 'L’accès lexical et le contrôle peuvent dépendre de la tâche et du contexte.', 2, 'psycholinguistics'],
  ['psycholinguistics-aphasia', 'Neurolinguistique', 'Qu’est-ce que l’aphasie ?', 'Un trouble du langage consécutif à une atteinte cérébrale', 'Elle peut affecter, selon les cas, la production, la compréhension, la lecture ou l’écriture.', 1, 'psycholinguistics'],
  ['psycholinguistics-brain-language', 'Neurolinguistique', 'Que cherche à étudier la neurolinguistique ?', 'Les relations entre le langage et le système nerveux', 'Elle examine les bases cérébrales et les mécanismes du traitement linguistique.', 1, 'psycholinguistics'],
] as const;

function provenanceFor(id: string, chapter: Chapter): QuestionProvenance {
  return {
    factId: `linguistics-${id}`,
    source: BOOK,
    url: CHAPTERS[chapter],
    license: LICENSE,
    checkedAt: CHECKED_AT,
    method: 'verification-editoriale-du-concept-dans-le-chapitre-indique; formulation-originale-sans-variante-generee',
    status: 'approved',
  };
}

export const VERIFIED_LINGUISTICS_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, chapter]) => ({
  id: `verified-linguistics-${id}`,
  factId: `linguistics-${id}`,
  version: 1,
  type: 'flashcard',
  category: 'Langues',
  subcategory,
  question,
  answer,
  acceptedAnswers: [answer],
  explanation,
  difficulty,
  tags: ['linguistique', subcategory.toLowerCase()],
  source: BOOK,
  provenance: provenanceFor(id, chapter),
}));

export const VERIFIED_LINGUISTICS_OPEN_TEXTBOOK_BATCH: VerifiedContentBatch = {
  id: 'linguistics-open-textbook-2026-09',
  questions: VERIFIED_LINGUISTICS_QUESTIONS,
  source: BOOK,
  sourceUrl: BOOK_URL,
  license: LICENSE,
  checkedAt: CHECKED_AT,
  method: 'concepts-independants-revus-dans-les-chapitres-ouverts; aucune-duplication-ou-reformulation-automatique',
  status: 'approved',
};

export default VERIFIED_LINGUISTICS_OPEN_TEXTBOOK_BATCH;
