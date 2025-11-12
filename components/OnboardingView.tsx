import React, { useState, useMemo, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, HeartIcon, CameraIcon, PlusIcon, TrashIcon, CheckIcon, PartyPopperIcon } from './Icons';

// --- DATA & TYPES ---

interface OnboardingData {
  name: string;
  age: string;
  gender: 'Homme' | 'Femme' | 'Autre' | '';
  interestedIn: 'Hommes' | 'Femmes' | 'Tout le monde' | '';
  phone: { code: string; number: string; };
  city: string;
  photos: string[]; // base64 strings
  bio: string;
  interests: string[];
}

const interestsList = ['Voyage', 'Photographie', 'Cuisine', 'Randonnée', 'Art', 'Musique', 'Cinéma', 'Lecture', 'Fitness', 'Yoga', 'Danse', 'Jeux Vidéo'];
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
    <h1 className="font-display text-4xl font-bold text-gray-800">{title}</h1>
    <p className="mt-2 text-lg text-gray-500">{subtitle}</p>
    <div className="mt-10">{children}</div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -30 },
};

// --- ONBOARDING STEP COMPONENTS ---

const StepWelcome: React.FC = () => (
    <div className="text-center">
        <div className="inline-block p-6 bg-rose-100 rounded-full animate-pulse">
            <HeartIcon className="w-20 h-20 text-rose-500" />
        </div>
        <p className="mt-8 text-xl text-gray-600 max-w-md mx-auto">
            Préparez-vous à créer des liens authentiques. Construisons ensemble un profil qui vous ressemble.
        </p>
    </div>
);

