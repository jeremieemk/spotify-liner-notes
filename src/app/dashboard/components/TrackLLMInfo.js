// components/TrackLLMInfo.jsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from './LoadingSpinner';

const TrackLLMInfo = ({
  perplexityData,
  perplexityLoading,
  perplexityError,
  mistralData,
  mistralLoading,
  mistralError
}) => {
  const [activeSource, setActiveSource] = useState('perplexity'); // Default to perplexity

  const markdownComponents = {
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="space-y-2 mb-4">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-gray-300 ml-4">{children}</li>
    ),
    strong: ({ children }) => (
      <span className="font-semibold text-white">{children}</span>
    ),
  };

  // Determine current data, loading state, and error based on active source
  const getCurrentData = () => {
    switch (activeSource) {
      case 'mistral':
        return {
          title: 'Mistral Analysis',
          data: mistralData,
          isLoading: mistralLoading,
          error: mistralError
        };
      case 'perplexity':
      default:
        return {
          title: 'Perplexity Analysis',
          data: perplexityData,
          isLoading: perplexityLoading,
          error: perplexityError
        };
    }
  };

  const { title, data, isLoading, error } = getCurrentData();

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2 bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setActiveSource('perplexity')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeSource === 'perplexity'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Perplexity
          </button>
          <button
            onClick={() => setActiveSource('mistral')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeSource === 'mistral'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Mistral
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-gray-400">{error}</p>
      ) : !data ? (
        <p className="text-gray-400">No analysis available</p>
      ) : (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown components={markdownComponents}>
            {data}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default TrackLLMInfo;