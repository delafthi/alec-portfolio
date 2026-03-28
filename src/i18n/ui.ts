export const ui = {
  de: {
    "nav.portfolio": "Portfolio",
    "nav.exhibitions": "Ausstellungen",
    "nav.about": "Über mich",
    "nav.contact": "Kontakt",

    "filter.all": "Alle",
    "filter.landschaften": "Landschaften",
    "filter.portraits": "Portraits",
    "filter.tiere": "Tiere",
    "filter.akt": "Akt",
    "filter.diverse": "Diverse",

    "artwork.size": "Größe",
    "artwork.materials": "Materialien",
    "artwork.notes": "Bemerkungen",
    "artwork.availability": "Verfügbarkeit",
    "artwork.details": "Details",
    "artwork.year": "Jahr",
    "artwork.back_to_portfolio": "← Portfolio",

    "availability.available": "Verfügbar",
    "availability.sold": "Verkauft",
    "availability.not_for_sale": "Nicht käuflich",

    "exhibitions.upcoming": "Kommende Ausstellungen",
    "exhibitions.past": "Vergangene Ausstellungen",
    "exhibitions.none_upcoming": "Derzeit keine kommenden Ausstellungen",

    "exhibition.type.solo": "Einzelausstellung",
    "exhibition.type.gruppe": "Gruppenausstellung",

    "landing.featured": "Ausgewählte Werke",
    "landing.upcoming_exhibitions": "Kommende Ausstellungen",
    "landing.all_works": "Alle Werke",

    "about.title": "Über mich",

    "contact.title": "Kontakt",
    "contact.name": "Name",
    "contact.email": "E-Mail",
    "contact.message": "Nachricht",
    "contact.send": "Senden",
    "contact.email_direct": "Oder direkt per E-Mail:",
    "contact.success_title": "Vielen Dank!",
    "contact.success": "Ihre Nachricht wurde gesendet.",

    "meta.description":
      "Kunstwerke von ALEC — Malerei aus Landschaften, Portraits und mehr.",
  },
  en: {
    "nav.portfolio": "Portfolio",
    "nav.exhibitions": "Exhibitions",
    "nav.about": "About",
    "nav.contact": "Contact",

    "filter.all": "All",
    "filter.landschaften": "Landscapes",
    "filter.portraits": "Portraits",
    "filter.tiere": "Animals",
    "filter.akt": "Nude",
    "filter.diverse": "Various",

    "artwork.size": "Size",
    "artwork.materials": "Materials",
    "artwork.notes": "Notes",
    "artwork.availability": "Availability",
    "artwork.details": "Details",
    "artwork.year": "Year",
    "artwork.back_to_portfolio": "← Portfolio",

    "availability.available": "Available",
    "availability.sold": "Sold",
    "availability.not_for_sale": "Not for sale",

    "exhibitions.upcoming": "Upcoming Exhibitions",
    "exhibitions.past": "Past Exhibitions",
    "exhibitions.none_upcoming": "No upcoming exhibitions at this time",

    "exhibition.type.solo": "Solo Exhibition",
    "exhibition.type.gruppe": "Group Exhibition",

    "landing.featured": "Featured Works",
    "landing.upcoming_exhibitions": "Upcoming Exhibitions",
    "landing.all_works": "All Works",

    "about.title": "About",

    "contact.title": "Contact",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send",
    "contact.email_direct": "Or directly via email:",
    "contact.success_title": "Thank you!",
    "contact.success": "Your message has been sent.",

    "meta.description":
      "Artworks by ALEC — paintings of landscapes, portraits, and more.",
  },
} as const;

export type Lang = keyof typeof ui;
export type TranslationKey = keyof typeof ui.de;
