import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, supportedLanguages, findLanguage } from '../hooks/useTranslation';
import { GlobeIcon, CheckIcon } from './Icons';

interface LanguageSwitcherProps {
    as: 'button' | 'div'; // To render as a button or a settings div
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ as = 'button' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const currentLang = findLanguage(language);

    const DropdownMenu = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full mt-2 end-0 w-56 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                >
                    <div className="py-1">
                        {supportedLanguages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between text-start px-4 py-2 text-md text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-xl">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </span>
                                {language === lang.code && <CheckIcon className="w-5 h-5 text-rose-500" />}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
    
    if (as === 'div') {
        return (
             <div className="relative" ref={wrapperRef}>
                <h2 className="font-semibold text-lg text-gray-800 mb-2">{t('profile.language')}</h2>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center bg-gray-100 p-4 rounded-xl text-lg font-medium text-gray-800 hover:bg-gray-200 transition-colors"
                >
                    <span className="flex items-center gap-3">
                         <span className="text-2xl">{currentLang?.flag}</span>
                         {currentLang?.name}
                    </span>
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </button>
                 <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute top-full mt-2 start-0 w-full bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                        >
                            <div className="py-1">
                                {supportedLanguages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between text-start px-4 py-3 text-md text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="text-xl">{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </span>
                                        {language === lang.code && <CheckIcon className="w-5 h-5 text-rose-500" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors p-2 rounded-full"
            >
                <GlobeIcon className="w-6 h-6" />
                <span className="hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
            </button>
            {DropdownMenu}
        </div>
    );
};

export default LanguageSwitcher;