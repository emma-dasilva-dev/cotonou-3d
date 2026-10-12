export const SKIN_COLORS = ["#563721", "#845338", "#ad7854", "#d5a27a", "#edc5a0"] as const;
export const HAIR_COLORS = ["#211d1a", "#4e3529", "#76523c", "#b1875e"] as const;
export const OUTFIT_COLORS = ["#29475a", "#4d6043", "#a96747", "#b3a18a", "#5a4264"] as const;
export const HAIRSTYLES = ["short", "afro", "bun"] as const;
export type Hairstyle = (typeof HAIRSTYLES)[number];
export type Appearance = { skin: number; hair: number; outfit: number; hairstyle: Hairstyle };
export const DEFAULT_APPEARANCE: Appearance = { skin: 2, hair: 0, outfit: 0, hairstyle: "short" };
export const APPEARANCE_KEY = "cotonou-life-appearance-v1";
export function validateAppearance(value: unknown): Appearance {
  if (!value || typeof value !== "object") return { ...DEFAULT_APPEARANCE };
  const v = value as Record<string, unknown>;
  const index = (n: unknown, size: number, fallback: number) =>
    typeof n === "number" && Number.isInteger(n) && n >= 0 && n < size ? n : fallback;
  return {
    skin: index(v.skin, SKIN_COLORS.length, DEFAULT_APPEARANCE.skin),
    hair: index(v.hair, HAIR_COLORS.length, DEFAULT_APPEARANCE.hair),
    outfit: index(v.outfit, OUTFIT_COLORS.length, DEFAULT_APPEARANCE.outfit),
    hairstyle: HAIRSTYLES.find(h => h === v.hairstyle) ?? DEFAULT_APPEARANCE.hairstyle
  };
}
