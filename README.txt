===== 🎮 FLIT – Gestion d’inventaire Star Citizen 🎮 =====

Présentation de FLIT
--------------------
Flit est un groupe multigaming créé par cptnchoco, petit streamer sur Twitch.  
Depuis 2016, nous parcourons divers jeux multi ensemble en attendant Star Citizen.  
FLIT, c’est une organisation structurée mais non élitiste.  
Le meilleur des groupes hardcore, sans la prise de tête ni les obligations fortes. 🤝

Pour nous rejoindre :  
• Discord : https://discord.gg/zY4eUSSVsR 🔗  
• Twitch  : twitch.tv/cptnchoco 📺  
• RSI     : https://robertsspaceindustries.com/en/orgs/FLIT 🚀

Description
-----------
Gestion d’inventaire Star Citizen via Discord et interface Web Next.js.

Pour qui ?  
Corporations disposant d’un serveur Discord

Pour quoi ?  
Avoir une visibilité sur les loots, modules, etc. entre joueurs 📦

Prérequis
---------
• Node.js ≥ 18  
• Projet Supabase configuré (schema & RLS)  
• Application Discord (Client ID & Secret)  
• (Optionnel) Webhook Discord pour notifications  

Installation
------------
1. Cloner le dépôt :  
   git clone https://github.com/cptnchoco/flit.git  
   cd flit

2. Copier & renommer le fichier d’exemple :  
   cp .env.example .env.local  
   Éditez `.env.local` avec vos clés

3. Installer les dépendances :  
   npm ci

4. Lancer en développement :  
   npm run dev  
   → http://localhost:3000

Configuration
-------------
Éditez `.env.local` :

DISCORD_CLIENT_ID=…  
DISCORD_CLIENT_SECRET=…  
NEXTAUTH_SECRET=…  
NEXTAUTH_URL=http://localhost:3000  
SUPABASE_URL=https://votre-projet.supabase.co  
SUPABASE_ANON_KEY=…  
SUPABASE_SERVICE_ROLE_KEY=…  
DISCORD_WEBHOOK_URL=…  (optionnel)

Base de données
---------------
Dans Supabase → SQL Editor, exécutez :  
1. `sql/schema.sql`   → Crée les tables `users` & `inventory`  
2. `sql/policies.sql` → Active RLS et définit les policies  

Vérifiez que RLS limite l’accès à `auth.uid() = user_id`.

Scripts disponibles
------------------
npm run dev       → Serveur dev (http://localhost:3000)  
npm run build     → Génère le build de prod  
npm run start     → Démarre le serveur prod  
npm run audit     → Analyse des vulnérabilités  
npm run audit:fix → Correction automatique des vulnérabilités  

Déploiement
-----------
1. Poussez sur GitHub  
2. Créez un projet sur Vercel  
3. Ajoutez vos variables d’environnement (sans commentaires)  
4. Déployez : Vercel détecte Next.js et lance le build 🌐

Support & Contributions
-----------------------
Issues et PR sont bienvenues sur GitHub :  
https://github.com/cptnchoco/flit

---

FLIT © 2024 cptnchoco — Licence MIT  
