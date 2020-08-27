import React, { useEffect, useState } from "react";

import queryString from "query-string";

import { fetchCurrentTrack, fetchSongInfo } from "./utilities/fetchData";

import NowPlaying from "./components/NowPlaying";
import LandingPage from "./components/LandingPage";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [songData, setSongData] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [releaseIndex, setReleaseIndex] = useState(0);

  const currentTrackName = currentTrack && currentTrack.name;
  // extracts token from url
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  // fetches current track info every 5 seconds
  useEffect(() => {
    if (accessToken) {
      fetchCurrentTrack(accessToken, setCurrentTrack);
      setInterval(() => {
        fetchCurrentTrack(accessToken, setCurrentTrack);
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

  useEffect(() => {
    setReleaseIndex(0);
  }, [currentTrackName]);

  function skipReleaseIndex() {
    releaseIndex < songData.releasesCount - 1
      ? setReleaseIndex(releaseIndex + 1)
      : setReleaseIndex(0);
  }

  function handleSignInClick() {
    window.location = "http://localhost:8888/login";
  }
  return (
    <div className="App">
      {!accessToken && <LandingPage handleSignInClick={handleSignInClick} />}
      {songData ? (
        <div>
          <NowPlaying
            currentTrack={currentTrack}
            skipReleaseIndex={skipReleaseIndex}
            releaseIndex={releaseIndex}
            songData={songData}
          />
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default App;
