import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import queryString from "query-string";
import styled from "styled-components";

import AlbumsList from "./components/AlbumsList";

function App() {
  const [spotifyData, setData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  useEffect(() => {
    if (accessToken) {
      Promise.all([
        fetch("https://api.spotify.com/v1/me/albums?limit=50", {
          headers: { Authorization: "Bearer " + accessToken },
        }),
      ])
        .then(function (responses) {
          // Get a JSON object from each of the responses
          return Promise.all(
            responses.map(function (response) {
              return response.json();
            })
          );
        })
        .then(function (data) {
          // Log the data to the console
          // You would do something with both sets of data here
          setData({ albums: data[0].items });
        })
        .catch(function (error) {
          // if there's an error, log it
          console.log(error);
        });
    }
  }, [accessToken]);

  function handleSignInClick() {
    window.location = "http://localhost:8888/login";
  }
  console.log(spotifyData);
  return (
    <Container className="App">
      {!accessToken && (
        <Button onClick={handleSignInClick}>Sign in with Spotify</Button>
      )}
      {spotifyData && <AlbumsList albums={spotifyData.albums} />}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  background-color: rgb(29, 185, 84);
  color: rgb(255, 255, 255);
  font-family: Circular, Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 12px;
  padding: 11px 32px;
  border-radius: 20px;
  cursor: pointer;
  margin: 2rem 0;
  &:hover {
    opacity: 0.8;
  }
`;

export default App;
