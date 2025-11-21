
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppEvent } from '../types';
import { PlusIcon, UserIcon, ArrowLeftIcon, CalendarIcon } from './Icons';
import { useTranslation } from '../contexts/LanguageContext';

const mockAttendees = [
  { id: 1, name: 'Chloé', avatar: 'https://picsum.photos/seed/woman1/100/100' },
  { id: 2, name: 'Lucas', avatar: 'https://picsum.photos/seed/man1/100/100' },
  { id: 4, name: 'Théo', avatar: 'https://picsum.photos/seed/man2/100/100' },
  { id: 5, name: 'Inès', avatar: 'https://picsum.photos/seed/woman3/100/100' },
];

const mockEvents: AppEvent[] = [
  {
    id: 1,
    title: 'Soirée Pique-nique au Bord de la Seine',
    description: 'Rejoignez-nous pour une soirée décontractée avec de la bonne nourriture, de la musique douce et une vue imprenable sur la Tour Eiffel. Apportez votre couverture et votre plat préféré à partager !',
    date: '24 Juillet 2024, 19:00',
    isoDate: new Date(2024, 6, 24, 19, 0).toISOString(),
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
    location: 'Parc de la Villette, Paris',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    attendees: mockAttendees.slice(2, 4),
    createdBy: 'Julien',
  }
];

const EventCard: React.FC<{ event: AppEvent; onClick: () => void; }> = ({ event, onClick }) => {
    const { t } = useTranslation();
    const eventDate = new Date(event.isoDate!);
    const day = eventDate.toLocaleDateString('fr-FR', { day: '2-digit' });
    const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-40">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-center shadow-md">
                    <p className="font-bold text-rose-500 text-xl leading-none">{day}</p>
                    <p className="text-gray-700 text-sm font-semibold uppercase leading-none">{month}</p>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 truncate">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                <div className="flex items-center text-sm text-gray-600 mt-3">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{t('events.card.attendees', { count: event.attendees.length })}</span>
                </div>
            </div>
        </motion.div>
    );
};

const EventDetailModal: React.FC<{ event: AppEvent; onClose: () => void; }> = ({ event, onClose }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex justify-end flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-gray-50 rounded-t-2xl w-full h-[90vh] flex flex-col"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                onClick={e => e.stopPropagation()}
            >
                <header className="relative h-64">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-t-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="font-display text-3xl font-bold">{event.title}</h1>
                        <p className="font-semibold">{event.date}</p>
                    </div>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    <p className="text-lg text-gray-700">{event.description}</p>
                </div>
                <footer className="p-4 border-t flex gap-4 bg-white">
                    <button className="flex-1 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition">
                        {event.joiningFee ? t('events.detail.joinEventWithFee', { cost: event.joiningFee }) : t('events.detail.joinEvent')}
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    );
};

const EventsView: React.FC = () => {
    const { t } = useTranslation();
    const [events, setEvents] = React.useState<AppEvent[]>(mockEvents);
    const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past' | 'mine'>('upcoming');
    const [selectedEvent, setSelectedEvent] = React.useState<AppEvent | null>(null);

    const filteredEvents = React.useMemo(() => {
        const now = new Date();
        switch (activeTab) {
            case 'upcoming':
                return events.filter(e => new Date(e.isoDate!) > now).sort((a, b) => new Date(a.isoDate!).getTime() - new Date(b.isoDate!).getTime());
            case 'past':
                return events.filter(e => new Date(e.isoDate!) <= now).sort((a, b) => new Date(b.isoDate!).getTime() - new Date(a.isoDate!).getTime());
            case 'mine':
                return events.filter(e => e.createdBy === 'Vous').sort((a, b) => new Date(b.isoDate!).getTime() - new Date(a.isoDate!).getTime());
            default:
                return [];
        }
    }, [activeTab, events]);
    
    const TabButton: React.FC<{ tabId: 'upcoming' | 'past' | 'mine'; children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`relative px-4 py-2 font-semibold transition-colors ${activeTab === tabId ? 'text-rose-500' : 'text-gray-500 hover:text-gray-800'}`}
        >
            {children}
            {activeTab === tabId && <motion.div layoutId="event-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />}
        </button>
    );

    return (
        <div className="p-4 pb-20">
            <header className="flex justify-between items-center mb-6">
                <h1 className="font-display text-4xl font-bold text-gray-800">{t('events.title')}</h1>
                <button className="flex items-center gap-2 bg-rose-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-rose-600 transition">
                    <PlusIcon className="w-5 h-5" />
                    {t('events.create')}
                </button>
            </header>

            <div className="flex border-b mb-6">
                <TabButton tabId="upcoming">{t('events.tabs.upcoming')}</TabButton>
                <TabButton tabId="past">{t('events.tabs.past')}</TabButton>
                <TabButton tabId="mine">{t('events.tabs.mine')}</TabButton>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {filteredEvents.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {filteredEvents.map(event => (
                                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-16 px-4 text-gray-500">
                            <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">{t(`events.empty.${activeTab}.title`)}</h3>
                            <p className="mt-2">{t(`events.empty.${activeTab}.message`)}</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsView;