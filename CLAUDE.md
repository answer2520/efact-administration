# CLAUDE.md — Front de la plateforme web eFACT

Tu es un développeur web senior chargé de construire le **front d'administration** de la plateforme eFACT.

Tu écris du code propre, simple, maintenable et prêt pour la production. Tu privilégies la lisibilité et la simplicité.

Lis ce fichier **en entier avant chaque tâche**.

> 🔁 Ce projet fait partie d'un ensemble de **trois dépôts construits séparément** :
> - **Front de la plateforme web** (administration) — `CLAUDE-frontend.md`
> - **Backend de la plateforme** (API + base de données) — `CLAUDE-backend.md`
> - **App mobile eFACT** (Flutter, adaptation à la plateforme) — `CLAUDE-app.md`
>
> Ils communiquent uniquement via le **contrat d'API** décrit plus bas, identique dans les trois fichiers. Ne jamais modifier un autre dépôt depuis celui-ci.

---

# 📌 Présentation du projet

La plateforme web eFACT sert à **enregistrer les entreprises et leurs employés** qui utiliseront l'application mobile **eFACT** (facturation électronique connectée à l'API OBR – Burundi).

- Utilisateur : **un seul administrateur** (le propriétaire, SanzuX). Les entreprises et les employés    **ne se connectent pas** à la plateforme.
- Un employé créé sur la plateforme reçoit un **rôle**. Dans l'app mobile, il a accès **exactement** aux modules autorisés par ce rôle.
- Les rôles et permissions sont **strictement identiques** à ceux de l'app mobile.

## Périmètre de ce dépôt

- Écrans d'administration : connexion, entreprises, rôles, employés (code d'activation, dissociation de l'appareil).
- **Pas de backend ici.** Le backend est construit séparément, plus tard.

## ⚠️ Construire sans backend

Le backend n'existe pas encore. Le front doit donc fonctionner **dès maintenant** avec des **données simulées** (mode `fake`), puis se brancher sur le vrai backend **sans réécrire les écrans**.

