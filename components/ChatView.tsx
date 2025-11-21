
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match, Message } from '../types';
import { ChevronLeftIcon, SendIcon, EmojiIcon, FlowerIcon, XIcon } from './Icons';
import { useTranslation } from '../contexts/LanguageContext';

const CURRENT_USER_ID = 99;

const getEmojiCategories = (t: (key: string) => string) => [
  { name: t('chat.emojiCategories.smileys'), icon: '😀', emojis: ['😀', '😂', '😍', '🤔', '😊', '😢', '😡', '🥳', '🤯', '😴', '👍', '👎', '❤️', '💔'] },
  { name: t('chat.emojiCategories.animals'), icon: '🐶', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷'] },
  { name: t('chat.emojiCategories.food'), icon: '🍕', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍕', '🍔', '🍟', '🍣', '🍰'] },
  { name: t('chat.emojiCategories.activities'), icon: '⚽', emojis: ['⚽', '🏀', '🏈', '⚾️', '🎾', '🏐', '🎱', '🏓', '🏸', '🎮', '🎨', '🎬', '🎵'] },
];


const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void; }> = ({ onSelect }) => {
    const { t } = useTranslation();
    const emojiCategories = getEmojiCategories(t);
    const [activeCategory, setActiveCategory] = React.useState(emojiCategories[0].name);

    return (
        <div className="h-full w-full flex flex-col bg-gray-100">
            <div className="flex-grow p-2 overflow-y-auto">
                <div className="grid grid-cols-8 gap-2">
                    {emojiCategories.find(c => c.name === activeCategory)?.emojis.map(emoji => (
                        <button 
                            key={emoji}
                            onClick={() => onSelect(emoji)}
                            className="text-3xl p-1 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-around p-2 border-t border-gray-200 bg-gray-50">
                {emojiCategories.map(category => (
                    <button 
                        key={category.name}
                        onClick={() => setActiveCategory(category.name)}
                        className={`p-2 text-2xl rounded-md transition-colors ${activeCategory === category.name ? 'bg-rose-200' : 'hover:bg-gray-200'}`}
                        title={category.name}
                    >
                        {category.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};


const MessageBubble: React.FC<{ message: Message; isOwnMessage: boolean }> = ({ message, isOwnMessage }) => {
    if (message.type === 'gift') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="self-center flex items-center gap-2 my-2 py-2 px-4 bg-amber-100 rounded-full text-amber-800"
            >
                <FlowerIcon className="w-5 h-5" />
                <p className="text-sm font-medium">{message.text}</p>
            </motion.div>
        );
    }

    const bubbleClasses = isOwnMessage
        ? 'bg-rose-500 text-white self-end rounded-bl-2xl'
        : 'bg-gray-200 text-gray-800 self-start rounded-br-2xl';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-fit max-w-[80%] p-3 rounded-2xl ${bubbleClasses}`}
        >
        <p>{message.text}</p>
        </motion.div>
    );
};

const SendFlowerModal: React.FC<{
    recipientName: string;
    currentUserBalance: number;
    onClose: () => void;
    onSend: (amount: number) => void;
}> = ({ recipientName, currentUserBalance, onClose, onSend }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = React.useState(1);
    const amounts = [1, 5, 10];

    const handleSend = () => {
        if (amount > 0 && currentUserBalance >= amount) {
            onSend(amount);
        }
    };

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
                <FlowerIcon className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
                <h2 className="font-display text-2xl font-bold mt-4 text-gray-800">{t('discovery.sendFlowersTo', { name: recipientName })}</h2>
                <p className="text-gray-500 mt-2">{t('discovery.yourBalance', { balance: currentUserBalance })}</p>
                
                <div className="flex justify-center gap-3 my-6">
                    {amounts.map(a => (
                        <button
                            key={a}
                            onClick={() => setAmount(a)}
                            className={`px-6 py-3 rounded-full font-bold border-2 transition-all ${amount === a ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        >
                            {a}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={handleSend}
                    disabled={currentUserBalance < amount}
                    className="w-full py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {t('discovery.sendButton', { amount, plural: amount > 1 ? 's' : '' })}
                </button>
                <button onClick={onClose} className="w-full mt-3 py-2 text-gray-600 font-semibold">{t('common.cancel')}</button>
            </motion.div>
        </motion.div>
    );
};

interface ChatViewProps {
    match: Match;
    onClose: () => void;
    onUpdateMessages: (matchId: number, newMessages: Message[]) => void;
    currentUserFlowerBalance: number;
    onUpdateFlowerBalance: (newBalance: number) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ match, onClose, onUpdateMessages, currentUserFlowerBalance, onUpdateFlowerBalance }) => {
    const { t } = useTranslation();
    const [inputText, setInputText] = React.useState('');
    const [messages, setMessages] = React.useState(match.messages);
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const [showFlowerModal, setShowFlowerModal] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputText.trim(),
            senderId: CURRENT_USER_ID,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        onUpdateMessages(match.id, updatedMessages);
        setInputText('');
        setShowEmojiPicker(false);
    };

    const handleSendFlower = (amount: number) => {
        if (currentUserFlowerBalance >= amount) {
            const newBalance = currentUserFlowerBalance - amount;
            onUpdateFlowerBalance(newBalance);

            const newGiftMessage: Message = {
                id: Date.now(),
                text: t('chat.giftSent', { amount, plural: amount > 1 ? 's' : '' }),
                senderId: CURRENT_USER_ID,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'gift',
                giftAmount: amount
            };
            
            const updatedMessages = [...messages, newGiftMessage];
            setMessages(updatedMessages);
            onUpdateMessages(match.id, updatedMessages);
            setShowFlowerModal(false);
        }
    };

    return (
        <motion.div
            className="absolute inset-0 bg-white z-20 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        >
            <header className="flex items-center p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <button onClick={onClose} className="p-2 text-gray-600"><ChevronLeftIcon className="w-6 h-6" /></button>
                <img src={match.avatar} alt={match.name} className="w-10 h-10 rounded-full object-cover ml-2" />
                <div className="ml-3">
                    <h2 className="font-bold text-lg">{match.name}</h2>
                    {match.flowerBalance !== undefined && (
                        <div className="flex items-center text-sm text-gray-500">
                            <FlowerIcon className="w-4 h-4 mr-1"/>
                            {match.flowerBalance}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === CURRENT_USER_ID} />
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white border-t border-gray-200">
                <div className="p-3 flex items-center space-x-2">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-rose-100 text-rose-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <EmojiIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setShowFlowerModal(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <FlowerIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        onFocus={() => setShowEmojiPicker(false)}
                        placeholder={t('chat.placeholder')}
                        className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <button onClick={handleSendMessage} className="p-3 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
                <AnimatePresence>
                    {showEmojiPicker && (
                        <motion.div
                            className="h-64"
                            initial={{ height: 0 }}
                            animate={{ height: '16rem' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <EmojiPicker onSelect={(emoji) => setInputText(prev => prev + emoji)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </footer>
             <AnimatePresence>
                {showFlowerModal && (
                    <SendFlowerModal
                        recipientName={match.name}
                        currentUserBalance={currentUserFlowerBalance}
                        onClose={() => setShowFlowerModal(false)}
                        onSend={handleSendFlower}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ChatView;