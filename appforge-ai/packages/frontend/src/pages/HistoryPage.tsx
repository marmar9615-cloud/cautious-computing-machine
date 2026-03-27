import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { ProjectListItem } from '../api/client';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HistoryPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listProjects()
      .then(({ projects }) => setProjects(projects))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading projects..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Project History</h1>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No projects yet.</p>
          <p className="text-gray-600 text-sm">
            Generate your first app from the{' '}
            <a href="/" className="text-primary-400 hover:underline">
              home page
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
