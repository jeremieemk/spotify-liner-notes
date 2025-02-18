"use client";

import { useState, useEffect } from "react";

export function useMusicBrainzData({ artist, song, album }) {
  const [musicBrainzData, setMusicBrainzData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMusicBrainzData() {
      if (!artist || !song) return;

      setLoading(true);
      setError(null);

      try {
        // 1) Try a refined query: look for official recordings on the specified album
        let searchQuery = encodeURIComponent(
          `recording:"${song}" AND artist:"${artist}" AND release:"${album}" AND status:official`
        );

        let recordingSearchResponse = await fetch(
          `https://musicbrainz.org/ws/2/recording/?query=${searchQuery}&fmt=json`,
          {
            headers: {
              "User-Agent": "my-app/1.0.0 (myemail@example.com)",
            },
          }
        );
        let recordingSearchData = await recordingSearchResponse.json();

        // 2) If we didn’t find anything, fall back to a simpler query
        if (!recordingSearchData.recordings?.length) {
          searchQuery = encodeURIComponent(
            `recording:"${song}" AND artist:"${artist}"`
          );
          recordingSearchResponse = await fetch(
            `https://musicbrainz.org/ws/2/recording/?query=${searchQuery}&fmt=json`,
            {
              headers: {
                "User-Agent": "my-app/1.0.0 (myemail@example.com)",
              },
            }
          );
          recordingSearchData = await recordingSearchResponse.json();
        }

        // 3) Pick the best match from the array of recordings
        let detailedRecordingData = null;
        if (recordingSearchData?.recordings?.length) {
          // Try to find a non-live, official match if possible
          let chosenRecording = recordingSearchData.recordings.find((rec) => {
            const isLive = (rec.disambiguation || "").toLowerCase().includes("live");
            const hasOfficialRelease = rec.releases?.some(
              (r) => r.status && r.status.toLowerCase() === "official"
            );
            return !isLive && hasOfficialRelease;
          });

          // Fallback to the first if no “best match”
          if (!chosenRecording) {
            chosenRecording = recordingSearchData.recordings[0];
          }

          // Now fetch detailed info for that chosen recording
          const detailedResponse = await fetch(
            `https://musicbrainz.org/ws/2/recording/${chosenRecording.id}?inc=artists+artist-credits+work-rels+work-level-rels+artist-rels+label-rels+instrument-rels+url-rels+releases&fmt=json`,
            {
              headers: {
                "User-Agent": "my-app/1.0.0 (myemail@example.com)",
              },
            }
          );
          detailedRecordingData = await detailedResponse.json();
        }

        // 4) Optionally fetch release-level data (same idea)
        let detailedReleaseData = null;
        if (album) {
          const releaseSearchQuery = encodeURIComponent(
            `release:"${album}" AND artist:"${artist}"`
          );
          const releaseSearchResponse = await fetch(
            `https://musicbrainz.org/ws/2/release/?query=${releaseSearchQuery}&fmt=json`,
            {
              headers: {
                "User-Agent": "my-app/1.0.0 (myemail@example.com)",
              },
            }
          );
          const releaseSearchData = await releaseSearchResponse.json();

          if (releaseSearchData?.releases?.length) {
            // Pick an official release if possible
            let chosenRelease = releaseSearchData.releases.find(
              (r) => r.status && r.status.toLowerCase() === "official"
            );
            if (!chosenRelease) {
              chosenRelease = releaseSearchData.releases[0];
            }

            const detailedResponse = await fetch(
              `https://musicbrainz.org/ws/2/release/${chosenRelease.id}?inc=artists+artist-credits+work-rels+recording-level-rels+work-level-rels+artist-rels+label-rels+instrument-rels+url-rels&fmt=json`,
              {
                headers: {
                  "User-Agent": "my-app/1.0.0 (myemail@example.com)",
                },
              }
            );
            detailedReleaseData = await detailedResponse.json();
          }
        }

        // 5) If we have neither a detailed release nor a recording, show error
        if (!detailedReleaseData && !detailedRecordingData) {
          setError("No matching recording found");
        } else {
          setMusicBrainzData({
            recording: detailedRecordingData,
            release: detailedReleaseData,
          });
        }
      } catch (err) {
        console.error("MusicBrainz API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Respect rate-limiting with a 1-second delay
    const timeoutId = setTimeout(() => {
      if (artist && song) {
        fetchMusicBrainzData();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [artist, song, album]);

  return { musicBrainzData, loading, error };
}
