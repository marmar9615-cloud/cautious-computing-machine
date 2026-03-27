import { GeneratedFile } from '../index';

export function getChatTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="shrink-0 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">{{APP_NAME}}</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/pages/ChatPage.tsx',
      content: `import { useState, useEffect, useRef } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

interface Message {
  id: string;
  content: string;
  sender: string;
  roomId: string;
  createdAt: string;
}

const CURRENT_USER = 'You';
const ROOM_ID = 'general';

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await fetch(\`/api/rooms/\${ROOM_ID}/messages\`);
      const data = await res.json();
      setMessages(data);
    } catch {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    try {
      const res = await fetch(\`/api/rooms/\${ROOM_ID}/messages\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sender: CURRENT_USER }),
      });
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      console.error('Failed to send message');
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.sender === CURRENT_USER}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="shrink-0 border-t bg-white px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
`,
    },
    {
      path: 'src/components/MessageBubble.tsx',
      content: `interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={\`flex \${isOwn ? 'justify-end' : 'justify-start'}\`}>
      <div className={\`max-w-[75%] \${isOwn ? 'items-end' : 'items-start'}\`}>
        {!isOwn && (
          <span className="mb-1 block text-xs font-medium text-gray-500">
            {message.sender}
          </span>
        )}
        <div
          className={\`rounded-2xl px-4 py-2.5 \${
            isOwn
              ? 'rounded-br-md bg-indigo-600 text-white'
              : 'rounded-bl-md bg-white text-gray-800 shadow-sm'
          }\`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className={\`mt-1 block text-xs text-gray-400 \${isOwn ? 'text-right' : 'text-left'}\`}>
          {time}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
`,
    },
    {
      path: 'src/components/ChatInput.tsx',
      content: `import { useState, FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (content: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-xl bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}

export default ChatInput;
`,
    },
    {
      path: 'server/index.ts',
      content: `import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ensure default room exists
async function ensureDefaultRoom() {
  const existing = await prisma.room.findUnique({ where: { id: 'general' } });
  if (!existing) {
    await prisma.room.create({ data: { id: 'general', name: 'General' } });
  }
}
ensureDefaultRoom();

// Get all rooms
app.get('/api/rooms', async (_req, res) => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(rooms);
});

// Get messages for a room
app.get('/api/rooms/:roomId/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { roomId: req.params.roomId },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });
  res.json(messages);
});

// Send a message
app.post('/api/rooms/:roomId/messages', async (req, res) => {
  const { content, sender } = req.body;
  if (!content || !sender) {
    return res.status(400).json({ error: 'Content and sender are required' });
  }
  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      sender: sender.trim(),
      roomId: req.params.roomId,
    },
  });
  res.status(201).json(message);
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    },
    {
      path: 'prisma/schema.prisma',
      content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Room {
  id        String    @id @default(cuid())
  name      String
  createdAt DateTime  @default(now())
  messages  Message[]
}

model Message {
  id        String   @id @default(cuid())
  content   String
  sender    String
  roomId    String
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
`,
    },
    {
      path: '.env',
      content: `DATABASE_URL="file:./dev.db"
`,
    },
  ];
}
