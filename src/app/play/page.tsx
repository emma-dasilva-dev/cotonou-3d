import type { Metadata } from "next";
import PlayPrototype from "./PlayPrototype";

export const metadata: Metadata = {
  title: "Jouer | COTONOU / 3D",
  description: "Prototype de déplacement dans un quartier stylisé de Cotonou.",
};

export default function PlayPage() {
  return <PlayPrototype />;
}
