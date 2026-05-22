import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineXMark,
} from 'react-icons/hi';

const BOT_INTRO = {
    role: 'assistant',
    content: "Hi! I'm Mofix AI — your smart assistant. Ask me anything about our services, bookings, portfolio, or how to get started. I'm here to help!"
};

const SUGGESTED_QUESTIONS = [
    "What are your wedding rates?",
    "How do I book a session?",
    "Show me your portfolio",
    "Do you have maternity packages?"
];

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    );
}

export default function AIChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([BOT_INTRO]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    async function handleChatSubmit(textValue) {
        const text = textValue?.trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInput('');
        setLoading(true);

        try {
            const result = await api.post('/ai/chat', {
                messages: updated.filter(m => m.role !== 'assistant' || updated.indexOf(m) > 0)
            });
            setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
        } catch (error) {
            console.error('AI chat request failed:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try our Contact page for assistance."
            }]);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage(e) {
        e.preventDefault();
        handleChatSubmit(input);
    }

    return (
        <>
            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-5 z-50 w-80 sm:w-96 flex flex-col rounded-2xl border border-orange-500/40 bg-[#0f0f0f] shadow-[0_8px_40px_rgba(0,0,0,0.7)] transition-all duration-300 ${
                    open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
                style={{ maxHeight: '70vh' }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-t-2xl">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/30">
                        <HiOutlineSparkles className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-black text-sm leading-tight">Mofix AI Assistant</p>
                        <p className="text-[11px] text-black/70">Always here to help</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="ml-auto text-black/60 hover:text-black transition-colors"
                        aria-label="Close chat"
                    >
                        <HiOutlineXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 'calc(70vh - 130px)' }}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mr-2 mt-0.5">
                                    <HiOutlineSparkles className="h-4 w-4 text-orange-400" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-orange-500 text-black rounded-br-sm font-medium'
                                        : 'bg-neutral-800 text-gray-200 rounded-bl-sm'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mr-2 mt-0.5">
                                <HiOutlineSparkles className="h-4 w-4 text-orange-400" />
                            </div>
                            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm">
                                <TypingDots />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {!loading && messages.length < 4 && (
                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleChatSubmit(q)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-[11px] text-orange-300 hover:bg-orange-500/20 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-white/10">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-neutral-800 text-white placeholder:text-gray-500 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        aria-label="Send"
                    >
                        <HiOutlinePaperAirplane className="w-4 h-4 text-black" />
                    </button>
                </form>
            </div>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-400 shadow-[0_4px_24px_rgba(249,115,22,0.5)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label={open ? 'Close AI chat' : 'Open AI chat'}
            >
                {open ? (
                    <HiOutlineXMark className="w-6 h-6 text-black" />
                ) : (
                    <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-black" />
                )}
                {/* Pulse ring */}
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                )}
            </button>
        </>
    );
}
