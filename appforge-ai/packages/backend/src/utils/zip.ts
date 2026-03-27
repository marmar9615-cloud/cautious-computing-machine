import path from 'path';
import archiver from 'archiver';

function sanitizePath(filePath: string): string | null {
  // Normalize and strip leading slashes / drive letters
  const normalized = path.posix.normalize(filePath).replace(/^\/+/, '');
  // Reject paths that try to escape the project root
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    return null;
  }
  return normalized;
}

export function createProjectZip(
  files: Array<{ path: string; content: string }>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    archive.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    archive.on('error', (err: Error) => {
      reject(err);
    });

    for (const file of files) {
      const safePath = sanitizePath(file.path);
      if (safePath) {
        archive.append(file.content, { name: safePath });
      }
    }

    archive.finalize();
  });
}
