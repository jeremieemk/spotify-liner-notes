import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import queryString from "query-string";

function App() {
  const [data, setData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  useEffect(() => {
    accessToken &&
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        });
  }, [accessToken]);

  function handleSignInClick() {
    window.location = "https://spotify-labels-backend.herokuapp.com/login";
  }
  return (
    <div className="App">
      {!accessToken && (
        <button onClick={handleSignInClick}>Sign in with Spotify</button>
      )}
      {accessToken && (
        <h2>
          Hi {data && data.display_name}, you have{" "}
          {data && data.followers.total} followers on Spotify
        </h2>
      )}
    </div>
  );
}

export default App;
