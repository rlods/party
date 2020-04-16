import i18next from "i18next";
import { initReactI18next } from "react-i18next";
//
import en from "../locales/en";
import fr from "../locales/fr";

// --------------------------------------------------------------

type Language = "en" | "fr";

// --------------------------------------------------------------

export const changeLanguage = (language: Language) =>
	i18next.changeLanguage(language);

// --------------------------------------------------------------

export const initLocales = async (): Promise<void> =>
	new Promise((resolve, reject) => {
		console.debug("Initializing language...", {
			current: navigator.language || (navigator as any).userLanguage
		});
		i18next.use(initReactI18next).init(
			{
				fallbackLng: "en",
				lng: navigator.language || (navigator as any).userLanguage,
				resources: {
					en: { translation: en },
					"en-US": { translation: en },
					fr: { translation: fr },
					"fr-FR": { translation: fr }
				},
				interpolation: {
					escapeValue: false, // react is already safe from xss
					format: (value, format, lng) => {
						// if (format === "uppercase") return value.toUpperCase();
						// if (value instanceof Date) return moment(value).format(format);
						return value;
					}
				}
			},
			error => {
				if (error) reject(error);
				resolve();
			}
		);
	});
