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
    descriptor: "Marina study",
    position: [-4.7, 0, -2.2],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A contemporary five-star hotel facing the Gulf of Guinea, shaped around coastal light, landscaped grounds and the meeting of sand, ocean and vegetation.",
    facts: [
      { label: "Category", value: "5-star hotel" },
      { label: "Setting", value: "Gulf of Guinea" },
      { label: "Character", value: "Contemporary coastal" },
    ],
    website: "https://sofitel.accor.com/fr/hotels/B845.html",
  },
  {
    id: "golden-tulip",
    index: "02",
    name: "Golden Tulip Le Diplomate",
    shortName: "Golden Tulip",
    descriptor: "Boulevard study",
    position: [-1.7, 0, -3.1],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A four-star city hotel on Boulevard de la Marina, combining business hospitality with an outdoor pool, restaurant, event spaces and proximity to the Atlantic.",
    facts: [
      { label: "Category", value: "4-star hotel" },
      { label: "Rooms", value: "139 rooms & suites" },
      { label: "Setting", value: "Marina boulevard" },
    ],
    website: "https://diplomate-cotonou.goldentulip.com/en-us/",
  },
  {
    id: "novotel",
    index: "03",
    name: "Novotel Cotonou Orisha",
    shortName: "Novotel",
    descriptor: "Garden study",
    position: [1.7, 0, -2.1],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "A renovated four-star hotel set within a seven-hectare wooded garden, with a contemporary design, pool and a calmer resort-like atmosphere near the coast.",
    facts: [
      { label: "Category", value: "4-star hotel" },
      { label: "Garden", value: "7 hectares" },
      { label: "Rooms", value: "110 rooms" },
    ],
    website: "https://all.accor.com/hotel/1826/index.en.shtml",
  },
  {
    id: "hotel-du-lac",
    index: "04",
    name: "Hôtel du Lac",
    shortName: "Hôtel du Lac",
    descriptor: "Lagoon study",
    position: [4.6, 0, 1.7],
    location: "Lake Nokoué · Cotonou",
    summary:
      "A three-star hotel on the shores of Lake Nokoué, known for its calm waterfront setting, lake views and outdoor leisure spaces including the pool.",
    facts: [
      { label: "Category", value: "3-star hotel" },
      { label: "Setting", value: "Lake Nokoué" },
      { label: "Spaces", value: "Pool · Restaurant · Lake view" },
    ],
    website: "https://www.hoteldulac-benin.com/",
    exteriorReady: true,
  },
  {
    id: "azalai",
    index: "05",
    name: "Azalaï Hôtel Cotonou",
    shortName: "Azalaï",
    descriptor: "Coastal study",
    position: [1.6, 0, 2.9],
    location: "Atlantic waterfront · Cotonou",
    summary:
      "A prominent waterfront hotel in central Cotonou, with 120 rooms including suites, pool-facing accommodation and spaces for dining and events.",
    facts: [
      { label: "Rooms", value: "120 rooms" },
      { label: "Suites", value: "12 suites" },
      { label: "Setting", value: "Atlantic waterfront" },
    ],
    website: "https://www.azalai.com/azalai-hotel-cotonou",
  },
  {
    id: "maison-rouge",
    index: "06",
    name: "Maison Rouge Cotonou",
    shortName: "Maison Rouge",
    descriptor: "Boutique study",
    position: [-3.2, 0, 2.5],
    location: "Boulevard de la Marina · Cotonou",
    summary:
      "An intimate four-star boutique hotel with refined design, contemporary African art, gardens, two pools and a panoramic terrace facing the sea.",
    facts: [
      { label: "Category", value: "4-star hotel" },
      { label: "Pools", value: "2 outdoor pools" },
      { label: "Character", value: "Boutique · Art · Garden" },
    ],
    website: "https://hotel-benin-maison-rouge-cotonou.com/en/hotel-cotonou-benin/",
  },
];
