# Comment ça marche

## Démarrer

```bash
npm install
npm run dev
```

Ouvre `http://localhost:3000` → redirige automatiquement vers `/connexion`.

---

## Connexion

Identifiants par défaut (mode fake) :

| Champ | Valeur |
|-------|--------|
| Nom d'utilisateur | `admin` |
| Mot de passe | `admin` |

Le token est stocké dans le `localStorage`. Tant qu'il est présent, les pages protégées sont accessibles.

---

## Navigation

```
/connexion              → page de connexion
/entreprises            → liste des entreprises (recherche par NIF ou nom)
/entreprises/nouvelle   → créer une entreprise
/entreprises/:id        → détail (onglets : Infos / Rôles / Employés)
/entreprises/:id/modifier
/entreprises/:id/employes/:employeeId  → détail employé + code d'activation + appareil
```

---

## Deux modes API

Configuré dans `.env.development` :

```
API_MODE=fake   → données en localStorage (aucun backend nécessaire)
API_MODE=http   → appels vers l'API REST définie par API_BASE_URL
```

En mode `fake`, des données de démo sont créées automatiquement au premier lancement.

---

## Code d'activation employé

1. Ouvre la page d'un employé
2. Clique **Générer un code d'activation**
3. Un code à 6 chiffres s'affiche, valide **3 minutes**
4. Transmets-le à l'employé pour activer l'app mobile
