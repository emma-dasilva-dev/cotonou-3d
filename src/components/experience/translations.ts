import type { HotelStudy } from "./hotels";

export type Language = "fr" | "en";

type HotelTranslation = Pick<
  HotelStudy,
  | "descriptor"
  | "location"
  | "summary"
  | "facts"
  | "studyContext"
  | "architecturalReading"
  | "cityRelationship"
>;

export const hotelTranslations: Record<string, HotelTranslation> = {
  sofitel: {
    descriptor: "Marina Study",
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A contemporary five-star hotel facing the Gulf of Guinea, shaped around coastal light, landscaped gardens and the dialogue between sand, ocean and vegetation.",
    facts: [
      { label: "Rating", value: "★★★★★" },
      { label: "Setting", value: "Gulf of Guinea" },
      { label: "Style", value: "Contemporary coastal" },
    ],
    studyContext: "Gulf of Guinea",
    architecturalReading:
      "In this study, the Sofitel reads as large-scale coastal architecture: a highly regular façade, repeated terraces and a landscaped base give the building a monumental presence facing the shoreline.",
    cityRelationship:
      "Its relationship with Cotonou is defined above all by the seafront. The hotel frames light, vegetation and the marine horizon as direct extensions of the architecture.",
  },
  "golden-tulip": {
    descriptor: "Boulevard Study",
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A four-star urban hotel on Boulevard de la Marina, combining business accommodation, an outdoor pool, dining, event spaces and proximity to the Atlantic.",
    facts: [
      { label: "Rating", value: "★★★★" },
      { label: "Capacity", value: "139 rooms and suites" },
      { label: "Setting", value: "Boulevard de la Marina" },
    ],
    studyContext: "Boulevard de la Marina",
    architecturalReading:
      "The Golden Tulip is read here as a more rational urban façade: horizontal volumes, a repeated window grid and a clearly marked entrance give the building a more institutional, metropolitan character.",
    cityRelationship:
      "Located on Boulevard de la Marina, it represents a form of hospitality directly tied to the city's flows, business travel and the logic of a major urban axis.",
  },
  novotel: {
    descriptor: "Garden Study",
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A renovated four-star hotel set within seven hectares of landscaped gardens, combining contemporary design, a pool and a quieter atmosphere close to the coast.",
    facts: [
      { label: "Rating", value: "★★★★" },
      { label: "Garden", value: "7 hectares" },
      { label: "Capacity", value: "110 rooms" },
    ],
    studyContext: "Landscaped garden · Pool",
    architecturalReading:
      "The Novotel is approached as architecture in which landscape matters as much as the building itself. Lower volumes, roofs, gardens and the pool create a more horizontal and breathable composition.",
    cityRelationship:
      "Its identity comes from the contrast between Boulevard de la Marina and the green retreat inside the property: a transition from urban intensity to a much calmer internal environment.",
  },
  "hotel-du-lac": {
    descriptor: "Lagoon Study",
    location: "Lake Nokoué · Cotonou",
    summary:
      "A three-star hotel on the shores of Lake Nokoué, known for its peaceful waterside setting, lake views and outdoor spaces arranged around the pool.",
    facts: [
      { label: "Rating", value: "★★★" },
      { label: "Setting", value: "Lake Nokoué" },
      { label: "Spaces", value: "Pool · Restaurant · Lake view" },
    ],
    studyContext: "Lake Nokoué",
    architecturalReading:
      "Here, the architectural reading is guided by water. The façade, terraces and outdoor spaces are understood as an ensemble oriented toward the lake rather than as an isolated volume.",
    cityRelationship:
      "Hôtel du Lac reveals another geography of Cotonou: the shores of Lake Nokoué, where hospitality is built around views, quietness and immediate proximity to the water.",
  },
  azalai: {
    descriptor: "Coastline Study",
    location: "Seafront · Cotonou",
    summary:
      "An emblematic hotel on Cotonou's seafront, with 120 rooms including suites, accommodation oriented toward the pool, and dedicated dining and event spaces.",
    facts: [
      { label: "Capacity", value: "120 rooms" },
      { label: "Suites", value: "12 suites" },
      { label: "Setting", value: "Seafront" },
    ],
    studyContext: "Atlantic Ocean · Pool",
    architecturalReading:
      "Azalaï stands out through a more vertical composition, a façade rhythm created by repeated openings, and a broad pool-and-garden ensemble that shapes how the site is perceived from outside.",
    cityRelationship:
      "Its proximity to the Atlantic gives the hotel a strong seafront identity. In this study, the pool, palm trees and horizon become as much a part of the urban reading as the building itself.",
  },
  "maison-rouge": {
    descriptor: "Boutique Study",
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A four-star boutique hotel at a more intimate scale, combining considered design, contemporary African art, gardens, two pools and a panoramic terrace facing the sea.",
    facts: [
      { label: "Rating", value: "★★★★" },
      { label: "Pools", value: "2 outdoor pools" },
      { label: "Style", value: "Boutique · Art · Garden" },
    ],
    studyContext: "Art · Gardens · Two pools",
    architecturalReading:
      "Maison Rouge is the most intimate study in the collection. Its more domestic scale, gardens, two pools and coloured accents make the experience feel closer to a composed house than to a large monolithic hotel.",
    cityRelationship:
      "Its relationship with Cotonou is expressed through art, gardens and proximity to the coast. It shows how a hotel can participate in the city through atmosphere and culture as much as through scale.",
  },
};

