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
  studyContext?: string;
  architecturalReading: string;
  cityRelationship: string;
};

export const hotelStudies: HotelStudy[] = [
  {
    id: "sofitel",
    index: "01",
    name: "Sofitel Cotonou Marina",
    shortName: "Sofitel",
    descriptor: "Étude Marina",
    position: [-9.0, 0, -5.0],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel cinq étoiles contemporain face au golfe de Guinée, pensé autour de la lumière côtière, des jardins paysagers et du dialogue entre sable, océan et végétation.",
    facts: [
      { label: "Classement", value: "★★★★★" },
      { label: "Cadre", value: "Golfe de Guinée" },
      { label: "Style", value: "Contemporain côtier" },
    ],
    website: "https://sofitel.accor.com/fr/hotels/B845.html",
    exteriorReady: true,
    studyContext: "Golfe de Guinée",
    architecturalReading:
      "Dans cette étude, le Sofitel se lit comme une architecture côtière de grande échelle : une façade très régulière, des terrasses répétées et un socle paysager qui installent une présence monumentale face au littoral.",
    cityRelationship:
      "Son rapport à Cotonou passe surtout par le front de mer. L’hôtel met en scène la lumière, la végétation et l’horizon marin comme prolongement direct de l’architecture.",
  },
  {
    id: "golden-tulip",
    index: "02",
    name: "Golden Tulip Le Diplomate",
    shortName: "Golden Tulip",
    descriptor: "Étude Boulevard",
    position: [0.0, 0, -6.0],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel quatre étoiles urbain sur le boulevard de la Marina, mêlant hébergement d'affaires, piscine extérieure, restauration, espaces événementiels et proximité avec l'Atlantique.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Capacité", value: "139 chambres et suites" },
      { label: "Cadre", value: "Boulevard de la Marina" },
    ],
    website: "https://diplomate-cotonou.goldentulip.com/en-us/",
    exteriorReady: true,
    studyContext: "Boulevard de la Marina",
    architecturalReading:
      "Le Golden Tulip est lu ici comme une façade urbaine plus rationnelle : volumes horizontaux, trame répétitive des ouvertures et entrée marquée donnent au bâtiment un caractère plus institutionnel et métropolitain.",
    cityRelationship:
      "Installé sur le boulevard de la Marina, il représente une hospitalité directement liée aux flux de la ville, aux déplacements professionnels et à la logique du grand axe urbain.",
  },
  {
    id: "novotel",
    index: "03",
    name: "Novotel Cotonou Orisha",
    shortName: "Novotel",
    descriptor: "Étude Jardin",
    position: [9.0, 0, -5.0],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel quatre étoiles rénové au cœur d'un jardin arboré de sept hectares, avec un design contemporain, une piscine et une atmosphère plus calme proche du littoral.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Jardin", value: "7 hectares" },
      { label: "Capacité", value: "110 chambres" },
    ],
    website: "https://all.accor.com/hotel/1826/index.fr.shtml",
    exteriorReady: true,
    studyContext: "Jardin arboré · Piscine",
    architecturalReading:
      "Le Novotel est abordé comme une architecture où le paysage compte autant que le bâtiment. Les volumes plus bas, les toitures, les jardins et la piscine créent une composition plus horizontale et plus respirante.",
    cityRelationship:
      "Son identité vient du contraste entre le boulevard de la Marina et le retrait végétal du site : une transition entre l’intensité urbaine et un environnement intérieur beaucoup plus calme.",
  },
  {
    id: "hotel-du-lac",
    index: "04",
    name: "Hôtel du Lac",
    shortName: "Hôtel du Lac",
    descriptor: "Étude Lagune",
    position: [8.5, 0, 4.2],
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
    studyContext: "Lac Nokoué",
    architecturalReading:
      "Ici, la lecture architecturale est guidée par l’eau. La façade, les terrasses et les espaces extérieurs se comprennent comme un ensemble orienté vers le lac plutôt que comme un simple volume autonome.",
    cityRelationship:
      "Hôtel du Lac montre une autre géographie de Cotonou : celle des rives du lac Nokoué, où l’hospitalité se construit autour de la vue, du calme et de la proximité immédiate de l’eau.",
  },
  {
    id: "azalai",
    index: "05",
    name: "Azalaï Hôtel Cotonou",
    shortName: "Azalaï",
    descriptor: "Étude Littoral",
    position: [0.5, 0, 5.0],
    location: "Front de mer · Cotonou",
    summary:
      "Un hôtel emblématique du front de mer de Cotonou, avec 120 chambres dont des suites, des hébergements tournés vers la piscine ainsi que des espaces de restauration et d'événement.",
    facts: [
      { label: "Capacité", value: "120 chambres" },
      { label: "Suites", value: "12 suites" },
      { label: "Cadre", value: "Front de mer" },
    ],
    website: "https://www.azalai.com/azalai-hotel-cotonou",
    exteriorReady: true,
    studyContext: "Océan Atlantique · Piscine",
    architecturalReading:
      "L’Azalaï se distingue par une composition plus verticale, une façade rythmée par les ouvertures et un vaste ensemble piscine-jardin qui structure la perception du site depuis l’extérieur.",
    cityRelationship:
      "La proximité de l’Atlantique donne au lieu une identité de front de mer. Dans cette étude, la piscine, les palmiers et l’horizon deviennent autant d’éléments urbains que le bâtiment lui-même.",
  },
  {
    id: "maison-rouge",
    index: "06",
    name: "Maison Rouge Cotonou",
    shortName: "Maison Rouge",
    descriptor: "Étude Boutique",
    position: [-8.5, 0, 4.3],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "Un hôtel boutique quatre étoiles à l'échelle plus intime, mêlant design soigné, art africain contemporain, jardins, deux piscines et terrasse panoramique face à la mer.",
    facts: [
      { label: "Classement", value: "★★★★" },
      { label: "Piscines", value: "2 piscines extérieures" },
      { label: "Style", value: "Boutique · Art · Jardin" },
    ],
    website: "https://hotel-benin-maison-rouge-cotonou.com/en/hotel-cotonou-benin/",
    exteriorReady: true,
    studyContext: "Art · Jardins · Deux piscines",
    architecturalReading:
      "Maison Rouge est l’étude la plus intime de la collection. Son échelle plus domestique, ses jardins, ses deux piscines et ses accents colorés rapprochent l’expérience de celle d’une maison composée plutôt que d’un grand hôtel monolithique.",
    cityRelationship:
      "Son rapport à Cotonou passe par l’art, le jardin et la proximité du littoral. Elle montre qu’une adresse hôtelière peut participer à la ville par l’atmosphère et la culture autant que par sa taille.",
  },
];