const StepProfileBasics: React.FC<{ data: OnboardingData; onChange: (field: keyof OnboardingData, value: any) => void; }> = ({ data, onChange }) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <label htmlFor="name" className="text-lg font-semibold text-gray-700">Votre prénom</label>
            <input type="text" id="name" value={data.name} onChange={(e) => onChange('name', e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="ex: Marie" />
        </div>
        <div className="space-y-2">
            <label htmlFor="age" className="text-lg font-semibold text-gray-700">Votre âge</label>
            <input type="number" id="age" value={data.age} onChange={(e) => onChange('age', e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="ex: 28" />
        </div>
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
                {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto text-left">
                    {suggestions.map(city => (
                        <li key={city} onClick={() => { onChange('city', city); setSuggestions([]); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-lg">
                            {city}
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
};

const StepPhotos: React.FC<{ photos: string[]; onChange: (photos: string[]) => void; }> = ({ photos, onChange }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 6 - photos.length);
            // Fix: Explicitly type `file` as `File` to resolve a type inference issue.
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
        <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={`aspect-square rounded-2xl overflow-hidden relative ${index === 0 ? 'col-span-2 row-span-2' : ''} ${photos[index] ? '' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}>
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
                </div>
            ))}
            <input id="photo-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
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

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                    <label className="text-lg font-semibold text-gray-700">Vos centres d'intérêt</label>
                    <span className="text-sm font-medium text-gray-500">{data.interests.length} / 5</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {interestsList.map(interest => (
                        <button key={interest} onClick={() => toggleInterest(interest)} className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2 text-md ${data.interests.includes(interest) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'}`}>
                            {interest}
                        </button>
                    ))}
                </div>
            </div>
             <div className="space-y-3">
                <label htmlFor="bio" className="text-lg font-semibold text-gray-700">Votre bio</label>
                <textarea id="bio" value={data.bio} onChange={(e) => onChange('bio', e.target.value)} className="w-full h-32 p-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="Un petit quelque chose sur vous..."></textarea>
                <button disabled={isLoading || data.interests.length === 0} onClick={generateBio} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold py-3 px-4 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon className="w-5 h-5"/>
                    {isLoading ? 'Réflexion...' : 'Suggérer avec l\'IA'}
                </button>
                 {suggestions.length > 0 && (
                    <div className="text-left space-y-2 pt-4">
                        {suggestions.map((s, i) => (
                            <p key={i} onClick={() => onChange('bio', s)} className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-md text-gray-700 transition">{s}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StepFinalize: React.FC<{ data: OnboardingData; onChange: (field: keyof OnboardingData, value: any) => void; isVerified: boolean; setIsVerified: (v: boolean) => void; }> = ({ data, onChange, isVerified, setIsVerified }) => {
    // In a real app, this would involve sending a code via SMS
    const handleVerify = () => setIsVerified(true);
    
    if (isVerified) {
        return (
            <div className="text-center">
                 <div className="inline-block p-6 bg-emerald-100 rounded-full">
                    <PartyPopperIcon className="w-20 h-20 text-emerald-500" />
                </div>
                <p className="mt-8 text-xl text-gray-600 max-w-md mx-auto">
                    Votre profil est prêt ! Préparez-vous à explorer et à créer des liens.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
             <label htmlFor="phone" className="text-lg font-semibold text-gray-700">Vérification</label>
             <p className="text-gray-500">Pour assurer la sécurité de notre communauté, veuillez vérifier votre numéro de téléphone. Il ne sera pas affiché sur votre profil.</p>
             <div className="flex gap-2 pt-2">
                <input type="text" value={data.phone.code} readOnly className="w-20 px-4 py-3 text-lg bg-gray-100 border-2 border-gray-300 rounded-xl" />
                <input type="tel" id="phone" value={data.phone.number} onChange={(e) => onChange('phone', { ...data.phone, number: e.target.value })} className="flex-grow px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" placeholder="Numéro de téléphone" />
             </div>
        </div>
    );
};

// --- MAIN ONBOARDING VIEW COMPONENT ---

const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [userData, setUserData] = useState<OnboardingData>({
    name: '', age: '', gender: '', interestedIn: '',
    phone: { code: '+33', number: '' }, city: '', photos: [], bio: '', interests: []
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
      case 4: return userData.photos.length < 1;
      case 5: return userData.interests.length < 3 || userData.bio.length < 10;
      case 6: return !isPhoneVerified && userData.phone.number.length < 5;
      default: return false;
    }
  }, [step, userData, isPhoneVerified]);

  const renderStep = () => {
    const key = isPhoneVerified ? `${step}-verified` : step;
    switch (step) {
      case 1: return <motion.div key={1} variants={pageVariants}><OnboardingContainer title="Bienvenue sur Fleur" subtitle="Commençons par créer votre profil."><StepWelcome /></OnboardingContainer></motion.div>;
      case 2: return <motion.div key={2} variants={pageVariants}><OnboardingContainer title="Parlons de vous" subtitle="Ces informations de base nous aident à vous présenter."><StepProfileBasics data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 3: return <motion.div key={3} variants={pageVariants}><OnboardingContainer title="Qui recherchez-vous ?" subtitle="Dites-nous en plus sur vos préférences et votre localisation."><StepPreferences data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 4: return <motion.div key={4} variants={pageVariants}><OnboardingContainer title="Montrez votre meilleur profil" subtitle="Ajoutez au moins une photo. La première sera votre photo principale."><StepPhotos photos={userData.photos} onChange={(p) => handleDataChange('photos', p)} /></OnboardingContainer></motion.div>;
      case 5: return <motion.div key={5} variants={pageVariants}><OnboardingContainer title="Qu'est-ce qui vous passionne ?" subtitle="Choisissez au moins 3 centres d'intérêt et rédigez une bio."><StepBioAndInterests data={userData} onChange={handleDataChange} /></OnboardingContainer></motion.div>;
      case 6: return <motion.div key={key} variants={pageVariants}><OnboardingContainer title={isPhoneVerified ? "Vous êtes prêt(e) !" : "Presque terminé !"} subtitle={isPhoneVerified ? "Il est temps de créer de vraies connexions." : "Une dernière étape pour la sécurité."}><StepFinalize data={userData} onChange={handleDataChange} isVerified={isPhoneVerified} setIsVerified={setIsPhoneVerified} /></OnboardingContainer></motion.div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between items-center p-4 sm:p-6">
      <header className="w-full max-w-lg">
        <ProgressBar step={step} />
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
          {step === TOTAL_STEPS && isPhoneVerified ? (
             <button onClick={onComplete} className="flex-grow bg-emerald-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-105">
              Commencer à découvrir
            </button>
          ) : step === TOTAL_STEPS && !isPhoneVerified ? (
             <button onClick={() => setIsPhoneVerified(true)} disabled={isNextDisabled} className="flex-grow bg-rose-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-rose-600 transition-all transform hover:scale-105 disabled:bg-gray-300 disabled:shadow-none disabled:scale-100">
              Vérifier et Terminer
            </button>
          ) : (
            <button onClick={nextStep} disabled={isNextDisabled} className="flex-grow bg-rose-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-rose-600 transition-all transform hover:scale-105 disabled:bg-gray-300 disabled:shadow-none disabled:scale-100">
              Suivant
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingView;
