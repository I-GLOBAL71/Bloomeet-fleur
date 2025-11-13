import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match, Message } from '../types';
import { ChevronLeftIcon, SendIcon, EmojiIcon, FlowerIcon, XIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

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
    const [activeCategory, setActiveCategory] = useState(emojiCategories[0].name);

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
    const [amount, setAmount] = useState(1);
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
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSendFlowerModal, setShowSendFlowerModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [match.messages]);
    
    useEffect(() => {
        if(textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const messageToSend: Message = {
            id: Date.now(),
            text: newMessage.trim(),
            senderId: CURRENT_USER_ID,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
        };

        const updatedMessages = [...match.messages, messageToSend];
        onUpdateMessages(match.id, updatedMessages);
        setNewMessage('');
        
        // Simulate a reply
        setTimeout(() => {
            const replyMessage: Message = {
                id: Date.now() + 1,
                text: "C'est super intéressant ! Raconte-m'en plus.",
                senderId: match.id,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
            };
            onUpdateMessages(match.id, [...updatedMessages, replyMessage]);
        }, 1500);
    };

    const handleSendFlowers = (amount: number) => {
        if (currentUserFlowerBalance >= amount) {
            onUpdateFlowerBalance(currentUserFlowerBalance - amount);
            
            const giftMessage: Message = {
                id: Date.now(),
                text: t('chat.giftSent', { amount, plural: amount > 1 ? 's' : '' }),
                senderId: CURRENT_USER_ID,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                type: 'gift',
                giftAmount: amount,
            };

            const updatedMessages = [...match.messages, giftMessage];
            onUpdateMessages(match.id, updatedMessages);
            setShowSendFlowerModal(false);

            // Simulate a reply to the gift
            setTimeout(() => {
                const replyMessage: Message = {
                    id: Date.now() + 1,
                    text: `Wow, merci beaucoup pour les fleurs ! 💐 C'est adorable !`,
                    senderId: match.id,
                    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    type: 'text',
                };
                onUpdateMessages(match.id, [...updatedMessages, replyMessage]);
            }, 1500);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        textareaRef.current?.focus();
    };

    const handleEmojiToggle = () => {
        if (!showEmojiPicker) {
            textareaRef.current?.blur(); // Prevent keyboard from opening
        }
        setShowEmojiPicker(prev => !prev);
    };

    return (
        <motion.div
            className="absolute inset-0 bg-white z-10 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
        >
            <header className="flex items-center p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <img src={match.avatar} alt={match.name} className="w-10 h-10 rounded-full object-cover ml-2" />
                <h2 className="ml-3 font-bold text-lg">{match.name}</h2>
            </header>

            <main className="flex-grow overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                    {match.messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === CURRENT_USER_ID} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <div className="border-t border-gray-200 bg-white">
                <div className="p-3">
                    <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2">
                        <button
                            onClick={handleEmojiToggle}
                            className={`p-2 self-end rounded-full transition-colors ${showEmojiPicker ? 'bg-rose-200 text-rose-600' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <EmojiIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setShowSendFlowerModal(true)}
                            className="p-2 self-end rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                           <FlowerIcon className="w-6 h-6" />
                        </button>
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={() => setShowEmojiPicker(false)}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder={t('chat.placeholder')}
                            className="flex-grow bg-transparent focus:outline-none resize-none max-h-32 text-lg px-2"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            className="p-3 bg-rose-500 text-white rounded-full self-end disabled:bg-rose-300 transition-colors"
                            disabled={!newMessage.trim()}
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        className="h-72 w-full"
                        initial={{ height: 0 }}
                        animate={{ height: "18rem" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <EmojiPicker onSelect={handleEmojiSelect} />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showSendFlowerModal && (
                    <SendFlowerModal
                        recipientName={match.name}
                        currentUserBalance={currentUserFlowerBalance}
                        onClose={() => setShowSendFlowerModal(false)}
                        onSend={handleSendFlowers}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ChatView;
