// Define language structure with paths for fetching
export const supportedLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', path: './locales/fr.json', dir: 'ltr' },
    { code: 'en', name: 'English', flag: '🇬🇧', path: './locales/en.json', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', path: './locales/ar.json', dir: 'rtl' },
    { code: 'es', name: 'Español', flag: '🇪🇸', path: './locales/es.json', dir: 'ltr' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', path: './locales/it.json', dir: 'ltr' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', path: './locales/de.json', dir: 'ltr' },
];

// Helper to find language by code
export const findLanguage = (code: string) => supportedLanguages.find(l => l.code === code);