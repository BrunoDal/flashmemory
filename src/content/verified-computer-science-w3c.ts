import type { Question } from '../domain/types.ts';
import type { VerifiedContentBatch } from './catalog.ts';

/**
 * Independent web-platform concepts from the W3C DOM and HTML specifications.
 *
 * This file intentionally contains one question per normative concept.  It is
 * not a wording-variant generator: every identifier names a separate concept
 * which can be checked at the cited section of the specification.
 */
const CHECKED_AT = '2026-09-15';
const DOM_SOURCE = 'W3C — DOM Standard';
const DOM_URL = 'https://www.w3.org/TR/dom/';
const HTML_SOURCE = 'W3C — HTML 5.2 Recommendation';
const HTML_URL = 'https://www.w3.org/TR/html52/';
const W3C_LICENSE = 'W3C Document License';
const METHOD = 'manual editorial check against the cited W3C normative section; one independent concept per card';

type Row = readonly [
  id: string,
  subcategory: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: 1 | 2 | 3,
  source: 'dom' | 'html',
  anchor: string,
];

const ROWS: readonly Row[] = [
  ['dom-tree', 'DOM', 'Quelle structure le DOM représente-t-il ?', 'Un arbre de nœuds', 'Le modèle DOM représente un document comme un arbre avec des relations parent-enfant.', 1, 'dom', '#concept-tree'],
  ['dom-document-node', 'Nœuds DOM', 'Quel type de nœud représente le document lui-même ?', 'Document', 'L’interface Document représente le document chargé ou créé.', 1, 'dom', '#document'],
  ['dom-element-node', 'Nœuds DOM', 'Quel type de nœud représente un élément HTML dans le DOM ?', 'Element', 'Un élément est représenté par une instance de l’interface Element.', 1, 'dom', '#interface-element'],
  ['dom-text-node', 'Nœuds DOM', 'Quelle interface représente le texte dans un nœud DOM ?', 'Text', 'Text est l’interface des données textuelles placées dans l’arbre.', 1, 'dom', '#interface-text'],
  ['dom-comment-node', 'Nœuds DOM', 'Quelle interface représente un commentaire DOM ?', 'Comment', 'Comment représente le contenu d’un commentaire dans l’arbre.', 1, 'dom', '#interface-comment'],
  ['dom-document-fragment', 'Nœuds DOM', 'À quoi sert un DocumentFragment ?', 'À contenir temporairement un sous-arbre', 'Un fragment permet de construire un sous-arbre avant de l’insérer dans un document.', 1, 'dom', '#interface-documentfragment'],
  ['dom-document-type', 'Nœuds DOM', 'Quelle interface représente une déclaration de type de document ?', 'DocumentType', 'DocumentType représente par exemple la déclaration doctype.', 2, 'dom', '#interface-documenttype'],
  ['dom-parent-node', 'Arbre DOM', 'Combien un nœud DOM peut-il avoir de parents ?', 'Au plus un', 'Dans l’arbre DOM, un nœud a zéro ou un parent, jamais plusieurs parents simultanés.', 1, 'dom', '#concept-tree-parent'],
  ['dom-child-order', 'Arbre DOM', 'Les enfants d’un nœud DOM sont-ils ordonnés ?', 'Oui', 'Les nœuds enfants occupent un ordre défini dans la liste des enfants.', 1, 'dom', '#concept-tree-child'],
  ['dom-descendant', 'Arbre DOM', 'Qu’est-ce qu’un descendant DOM ?', 'Un nœud enfant, ou l’un de ses descendants', 'La relation de descendance se propage à travers plusieurs niveaux de l’arbre.', 1, 'dom', '#concept-tree-descendant'],
  ['dom-children-elements', 'Arbre DOM', 'Que contient la collection children d’un élément ?', 'Ses enfants éléments', 'Contrairement aux enfants généraux, la collection children exclut les nœuds texte et commentaires.', 1, 'dom', '#interface-parentnode'],
  ['dom-first-child-text', 'Arbre DOM', 'firstChild peut-il être un nœud texte contenant des espaces ?', 'Oui', 'Les espaces entre éléments peuvent être conservés comme nœuds Text.', 1, 'dom', '#interface-node'],
  ['dom-first-element-child', 'Arbre DOM', 'Que renvoie firstElementChild ?', 'Le premier enfant qui est un élément', 'La propriété ignore les nœuds qui ne sont pas des éléments.', 1, 'dom', '#interface-parentnode'],
  ['dom-owner-document', 'Arbre DOM', 'Que représente ownerDocument pour un nœud ?', 'Le document auquel il appartient', 'ownerDocument renvoie le document associé au nœud, sauf cas particulier du document lui-même.', 2, 'dom', '#interface-node'],
  ['dom-is-connected', 'Arbre DOM', 'Que signifie isConnected pour un nœud ?', 'Qu’il est connecté à un document', 'La propriété indique si le nœud est relié à un arbre de document actif.', 2, 'dom', '#interface-node'],
  ['dom-append', 'Mutation DOM', 'Que fait Node.append() ?', 'Ajoute des nœuds ou du texte à la fin des enfants', 'append insère ses arguments après les enfants existants du nœud.', 1, 'dom', '#interface-parentnode'],
  ['dom-prepend', 'Mutation DOM', 'Que fait Node.prepend() ?', 'Ajoute des nœuds ou du texte au début des enfants', 'prepend insère ses arguments avant les enfants existants.', 1, 'dom', '#interface-parentnode'],
  ['dom-before', 'Mutation DOM', 'Que fait ChildNode.before() ?', 'Insère des nœuds avant le nœud courant', 'La méthode insère ses arguments comme frères précédant le nœud.', 2, 'dom', '#interface-childnode'],
  ['dom-after', 'Mutation DOM', 'Que fait ChildNode.after() ?', 'Insère des nœuds après le nœud courant', 'La méthode insère ses arguments comme frères suivant le nœud.', 2, 'dom', '#interface-childnode'],
  ['dom-replace-with', 'Mutation DOM', 'Que fait ChildNode.replaceWith() ?', 'Remplace le nœud par les arguments fournis', 'Le nœud courant est retiré et les nouveaux nœuds sont insérés à sa place.', 2, 'dom', '#interface-childnode'],
  ['dom-remove', 'Mutation DOM', 'Que fait ChildNode.remove() ?', 'Retire le nœud de son parent', 'remove détache le nœud lorsqu’il possède un parent.', 1, 'dom', '#interface-childnode'],
  ['dom-clone-shallow', 'Mutation DOM', 'Que cloneNode(false) copie-t-il ?', 'Le nœud sans ses descendants', 'Avec false, le clone est superficiel et n’inclut pas les enfants.', 2, 'dom', '#dom-node-clonenode'],
  ['dom-clone-deep', 'Mutation DOM', 'Que cloneNode(true) copie-t-il ?', 'Le nœud et son sous-arbre', 'Avec true, le clone inclut récursivement les descendants.', 2, 'dom', '#dom-node-clonenode'],
  ['dom-normalize', 'Mutation DOM', 'Quel est l’effet de normalize() sur un sous-arbre ?', 'Il fusionne les nœuds texte adjacents et retire les textes vides', 'La normalisation rétablit une représentation textuelle canonique du sous-arbre.', 2, 'dom', '#dom-node-normalize'],
  ['dom-contains', 'Relations DOM', 'Que teste Node.contains() ?', 'Si un nœud est un descendant d’un autre, lui-même compris', 'La méthode renvoie vrai lorsque le nœud donné est inclus dans le sous-arbre.', 1, 'dom', '#dom-node-contains'],
  ['dom-position', 'Relations DOM', 'Que fournit compareDocumentPosition() ?', 'La relation d’ordre et de connexion entre deux nœuds', 'Le masque de bits décrit notamment précédent, suivant, ancêtre ou absence de connexion.', 3, 'dom', '#dom-node-comparedocumentposition'],
  ['dom-text-content', 'Données DOM', 'Que représente textContent d’un élément ?', 'Le texte de ses descendants', 'textContent concatène les données textuelles du sous-arbre de l’élément.', 1, 'dom', '#dom-node-textcontent'],
  ['dom-node-value', 'Données DOM', 'nodeValue est-il défini de la même façon pour tous les nœuds ?', 'Non', 'Sa valeur dépend du type de nœud ; elle est notamment utile pour Text et Comment.', 2, 'dom', '#dom-node-nodevalue'],
  ['dom-node-type', 'Données DOM', 'Que fournit nodeType ?', 'Un code numérique du type de nœud', 'nodeType permet d’identifier le type DOM, comme Element ou Text.', 1, 'dom', '#dom-node-nodetype'],
  ['dom-create-element', 'Création DOM', 'Que crée Document.createElement() ?', 'Un nouvel élément du nom demandé', 'La méthode crée un élément appartenant au document appelant.', 1, 'dom', '#dom-document-createelement'],
  ['dom-create-text', 'Création DOM', 'Que crée Document.createTextNode() ?', 'Un nœud texte', 'La chaîne fournie devient la donnée d’un nouveau nœud Text.', 1, 'dom', '#dom-document-createtextnode'],
  ['dom-create-comment', 'Création DOM', 'Que crée Document.createComment() ?', 'Un nœud commentaire', 'La chaîne fournie devient la donnée d’un nouveau nœud Comment.', 1, 'dom', '#dom-document-createcomment'],
  ['dom-create-fragment', 'Création DOM', 'Que crée Document.createDocumentFragment() ?', 'Un fragment de document vide', 'Le fragment est un conteneur léger destiné à recevoir des nœuds avant insertion.', 1, 'dom', '#dom-document-createdocumentfragment'],
  ['dom-get-element-id', 'Sélection DOM', 'Que renvoie getElementById() ?', 'L’élément dont l’identifiant correspond', 'La méthode recherche l’élément portant la valeur d’identifiant demandée.', 1, 'dom', '#dom-document-getelementbyid'],
  ['dom-query-selector', 'Sélection DOM', 'Que renvoie querySelector() ?', 'Le premier élément correspondant au sélecteur', 'La méthode applique un sélecteur CSS et renvoie le premier résultat ou null.', 1, 'dom', '#dom-parentnode-queryselector'],
  ['dom-query-selector-all', 'Sélection DOM', 'Que renvoie querySelectorAll() ?', 'Une NodeList statique des éléments correspondants', 'La liste retournée représente les correspondances au moment de l’appel.', 2, 'dom', '#dom-parentnode-queryselectorall'],
  ['dom-closest', 'Sélection DOM', 'Que recherche closest() ?', 'Le plus proche ancêtre correspondant au sélecteur, éventuellement soi-même', 'La recherche remonte depuis l’élément courant vers ses ancêtres.', 2, 'dom', '#dom-element-closest'],
  ['dom-matches', 'Sélection DOM', 'Que teste matches() ?', 'Si un élément correspond à un sélecteur CSS', 'La méthode renvoie un booléen pour la correspondance du sélecteur.', 1, 'dom', '#dom-element-matches'],
  ['dom-class-list', 'Attributs DOM', 'Que représente classList ?', 'Les classes d’un élément sous forme de token list', 'La liste permet d’ajouter, supprimer ou tester des classes séparément.', 1, 'dom', '#dom-element-classlist'],
  ['dom-attributes', 'Attributs DOM', 'Que représente attributes sur un élément ?', 'La collection de ses attributs', 'La collection contient les attributs présents sur l’élément.', 1, 'dom', '#interface-element'],
  ['dom-get-attribute', 'Attributs DOM', 'Que renvoie getAttribute() si l’attribut manque ?', 'null', 'La méthode renvoie null lorsqu’aucun attribut de ce nom n’est présent.', 1, 'dom', '#dom-element-getattribute'],
  ['dom-set-attribute', 'Attributs DOM', 'Que fait setAttribute() ?', 'Crée ou modifie un attribut', 'La valeur est convertie en chaîne et associée au nom d’attribut.', 1, 'dom', '#dom-element-setattribute'],
  ['dom-remove-attribute', 'Attributs DOM', 'Que fait removeAttribute() ?', 'Supprime un attribut', 'Après l’appel, l’élément ne porte plus cet attribut.', 1, 'dom', '#dom-element-removeattribute'],
  ['dom-toggle-attribute', 'Attributs DOM', 'Que fait toggleAttribute() ?', 'Ajoute ou retire un attribut selon sa présence', 'La méthode inverse par défaut la présence de l’attribut.', 2, 'dom', '#dom-element-toggleattribute'],
  ['dom-event-target', 'Événements DOM', 'Que désigne event.target ?', 'La cible vers laquelle l’événement a été envoyé', 'target est le nœud cible de la distribution de l’événement.', 1, 'dom', '#dom-event-target'],
  ['dom-event-current-target', 'Événements DOM', 'Que désigne event.currentTarget ?', 'L’objet dont le gestionnaire est en cours d’exécution', 'currentTarget peut différer de target pendant la propagation.', 2, 'dom', '#dom-event-currenttarget'],
  ['dom-event-bubbles', 'Événements DOM', 'Que signifie qu’un événement bubbles ?', 'Qu’il peut remonter vers ses ancêtres', 'Un événement bouillonnant est redistribué de la cible vers la racine.', 1, 'dom', '#dom-event-bubbles'],
  ['dom-event-cancelable', 'Événements DOM', 'Que signifie qu’un événement est cancelable ?', 'Que son action par défaut peut être annulée', 'preventDefault peut agir lorsque l’événement est annulable.', 1, 'dom', '#dom-event-cancelable'],
  ['dom-prevent-default', 'Événements DOM', 'Que fait preventDefault() ?', 'Empêche l’action par défaut si elle est annulable', 'La méthode ne stoppe pas à elle seule la propagation de l’événement.', 1, 'dom', '#dom-event-preventdefault'],
  ['dom-stop-propagation', 'Événements DOM', 'Que fait stopPropagation() ?', 'Empêche la poursuite de la propagation', 'La méthode ne supprime pas nécessairement les autres gestionnaires sur la même cible.', 2, 'dom', '#dom-event-stoppropagation'],
  ['dom-add-listener', 'Événements DOM', 'Que fait addEventListener() ?', 'Enregistre un gestionnaire d’événement', 'Le gestionnaire sera appelé lorsque le type d’événement est distribué selon les options.', 1, 'dom', '#dom-eventtarget-addeventlistener'],
  ['dom-remove-listener', 'Événements DOM', 'Quelle condition est nécessaire pour removeEventListener() ?', 'Réutiliser la même fonction et le même type', 'Le gestionnaire doit être identifiable pour être retiré.', 2, 'dom', '#dom-eventtarget-removeeventlistener'],
  ['dom-capture-phase', 'Événements DOM', 'Quand un gestionnaire capture est-il invoqué ?', 'Pendant la phase de capture avant la cible', 'La propagation traverse les ancêtres vers la cible avant la phase de bouillonnement.', 2, 'dom', '#dom-event-capture'],
  ['dom-listener-once', 'Événements DOM', 'Que fait l’option once d’un écouteur ?', 'Elle le retire après sa première invocation', 'L’écouteur ne reste pas enregistré après son premier appel.', 1, 'dom', '#dom-eventtarget-addeventlistener'],
  ['dom-listener-passive', 'Événements DOM', 'Que promet l’option passive d’un écouteur ?', 'Que le gestionnaire n’appellera pas preventDefault', 'Cette option permet à l’agent utilisateur d’optimiser certaines interactions.', 2, 'dom', '#dom-eventtarget-addeventlistener'],
  ['dom-dispatch-return', 'Événements DOM', 'Que renvoie dispatchEvent() si un événement annulable a été empêché ?', 'false', 'La valeur false indique qu’un preventDefault a été effectué pendant la distribution.', 2, 'dom', '#dom-eventtarget-dispatchevent'],
  ['dom-custom-event-detail', 'Événements DOM', 'Quelle propriété transporte les données d’un CustomEvent ?', 'detail', 'CustomEvent expose la donnée personnalisée dans sa propriété detail.', 1, 'dom', '#interface-customevent'],
  ['dom-abort-signal', 'Événements DOM', 'Quel mécanisme peut retirer automatiquement un écouteur ?', 'Un AbortSignal', 'Un signal fourni dans les options permet d’annuler l’enregistrement via son contrôleur.', 3, 'dom', '#dom-eventtarget-addeventlistener'],
  ['html-doctype', 'Structure HTML', 'À quoi sert le doctype HTML ?', 'À déclarer le type de document HTML', 'Le doctype est une déclaration placée au début du document.', 1, 'html', '#the-doctype'],
  ['html-root', 'Structure HTML', 'Quel est l’élément racine d’un document HTML ?', 'html', 'L’élément html contient notamment head et body.', 1, 'html', '#the-html-element'],
  ['html-head', 'Structure HTML', 'Quel est le rôle de l’élément head ?', 'Contenir les métadonnées du document', 'head regroupe les informations destinées au document plutôt que son contenu principal.', 1, 'html', '#the-head-element'],
  ['html-body', 'Structure HTML', 'Quel est le rôle de l’élément body ?', 'Contenir le contenu du document', 'body contient le contenu représenté dans la page.', 1, 'html', '#the-body-element'],
  ['html-lang', 'Métadonnées HTML', 'Que décrit l’attribut lang ?', 'La langue du contenu d’un élément', 'La langue aide notamment les outils d’assistance et le traitement du texte.', 1, 'html', '#the-lang-and-xml:lang-attributes'],
  ['html-title', 'Métadonnées HTML', 'Quel est le rôle de title ?', 'Donner le titre du document', 'Le titre sert notamment à identifier le document dans l’interface utilisateur.', 1, 'html', '#the-title-element'],
  ['html-meta-charset', 'Métadonnées HTML', 'À quoi sert meta charset ?', 'À déclarer l’encodage des caractères', 'La déclaration indique l’encodage utilisé pour interpréter le document.', 1, 'html', '#the-meta-element'],
  ['html-link-stylesheet', 'Ressources HTML', 'Comment link rel="stylesheet" est-il utilisé ?', 'Pour lier une feuille de style', 'La relation stylesheet associe une ressource de style au document.', 1, 'html', '#link-type-stylesheet'],
  ['html-script', 'Scripts HTML', 'Quel élément HTML intègre ou référence un script ?', 'script', 'script représente du code exécutable ou une ressource de script.', 1, 'html', '#the-script-element'],
  ['html-script-async', 'Scripts HTML', 'Que demande l’attribut async d’un script classique ?', 'Télécharger le script sans bloquer le parsing puis l’exécuter dès qu’il est prêt', 'L’exécution async peut intervenir avant la fin du parsing et ne préserve pas l’ordre entre scripts.', 2, 'html', '#attr-script-async'],
  ['html-script-defer', 'Scripts HTML', 'Que demande l’attribut defer d’un script classique externe ?', 'Différer son exécution jusqu’après le parsing', 'Les scripts defer s’exécutent après l’analyse du document et dans leur ordre.', 2, 'html', '#attr-script-defer'],
  ['html-heading', 'Sémantique HTML', 'Que représentent les éléments h1 à h6 ?', 'Des titres de niveaux différents', 'Ces éléments structurent les rubriques selon six niveaux de titre.', 1, 'html', '#the-h1-h2-h3-h4-h5-and-h6-elements'],
  ['html-paragraph', 'Sémantique HTML', 'Que représente l’élément p ?', 'Un paragraphe', 'p représente un paragraphe de contenu.', 1, 'html', '#the-p-element'],
  ['html-anchor-href', 'Liens HTML', 'Quel attribut donne la destination d’un lien a ?', 'href', 'href contient l’URL ou la référence vers laquelle le lien pointe.', 1, 'html', '#the-a-element'],
  ['html-img-alt', 'Images HTML', 'Quel est le rôle de l’attribut alt d’une image ?', 'Fournir un équivalent textuel', 'Le texte alternatif sert lorsque l’image ne peut pas être perçue ou chargée.', 1, 'html', '#alt'],
  ['html-figure', 'Sémantique HTML', 'Quel élément regroupe une figure et sa légende éventuelle ?', 'figure', 'figure représente un contenu autonome, pouvant être accompagné de figcaption.', 1, 'html', '#the-figure-element'],
  ['html-figcaption', 'Sémantique HTML', 'Quel élément fournit la légende d’une figure ?', 'figcaption', 'figcaption représente la légende ou l’explication associée à figure.', 1, 'html', '#the-figcaption-element'],
  ['html-ul', 'Listes HTML', 'Que représente ul ?', 'Une liste non ordonnée', 'ul représente une liste dont l’ordre des items n’est pas significatif.', 1, 'html', '#the-ul-element'],
  ['html-ol', 'Listes HTML', 'Que représente ol ?', 'Une liste ordonnée', 'ol représente une liste dans laquelle l’ordre des items est significatif.', 1, 'html', '#the-ol-element'],
  ['html-li', 'Listes HTML', 'Quel élément représente un item de liste ?', 'li', 'li représente un élément d’une liste ul, ol ou menu.', 1, 'html', '#the-li-element'],
  ['html-dl', 'Listes HTML', 'Que représente dl ?', 'Une liste de descriptions', 'dl associe des termes à leurs descriptions ou définitions.', 2, 'html', '#the-dl-element'],
  ['html-dt', 'Listes HTML', 'Quel élément porte un terme dans une liste de descriptions ?', 'dt', 'dt représente un terme ou un nom dans dl.', 1, 'html', '#the-dt-element'],
  ['html-dd', 'Listes HTML', 'Quel élément porte la description d’un terme ?', 'dd', 'dd représente la description, la définition ou la valeur associée.', 1, 'html', '#the-dd-element'],
  ['html-table', 'Tableaux HTML', 'Que représente table ?', 'Des données tabulaires', 'table représente des données organisées en lignes et colonnes.', 1, 'html', '#the-table-element'],
  ['html-caption', 'Tableaux HTML', 'Quel élément donne le titre d’un tableau ?', 'caption', 'caption représente le titre ou la légende de table.', 1, 'html', '#the-caption-element'],
  ['html-thead', 'Tableaux HTML', 'Quel est le rôle de thead ?', 'Regrouper les lignes d’en-tête d’un tableau', 'thead contient les lignes qui forment l’en-tête du tableau.', 1, 'html', '#the-thead-element'],
  ['html-tbody', 'Tableaux HTML', 'Quel est le rôle de tbody ?', 'Regrouper les lignes principales d’un tableau', 'tbody contient un groupe de lignes de données.', 1, 'html', '#the-tbody-element'],
  ['html-tfoot', 'Tableaux HTML', 'Quel est le rôle de tfoot ?', 'Regrouper les lignes de pied d’un tableau', 'tfoot contient un groupe de lignes de résumé ou de pied.', 1, 'html', '#the-tfoot-element'],
  ['html-tr', 'Tableaux HTML', 'Quel élément représente une ligne de tableau ?', 'tr', 'tr représente une ligne composée de cellules.', 1, 'html', '#the-tr-element'],
  ['html-th', 'Tableaux HTML', 'Quel élément représente une cellule d’en-tête ?', 'th', 'th représente une cellule qui sert d’en-tête à d’autres cellules.', 1, 'html', '#the-th-element'],
  ['html-td', 'Tableaux HTML', 'Quel élément représente une cellule de données ?', 'td', 'td représente une cellule de données dans une ligne.', 1, 'html', '#the-td-element'],
  ['html-scope', 'Tableaux HTML', 'Que précise l’attribut scope d’un th ?', 'Les cellules auxquelles l’en-tête s’applique', 'scope aide à relier un en-tête aux cellules de ligne, colonne ou groupe.', 2, 'html', '#attr-th-scope'],
  ['html-form', 'Formulaires HTML', 'Que représente form ?', 'Une section interactive de collecte de données', 'form regroupe des contrôles servant à soumettre des données.', 1, 'html', '#the-form-element'],
  ['html-form-action', 'Formulaires HTML', 'Que définit l’attribut action d’un formulaire ?', 'L’URL de soumission', 'action indique la destination vers laquelle les données sont envoyées.', 1, 'html', '#attr-form-action'],
  ['html-form-method', 'Formulaires HTML', 'Que définit l’attribut method d’un formulaire ?', 'La méthode HTTP de soumission', 'method choisit le mécanisme HTTP utilisé pour envoyer les données.', 1, 'html', '#attr-form-method'],
  ['html-form-get', 'Formulaires HTML', 'Où les données sont-elles placées avec une soumission GET ?', 'Dans l’URL de destination', 'Le mécanisme GET encode les données dans la destination de navigation.', 1, 'html', '#submit-mutate-action'],
  ['html-form-post', 'Formulaires HTML', 'Comment les données sont-elles envoyées avec une soumission POST ?', 'Dans le corps de la requête', 'Le mécanisme POST transmet les données dans une requête dédiée.', 1, 'html', '#submit-mutate-action'],
  ['html-label-for', 'Formulaires HTML', 'Que relie l’attribut for d’un label ?', 'Le label au contrôle dont l’identifiant correspond', 'for référence la valeur id du contrôle associé.', 1, 'html', '#the-label-element'],
  ['html-input-text', 'Contrôles HTML', 'Quel type input crée un champ texte sur une ligne ?', 'text', 'Le type text représente un contrôle de saisie textuelle simple.', 1, 'html', '#text-state-type-text'],
  ['html-input-email', 'Contrôles HTML', 'Quel type input indique une adresse électronique ?', 'email', 'Le type email représente une ou plusieurs adresses électroniques selon ses règles de validation.', 1, 'html', '#email-state-typeemail'],
  ['html-input-number', 'Contrôles HTML', 'Quel type input représente une valeur numérique ?', 'number', 'Le type number est destiné aux valeurs numériques selon les contraintes du contrôle.', 1, 'html', '#number-state-typenumber'],
  ['html-input-checkbox', 'Contrôles HTML', 'Quel type input permet une sélection indépendante ?', 'checkbox', 'Une case à cocher représente une sélection binaire indépendante des autres cases.', 1, 'html', '#checkbox-state-typecheckbox'],
  ['html-input-radio', 'Contrôles HTML', 'Quel type input sert à choisir une option dans un groupe ?', 'radio', 'Les boutons radio partageant un nom forment un groupe de choix exclusifs.', 1, 'html', '#radio-button-state-typeradio'],
  ['html-input-file', 'Contrôles HTML', 'Quel type input permet de sélectionner des fichiers ?', 'file', 'Le type file représente un contrôle de sélection d’un ou plusieurs fichiers.', 1, 'html', '#file-upload-state-typefile'],
  ['html-required', 'Validation HTML', 'Que signale l’attribut required ?', 'Qu’une valeur est obligatoire', 'Le contrôle est invalide lorsqu’il ne possède pas la valeur requise.', 1, 'html', '#attr-fe-required'],
  ['html-disabled', 'Contrôles HTML', 'Que signifie disabled pour un contrôle ?', 'Qu’il est désactivé', 'Un contrôle désactivé ne participe pas normalement aux interactions ou à la soumission.', 1, 'html', '#attr-fe-disabled'],
  ['html-readonly', 'Contrôles HTML', 'Que signifie readonly pour un champ compatible ?', 'Que sa valeur ne peut pas être modifiée par l’utilisateur', 'Un champ en lecture seule reste consultable mais n’est pas éditable.', 1, 'html', '#attr-input-readonly'],
  ['html-select', 'Contrôles HTML', 'Que représente select ?', 'Un contrôle de choix parmi des options', 'select permet de choisir une ou plusieurs options option.', 1, 'html', '#the-select-element'],
  ['html-option', 'Contrôles HTML', 'Que représente option ?', 'Une option dans un contrôle de sélection', 'option fournit un choix que select ou datalist peut présenter.', 1, 'html', '#the-option-element'],
  ['html-textarea', 'Contrôles HTML', 'Quel élément crée une zone de texte multiligne ?', 'textarea', 'textarea représente un contrôle de saisie textuelle sur plusieurs lignes.', 1, 'html', '#the-textarea-element'],
  ['html-button-submit', 'Contrôles HTML', 'Quel est le type par défaut d’un button dans un formulaire ?', 'submit', 'En l’absence de type, un button associé à un formulaire est un bouton de soumission.', 2, 'html', '#attr-button-type'],
  ['html-button-reset', 'Contrôles HTML', 'Que fait un button de type reset ?', 'Réinitialise les contrôles du formulaire', 'Le bouton reset remet les contrôles à leurs valeurs initiales.', 1, 'html', '#attr-button-type'],
  ['html-button-button', 'Contrôles HTML', 'Que signifie le type button sur un button ?', 'Un bouton sans comportement de soumission automatique', 'Ce type générique ne soumet pas le formulaire par défaut.', 1, 'html', '#attr-button-type'],
  ['html-fieldset', 'Formulaires HTML', 'Que regroupe fieldset ?', 'Des contrôles liés dans un formulaire', 'fieldset forme un groupe logique de contrôles de formulaire.', 1, 'html', '#the-fieldset-element'],
  ['html-legend', 'Formulaires HTML', 'Quel élément donne le titre d’un fieldset ?', 'legend', 'legend fournit la légende du groupe de contrôles.', 1, 'html', '#the-legend-element'],
  ['html-output', 'Formulaires HTML', 'Que représente output ?', 'Le résultat d’un calcul ou d’une action', 'output est un conteneur destiné à afficher un résultat.', 1, 'html', '#the-output-element'],
  ['html-progress', 'Sémantique HTML', 'Que représente progress ?', 'L’avancement d’une tâche', 'progress indique une progression vers une valeur maximale.', 1, 'html', '#the-progress-element'],
  ['html-header', 'Sémantique HTML', 'Que représente header ?', 'Un contenu introductif ou de navigation pour une section', 'header peut introduire une page ou une section.', 1, 'html', '#the-header-element'],
  ['html-nav', 'Sémantique HTML', 'Que représente nav ?', 'Une section de liens de navigation', 'nav contient des liens destinés à naviguer dans le document ou le site.', 1, 'html', '#the-nav-element'],
  ['html-main', 'Sémantique HTML', 'Que représente main ?', 'Le contenu principal du document ou de l’application', 'main contient le contenu dominant, unique à la page ou à la vue.', 1, 'html', '#the-main-element'],
  ['html-footer', 'Sémantique HTML', 'Que représente footer ?', 'Le pied d’une page ou d’une section', 'footer peut contenir des informations sur la section parente.', 1, 'html', '#the-footer-element'],
  ['html-aside', 'Sémantique HTML', 'Que représente aside ?', 'Un contenu indirectement lié au contenu principal', 'aside contient notamment des encadrés ou informations complémentaires.', 1, 'html', '#the-aside-element'],
  ['html-article', 'Sémantique HTML', 'Que représente article ?', 'Un contenu autonome et distribuable', 'article représente une composition complète, comme un billet ou une publication.', 1, 'html', '#the-article-element'],
  ['html-section', 'Sémantique HTML', 'Que représente section ?', 'Une section thématique générique', 'section regroupe un contenu thématique généralement doté d’un titre.', 1, 'html', '#the-section-element'],
  ['html-time-datetime', 'Sémantique HTML', 'Que fournit l’attribut datetime de time ?', 'Une valeur machine pour une date ou une durée', 'datetime permet d’associer au contenu lisible une représentation interprétable.', 2, 'html', '#the-time-element'],
];

