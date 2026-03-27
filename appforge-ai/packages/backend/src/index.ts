import express from 'express';
import cors from 'cors';
import { generateRouter } from './routes/generate';
import { projectsRouter } from './routes/projects';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', generateRouter);
app.use('/api', projectsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`AppForge AI backend running on port ${PORT}`);
  });
}

export { app };
