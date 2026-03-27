import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('bash', bash);

interface CodeViewerProps {
  filePath: string;
  content: string;
}

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  css: 'css',
  html: 'html',
  md: 'markdown',
  prisma: 'typescript',
  sh: 'bash',
};

export default function CodeViewer({ filePath, content }: CodeViewerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const ext = filePath.split('.').pop() || '';
  const language = EXT_TO_LANG[ext] || 'typescript';

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [content, filePath]);

  const lines = content.split('\n');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-800 border-b border-surface-700">
        <span className="text-sm text-gray-400 font-mono">{filePath}</span>
        <span className="text-xs text-gray-600">{lines.length} lines</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex">
          <div className="select-none text-right pr-4 pl-4 py-4 text-gray-600 text-sm font-mono leading-6 border-r border-surface-700 bg-surface-800/30">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 p-4 overflow-x-auto">
            <code
              ref={codeRef}
              className={`language-${language} text-sm leading-6`}
            >
              {content}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
