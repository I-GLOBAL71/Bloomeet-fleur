
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldIcon, UsersIcon, BarChartIcon, FlagIcon, LogOutIcon, 
    CheckIcon, XIcon, SearchIcon, CalendarIcon, TrashIcon, 
    SlidersIcon, BellIcon, FlowerIcon, PetalIcon, BanknoteIcon,
    PlusIcon, EditIcon
} from './Icons';
import { UserProfile, AppEvent } from '../types';

// --- Mock Data ---

const mockStatsData = [40, 30, 55, 50, 70, 90, 85]; // Normalized 0-100
const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const mockAgeDistribution = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 5 },
];

const mockUsers: (UserProfile & { status: 'active' | 'suspended' | 'banned'; reportCount: number; email: string })[] = [
    { id: 1, name: 'Chloé', age: 26, bio: 'Loves hiking...', interests: ['Art'], photos: ['https://picsum.photos/seed/woman1/100/100'], distance: 5, email: 'chloe@example.com', status: 'active', reportCount: 0 },
    { id: 2, name: 'Lucas', age: 29, bio: 'Musician...', interests: ['Music'], photos: ['https://picsum.photos/seed/man1/100/100'], distance: 2, email: 'lucas@example.com', status: 'active', reportCount: 1 },
    { id: 3, name: 'Jean', age: 35, bio: 'Fake profile...', interests: ['Money'], photos: ['https://picsum.photos/seed/man3/100/100'], distance: 100, email: 'jean@scam.com', status: 'suspended', reportCount: 12 },
    { id: 4, name: 'Sarah', age: 22, bio: 'Student', interests: ['Party'], photos: ['https://picsum.photos/seed/woman2/100/100'], distance: 12, email: 'sarah@example.com', status: 'active', reportCount: 0 },
    { id: 5, name: 'Bot_X99', age: 99, bio: 'Click here', interests: ['Crypto'], photos: ['https://picsum.photos/seed/bot/100/100'], distance: 9000, email: 'bot@spam.com', status: 'banned', reportCount: 50 },
];

const mockReports = [
    { id: 1, reporter: 'Chloé', reported: 'Jean', reason: 'Fake profile', date: '2024-07-20' },
    { id: 2, reporter: 'Lucas', reported: 'Bot_X99', reason: 'Spam messages', date: '2024-07-21' },
    { id: 3, reporter: 'Sarah', reported: 'Jean', reason: 'Inappropriate behavior', date: '2024-07-21' },
];

const mockAdminEvents: AppEvent[] = [
    {
        id: 1,
        title: 'Soirée Pique-nique',
        description: 'Rejoignez-nous pour une soirée décontractée.',
        date: '24 Juillet 2024, 19:00',
        location: 'Champs de Mars, Paris',
        image: 'https://images.pexels.com/photos/1684151/pexels-photo-1684151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        attendees: [],
        createdBy: 'Amélie',
        joiningFee: 0,
    },
    {
        id: 2,
        title: 'Dégustation de Vins',
        description: 'Découvrez une sélection de vins fins.',
        date: '28 Juillet 2024, 18:30',
        location: 'Le Baron Rouge, Lyon',
        image: 'https://images.pexels.com/photos/298604/pexels-photo-298604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        attendees: [],
        createdBy: 'Julien',
        joiningFee: 25,
    },
    {
        id: 3,
        title: 'Randonnée Urbaine',
        description: 'Explorez les rues cachées de Montmartre.',
        date: '3 Août 2024, 14:00',
        location: 'Montmartre, Paris',
        image: 'https://images.pexels.com/photos/373919/pexels-photo-373919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        attendees: [],
        createdBy: 'Vous',
        joiningFee: 5,
    }
];

interface AdminViewProps {
    onExit: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'reports' | 'events' | 'finance' | 'settings';

const FloralPattern: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" opacity="0.05">
        <path fill="#F43F5E" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,88.2,-3.3C86.3,11.4,79.9,25.3,71.3,37.7C62.7,50.1,52,61,39.9,67.8C27.8,74.6,14.3,77.3,0.9,75.7C-12.5,74.1,-24.5,68.2,-35.7,60.7C-46.9,53.2,-57.3,44.1,-65.7,32.7C-74.1,21.3,-80.5,7.6,-79.6,-5.7C-78.7,-19,-70.5,-31.9,-60.3,-41.8C-50.1,-51.7,-37.9,-58.6,-25.5,-66.9C-13.1,-75.2,0,-84.9,13.9,-86.8C27.8,-88.7,42.5,-82.8,44.7,-76.4Z" transform="translate(100 100)" />
    </svg>
);

