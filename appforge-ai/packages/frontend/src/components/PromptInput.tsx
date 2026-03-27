import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  'A todo app with categories and due dates',
  'A blog platform with markdown support',
  'An e-commerce store for selling handmade crafts',
  'An analytics dashboard for tracking website traffic',
  'A real-time chat application with rooms',
];

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onSubmit(description.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the app you want to build..."
          className="w-full h-36 px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          disabled={isLoading}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!description.trim() || isLoading}
          className="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingDots />
              Generating your app...
            </>
          ) : (
            'Generate App'
          )}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setDescription(prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 bg-surface-800 border border-surface-700 rounded-full text-gray-400 hover:text-white hover:border-primary-500/50 transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
    </span>
  );
}
