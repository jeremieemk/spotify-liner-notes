import React, { useEffect, useState } from "react";

import queryString from "query-string";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { fetchAlbums } from "./actions/spotifyActions";
import AlbumsList from "./components/AlbumsList";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  function fetchData() {
    let apiUrl = "https://api.spotify.com/v1/me/albums?&limit=50";
    let albums = [];
    function apiCall(url, albums) {
      Promise.all([
        fetch(url, {
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
          albums.push(...data[0].items);
          if (data[0].next) {
            apiCall(data[0].next, albums);
          } else {
            dispatch(fetchAlbums(albums));
          }
        })
        .catch(function (error) {
          // if there's an error, log it
          console.log(error);
        });
    }
    apiCall(apiUrl, albums);
  }

  function handleSignInClick() {
    window.location = "http://localhost:8888/login";
  }
  return (
    <Container className="App">
      {!accessToken && (
        <Button onClick={handleSignInClick}>Sign in with Spotify</Button>
      )}
      {accessToken && <AlbumsList />}
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
