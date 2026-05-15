import { createContext, useState, type ReactNode } from "react";
import { messages } from "../lang/i18n";

type Locale = "es" | "en";

interface LanguageContextProps {
    locale: Locale;
    messages: any;
    changeLanguage: (lang: Locale) => void;
}

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageContext = createContext<LanguageContextProps>({
    locale: 'en',
    messages: messages.en,
    changeLanguage: () => { },
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const initialLocale = navigator.language.startsWith('es') ? 'es' : 'en';
    const [locale, setLocale] = useState<Locale>(initialLocale);

    const changeLanguage = (lang: Locale) => {
        setLocale(lang);
    };

    return (
        <LanguageContext.Provider value={{
            locale,
            messages: messages[locale],
            changeLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    )
}