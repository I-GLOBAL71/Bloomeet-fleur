
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppEvent, EventAttendee } from '../types';
import { PlusIcon, XIcon, CalendarIcon, UserIcon, TrashIcon, ShareIcon, UserPlusIcon, CameraIcon, SlidersIcon, BellIcon, EditIcon } from './Icons';

const mockAttendees: EventAttendee[] = [
  { id: 1, name: 'Chloé', avatar: 'https://picsum.photos/seed/woman1/100/100' },
  { id: 2, name: 'Lucas', avatar: 'https://picsum.photos/seed/man1/100/100' },
  { id: 4, name: 'Théo', avatar: 'https://picsum.photos/seed/man2/100/100' },
  { id: 5, name: 'Inès', avatar: 'https://picsum.photos/seed/woman3/100/100' },
];

const mockFriends: EventAttendee[] = [
    { id: 101, name: 'Alice', avatar: 'https://picsum.photos/seed/friend1/100/100' },
    { id: 102, name: 'Bob', avatar: 'https://picsum.photos/seed/friend2/100/100' },
    { id: 103, name: 'Charlie', avatar: 'https://picsum.photos/seed/friend3/100/100' },
    { id: 104, name: 'David', avatar: 'https://picsum.photos/seed/friend4/100/100' },
    { id: 1, name: 'Chloé', avatar: 'https://picsum.photos/seed/woman1/100/100' }, // Also an attendee
];

const mockEvents: AppEvent[] = [
  {
    id: 1,
    title: 'Soirée Pique-nique au Bord de la Seine',
    description: 'Rejoignez-nous pour une soirée décontractée avec de la bonne nourriture, de la musique douce et une vue imprenable sur la Tour Eiffel. Apportez votre couverture et votre plat préféré à partager !',
    date: '24 Juillet 2024, 19:00',
    creationDate: '2024-07-01T10:00:00Z',
    location: 'Champs de Mars, Paris',
    image: 'https://images.pexels.com/photos/1684151/pexels-photo-1684151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(0, 2),
    createdBy: 'Amélie',
    joiningFee: 0,
  },
  {
    id: 2,
    title: 'Atelier de Dégustation de Vins',
    description: 'Découvrez une sélection de vins fins de la région bordelaise animée par un sommelier expert. Une excellente occasion de rencontrer d\'autres amateurs de vin dans une ambiance conviviale.',
    date: '28 Juillet 2024, 18:30',
    creationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Le Baron Rouge, Lyon',
    image: 'https://images.pexels.com/photos/298604/pexels-photo-298604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(1, 4),
    createdBy: 'Julien',
    joiningFee: 25,
  },
  {
    id: 3,
    title: 'Randonnée Urbaine & Photographie',
    description: 'Explorez les rues cachées de Montmartre avec votre appareil photo. Nous découvrirons des joyaux architecturaux et terminerons par un verre dans un café local. Tous les niveaux sont les bienvenus.',
    date: '3 Août 2024, 14:00',
    creationDate: '2024-06-20T08:00:00Z',
    location: 'Métro Anvers, Paris',
    image: 'https://images.pexels.com/photos/373919/pexels-photo-373919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(0, 3),
    createdBy: 'Vous',
    joiningFee: 5,
  },
  {
    id: 4,
    title: 'Cinéma en Plein Air - Rétrospective',
    description: 'Projection d\'un film classique sous les étoiles. Une soirée nostalgique et conviviale.',
    date: '1 Juillet 2024, 21:00', // Past event
    creationDate: '2024-06-10T18:00:00Z',
    location: 'Parc de la Villette, Paris',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(2, 4),
    createdBy: 'Julien',
  }
];

const CURRENT_USER_ID = 99; // Mock current user ID

type EventFormData = {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string | null;
    joiningFee: string;
};
type FormErrors = {
    [key in keyof EventFormData]?: string;
};