// --- Custom Charts (Replaces Recharts to avoid crashes) ---

const SimpleAreaChart = () => {
    // Create a path string from data
    const width = 300;
    const height = 100;
    const data = mockStatsData;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, i) => {
        const x = i * stepX;
        const y = height - val; // Invert Y because SVG 0 is top
        return `${x},${y}`;
    }).join(' L ');

    const pathD = `M 0,${height} L ${points} L ${width},${height} Z`;
    const strokePath = `M ${points}`;

    return (
        <div className="w-full h-full flex flex-col justify-end">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={pathD} fill="url(#gradient)" />
                <path d={strokePath} fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                {labels.map(l => <span key={l}>{l}</span>)}
            </div>
        </div>
    );
};

const SimpleBarChart = () => {
    const maxVal = Math.max(...mockAgeDistribution.map(d => d.value));
    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center">
            {mockAgeDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 w-10 text-right">{item.name}</span>
                    <div className="flex-grow h-6 bg-gray-50 rounded-r-lg relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / maxVal) * 100}%` }}
                            className={`h-full rounded-r-lg ${idx === 1 ? 'bg-rose-500' : 'bg-rose-300'}`}
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white font-bold drop-shadow-md">{item.value}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AdminEventModal: React.FC<{
    event?: AppEvent;
    onClose: () => void;
    onSave: (event: AppEvent) => void;
}> = ({ event, onClose, onSave }) => {
    const [formData, setFormData] = React.useState<Partial<AppEvent>>(
        event || {
            title: '',
            description: '',
            date: '',
            location: '',
            image: 'https://picsum.photos/seed/event/800/600',
            joiningFee: 0,
            createdBy: 'Admin',
            attendees: []
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.title || !formData.date) return;
        
        onSave({
            id: event?.id || Date.now(),
            ...formData
        } as AppEvent);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 z-[60] flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-gray-800">
                        {event ? 'Modifier l\'événement' : 'Créer un événement'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                            <input
                                type="text"
                                placeholder="Ex: 24 Juillet 2024, 19:00"
                                required
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Lieu</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Prix (Pétales)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.joiningFee}
                                onChange={e => setFormData({...formData, joiningFee: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-rose-400 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                            Annuler
                        </button>
                        <button type="submit" className="flex-1 py-3 font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition shadow-md shadow-rose-200">
                            {event ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const AdminView: React.FC<AdminViewProps> = ({ onExit }) => {
    const [activeTab, setActiveTab] = React.useState<AdminTab>('dashboard');
    const [users, setUsers] = React.useState(mockUsers);
    const [events, setEvents] = React.useState(mockAdminEvents);
    const [reports, setReports] = React.useState(mockReports);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showEventModal, setShowEventModal] = React.useState(false);
    const [editingEvent, setEditingEvent] = React.useState<AppEvent | undefined>(undefined);
    
    // Settings State
    const [settings, setSettings] = React.useState({
        maintenanceMode: false,
        strictFiltering: true,
        petalPriceMultiplier: 1.0,
        welcomeMessage: 'Bienvenue sur Aura !',
        maxSwipesPerDay: 100,
        globalTheme: 'spring'
    });

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserAction = (userId: number, action: 'ban' | 'activate' | 'suspend') => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, status: action === 'ban' ? 'banned' : action === 'suspend' ? 'suspended' : 'active' };
            }
            return u;
        }));
    };

    const handleDeleteEvent = (eventId: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            setEvents(prev => prev.filter(e => e.id !== eventId));
        }
    };

    const handleCreateEvent = () => {
        setEditingEvent(undefined);
        setShowEventModal(true);
    };

    const handleEditEvent = (event: AppEvent) => {
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleSaveEvent = (event: AppEvent) => {
        if (editingEvent) {
            setEvents(prev => prev.map(e => e.id === event.id ? event : e));
        } else {
            setEvents(prev => [event, ...prev]);
        }
        setShowEventModal(false);
    };

    const handleReportAction = (reportId: number, action: 'dismiss' | 'ban') => {
        const report = reports.find(r => r.id === reportId);
        if (action === 'ban' && report) {
             setUsers(prev => prev.map(u => u.name === report.reported ? { ...u, status: 'banned' } : u));
        }
        setReports(prev => prev.filter(r => r.id !== reportId));
    };

    const SidebarItem: React.FC<{ tab: AdminTab; icon: React.ReactNode; label: string; count?: number }> = ({ tab, icon, label, count }) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`w-full flex items-center justify-between p-3 px-4 rounded-xl transition-all group ${activeTab === tab ? 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-lg shadow-rose-200' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`${activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-rose-500'}`}>
                  {icon}
                </div>
                <span className="font-medium font-display tracking-wide">{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {count}
                </span>
            )}
        </button>
    );

    const renderDashboard = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Utilisateurs Totaux', value: '12,450', change: '+12%', isPositive: true, icon: <UsersIcon className="w-6 h-6 text-white" />, color: 'bg-rose-400' },
                    { label: 'Matchs Actifs', value: '845', change: 'En direct', isPositive: true, icon: <FlowerIcon className="w-6 h-6 text-white" />, color: 'bg-pink-400' },
                    { label: 'Revenus (Mois)', value: '4,200€', change: '+5%', isPositive: true, icon: <BanknoteIcon className="w-6 h-6 text-white" />, color: 'bg-emerald-400' },
                    { label: 'Signalements', value: reports.length, change: reports.length > 0 ? 'Action requise' : 'Calme', isPositive: reports.length === 0, icon: <FlagIcon className="w-6 h-6 text-white" />, color: reports.length > 0 ? 'bg-orange-400' : 'bg-blue-400' }
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                                <p className="text-3xl font-display font-bold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-2xl shadow-sm ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg w-fit mt-4 inline-block ${stat.isPositive ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 relative overflow-hidden">
                     <FloralPattern className="absolute top-0 right-0 w-64 h-64 text-rose-50 pointer-events-none" />
                    <h3 className="text-xl font-display font-bold text-gray-800 mb-6">Croissance de la Communauté</h3>
                    <div className="h-64 w-full">
                         <SimpleAreaChart />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 relative overflow-hidden">
                     <h3 className="text-xl font-display font-bold text-gray-800 mb-6">Démographie</h3>
                     <div className="h-64 w-full">
                        <SimpleBarChart />
                     </div>
                </div>
            </div>
        </motion.div>
    );

    const renderUsers = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-rose-500" /> Membres du Jardin
                </h3>
                <div className="relative w-72">
                    <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une fleur..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:ring-0 focus:border-rose-400 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>
            <div className="overflow-y-auto flex-grow p-2">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rapports</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="group hover:bg-rose-50/30 transition-colors rounded-xl">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={user.photos[0]} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow" />
                                        <div>
                                            <p className="font-display font-bold text-gray-800 text-base">{user.name}, {user.age}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        user.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                                        user.status === 'suspended' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                        {user.status === 'active' ? 'Épanoui' : user.status === 'suspended' ? 'Fanée' : 'Arrachée'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${user.reportCount > 0 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                                        <span className={`text-sm font-semibold ${user.reportCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{user.reportCount}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {user.status !== 'active' && (
                                            <button onClick={() => handleUserAction(user.id, 'activate')} className="p-2 hover:bg-green-100 text-green-600 rounded-xl transition-colors" title="Activer">
                                                <CheckIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        {user.status !== 'suspended' && user.status !== 'banned' && (
                                            <button onClick={() => handleUserAction(user.id, 'suspend')} className="p-2 hover:bg-orange-100 text-orange-500 rounded-xl transition-colors" title="Suspendre">
                                                <FlagIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        {user.status !== 'banned' && (
                                            <button onClick={() => handleUserAction(user.id, 'ban')} className="p-2 hover:bg-red-100 text-red-500 rounded-xl transition-colors" title="Bannir">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    const renderReports = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FlagIcon className="w-6 h-6 text-rose-500" /> Mauvaises Herbes ({reports.length})
            </h3>
            {reports.map(report => (
                <div key={report.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-red-50 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <FlagIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-gray-800 text-lg">Signalement contre <span className="text-rose-600 underline decoration-rose-200 underline-offset-2">{report.reported}</span></h4>
                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 inline-block px-3 py-1 rounded-lg font-medium">{report.reason}</p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <UsersIcon className="w-3 h-3" /> Signalé par {report.reporter} le {report.date}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleReportAction(report.id, 'ban')} className="px-6 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2">
                            <XIcon className="w-4 h-4" /> Bannir
                        </button>
                        <button onClick={() => handleReportAction(report.id, 'dismiss')} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <CheckIcon className="w-4 h-4" /> Ignorer
                        </button>
                    </div>
                </div>
            ))}
            {reports.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <FlowerIcon className="w-10 h-10 text-green-500" />
                    </div>
                    <p className="text-gray-800 font-display font-bold text-xl">Le jardin est paisible.</p>
                    <p className="text-gray-400 mt-2">Aucun signalement à traiter pour le moment.</p>
                </div>
            )}
        </motion.div>
    );

    const renderEvents = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-rose-500" /> Événements de la Communauté
                </h3>
                <button onClick={handleCreateEvent} className="bg-rose-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Nouveau
                </button>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all group">
                        <div className="h-40 overflow-hidden relative">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-rose-600 shadow-sm">
                                {event.date.split(',')[0]}
                            </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                            <h4 className="font-display font-bold text-gray-800 text-xl line-clamp-1">{event.title}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {event.createdBy.charAt(0)}
                                </div>
                                Par {event.createdBy}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                            
                            <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                    <SearchIcon className="w-3 h-3" /> {event.location}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEditEvent(event)}
                                        className="text-blue-400 hover:text-white hover:bg-blue-500 p-2 rounded-xl transition-all shadow-sm"
                                        title="Modifier l'événement"
                                    >
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all shadow-sm"
                                        title="Supprimer l'événement"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderFinance = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <h3 className="text-xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BanknoteIcon className="w-6 h-6 text-rose-500" /> Économie des Pétales
            </h3>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">Ajustement des Prix</h4>
                        <p className="text-gray-500 text-sm mt-1">Modifiez le taux de change global des pétales.</p>
                    </div>
                    <div className="text-3xl font-display font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-2xl">
                        x{settings.petalPriceMultiplier}
                    </div>
                </div>
                
                <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={settings.petalPriceMultiplier}
                    onChange={(e) => setSettings(s => ({...s, petalPriceMultiplier: parseFloat(e.target.value)}))}
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-xs font-bold text-gray-400 mt-3 uppercase tracking-wide">
                    <span>Soldes d'été (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Inflation (2.0x)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[100, 550, 1200].map((amount, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 text-center relative group hover:border-rose-200 transition-colors">
                        <div className="w-16 h-16 bg-rose-50 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <PetalIcon className="w-8 h-8 text-rose-400" />
                        </div>
                        <h5 className="font-bold text-gray-800 text-lg">{amount} Pétales</h5>
                        <p className="text-rose-500 font-bold text-2xl mt-2">
                            {(amount * 0.02 * settings.petalPriceMultiplier).toFixed(2)}€
                        </p>
                        <p className="text-xs text-gray-400 line-through mt-1">
                             {(amount * 0.02).toFixed(2)}€
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
             <h3 className="text-xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
                <SlidersIcon className="w-6 h-6 text-rose-500" /> Configuration du Jardin
            </h3>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {/* Maintenance Mode */}
                <div className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="pr-4">
                        <h4 className="font-bold text-gray-800 text-lg">Mode Hiver (Maintenance)</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">Gèle temporairement l'application pour tous les utilisateurs non-admin. Utile pour les mises à jour majeures.</p>
                    </div>
                    <button 
                        onClick={() => setSettings(s => ({...s, maintenanceMode: !s.maintenanceMode}))}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Strict Filtering */}
                <div className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="pr-4">
                        <h4 className="font-bold text-gray-800 text-lg">Désherbage IA (Strict)</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">Analyse automatique des photos et biographies avec une sévérité accrue pour filtrer le contenu inapproprié.</p>
                    </div>
                    <button 
                        onClick={() => setSettings(s => ({...s, strictFiltering: !s.strictFiltering}))}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${settings.strictFiltering ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.strictFiltering ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                 {/* Welcome Message */}
                 <div className="p-8">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Message de Bienvenue</h4>
                    <div className="relative group">
                        <BellIcon className="w-5 h-5 absolute left-4 top-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
                        <textarea 
                            value={settings.welcomeMessage}
                            onChange={(e) => setSettings(s => ({...s, welcomeMessage: e.target.value}))}
                            className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-rose-400 outline-none text-base bg-gray-50 focus:bg-white transition-colors resize-none"
                            rows={3}
                        />
                    </div>
                     <button className="mt-4 text-sm font-bold text-rose-500 hover:bg-rose-50 px-5 py-2.5 rounded-xl transition-colors border border-transparent hover:border-rose-200">
                        Mettre à jour l'annonce
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="fixed inset-0 bg-[#FAFAFA] z-50 flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-full md:w-72 bg-white border-r border-gray-100 p-6 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
                 <FloralPattern className="absolute bottom-0 left-0 w-full h-64 text-rose-50 pointer-events-none opacity-50" />
                
                <div className="flex items-center gap-4 mb-10 px-2">
                    <div className="bg-rose-500 p-2.5 rounded-2xl shadow-lg shadow-rose-200">
                         <ShieldIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900 tracking-tight">Aura<span className="text-rose-500">.</span>Admin</h1>
                        <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Jardinier en Chef</p>
                    </div>
                </div>
                
                <nav className="space-y-2 flex-grow overflow-y-auto">
                    <SidebarItem tab="dashboard" icon={<BarChartIcon className="w-5 h-5" />} label="Vue d'ensemble" />
                    <SidebarItem tab="users" icon={<UsersIcon className="w-5 h-5" />} label="Membres" />
                    <SidebarItem tab="events" icon={<CalendarIcon className="w-5 h-5" />} label="Événements" count={events.length} />
                    <SidebarItem tab="reports" icon={<FlagIcon className="w-5 h-5" />} label="Signalements" count={reports.length} />
                    <SidebarItem tab="finance" icon={<BanknoteIcon className="w-5 h-5" />} label="Finance" />
                    <div className="my-6 border-t border-gray-100 mx-4"></div>
                    <SidebarItem tab="settings" icon={<SlidersIcon className="w-5 h-5" />} label="Paramètres" />
                </nav>

                <button 
                    onClick={onExit}
                    className="mt-6 flex items-center gap-3 p-4 text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-colors font-bold border border-transparent hover:border-rose-100 group"
                >
                    <div className="bg-gray-100 group-hover:bg-rose-200 p-1.5 rounded-lg transition-colors">
                        <LogOutIcon className="w-4 h-4" />
                    </div>
                    <span>Retour au Jardin</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto bg-[#FAFAFA]">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-gray-900 capitalize tracking-tight">
                                {activeTab === 'dashboard' ? 'Tableau de Bord' : activeTab}
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">Bienvenue, administrateur. Le jardin est florissant aujourd'hui.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-full shadow-sm border border-gray-100">
                             <div className="relative">
                                <img src="https://picsum.photos/seed/admin/100/100" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" alt="Admin" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                             </div>
                             <div className="text-sm">
                                 <p className="font-bold text-gray-800 leading-none">Admin</p>
                                 <p className="text-xs text-green-600 font-semibold mt-0.5">En ligne</p>
                             </div>
                        </div>
                    </header>

                    <main className="animate-fade-in-up pb-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {activeTab === 'dashboard' && renderDashboard()}
                                {activeTab === 'users' && renderUsers()}
                                {activeTab === 'reports' && renderReports()}
                                {activeTab === 'events' && renderEvents()}
                                {activeTab === 'finance' && renderFinance()}
                                {activeTab === 'settings' && renderSettings()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            <AnimatePresence>
                {showEventModal && (
                    <AdminEventModal
                        event={editingEvent}
                        onClose={() => setShowEventModal(false)}
                        onSave={handleSaveEvent}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminView;
