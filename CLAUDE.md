# eFact Web — Administration

Interface web d'administration pour la gestion des entreprises, rôles et employés.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript 5**

## Architecture

```
src/
├── app/                        # Routage uniquement (pages fines)
│   ├── layout.tsx              # Layout racine
│   ├── page.tsx                # Redirige vers /entreprises
│   ├── connexion/page.tsx      # Page de connexion
│   └── (admin)/                # Groupe protégé (AuthGuard)
│       ├── layout.tsx          # Coque : menu + déconnexion
│       └── entreprises/        # CRUD entreprises + employés
├── features/                   # Feature-first
│   ├── auth/                   # API (fake/http), session, AuthGuard, LoginForm
│   ├── permissions/             # Catalogue commun (web + mobile), PermissionPicker
│   ├── entreprises/            # API, types, schema, composants
│   ├── roles/                  # API, types, composants
│   └── employes/               # API, types, composants (code activation, appareil)
├── lib/                        # Infra transverse
│   ├── api-mode.ts             # Lit API_MODE (fake | http)
│   ├── http-client.ts          # fetch + Bearer token + conversion erreurs
│   ├── api-error.ts            # Classe ApiError
│   ├── error-messages.ts       # Codes erreurs → messages français
│   └── fake-db.ts              # Helper localStorage + seed
└── components/ui/              # Composants génériques (Button, Input, Modal)
```

## Mode API

L'application supporte deux modes via la variable `API_MODE` :

- **`fake`** (défaut) : les données sont en localStorage, un seed crée des données de démo au premier lancement. Aucun backend nécessaire.
- **`http`** : les appels vont vers l'API REST définie par `API_BASE_URL`.

Chaque feature possède `api/index.ts` (dispatch), `api/fake.ts` (localStorage) et `api/http.ts` (fetch).

## Variables d'environnement

| Fichier              | Commité | Contenu                              |
|----------------------|---------|--------------------------------------|
| `.env.development`   | Oui     | `API_MODE`, `API_BASE_URL`            |
| `.env.local`         | Non     | Identifiants admin du mode fake       |

## Commandes

```bash
npm install        # Installer les dépendances
npm run dev        # Serveur de développement (http://localhost:3000)
npm run build      # Build de production
npm run lint       # ESLint
```

## Authentification

- Connexion via `/connexion` → token stocké en localStorage.
- `AuthGuard` protège le groupe `(admin)` : redirige vers `/connexion` si pas de token.
- `http-client.ts` injecte le `Bearer` token automatiquement.

## Permissions

`permission-catalog.ts` est la **source unique** des permissions, partagée avec l'app mobile. Chaque permission est au format `module:action` (ex. `entreprises:read`).

## Conventions

- **Feature-first** : chaque domaine métier regroupe ses types, API, schémas et composants.
- **Pages fines** : les routes App Router ne contiennent que l'orchestration ; la logique métier vit dans `features/`.
- **Alias `@/`** : pointe vers `src/` (configuré dans `tsconfig.json`).
- **Composants UI** : `components/ui/` pour les éléments génériques réutilisables.