export function localizeHotel(hotel: HotelStudy, language: Language): HotelStudy {
  if (language === "fr") return hotel;

  const translation = hotelTranslations[hotel.id];
  if (!translation) return hotel;

  return {
    ...hotel,
    ...translation,
  };
}

export const experienceText = {
  fr: {
    interactiveCollection: "Collection interactive · 2026",
    cotonouBenin: "Cotonou, Bénin",
    architectureHospitality: "Architecture · Hôtellerie · WebGL",
    edition: "Édition",
    sixPlaces: "Six lieux · Une ville",
    introDescription:
      "Une étude interactive de six lieux d’hospitalité à Cotonou, entre architecture, paysage et vie urbaine.",
    enter: "Entrer",
    socialLinks: "Liens sociaux",
    explore: "Glisser · Zoomer · Explorer",
    returnHome: "Retourner à la page d’accueil",
    home: "Accueil",
    controls: "Contrôles de l’expérience",
    archives: "Archives",
    about: "À propos",
    sound: "Son",
    soundOff: "Couper le son",
    soundOn: "Activer le son",
    studyLabel: "Architecture · Paysage · Ville",
    exploreDesktop: "Glisser pour explorer · Faire défiler pour zoomer",
    exploreTouch: "Glisser pour explorer · Pincer pour zoomer",
    outdoorStudy: "Étude extérieure",
    returnToCotonou: "Retour à Cotonou",
    rotateDesktop: "Glisser pour tourner · Faire défiler pour zoomer",
    rotateTouch: "Glisser pour tourner · Pincer pour zoomer",
    selectHotel: "Sélectionner",
    language: "Langue",
  },
  en: {
    interactiveCollection: "Interactive collection · 2026",
    cotonouBenin: "Cotonou, Benin",
    architectureHospitality: "Architecture · Hospitality · WebGL",
    edition: "Edition",
    sixPlaces: "Six places · One city",
    introDescription:
      "An interactive study of six hospitality spaces in Cotonou, exploring architecture, landscape and urban life.",
    enter: "Enter",
    socialLinks: "Social links",
    explore: "Drag · Zoom · Explore",
    returnHome: "Return to the home page",
    home: "Home",
    controls: "Experience controls",
    archives: "Archives",
    about: "About",
    sound: "Sound",
    soundOff: "Mute sound",
    soundOn: "Enable sound",
    studyLabel: "Architecture · Landscape · City",
    exploreDesktop: "Drag to explore · Scroll to zoom",
    exploreTouch: "Drag to explore · Pinch to zoom",
    outdoorStudy: "Exterior study",
    returnToCotonou: "Back to Cotonou",
    rotateDesktop: "Drag to rotate · Scroll to zoom",
    rotateTouch: "Drag to rotate · Pinch to zoom",
    selectHotel: "Select",
    language: "Language",
  },
} as const;

export const panelText = {
  fr: {
    aboutHotel: "À propos de",
    specialEdition: "Édition spéciale",
    journalPrefix: "Le Journal de",
    architectureHospitality: "Architecture & hospitalité",
    countryYear: "2026 · Bénin",
    closeHotel: "Fermer les informations sur l’hôtel",
    close: "Fermer",
    chronicle: "Chronique",
    address: "Une adresse de Cotonou",
    inBrief: "En bref",
    architecturalReading: "Lecture architecturale",
    cityRelationship: "Rapport à la ville",
    independentStudy: "Étude visuelle indépendante",
    publicSources: "Sources publiques · Cotonou / 3D",
    officialSite: "Visiter le site officiel",
  },
  en: {
    aboutHotel: "About",
    specialEdition: "Special edition",
    journalPrefix: "The Cotonou",
    architectureHospitality: "Architecture & hospitality",
    countryYear: "2026 · Benin",
    closeHotel: "Close hotel information",
    close: "Close",
    chronicle: "Feature",
    address: "A Cotonou address",
    inBrief: "At a glance",
    architecturalReading: "Architectural reading",
    cityRelationship: "Relationship with the city",
    independentStudy: "Independent visual study",
    publicSources: "Public sources · Cotonou / 3D",
    officialSite: "Visit official website",
  },
} as const;

