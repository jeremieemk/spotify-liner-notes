import { useSongData } from "../../context/SongDataContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TrackLyrics = () => {
  const { lyrics } = useSongData();
  
  // Don't render anything if there are no lyrics
  if (!lyrics) return null;

  // Process lyrics to remove empty lines
  const processedLyrics = lyrics
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

  return (
    <Accordion type="single" collapsible className="bg-white/5 rounded-lg p-6 mt-8">
      <AccordionItem value="lyrics" className="border-none">
        <AccordionTrigger className="text-2xl font-bold py-0">
          Lyrics
        </AccordionTrigger>
        <AccordionContent>
          <div className="whitespace-pre-wrap text-gray-300 font-light leading-relaxed pt-4">
            {processedLyrics}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TrackLyrics;
