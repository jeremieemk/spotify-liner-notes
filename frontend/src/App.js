import React, { useEffect, useState } from "react";

import queryString from "query-string";

import { fetchCurrentTrack, fetchSongInfo } from "./utilities/fetchData";

import NowPlaying from "./components/NowPlaying";
import LandingPage from "./components/LandingPage";
import Loader from "./components/Loader";
import Error from "./components/Error";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [songData, setSongData] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [releaseIndex, setReleaseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const currentTrackName = currentTrack && currentTrack.name;
  // extracts token from url
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

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

  useEffect(() => {
    setReleaseIndex(0);
  }, [currentTrackName]);

  function skipReleaseIndex() {
    releaseIndex < songData.releasesCount - 1
      ? setReleaseIndex(releaseIndex + 1)
      : setReleaseIndex(0);
  }

  function handleSignInClick() {
    window.location =
      process.env.NODE_ENV === "production"
        ? "https://spotify-labels-backend.herokuapp.com/login"
        : "http://localhost:8888/login";
  }
  return (
    <div className="App">
      {!accessToken && <LandingPage handleSignInClick={handleSignInClick} />}
      {songData && (
        <div>
          <NowPlaying
            currentTrack={currentTrack}
            skipReleaseIndex={skipReleaseIndex}
            releaseIndex={releaseIndex}
            songData={songData}
          />
        </div>
      )}
      {accessToken && !songData && !errorMessage && (
        <div>
          <Loader />
        </div>
      )}
      {accessToken && errorMessage && <Error errorMessage={errorMessage} />}
    </div>
  );
}

export default App;
