import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptInput from '../components/PromptInput';
import { api } from '../api/client';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async (description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { project } = await api.generateProject(description);
      navigate(`/project/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-blue-300 bg-clip-text text-transparent">
          Describe your app,
          <br />
          we'll build it
        </h1>
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          Turn your idea into a complete, downloadable codebase in seconds.
        </p>
      </div>

      <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mt-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm max-w-2xl w-full">
          {error}
        </div>
      )}
    </div>
  );
}