const sourceFor = (source: Row[6]) => source === 'dom'
  ? { name: DOM_SOURCE, url: DOM_URL }
  : { name: HTML_SOURCE, url: HTML_URL };

export const VERIFIED_COMPUTER_SCIENCE_W3C_QUESTIONS: readonly Question[] = ROWS.map(([id, subcategory, question, answer, explanation, difficulty, sourceKey, anchor]) => {
  const factId = `fact-computer-science-w3c-${id}`;
  const source = sourceFor(sourceKey);
  return {
    id: `computer-science-w3c-${id}`,
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
    tags: ['informatique', 'standards-w3c', sourceKey],
    provenance: {
      factId,
      source: source.name,
      url: `${source.url}${anchor}`,
      license: W3C_LICENSE,
      checkedAt: CHECKED_AT,
      method: METHOD,
      status: 'approved',
    },
  } satisfies Question;
});

export const VERIFIED_COMPUTER_SCIENCE_W3C_BATCH: VerifiedContentBatch = {
  id: 'computer-science-w3c-dom-html',
  questions: VERIFIED_COMPUTER_SCIENCE_W3C_QUESTIONS,
  source: `${DOM_SOURCE} and ${HTML_SOURCE}`,
  sourceUrl: DOM_URL,
  license: W3C_LICENSE,
  checkedAt: CHECKED_AT,
  method: METHOD,
  status: 'approved',
};

export default VERIFIED_COMPUTER_SCIENCE_W3C_BATCH;
