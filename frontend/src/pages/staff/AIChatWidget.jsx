import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineChatAlt2, HiX, HiPaperAirplane } from 'react-icons/hi';
import api from '../../services/api';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Mophix AI. How can I help you with your photography needs today?' }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { 
        messages: updatedHistory 
      });
      
      if (response.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110"
        >
          <HiOutlineChatAlt2 className="h-7 w-7" />
        </button>
      ) : (
        <div className="w-80 md:w-96 h-[500px] bg-[#0d0d0d] border border-orange-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-orange-500 text-white flex justify-between items-center">
            <div className="font-bold">Mophix Studio AI</div>
            <button onClick={() => setIsOpen(false)}><HiX className="h-5 w-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-orange-500 text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-400 p-3 rounded-2xl rounded-tl-none text-xs animate-pulse">
                  Mophix is thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 border-t border-white/10 flex gap-2"
          >
            <input
              disabled={loading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sessions, prices..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-orange-500 rounded-xl text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <HiPaperAirplane className="h-5 w-5 rotate-90" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}