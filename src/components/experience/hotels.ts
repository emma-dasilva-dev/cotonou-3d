export type HotelFact = {
  label: string;
  value: string;
};

export type HotelStudy = {
  id: string;
  index: string;
  name: string;
  shortName: string;
  descriptor: string;
  position: [number, number, number];
  location: string;
  summary: string;
  facts: HotelFact[];
  website: string;
  exteriorReady?: boolean;
};

export const hotelStudies: HotelStudy[] = [
  {
    id: "sofitel",
    index: "01",
    name: "Sofitel Cotonou Marina",
    shortName: "Sofitel",
    descriptor: "Étude Marina",
    position: [-4.7, 0, -2.2],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel cinq étoiles contemporain face au golfe de Guinée, pensé autour de la lumière côtière, des jardins paysagers et du dialogue entre sable, océan et végétation.",
    facts: [
      { label: "Classement", value: "★★★★★" },
      { label: "Cadre", value: "Golfe de Guinée" },
      { label: "Style", value: "Contemporain côtier" },
    ],
    website: "https://sofitel.accor.com/fr/hotels/B845.html",
  },
  {
    id: "golden-tulip",
    index: "02",
    name: "Golden Tulip Le Diplomate",
    shortName: "Golden Tulip",
    descriptor: "Étude Boulevard",
    position: [-1.7, 0, -3.1],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel quatre étoiles urbain sur le boulevard de la Marina, mêlant hébergement d'affaires, piscine extérieure, restauration, espaces événementiels et proximité avec l'Atlantique.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Capacité", value: "139 chambres et suites" },
      { label: "Cadre", value: "Boulevard de la Marina" },
    ],
    website: "https://diplomate-cotonou.goldentulip.com/en-us/",
  },
  {
    id: "novotel",
    index: "03",
    name: "Novotel Cotonou Orisha",
    shortName: "Novotel",
    descriptor: "Étude Jardin",
    position: [1.7, 0, -2.1],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel quatre étoiles rénové au cœur d'un jardin arboré de sept hectares, avec un design contemporain, une piscine et une atmosphère plus calme proche du littoral.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Jardin", value: "7 hectares" },
      { label: "Capacité", value: "110 chambres" },
    ],
    website: "https://all.accor.com/hotel/1826/index.fr.shtml",
  },
  {
    id: "hotel-du-lac",
    index: "04",
    name: "Hôtel du Lac",
    shortName: "Hôtel du Lac",
    descriptor: "Étude Lagune",
    position: [4.6, 0, 1.7],
    location: "Lac Nokoué · Cotonou",
    summary:
      "Un hôtel trois étoiles installé sur les rives du lac Nokoué, connu pour son cadre paisible au bord de l'eau, ses vues sur le lac et ses espaces extérieurs autour de la piscine.",
    facts: [
      { label: "Classement", value: "★★★" },
      { label: "Cadre", value: "Lac Nokoué" },
      { label: "Espaces", value: "Piscine · Restaurant · Vue lac" },
    ],
    website: "https://www.hoteldulac-benin.com/",
    exteriorReady: true,
  },
  {
    id: "azalai",
    index: "05",
    name: "Azalaï Hôtel Cotonou",
    shortName: "Azalaï",
    descriptor: "Étude Littoral",
    position: [1.6, 0, 2.9],
    location: "Front de mer · Cotonou",
    summary:
      "Un hôtel emblématique du front de mer de Cotonou, avec 120 chambres dont des suites, des hébergements tournés vers la piscine ainsi que des espaces de restauration et d'événement.",
    facts: [
      { label: "Capacité", value: "120 chambres" },
      { label: "Suites", value: "12 suites" },
      { label: "Cadre", value: "Front de mer" },
    ],
    website: "https://www.azalai.com/azalai-hotel-cotonou",
  },
  {
    id: "maison-rouge",
    index: "06",
    name: "Maison Rouge Cotonou",
    shortName: "Maison Rouge",
    descriptor: "Étude Boutique",
    position: [-3.2, 0, 2.5],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel boutique quatre étoiles à l'échelle plus intime, mêlant design soigné, art africain contemporain, jardins, deux piscines et terrasse panoramique face à la mer.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Piscines", value: "2 piscines extérieures" },
      { label: "Style", value: "Boutique · Art · Jardin" },
    ],
    website: "https://hotel-benin-maison-rouge-cotonou.com/en/hotel-cotonou-benin/",
  },
];
