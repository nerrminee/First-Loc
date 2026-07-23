# Configuration Firebase sécurisée

## 1. Activer la connexion administrateur

Dans Firebase Console :

1. Ouvrir **Authentication** puis **Commencer**.
2. Dans **Sign-in method**, activer **E-mail/Mot de passe**.
3. Dans **Users**, créer chaque compte administrateur avec son mot de passe.
4. Pour l’e-mail Firebase, utiliser le format `<nom-utilisateur>@firstloc.dz`.

Exemple : pour se connecter avec le nom d’utilisateur `gestionnaire`, créer le compte Firebase `gestionnaire@firstloc.dz`. L’administrateur saisira uniquement `gestionnaire` dans l’application. Le formulaire accepte aussi l’e-mail Firebase complet.

## 2. Autoriser chaque administrateur

Le premier administrateur avec l’UID `zSQJRtEbcsYunlReTXkPtWvcPCl2` est configuré automatiquement. Son document `admins/{uid}` sera créé lors de sa première connexion après la publication des règles.

Pour chaque utilisateur créé :

1. Copier son **UID** depuis Authentication > Users.
2. Dans Firestore, créer la collection `admins`.
3. Créer un document dont l’identifiant est exactement cet UID.
4. Ajouter les champs :
   - `name` : nom affiché de l’administrateur
   - `role` : `admin`

Un compte Firebase Authentication sans document `admins/{uid}` ne peut pas accéder au tableau de bord.

## 3. Publier les règles

Copier le contenu de `firestore.rules` dans Firestore Database > Rules, puis cliquer sur **Publish**.

Ou, après `firebase login`, exécuter :

```sh
firebase deploy --only firestore:rules
```
