import { type Lang, ui } from "@i18n/ui";

const LOCALE: Record<Lang, string> = { de: "de-CH", en: "en-GB" };

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
};

export function formatDate(
    d: Date,
    lang: Lang,
    options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
): string {
    return d.toLocaleDateString(LOCALE[lang], options);
}

export function formatDateRange(
    start: Date,
    end: Date | undefined,
    lang: Lang,
    options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
): string {
    if (!end || end.getTime() === start.getTime()) {
        return formatDate(start, lang, options);
    }
    return `${formatDate(start, lang, options)} ${ui[lang].date_to} ${formatDate(end, lang, options)}`;
}
