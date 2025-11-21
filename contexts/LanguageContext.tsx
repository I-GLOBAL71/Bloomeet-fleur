
import * as React from 'react';
import { findLanguage } from './language.config';
import type { LanguageContextType } from '../types';

// 1. Define and export the Context object
export const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

// 2. Define and export the translation hook
export const useTranslation = (): LanguageContextType => {
    const context = React.useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

// Helper function to get nested values from translation object
const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// 3. Define and export the Provider component
export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [language, setLanguage] = React.useState('fr');
    const [translations, setTranslations] = React.useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        document.documentElement.lang = language;
        const langData = findLanguage(language);
        document.documentElement.dir = langData?.dir || 'ltr';

        const fetchTranslations = async () => {
            setIsLoading(true);
            try {
                const langConfig = findLanguage(language);
                if (!langConfig) throw new Error(`Language ${language} not supported.`);

                const response = await fetch(langConfig.path);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error("Failed to load translations, falling back to English:", error);
                try {
                    const fallbackConfig = findLanguage('en');
                    const response = await fetch(fallbackConfig!.path);
                    const data = await response.json();
                    setTranslations(data);
                } catch (fallbackError) {
                    console.error("Failed to load fallback English translations:", fallbackError);
                    setTranslations({});
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();
    }, [language]);
    
    const t = React.useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        if (!translations) {
            return key;
        }

        let translation = getNestedValue(translations, key);
        
        if (!translation) {
            console.warn(`Translation key not found in '${language}': ${key}`);
            let fallback = key.split('.').pop() || key;
            fallback = fallback.replace(/([A-Z])/g, ' $1').trim();
            fallback = fallback.charAt(0).toUpperCase() + fallback.slice(1);
            if (replacements) {
                Object.entries(replacements).forEach(([rKey, value]) => {
                    fallback = fallback.replace(`{${rKey}}`, String(value));
                });
            }
            return fallback;
        }
        
        if (replacements) {
            Object.entries(replacements).forEach(([rKey, value]) => {
                translation = translation!.replace(new RegExp(`{${rKey}}`, 'g'), String(value));
            });
        }
        return translation!;
    }, [language, translations]);

    const value: LanguageContextType = {
        language,
        setLanguage,
        t,
        isLoading,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
