import { useSongData } from "../../context/SongDataContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TrackDiscogsCredits = () => {
  const { discogsCredits, song } = useSongData();
  const releaseData = discogsCredits?.release;

  const creditsContent = renderTrackCredits(releaseData, song);
  if (!creditsContent) return null;

  return (
    <Accordion type="single" collapsible className="bg-white/5 rounded-lg p-6 mt-6">
      <AccordionItem value="discogs" className="border-none">
        <AccordionTrigger className="text-2xl font-bold py-0">
          Discogs Details
        </AccordionTrigger>
        <AccordionContent>
          {creditsContent}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TrackDiscogsCredits;

const renderTrackCredits = (releaseData, song) => {
  if (!releaseData) return null;

  const tracklistItem = releaseData.tracklist.find(
    (track) => track.title.toLowerCase() === song.toLowerCase()
  );

  const trackCredits = tracklistItem?.extraartists;
  const albumCredits = releaseData?.extraartists;
  if (!trackCredits?.length && !albumCredits?.length) return null;

  return (
    <div className="mt-4">
      {trackCredits?.length && (
        <>
          <h3 className="text-lg font-semibold text-white my-4">
            Track Credits
          </h3>
          <ul className="space-y-2">
            {trackCredits?.map((artist, index) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold text-white">
                  {artist.role}:{" "}
                </span>
                {artist.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {albumCredits?.length && (
        <>
          <h3 className="text-lg font-semibold text-white my-4">
            Album Credits
          </h3>
          <ul className="space-y-2">
            {albumCredits?.map((artist, index) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold text-white">
                  {artist.role}:{" "}
                </span>
                {artist.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
