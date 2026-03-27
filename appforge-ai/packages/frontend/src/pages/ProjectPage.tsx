import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Project } from '../api/client';
import FileTree from '../components/FileTree';
import CodeViewer from '../components/CodeViewer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getProject(id)
      .then(({ project }) => {
        setProject(project);
        if (project.files.length > 0) {
          setSelectedFile(project.files[0].path);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading project..." />;
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  if (!project) return null;

  const currentFile = project.files.find((f) => f.path === selectedFile);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-surface-700 bg-surface-800/30">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate">{project.name}</h1>
          <p className="text-sm text-gray-500 truncate">{project.description}</p>
        </div>
        <a
          href={api.getDownloadUrl(project.id)}
          className="shrink-0 ml-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Download ZIP
        </a>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 shrink-0 border-r border-surface-700 bg-surface-800/20 overflow-y-auto hidden sm:block">
          <FileTree
            files={project.files}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>

        <div className="flex-1 overflow-hidden bg-surface-950">
          {currentFile ? (
            <CodeViewer filePath={currentFile.path} content={currentFile.content} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a file to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
