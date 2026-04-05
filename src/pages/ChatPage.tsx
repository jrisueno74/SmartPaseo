import { useEffect, useRef, useState } from 'react';
import { BOT_ID, ChatMessage, hasApiKey, streamMessage } from '../lib/gemini';

const WELCOME: ChatMessage = {
  role: 'model',
  text: `📍 Ruta / Estado: Aveiro, Portugal — listos para empezar.\n\n💡 Sugerencia de la IA: Cuéntame dónde os alojáis y a qué hora coméis, y os armo la ruta perfecta para la familia.\n\n❓ Siguiente Paso: ¿Dónde está vuestro hotel hoy?`,
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend() {
    if ((!input.trim() && !image) || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', text: input.trim() || '(imagen)', image: image ?? undefined };
    const nextHistory = [...messages, userMsg];
    setMessages([...nextHistory, { role: 'model', text: '' }]);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      let accumulated = '';
      for await (const chunk of streamMessage(nextHistory)) {
        accumulated += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'model', text: accumulated };
          return copy;
        });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al contactar con Gemini');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setImage(url);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] px-4">
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Bot: {BOT_ID}
          </p>
          <h2 className="font-headline font-extrabold text-2xl text-primary">Kinetic Concierge</h2>
        </div>
        {!hasApiKey() && (
          <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-1 rounded-full">
            NO API KEY
          </span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} isLast={i === messages.length - 1} loading={loading} />
        ))}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {image && (
        <div className="mb-2 relative inline-block">
          <img src={image} className="h-20 rounded-lg border border-outline-variant/30" alt="preview" />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-on-primary text-xs flex items-center justify-center"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 pb-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container"
          aria-label="Attach image"
        >
          <span className="material-symbols-outlined">add_photo_alternate</span>
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder="Pregunta algo o describe dónde estáis…"
          className="flex-1 resize-none bg-surface-container-lowest border-2 border-outline-variant/20 rounded-2xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && !image)}
          className="w-12 h-12 rounded-full signature-gradient text-white flex items-center justify-center shadow-lg disabled:opacity-40 active:scale-95 transition-transform"
          aria-label="Send"
        >
          <span className="material-symbols-outlined">
            {loading ? 'hourglass_top' : 'send'}
          </span>
        </button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isLast,
  loading,
}: {
  message: ChatMessage;
  isLast: boolean;
  loading: boolean;
}) {
  const isUser = message.role === 'user';
  const showTyping = !isUser && isLast && loading && !message.text;
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
          isUser ? 'bg-secondary-container text-on-secondary-container' : 'signature-gradient text-white'
        }`}
      >
        <span
          className="material-symbols-outlined text-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isUser ? 'person' : 'auto_awesome'}
        </span>
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-primary text-on-primary rounded-tr-sm'
            : 'bg-surface-container-high text-on-surface rounded-tl-sm border-l-2 border-primary'
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            className="rounded-lg mb-2 max-h-48 border border-outline-variant/20"
            alt=""
          />
        )}
        {showTyping ? (
          <span className="inline-flex gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          message.text
        )}
      </div>
    </div>
  );
}
