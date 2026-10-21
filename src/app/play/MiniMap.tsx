"use client";

type Zone = "quartier" | "fidjrosse";
type Marker = { x: number; z: number; label: string; color: string };
const TOWN: Marker[] = [
  { x: 0, z: -5.5, label: "Aïcha", color: "#d78b52" },
  { x: 0, z: 6, label: "Livraison", color: "#ddaf47" },
  { x: 5, z: -1.2, label: "Boutique", color: "#4b9b81" },
  { x: -0.65, z: 9, label: "Kossi", color: "#6593cb" },
  { x: -8, z: -10, label: "Marché", color: "#ac7157" },
];
const BEACH: Marker[] = [
  { x: -9, z: 1, label: "Paillote", color: "#b87954" },
  { x: 9, z: 3, label: "Paillote", color: "#b87954" },
  { x: 0, z: -3, label: "Océan", color: "#5dacc0" },
];
const px = (x: number) => 100 + x * 4.7;
const py = (z: number) => 100 + z * 4.7;

export function MiniMap({ zone, x, z, missionActive }: { zone: Zone; x: number; z: number; missionActive: boolean }) {
  const markers = zone === "quartier" ? TOWN.filter(p => p.label !== "Livraison" || missionActive) : BEACH;
  return <aside className="game-mini-map" aria-label={zone === "quartier" ? "Mini-carte du quartier" : "Mini-carte de Fidjrossè"}>
    <div className="game-mini-map__heading"><strong>CARTE</strong><span>{zone === "quartier" ? "Quartier central" : "Fidjrossè"}</span></div>
    <svg viewBox="0 0 200 200" role="img" aria-label="Votre position et les points d’intérêt" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill={zone === "quartier" ? "#d2c2a6" : "#ddc49b"} />
      {zone === "quartier" ? <>
        <rect x="90" width="20" height="200" fill="#777c77" />
        <rect x="0" y="91" width="200" height="18" fill="#777c77" />
        <rect x="35" y="30" width="27" height="22" rx="2" fill="#a88f79" />
        <rect x="135" y="32" width="26" height="25" rx="2" fill="#a88f79" />
        <rect x="30" y="138" width="28" height="23" rx="2" fill="#a88f79" />
        <rect x="136" y="138" width="28" height="23" rx="2" fill="#a88f79" />
      </> : <><rect x="0" y="0" width="200" height="78" fill="#4e9da8" /><path d="M0 80 Q40 70 80 80 T160 79 T240 80" fill="none" stroke="#f4f0d7" strokeWidth="4"/></>}
      {markers.map(m => <g key={m.label} transform={`translate(${px(m.x)} ${py(m.z)})`}>
        <circle r="6" fill={m.color} stroke="#fff9e9" strokeWidth="2" />
      </g>)}
      <circle cx={Math.max(6, Math.min(194, px(x)))} cy={Math.max(6, Math.min(194, py(z)))} r="6.5" fill="#243f38" stroke="#fff" strokeWidth="2.5" />
    </svg>
    <div className="game-mini-map__legend"><span><i /> Vous</span><span>{markers.length} repères</span></div>
  </aside>;
}
