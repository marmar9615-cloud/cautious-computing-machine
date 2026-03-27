import { GeneratedFile } from '../index';

export function getTodoTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/types.ts',
      content: `export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
`,
    },
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">{{APP_NAME}}</h1>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/pages/HomePage.tsx',
      content: `import { useState, useEffect } from 'react';
import { Todo } from '../types';
import TodoInput from '../components/TodoInput';
import TodoItem from '../components/TodoItem';

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch {
      console.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(title: string) {
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
    } catch {
      console.error('Failed to add todo');
    }
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await fetch(\`/api/todos/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      console.error('Failed to update todo');
    }
  }

  async function deleteTodo(id: string) {
    try {
      await fetch(\`/api/todos/\${id}\`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      console.error('Failed to delete todo');
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <TodoInput onAdd={addTodo} />

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-lg">No todos yet</p>
            <p className="text-sm">Add one above to get started!</p>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
            <div className="mt-4 border-t pt-3 text-sm text-gray-500">
              {remaining} item{remaining !== 1 ? 's' : ''} remaining
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default HomePage;
`,
    },
    {
      path: 'src/components/TodoItem.tsx',
      content: `import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
      <button
        onClick={() => onToggle(todo.id)}
        className={\`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors \${
          todo.completed
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-gray-300 hover:border-indigo-400'
        }\`}
      >
        {todo.completed && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={\`flex-1 \${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
        }\`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="rounded p-1 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        aria-label="Delete todo"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default TodoItem;
`,
    },
    {
      path: 'src/components/TodoInput.tsx',
      content: `import { useState, FormEvent } from 'react';

interface TodoInputProps {
  onAdd: (title: string) => void;
}

function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-indigo-600 active:bg-indigo-700"
      >
        Add
      </button>
    </form>
  );
}

export default TodoInput;
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

// Get all todos
app.get('/api/todos', async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(todos);
});

// Create a todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = await prisma.todo.create({
    data: { title: title.trim() },
  });
  res.status(201).json(todo);
});

// Update a todo
app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });
    res.json(todo);
  } catch {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Todo not found' });
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

model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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
