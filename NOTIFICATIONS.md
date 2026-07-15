# Notifications push — guide de mise en service

Le code est prêt. Il reste 3 étapes de configuration (~15 min, tout est gratuit).

## 1. Créer la base Upstash (stocke les abonnements)

1. Va sur https://upstash.com → **Sign up** (compte gratuit).
2. **Create Database** → type **Redis**, région **eu-west-1 (Ireland)**, plan **Free**.
3. Dans l'onglet **REST API** de la base, copie les deux valeurs :
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## 2. Ajouter les variables d'environnement sur Vercel

Sur vercel.com → projet **coran** → **Settings** → **Environment Variables**,
ajoute ces 5 variables (environnement « Production ») :

| Nom | Valeur |
|---|---|
| `UPSTASH_REDIS_REST_URL` | (copiée à l'étape 1) |
| `UPSTASH_REDIS_REST_TOKEN` | (copiée à l'étape 1) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `BNihNpFTqI_sD0cMBZR3AEIadbkBuxkJV-7GEXtX2tSdatiqtxmQZeqKmdVX_urhbtBlfkQqepgsDz8ZWN24OuE` |
| `VAPID_PRIVATE_KEY` | `bHXHDAOUkYZ0C6DhIbdNJMtaDIbM7I9oO5NVz5SucGo` |
| `CRON_SECRET` | `pP04q9N_fONIEeAZxgnvDP-C1LTl8h7U` |

Puis **Deployments** → menu ⋯ du dernier déploiement → **Redeploy**
(les variables ne s'appliquent qu'aux nouveaux déploiements).

## 3. Créer le déclencheur (envoie les notifications toutes les 5 min)

1. Va sur https://cron-job.org → compte gratuit.
2. **Create cronjob** :
   - URL : `https://myeasycoran.vercel.app/api/envoyer?secret=pP04q9N_fONIEeAZxgnvDP-C1LTl8h7U`
   - Schedule : **Every 5 minutes**
3. Enregistre et active.

## Vérifier que ça marche

- Ouvre l'URL du cron dans ton navigateur : tu dois voir
  `{"abonnements":0,"envoyes":0,"supprimes":0}` (401 = mauvais secret,
  500 = variable manquante sur Vercel).
- Sur ton téléphone Android (ou iPhone avec l'appli installée) :
  page Prières → active « Rappel à l'heure de la prière ».
  Le sous-titre doit devenir **« Notifications actives, même quand
  l'appli est fermée »**.
- À la prochaine prière, la notification arrive appli fermée
  (précision : dans les 5 minutes suivant l'heure exacte).

## Notes

- Sans ces variables, l'appli fonctionne comme avant (rappel appli
  ouverte uniquement) — rien ne casse.
- iPhone : le push n'est possible que si l'appli est installée sur
  l'écran d'accueil (iOS 16.4+), limitation d'Apple.
- Les abonnements expirés sont nettoyés automatiquement à chaque envoi.
- Ne partage pas `VAPID_PRIVATE_KEY` ni `CRON_SECRET`.
