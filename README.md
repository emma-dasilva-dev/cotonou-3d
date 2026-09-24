# COTONOU / 3D

**COTONOU / 3D** est une expérience WebGL interactive consacrée à l’architecture, à l’hospitalité et à la vie urbaine de Cotonou, au Bénin.

Le projet propose une représentation 3D stylisée de la ville à travers plusieurs hôtels, monuments emblématiques, routes, piétons, véhicules et éléments paysagers.

L’objectif n’est pas de reproduire Cotonou comme un jumeau numérique exact, mais de créer une **étude visuelle et interactive** permettant d’explorer différentes façons dont l’architecture, le paysage, l’eau et le mouvement participent à l’identité de la ville.

---

## Concept

L’expérience suit un parcours simple :

**Observer → Explorer → Découvrir → Comprendre → Revenir**

Depuis une vue générale de Cotonou, l’utilisateur peut naviguer dans un monde miniature, sélectionner un hôtel, s’en approcher grâce à une transition caméra, consulter une fiche éditoriale puis revenir librement à la ville.

---

## Fonctionnalités

### Monde 3D interactif

- scène WebGL entièrement interactive ;
- navigation orbitale par glisser-déposer ;
- zoom à la molette sur ordinateur ;
- zoom par pincement sur mobile et tablette ;
- caméra générale responsive selon la taille de l’écran ;
- vues caméra dédiées lors de la sélection d’un hôtel ;
- éclairage, brouillard, eau, végétation et environnement urbain stylisé.

### Six hôtels modélisés

Le projet présente actuellement six établissements de Cotonou :

- **Sofitel Cotonou Marina**
- **Golden Tulip Le Diplomate**
- **Novotel Cotonou Orisha**
- **Hôtel du Lac**
- **Azalaï Hôtel Cotonou**
- **Maison Rouge Cotonou**

Chaque hôtel possède :

- une architecture extérieure 3D spécifique ;
- un marqueur interactif ;
- une caméra de focus dédiée ;
- une courte présentation ;
- plusieurs informations essentielles ;
- une lecture architecturale ;
- une section sur son rapport à la ville ;
- un lien vers son site officiel.

### Monuments de Cotonou

Le monde comprend également des représentations 3D stylisées de plusieurs repères urbains :

- **Monument de l’Amazone**
- **Étoile Rouge**
- **Monument Bio Guera**

Ils servent de points de repère culturels et urbains dans la composition de la ville.

### Ville animée

L’environnement ne reste pas figé :

- voitures animées sur des routes dédiées ;
- trajectoires avec virages et boucles de circulation ;
- trottoirs séparés des voies automobiles ;
- piétons animés avec mouvements des bras et des jambes ;
- déplacements limités aux chemins piétons afin d’éviter les collisions avec les hôtels ;
- routes et zones de circulation maintenues à distance des piscines, terrasses et espaces extérieurs des hôtels.

### Transitions cinématiques

Lorsqu’un hôtel est sélectionné :

- la caméra quitte progressivement la vue générale ;
- l’hôtel devient le point central de l’expérience ;
- une transition inspirée d’un journal imprimé apparaît ;
- la fiche éditoriale s’ouvre après la transition.

La fermeture de la fiche ramène directement l’utilisateur vers la vue générale de Cotonou.

### Articles éditoriaux

Chaque hôtel dispose d’un panneau inspiré d’une mise en page de journal comprenant :

- nom et localisation ;
- résumé du lieu ;
- informations principales ;
- **lecture architecturale** ;
- **rapport à la ville** ;
- contexte de l’étude ;
- accès au site officiel.

L’idée est de ne pas seulement montrer les bâtiments, mais d’expliquer comment ils s’inscrivent dans leur environnement.

### Archives

Une section **Archives** permet de retrouver les six études dans une vue éditoriale dédiée et d’ouvrir directement l’établissement souhaité.

### À propos

Le panneau **À propos** présente la démarche de COTONOU / 3D autour de trois axes :

1. **Observer** la ville comme un ensemble vivant ;
2. **Comparer** différentes formes d’hospitalité et d’architecture ;
3. **Comprendre** le lien entre bâtiment, paysage et environnement urbain.

### Écran d’entrée

L’expérience commence par une couverture éditoriale premium avec :

- identité **COTONOU / 3D** ;
- coordonnées de Cotonou ;
- édition 2026 ;
- présentation du concept ;
- bouton **Entrer** ;
- animation d’apparition GSAP ;
- transition douce vers la scène 3D.

### Ambiance sonore

Une ambiance sonore peut accompagner l’exploration.

Le son peut être activé ou coupé directement depuis l’interface.

### Responsive

Le projet est conçu pour fonctionner sur :

- ordinateur ;
- tablette ;
- smartphone.

Des comportements spécifiques sont prévus pour les écrans tactiles, notamment :

- zones tactiles plus grandes ;
- caméra plus reculée ;
- panneaux plein écran ;
- navigation par glisser et pincement ;
- gestion des safe areas mobiles.

---

## Technologies

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Three.js**
- **React Three Fiber**
- **React Three Drei**
- **GSAP**
- **Tailwind CSS 4**

---

## Structure principale

```text
src/
├── app/
│   └── globals.css
└── components/
    └── experience/
        ├── CotonouExperience.tsx
        ├── CotonouScene.tsx
        ├── CityLife.tsx
        ├── CotonouLandmarks.tsx
        ├── HotelInfoPanel.tsx
        ├── ArchivePanel.tsx
        ├── AboutPanel.tsx
        ├── NewspaperTransition.tsx
        ├── SofitelExterior.tsx
        ├── GoldenTulipExterior.tsx
        ├── NovotelExterior.tsx
        ├── HotelDuLacExterior.tsx
        ├── AzalaiExterior.tsx
        ├── MaisonRougeExterior.tsx
        └── hotels.ts
```

---

## Installation

Cloner le projet :

```bash
git clone https://github.com/emma-dasilva-dev/cotonou-3d.git
cd cotonou-3d
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

---

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Direction du projet

COTONOU / 3D est pensé comme une **exposition numérique interactive**, et non comme un site de réservation ou un annuaire hôtelier.

Le projet cherche à raconter Cotonou à travers :

**architecture · paysage · eau · végétation · rues · mouvement · hospitalité**

Les modèles 3D sont des interprétations visuelles stylisées réalisées pour l’expérience et ne constituent pas des reproductions architecturales exactes.

---

## Auteur

**Emma Da Silva**

Développement, conception interactive et direction visuelle du projet.
