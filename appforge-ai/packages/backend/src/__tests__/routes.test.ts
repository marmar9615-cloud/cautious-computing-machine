import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('API Routes', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/generate requires description', async () => {
    const res = await request(app).post('/api/generate').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Description is required');
  });

  it('POST /api/generate rejects short descriptions', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ description: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Description must be at least 10 characters');
  });

  it('POST /api/generate rejects long descriptions', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ description: 'a'.repeat(2001) });
    expect(res.status).toBe(400);
  });

  it('POST /api/generate creates a project', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ description: 'Build a simple todo app' });
    expect(res.status).toBe(201);
    expect(res.body.project).toBeDefined();
    expect(res.body.project.id).toBeDefined();
    expect(res.body.project.files).toBeInstanceOf(Array);
    expect(res.body.project.files.length).toBeGreaterThan(0);
  });

  it('GET /api/projects lists projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.projects).toBeInstanceOf(Array);
  });

  it('GET /api/projects/:id returns a project', async () => {
    // First create a project
    const createRes = await request(app)
      .post('/api/generate')
      .send({ description: 'Build a blog platform' });
    const id = createRes.body.project.id;

    const res = await request(app).get(`/api/projects/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.project.id).toBe(id);
    expect(res.body.project.files).toBeInstanceOf(Array);
  });

  it('GET /api/projects/:id returns 404 for missing project', async () => {
    const res = await request(app).get('/api/projects/nonexistent');
    expect(res.status).toBe(404);
  });

  it('GET /api/projects/:id/download returns zip', async () => {
    const createRes = await request(app)
      .post('/api/generate')
      .send({ description: 'Build a chat application' });
    const id = createRes.body.project.id;

    const res = await request(app).get(`/api/projects/${id}/download`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/zip');
  });
});
