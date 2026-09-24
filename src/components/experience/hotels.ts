export type HotelStudy = {
  id: string;
  index: string;
  name: string;
  shortName: string;
  descriptor: string;
  position: [number, number, number];
};

export const hotelStudies: HotelStudy[] = [
  {
    id: "sofitel",
    index: "01",
    name: "Sofitel Cotonou Marina",
    shortName: "Sofitel",
    descriptor: "Marina study",
    position: [-4.7, 0, -2.2],
  },
  {
    id: "golden-tulip",
    index: "02",
    name: "Golden Tulip Diplomate",
    shortName: "Golden Tulip",
    descriptor: "Boulevard study",
    position: [-1.7, 0, -3.1],
  },
  {
    id: "novotel",
    index: "03",
    name: "Novotel Cotonou Orisha",
    shortName: "Novotel",
    descriptor: "Garden study",
    position: [1.7, 0, -2.1],
  },
  {
    id: "hotel-du-lac",
    index: "04",
    name: "Hôtel du Lac",
    shortName: "Hôtel du Lac",
    descriptor: "Lagoon study",
    position: [4.6, 0, 1.7],
  },
  {
    id: "azalai",
    index: "05",
    name: "Azalaï Hôtel Cotonou",
    shortName: "Azalaï",
    descriptor: "Coastal study",
    position: [1.6, 0, 2.9],
  },
  {
    id: "maison-rouge",
    index: "06",
    name: "Maison Rouge Cotonou",
    shortName: "Maison Rouge",
    descriptor: "Boutique study",
    position: [-3.2, 0, 2.5],
  },
];
