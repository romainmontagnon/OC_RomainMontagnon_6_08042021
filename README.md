# BACKEND So Pekocko

[TOC]

## Installation

Dans la racine du dossier `./backend` :

```bash
npm install
```

Pour lancer l'_API_, plusieurs possibilités

```bash
# CAS 1
node server.js
# CAS 2
nodemon server.js
# CAS 3
nodemon start
```

Si tous se passe correctement vous devriez obtenir le message suivant au lancement de de l'_API_ :

```bash
listening on port 3000
Connexion à MongoDB réussie !
```

## Variable d'environnement `dotenv`

L'_API_ uilise des variable d'environement.
Il sera nécéssaire de créer un fichier '.env' dans la racine du dossier `./backend`

`${process.env.MY_VAR}`

### Détail des variable nécéssaires

| Variables    |    Scope                          |
|------------- |---------------------------------- |
| `TOKEN_KEY`  | clef d'encryptage du token        |
| `HASH_ROUND` | nombre de hash d'encryptage du mdp|
| `DB_USER`    | Identifiant de la base de données |
| `DB_PASS`    | Mot de passe de la base de données|
| `DB_HOST`    | Cluster de la base de données     |
| `DB_NAME`    | Nom de la base de données         |
|`DB_APP_NAME` | App de la base de données         |
