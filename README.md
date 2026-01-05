# TP 7 – React Native  
## API distante, AsyncStorage et SQLite (Mode hors ligne)

## 🎯 Objectifs du TP
Ce TP a pour but de :
- Consommer une API REST distante (GET)
- Utiliser `axios` et `fetch` 
- Gérer le chargement et les erreurs
- Implémenter un thème clair/sombre persistant avec AsyncStorage
- Implémenter un mode hors ligne avec SQLite
- Ajouter, modifier et afficher des tâches hors ligne

---

## 🛠️ Technologies utilisées
- React Native (Expo)
- Axios
- Fetch API
- AsyncStorage
- SQLite (expo-sqlite)
- API JSONPlaceholder

---

## 🌐 API utilisée
https://jsonplaceholder.typicode.com/todos

yaml
Copier le code

---

## 📦 Installation des dépendances
```bash
npm install axios
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite
📁 Structure du projet
bash
Copier le code
/context
  └── ThemeContext.js

/screens
  ├── TodoListFetchScreen.js
  └── TodoListOfflineScreen.js

/services
  ├── api.js
  └── database.js

App.js
🔗 Connexion à une API distante (GET)
📄 services/api.js
Récupération des tâches via :

Axios

Fetch

Limitation à 10 tâches

📲 Affichage des tâches (Online)
📄 TodoListFetchScreen.js
Fonctionnalités :

Chargement des données depuis l’API

Affichage d’un loader pendant le chargement

Gestion des erreurs

Changement de thème clair / sombre

🌗 Thème persistant (AsyncStorage)
📄 ThemeContext.js
Fonctionnalités :

Stockage du thème (light / dark)

Récupération automatique au lancement

Persistance même après fermeture de l’application

🗃️ Mode hors ligne avec SQLite
📄 services/database.js
Fonctionnalités :

Création de la base de données todos.db

Table todos

Ajouter une tâche hors ligne

Modifier une tâche hors ligne

Charger toutes les tâches

📵 Gestion des tâches hors ligne
📄 TodoListOfflineScreen.js
Fonctionnalités :

Ajouter une tâche hors ligne

Modifier une tâche existante

Afficher toutes les tâches stockées localement

Interface simple et intuitive

Compatible avec le thème clair/sombre

🚀 Initialisation SQLite
📄 App.js
Initialisation de la base SQLite au démarrage

Affichage d’un loader pendant la préparation

Chargement sécurisé de l’application

🧪 Tests demandés
Vérifier le chargement des tâches depuis l’API

Modifier volontairement l’URL pour déclencher une erreur

Ajouter un délai artificiel pour observer le loader

Tester le mode hors ligne sans connexion internet

➕ Exercice supplémentaire
Supprimer une tâche hors ligne (SQLite)
À faire :

Ajouter un bouton 🗑️ à côté de chaque tâche

Supprimer la tâche de SQLite

Rafraîchir la liste automatiquement

✅ Résultat attendu
Application fonctionnelle en ligne et hors ligne

Données persistantes

Thème sauvegardé

Code structuré et maintenable

👨‍🎓 Réalisé par Haddouali Yassine
Étudiant EMSI – Cycle Ingénieur
Module : React Native
