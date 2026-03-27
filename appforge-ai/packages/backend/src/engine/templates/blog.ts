import { GeneratedFile } from '../index';

export function getBlogTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import NewPostPage from './pages/NewPostPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <a href="/" className="text-2xl font-bold text-gray-900">{{APP_NAME}}</a>
          <a
            href="/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            New Post
          </a>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/new" element={<NewPostPage />} />
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
import PostCard from '../components/PostCard';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">Latest Posts</h2>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-lg text-gray-500">No posts yet</p>
          <a href="/new" className="mt-2 inline-block text-indigo-600 hover:underline">
            Write your first post
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
`,
    },
    {
      path: 'src/pages/PostPage.tsx',
      content: `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/posts/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setPost)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' });
    navigate('/');
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>;
  }

  if (!post) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        &larr; Back to posts
      </button>

      <article>
        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
          <span>By {post.author}</span>
          <span>&middot;</span>
          <time>{new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</time>
        </div>

        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-gray-700">
          {post.content}
        </div>
      </article>

      <div className="mt-10 border-t pt-6">
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          Delete Post
        </button>
      </div>
    </main>
  );
}

export default PostPage;
`,
    },
    {
      path: 'src/pages/NewPostPage.tsx',
      content: `import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || 'Anonymous',
          content: content.trim(),
        }),
      });
      const post = await res.json();
      navigate(\`/post/\${post.id}\`);
    } catch {
      console.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="author" className="mb-1 block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
            rows={12}
            required
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewPostPage;
`,
    },
    {
      path: 'src/components/PostCard.tsx',
      content: `interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const excerpt = post.content.length > 200
    ? post.content.slice(0, 200) + '...'
    : post.content;

  return (
    <a
      href={\`/post/\${post.id}\`}
      className="block rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
        <span>{post.author}</span>
        <span>&middot;</span>
        <time>{new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}</time>
      </div>
      <p className="mt-3 text-gray-600">{excerpt}</p>
    </a>
  );
}

export default PostCard;
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

// Get all posts
app.get('/api/posts', async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
  });
  res.json(posts);
});

// Get a single post
app.get('/api/posts/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Create a post
app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      author: (author || 'Anonymous').trim(),
    },
  });
  res.status(201).json(post);
});

// Update a post
app.patch('/api/posts/:id', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(author !== undefined && { author }),
      },
    });
    res.json(post);
  } catch {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Post not found' });
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

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  author      String   @default("Anonymous")
  publishedAt DateTime @default(now())
  updatedAt   DateTime @updatedAt
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
