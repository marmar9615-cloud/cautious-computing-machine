import { describe, it, expect } from 'vitest';
import { generateProject } from '../engine';

describe('generateProject', () => {
  it('generates a todo project with files', () => {
    const result = generateProject('Build a todo app');
    expect(result.appType).toBe('todo');
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.name).toBeTruthy();
  });

  it('generates a blog project', () => {
    const result = generateProject('Create a blog platform');
    expect(result.appType).toBe('blog');
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('generates an ecommerce project', () => {
    const result = generateProject('Build an online store');
    expect(result.appType).toBe('ecommerce');
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('generates a dashboard project', () => {
    const result = generateProject('Create a dashboard with metrics');
    expect(result.appType).toBe('dashboard');
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('generates a chat project', () => {
    const result = generateProject('Build a chat application');
    expect(result.appType).toBe('chat');
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('generates a landing page by default', () => {
    const result = generateProject('Build a website for my business');
    expect(result.appType).toBe('landing');
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('includes base files like package.json', () => {
    const result = generateProject('Build a todo app');
    const paths = result.files.map((f) => f.path);
    expect(paths).toContain('package.json');
    expect(paths).toContain('.gitignore');
  });

  it('replaces APP_NAME placeholder in files', () => {
    const result = generateProject('Build a todo app called MyTasks');
    const readme = result.files.find((f) => f.path === 'README.md');
    expect(readme?.content).not.toContain('{{APP_NAME}}');
  });

  it('produces unique file paths', () => {
    const result = generateProject('Build a blog');
    const paths = result.files.map((f) => f.path);
    const uniquePaths = [...new Set(paths)];
    expect(paths.length).toBe(uniquePaths.length);
  });
});
