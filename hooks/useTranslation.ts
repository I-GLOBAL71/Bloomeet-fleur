import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define language structure
export const supportedLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// Helper to find language by code
export const findLanguage = (code: string) => supportedLanguages.find(l => l.code === code);

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState('fr'); // Default language
    const [translationsData, setTranslationsData] = useState<{ [key: string]: any }>({});
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                // Fetching from a relative path from the root of the site
                const responses = await Promise.all(
                    supportedLanguages.map(lang => fetch(`./locales/${lang.code}.json`))
                );
                
                for (const res of responses) {
                    if (!res.ok) {
                        throw new Error(`Failed to load translation file: ${res.url} - ${res.statusText}`);
                    }
                }
                
                const jsonData = await Promise.all(
                    responses.map(res => res.json())
                );
                
                const newTranslationsData = supportedLanguages.reduce((acc, lang, index) => {
                    acc[lang.code] = jsonData[index];
                    return acc;
                }, {} as {[key: string]: any});

                setTranslationsData(newTranslationsData);
            } catch (error) {
                console.error("Failed to fetch translations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();
    }, []);


    const setLanguage = useCallback((lang: string) => {
        if (findLanguage(lang)) {
            localStorage.setItem('aura-lang', lang);
            setLanguageState(lang);
            const langConfig = findLanguage(lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = langConfig?.dir || 'ltr';
        }
    }, []);

    useEffect(() => {
        const savedLang = localStorage.getItem('aura-lang');
        const browserLang = navigator.language.split('-')[0];
        const initialLang = savedLang || (findLanguage(browserLang) ? browserLang : 'fr');
        setLanguage(initialLang);
    }, [setLanguage]);

    const translate = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        if (isLoading) {
            return ''; // Return empty string while loading
        }
        
        const translations = translationsData[language] || translationsData.fr;
        if (!translations) return key;

        let text = translations;
        try {
            for (const part of key.split('.')) {
                if (text === undefined || text === null) throw new Error("Invalid path");
                text = text[part];
            }
        } catch (e) {
            return key; // Return key if path is invalid
        }
        
        if (typeof text !== 'string') return key;

        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                text = text.replace(new RegExp(`{${placeholder}}`, 'g'), String(replacements[placeholder]));
            });
        }

        return text;
    }, [language, translationsData, isLoading]);

    if (isLoading) {
        return null; // Don't render children until translations are loaded
    }
    
    return React.createElement(LanguageContext.Provider, {
        value: { language, setLanguage, t: translate }
    }, children);
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
