````md
# Documentation API AgriLink

## Base URL

```text
http://127.0.0.1:8000/api
````

---

## 1. Authentification

| Méthode | Route       | Accès    | Description                 |
| ------- | ----------- | -------- | --------------------------- |
| POST    | `/register` | Public   | Inscription utilisateur     |
| POST    | `/login`    | Public   | Connexion utilisateur       |
| GET     | `/user`     | Connecté | Profil utilisateur connecté |
| POST    | `/logout`   | Connecté | Déconnexion                 |

---

## 2. Dashboards

| Méthode | Route                  | Accès              |
| ------- | ---------------------- | ------------------ |
| GET     | `/admin/dashboard`     | super_admin, admin |
| GET     | `/apprenant/dashboard` | apprenant          |
| GET     | `/vendeur/dashboard`   | vendeur            |
| GET     | `/expert/dashboard`    | expert             |

---

## 3. AgriAcademy — Cours

| Méthode | Route               | Accès              |
| ------- | ------------------- | ------------------ |
| GET     | `/courses`          | Public             |
| GET     | `/courses/{course}` | Public             |
| POST    | `/courses`          | super_admin, admin |
| PUT     | `/courses/{course}` | super_admin, admin |
| DELETE  | `/courses/{course}` | super_admin, admin |

---

## 4. AgriAcademy — Leçons

| Méthode | Route                       | Accès              |
| ------- | --------------------------- | ------------------ |
| GET     | `/courses/{course}/lessons` | Public             |
| GET     | `/lessons/{lesson}`         | Public             |
| POST    | `/courses/{course}/lessons` | super_admin, admin |
| PUT     | `/lessons/{lesson}`         | super_admin, admin |
| DELETE  | `/lessons/{lesson}`         | super_admin, admin |

---

## 5. Progression & Certificats

| Méthode | Route                           | Accès    |
| ------- | ------------------------------- | -------- |
| POST    | `/lessons/{lesson}/complete`    | Connecté |
| GET     | `/my-progress`                  | Connecté |
| GET     | `/courses/{course}/progress`    | Connecté |
| POST    | `/courses/{course}/certificate` | Connecté |
| GET     | `/my-certificates`              | Connecté |

---

## 6. Cohortes

| Méthode | Route                            | Accès              |
| ------- | -------------------------------- | ------------------ |
| GET     | `/cohorts`                       | Public             |
| GET     | `/cohorts/{cohort}`              | Public             |
| POST    | `/cohorts`                       | super_admin, admin |
| PUT     | `/cohorts/{cohort}`              | super_admin, admin |
| DELETE  | `/cohorts/{cohort}`              | super_admin, admin |
| POST    | `/cohorts/{cohort}/enroll`       | super_admin, admin |
| GET     | `/cohorts/{cohort}/users`        | super_admin, admin |
| DELETE  | `/cohorts/{cohort}/users/{user}` | super_admin, admin |
| GET     | `/cohorts/{cohort}/stats`        | super_admin, admin |

---

## 7. AgriMarket

### Catégories

| Méthode | Route                    | Accès              |
| ------- | ------------------------ | ------------------ |
| GET     | `/categories`            | Public             |
| GET     | `/categories/{category}` | Public             |
| POST    | `/categories`            | super_admin, admin |
| PUT     | `/categories/{category}` | super_admin, admin |
| DELETE  | `/categories/{category}` | super_admin, admin |

### Produits / Annonces

| Méthode | Route                        | Accès              |
| ------- | ---------------------------- | ------------------ |
| GET     | `/products`                  | Public             |
| GET     | `/products/{product}`        | Public             |
| POST    | `/products`                  | Connecté           |
| PUT     | `/products/{product}`        | Connecté           |
| DELETE  | `/products/{product}`        | Connecté           |
| PATCH   | `/products/{product}/status` | super_admin, admin |
| POST    | `/products/{product}/images` | Connecté           |
| DELETE  | `/product-images/{image}`    | Connecté           |

---

## 8. AgriExpert

| Méthode | Route                                       | Accès                      |
| ------- | ------------------------------------------- | -------------------------- |
| GET     | `/experts`                                  | Public                     |
| GET     | `/experts/{expertProfile}`                  | Public                     |
| POST    | `/experts`                                  | Connecté                   |
| PUT     | `/experts/{expertProfile}`                  | Connecté                   |
| DELETE  | `/experts/{expertProfile}`                  | Connecté                   |
| PATCH   | `/experts/{expertProfile}/status`           | super_admin, admin         |
| POST    | `/experts/{expertProfile}/service-requests` | Connecté                   |
| GET     | `/my-service-requests`                      | Connecté                   |
| GET     | `/expert-service-requests`                  | Connecté                   |
| PATCH   | `/service-requests/{serviceRequest}/status` | super_admin, admin, expert |

---

## 9. Abonnements & Paiements

| Méthode | Route              | Accès              |
| ------- | ------------------ | ------------------ |
| GET     | `/subscriptions`   | Public             |
| POST    | `/subscriptions`   | super_admin, admin |
| POST    | `/payments/manual` | Connecté           |
| GET     | `/my-subscription` | Connecté           |
| GET     | `/payments`        | super_admin, admin |

---

## Comptes de démonstration

### Super Admin

```text
Email : admin@agrilink.sn
Mot de passe : password123
```

### Apprenant

```text
Email : apprenant@agrilink.sn
Mot de passe : password123
```

### Expert

```text
Email : expert@agrilink.sn
Mot de passe : password123
```

---

## Notes techniques

* Authentification : Laravel Sanctum
* Rôles : Spatie Permission
* Base de données : MySQL
* API : REST JSON
* Uploads : Laravel Storage

````
