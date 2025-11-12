import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, HeartIcon, CameraIcon, PlusIcon, TrashIcon, CheckIcon, PartyPopperIcon, LightbulbIcon } from './Icons';

// --- DATA & TYPES ---

interface OnboardingData {
  name: string;
  age: string;
  gender: 'Homme' | 'Femme' | 'Autre' | '';
  interestedIn: 'Hommes' | 'Femmes' | 'Tout le monde' | '';
  city: string;
  photos: string[]; // base64 strings
  bio: string;
  interests: string[];
  distancePreference: number;
}

const interestsList = [
    { name: 'Voyage', emoji: '✈️' }, { name: 'Photographie', emoji: '📷' },
    { name: 'Cuisine', emoji: '🍳' }, { name: 'Randonnée', emoji: '🥾' },
    { name: 'Art', emoji: '🎨' }, { name: 'Musique', emoji: '🎵' },
    { name: 'Cinéma', emoji: '🎬' }, { name: 'Lecture', emoji: '📚' },
    { name: 'Fitness', emoji: '💪' }, { name: 'Yoga', emoji: '🧘' },
    { name: 'Danse', emoji: '💃' }, { name: 'Jeux Vidéo', emoji: '🎮' },
];
const bioPrompts = [
    "Un fait amusant sur moi : ",
    "La meilleure façon de m'inviter à sortir est...",
    "Je suis vraiment doué(e) pour...",
    "Ce que je recherche chez un partenaire :",
    "Mon week-end parfait ressemble à...",
];
const citiesList = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Bruxelles', 'Genève', 'Montréal'];

const TOTAL_STEPS = 6;

// --- HELPER & CHILD COMPONENTS ---

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div className="w-full">
    <span className="text-sm font-semibold text-gray-500">Étape {step} sur {TOTAL_STEPS}</span>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
      <motion.div
        className="bg-rose-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  </div>
);

const OnboardingContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode; }> = ({ title, subtitle, children }) => (
  <div className="w-full max-w-lg mx-auto">
    <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-4xl font-bold text-gray-800"
    >
        {title}
    </motion.h1>
    <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-2 text-lg text-gray-500"
    >
        {subtitle}
    </motion.p>
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10"
    >
        {children}
    </motion.div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

const pageTransition = { type: 'spring', stiffness: 200, damping: 25 };


// --- ONBOARDING STEP COMPONENTS ---

const StepWelcome: React.FC = () => (
    <div className="text-center">
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-block p-6 bg-rose-100 rounded-full"
        >
            <HeartIcon className="w-20 h-20 text-rose-500" />
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="font-display text-4xl font-bold text-gray-800 mt-8"
        >
            Créez un profil qui vous ressemble.
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            className="mt-4 text-xl text-gray-600 max-w-md mx-auto"
        >
            L'authenticité est le début de toute belle histoire. Façonnons la vôtre.
        </motion.p>
    </div>
);

const FormInput: React.FC<{ id: string; label: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; }> = 
({ id, label, value, onChange, type = 'text', placeholder }) => (
    <div className="relative group">
        <label htmlFor={id} className={`absolute left-4 transition-all duration-300 text-gray-500 pointer-events-none ${value ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-lg group-focus-within:top-2 group-focus-within:text-xs'}`}>
            {label}
        </label>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={onChange} 
            className="w-full px-4 pt-6 pb-2 text-lg bg-gray-100 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition" 
            placeholder={placeholder} 
        />
    </div>
);


const StepProfileBasics: React.FC<{ data: OnboardingData; onChange: (field: keyof OnboardingData, value: any) => void; }> = ({ data, onChange }) => (
    <div className="space-y-8">
        <FormInput id="name" label="Votre prénom" value={data.name} onChange={(e) => onChange('name', e.target.value)} />
        <FormInput id="age" label="Votre âge" value={data.age} onChange={(e) => onChange('age', e.target.value)} type="number" />
        <div className="space-y-3">
             <label className="text-lg font-semibold text-gray-700">Vous êtes</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Homme', 'Femme', 'Autre'].map(option => (
                    <ChoiceButton key={option} onClick={() => onChange('gender', option)} isSelected={data.gender === option}>{option}</ChoiceButton>
                ))}
             </div>
        </div>
    </div>
);

