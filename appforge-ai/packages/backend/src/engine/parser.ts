import { AppType, Feature, ParsedDescription } from './index';

const appTypeKeywords: Record<AppType, string[]> = {
  todo: ['todo', 'task', 'checklist'],
  blog: ['blog', 'post', 'article', 'cms'],
  ecommerce: ['shop', 'store', 'ecommerce', 'product', 'cart'],
  dashboard: ['dashboard', 'analytics', 'admin', 'metrics'],
  chat: ['chat', 'message', 'messenger', 'real-time'],
  landing: [],
};

const featureKeywords: Record<Feature, string[]> = {
  auth: ['auth', 'login', 'signup', 'sign-up', 'register', 'authentication'],
  darkMode: ['dark', 'theme', 'dark mode', 'night mode'],
  responsive: ['responsive', 'mobile', 'adaptive'],
  api: ['api', 'rest', 'graphql', 'endpoint'],
  database: ['database', 'db', 'storage', 'persist', 'sql', 'postgres'],
  search: ['search', 'filter', 'find', 'query'],
};

function detectAppType(lowerDesc: string): AppType {
  const words = lowerDesc.split(/\s+/);

  for (const [type, keywords] of Object.entries(appTypeKeywords) as [AppType, string[]][]) {
    if (type === 'landing') continue;
    for (const keyword of keywords) {
      if (keyword.includes('-') || keyword.includes(' ')) {
        if (lowerDesc.includes(keyword)) return type;
      } else {
        if (words.includes(keyword)) return type;
      }
    }
  }

  return 'landing';
}

function detectFeatures(lowerDesc: string): Feature[] {
  const features: Feature[] = [];

  for (const [feature, keywords] of Object.entries(featureKeywords) as [Feature, string[]][]) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        features.push(feature);
        break;
      }
    }
  }

  return features;
}

function extractAppName(description: string): string {
  // Try to extract a name from patterns like "called X", "named X", "X app"
  const calledMatch = description.match(/(?:called|named)\s+["']?([A-Za-z][A-Za-z0-9\s]{0,20})["']?/i);
  if (calledMatch) {
    return toPascalCase(calledMatch[1].trim());
  }

  // Try "build/create/make a X app/application"
  const buildMatch = description.match(
    /(?:build|create|make|generate)\s+(?:a\s+|an\s+)?(.+?)(?:\s+app|\s+application|\s+website|\s+platform|\s+site)/i
  );
  if (buildMatch) {
    const name = buildMatch[1]
      .replace(/\b(?:simple|basic|full|complete|modern|beautiful|responsive)\b/gi, '')
      .trim();
    if (name.length > 0 && name.length <= 30) {
      return toPascalCase(name);
    }
  }

  // Fallback: derive from app type keywords
  const lowerDesc = description.toLowerCase();
  const typeNames: Record<string, string> = {
    todo: 'MyTodoApp',
    task: 'TaskManager',
    blog: 'MyBlog',
    shop: 'MyShop',
    store: 'MyStore',
    ecommerce: 'MyStore',
    dashboard: 'MyDashboard',
    chat: 'MyChat',
    message: 'MyMessenger',
  };

  for (const [keyword, name] of Object.entries(typeNames)) {
    if (lowerDesc.includes(keyword)) return name;
  }

  return 'MyApp';
}

function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function parseDescription(description: string): ParsedDescription {
  const lowerDesc = description.toLowerCase();

  return {
    appName: extractAppName(description),
    appType: detectAppType(lowerDesc),
    features: detectFeatures(lowerDesc),
    description,
  };
}
