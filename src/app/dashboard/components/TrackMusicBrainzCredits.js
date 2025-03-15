import { useSongData } from "../../context/SongDataContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TrackMusicBrainzCredits = () => {
  const { musicBrainzData } = useSongData();

  // Return null if there's no MusicBrainz data
  if (!musicBrainzData || !musicBrainzData.recording) {
    return null;
  }

  const data = musicBrainzData.recording

  const {
    isrcs,
    relations,
  } = data;

  // 1) Separate out the performance relation that leads to a "work"
  const performanceRelation = relations?.find(
    (rel) =>
      rel["target-type"] === "work" && rel.type === "performance" && rel.work
  );
  const workData = performanceRelation?.work || null;

  // 2) Group all other top-level relations (e.g. arranger, engineer, etc.) by type
  const topLevelNonPerformanceRelations =
    relations?.filter((rel) => rel.type !== "performance") || [];

  const groupedRecordingRelations = topLevelNonPerformanceRelations.reduce(
    (acc, rel) => {
      const role = rel.type || "other";
      if (!acc[role]) acc[role] = [];

      // If this relation points to an artist, label, or url, store that object
      if (rel.artist) {
        acc[role].push(rel.artist);
      } else if (rel.label) {
        acc[role].push(rel.label);
      } else if (rel.url) {
        acc[role].push(rel.url);
      } else if (rel.work) {
        acc[role].push(rel.work);
      } else {
        // fallback if none of the above
        acc[role].push(rel);
      }
      return acc;
    },
    {}
  );

  // 3) If there's a work, group its sub-relations by type (composer, lyricist, etc.)
  let groupedWorkRelations = {};
  if (workData && workData.relations) {
    groupedWorkRelations = workData.relations.reduce((acc, rel) => {
      const role = rel.type || "other";
      if (!acc[role]) acc[role] = [];
      if (rel["target-type"] === "artist" && rel.artist) {
        acc[role].push(rel.artist);
      } else if (rel["target-type"] === "label" && rel.label) {
        acc[role].push(rel.label);
      } else if (rel["target-type"] === "url" && rel.url) {
        acc[role].push(rel.url);
      } else if (rel["target-type"] === "work" && rel.work) {
        acc[role].push(rel);
      } else {
        acc[role].push(rel);
      }
      return acc;
    }, {});
  }

  return (
    <Accordion type="single" collapsible className="bg-white/5 rounded-lg p-6 mt-8">
      <AccordionItem value="musicbrainz" className="border-none">
        <AccordionTrigger className="text-2xl font-bold py-0">
          MusicBrainz Details
        </AccordionTrigger>
        <AccordionContent>
          {/* Basic track info */}
          <div className="mb-4 pt-4">
            {isrcs && isrcs.length > 0 && (
              <p className="text-white">
                <strong>ISRC:</strong> {isrcs.join(", ")}
              </p>
            )}
          </div>

          {/* Recording Credits (arranger, engineer, performer, etc.) */}
          {Object.keys(groupedRecordingRelations).length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white my-4">
                Recording Credits
              </h3>
              {Object.entries(groupedRecordingRelations).map(([role, items]) => (
                <div key={role} className="mb-3">
                  <h5 className="capitalize text-white font-bold">{role}</h5>
                  <ul className="list-disc list-inside">
                    {items.map((item, idx) => {
                      // If the item is an artist or label (has a .name)
                      if (item.name) {
                        return (
                          <li key={idx} className="text-gray-300">
                            {item.name}
                            {item.disambiguation && ` (${item.disambiguation})`}
                          </li>
                        );
                      }
                      // If it's a URL
                      if (item.resource) {
                        return (
                          <li key={idx} className="text-gray-300">
                            <a
                              href={item.resource}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {item.resource}
                            </a>
                          </li>
                        );
                      }
                      // Fallback
                      return (
                        <li key={idx} className="text-gray-300">
                          {JSON.stringify(item)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Work Details (from the "performance" relation) */}
          {workData && (
            <div className="mb-4">
              {/* Work sub-relations (composer, lyricist, etc.) */}
              {Object.keys(groupedWorkRelations).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Work Credits
                  </h4>
                  {Object.entries(groupedWorkRelations).map(([role, items]) => (
                    <div key={role} className="mb-3">
                      <h5 className="capitalize text-white font-bold">{role}</h5>
                      <ul className="list-disc list-inside">
                        {items.map((item, idx) => {
                          if (item.name) {
                            return (
                              <li key={idx} className="text-gray-300">
                                {item.name}
                                {item.disambiguation && ` (${item.disambiguation})`}
                              </li>
                            );
                          }
                          if (item.work && item.work.title) {
                            return (
                              <li key={idx} className="text-gray-300">
                                <strong>{item.work.title}</strong>{" "}
                                {item.attributes && item.attributes.length > 0 && (
                                  <span className="text-sm font-normal text-gray-400">
                                    ({item.attributes.join(", ")})
                                  </span>
                                )}
                              </li>
                            );
                          }
                          if (item.resource) {
                            return (
                              <li key={idx} className="text-gray-300">
                                <a
                                  href={item.resource}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline"
                                >
                                  {item.resource}
                                </a>
                              </li>
                            );
                          }
                          // Fallback
                          return (
                            <li key={idx} className="text-gray-300">
                              {JSON.stringify(item)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TrackMusicBrainzCredits;