const ChoiceButton: React.FC<{ onClick: () => void; isSelected: boolean; children: React.ReactNode; }> = ({ onClick, isSelected, children }) => (
    <button onClick={onClick} className={`relative w-full text-left p-4 rounded-xl border-2 text-lg font-semibold transition-all duration-200 flex items-center justify-between ${isSelected ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-white border-gray-300 text-gray-800 hover:border-rose-400'}`}>
        {children}
        <AnimatePresence>
        {isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckIcon className="w-6 h-6" />
            </motion.div>
        )}
        </AnimatePresence>
    </button>
);

const StepPreferences: React.FC<{ data: OnboardingData; onChange: (field: keyof OnboardingData, value: any) => void; }> = ({ data, onChange }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange('city', value);
        if (value.length > 1) {
            setSuggestions(citiesList.filter(city => city.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    return(
        <div className="space-y-8">
            <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-700">Vous recherchez</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Hommes', 'Femmes', 'Tout le monde'].map(option => (
                        <ChoiceButton key={option} onClick={() => onChange('interestedIn', option)} isSelected={data.interestedIn === option}>{option}</ChoiceButton>
                    ))}
                </div>
            </div>
            <div className="space-y-2 relative">
                <label htmlFor="city" className="text-lg font-semibold text-gray-700">Votre ville</label>
                <input type="text" id="city" value={data.city} onChange={handleCityChange} className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="Commencez à taper..." autoComplete="off"/>
                <AnimatePresence>
                    {suggestions.length > 0 && (
                    <motion.ul 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto text-left">
                        {suggestions.map(city => (
                            <li key={city} onClick={() => { onChange('city', city); setSuggestions([]); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-lg">
                                {city}
                            </li>
                        ))}
                    </motion.ul>
                )}
                </AnimatePresence>
            </div>
             <div className="space-y-4">
                <label htmlFor="distance" className="text-lg font-semibold text-gray-700 flex justify-between">
                    <span>Distance maximale</span>
                    <span className="font-bold text-rose-500">{data.distancePreference} km</span>
                </label>
                <input type="range" id="distance" min="5" max="200" step="5" value={data.distancePreference} onChange={e => onChange('distancePreference', parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            </div>
        </div>
    );
};

const PhotoTips: React.FC = () => (
    <div className="mt-6 p-4 bg-rose-50/80 border-l-4 border-rose-300 rounded-r-lg">
        <div className="flex">
            <div className="flex-shrink-0 pt-0.5">
                <LightbulbIcon className="h-6 w-6 text-rose-500" />
            </div>
            <div className="ml-3">
                <h3 className="text-md font-bold text-rose-800">Nos meilleurs conseils photo</h3>
                <ul className="mt-2 text-sm text-rose-700 list-disc list-inside space-y-1">
                    <li>Montrez votre visage clairement, un sourire est toujours un plus !</li>
                    <li>Variez les plaisirs : un portrait, une photo en pied, et une qui montre vos passions.</li>
                </ul>
            </div>
        </div>
    </div>
);

const StepPhotos: React.FC<{ photos: string[]; onChange: (photos: string[]) => void; }> = ({ photos, onChange }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 6 - photos.length);
            const promises = files.map((file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }));

            Promise.all(promises).then(base64files => onChange([...photos, ...base64files]));
        }
    };
    
    const removePhoto = (index: number) => {
        onChange(photos.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <motion.div 
                        key={index} 
                        className={`aspect-square rounded-2xl overflow-hidden relative ${index === 0 ? 'col-span-2 row-span-2' : ''} ${photos[index] ? '' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        {photos[index] ? (
                            <>
                                <img src={photos[index]} alt={`Profil ${index + 1}`} className="w-full h-full object-cover" />
                                <button onClick={() => removePhoto(index)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <label htmlFor="photo-upload" className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition">
                                <PlusIcon className="w-8 h-8" />
                                <span className="text-sm mt-1">Ajouter</span>
                            </label>
                        )}
                    </motion.div>
                ))}
                <input id="photo-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
            </div>
            <PhotoTips />
        </div>
    );
};


const StepBioAndInterests: React.FC<{ data: OnboardingData; onChange: (field: keyof OnboardingData, value: any) => void; }> = ({ data, onChange }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const toggleInterest = (interest: string) => {
        const newInterests = data.interests.includes(interest) 
            ? data.interests.filter(i => i !== interest)
            : [...data.interests, interest];
        if (newInterests.length <= 5) onChange('interests', newInterests);
    };

    const generateBio = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Basé sur ces centres d'intérêt: ${data.interests.join(', ')}, écris 3 options de bio courtes, engageantes et charmantes pour un profil de rencontre (moins de 150 caractères). Retourne un tableau JSON de chaînes de caractères.`,
                config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
            });
            const result = JSON.parse(response.text.trim());
            if (Array.isArray(result)) setSuggestions(result);
        } catch (error) { console.error("Error generating bio:", error); } 
        finally { setIsLoading(false); }
    };
    
    const inspireBio = () => {
        const randomPrompt = bioPrompts[Math.floor(Math.random() * bioPrompts.length)];
        onChange('bio', randomPrompt);
    };

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                    <label className="text-lg font-semibold text-gray-700">Vos centres d'intérêt</label>
                    <span className="text-sm font-medium text-gray-500">{data.interests.length} / 5</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {interestsList.map(interest => (
                        <button key={interest.name} onClick={() => toggleInterest(interest.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2 text-md transform active:scale-95 ${data.interests.includes(interest.name) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'}`}>
                            {interest.emoji}<span>{interest.name}</span>
                        </button>
                    ))}
                </div>
            </div>
             <div className="space-y-3">
                <label htmlFor="bio" className="text-lg font-semibold text-gray-700">Votre bio</label>
                <div className="relative">
                    <textarea id="bio" value={data.bio} onChange={(e) => onChange('bio', e.target.value)} maxLength={200} className="w-full h-32 p-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="Un petit quelque chose sur vous..."></textarea>
                    <span className="absolute bottom-3 right-4 text-xs text-gray-400">{data.bio.length} / 200</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={inspireBio} className="w-full text-center text-rose-600 font-bold py-3 px-4 rounded-lg hover:bg-rose-50 transition-colors">
                        S'inspirer
                    </button>
                    <button disabled={isLoading || data.interests.length === 0} onClick={generateBio} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold py-3 px-4 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-5 h-5"/>
                        {isLoading ? 'Réflexion...' : 'Suggérer avec l\'IA'}
                    </button>
                </div>
                <AnimatePresence>
                 {suggestions.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-left space-y-2 pt-4"
                    >
                        {suggestions.map((s, i) => (
                             <motion.p 
                                key={i} 
                                onClick={() => onChange('bio', s)} 
                                className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-md text-gray-700 transition"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                             >
                                {s}
                            </motion.p>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ConfettiPiece: React.FC<{ delay: number; }> = ({ delay }) => {
    const colors = ['#f43f5e', '#ec4899', '#f97316', '#eab308', '#84cc16', '#10b981', '#3b82f6'];
    const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);
    
    const size = useMemo(() => Math.random() * 8 + 6, []);
    const shapeStyle = useMemo(() => {
        const r = Math.random();
        if (r < 0.33) return { width: `${size}px`, height: `${size}px`, borderRadius: '50%' };
        if (r < 0.66) return { width: `${size}px`, height: `${size * 0.4}px`, borderRadius: '2px' };
        return { width: `${size}px`, height: `${size}px`, borderRadius: '2px' };
    }, [size]);

    const duration = useMemo(() => Math.random() * 2 + 3, []);
    const xPath = useMemo(() => (Math.random() - 0.5) * 400, []);
    const yPath = useMemo(() => -(Math.random() * 200 + 300), []);
    const rotationPath = useMemo(() => (Math.random() - 0.5) * 1080, []);
    const initialRotation = useMemo(() => Math.random() * 360, []);

    return (
        <motion.div
            className="absolute"
            style={{
                backgroundColor: color,
                left: '50%',
                bottom: 0,
                ...shapeStyle,
            }}
            initial={{ x: 0, y: 20, opacity: 0, rotate: initialRotation }}
            animate={{
                x: xPath,
                y: [0, yPath, 600],
                opacity: [1, 1, 0],
                rotate: initialRotation + rotationPath,
            }}
            transition={{
                duration,
                ease: "easeOut",
                delay,
                times: [0, 0.3, 1],
            }}
        />
    );
};

const StepFinalize: React.FC = () => {
    const confetti = useMemo(() => Array.from({ length: 150 }).map((_, i) => (
        <ConfettiPiece key={i} delay={Math.random() * 1.2} />
    )), []);

    return (
        <div className="text-center relative">
            <div className="absolute inset-0 -bottom-20 pointer-events-none">
                {confetti}
            </div>
             <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -15, 15, -15, 0] }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                className="inline-block p-6 bg-emerald-100 rounded-full"
             >
                <PartyPopperIcon className="w-20 h-20 text-emerald-500" />
            </motion.div>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-2xl text-gray-700 font-semibold max-w-md mx-auto"
            >
                Votre profil est magnifique ! Préparez-vous à créer des liens authentiques.
            </motion.p>
        </div>
    );
};


// --- MAIN ONBOARDING VIEW COMPONENT ---

const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<OnboardingData>({
    name: '', age: '', gender: '', interestedIn: '',
    city: '', photos: [], bio: '', interests: [],
    distancePreference: 50,
  });

  const handleDataChange = useCallback((field: keyof OnboardingData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isNextDisabled = useMemo(() => {
    switch (step) {
      case 2: return !userData.name || !userData.age || !userData.gender;
      case 3: return !userData.interestedIn || userData.city.length < 2;
      case 4: return userData.photos.length < 2;
      case 5: return userData.interests.length < 3 || userData.bio.length < 20;
      default: return false;
    }
  }, [step, userData]);

  const renderStep = () => {
    switch (step) {
      case 1: return <motion.div key={1} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="" subtitle=""><StepWelcome /></OnboardingContainer></motion.div>;
      case 2: return <motion.div key={2} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="Parlons de vous" subtitle="Ces informations de base nous aident à vous présenter."><StepProfileBasics data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 3: return <motion.div key={3} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="Qui recherchez-vous ?" subtitle="Dites-nous en plus sur vos préférences et votre localisation."><StepPreferences data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 4: return <motion.div key={4} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="Montrez votre meilleur profil" subtitle="Une image vaut mille mots. Ajoutez-en au moins deux."><StepPhotos photos={userData.photos} onChange={(p) => handleDataChange('photos', p)} /></OnboardingContainer></motion.div>;
      case 5: return <motion.div key={5} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="Qu'est-ce qui vous passionne ?" subtitle="Choisissez au moins 3 centres d'intérêt et rédigez une bio."><StepBioAndInterests data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 6: return <motion.div key={6} variants={pageVariants} transition={pageTransition}><OnboardingContainer title="Touche finale !" subtitle="Tout est prêt."><StepFinalize /></OnboardingContainer></motion.div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between items-center p-4 sm:p-6">
      <header className="w-full max-w-lg">
        {step > 1 && <ProgressBar step={step} />}
      </header>
      
      <main className="flex-grow flex flex-col justify-center w-full my-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-lg">
        <div className="flex items-center gap-4">
          {step > 1 && (
            <button onClick={prevStep} className="font-bold text-gray-500 py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors">
              Retour
            </button>
          )}
          {step === TOTAL_STEPS ? (
             <motion.button 
                onClick={onComplete}
                className="flex-grow bg-emerald-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-emerald-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
             >
              Commencer à découvrir
            </motion.button>
          ) : (
            <motion.button 
                onClick={nextStep} 
                disabled={isNextDisabled} 
                className="flex-grow bg-rose-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:shadow-none"
                whileHover={{ scale: isNextDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isNextDisabled ? 1 : 0.95 }}
            >
              Suivant
            </motion.button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingView;