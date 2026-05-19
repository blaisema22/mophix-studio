import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const BOT_INTRO = {
    role: 'assistant',
    content: "Hi! I'm Mofix AI — your smart assistant. Ask me anything about our services, bookings, portfolio, or how to get started. I'm here to help!"
};

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

    async function sendMessage(e) {
        e.preventDefault();
        const text = input.trim();
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
                        <AIIcon />
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 'calc(70vh - 130px)' }}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mr-2 mt-0.5">
                                    <AIIcon small />
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
                                <AIIcon small />
                            </div>
                            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm">
                                <TypingDots />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

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
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-400 shadow-[0_4px_24px_rgba(249,115,22,0.5)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Open AI chat"
            >
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
                {/* Pulse ring */}
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                )}
            </button>
        </>
    );
}

function AIIcon({ small = false }) {
    const size = small ? 14 : 22;
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={small ? 'text-orange-400' : 'text-black'}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/>
            <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>
        </svg>
    );
}
