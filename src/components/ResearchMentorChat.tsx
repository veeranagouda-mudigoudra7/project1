import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface ResearchMentorChatProps {
  paperTitle: string;
  paperSummary: string;
  flowchart: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ResearchMentorChat: React.FC<ResearchMentorChatProps> = ({
  paperTitle,
  paperSummary,
  flowchart,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your CS Research Agent mentor. Ask me anything about the math, architecture layers in the flowchart, or implementation tips for your resume project on "${paperTitle}".`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Explain the computational complexity compared to prior art.',
    'How do I benchmark this architecture on a consumer GPU?',
    'What are the main failure modes of this approach?',
  ];

  const handleSend = async (userQuestion?: string) => {
    const query = userQuestion || input;
    if (!query.trim() || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          paperTitle,
          paperSummary,
          flowchart,
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.answer || 'I could not retrieve an answer at this time.',
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Error connecting to research mentor. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">
              Research Mentor Q&A
            </h4>
            <p className="text-[11px] text-slate-400">
              Interactive clarification on algorithms, proofs & student project setup
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
          Context-Aware
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`p-1.5 rounded-lg text-xs flex-shrink-0 ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-indigo-400 border border-slate-700'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`rounded-xl px-4 py-2.5 text-xs max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-300 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-xl px-4 py-2.5 bg-slate-950/80 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing paper mechanics...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            disabled={isLoading}
            className="text-[10px] bg-slate-800/80 hover:bg-indigo-950 hover:text-indigo-300 hover:border-indigo-700 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about the math, architecture, or code..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
