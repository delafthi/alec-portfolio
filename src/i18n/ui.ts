export const ui = {
    en: {
        "site.title": "Paintings",

        portfolio: "Portfolio",
        exhibitions: "Exhibitions",
        about: "About",
        contact: "Contact",

        size: "Size",
        materials: "Materials",
        notes: "Notes",
        availability: "Availability",
        get_in_contact: "Get in contact",
        interest_message:
            'I am interested in the artwork "{artwork}". Is it still available?',
        year: "Year",
        back_to_portfolio: "← Portfolio",

        upcoming: "Upcoming Exhibitions",
        past: "Past Exhibitions",
        date_to: "to",
        juried: "juried",

        all_works: "All Works",

        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send",
        email_direct: "Or directly via email:",
        success_title: "Thank you!",
        success: "Your message has been sent.",
        home: "Home",

        all: "All",
        label: "Filter",

        description:
            "Artworks by ALEC — paintings of landscapes, portraits, and more.",
    },
    de: {
        "site.title": "Malerei",

        portfolio: "Portfolio",
        exhibitions: "Ausstellungen",
        about: "Über mich",
        contact: "Kontakt",

        size: "Grösse",
        materials: "Materialien",
        notes: "Bemerkungen",
        availability: "Verfügbarkeit",
        get_in_contact: "Kontakt aufnehmen",
        interest_message:
            "Ich interessiere mich für das Werk «{artwork}». Ist es noch verfügbar?",
        year: "Jahr",
        back_to_portfolio: "← Portfolio",

        upcoming: "Kommende Ausstellungen",
        past: "Vergangene Ausstellungen",
        date_to: "bis",
        juried: "juriert",

        all_works: "Alle Werke",

        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        send: "Senden",
        email_direct: "Oder direkt per E-Mail:",
        success_title: "Vielen Dank!",
        success: "Ihre Nachricht wurde gesendet.",
        home: "Startseite",

        all: "Alle",
        label: "Filtern",

        description:
            "Kunstwerke von ALEC — Malerei aus Landschaften, Portraits und mehr.",
    },
} as const;

export type Lang = keyof typeof ui;
export const LANGS = Object.keys(ui) as Lang[];
