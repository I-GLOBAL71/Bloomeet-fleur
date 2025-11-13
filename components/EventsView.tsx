import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import QRCode from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AppEvent, EventAttendee } from '../types';
import { PlusIcon, XIcon, CalendarIcon, UserIcon, TrashIcon, ShareIcon, UserPlusIcon, CameraIcon, SlidersIcon, BellIcon, EditIcon, PetalIcon, SparklesIcon, ArrowLeftIcon, TicketIcon, QrCodeIcon, CheckIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

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
    isoDate: new Date(2024, 6, 24, 19, 0).toISOString(),
    creationDate: '2024-07-01T10:00:00Z',
    location: 'Champs de Mars, Paris',
    image: 'https://images.pexels.com/photos/1684151/pexels-photo-1684151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(0, 2).map(a => ({...a, checkedIn: false})),
    createdBy: 'Amélie',
    joiningFee: 0,
  },
  {
    id: 2,
    title: 'Atelier de Dégustation de Vins',
    description: 'Découvrez une sélection de vins fins de la région bordelaise animée par un sommelier expert. Une excellente occasion de rencontrer d\'autres amateurs de vin dans une ambiance conviviale.',
    date: '28 Juillet 2024, 18:30',
    isoDate: new Date(2024, 6, 28, 18, 30).toISOString(),
    creationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Le Baron Rouge, Lyon',
    image: 'https://images.pexels.com/photos/298604/pexels-photo-298604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(1, 4).map(a => ({...a, checkedIn: false})),
    createdBy: 'Julien',
    joiningFee: 25,
  },
  {
    id: 3,
    title: 'Randonnée Urbaine & Photographie',
    description: 'Explorez les rues cachées de Montmartre avec votre appareil photo. Nous découvrirons des joyaux architecturaux et terminerons par un verre dans un café local. Tous les niveaux sont les bienvenus.',
    date: '3 Août 2024, 14:00',
    isoDate: new Date(2024, 7, 3, 14, 0).toISOString(),
    creationDate: '2024-06-20T08:00:00Z',
    location: 'Métro Anvers, Paris',
    image: 'https://images.pexels.com/photos/373919/pexels-photo-373919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(0, 3).map(a => ({...a, checkedIn: true})),
    createdBy: 'Vous',
    joiningFee: 5,
  },
  {
    id: 4,
    title: 'Cinéma en Plein Air - Rétrospective',
    description: 'Projection d\'un film classique sous les étoiles. Une soirée nostalgique et conviviale.',
    date: '1 Juillet 2024, 21:00', // Past event
    isoDate: new Date(2024, 6, 1, 21, 0).toISOString(),
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

const petalPacks = [
  { amount: 100, price: '1.99€', popular: false },
  { amount: 550, price: '9.99€', popular: true },
  { amount: 1200, price: '19.99€', popular: false },
];

const BuyPetalsModal: React.FC<{
    onClose: () => void;
    onBuy: (amount: number) => void;
}> = ({ onClose, onBuy }) => {
    const { t } = useTranslation();
    const [customAmount, setCustomAmount] = useState('');
    const customPrice = (Number(customAmount) * 0.02).toFixed(2);

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <PetalIcon className="w-16 h-16 text-rose-400 mx-auto" />
                <h2 className="font-display text-2xl font-bold mt-4 text-gray-800">{t('profile.petals.shopTitle')}</h2>
                <p className="text-gray-500 mt-2 mb-6">{t('profile.petals.shopSubtitle')}</p>
                
                <div className="space-y-3">
                    {petalPacks.map(pack => (
                        <div
                            key={pack.amount}
                            className="relative w-full text-start p-4 rounded-xl border-2 font-semibold bg-white border-gray-300"
                        >
                            {pack.popular && (
                                <div className="absolute top-0 end-4 -translate-y-1/2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <SparklesIcon className="w-4 h-4" /> {t('profile.petals.popular')}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xl flex items-center gap-1"><PetalIcon className="w-6 h-6" /> {pack.amount} {t('profile.petals.petals')}</span>
                                    <p className="text-sm text-gray-500 font-normal">{pack.price}</p>
                                </div>
                                <button
                                    onClick={() => onBuy(pack.amount)}
                                    className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95"
                                >
                                    {t('profile.petals.buy')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">{t('profile.petals.or')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                     <h3 className="font-semibold text-lg text-gray-800">{t('profile.petals.customAmount')}</h3>
                     <div className="flex items-center gap-3">
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder={t('profile.petals.customPlaceholder')}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg"
                            min="1"
                        />
                        <button
                            onClick={() => onBuy(Number(customAmount))}
                            disabled={!customAmount || Number(customAmount) <= 0}
                            className="bg-rose-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {t('profile.petals.buy')}
                        </button>
                    </div>
                    {Number(customAmount) > 0 && (
                        <p className="text-sm text-gray-500">{t('profile.petals.estimatedPrice')}: {customPrice}€</p>
                    )}
                </div>
                
            </motion.div>
        </motion.div>
    );
};

const CreateEventModal: React.FC<{ eventToEdit?: AppEvent | null; onClose: () => void; onSave: (event: AppEvent) => void; }> = ({ eventToEdit, onClose, onSave }) => {
    const { t } = useTranslation();
    const isEditMode = !!eventToEdit;
    const [formData, setFormData] = useState<EventFormData>({
        title: '', description: '', date: '', time: '', location: '', image: null, joiningFee: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isEditMode && eventToEdit) {
            const eventDate = eventToEdit.isoDate ? new Date(eventToEdit.isoDate) : new Date();
            setFormData({
                title: eventToEdit.title,
                description: eventToEdit.description,
                date: eventDate.toISOString().split('T')[0],
                time: eventDate.toTimeString().slice(0, 5),
                location: eventToEdit.location,
                image: eventToEdit.image,
                joiningFee: eventToEdit.joiningFee?.toString() ?? '',
            });
        }
    }, [eventToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof EventFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
                if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim() || formData.title.length < 5) newErrors.title = t('events.createModal.errors.titleMin');
        if (!formData.description.trim() || formData.description.length < 10) newErrors.description = t('events.createModal.errors.descriptionMin');
        if (!formData.date) newErrors.date = t('events.createModal.errors.dateRequired');
        if (!formData.time) newErrors.time = t('events.createModal.errors.timeRequired');
        if (!formData.location.trim()) newErrors.location = t('events.createModal.errors.locationRequired');
        if (!formData.image) newErrors.image = t('events.createModal.errors.imageRequired');
        if (formData.joiningFee && isNaN(parseFloat(formData.joiningFee))) newErrors.joiningFee = t('events.createModal.errors.feeInvalid');
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const dateObj = new Date(`${formData.date}T${formData.time}`);
        const formattedDate = dateObj.toLocaleString(t.language, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        const savedEvent: AppEvent = {
            id: eventToEdit?.id || Date.now(),
            title: formData.title,
            description: formData.description,
            date: formattedDate,
            isoDate: dateObj.toISOString(),
            location: formData.location,
            image: formData.image!,
            createdBy: eventToEdit?.createdBy || t('common.you'),
            attendees: eventToEdit?.attendees || [{ id: CURRENT_USER_ID, name: t('common.you'), avatar: 'https://picsum.photos/seed/currentuser/100/100' }],
            creationDate: eventToEdit?.creationDate || new Date().toISOString(),
            joiningFee: formData.joiningFee ? parseInt(formData.joiningFee, 10) : 0,
        };
        onSave(savedEvent);
    };

    const getInputClass = (fieldName: keyof EventFormData) => `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-gray-50 ${errors[fieldName] ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-rose-500 focus:border-rose-500'}`;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 fade-in">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                <h2 className="font-display text-2xl font-bold mb-4">{isEditMode ? t('common.edit') + ' ' + t('events.title') : t('events.createModal.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 -mr-2" noValidate>
                    {/* Form fields... */}
                    <div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className={`w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center text-gray-400 transition-colors ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'}`}>
                                {formData.image ? <img src={formData.image} alt="Aperçu" className="w-full h-full object-cover rounded-lg"/> : <div className="text-center"><CameraIcon className="w-10 h-10 mx-auto"/><p className="mt-2 text-sm font-semibold">{t('events.createModal.coverImage')}</p></div>}
                            </div>
                        </label>
                        <input id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                        {errors.image && <p className="text-red-600 text-sm mt-1 text-left">{errors.image}</p>}
                    </div>
                    <div>
                        <input name="title" value={formData.title} onChange={handleChange} className={getInputClass('title')} placeholder={t('events.createModal.eventTitle')} />
                        {errors.title && <p className="text-red-600 text-sm mt-1 text-left">{errors.title}</p>}
                    </div>
                    <div>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={`${getInputClass('description')} h-24`} placeholder={t('events.createModal.description')}></textarea>
                        {errors.description && <p className="text-red-600 text-sm mt-1 text-left">{errors.description}</p>}
                    </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                            <input name="date" value={formData.date} onChange={handleChange} type="date" className={getInputClass('date')} />
                            {errors.date && <p className="text-red-600 text-sm mt-1 text-left">{errors.date}</p>}
                        </div>
                        <div className="flex-1">
                            <input name="time" value={formData.time} onChange={handleChange} type="time" className={getInputClass('time')} />
                            {errors.time && <p className="text-red-600 text-sm mt-1 text-left">{errors.time}</p>}
                        </div>
                    </div>
                    <div>
                        <input name="location" value={formData.location} onChange={handleChange} className={getInputClass('location')} placeholder={t('events.createModal.location')} />
                        {errors.location && <p className="text-red-600 text-sm mt-1 text-left">{errors.location}</p>}
                    </div>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><PetalIcon className="w-5 h-5"/></div>
                        <input name="joiningFee" value={formData.joiningFee} onChange={handleChange} type="number" className={`${getInputClass('joiningFee')} pl-10`} placeholder={t('events.createModal.fee')} min="0" step="1" />
                        {errors.joiningFee && <p className="text-red-600 text-sm mt-1 text-left">{errors.joiningFee}</p>}
                    </div>
                    <div className="flex gap-4 pt-2">
                         <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">{t('common.cancel')}</button>
                         <button type="submit" className="flex-1 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">{isEditMode ? t('common.save') : t('events.create')}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const InviteFriendsModal: React.FC<{
    onClose: () => void;
    onInvite: (friendIds: number[]) => void;
    friends: EventAttendee[];
    attendeeIds: number[];
}> = ({ onClose, onInvite, friends, attendeeIds }) => {
    const { t } = useTranslation();
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

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 fade-in">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md relative flex flex-col h-[70vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                <h2 className="font-display text-2xl font-bold mb-4">{t('events.inviteModal.title')}</h2>
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('events.inviteModal.searchPlaceholder')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4" />
                <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
                    {invitableFriends.length > 0 ? invitableFriends.map(friend => {
                        const isSelected = selectedIds.includes(friend.id);
                        return (
                            <div key={friend.id} onClick={() => toggleSelection(friend.id)} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-rose-100' : 'hover:bg-gray-100'}`}>
                                <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover"/>
                                <span className="ml-4 font-semibold text-gray-700">{friend.name}</span>
                                <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-gray-300'}`}>{isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}</div>
                            </div>
                        )
                    }) : <p className="text-center text-gray-500 pt-8">{t('events.inviteModal.empty')}</p>}
                </div>
                 <button onClick={() => onInvite(selectedIds)} disabled={selectedIds.length === 0} className="w-full mt-4 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition disabled:bg-gray-300">
                    {t('events.inviteModal.sendButton', { count: selectedIds.length > 0 ? `(${selectedIds.length})` : '', plural: selectedIds.length > 1 ? 's' : '' })}
                </button>
            </motion.div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg text-left">
        <p className="font-bold text-gray-800 text-sm">{`${label}`}</p>
        <p className="text-sm text-rose-500">{`${t('events.dashboard.attendeesCount')} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AttendeeChart: React.FC<{ creationDate: string; finalAttendees: number }> = ({ creationDate, finalAttendees }) => {
    const { t } = useTranslation();
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
            data.push({ label: date.toLocaleDateString(t.language, { month: 'short', day: 'numeric' }), count: Math.max(1, count) });
        }
        
        return data;
    }, [creationDate, finalAttendees, t.language]);

    return (
        <div className="mt-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">{t('events.detail.attendeesGrowth')}</h3>
            <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5, }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.1)' }}/>
                        <Bar dataKey="count" name={t('events.dashboard.attendeesCount')} fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const QRScannerModal: React.FC<{
    event: AppEvent;
    onClose: () => void;
    onCheckIn: (userId: number) => void;
}> = ({ event, onClose, onCheckIn }) => {
    const { t } = useTranslation();
    const [scanResult, setScanResult] = useState<{ status: 'success' | 'error' | 'warning'; message: string } | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );
        scannerRef.current = scanner;

        const onScanSuccess = (decodedText: string) => {
            if (scannerRef.current?.isScanning) {
                scanner.pause();
            }
            try {
                const data = JSON.parse(decodedText);
                if (data.type !== 'user-ticket' || data.eventId !== event.id) {
                    setScanResult({ status: 'error', message: t('events.scanner.invalidTicket') });
                } else {
                    const attendee = event.attendees.find(a => a.id === data.userId);
                    if (!attendee) {
                        setScanResult({ status: 'error', message: t('events.scanner.notRegistered') });
                    } else if (attendee.checkedIn) {
                        setScanResult({ status: 'warning', message: t('events.scanner.alreadyCheckedIn', { name: attendee.name }) });
                    } else {
                        onCheckIn(attendee.id);
                        setScanResult({ status: 'success', message: t('events.scanner.success', { name: attendee.name }) });
                    }
                }
            } catch (error) {
                setScanResult({ status: 'error', message: t('events.scanner.invalidQRCode') });
            }

            setTimeout(() => {
                setScanResult(null);
                if (scannerRef.current?.getState() === 2) { // 2 is PAUSED state
                    scanner.resume();
                }
            }, 3000);
        };

        scanner.render(onScanSuccess, (error) => {}); // Error callback is optional

        return () => {
             if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode-scanner.", error);
                });
            }
        };
    }, [event, onCheckIn, t]);

    const resultColors = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col justify-center items-center p-4 fade-in">
             <div id="qr-reader" className="w-full max-w-sm" />

            <AnimatePresence>
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`mt-6 p-4 rounded-lg font-semibold text-center w-full max-w-sm ${resultColors[scanResult.status]}`}
                    >
                        {scanResult.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={onClose} className="mt-8 bg-white/20 text-white font-bold py-3 px-8 rounded-full hover:bg-white/30 transition-colors">
                {t('common.cancel')}
            </button>
        </div>
    );
};

const QRTicketModal: React.FC<{
    event: AppEvent;
    isCreator: boolean;
    onClose: () => void;
    onScanClick: () => void;
}> = ({ event, isCreator, onClose, onScanClick }) => {
    const { t } = useTranslation();
    const title = isCreator ? t('events.detail.qr.creatorTitle') : t('events.detail.qr.attendeeTitle');
    const description = isCreator ? t('events.detail.qr.creatorDesc') : t('events.detail.qr.attendeeDesc');
    const qrValue = JSON.stringify(isCreator
        ? { eventId: event.id, type: 'event-check-in' }
        : { eventId: event.id, userId: CURRENT_USER_ID, type: 'user-ticket' }
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 fade-in">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                <h2 className="font-display text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <TicketIcon className="w-6 h-6 text-rose-500" />
                    {title}
                </h2>
                <p className="text-gray-500 mb-6">{event.title}</p>
                
                <div className="p-4 bg-gray-100 rounded-xl border inline-block">
                    <QRCode value={qrValue} size={192} />
                </div>
                
                <p className="text-gray-600 mt-6 mb-8 max-w-xs mx-auto">{description}</p>
                
                {isCreator && (
                    <button onClick={onScanClick} className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">
                        <QrCodeIcon className="w-5 h-5" />
                        {t('events.scanner.scanButton')}
                    </button>
                )}
            </motion.div>
        </div>
    );
};

const EventDetailView: React.FC<{ 
    event: AppEvent; 
    onClose: () => void; 
    onJoinRequest: (id: number) => void; 
    onLeave: (id: number) => void; 
    isJoined: boolean; 
    isCreator: boolean; 
    onDeleteRequest: (event: AppEvent) => void; 
    onEditRequest: (event: AppEvent) => void;
    onInviteClick: () => void;
    onUpdateAttendees: (eventId: number, newAttendees: EventAttendee[]) => void;
    currentUserPetalBalance: number;
    onShowBuyPetals: () => void;
}> = ({ event, onClose, onJoinRequest, onLeave, isJoined, isCreator, onDeleteRequest, onEditRequest, onInviteClick, onUpdateAttendees, currentUserPetalBalance, onShowBuyPetals }) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scrollRef });

    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);

    useEffect(() => {
        const mainScrollContainer = document.getElementById('main-scroll-container');
        if (mainScrollContainer) {
            mainScrollContainer.style.overflowY = 'hidden';
        }

        return () => {
            if (mainScrollContainer) {
                mainScrollContainer.style.overflowY = 'auto';
            }
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            if (showScannerModal || showTicketModal) {
                scrollRef.current.style.overflowY = 'hidden';
            } else {
                scrollRef.current.style.overflowY = 'auto';
            }
        }
    }, [showScannerModal, showTicketModal]);


    const headerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
    const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const stickyHeaderOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

    const eventDate = useMemo(() => event.isoDate ? new Date(event.isoDate) : null, [event.isoDate]);
    const isPastEvent = useMemo(() => eventDate ? eventDate < new Date() : true, [eventDate]);

    const joinButtonText = event.joiningFee && event.joiningFee > 0
        ? t('events.detail.joinEventWithFee', { cost: event.joiningFee })
        : t('events.detail.joinEvent');
    const canAfford = event.joiningFee != null ? currentUserPetalBalance >= event.joiningFee : true;
    
    const handleCheckIn = (userId: number) => {
        const newAttendees = event.attendees.map(attendee => 
            attendee.id === userId ? { ...attendee, checkedIn: true } : attendee
        );
        onUpdateAttendees(event.id, newAttendees);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <AnimatePresence>
                {showScannerModal && (
                    <QRScannerModal 
                        event={event}
                        onClose={() => setShowScannerModal(false)}
                        onCheckIn={handleCheckIn}
                    />
                )}
            </AnimatePresence>
             <AnimatePresence>
                {showTicketModal && !isPastEvent && (
                    <QRTicketModal
                        event={event}
                        isCreator={isCreator}
                        onClose={() => setShowTicketModal(false)}
                        onScanClick={() => {
                            setShowTicketModal(false);
                            setShowScannerModal(true);
                        }}
                    />
                )}
            </AnimatePresence>
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[90vh] bg-gray-50 rounded-t-2xl shadow-2xl flex flex-col"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                onClick={e => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-30 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
                    aria-label={t('common.cancel')}
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <motion.header 
                    style={{ opacity: stickyHeaderOpacity }}
                    className="absolute top-0 left-0 right-0 flex items-center p-3 border-b bg-white/80 backdrop-blur-sm z-20"
                >
                    <button onClick={onClose} className="p-2"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h2 className="ml-2 font-bold text-lg truncate">{event.title}</h2>
                </motion.header>

                <div ref={scrollRef} className="flex-grow overflow-y-auto overscroll-contain">
                    {/* Main Header */}
                    <motion.div style={{ scale: headerScale, y: headerY, opacity: headerOpacity }} className="relative h-64 w-full origin-top">
                        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h1 className="font-display text-3xl font-bold text-white shadow-2xl">{event.title}</h1>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="p-6 space-y-6 bg-gray-50">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-600"><CalendarIcon className="w-5 h-5" /> <span>{event.date}</span></div>
                            <div className="flex items-center gap-3 text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>{event.location}</span></div>
                             {event.joiningFee != null && event.joiningFee > 0 && (
                                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">{t('events.detail.fee')}</span>
                                        <div className="flex items-center gap-1 font-bold text-lg text-rose-600">
                                            <PetalIcon className="w-5 h-5"/>
                                            <span>{event.joiningFee}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-rose-100">
                                        <span className="text-sm text-gray-500">{t('profile.petals.yourPetals')}</span>
                                        <span className={`text-sm font-semibold flex items-center gap-1 ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                                            <PetalIcon className="w-4 h-4"/> {currentUserPetalBalance}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {event.joiningFee === 0 && (
                                <div className="flex items-center gap-3 text-gray-600"><PetalIcon className="w-5 h-5" /><span>{t('common.free')}</span></div>
                            )}
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed border-t pt-6">{event.description}</p>
                        
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><UserIcon className="w-5 h-5" /> {event.attendees.length} {t('events.detail.attendees')}</h3>
                                {(isJoined || isCreator) && !isPastEvent && <button onClick={onInviteClick} className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"><UserPlusIcon className="w-4 h-4" /> {t('events.detail.invite')}</button>}
                            </div>
                            <div className="space-y-3">
                                {event.attendees.map(p => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover"/>
                                        <span className="font-semibold text-gray-700">{p.name}</span>
                                        {p.checkedIn && (
                                            <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" title={t('events.scanner.checkedInTooltip')}>
                                                <CheckIcon className="w-4 h-4 text-white"/>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {event.creationDate && <div className="border-t pt-6"><AttendeeChart creationDate={event.creationDate} finalAttendees={event.attendees.length} /></div>}

                        {isCreator && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-lg mb-4">{t('events.detail.creatorActions')}</h3>
                                <div className="flex gap-4">
                                    {!isPastEvent && <button onClick={() => onEditRequest(event)} className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"><EditIcon className="w-5 h-5" />{t('common.edit')}</button>}
                                    <button onClick={() => onDeleteRequest(event)} className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 font-bold py-3 px-4 rounded-lg hover:bg-red-200 transition-colors"><TrashIcon className="w-5 h-5" />{t('common.delete')}</button>
                                </div>
                            </div>
                        )}
                         <div className="h-24" /> {/* Spacer for action button */}
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t">
                    {!isPastEvent && (
                        isCreator ? (
                            <button onClick={() => setShowTicketModal(true)} className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                                <TicketIcon className="w-6 h-6" />
                                {t('events.detail.manageEvent')}
                            </button>
                        ) : isJoined ? (
                            <div className="flex gap-4">
                                <button onClick={() => setShowTicketModal(true)} className="flex-1 bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                                    <TicketIcon className="w-6 h-6" />
                                    {t('events.detail.myTicket')}
                                </button>
                                <button onClick={() => onLeave(event.id)} className="py-4 px-5 bg-gray-200 text-gray-700 font-bold rounded-xl">
                                    {t('events.detail.leaveEvent')}
                                </button>
                            </div>
                        ) : canAfford ? (
                            <button onClick={() => onJoinRequest(event.id)} className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl transition-colors">
                                {joinButtonText}
                            </button>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-sm font-semibold text-red-600">{t('events.joinModal.insufficientFunds')}</p>
                                <button onClick={onShowBuyPetals} className="w-full bg-violet-500 text-white font-bold py-3 rounded-xl transition-colors">
                                    {t('events.joinModal.buyButton')}
                                </button>
                            </div>
                        )
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

type EventTab = 'upcoming' | 'past' | 'mine';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${ isActive ? 'bg-rose-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }`}
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
}> = ({ title, message, onConfirm, onCancel, confirmText, confirmButtonClass = "bg-red-600 hover:bg-red-700" }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 fade-in">
            <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
                <h2 className="font-display text-2xl font-bold mb-3 text-gray-800">{title}</h2>
                <p className="text-gray-600 mb-8">{message}</p>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">{t('common.cancel')}</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition ${confirmButtonClass}`}>{confirmText || t('common.delete')}</button>
                </div>
            </motion.div>
        </div>
    );
};

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
    const { t } = useTranslation();
    const colorOptions = ['bg-white', 'bg-slate-50', 'bg-rose-50', 'bg-sky-50'];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end p-4 fade-in">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white rounded-t-2xl p-6 w-full max-w-md relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                <h2 className="font-display text-2xl font-bold mb-6">{t('events.customizeModal.title')}</h2>
                
                <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">{t('events.customizeModal.layout')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => onPrefsChange({ ...currentPrefs, layout: 'default' })} className={`p-3 border-2 rounded-lg text-center transition-colors ${currentPrefs.layout === 'default' ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}`}><span className="font-semibold">{t('events.customizeModal.layoutDefault')}</span></button>
                        <button onClick={() => onPrefsChange({ ...currentPrefs, layout: 'compact' })} className={`p-3 border-2 rounded-lg text-center transition-colors ${currentPrefs.layout === 'compact' ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}`}><span className="font-semibold">{t('events.customizeModal.layoutCompact')}</span></button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">{t('events.customizeModal.backgroundColor')}</h3>
                    <div className="flex justify-center gap-4">
                        {colorOptions.map(color => <button key={color} onClick={() => onPrefsChange({ ...currentPrefs, backgroundColor: color })} className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${color} ${currentPrefs.backgroundColor === color ? 'border-rose-500 scale-110' : 'border-gray-200'}`} aria-label={`Select ${color} background`} />)}
                    </div>
                </div>

                <button onClick={onClose} className="w-full py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">{t('events.customizeModal.done')}</button>
            </motion.div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
        <div className="p-3 bg-rose-100 rounded-full mr-4">{icon}</div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
    </div>
);

const EventsDashboard: React.FC<{ data: { totalEvents: number; totalAttendees: number; popularEventTypes: { name: string, count: number }[] } }> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">{t('events.dashboard.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MetricCard title={t('events.dashboard.created')} value={data.totalEvents} icon={<CalendarIcon className="w-6 h-6 text-rose-500" />} />
                <MetricCard title={t('events.dashboard.attendees')} value={data.totalAttendees} icon={<UserIcon className="w-6 h-6 text-rose-500" />} />
            </div>

            <h3 className="font-semibold text-lg text-gray-800 mb-2">{t('events.dashboard.popularTypes')}</h3>
            <div className="w-full h-64 bg-white p-4 rounded-xl shadow-md">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.popularEventTypes} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                        <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.1)' }}/>
                        <Bar dataKey="count" name={t('events.dashboard.attendeesCount')} fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const EventsView: React.FC = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<AppEvent[]>(mockEvents);
    const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
    const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<AppEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);
    const [eventToJoin, setEventToJoin] = useState<AppEvent | null>(null);
    const [eventToInvite, setEventToInvite] = useState<AppEvent | null>(null);

    const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);

    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [cardPrefs, setCardPrefs] = useState<EventCardPreferences>({
        layout: 'default',
        backgroundColor: 'bg-white'
    });
    
    const [petalBalance, setPetalBalance] = useState(500); // Mock balance
    const [showBuyPetalsModal, setShowBuyPetalsModal] = useState(false);

    useEffect(() => {
        try {
            const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
            if (savedPrefs) {
                setCardPrefs(JSON.parse(savedPrefs));
            }
        } catch (e) {
            console.error('Failed to parse preferences from localStorage', e);
        }
    }, []);

    const handlePrefsChange = (newPrefs: EventCardPreferences) => {
        setCardPrefs(newPrefs);
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPrefs));
    };
    
    const { upcomingEvents, pastEvents, myEvents } = useMemo(() => {
        const now = new Date();
        const sortedEvents = [...events].sort((a, b) => new Date(a.isoDate || 0).getTime() - new Date(b.isoDate || 0).getTime());
        return {
            upcomingEvents: sortedEvents.filter(e => new Date(e.isoDate || 0) >= now),
            pastEvents: sortedEvents.filter(e => new Date(e.isoDate || 0) < now).reverse(),
            myEvents: sortedEvents.filter(e => e.createdBy === t('common.you')),
        };
    }, [events, t]);

    const dashboardData = useMemo(() => {
        const allAttendees = myEvents.flatMap(e => e.attendees);
        const uniqueAttendees = new Set(allAttendees.map(a => a.id));
        
        // Simple logic for popular types based on title keywords
        const typeCounts: { [key: string]: number } = {};
        myEvents.forEach(event => {
            const title = event.title.toLowerCase();
            let type = 'Général';
            if (title.includes('pique-nique') || title.includes('soirée')) type = 'Soirée';
            if (title.includes('atelier') || title.includes('dégustation')) type = 'Atelier';
            if (title.includes('randonnée') || title.includes('sport')) type = 'Sport';
            if (title.includes('cinéma') || title.includes('film')) type = 'Culture';
            
            typeCounts[type] = (typeCounts[type] || 0) + event.attendees.length;
        });

        const popularEventTypes = Object.entries(typeCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalEvents: myEvents.length,
            totalAttendees: uniqueAttendees.size,
            popularEventTypes,
        };
    }, [myEvents]);

    const handleSaveEvent = (eventData: AppEvent) => {
        const index = events.findIndex(e => e.id === eventData.id);
        if (index > -1) {
            setEvents(prev => {
                const newEvents = [...prev];
                newEvents[index] = eventData;
                return newEvents;
            });
        } else {
            setEvents(prev => [...prev, eventData]);
        }
        setShowCreateModal(false);
        setEventToEdit(null);
    };
    
    const handleJoinRequest = (eventId: number) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        const fee = event.joiningFee || 0;
        if (petalBalance >= fee) {
            setEventToJoin(event);
        } else {
            setShowBuyPetalsModal(true);
        }
    };
    
    const handleConfirmJoin = () => {
        if (!eventToJoin) return;
        const fee = eventToJoin.joiningFee || 0;
        
        setPetalBalance(prev => prev - fee);
        setJoinedEventIds(prev => [...prev, eventToJoin.id]);

        setEvents(prev => prev.map(e => e.id === eventToJoin.id ? { ...e, attendees: [...e.attendees, { id: CURRENT_USER_ID, name: t('common.you'), avatar: 'https://picsum.photos/seed/currentuser/100/100' }] } : e));

        setEventToJoin(null);
    };
    
    const handleLeave = (eventId: number) => {
        setJoinedEventIds(prev => prev.filter(id => id !== eventId));
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: e.attendees.filter(a => a.id !== CURRENT_USER_ID) } : e));
    };

    const handleEditRequest = (event: AppEvent) => {
        setEventToEdit(event);
        setSelectedEvent(null); 
        setShowCreateModal(true);
    };

    const handleConfirmDelete = () => {
        if (!eventToDelete) return;
        setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setEventToDelete(null);
        setSelectedEvent(null);
    };
    
    const handleInvite = (friendIds: number[]) => {
        if (!eventToInvite) return;
        const friendsToInvite = mockFriends.filter(f => friendIds.includes(f.id));
        setEvents(prev => prev.map(e => e.id === eventToInvite.id ? { ...e, attendees: [...e.attendees, ...friendsToInvite] } : e));
        setEventToInvite(null);
    };

    const handleUpdateAttendees = (eventId: number, newAttendees: EventAttendee[]) => {
        const updatedEvents = events.map(event =>
            event.id === eventId ? { ...event, attendees: newAttendees } : event
        );
        setEvents(updatedEvents);
        if (selectedEvent && selectedEvent.id === eventId) {
            setSelectedEvent(prev => prev ? { ...prev, attendees: newAttendees } : null);
        }
    };


    const renderEventCard = (event: AppEvent) => {
        const isCreator = event.createdBy === t('common.you');
        const isCompact = cardPrefs.layout === 'compact';

        if (isCompact) {
             return (
                <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedEvent(event)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-shadow hover:shadow-lg ${cardPrefs.backgroundColor}`}
                >
                    <img src={event.image} alt={event.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-grow overflow-hidden">
                        <p className="font-bold text-gray-800 truncate">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <UserIcon className="w-4 h-4 mr-1.5" />
                            {t('events.card.attendees', { count: event.attendees.length })}
                        </div>
                    </div>
                </motion.div>
            );
        }
        
        return (
            <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => setSelectedEvent(event)}
                className={`rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-2xl ${cardPrefs.backgroundColor} shadow-lg`}
            >
                <div className="relative h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {isCreator && (
                        <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {t('common.you')}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 truncate">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex -space-x-2">
                            {event.attendees.slice(0, 3).map(p => (
                                <img key={p.id} src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border-2 border-white object-cover"/>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-600">{t('events.card.attendees', { count: event.attendees.length })}</span>
                    </div>
                </div>
            </motion.div>
        );
    };
    
    const eventsToDisplay = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'past' ? pastEvents : myEvents;
    const isDashboard = activeTab === 'mine';
    const gridLayoutClass = cardPrefs.layout === 'compact' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6';

    const EmptyState = () => {
        const messages = {
            upcoming: { title: t('events.empty.upcoming.title'), message: t('events.empty.upcoming.message') },
            past: { title: t('events.empty.past.title'), message: t('events.empty.past.message') },
            mine: { title: t('events.empty.mine.title'), message: t('events.empty.mine.message') },
        };
        const { title, message } = messages[activeTab];
        return (
             <div className="text-center py-16 px-4 text-gray-500">
                <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
                <p className="mt-2">{message}</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 pb-20">
            <header className="flex justify-between items-center mb-6">
                <h1 className="font-display text-4xl font-bold text-gray-800">{t('events.title')}</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowCustomizeModal(true)} className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><SlidersIcon className="w-5 h-5"/></button>
                    <button onClick={() => { setEventToEdit(null); setShowCreateModal(true); }} className="flex items-center gap-2 bg-rose-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-rose-600 transition-transform hover:scale-105 active:scale-95">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">{t('events.create')}</span>
                    </button>
                </div>
            </header>
            
            <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-full">
                <TabButton label={t('events.tabs.upcoming')} isActive={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
                <TabButton label={t('events.tabs.past')} isActive={activeTab === 'past'} onClick={() => setActiveTab('past')} />
                <TabButton label={t('events.tabs.mine')} isActive={activeTab === 'mine'} onClick={() => setActiveTab('mine')} />
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {isDashboard && <EventsDashboard data={dashboardData} />}
                    {eventsToDisplay.length > 0 ? (
                        <div className={gridLayoutClass}>
                            {eventsToDisplay.map(renderEventCard)}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailView
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                        isJoined={joinedEventIds.includes(selectedEvent.id) || selectedEvent.attendees.some(a => a.id === CURRENT_USER_ID)}
                        isCreator={selectedEvent.createdBy === t('common.you')}
                        onJoinRequest={handleJoinRequest}
                        onLeave={handleLeave}
                        onDeleteRequest={(event) => setEventToDelete(event)}
                        onEditRequest={handleEditRequest}
                        onInviteClick={() => setEventToInvite(selectedEvent)}
                        onUpdateAttendees={handleUpdateAttendees}
                        currentUserPetalBalance={petalBalance}
                        onShowBuyPetals={() => setShowBuyPetalsModal(true)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCreateModal && <CreateEventModal eventToEdit={eventToEdit} onClose={() => { setShowCreateModal(false); setEventToEdit(null); }} onSave={handleSaveEvent} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {eventToDelete && (
                    <ConfirmationModal
                        title={t('events.deleteModal.title')}
                        message={t('events.deleteModal.message', { title: eventToDelete.title })}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setEventToDelete(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {eventToJoin && (
                    <ConfirmationModal
                        title={t('events.joinModal.title', { title: eventToJoin.title })}
                        message={t('events.joinModal.confirmMessage', { cost: eventToJoin.joiningFee || 0 })}
                        onConfirm={handleConfirmJoin}
                        onCancel={() => setEventToJoin(null)}
                        confirmText={t('events.joinModal.confirmButton', { cost: eventToJoin.joiningFee || 0 })}
                        confirmButtonClass="bg-rose-500 hover:bg-rose-600"
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {eventToInvite && (
                    <InviteFriendsModal 
                        onClose={() => setEventToInvite(null)}
                        onInvite={handleInvite}
                        friends={mockFriends}
                        attendeeIds={eventToInvite.attendees.map(a => a.id)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCustomizeModal && <CustomizeModal onClose={() => setShowCustomizeModal(false)} currentPrefs={cardPrefs} onPrefsChange={handlePrefsChange} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showBuyPetalsModal && (
                    <BuyPetalsModal
                        onClose={() => setShowBuyPetalsModal(false)}
                        onBuy={(amount) => {
                            setPetalBalance(prev => prev + amount);
                            setShowBuyPetalsModal(false);
                        }}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default EventsView;