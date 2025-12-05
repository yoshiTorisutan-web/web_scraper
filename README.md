# 🌐 Web Content Scraper

Application Next.js moderne pour récupérer et analyser le contenu HTML, CSS et JavaScript de n'importe quelle page web accessible publiquement.

![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Fonctionnalités

- 🎨 **Interface moderne** avec Tailwind CSS et dégradés élégants
- 📄 **Extraction séparée** du HTML, CSS et JavaScript
- 🔄 **Séparation intelligente** - Le HTML est nettoyé sans balises `<style>` et `<script>`
- 📋 **Copie en un clic** - Copiez le code dans le presse-papier
- 💾 **Téléchargement** - Téléchargez chaque type de fichier séparément
- 🕐 **Historique** - Menu déroulant avec les 10 dernières URLs analysées
- ⚡ **Chargement instantané** - Rechargez une URL depuis l'historique sans nouvelle requête
- 🗑️ **Gestion de l'historique** - Supprimez les entrées individuellement
- 💾 **Persistance** - L'historique est sauvegardé dans le navigateur
- 📊 **Compteur de caractères** - Voyez la taille de chaque section
- 🎯 **Design responsive** - Fonctionne sur tous les écrans

## 🚀 Installation

### Prérequis

- Node.js 16+ installé sur votre machine
- npm ou yarn

### Étapes d'installation

1. **Cloner ou créer le projet**

```bash
npx create-next-app@latest web-scraper
cd web-scraper
```

Lors de l'installation, choisissez :
- ❌ TypeScript: No
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ❌ src/ directory: No
- ❌ App Router: No (utilisez Pages Router)
- ❌ Import alias: No

2. **Installer les dépendances**

```bash
npm install axios cheerio lucide-react
```

3. **Créer la structure des fichiers**

```
web-scraper/
├── pages/
│   ├── api/
│   │   └── scrape.js      # API backend
│   └── index.js           # Page principale
├── public/
├── styles/
│   └── globals.css
├── package.json
└── README.md
```

4. **Copier les fichiers**

- Copiez le code fourni dans `pages/index.js`
- Copiez le code de l'API dans `pages/api/scrape.js`

5. **Lancer le projet**

```bash
npm run dev
```

6. **Ouvrir dans le navigateur**

Accédez à [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

### Analyser une page web

1. Entrez l'URL d'un site web dans le champ de saisie
2. Cliquez sur "Analyser" ou appuyez sur Entrée
3. Attendez quelques secondes pendant le chargement
4. Naviguez entre les onglets HTML, CSS et JavaScript

### Utiliser l'historique

1. Après avoir analysé une URL, une icône d'horloge 🕐 apparaît dans le champ
2. Cliquez dessus pour ouvrir le menu déroulant
3. Cliquez sur une URL pour charger instantanément son contenu
4. Utilisez l'icône 🗑️ pour supprimer une entrée

### Copier ou télécharger

- **Copier** : Cliquez sur le bouton "Copier" pour mettre le code dans le presse-papier
- **Télécharger** : Cliquez sur "Télécharger" pour sauvegarder en fichier (.html, .css, .js)

## 🛠️ Technologies utilisées

- **[Next.js](https://nextjs.org/)** - Framework React pour applications web
- **[React](https://react.dev/)** - Bibliothèque JavaScript pour interfaces utilisateur
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Axios](https://axios-http.com/)** - Client HTTP pour requêtes
- **[Cheerio](https://cheerio.js.org/)** - Parser HTML côté serveur
- **[Lucide React](https://lucide.dev/)** - Icônes modernes

## 📁 Structure du code

### Frontend (`pages/index.js`)

- Interface utilisateur React avec hooks (useState, useEffect)
- Gestion de l'historique avec localStorage
- Nettoyage du HTML pour retirer CSS et JS inline
- Système de copie dans le presse-papier
- Téléchargement de fichiers avec Blob API

### Backend (`pages/api/scrape.js`)

- Route API Next.js
- Récupération du contenu avec Axios
- Parsing HTML avec Cheerio
- Extraction séparée du HTML, CSS et JavaScript
- Gestion des erreurs et timeouts

## ⚙️ Configuration

### Modifier le timeout

Dans `pages/api/scrape.js`, ligne 22 :

```javascript
timeout: 10000  // 10 secondes (10000ms)
```

### Modifier le nombre d'entrées dans l'historique

Dans `pages/index.js`, fonction `saveToHistory` :

```javascript
.slice(0, 10)  // Limite à 10 entrées
```

## 🔒 Limitations

- ⚠️ Certains sites bloquent le scraping (protection CORS, anti-bot)
- ⚠️ Les sites avec authentification ne sont pas accessibles
- ⚠️ Les fichiers CSS/JS externes ne sont pas téléchargés (seulement les liens)
- ⚠️ Timeout de 10 secondes par requête

## 🧪 Sites de test recommandés

```
https://example.com
https://github.com
https://wikipedia.org
https://developer.mozilla.org
```

## 🐛 Résolution de problèmes

### Erreur "Method not allowed"
- Vérifiez que `pages/api/scrape.js` existe bien
- Redémarrez le serveur de développement

### Erreur "CORS"
- Certains sites bloquent les requêtes externes
- Essayez avec un autre site

### L'historique ne se charge pas
- Vérifiez que JavaScript est activé
- Vérifiez les permissions localStorage dans votre navigateur

### Timeout
- Le site est peut-être trop lent
- Augmentez le timeout dans `scrape.js`

## 📝 License

Ce projet est open source et disponible sous licence MIT.

## 👨‍💻 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des nouvelles fonctionnalités
- Améliorer la documentation

## 🙏 Crédits

Développé avec ❤️ en utilisant Next.js et React.

---

**Note** : Respectez toujours les conditions d'utilisation des sites web et les lois sur le scraping dans votre juridiction.