# 🗣️ AphasiaVoice

**AphasiaVoice** est une application web progressive (PWA) conçue comme une aide à la communication accessible pour les patients post-AVC ou souffrant d'aphasie. Elle privilégie une interface à fort contraste, des interactions simples et une synthèse vocale instantanée.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)

## ✨ Fonctionnalités

### 🏥 Pour le Patient (Mode Utilisateur)
*   **Text-to-Speech (TTS) :** Lecture vocale instantanée en français lors du clic sur une tuile.
*   **Interface Accessible :** Contraste élevé (Dark Mode), grandes icônes, et polices lisibles.
*   **Navigation Intuitive :** Navigation par onglets ou par "Swipe" (glisser le doigt).
*   **Catégories Rapides :**
    *   **Binaire :** OUI / NON (Plein écran pour accès rapide).
    *   **Besoins :** Boire, Manger, Toilettes, Douleur, Dormir, Aide.
*   **Support Mobile :** Optimisé pour iOS (iPhone/iPad) avec gestion de l'encoche (Notch) et icône d'accueil.

### 🛠️ Pour l'Aidant / Orthophoniste (Mode Administrateur)
*   **Mode Édition Sécurisé :** Déverrouillage par glissement + Code PIN.
*   **Personnalisation Totale :**
    *   Ajouter de nouvelles tuiles personnalisées.
    *   Modifier le texte, la phrase prononcée, la couleur et l'icône.
    *   Changer la taille des tuiles (1 case ou 2 cases).
*   **Drag & Drop :** Réorganiser les tuiles par appui long.
*   **Bibliothèque Rapide :** Glisser-déposer des préréglages courants.
*   **Persistance :** Les modifications sont sauvegardées automatiquement sur l'appareil.

## 🚀 Installation & Démarrage

### Prérequis
*   Node.js installé sur votre machine.

### Installation Locale
1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/BaronFrancois/AphasiaVoice.git
    cd AphasiaVoice
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Lancer le serveur de développement :
    ```bash
    npm start
    ```

## 📱 Installation sur Mobile (iOS & Android)

Cette application est une **PWA (Progressive Web App)**. Elle n'a pas besoin de passer par l'App Store pour être installée.

### Sur iPhone / iPad (iOS)
1.  Ouvrez le site hébergé dans **Safari**.
2.  Appuyez sur le bouton **Partager** (carré avec une flèche vers le haut).
3.  Faites défiler vers le bas et sélectionnez **"Sur l'écran d'accueil"**.
4.  Appuyez sur **Ajouter**.

*L'application apparaîtra comme une app native, sans barre d'adresse, et fonctionnera en plein écran.*

## ⚙️ Configuration (Mode Admin)

Pour modifier les grilles de communication :

1.  Cliquez sur le **cadenas** en haut à droite.
2.  Effectuez le glissement pour déverrouiller.
3.  Entrez le code PIN par défaut : **`1234`**.
4.  **Pour ajouter :** Utilisez le bouton "+" ou la bibliothèque en bas.
5.  **Pour modifier/supprimer :** Cliquez sur une tuile en mode édition.
6.  **Pour déplacer :** Maintenez le doigt sur une tuile (appui long) puis glissez-la.

## 🛠️ Stack Technique

*   **Frontend :** React 19
*   **Styling :** Tailwind CSS
*   **Icônes :** Lucide React
*   **Synthèse Vocale :** Web Speech API (Native browser support)
*   **Stockage :** LocalStorage (Aucune base de données requise)

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.