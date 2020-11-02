import { fetchCurrentTrack, fetchSongInfo } from "./fetchData";
import { useEffect, useState } from "react";

export default function useSongData(accessToken) {
  const [songData, setSongData] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [releaseIndex, setReleaseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const currentTrackName = currentTrack && currentTrack.name;

  // fetches current track info every 5 seconds
  useEffect(() => {
    if (accessToken) {
      fetchCurrentTrack(accessToken, setCurrentTrack, setErrorMessage);
      setInterval(() => {
        fetchCurrentTrack(accessToken, setCurrentTrack, setErrorMessage);
      }, 5000);
    }
  }, [accessToken]);

  // fetches song details when track changes
  useEffect(() => {
    if (currentTrackName) {
      setSongData(null);
      fetchSongInfo(
        accessToken,
        currentTrack,
        songData,
        setSongData,
        releaseIndex
      );
    }
  }, [currentTrackName, releaseIndex]);

  // resets release index when new track is loaded
  useEffect(() => {
    setReleaseIndex(0);
  }, [currentTrackName]);

  function skipReleaseIndex() {
    releaseIndex < songData.releasesCount - 1
      ? setReleaseIndex(releaseIndex + 1)
      : setReleaseIndex(0);
  }

  return [songData, currentTrack, releaseIndex, errorMessage, skipReleaseIndex];
}
