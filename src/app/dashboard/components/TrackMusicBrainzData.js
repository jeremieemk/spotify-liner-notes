"use client";

import React from "react";

// Helper function to format track length (ms) into mm:ss
function formatLength(ms) {
  if (!ms) return "Unknown";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const TrackMusicBrainzData = ({ data }) => {
  if (!data) return null;

  const {
    title,
    length,
    disambiguation,
    "first-release-date": firstReleaseDate,
    isrcs,
    relations,
    "artist-credit": artistCredit,
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
    <div className="bg-white/5 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">MusicBrainz Details</h2>

      {/* Basic track info */}
      <div className="mb-4">
        <p className="text-white">
          <strong>Title:</strong> {title}{" "}
          {disambiguation && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({disambiguation})
            </span>
          )}
        </p>
        <p className="text-white">
          <strong>First Release Date:</strong> {firstReleaseDate || "Unknown"}
        </p>
        <p className="text-white">
          <strong>Length:</strong> {formatLength(length)}
        </p>
        {isrcs && isrcs.length > 0 && (
          <p className="text-white">
            <strong>ISRC:</strong> {isrcs.join(", ")}
          </p>
        )}
      </div>

      {/* Artist credit */}
      {artistCredit && artistCredit.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white my-4">
            Artist Credit
          </h3>
          <ul className="list-disc list-inside">
            {artistCredit.map((credit, idx) => (
              <li key={idx} className="text-gray-300">
                {credit.name}
              </li>
            ))}
          </ul>
        </div>
      )}

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
          <h3 className="text-lg font-semibold text-white my-4">
            Work Details
          </h3>
          <p className="text-white">
            <strong>Work Title:</strong> {workData.title}
          </p>
          {workData.languages && workData.languages.length > 0 && (
            <p className="text-white">
              <strong>Language(s):</strong> {workData.languages.join(", ")}
            </p>
          )}
          {workData.disambiguation && (
            <p className="text-white">
              <strong>Disambiguation:</strong> {workData.disambiguation}
            </p>
          )}

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
    </div>
  );
};

export default TrackMusicBrainzData;
