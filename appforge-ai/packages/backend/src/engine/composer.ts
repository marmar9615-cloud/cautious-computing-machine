import { GeneratedFile, ParsedDescription } from './index';

export function composeProject(
  parsed: ParsedDescription,
  baseFiles: GeneratedFile[],
  templateFiles: GeneratedFile[]
): GeneratedFile[] {
  const fileMap = new Map<string, GeneratedFile>();

  // Add base files first
  for (const file of baseFiles) {
    fileMap.set(file.path, file);
  }

  // Template files override base files when paths collide
  for (const file of templateFiles) {
    fileMap.set(file.path, file);
  }

  // Replace {{APP_NAME}} placeholder in all file contents
  const merged = Array.from(fileMap.values());

  return merged.map((file) => ({
    path: file.path,
    content: file.content.replace(/\{\{APP_NAME\}\}/g, parsed.appName),
  }));
}
