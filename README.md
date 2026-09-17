# Flashmemory

Flashmemory est une PWA de culture générale fondée sur le rappel actif et la répétition espacée. Son catalogue contient actuellement **3312 faits/questions éditoriaux** répartis dans les 28 thèmes de l’application, avec des flashcards, QCM et vrais/faux. Chaque carte possède un `factId` stable et une provenance structurée (source, URL, licence, date et méthode de contrôle), visible après la réponse ou dans l’explorateur. L’interface distingue les sources approuvées des pistes éditoriales de contrôle des cartes historiques. Le catalogue, les profils et la progression restent sur l’appareil : la session quotidienne fonctionne hors ligne.

Le service worker précache le shell, met en cache à l’exécution les assets statiques de même origine et utilise une stratégie réseau-avec-repli-cache uniquement pour les navigations. Les anciennes caches sont supprimées à l’activation d’une nouvelle version. Une mise à jour détectée est proposée avec le bouton **Recharger** afin de ne pas interrompre une session ; l’activation n’efface jamais IndexedDB.

## Développement

```bash
npm install
npm run dev
```

Commandes de qualité :

```bash
npm test                 # tests unitaires du domaine
npm run validate-content # QA du catalogue : champs, IDs, QCM, équilibre et quasi-doublons
npm run typecheck
npm run lint
npm run build
```

La validation du catalogue charge les 3218 fiches avec le runtime TypeScript
Node, vérifie les réponses de QCM, les réponses vrai/faux, les IDs, les
`factId`, la provenance approuvée et les positions correctes. Elle échoue sur
les doublons d’identité, les formulations quasi identiques ou une provenance
incomplète. Aucun volume artificiel n’est compté : une extension doit apporter
un nouveau fait, une source vérifiable et une fiche éditoriale distincte.

Limite actuelle : 286 fiches héritées indiquent encore une piste de contrôle. Une première tranche de 32 fiches héritées pointe désormais vers une source institutionnelle directe (NASA, NIST, CERN, W3C, OpenStax, NOAA, UNESCO, Louvre, Élysée, Légifrance, UE, BCE, ONU ou OMS). Les lots complémentaires de 118 éléments chimiques (index NIST), 171 relations pays-capitale (Wikidata), 83 faits astronomiques (fiches NASA, après retrait d’un recouvrement), 90 faits de biologie (OpenStax Biology 2e), 99 dates d’admission à l’ONU (répertoire ONU, avec disclaimer de vérification manuelle), 101 faits de standards web/réseau (RFC IETF et Unicode, avec sections citées), 99 faits de physique (OpenStax College Physics 2e, CC BY 4.0), 96 faits de chimie (OpenStax Chemistry 2e, CC BY 4.0), 90 faits d’économie (OpenStax Principles of Economics 3e, CC BY-NC-SA 4.0, après retrait de quatre recouvrements), 93 faits de psychologie (OpenStax Psychology 2e, CC BY 4.0, sans conseil clinique, après retrait de deux recouvrements), 89 faits de sociologie (OpenStax Introduction to Sociology 3e, CC BY 4.0, après retrait d’un recouvrement), 99 faits d’histoire (OpenStax World History, CC BY-NC-SA 4.0, après retrait d’un recouvrement), 120 faits de mathématiques (OpenStax Algebra and Trigonometry 2e, CC BY 4.0), 101 faits de statistiques (OpenStax Introductory Statistics 2e, CC BY 4.0, intégrés au thème Mathématiques après retrait de huit recouvrements), 93 faits d’anatomie-physiologie (OpenStax Anatomy and Physiology 2e, CC BY 4.0, intégrés à Biologie après retrait de quatorze recouvrements, sans conseil clinique), 125 faits de sciences de la Terre (USGS, domaine public, intégrés à Sciences après retrait d’un recouvrement et sans affirmation climatique ou politique temporelle), 113 faits d’appréciation musicale (OpenStax-CNX, CC BY 4.0, après revue sans recouvrement avec Musique/Arts), 91 faits d’histoire de l’art (Humanities LibreTexts, CC BY-NC-SA 4.0, après retrait de deux recouvrements avec Histoire) et 90 faits de littérature (Introduction to Literature de Lumen, Humanities LibreTexts, domaine public indiqué dans les métadonnées, sans recouvrement avec Littérature/Langues/Arts) sont vérifiés séparément. Les nouveaux lots doivent être ajoutés comme modules sourcés et validés, sans compter de simples variantes de formulation.
Les fiches restantes ne fournissent qu’un contrôle éditorial et une URL de
recherche Wikipédia, pas encore une citation externe ligne par ligne. Cette
provenance est volontairement transparente ; elle ne
constitue pas une garantie automatique de vérité. La prochaine étape de contenu
doit remplacer ces pointeurs par des URL d’articles ou de bases précises et
conserver la date et la méthode de vérification.