export const archiveText = {
  fr: {
    aria: "Archives Cotonou 3D",
    collection: "Collection 2026",
    theCollection: "La collection",
    title: "Les Archives",
    close: "Fermer les archives",
    sixReadings: "Six lectures de Cotonou",
    compare: "Comparez architecture, paysage et ville",
    theme: "Architecture · Paysage · Ville",
    openStudy: "Ouvrir l’étude",
    footer: "Une étude interactive de l’hospitalité à Cotonou",
  },
  en: {
    aria: "Cotonou 3D Archives",
    collection: "2026 Collection",
    theCollection: "The collection",
    title: "The Archives",
    close: "Close archives",
    sixReadings: "Six readings of Cotonou",
    compare: "Compare architecture, landscape and city",
    theme: "Architecture · Landscape · City",
    openStudy: "Open study",
    footer: "An interactive study of hospitality in Cotonou",
  },
} as const;

export const aboutText = {
  fr: {
    aria: "À propos de Cotonou 3D",
    subtitle: "Étude interactive indépendante",
    close: "Fermer à propos",
    project: "Le projet",
    title: "Explorer Cotonou à travers ses lieux d’hospitalité.",
    intro:
      "COTONOU / 3D est une étude interactive de six hôtels de la ville. L’expérience observe comment architecture, paysage, eau, végétation, rues et mouvement donnent à chaque adresse une présence différente.",
    observeLabel: "01 · Observer",
    observeTitle: "Une ville, pas six objets isolés.",
    observeBody:
      "Les bâtiments prennent sens avec leurs routes, leurs jardins, leurs piscines, les passants, la circulation et les paysages qui les entourent.",
    compareLabel: "02 · Comparer",
    compareTitle: "Six façons d’habiter Cotonou.",
    compareBody:
      "Grand hôtel côtier, adresse urbaine, jardin-hôtel, bord de lac ou maison boutique : chaque étude met en évidence une relation différente entre hospitalité et ville.",
    understandLabel: "03 · Comprendre",
    understandTitle: "L’architecture comme récit.",
    understandBody:
      "Les articles ne se limitent pas aux services proposés. Ils donnent une lecture de la façade, du paysage et du rapport de chaque lieu à son environnement.",
    journey: "Observer → Explorer → Découvrir → Comprendre → Revenir",
    placeYear: "Cotonou · Bénin · 2026",
  },
  en: {
    aria: "About Cotonou 3D",
    subtitle: "Independent interactive study",
    close: "Close about panel",
    project: "The project",
    title: "Explore Cotonou through its hospitality spaces.",
    intro:
      "COTONOU / 3D is an interactive study of six hotels in the city. The experience looks at how architecture, landscape, water, vegetation, streets and movement give each address a distinct presence.",
    observeLabel: "01 · Observe",
    observeTitle: "One city, not six isolated objects.",
    observeBody:
      "The buildings gain meaning through their roads, gardens, pools, pedestrians, traffic and the landscapes that surround them.",
    compareLabel: "02 · Compare",
    compareTitle: "Six ways of inhabiting Cotonou.",
    compareBody:
      "Coastal grand hotel, urban address, garden hotel, lakeside retreat or boutique house: each study reveals a different relationship between hospitality and the city.",
    understandLabel: "03 · Understand",
    understandTitle: "Architecture as narrative.",
    understandBody:
      "The articles go beyond listed services. They offer a reading of the façade, the landscape and each place's relationship with its surroundings.",
    journey: "Observe → Explore → Discover → Understand → Return",
    placeYear: "Cotonou · Benin · 2026",
  },
} as const;

export const transitionText = {
  fr: {
    journal: "Le Journal de Cotonou",
  },
  en: {
    journal: "The Cotonou Journal",
  },
} as const;

export const landmarkText = {
  fr: {
    amazone: "Monument de l’Amazone",
    redStar: "Étoile Rouge",
    bioGuera: "Monument Bio Guera",
  },
  en: {
    amazone: "Amazon Monument",
    redStar: "Red Star",
    bioGuera: "Bio Guera Monument",
  },
} as const;
