# BACKEND So Pekocko

[TOC]

## Exigences concernant la sécurité

- [ ] l’API doit respecter le __RGPD__ et les __standards OWASP__ ;
- [ ] le mot de __passe des utilisateurs__ doit être __chiffré__ ;
- [ ] Deux types de droits administrateur à la base de données doivent être définis :
  - [ ] un __accès__ pour __supprimer__ ou __modifier__ des tables,
  - [ ] un __accès__ pour __éditer__ le contenu de la base de données ;
- [ ] la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis sa machine ;
- [ ] l’authentification est renforcée sur les routes requises ;
- [ ] les mots de passe sont stockés de manière sécurisée ;
- [ ] les adresses mails de la base de données sont uniques et un plugin Mongoose approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.

## Routes

Toutes les routes relatives à la sauce doivent exiger une demande authentifiée (contenant un jeton valide dans son en-tête d'autorisation : "`Bearer <token>`").

| #Id    | Verb       | Paramètres             |Corps de la demande                    | Type de réponse attendus | Fonction |
| ---    | ---        | ---                    | ---                                   | ---                      | --- |
| __#1__ |`'POST'`    | `/api/auth/signup`     | `{ email: string, password: string }` | `{ message: string }` | Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base de données |
| __#2__ | `'POST'`   | `/api/auth/login`      | `{ email: string, password: string }` | `{ userId: string, token: string }` | Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données et un jeton Web JSON signé (contenant également l'identifiant userID) |
| __#3__ | `'GET'`    | `/api/sauces`          | -                                     | Tableau des sauces | Renvoie le tableau de toutes les sauces dans la base de données |
| __#4__ | `'GET'`    | `/api/sauces/:id`      | -                                     | Sauce unique | Renvoie la sauce avec l'ID fourni |
| __#5__ | `'POST'`   | `/api/sauces`          | `{ sauce : Chaîne, image : Fichier }` | `{ message : Chaîne }` | Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données, en définissant correctement son image URL. Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides. |
| __#6__ | `'PUT'`    | `/api/sauces/:id`      | SOIT Sauce comme JSON OU `{ sauce : Chaîne, image : Fichier }` | `{ message : Chaîne }` | Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, capturez-la et mettez à jour l'image URL des sauces. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande (`req.body.name`, `req.body.heat` etc). Si un fichier est fourni, la sauce avec chaîne est en `req.body.sauce`. |
| __#7__ | `'DELETE'` | `/api/sauces/:id`      | -                                     | `{ message : Chaîne }` | Supprime la sauce avec l'ID fourni. |
| __#8__ | `'POST'`   | `/api/sauces/:id/like` | `{ userId: Chaîne, j'aime : Nombre }` | `{ message : Chaîne }` | Définit le statut __"j'aime"__ pour `userID` fourni. __Si j'aime = 1__, l'utilisateur aime la sauce. __Si j'aime = 0__, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. __Si j'aime = -1__, l'utilisateur n'aime pas la sauce. L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime". |

- [x] __#1__
- [x] __#2__
- [ ] __#3__
- [ ] __#4__
- [ ] __#5__
- [ ] __#6__
- [ ] __#7__
- [ ] __#8__

## Modèle de données

### Sauce

Le modèle de données pour une sauce est le suivant :
| name          | type        | description |
| ---           | ---         | ---         |
|`id`           |​ObjectID​     |identifiant unique créé par MongoDB|
|`userId`       |__​string__   |identifiant unique MongoDB pour l'utilisateur qui a créé la sauce|
|`name`         |__​string__   |nom de la sauce|
|`manufacturer` |__​string​__   |fabricant de la sauce|
|`description`  |__​string​__   |description de la sauce|
|`mainPepper`   |__string​__   |principal ingrédient dans la sauce|
|`imageUrl`     |__string​__   |string de l'image de la sauce téléchargée par l'utilisateur|
|`heat`         |__​number​__   |nombre entre __1__ et __10__ décrivant la sauce|
|`likes`        |__​number​__   |nombre d'utilisateurs qui aiment la sauce|
|`dislikes`     |__number​__   |nombre d'utilisateurs qui n'aiment pas la sauce|
|`usersLiked`   |__string​__   |tableau d'identifiants d'utilisateurs ayant aimé la sauce|
|`usersDisliked`|__string__    |tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce|

### Utilisateur

Le modèle de données pour un utilisateur est le suivant :

| name      | type      | description |
| ---       | ---       | ---         |
|`userId`   |__string__ ​|identifiant unique MongoDB pour l'utilisateur qui a créé la sauce|
|`email`    | __​string​__ |adresse électronique de l'utilisateur __unique__|
|`password` | __​string__ |hachage du mot de passe de l'utilisateur|

## Technologies à utiliser

- framework : __Express__ ;
- serveur : __NodeJS__ ;
- base de données : __MongoDB__ ;
- toutes les opérations de la base de données doivent utiliser le pack __Mongoose__ avec des schémas de données stricts.

## Informations complémentaires

Le nombre de likes/dislikes et les tableaux like/dislike doivent être mis à jour pour mettre en œuvre la fonctionnalité.

## Composant nodeJS utilisé

- [x] express
- [x] mongoose
- [x] mongoose-unique-validator
- [x] body-parser
- [x] bcrypt
- [x] jsonwebtoken

## Création de fichier

### dans `controllers`

### dans `routes`

### dans `models`

- `user.js`

### dans `middleware`

## Utilisateurs de test

| user            | password |
| --------------- | -------- |
| user1@test.com  |  test1   |
| user2@test.com  |  test2   |
| user3@test.com  |  test3   |
| user4@test.com  |  test4   |

## To Do List

- [x] signin
- [x] login
- [ ] token d`authentification
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
- [ ] sauces
