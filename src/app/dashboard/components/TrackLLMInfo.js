import { useSongData } from "@/app/context/SongDataContext";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "./LoadingSpinner";

const TrackLLMInfo = ({}) => {
  const {
    perplexityResponse,
    perplexityLoading,
    perplexityError,
  } = useSongData();

  const markdownComponents = {
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>
    ),
    p: ({ children }) => <p className="text-gray-300 mb-4">{children}</p>,
    ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
    li: ({ children }) => <li className="text-gray-300 ml-4">{children}</li>,
    strong: ({ children }) => (
      <span className="font-semibold text-white">{children}</span>
    ),
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">About this song</h2>
      </div>

      <div className="min-h-24">
        {perplexityLoading ? (
          <LoadingSpinner fullScreen={false} message="" size={24} />
        ) : perplexityError ? (
          <p className="text-gray-400">{perplexityError}</p>
        ) : !perplexityResponse ? (
          <p className="text-gray-400">No analysis available</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {perplexityResponse}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackLLMInfo;
