import { LANGS, type Lang, ui } from "./ui";

export function getStaticPaths(): { params: { lang: Lang } }[] {
    return LANGS.map((lang) => ({ params: { lang } }));
}

export function useTranslations(lang: Lang) {
    return ui[lang];
}