Le lot de 105 faits de philosophie provenant d’Introduction to Philosophy
(OpenStax, Humanities LibreTexts) est déclaré CC BY 4.0 ; les métadonnées de la
page source indiquent explicitement `license:ccby` et `licenseversion:40`.

Le lot WCAG 2.2 ajoute 32 notions distinctes d’accessibilité web, contrôlées contre la recommandation normative du W3C avec un lien direct vers chaque critère. Il couvre notamment contraste, reflow mobile, clavier, focus, formulaires et technologies d’assistance.

Le lot UNESCO ajoute 30 cartes distinctes sur des sites du patrimoine mondial culturel et naturel, avec une page UNESCO directe par carte. Il couvre notamment Angkor, Machu Picchu, Petra, Fès, Tombouctou, Rapa Nui, le Serengeti, les Galápagos, Yellowstone et le delta de l’Okavango.

Le lot Nobel Prize ajoute 32 cartes distinctes sur l’histoire des prix, leurs institutions, les sciences, la littérature, la paix et l’économie. Chaque carte pointe vers une page officielle du prix ou du lauréat concerné.

Le lot de géographie physique ajoute 117 faits stables issus de pages officielles
USGS, NOAA, NASA Earth Observatory et USDA ; ces agences fédérales publient ces
ressources sous le régime de réutilisation publique applicable, avec les URLs
directes conservées dans chaque provenance. Trois recouvrements (tsunami, delta,
salinité) ont été retirés avant intégration.

Le lot Nature NOAA ajoute 117 faits stables sur les écosystèmes marins, coraux,
estuaires, marées et courants. Les URLs sont des ressources directes du NOAA,
couvertes par le statut d’œuvre du gouvernement américain ; dix recouvrements
avec le catalogue existant ont été retirés, ainsi que toute affirmation variable
de conservation ou de dénombrement.

Le lot Informatique W3C ajoute 123 concepts distincts du DOM et HTML, avec des
URLs d’ancrage directes vers les spécifications W3C et la licence documentaire
W3C ; aucun recouvrement avec les fiches HTTP, URI, DNS, IPv6, TLS ou Unicode
existantes n’a été retenu.

Le lot Langues eCampusOntario ajoute 120 concepts de linguistique issus de
*Essentials of Linguistics*, sous licence CC BY-NC-SA 4.0 International et avec
des URLs de chapitres Pressbooks directes. Le doublon du phonème avec le corpus
Langues existant a été retiré.

Le lot Astronomie NASA ajoute 129 faits stables sur les étoiles, galaxies et la
cosmologie. Les sources sont des pages NASA Science directes, avec les directives
d’utilisation NASA ; trois recouvrements (Voie lactée, type de galaxie et trou
noir) ont été retirés, sans affirmation spéculative ou temporelle.

Le lot Microbiologie OpenStax ajoute 228 faits fondamentaux sous licence
CC BY-NC-SA 4.0, avec des URLs directes vers les chapitres OpenStax. Douze
recouvrements avec Biologie/Anatomie/Nature ont été retirés ; aucune fiche ne
fournit de conseil clinique.

Les tests d’intégration IndexedDB utilisent `fake-indexeddb` et vérifient le
cycle fermeture/réouverture, l’isolation multi-profils, la suppression
atomique, les imports validés et atomiques ainsi que la reprise d’une session.
Ils sont inclus dans `npm test` et réinitialisent la base uniquement via les
hooks de test de `src/storage/db.ts` ; l’application continue d’utiliser
IndexedDB natif en production.

Tests end-to-end Playwright (Chrome) :

```bash
npx playwright install chromium # une seule fois par machine
npm run e2e
```

La suite `e2e/flashmemory.spec.ts` vérifie le premier lancement (création de profil,
réponse puis reprise exacte après rechargement), l’isolation de la progression entre
deux profils, une session utilisable après passage hors connexion, les réglages, les
raccourcis `Espace` et `1` à `4`, le lien d’évitement vers le contenu, le reflow
sans défilement horizontal à 320 px, le feedback d’un QCM, ainsi que le manifeste,
l’icône et l’enregistrement du service worker. Chaque test utilise un contexte
navigateur Playwright distinct, donc son IndexedDB est isolé. Le serveur Vite est
lancé automatiquement par la configuration Playwright.

