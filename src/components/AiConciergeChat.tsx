import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { ChatMessage, TripPlan } from '../types/travel.ts';

interface AiConciergeChatProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripPlan;
  onTriggerQuickAction?: (action: string) => void;
}

export const AiConciergeChat: React.FC<AiConciergeChatProps> = ({
  isOpen,
  onClose,
  trip,
  onTriggerQuickAction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm TripGenie, your 24/7 AI travel assistant for ${trip.destination}. I have your ${trip.durationDays}-day itinerary, digital passes, and flight/hotel bookings synced. How can I help you today?`,
      timestamp: 'Just now',
      quickActions: [
        { label: '🍜 Local Dining & Food Tips', action: 'food_tips' },
        { label: '🌧️ Reroute for Rain', action: 'adjust_rain' },
        { label: '🗣️ Translate Local Phrases', action: 'phrases' },
        { label: '🎫 Open E-Tickets & Passes', action: 'open_passes' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          tripContext: trip,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm right here with you! Let me know what you'd like to adjust.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: data.quickActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm monitoring your itinerary for ${trip.destination}! All your reservations and digital passes are safe. What else can I check for you?`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'open_passes' && onTriggerQuickAction) {
      onTriggerQuickAction('passes');
      onClose();
      return;
    }
    if (action === 'adjust_rain' && onTriggerQuickAction) {
      onTriggerQuickAction('adjust_rain');
      return;
    }
    if (action === 'food_tips') {
      handleSendMessage(`What are the top hidden culinary gems open near Day 1 in ${trip.destination}?`);
      return;
    }
    if (action === 'phrases') {
      handleSendMessage(`Give me useful local phrases for ordering food and asking for directions in ${trip.destination}.`);
      return;
    }
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-96 sm:h-[620px] z-50 flex flex-col bg-white border border-slate-200 sm:rounded-3xl shadow-2xl overflow-hidden font-sans">
      {/* Header (Trip.com TripGenie Royal Blue Theme) */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-blue-600 shadow-md">
            <Bot className="w-6 h-6" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="text-sm font-black flex items-center gap-1.5">
              <span>TripGenie AI</span>
              <span className="text-[9px] bg-white/20 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">
                SmartTravel.com
              </span>
            </h3>
            <p className="text-[11px] text-blue-100">
              Personal Travel Assistant • {trip.destination}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  isAI
                    ? 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                    : 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/20'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[9px] text-right mt-1 ${
                    isAI ? 'text-slate-400' : 'text-blue-100'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Quick Action Suggestion Chips */}
              {isAI && msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(qa.action)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 hover:border-blue-500 text-blue-700 text-[11px] font-bold transition cursor-pointer shadow-xs"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600 text-xs py-2 bg-white px-3 rounded-xl border border-blue-100 self-start shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="font-medium">TripGenie consulting travel databases...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask TripGenie about ${trip.destination}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-40 cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
