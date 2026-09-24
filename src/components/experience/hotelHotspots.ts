export type HotelHotspot = {
  id: "facade" | "pool" | "terrace" | "lake";
  label: string;
  eyebrow: string;
  description: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
};

export const hotelDuLacHotspots: HotelHotspot[] = [
  {
    id: "facade",
    label: "Façade",
    eyebrow: "Architecture",
    description:
      "Une lecture rapprochée des volumes clairs, des accents rouges et du rythme des balcons qui donnent à l’hôtel sa silhouette reconnaissable.",
    position: [4.15, 1.72, 0.82],
    cameraPosition: [7.05, 2.55, -2.15],
    cameraTarget: [4.45, 1.38, 0.92],
  },
  {
    id: "pool",
    label: "Piscine",
    eyebrow: "Extérieur",
    description:
      "La piscine extérieure structure l’espace de détente avec son deck, ses assises et la végétation tropicale qui l’entoure.",
    position: [5.18, 0.34, -0.22],
    cameraPosition: [7.25, 1.55, -1.75],
    cameraTarget: [4.92, 0.24, -0.18],
  },
  {
    id: "terrace",
    label: "Terrasse",
    eyebrow: "Restaurant",
    description:
      "Une grande terrasse ouverte prolonge les espaces de restauration vers l’extérieur et profite directement du cadre au bord du lac.",
    position: [2.92, 0.68, 0.58],
    cameraPosition: [0.7, 1.8, -0.85],
    cameraTarget: [2.95, 0.5, 0.78],
  },
  {
    id: "lake",
    label: "Vue lac",
    eyebrow: "Paysage",
    description:
      "L’implantation sur les rives du lac Nokoué donne au site sa respiration et crée une relation directe entre l’hôtel et le paysage aquatique.",
    position: [5.15, 0.52, 3.7],
    cameraPosition: [7.3, 2.45, 7.25],
    cameraTarget: [4.65, 0.86, 2.35],
  },
];

export function getHotelDuLacHotspot(id?: string) {
  return hotelDuLacHotspots.find((hotspot) => hotspot.id === id);
}
