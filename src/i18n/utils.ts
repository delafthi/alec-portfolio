import type { Lang } from "./ui";

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang === "de" || lang === "en") return lang;
  return "de";
}

export function getLocalizedUrl(lang: Lang, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}

const DE_TO_EN: Record<string, string> = {
  ausstellungen: "exhibitions",
  "ueber-mich": "about",
  kontakt: "contact",
  bild: "artwork",
};
const EN_TO_DE: Record<string, string> = Object.fromEntries(
  Object.entries(DE_TO_EN).map(([k, v]) => [v, k]),
);

export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const parts = url.pathname.split("/");
  parts[1] = targetLang;
  const map = targetLang === "en" ? DE_TO_EN : EN_TO_DE;
  if (parts[2]) parts[2] = map[parts[2]] ?? parts[2];
  return parts.join("/") || `/${targetLang}/`;
}
