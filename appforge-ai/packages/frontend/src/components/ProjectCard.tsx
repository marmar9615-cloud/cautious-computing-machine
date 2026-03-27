import { Link } from 'react-router-dom';
import type { ProjectListItem } from '../api/client';

interface ProjectCardProps {
  project: ProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const date = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/project/${project.id}`}
      className="block p-5 bg-surface-800 border border-surface-700 rounded-xl hover:border-primary-500/50 hover:bg-surface-800/80 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
          {project.name}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            project.status === 'completed'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
        {project.description}
      </p>
      <div className="text-xs text-gray-600">{date}</div>
    </Link>
  );
}
