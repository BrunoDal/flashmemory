# TODO

Les priorités P1 « sélection de session quotidienne », « sessions persistantes/reprise exacte », « plafond des nouvelles cartes », « gestion/suppression atomique des profils », « import/export validé et atomique », « difficulté souhaitée des nouvelles cartes », « série quotidienne explicite » et « feedback QCM orienté apprentissage » sont livrées. Les imports refusent désormais toute donnée malformée avant écriture et migrent les Settings v1/v2 vers la forme actuelle ; ils ne remplacent un profil qu’avec une demande explicite. Une réponse persiste maintenant ReviewState, ReviewEvent et le curseur StudySession dans une transaction IndexedDB unique.

## NOW

- Maintenir les 3312 faits indépendants actuels et enrichir progressivement le catalogue par lots éditoriaux réellement distincts. Chaque ajout doit fournir un `factId`, une provenance structurée et approuvée, puis passer `npm run validate-content` ; les variantes de rappel et les doublons ne sont pas comptés comme de nouvelles questions.
- Étendre les parcours Playwright de la PWA à la mise à jour du service worker ; le manifeste, l’icône et l’enregistrement au bon périmètre sont désormais couverts.
- Tester le parcours PWA offline sur Chrome/Android et Safari iOS (installation, fermeture, réouverture et mise à jour avec CTA).
- Mesurer un chargement progressif du catalogue par lots ou thèmes avant de le mettre en œuvre : il doit préserver la sélection de session, la disponibilité hors connexion et les services synchrones actuels.

## NEXT

- Vérifier la migration de bases réelles v1 → v2 sur des fixtures historiques lorsque l’environnement CI fournira une base IndexedDB native.

## LATER

- Algorithme FSRS complet derrière l’interface `Scheduler`.
- Statistiques avancées et badges non bloquants.
