import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateProject } from '../engine';

const prisma = new PrismaClient();
export const generateRouter = Router();

generateRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (description.length > 2000) {
      return res.status(400).json({ error: 'Description must be under 2000 characters' });
    }

    const generated = generateProject(description);

    const project = await prisma.project.create({
      data: {
        name: generated.name,
        description: description,
        status: 'completed',
        files: JSON.stringify(generated.files),
      },
    });

    res.json({
      project: {
        ...project,
        files: generated.files,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate project' });
  }
});