Sous Windows, Playwright peut laisser son processus Node ouvert après que les cinq
scénarios aient réussi ; les résultats sont alors valides mais il peut être nécessaire
d’interrompre manuellement la commande. La CI GitHub exécute la même suite sous Linux.

L’import/export se fait depuis Réglages au format JSON `general-knowledge-trainer` version 1. Chaque import est validé en profondeur (objets, identifiants, dates UTC, états et relations de profil) avant toute écriture. Le remplacement d’un profil existant n’est jamais implicite : l’API `importProfile(bundle, true)` doit le demander explicitement. L’écriture du profil, des réglages, des états et de l’historique se fait ensuite dans une transaction IndexedDB unique, avec rollback en cas d’erreur. IndexedDB isole les profils, états de cartes et événements de révision. Le scheduler est indépendant de React et conserve chaque révision immédiatement.

La session quotidienne sélectionne d’abord les cartes en retard, puis celles dues aujourd’hui, les cartes en apprentissage et enfin les nouvelles cartes. Elle respecte à la fois `Maximum par session` et `Nouvelles questions par jour` : ce dernier plafond est calculé à partir des premières introductions enregistrées dans les `ReviewEvents` du jour, pour le profil actif. La sélection est pure et déterministe pour une même date/seed, avec mélange stable dans chaque priorité. Chaque session en cours est enregistrée comme un snapshot (mode, ordre des IDs et position) dans IndexedDB : **Continuer** reprend exactement la question interrompue après fermeture ou rechargement. Hors Quiz libre, les réponses écrivent l’état de révision, l’événement et la nouvelle position atomiquement ; le Quiz libre n’enregistre que son avancement et ne modifie pas la planification. L’accueil propose aussi les modes Révisions uniquement, Découvrir, Quiz libre et thème spécifique.

Depuis **Réglages → Gérer les profils**, il est possible de créer un profil supplémentaire ou de sélectionner/supprimer le profil actif. La suppression exige une confirmation explicite et supprime de façon atomique le profil, ses réglages, ses états, ses sessions et son historique de révision.

L’écran **Stats** propose les fenêtres calendaires locales Aujourd’hui, 7 jours, 30 jours et Tout. Les réponses, taux de réussite, questions vues/apprises/maîtrisées/oubliées, série, temps et progression par catégorie sont recalculés à partir des `ReviewEvents` et `ReviewStates` du profil actif ; aucun agrégat statistique parallèle n’est stocké. Les nouvelles réponses enregistrent aussi leur durée lorsque l’application peut la mesurer.

L'écran **Explorer** permet de rechercher dans le catalogue et de filtrer par catégorie, sous-catégorie, difficulté et statut (déjà vue, jamais vue, maîtrisée, difficile pour moi). Chaque question ouvre un détail accessible avec sa réponse, son explication et l'historique personnel de révision.

Les réglages d'apprentissage sont propres à chaque profil : nombre de nouvelles cartes, maximum par session, difficulté souhaitée des nouvelles cartes (1 à 5 ou toutes), son et vibrations. La difficulté souhaitée classe les cartes réellement nouvelles par proximité ; elle ne masque jamais une carte déjà due. Les réglages enregistrés par les anciennes versions sont migrés en conservant leurs valeurs et en ajoutant les nouveaux défauts.

Une journée compte pour la série à partir de **3 révisions**, sans obligation de terminer toutes les cartes dues. Le seuil est identique dans l'accueil et les statistiques, et les réponses « À revoir » comptent bien comme une révision d'apprentissage. Pour un QCM, la proposition choisie reste visible après le choix : la bonne option et l'option sélectionnée sont distinguées, puis l'explication et les quatre ratings apparaissent. Le feedback dit « Bonne réponse » ou « La bonne réponse était… » et n'évalue jamais négativement la personne.

## Vérification offline PWA

Pour tester le parcours réel : lancez `npm run build`, puis `npm run preview` (ou servez `dist/` en HTTPS), ouvrez l’application une première fois et rechargez-la afin que le service worker prenne le contrôle. Dans les outils développeur, activez **Offline**, fermez puis rouvrez l’onglet : l’accueil, le catalogue, une session et l’écriture IndexedDB doivent rester utilisables. Désactivez ensuite **Offline**, rechargez et vérifiez qu’une nouvelle version affiche le bouton **Recharger** avant d’être activée.

## Architecture

`src/domain` contient les types, la validation, les statistiques et le scheduler. `src/services` porte les cas d’usage (sessions persistantes, profils, import/export) et expose la façade `repositories.ts` utilisée par React, `src/storage` encapsule IndexedDB (schéma v2 avec migration additive des sessions), et `src/app` ne contient que l’interface.
