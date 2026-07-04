import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Cpu, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BuildRecommendation {
  message: string;
  build: Record<string, string>;
  totalPrice: number;
  reasoning: Record<string, string>;
}

interface AIAssistantProps {
  onLoadBuild: (build: Record<string, string>) => void;
}

// ── Component database map — ID → display info ─────────────────────────────
// Used to show human-readable names in the reasoning breakdown

const COMPONENT_LABELS: Record<string, string> = {
  'cpu-1': 'Intel Core i9-13900K',
  'cpu-2': 'AMD Ryzen 9 7900X',
  'cpu-3': 'Intel Core i5-13600K',
  'cpu-4': 'AMD Ryzen 5 7600X',
  'mb-1': 'ASUS ROG Strix Z790-E',
  'mb-2': 'Gigabyte X670E Aorus Master',
  'mb-3': 'MSI B760 Gaming X AX',
  'mb-4': 'MSI B650 Gaming X AX',
  'ram-1': 'G.Skill Trident Z5 RGB 32GB DDR5',
  'ram-2': 'Corsair Vengeance 16GB DDR4',
  'ram-3': 'G.Skill Trident Z5 64GB DDR5',
  'ram-4': 'Corsair Vengeance LPX 16GB DDR4',
  'gpu-1': 'NVIDIA GeForce RTX 4090',
  'gpu-2': 'NVIDIA GeForce RTX 4070 Ti',
  'gpu-3': 'AMD Radeon RX 7800 XT',
  'gpu-4': 'NVIDIA GeForce RTX 4060',
  'ssd-1': 'Samsung 980 PRO 2TB',
  'ssd-2': 'WD SN770 1TB',
  'hdd-1': 'Seagate Barracuda 4TB',
  'cooler-1': 'Noctua NH-D15',
  'cooler-2': 'NZXT Kraken X63',
  'cooler-3': 'Cooler Master Hyper 212 RGB',
  'psu-1': 'Corsair RM1000x 1000W',
  'psu-2': 'Seasonic Focus GX-850 850W',
  'psu-3': 'EVGA SuperNOVA 650W',
  'case-1': 'NZXT H7 Flow',
  'case-2': 'Fractal Design Define 7 Compact',
  'case-3': 'Lian Li Lancool 216',
};

const SLOT_LABELS: Record<string, string> = {
  processor: 'Processor',
  'cpu-cooler': 'CPU Cooler',
  motherboard: 'Motherboard',
  gpu: 'GPU',
  memory: 'Memory',
  storage: 'Storage',
  'power-supply': 'Power Supply',
  case: 'Case',
};

// ── Parse build recommendation from assistant response ─────────────────────

function parseBuildRecommendation(text: string): BuildRecommendation | null {
  const match = text.match(/<build>([\s\S]*?)<\/build>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

// Strip the <build>...</build> block from text for display
function stripBuildBlock(text: string): string {
  return text.replace(/<build>[\s\S]*?<\/build>/g, '').trim();
}

// ── Suggested starter prompts ──────────────────────────────────────────────

const STARTERS = [
  'I want to game and stream for under $800',
  'Best PC for video editing around $1,500',
  'Budget gaming PC under $600',
  'High-end 4K gaming, no budget limit',
];

// ── Main Component ─────────────────────────────────────────────────────────

export function AIAssistant({ onLoadBuild }: AIAssistantProps) {
  const [isOpen, setIsOpen]               = useState(false);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [lastBuild, setLastBuild]         = useState<BuildRecommendation | null>(null);
  const [loadedBuild, setLoadedBuild]     = useState(false);
  const messagesEndRef                    = useRef<HTMLDivElement>(null);
  const inputRef                          = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setLoadedBuild(false);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      const text = data.text || '';

      // Check if this response contains a build recommendation
      const recommendation = parseBuildRecommendation(text);
      if (recommendation) {
        setLastBuild(recommendation);
      }

      const assistantMessage: Message = { role: 'assistant', content: text };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadBuild = () => {
    if (!lastBuild) return;
    onLoadBuild(lastBuild.build);
    setLoadedBuild(true);
  };

  const handleReset = () => {
    setMessages([]);
    setLastBuild(null);
    setLoadedBuild(false);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render: message bubble ───────────────────────────────────────────────

  const renderMessage = (msg: Message, index: number) => {
    const isUser = msg.role === 'user';
    const recommendation = !isUser ? parseBuildRecommendation(msg.content) : null;
    const displayText = recommendation ? stripBuildBlock(msg.content) : msg.content;
    const isLastMessage = index === messages.length - 1;

    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>

          {/* Avatar */}
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">AI Assistant</span>
            </div>
          )}

          {/* Message bubble */}
          {displayText && (
            <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted text-foreground rounded-tl-sm'
            }`}>
              {displayText}
            </div>
          )}

          {/* Build recommendation card */}
          {recommendation && (
            <div className="mt-3 border border-border rounded-xl overflow-hidden bg-card">
              {/* Header */}
              <div className="px-4 py-3 bg-primary/10 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Recommended Build</span>
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  ${recommendation.totalPrice.toLocaleString()}
                </Badge>
              </div>

              {/* Component list */}
              <div className="px-4 py-3 space-y-2">
                {Object.entries(recommendation.build).map(([slot, id]) => (
                  <div key={slot} className="flex items-start justify-between gap-2 text-xs">
                    <span className="text-muted-foreground shrink-0 w-24">
                      {SLOT_LABELS[slot] || slot}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground font-medium">
                        {COMPONENT_LABELS[id] || id}
                      </span>
                      {recommendation.reasoning?.[slot] && (
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          {recommendation.reasoning[slot]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load build button */}
              {isLastMessage && (
                <div className="px-4 py-3 border-t border-border">
                  {loadedBuild ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <span>✓</span>
                      <span>Build loaded into builder</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleLoadBuild}
                    >
                      Load This Build →
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Render: main panel ───────────────────────────────────────────────────

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
        }`}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        {isOpen
          ? <X className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
        {/* Unread dot — shown when there are messages and panel is closed */}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Build Assistant</p>
                <p className="text-xs text-muted-foreground">Tell me your budget & use case</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                title="Start over"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
            {messages.length === 0 ? (
              /* Empty state — starter prompts */
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  I'll ask a few questions and build you a fully compatible PC. Try one of these:
                </p>
                <div className="space-y-2">
                  {STARTERS.map(starter => (
                    <button
                      key={starter}
                      onClick={() => sendMessage(starter)}
                      className="w-full text-left px-3 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => renderMessage(msg, i))}
                {loading && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-border bg-card shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your build..."
                rows={1}
                disabled={loading}
                className="flex-1 resize-none bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 max-h-32 overflow-y-auto"
                style={{ minHeight: '40px' }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 128) + 'px';
                }}
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
