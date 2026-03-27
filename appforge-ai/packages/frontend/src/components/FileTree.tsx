import { useState, useMemo } from 'react';
import type { GeneratedFile } from '../api/client';

interface FileTreeProps {
  files: GeneratedFile[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
}

function buildTree(files: GeneratedFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const path = parts.slice(0, i + 1).join('/');
      const isDir = i < parts.length - 1;

      let existing = current.find((n) => n.name === name && n.isDir === isDir);
      if (!existing) {
        existing = { name, path, isDir, children: [] };
        current.push(existing);
      }
      current = existing.children;
    }
  }

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map((n) => ({ ...n, children: sortNodes(n.children) }));
  };

  return sortNodes(root);
}

function TreeItem({
  node,
  depth,
  selectedFile,
  onSelectFile,
}: {
  node: TreeNode;
  depth: number;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isSelected = selectedFile === node.path;

  if (node.isDir) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1.5 py-1 px-2 text-sm text-gray-400 hover:text-white hover:bg-surface-700/50 rounded transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span className="text-xs">{expanded ? '\u25BE' : '\u25B8'}</span>
          <span className="text-primary-400">
            {expanded ? '\uD83D\uDCC2' : '\uD83D\uDCC1'}
          </span>
          <span>{node.name}</span>
        </button>
        {expanded && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const ext = node.name.split('.').pop() || '';
  const iconMap: Record<string, string> = {
    tsx: '\uD83D\uDFE6', ts: '\uD83D\uDFE6', jsx: '\uD83D\uDFE8', js: '\uD83D\uDFE8',
    json: '\uD83D\uDFE2', css: '\uD83D\uDFE3', html: '\uD83D\uDFE0', md: '\uD83D\uDCDD',
    prisma: '\u25C6',
  };

  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={`w-full flex items-center gap-1.5 py-1 px-2 text-sm rounded transition-colors ${
        isSelected
          ? 'bg-primary-500/20 text-primary-300'
          : 'text-gray-400 hover:text-white hover:bg-surface-700/50'
      }`}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <span className="text-xs">{iconMap[ext] || '\uD83D\uDCC4'}</span>
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export default function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <div className="py-2 overflow-y-auto h-full">
      {tree.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          depth={0}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
