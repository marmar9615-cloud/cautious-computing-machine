const BASE_URL = 'http://localhost:3001/api';

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  files: GeneratedFile[];
  createdAt: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  generateProject(description: string) {
    return request<{ project: Project }>('/generate', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  },

  listProjects() {
    return request<{ projects: ProjectListItem[] }>('/projects');
  },

  getProject(id: string) {
    return request<{ project: Project }>(`/projects/${id}`);
  },
};
