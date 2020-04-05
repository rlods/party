import i18next from "i18next";
import { initReactI18next } from "react-i18next";
//
import en from "../locales/en";
import fr from "../locales/fr";

// --------------------------------------------------------------

export const changeLanguage = (language: string) =>
  i18next.changeLanguage(language);

// --------------------------------------------------------------

export const initLocales = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    console.debug("Initializing language...");
    i18next.use(initReactI18next).init(
      {
        fallbackLng: "en",
        lng: navigator.language || (navigator as any).userLanguage,
        resources: {
          "en-US": { translation: en },
          "fr-FR": { translation: fr },
        },
        interpolation: {
          escapeValue: false, // react is already safe from xss
          format: (value, format, lng) => {
            // if (format === "uppercase") return value.toUpperCase();
            // if (value instanceof Date) return moment(value).format(format);
            return value;
          },
        },
      },
      (error) => {
        if (error) reject(error);
        resolve();
      }
    );
  });
