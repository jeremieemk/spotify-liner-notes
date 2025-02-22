import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const TrackMistralInfo = ({ data, isLoading, error }) => {
  const markdownComponents = {
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

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Mistral info</h2>
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

export default TrackMistralInfo;