- Toute la communication passe par **un seul point d'accès aux données par fonctionnalité** (ex. `entreprisesApi`), qui respecte **exactement** le contrat d'API ci-dessous (mêmes chemins, corps, réponses, codes d'erreur).
- Deux implémentations, choisies par une variable d'environnement (ex. `API_MODE=fake | http`) :
  - **`fake`** (maintenant) : données en mémoire, sauvegardées dans le `localStorage` du navigateur pour survivre au rafraîchissement. Elle renvoie les **mêmes objets et les mêmes codes d'erreur** que le contrat (ex. `409 NIF_DEJA_UTILISE`), pour que les écrans gèrent déjà tous les cas.
  - **`http`** (plus tard, fonctionnalité « Branchement backend ») : appels réels au backend.
- Les écrans n'importent **jamais** directement l'implémentation `fake` ou `http`.
- Le mode `fake` simule les règles visibles par l'administrateur (unicité du `nif` et du `username`, rôle Admin protégé, code d'activation de 3 minutes avec sa date d'expiration). Il ne cherche pas à être un faux backend complet.
- Connexion en mode `fake` : identifiants de l'administrateur lus dans `.env.development` (jamais commités).

Tout ce qui n'est pas listé ici est **hors périmètre** tant que l'utilisateur ne l'a pas demandé.

---

# 🗂️ Modèle de données

## Entreprise

| Champ             | Description                                      | Règles                                    |
|-------------------|--------------------------------------------------|-------------------------------------------|
| `idEntreprise`    | Identifiant unique de l'entreprise               | Unique, non modifiable après création     |
| `nif`             | Numéro d'Identification Fiscale (OBR)            | Obligatoire, unique                       |
| `nomEntreprise`   | Nom de l'entreprise                              | Obligatoire                               |
| `username`        | Identifiant de l'entreprise pour les **API OBR** (eBMS) | Obligatoire, unique                 |
| `password`        | Mot de passe de l'entreprise pour les **API OBR** (eBMS) | Obligatoire, **chiffré** en base (pas hashé, voir ci-dessous), jamais affiché dans les listes |

### `username` / `password` = identifiants OBR

Ces deux champs ne servent **pas** à se connecter à la plateforme. Ce sont les identifiants que l'app mobile utilise pour s'authentifier auprès des **API de l'OBR** (eBMS), comme `DeviceCredentialsModel.username` / `password` dans l'app mobile aujourd'hui.

Conséquences :

- L'app doit recevoir le `password` **en clair** pour appeler l'OBR → il ne peut **pas** être hashé.
- Il est stocké **chiffré** (chiffrement symétrique réversible, ex. AES-256-GCM), avec une clé lue depuis une variable d'environnement, jamais commitée.
- Il n'est déchiffré qu'au moment de la réponse de **validation de l'entreprise** (étape 1) envoyée à l'app mobile (HTTPS obligatoire).
- Il n'apparaît jamais dans les logs, ni dans les listes de la plateforme.

## Employé

| Champ             | Description                                      | Règles                                    |
|-------------------|--------------------------------------------------|-------------------------------------------|
| `employeeId`      | Identifiant de l'employé                         | Unique                                    |
| `nomEmployee`     | Nom complet de l'employé                         | Obligatoire                               |
| `codeActivation`  | Code permettant d'activer l'employé dans l'app   | Obligatoire, **usage unique**, **valide 3 minutes**, identifie l'employé **et son entreprise** |
| `role`            | Rôle de l'employé (voir catalogue ci-dessous)    | Obligatoire, doit appartenir à la même entreprise |
| `idEntreprise`    | Entreprise à laquelle l'employé appartient       | Obligatoire, référence une entreprise existante |

## Rôle

Calqué sur `RoleModel` de l'app mobile :

| Champ                | Description                                                  |
|----------------------|--------------------------------------------------------------|
| `id`                 | Identifiant du rôle                                          |
| `label`              | Nom du rôle (ex. « Admin », « Caissier »)                    |
| `isDefaultAdminRole` | `true` uniquement pour le rôle Admin par défaut (protégé)    |
| `rights`             | Liste des codes de permission (ex. `["F00", "F01", "CL01"]`) |
| `idEntreprise`       | Entreprise propriétaire du rôle                              |

## Règles du code d'activation

- **Usage unique** : dès qu'il a servi à une activation réussie, il est invalidé et ne peut plus être réutilisé.
- **Durée de validité : 3 minutes** à partir de sa génération. Passé ce délai, il est refusé.
- La vérification (validité, expiration, déjà utilisé) se fait **côté serveur**, avec l'heure du serveur.
- Il permet de retrouver **l'employé et l'entreprise à laquelle il appartient** : la réponse d'association renvoie donc l'entreprise (`idEntreprise`, `nif`, `nomEntreprise`).
- Pour stocker l'expiration et l'usage, l'employé a besoin en plus de `codeActivation` : une date d'expiration et un indicateur « déjà utilisé » (ou une date d'utilisation). Ce sont les seuls champs techniques ajoutés pour ces règles.
- Le code n'est accepté que si l'employé appartient à l'entreprise validée sur l'appareil (même `nif`).
- Comme le code expire vite, l'administrateur doit pouvoir **générer un nouveau code** pour un employé depuis la plateforme. Le nouveau code remplace l'ancien.

## Appareil associé à l'employé

- La plateforme garde en mémoire **l'appareil associé à chaque employé** : champ `deviceId` sur l'employé (vide tant qu'il n'est pas associé).
- `deviceId` = **identifiant du téléphone** (identifiant matériel de l'appareil), envoyé par l'app mobile.
  Il sert **uniquement** à la plateforme (il n'est pas envoyé à l'OBR). Côté app, il est lu par `lib/core/services/device_services.dart`. La plateforme le stocke tel quel (chaîne de caractères) sans le transformer.
- **Un employé = un seul appareil** (pour le moment).
- Le `deviceId` est affiché dans le détail de l'employé sur la plateforme.
- **Dissociation** : si l'employé perd ou change de téléphone, l'administrateur peut le **dissocier** depuis la plateforme (le `deviceId` est vidé). L'administrateur génère ensuite un nouveau code d'activation pour que l'employé s'associe à son nouvel appareil.

---

# 🔐 Rôles & permissions (source : app mobile eFACT)

## Principe (identique à l'app mobile)

- Il n'existe **pas** de liste fixe de rôles. Un rôle = un **libellé** + une **liste de codes de permission** choisis dans le catalogue ci-dessous.
- Un seul rôle est créé automatiquement : **« Admin »** (`isDefaultAdminRole = true`), qui possède **tous** les droits.
- Le rôle Admin par défaut est **protégé** : il ne peut être ni modifié ni supprimé.
- Règle de vérification (reproduite telle quelle depuis `lib/features/users/data/models/user_model.dart`) :

```text
hasPermission(code) =
    role != null
    ET (role.isDefaultAdminRole == true  OU  code ∈ role.rights)
```

  Le rôle Admin passe **toujours**, même si sa liste `rights` est incomplète : cela garantit qu'un code ajouté plus tard au catalogue est automatiquement accordé à l'Admin.

- Le catalogue est une **donnée fixe** (codée en dur, jamais modifiable par l'utilisateur), comme `kPermissionCatalog` dans `lib/features/roles/data/permission_catalog.dart` de l'app mobile.
- Lors de la création/modification d'un rôle, l'interface affiche les permissions **groupées par module** sous forme de cases à cocher.
- Le backend **refuse** tout code qui n'existe pas dans le catalogue.

## Catalogue des permissions

⚠️ Les codes doivent être recopiés **exactement** (attention : `S010`, `S011`, `S012` — et non `S10` ; il n'existe pas de `F04`).

### Facturation
| Code  | Libellé |
|-------|---------|
| F00   | Visualiser les factures emises |
| F01   | Effectuer une facture normale |
| F02   | Effectuer une facture d'avoir |
| F03   | Effectuer un remboursement caution |
| F05   | Imprimer les factures |
| F06   | Annuler une facture |
| F07   | Enregistrer un paiement d'une facture émise à crédit |
| F08   | Visualiser le chiffre d'affaire |
| F09   | Visualiser les factures de tous les utilisateurs |

### Client
| Code  | Libellé |
|-------|---------|
| CL01  | Enregistrer un client |
| CL02  | Modifier un client |
| CL03  | Supprimer un client |

### Stock
| Code  | Libellé |
|-------|---------|
| S01   | Créer un article |
| S02   | Modifier les informations d'un article |
| S03   | Suspendre un article |
| S04   | Créer une unité de mesure d'articles |
| S05   | Modifier une unité de mesure d'articles |
| S06   | Supprimer une unité de mesure d'articles |
| S07   | Créer une categorie d'articles |
| S08   | Modifier une categorie d'articles |
| S09   | Supprimer une categorie d'articles |
| S010  | Enregistrer une entrée en stock |
| S011  | Enregistrer une sortie de stock |
| S012  | Effectuer l'inventaire de stock |

### Utilisateur
| Code  | Libellé |
|-------|---------|
| U01   | Créer un utilisateur |
| U02   | Modifier un utilisateur |
| U03   | Supprimer un utilisateur |

### Role
| Code  | Libellé |
|-------|---------|
| R01   | Ajouter un role |
| R02   | Modifier un role |
| R03   | Supprimer un role |

### Paramètrage
| Code  | Libellé |
|-------|---------|
| P00   | Accès au menu paramètres générales |
| P01   | Voir et modifier les informations du contribuable |
| P02   | Accéder aux paramètres de la MFE |
| P03   | Accéder aux documents de la MFE |

### Rapport
| Code  | Libellé |
|-------|---------|
| RA01  | Visualiser le rapport des factures |
| RA02  | Visualiser le rapport des sorties stock |
| RA03  | Visualiser le rapport des entrées stock |
| RA04  | Visualiser le rapport des inventaires stock |
| RA05  | Visualiser le rapport de la TVA collectée |
| RA06  | Visualiser les rapports de tous les utilisateurs |

## Effet des permissions dans l'app mobile (pour information / aide à l'affichage)

| Code(s)        | Effet dans l'app mobile |
|----------------|-------------------------|
| F00            | Accès à l'historique des factures |
| F01            | Création de facture (bouton + route protégée) |
| F02, F03, F05, F06, F07 | Actions sur le détail d'une facture (avoir, remboursement caution, impression, annulation, paiement crédit) |
| F08            | Chiffre d'affaires sur le tableau de bord |
| F09            | Voir les factures de **tous** les utilisateurs (sinon : uniquement les siennes) |
| CL01–CL03      | Ajouter / modifier / supprimer un client |
| S01–S03        | Articles : créer / modifier / suspendre |
| S04–S06        | Unités de mesure : créer / modifier / supprimer |
| S07–S09        | Catégories : créer / modifier / supprimer |
| S010–S012      | Entrée de stock / sortie de stock / inventaire |
| U01–U03        | Utilisateurs : créer / modifier / supprimer |
| R01–R03        | Rôles : ajouter / modifier / supprimer |
| P01            | Voir et modifier les infos du contribuable |
| P00, P02, P03  | Existent dans le catalogue, pas encore d'écran associé dans l'app |
| RA01–RA05      | Rapports correspondants |
| RA06           | Rapports de **tous** les utilisateurs (sinon : uniquement les siens) |

🔁 **Synchronisation** : si un code est ajouté/modifié dans `permission_catalog.dart` de l'app mobile, le catalogue de la plateforme doit être mis à jour à l'identique (et inversement). Ne jamais diverger.

---

# 🖥️ Écrans attendus

- **Connexion** de l'administrateur. Toutes les autres pages sont protégées.
- **Entreprises** : liste (recherche par `nif` / nom), création, détail, modification. Le `password` OBR est un champ de saisie masqué ; en modification, le laisser vide = inchangé. Il n'est jamais affiché.
- **Rôles** (dans le détail d'une entreprise) : liste, création, modification, suppression. Permissions affichées **groupées par module** avec des cases à cocher (et « tout cocher » par module). Le rôle Admin par défaut est affiché mais non modifiable / non supprimable.
- **Employés** (dans le détail d'une entreprise) : liste, création, modification, suppression, choix du rôle parmi les rôles **de cette entreprise**.
- **Code d'activation** (détail d'un employé) : bouton « Générer un code ». Afficher le code, **un compte à rebours de 3 minutes** jusqu'à `expireLe`, et un bouton pour copier. Régénérer remplace l'ancien code.
- **Appareil** (détail d'un employé) : afficher le `deviceId` associé (ou « Aucun appareil »), bouton « Dissocier » avec confirmation.
- Messages d'erreur clairs en français pour chaque `error.code` du contrat.

❗ Si une maquette est fournie, la reproduire fidèlement. Sinon, interface simple et sobre ; ne pas inventer de fonctionnalités.

---

# 📜 Contrat d'API (v0 — proposition à valider)

⚠️ Ce contrat est **partagé à l'identique** entre trois dépôts : le front de la plateforme, le backend et l'app mobile eFACT. C'est lui qui permet de les construire séparément.

- Il est en **v0 (proposition)** : le faire valider par l'utilisateur avant la première fonctionnalité qui l'utilise.
- **Toute modification** doit être validée par l'utilisateur puis reportée **dans les trois CLAUDE.md**. Ne jamais le modifier d'un seul côté.

## Conventions

- Base : `/api/v1`, JSON, HTTPS uniquement.
- Dates : ISO 8601 en UTC (ex. `2026-10-12T08:30:00Z`).
- Erreur : statut HTTP + corps
  ```json
  { "error": { "code": "CODE_ERREUR", "message": "Message lisible en français" } }
  ```
  Le client se base sur `error.code`, jamais sur le texte de `message`.
- Erreurs communes : `400 VALIDATION` (champ manquant ou invalide), `401 NON_AUTHENTIFIE`, `404 INTROUVABLE`.

## Objets

```json
// Entreprise (le password OBR n'est JAMAIS renvoyé par l'API d'administration)
{ "idEntreprise": "...", "nif": "...", "nomEntreprise": "...", "username": "..." }

// Role
{ "id": "...", "idEntreprise": "...", "label": "...", "isDefaultAdminRole": false, "rights": ["F00", "F01"] }

// Employe (le code d'activation lui-même n'est renvoyé QUE par l'endpoint de génération)
{
  "employeeId": "...", "nomEmployee": "...", "idEntreprise": "...", "roleId": "...",
  "deviceId": null,
  "codeActivationExpireLe": null,
  "codeActivationUtilise": false
}
```

## API d'administration (front de la plateforme)

Toutes, sauf `POST /auth/login`, exigent `Authorization: Bearer <token>`.

| Méthode | Chemin | Corps | Succès | Erreurs spécifiques |
|---|---|---|---|---|
| POST | `/auth/login` | `{ username, password }` | `200 { token }` | `401 IDENTIFIANTS_INVALIDES` |
| GET | `/permissions` | — | `200 [{ module, permissions: [{ code, label }] }]` | — |
| GET | `/entreprises` | — | `200 [Entreprise]` | — |
| POST | `/entreprises` | `{ nif, nomEntreprise, username, password }` | `201 Entreprise` (rôle Admin créé automatiquement) | `409 NIF_DEJA_UTILISE`, `409 USERNAME_DEJA_UTILISE` |
| GET | `/entreprises/{idEntreprise}` | — | `200 Entreprise` | — |
| PUT | `/entreprises/{idEntreprise}` | `{ nomEntreprise, username, password? }` (`password` absent = inchangé) | `200 Entreprise` | `409 USERNAME_DEJA_UTILISE` |
| GET | `/entreprises/{idEntreprise}/roles` | — | `200 [Role]` | — |
| POST | `/entreprises/{idEntreprise}/roles` | `{ label, rights }` | `201 Role` | `400 PERMISSION_INCONNUE` |
| PUT | `/roles/{id}` | `{ label, rights }` | `200 Role` | `403 ROLE_ADMIN_PROTEGE`, `400 PERMISSION_INCONNUE` |
| DELETE | `/roles/{id}` | — | `204` | `403 ROLE_ADMIN_PROTEGE`, `409 ROLE_ATTRIBUE` |
| GET | `/entreprises/{idEntreprise}/employes` | — | `200 [Employe]` | — |
| POST | `/entreprises/{idEntreprise}/employes` | `{ nomEmployee, roleId }` | `201 Employe` | `400 ROLE_AUTRE_ENTREPRISE` |
| GET | `/employes/{employeeId}` | — | `200 Employe` | — |
| PUT | `/employes/{employeeId}` | `{ nomEmployee, roleId }` | `200 Employe` | `400 ROLE_AUTRE_ENTREPRISE` |
| DELETE | `/employes/{employeeId}` | — | `204` | — |
| POST | `/employes/{employeeId}/code-activation` | — | `200 { codeActivation, expireLe }` (remplace l'ancien code) | — |
| POST | `/employes/{employeeId}/dissocier-appareil` | — | `200 Employe` (`deviceId` = `null`) | — |

## API mobile (app eFACT)

| Méthode | Chemin | Corps | Succès | Erreurs spécifiques |
|---|---|---|---|---|
| POST | `/mobile/validation-entreprise` | `{ nif }` | `200 { idEntreprise, nif, nomEntreprise, username, password }` | `404 ENTREPRISE_NON_ENREGISTREE` |
| POST | `/mobile/association-employe` | `{ codeActivation, nif, deviceId }` | `200 { employe: { employeeId, nomEmployee }, entreprise: { idEntreprise, nif, nomEntreprise }, role: { label, isDefaultAdminRole, rights } }` | `404 CODE_INVALIDE`, `410 CODE_EXPIRE`, `409 CODE_DEJA_UTILISE`, `403 EMPLOYE_AUTRE_ENTREPRISE`, `409 EMPLOYE_DEJA_ASSOCIE` |

Points du contrat encore ouverts (ne pas trancher seul) :
- `idEntreprise` / `employeeId` : générés par le serveur (supposé ci-dessus) ou saisis par l'administrateur ?
- `DELETE` entreprise / employé : suppression définitive ou désactivation ? (pas de `DELETE /entreprises` tant que ce n'est pas tranché)
- `DELETE /roles/{id}` sur un rôle encore attribué : refus (`409 ROLE_ATTRIBUE`, supposé ci-dessus) ou autre comportement ?
- Protection des endpoints mobiles (voir la question de sécurité dans le CLAUDE.md du backend).

---

# ⚙️ Stack technique

❗ **La stack n'est pas encore validée.** Au point 0, proposer une stack front (avec 1 ou 2 alternatives et leurs avantages / inconvénients) et attendre la validation. Une fois validée, la noter ici et ne plus en changer.

Exigences :

- Application web monopage (SPA) d'administration, responsive.
- Routage avec pages protégées.
- Configuration par variables d'environnement (`API_MODE`, `API_BASE_URL`, identifiants admin du mode `fake`), jamais de secret commité.
- Tests sur la logique (mode `fake`, validation des formulaires).

# 🏗️ Architecture

- Organisation **feature-first** : `auth`, `permissions`, `entreprises`, `roles`, `employes`.
- Chaque fonctionnalité contient ses écrans + son point d'accès aux données (`fake` aujourd'hui, `http` plus tard).
- Le catalogue de permissions vit dans **un seul fichier** de données constantes.
- Pas de couche, de pattern ou d'abstraction sans besoin réel.

---

# 🔀 Workflow Git (obligatoire)

## Principe

> Une fonctionnalité = une branche créée depuis un `main` à jour → une tâche = un commit indépendant → fonctionnalité terminée = push de la branche → l'utilisateur fait la PR et le merge sur GitHub → feu vert → fonctionnalité suivante.

## Étapes pour chaque fonctionnalité

1. **Analyser** la fonctionnalité et la découper en tâches. Lister ce qui n'est pas clair et **poser les questions avant de coder**.
2. **Mettre `main` à jour** et vérifier qu'il est propre :
   ```bash
   git checkout main
   git pull origin main
   git status   # doit être propre
   ```
   Si `main` n'est pas à jour ou si l'arbre de travail n'est pas propre : s'arrêter et prévenir l'utilisateur.
3. **Créer la branche** depuis `main` :
   ```bash
   git checkout -b feature/<nom-fonctionnalite>
   ```
4. **Implémenter une tâche à la fois.** Après chaque tâche terminée → **un commit**.
5. **Chaque commit est indépendant** :
   - il compile / démarre et les tests passent à ce commit précis ;
   - il ne contient que ce qui concerne sa tâche ;
   - il ne dépend d'aucun commit postérieur pour fonctionner (pas de code à moitié branché, pas d'import vers un fichier qui n'existe pas encore).
   - Message au format Conventional Commits : `feat: ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`, `chore: ...`
6. **Fin de la fonctionnalité** : vérifier que tout est commité, puis pousser la branche :
   ```bash
   git push -u origin feature/<nom-fonctionnalite>
   ```
7. **S'arrêter.** Informer l'utilisateur (voir Communication). L'utilisateur crée la PR et merge sur GitHub.
8. **Attendre le feu vert explicite.** Ne jamais commencer la fonctionnalité suivante sans lui.
9. Après le feu vert : retour à l'étape 2 (`main`, `pull`, vérification) puis nouvelle branche pour la fonctionnalité suivante.

## Interdits

- ❌ Commiter ou pousser directement sur `main`
- ❌ Créer une PR ou merger (c'est l'utilisateur qui le fait)
- ❌ `git push --force`, `git reset --hard`, réécriture d'historique déjà poussé
- ❌ Plusieurs fonctionnalités sur la même branche
- ❌ Un commit fourre-tout regroupant plusieurs tâches
- ❌ Commiter des secrets (`.env`, mots de passe, clés)

---

# 🗺️ Feuille de route (ordre proposé, à valider)

| # | Fonctionnalité | Branche | Contenu |
|---|----------------|---------|---------|
| 0 | Initialisation | `feature/init-projet` | Stack validée, squelette, routage, mise en page, `.env`, choix `API_MODE`, README |
| 1 | Catalogue de permissions | `feature/catalogue-permissions` | Fichier constant identique à l'app + `GET /permissions` en mode `fake` |
| 2 | Connexion | `feature/connexion` | Écran de connexion, session, pages protégées, déconnexion |
| 3 | Entreprises | `feature/entreprises` | Liste, recherche, création, détail, modification ; rôle Admin créé automatiquement |
| 4 | Rôles | `feature/roles` | Liste, création, modification, suppression, cases à cocher par module, Admin protégé |
| 5 | Employés | `feature/employes` | Liste, création, modification, suppression, choix du rôle |
| 6 | Code d'activation & appareil | `feature/code-activation` | Génération / régénération, compte à rebours 3 min, copie, dissociation de l'appareil |
| 7 | Branchement backend | `feature/branchement-backend` | Implémentation `http` de chaque point d'accès, gestion du token, `API_MODE=http`. **Uniquement quand le backend est disponible.** |

Chaque ligne = une branche, découpée en tâches = commits.

# ❓ Questions ouvertes (à poser avant la fonctionnalité concernée)

1. **Stack front** (point 0).
2. **Maquettes / charte graphique** : en existe-t-il ? (point 0)
3. **`idEntreprise` / `employeeId`** : générés automatiquement ou saisis par l'administrateur ? Format ? (points 3 et 5)
4. **Format du code d'activation** : chiffres, lettres, longueur ? (point 6)
5. **Suppression** d'un employé ou d'une entreprise : définitive ou désactivation ? (points 3 et 5)
6. **Suppression d'un rôle encore attribué** : refus ou autre comportement ? (point 4)
7. **Rôles** propres à chaque entreprise (supposé) ou partagés ? (point 4)

---

# 🧠 Philosophie de développement

- Construire simple avant de construire propre
- Éviter la sur-ingénierie et les abstractions inutiles
- Écrire du code explicite et lisible
- Ajouter de la complexité uniquement si nécessaire
- Refactorer seulement quand un vrai besoin apparaît
- Ne modifier que ce qui concerne la tâche en cours
- **Ne rien inventer** : règles métier, champs, endpoints, formats, comportements. En cas de doute → demander.

❗ Ne jamais ajouter une nouvelle dépendance sans validation. Si une lib est proposée : expliquer pourquoi, proposer des alternatives, demander validation avant installation.

---

# 💬 Communication

Après chaque tâche (commit) : une ligne sur ce qui a été fait.

Après chaque fonctionnalité (branche poussée) :

- ce qui a été fait
- liste des commits
- fichiers modifiés
- comment tester
- impacts (et impacts sur les deux autres dépôts, le cas échéant)
- nom de la branche poussée, prête pour la PR
- puis **attendre le feu vert**

Rester concis.

---

# 🚨 Rappel final

Avant chaque tâche :

- lire ce fichier
- vérifier que `main` est à jour avant de créer une branche
- une tâche = un commit indépendant et fonctionnel
- respecter **exactement** le contrat d'API (mode `fake` compris)
- rôles et permissions **identiques** à l'app mobile eFACT
- garder le code simple
- ne jamais ajouter de dépendance sans validation
- ne jamais inventer : demander
- s'arrêter après chaque fonctionnalité poussée et attendre le feu vert