const CreateEventModal: React.FC<{ onClose: () => void; onCreate: (event: Omit<AppEvent, 'id' | 'attendees' | 'creationDate'>) => void; }> = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: null,
        joiningFee: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof EventFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
                 if (errors.image) {
                    setErrors(prev => ({ ...prev, image: undefined }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Le titre est requis.";
        } else if (formData.title.length < 5) {
            newErrors.title = "Le titre doit comporter au moins 5 caractères.";
        }
        if (!formData.description.trim()) {
            newErrors.description = "La description est requise.";
        } else if (formData.description.length < 10) {
            newErrors.description = "La description doit comporter au moins 10 caractères.";
        }
        if (!formData.date) newErrors.date = "La date est requise.";
        if (!formData.time) newErrors.time = "L'heure est requise.";
        if (!formData.location.trim()) newErrors.location = "Le lieu est requis.";
        if (!formData.image) newErrors.image = "Une image de couverture est requise.";
        if (formData.joiningFee && isNaN(parseFloat(formData.joiningFee))) {
            newErrors.joiningFee = "Veuillez entrer un nombre valide.";
        }
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const dateObj = new Date(formData.date + 'T' + formData.time);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('fr-FR', { month: 'long' });
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        const formattedDate = `${day} ${capitalizedMonth} ${year}, ${hours}:${minutes}`;

        const newEvent = {
            title: formData.title,
            description: formData.description,
            date: formattedDate,
            location: formData.location,
            image: formData.image!,
            createdBy: 'Vous',
            joiningFee: formData.joiningFee ? parseFloat(formData.joiningFee) : 0,
        };
        onCreate(newEvent);
    };

    const getInputClass = (fieldName: keyof EventFormData) => {
        const baseClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-gray-50";
        const errorClass = "border-red-500 focus:ring-red-500 bg-red-50";
        const defaultClass = "border-gray-300 focus:ring-rose-500 focus:border-rose-500";
        return `${baseClass} ${errors[fieldName] ? errorClass : defaultClass}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative slide-in-right flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="font-display text-2xl font-bold mb-4">Créer un événement</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 -mr-2" noValidate>
                    <div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className={`w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center text-gray-400 transition-colors ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'}`}>
                                {formData.image ? (
                                    <img src={formData.image} alt="Aperçu de l'événement" className="w-full h-full object-cover rounded-lg"/>
                                ) : (
                                    <div className="text-center">
                                        <CameraIcon className="w-10 h-10 mx-auto"/>
                                        <p className="mt-2 text-sm font-semibold">Image de couverture</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                        {errors.image && <p className="text-red-600 text-sm mt-1 text-left">{errors.image}</p>}
                    </div>
                    <div>
                        <input name="title" value={formData.title} onChange={handleChange} className={getInputClass('title')} placeholder="Titre de l'événement" />
                        {errors.title && <p className="text-red-600 text-sm mt-1 text-left">{errors.title}</p>}
                    </div>
                    <div>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={`${getInputClass('description')} h-24`} placeholder="Description"></textarea>
                        {errors.description && <p className="text-red-600 text-sm mt-1 text-left">{errors.description}</p>}
                    </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                            <input name="date" value={formData.date} onChange={handleChange} type="date" className={getInputClass('date')} placeholder="Date" />
                            {errors.date && <p className="text-red-600 text-sm mt-1 text-left">{errors.date}</p>}
                        </div>
                        <div className="flex-1">
                            <input name="time" value={formData.time} onChange={handleChange} type="time" className={getInputClass('time')} placeholder="Heure" />
                            {errors.time && <p className="text-red-600 text-sm mt-1 text-left">{errors.time}</p>}
                        </div>
                    </div>
                    <div>
                        <input name="location" value={formData.location} onChange={handleChange} className={getInputClass('location')} placeholder="Lieu" />
                        {errors.location && <p className="text-red-600 text-sm mt-1 text-left">{errors.location}</p>}
                    </div>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                        <input name="joiningFee" value={formData.joiningFee} onChange={handleChange} type="number" className={`${getInputClass('joiningFee')} pl-8`} placeholder="Frais d'inscription (laisser vide si gratuit)" min="0" step="0.01" />
                        {errors.joiningFee && <p className="text-red-600 text-sm mt-1 text-left">{errors.joiningFee}</p>}
                    </div>
                    <div className="flex gap-4 pt-2">
                         <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">Annuler</button>
                         <button type="submit" className="flex-1 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">Créer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InviteFriendsModal: React.FC<{
    onClose: () => void;
    onInvite: (friendIds: number[]) => void;
    friends: EventAttendee[];
    attendeeIds: number[];
}> = ({ onClose, onInvite, friends, attendeeIds }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const invitableFriends = friends.filter(f => 
        !attendeeIds.includes(f.id) && 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleInviteClick = () => {
        onInvite(selectedIds);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative slide-in-right flex flex-col h-[70vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="font-display text-2xl font-bold mb-4">Inviter des amis</h2>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un ami..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4"
                />
                <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
                    {invitableFriends.length > 0 ? invitableFriends.map(friend => {
                        const isSelected = selectedIds.includes(friend.id);
                        return (
                            <div 
                                key={friend.id} 
                                onClick={() => toggleSelection(friend.id)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-rose-100' : 'hover:bg-gray-100'}`}
                            >
                                <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover"/>
                                <span className="ml-4 font-semibold text-gray-700">{friend.name}</span>
                                <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-gray-300'}`}>
                                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-gray-500 pt-8">Aucun ami à inviter.</p>}
                </div>
                 <button 
                    onClick={handleInviteClick} 
                    disabled={selectedIds.length === 0}
                    className="w-full mt-4 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition disabled:bg-gray-300"
                >
                    Envoyer {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} invitation{selectedIds.length > 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg text-left">
        <p className="font-bold text-gray-800 text-sm">{`${label}`}</p>
        <p className="text-sm text-rose-500">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AttendeeChart: React.FC<{ creationDate: string; finalAttendees: number }> = ({ creationDate, finalAttendees }) => {
    const chartData = useMemo(() => {
        const data = [];
        const startDate = new Date(creationDate);
        const now = new Date();
        const diffDays = Math.ceil(Math.max(1, (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
        const numDataPoints = Math.min(diffDays, 7);

        if (numDataPoints <= 1) {
            data.push({
                label: startDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                count: finalAttendees
            });
            return data;
        }
        
        for (let i = 0; i < numDataPoints; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + Math.round((i / (numDataPoints - 1)) * (diffDays - 1) ));
            
            const count = Math.round(1 + (i / (numDataPoints - 1)) * (finalAttendees - 1));
            
            data.push({
                label: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                count: Math.max(1, count),
            });
        }
        
        return data;
    }, [creationDate, finalAttendees]);

    return (
        <div className="mt-8">
            <h2 className="font-semibold text-lg mb-4">Croissance des participants</h2>
            <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.1)' }}/>
                        <Bar dataKey="count" name="Participants" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const EventDetailView: React.FC<{ 
    event: AppEvent; 
    onClose: () => void; 
    onJoin: (id: number) => void; 
    onLeave: (id: number) => void; 
    isJoined: boolean; 
    isCreator: boolean; 
    onDeleteRequest: (event: AppEvent) => void; 
    onInviteClick: () => void;
    reminder?: string;
    onSetReminder: (eventId: number, reminderTime: string) => void;
    onCancelReminder: (eventId: number) => void;
}> = ({ event, onClose, onJoin, onLeave, isJoined, isCreator, onDeleteRequest, onInviteClick, reminder, onSetReminder, onCancelReminder }) => {
    
    const [isEditingReminder, setIsEditingReminder] = useState(false);
    const [customDate, setCustomDate] = useState('');
    const [customTime, setCustomTime] = useState('');
    const [reminderError, setReminderError] = useState<string | null>(null);
    
    const [isSharing, setIsSharing] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);

    useEffect(() => {
        if (shareError) {
            const timer = setTimeout(() => {
                setShareError(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [shareError]);

    const eventDate = useMemo(() => parseDate(event.date), [event.date]);
    
    const isPastEvent = useMemo(() => {
        if (!eventDate) return true;
        return eventDate < new Date();
    }, [eventDate]);

    const shouldShowChart = useMemo(() => {
        if (!event.creationDate) return false;
        const creation = new Date(event.creationDate);
        const now = new Date();
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
        return (now.getTime() - creation.getTime()) > oneWeekInMs && event.attendees.length > 1;
    }, [event.creationDate, event.attendees.length]);

    const handleShare = async () => {
        if (isSharing) return;

        if (navigator.share) {
            setIsSharing(true);
            setShareError(null);
            try {
                await navigator.share({
                    title: `Événement Fleur : ${event.title}`,
                    text: `Rejoins-moi pour "${event.title}" le ${event.date} ! J'ai trouvé cet événement sur Fleur. #FleurApp`,
                    url: window.location.origin,
                });
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    // User cancelled, do nothing.
                } else {
                    console.error('Error sharing event:', error);
                    setShareError("Le partage a échoué. Veuillez réessayer.");
                }
            } finally {
                setIsSharing(false);
            }
        } else {
             setShareError("Le partage n'est pas supporté sur cet appareil.");
        }
    };
    
    const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];
    const formatTimeForInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleEditClick = () => {
        setReminderError(null);
        if (reminder) {
            const reminderDate = new Date(reminder);
            setCustomDate(formatDateForInput(reminderDate));
            setCustomTime(formatTimeForInput(reminderDate));
        } else if (eventDate) {
            // Default to 1 hour before event
            const defaultReminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000);
            setCustomDate(formatDateForInput(defaultReminderDate));
            setCustomTime(formatTimeForInput(defaultReminderDate));
        }
        setIsEditingReminder(true);
    };

    const handleCancelEdit = () => {
        setIsEditingReminder(false);
        setReminderError(null);
    };

    const handleSetQuickReminder = (minutesBefore: number) => {
        if (!eventDate) return;
        const reminderDate = new Date(eventDate.getTime() - minutesBefore * 60 * 1000);

        if (reminderDate < new Date()) {
            setReminderError("Vous ne pouvez pas définir un rappel dans le passé.");
            return;
        }

        onSetReminder(event.id, reminderDate.toISOString());
        setIsEditingReminder(false);
        setReminderError(null);
    };

    const handleConfirmCustomReminder = () => {
        if (!customDate || !customTime || !eventDate) {
            setReminderError("Veuillez spécifier une date et une heure complètes.");
            return;
        }
        const reminderDate = new Date(`${customDate}T${customTime}`);
        if (isNaN(reminderDate.getTime())) {
            setReminderError("Date ou heure invalide.");
            return;
        }

        if (reminderDate < new Date()) {
            setReminderError("Vous ne pouvez pas définir un rappel dans le passé.");
            return;
        }
        if (reminderDate > eventDate) {
            setReminderError("Le rappel ne peut pas être après le début de l'événement.");
            return;
        }

        onSetReminder(event.id, reminderDate.toISOString());
        setIsEditingReminder(false);
        setReminderError(null);
    };
    
    const handleDeleteReminder = () => {
        onCancelReminder(event.id);
        setIsEditingReminder(false);
        setReminderError(null);
    };

    return (
        <div className="absolute inset-0 bg-gray-50 z-20 overflow-y-auto pb-20 slide-in-right">
             <AnimatePresence>
                {shareError && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg"
                    >
                        {shareError}
                    </motion.div>
                )}
            </AnimatePresence>
             <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
             <button onClick={onClose} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full text-gray-800 backdrop-blur-sm shadow-md hover:bg-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
             </button>
             {navigator.share && (
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 backdrop-blur-sm shadow-md hover:bg-white transition active:scale-90 disabled:opacity-50"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
             )}
             <div className="p-6">
                <h1 className="font-display text-3xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <CalendarIcon className="w-5 h-5" /> <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-gray-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{event.location}</span>
                </div>
                 {event.joiningFee != null && (
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>{event.joiningFee > 0 ? `${event.joiningFee.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}` : 'Gratuit'}</span>
                    </div>
                )}
                 <p className="mt-4 text-gray-700">{event.description}</p>
                 
                 {!isPastEvent && (
                    <div className="mt-6 pt-6 border-t">
                        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <BellIcon className="w-5 h-5" /> Rappel
                        </h2>
                        
                        {!isEditingReminder && reminder && (
                            <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
                                <p className="text-green-800 text-sm font-medium">
                                    Défini pour : {new Date(reminder).toLocaleString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                                <button onClick={handleEditClick} className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg transition-colors">
                                    <EditIcon className="w-4 h-4" /> Modifier
                                </button>
                            </div>
                        )}

                        {!isEditingReminder && !reminder && (
                            <button onClick={handleEditClick} className="w-full flex items-center justify-center gap-2 bg-rose-100 text-rose-700 font-bold py-3 px-4 rounded-lg hover:bg-rose-200 transition-colors">
                                Définir un rappel
                            </button>
                        )}

                        {isEditingReminder && (
                            <div className="p-4 bg-gray-100 rounded-lg space-y-4">
                                <div>
                                    <label className="font-semibold text-sm text-gray-600">Options rapides</label>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <button onClick={() => handleSetQuickReminder(30)} className="text-sm py-2 px-1 bg-white border rounded-md hover:bg-rose-50 hover:border-rose-300 transition">30 min avant</button>
                                        <button onClick={() => handleSetQuickReminder(60)} className="text-sm py-2 px-1 bg-white border rounded-md hover:bg-rose-50 hover:border-rose-300 transition">1 heure avant</button>
                                        <button onClick={() => handleSetQuickReminder(1440)} className="text-sm py-2 px-1 bg-white border rounded-md hover:bg-rose-50 hover:border-rose-300 transition">1 jour avant</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-semibold text-sm text-gray-600">Personnalisé</label>
                                    <div className="flex gap-2 mt-2">
                                        <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
                                        <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
                                    </div>
                                </div>

                                {reminderError && <p className="text-red-600 text-sm font-semibold">{reminderError}</p>}

                                <div className="flex flex-col gap-2 pt-2">
                                    <button onClick={handleConfirmCustomReminder} className="w-full py-2 px-3 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">
                                        Confirmer le rappel
                                    </button>
                                    <div className="flex gap-2">
                                        {reminder && (
                                            <button onClick={handleDeleteReminder} className="flex-1 py-2 px-3 rounded-lg text-red-700 bg-red-100 font-semibold hover:bg-red-200 transition">
                                                Supprimer
                                            </button>
                                        )}
                                        <button onClick={handleCancelEdit} className="flex-1 py-2 px-3 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}

                 {shouldShowChart && event.creationDate && (
                    <AttendeeChart creationDate={event.creationDate} finalAttendees={event.attendees.length} />
                 )}

                 <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold text-lg flex items-center gap-2"><UserIcon className="w-5 h-5" /> {event.attendees.length} Participants</h2>
                        {(isJoined || isCreator) && (
                            <button onClick={onInviteClick} className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors">
                                <UserPlusIcon className="w-4 h-4" /> Inviter
                            </button>
                        )}
                    </div>
                    <div className="flex -space-x-2">
                        {event.attendees.map(p => <img key={p.id} src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full border-2 border-white object-cover"/>)}
                    </div>
                 </div>
                 {isCreator && (
                     <div className="mt-8 border-t pt-6">
                         <h2 className="font-semibold text-lg mb-3">Actions du créateur</h2>
                         <button
                             onClick={() => onDeleteRequest(event)}
                             className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 font-bold py-3 px-4 rounded-lg hover:bg-red-200 transition-colors"
                         >
                             <TrashIcon className="w-5 h-5" />
                             Supprimer l'événement
                         </button>
                     </div>
                 )}
             </div>
             <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t">
                 {!isCreator && (isJoined ? (
                     <button onClick={() => onLeave(event.id)} className="w-full bg-gray-300 text-gray-800 font-bold py-4 rounded-xl">Quitter l'événement</button>
                 ) : (
                     <button onClick={() => onJoin(event.id)} className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl">Rejoindre</button>
                 ))}
             </div>
        </div>
    );
};

const monthMap: { [key: string]: number } = {
  'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
  'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
};

const parseDate = (dateString: string): Date | null => {
    const parts = dateString.replace(',', '').split(' ');
    if (parts.length < 4) return null;
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const month = monthMap[monthName];
    const year = parseInt(parts[2], 10);
    const [hour, minute] = parts[3].split(':').map(Number);

    if (isNaN(day) || month === undefined || isNaN(year) || isNaN(hour) || isNaN(minute)) {
        console.error("Invalid date string format:", dateString);
        return null;
    }
    return new Date(year, month, day, hour, minute);
};

type EventTab = 'upcoming' | 'past' | 'mine';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
            isActive
                ? 'bg-rose-500 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
        {label}
    </button>
);

const ConfirmationModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    confirmButtonClass?: string;
}> = ({ title, message, onConfirm, onCancel, confirmText = "Supprimer", confirmButtonClass = "bg-red-600 hover:bg-red-700" }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 fade-in">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl slide-in-right">
            <h2 className="font-display text-2xl font-bold mb-3 text-gray-800">{title}</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">
                    Annuler
                </button>
                <button onClick={onConfirm} className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition ${confirmButtonClass}`}>
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
);

const PREFERENCES_KEY = 'fleurEventCardPreferences';
type EventCardLayout = 'default' | 'compact';
type EventCardPreferences = {
    layout: EventCardLayout;
    backgroundColor: string;
};

const CustomizeModal: React.FC<{
    onClose: () => void;
    currentPrefs: EventCardPreferences;
    onPrefsChange: (newPrefs: EventCardPreferences) => void;
}> = ({ onClose, currentPrefs, onPrefsChange }) => {
    const colorOptions = ['bg-white', 'bg-slate-50', 'bg-rose-50', 'bg-sky-50'];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end p-4 fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative slide-in-right flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="font-display text-2xl font-bold mb-6">Personnaliser l'affichage</h2>
                
                <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Mise en page</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => onPrefsChange({ ...currentPrefs, layout: 'default' })} className={`p-3 border-2 rounded-lg text-center transition-colors ${currentPrefs.layout === 'default' ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}`}>
                            <span className="font-semibold">Défaut</span>
                        </button>
                        <button onClick={() => onPrefsChange({ ...currentPrefs, layout: 'compact' })} className={`p-3 border-2 rounded-lg text-center transition-colors ${currentPrefs.layout === 'compact' ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}`}>
                            <span className="font-semibold">Compact</span>
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Couleur de fond</h3>
                    <div className="flex justify-center gap-4">
                        {colorOptions.map(color => (
                            <button 
                                key={color} 
                                onClick={() => onPrefsChange({ ...currentPrefs, backgroundColor: color })} 
                                className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${color} ${currentPrefs.backgroundColor === color ? 'border-rose-500 scale-110' : 'border-gray-200'}`}
                                aria-label={`Select ${color} background`}
                            />
                        ))}
                    </div>
                </div>

                <button onClick={onClose} className="w-full py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">Terminé</button>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
        <div className="p-3 bg-rose-100 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
    </div>
);

const EventsDashboard: React.FC<{ data: { totalEvents: number; totalAttendees: number; popularEventTypes: { name: string, count: number }[] } }> = ({ data }) => {
    return (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">Tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MetricCard title="Événements créés" value={data.totalEvents} icon={<CalendarIcon className="w-6 h-6 text-rose-500" />} />
                <MetricCard title="Participants uniques" value={data.totalAttendees} icon={<UserIcon className="w-6 h-6 text-rose-500" />} />
            </div>

            <h3 className="font-semibold text-lg text-gray-800 mb-2">Types d'événements populaires</h3>
            <div className="w-full h-64 bg-white p-4 rounded-xl shadow-md">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data.popularEventTypes}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                        <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.1)' }}/>
                        <Bar dataKey="count" name="Nombre d'événements" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const EventsView: React.FC = () => {
    const [events, setEvents] = useState<AppEvent[]>(mockEvents);
    const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
    const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [preferences, setPreferences] = useState<EventCardPreferences>({
        layout: 'default',
        backgroundColor: 'bg-white',
    });
    const [reminders, setReminders] = useState<{ [eventId: number]: string }>({});
    
    const REMINDERS_KEY = 'fleurEventReminders';

    useEffect(() => {
        try {
            const savedReminders = localStorage.getItem(REMINDERS_KEY);
            if (savedReminders) {
                setReminders(JSON.parse(savedReminders));
            }
        } catch (error) {
            console.error("Failed to load event reminders:", error);
        }
    }, []);

    useEffect(() => {
        try {
            const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
            if (savedPrefs) {
                const parsedPrefs = JSON.parse(savedPrefs);
                if (parsedPrefs.layout && parsedPrefs.backgroundColor) {
                    setPreferences(parsedPrefs);
                }
            }
        } catch (error) {
            console.error("Failed to load event card preferences:", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error("Failed to save event card preferences:", error);
        }
    }, [preferences]);
    
    const handleSetReminder = (eventId: number, reminderTime: string) => {
        const newReminders = { ...reminders, [eventId]: reminderTime };
        setReminders(newReminders);
        try {
            localStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
        } catch (error) {
            console.error("Failed to save event reminders:", error);
        }
    };

    const handleCancelReminder = (eventId: number) => {
        const { [eventId]: _, ...remainingReminders } = reminders;
        setReminders(remainingReminders);
        try {
            localStorage.setItem(REMINDERS_KEY, JSON.stringify(remainingReminders));
        } catch (error) {
            console.error("Failed to save event reminders:", error);
        }
    };

    const handleJoin = (id: number) => {
        setJoinedEventIds(prev => [...prev, id]);
        const updatedEvents = events.map(e => e.id === id ? { ...e, attendees: [...e.attendees, {id: CURRENT_USER_ID, name: 'Vous', avatar: 'https://picsum.photos/seed/currentuser/100/100'}] } : e);
        setEvents(updatedEvents);
        setSelectedEvent(updatedEvents.find(e => e.id === id) || null);
    };

    const handleLeave = (id: number) => {
        setJoinedEventIds(prev => prev.filter(eventId => eventId !== id));
        const updatedEvents = events.map(e => e.id === id ? { ...e, attendees: e.attendees.filter(p => p.id !== CURRENT_USER_ID)} : e);
        setEvents(updatedEvents);
        setSelectedEvent(updatedEvents.find(e => e.id === id) || null);
    };
    
    const handleCreate = (newEventData: Omit<AppEvent, 'id' | 'attendees' | 'creationDate'>) => {
        const newEvent: AppEvent = {
            ...newEventData,
            id: Date.now(),
            creationDate: new Date().toISOString(),
            attendees: [{id: CURRENT_USER_ID, name: 'Vous', avatar: 'https://picsum.photos/seed/currentuser/100/100'}]
        };
        setEvents(prev => [newEvent, ...prev]);
        setJoinedEventIds(prev => [...prev, newEvent.id]);
        setShowCreateModal(false);
        setActiveTab('upcoming');
    };

    const handleDeleteRequest = (event: AppEvent) => {
        setEventToDelete(event);
    };

    const handleConfirmDelete = () => {
        if (!eventToDelete) return;
        setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setEventToDelete(null);
        setSelectedEvent(null);
    };

    const handleCancelDelete = () => {
        setEventToDelete(null);
    };

    const handleSendInvites = (invitedIds: number[]) => {
        console.log(`Inviting friends with IDs: ${invitedIds.join(', ')} to event ${selectedEvent?.title}`);
        // Here you would typically handle the logic to send notifications
        setShowInviteModal(false);
    };
    
    const dashboardData = useMemo(() => {
        const totalEvents = events.length;

        const allAttendees = events.flatMap(event => event.attendees);
        const uniqueAttendeeIds = new Set(allAttendees.map(attendee => attendee.id));
        const totalAttendees = uniqueAttendeeIds.size;

        const eventTypes: { [key: string]: number } = {};
        const keywords: { [key: string]: string[] } = {
            'Plein air': ['pique-nique', 'randonnée', 'plein air', 'seine', 'parc'],
            'Gastronomie': ['dégustation', 'vin', 'nourriture', 'recettes', 'restaurant', 'atelier'],
            'Culture': ['cinéma', 'photographie', 'art', 'musique', 'musée', 'concert'],
            'Soirée': ['soirée', 'bar', 'verre', 'fête'],
        };

        events.forEach(event => {
            const title = event.title.toLowerCase();
            let categorized = false;
            for (const type in keywords) {
                if (keywords[type].some(keyword => title.includes(keyword))) {
                    eventTypes[type] = (eventTypes[type] || 0) + 1;
                    categorized = true;
                    break; // categorize only once
                }
            }
            if (!categorized) {
                eventTypes['Autre'] = (eventTypes['Autre'] || 0) + 1;
            }
        });

        const popularEventTypes = Object.entries(eventTypes)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return { totalEvents, totalAttendees, popularEventTypes };
    }, [events]);
    
    const filteredEvents = useMemo(() => {
        const now = new Date();
        switch (activeTab) {
            case 'past':
                return events
                    .filter(e => {
                        const eventDate = parseDate(e.date);
                        return eventDate && eventDate < now;
                    })
                    .sort((a, b) => (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0));
            case 'mine':
                return events
                    .filter(e => e.createdBy === 'Vous')
                    .sort((a, b) => (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0));
            case 'upcoming':
            default:
                return events
                    .filter(e => {
                        const eventDate = parseDate(e.date);
                        return !eventDate || eventDate >= now;
                    })
                    .sort((a, b) => (parseDate(a.date)?.getTime() || 0) - (parseDate(b.date)?.getTime() || 0));
        }
    }, [events, activeTab]);

    const emptyStates = {
      upcoming: { title: "Aucun événement à venir", message: "Revenez plus tard ou créez le vôtre !"},
      past: { title: "Aucun événement passé", message: "Les événements auxquels vous avez participé apparaîtront ici."},
      mine: { title: "Vous n'avez créé aucun événement", message: "Cliquez sur 'Créer' pour organiser votre propre rencontre."}
    };

    return (
        <div className="relative h-full">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-display text-4xl font-bold text-gray-800">Événements</h1>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setShowCustomizeModal(true)} className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-100 rounded-full transition-colors">
                            <SlidersIcon className="w-6 h-6" />
                        </button>
                        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-rose-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-rose-600 transition">
                            <PlusIcon className="w-5 h-5" />
                            Créer
                        </button>
                    </div>
                </div>

                <EventsDashboard data={dashboardData} />

                <div className="flex justify-center gap-2 my-6">
                    <TabButton label="À venir" isActive={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
                    <TabButton label="Passés" isActive={activeTab === 'past'} onClick={() => setActiveTab('past')} />
                    <TabButton label="Mes événements" isActive={activeTab === 'mine'} onClick={() => setActiveTab('mine')} />
                </div>
                
                <div key={activeTab} className="space-y-6 fade-in">
                    {filteredEvents.length > 0 ? filteredEvents.map((event, index) => (
                         <motion.div 
                            key={event.id} 
                            onClick={() => setSelectedEvent(event)} 
                            className={`${preferences.backgroundColor} rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                         >
                            {preferences.layout === 'default' ? (
                                <>
                                    <div className="relative">
                                        <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                                        {event.joiningFee != null && (
                                            <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white ${event.joiningFee > 0 ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                {event.joiningFee > 0 ? event.joiningFee.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : 'GRATUIT'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h2 className="font-bold text-lg text-gray-800">{event.title}</h2>
                                        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex -space-x-2">
                                                {event.attendees.slice(0, 4).map(p => <img key={p.id} src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border-2 border-white object-cover"/>)}
                                            </div>
                                            <span className="text-sm font-semibold text-rose-600">{event.attendees.length} participants</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full">
                                    <img src={event.image} alt={event.title} className="w-28 h-full object-cover" />
                                    <div className="p-3 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h2 className="font-bold text-md text-gray-800 line-clamp-2 leading-tight">{event.title}</h2>
                                            <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex -space-x-2">
                                                {event.attendees.slice(0, 3).map(p => <img key={p.id} src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full border border-white object-cover"/>)}
                                            </div>
                                            <span className="text-xs font-semibold text-rose-600">{event.attendees.length} participants</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )) : (
                       <div className="text-center py-16 px-4 text-gray-500">
                           <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                           <h3 className="text-xl font-semibold text-gray-700">{emptyStates[activeTab].title}</h3>
                           <p className="mt-2">{emptyStates[activeTab].message}</p>
                       </div>
                    )}
                </div>
            </div>

            {selectedEvent && (
                <EventDetailView 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    isJoined={joinedEventIds.includes(selectedEvent.id)}
                    isCreator={selectedEvent.createdBy === 'Vous'}
                    onDeleteRequest={handleDeleteRequest}
                    onInviteClick={() => setShowInviteModal(true)}
                    reminder={reminders[selectedEvent.id]}
                    onSetReminder={handleSetReminder}
                    onCancelReminder={handleCancelReminder}
                />
            )}
            
            {showCreateModal && <CreateEventModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />}

            {eventToDelete && (
                <ConfirmationModal
                    title="Confirmer la suppression"
                    message={`Êtes-vous sûr de vouloir supprimer l'événement "${eventToDelete.title}" ? Cette action est irréversible.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {showInviteModal && selectedEvent && (
                <InviteFriendsModal
                    onClose={() => setShowInviteModal(false)}
                    onInvite={handleSendInvites}
                    friends={mockFriends}
                    attendeeIds={selectedEvent.attendees.map(a => a.id)}
                />
            )}

            {showCustomizeModal && (
                <CustomizeModal
                    onClose={() => setShowCustomizeModal(false)}
                    currentPrefs={preferences}
                    onPrefsChange={setPreferences}
                />
            )}
        </div>
    );
};

export default EventsView;
