import { useSongData } from "@/app/context/SongDataContext";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "./LoadingSpinner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const TrackLLMInfo = ({}) => {
  const { perplexityResponse, perplexityLoading, perplexityError } =
    useSongData();

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
      <Accordion type="single" defaultValue="song-info" collapsible>
        <AccordionItem value="song-info" className="border-b-0">
          <AccordionTrigger className="text-2xl font-bold px-0 py-0">
            About this song
          </AccordionTrigger>
          <AccordionContent>
            <div className="min-h-24 mt-4">
              {perplexityLoading || !perplexityResponse ? (
                <LoadingSpinner fullScreen={false} message="" size={24} />
              ) : perplexityError ? (
                <p className="text-gray-400">{perplexityError}</p>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown components={markdownComponents}>
                    {perplexityResponse}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TrackLLMInfo;
