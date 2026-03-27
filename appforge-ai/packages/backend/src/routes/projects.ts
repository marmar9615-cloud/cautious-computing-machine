import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createProjectZip } from '../utils/zip';

const prisma = new PrismaClient();
export const projectsRouter = Router();

// List all projects (exclude files for performance)
projectsRouter.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ projects });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// Get single project with files
projectsRouter.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      project: {
        ...project,
        files: JSON.parse(project.files),
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Download project as zip
projectsRouter.get('/projects/:id/download', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const files = JSON.parse(project.files) as Array<{ path: string; content: string }>;
    const zipBuffer = await createProjectZip(files);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.zip"`,
      'Content-Length': zipBuffer.length.toString(),
    });

    res.send(zipBuffer);
  } catch (error) {
    console.error('Download project error:', error);
    res.status(500).json({ error: 'Failed to download project' });
  }
});

// Delete a project
projectsRouter.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});
