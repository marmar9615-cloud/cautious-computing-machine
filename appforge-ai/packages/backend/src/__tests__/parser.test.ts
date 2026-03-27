import { describe, it, expect } from 'vitest';
import { parseDescription } from '../engine/parser';

describe('parseDescription', () => {
  it('detects todo app type', () => {
    const result = parseDescription('Build a todo app with categories');
    expect(result.appType).toBe('todo');
    expect(result.appName).toBeTruthy();
  });

  it('detects blog app type', () => {
    const result = parseDescription('Create a blog platform with markdown support');
    expect(result.appType).toBe('blog');
  });

  it('detects ecommerce app type', () => {
    const result = parseDescription('I want an online store for selling shoes');
    expect(result.appType).toBe('ecommerce');
  });

  it('detects dashboard app type', () => {
    const result = parseDescription('Build an analytics dashboard for my website');
    expect(result.appType).toBe('dashboard');
  });

  it('detects chat app type', () => {
    const result = parseDescription('Create a real-time chat application');
    expect(result.appType).toBe('chat');
  });

  it('defaults to landing for generic descriptions', () => {
    const result = parseDescription('Build a beautiful website for my business');
    expect(result.appType).toBe('landing');
  });

  it('extracts named app name', () => {
    const result = parseDescription('Build a todo app called TaskMaster');
    expect(result.appName).toBe('Taskmaster');
  });

  it('detects auth feature', () => {
    const result = parseDescription('Create a blog with login and signup');
    expect(result.features).toContain('auth');
  });

  it('detects search feature', () => {
    const result = parseDescription('Build a store with search and filter');
    expect(result.features).toContain('search');
  });

  it('returns description in result', () => {
    const desc = 'Build something cool';
    const result = parseDescription(desc);
    expect(result.description).toBe(desc);
  });
});
