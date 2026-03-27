import { parseDescription } from './parser';
import { composeProject } from './composer';
import { getBaseTemplate } from './templates/base';
import { getTodoTemplate } from './templates/todo';
import { getBlogTemplate } from './templates/blog';
import { getEcommerceTemplate } from './templates/ecommerce';
import { getDashboardTemplate } from './templates/dashboard';
import { getChatTemplate } from './templates/chat';
import { getLandingTemplate } from './templates/landing';

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GeneratedProject {
  name: string;
  appType: string;
  files: GeneratedFile[];
}

export interface ParsedDescription {
  appName: string;
  appType: AppType;
  features: Feature[];
  description: string;
}

export type AppType = 'todo' | 'blog' | 'ecommerce' | 'dashboard' | 'chat' | 'landing';
export type Feature = 'auth' | 'darkMode' | 'responsive' | 'api' | 'database' | 'search';

const templateGetters: Record<AppType, () => GeneratedFile[]> = {
  todo: getTodoTemplate,
  blog: getBlogTemplate,
  ecommerce: getEcommerceTemplate,
  dashboard: getDashboardTemplate,
  chat: getChatTemplate,
  landing: getLandingTemplate,
};

export function generateProject(description: string): GeneratedProject {
  const parsed = parseDescription(description);
  const baseFiles = getBaseTemplate();
  const templateFiles = templateGetters[parsed.appType]();
  const files = composeProject(parsed, baseFiles, templateFiles);

  return {
    name: parsed.appName,
    appType: parsed.appType,
    files,
  };
}
