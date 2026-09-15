# Flashmemory — consignes de contribution

## Produit et périmètre

- Flashmemory est une application **Web/PWA locale-first**. Ne pas ajouter de backend, de compte cloud ou de couche native iOS/Capacitor sans demande explicite.
- Les fonctions essentielles doivent rester utilisables hors connexion : profils, catalogue, étude, reprise de session, statistiques, réglages et import/export.
- Privilégier le parcours d'apprentissage (question → rappel → explication → rating → sauvegarde) aux ajouts de polish ou de gamification.

## Architecture

- Respecter les frontières : `src/app` (UI) → `src/services` (cas d'usage) → `src/domain` (règles pures) → `src/services/repositories.ts` → `src/storage` (IndexedDB).
- Ne jamais importer `src/storage/db.ts` depuis React. Les composants passent par les services ou la façade de repositories.
- Le scheduler et les calculs statistiques ne dépendent pas de React ni d'IndexedDB.
- Conserver la séparation entre le catalogue (`src/content`) et les données de progression par profil.
- Toute écriture liée à une réponse doit conserver l'atomicité entre `ReviewState`, `ReviewEvent` et `StudySession`.

## Données et compatibilité

- Les IDs de questions sont stables, uniques et lisibles ; ne les renommer jamais pour une simple reformulation.
- Toute évolution de schéma IndexedDB doit être additive, migrable et testée avec des données existantes.
- Valider strictement tout import avant la première écriture ; un profil existant ne doit jamais être remplacé silencieusement.
- Ne pas persister d'agrégats statistiques qui peuvent être recalculés depuis les événements et les états de révision.

## Qualité et vérification

Après une modification significative, exécuter :

```bash
npm run validate-content
npm test
npm run lint
npm run typecheck
npm run build
npm run e2e
```

- Ajouter ou adapter les tests unitaires/domaines et les tests IndexedDB lorsqu'une règle métier ou une transaction change.
- Ajouter un scénario Playwright lorsqu'un parcours utilisateur principal change.
- Vérifier l'ergonomie à largeur mobile, l'accessibilité clavier/focus et le comportement hors connexion lorsqu'ils sont concernés.
- Mettre à jour `README.md` et `TODO.md` quand une capacité utilisateur, une commande ou une limite de vérification évolue.

## Style de travail

- Inspecter le code concerné avant de le modifier et choisir la modification minimale qui respecte l'architecture existante.
- Éviter les dépendances lourdes et les refactorings sans rapport avec la demande.
- Utiliser des sous-agents pour les tâches clairement indépendantes ou longues ; le responsable principal valide toujours le résultat et les contrôles.
