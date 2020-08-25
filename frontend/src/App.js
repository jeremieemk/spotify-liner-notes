import React, { useEffect, useState } from "react";

import queryString from "query-string";
import styled from "styled-components";
import Discojs from "discojs";

import NowPlaying from "./components/NowPlaying";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  const dicogsApi = new Discojs({
    userToken: "qICsaNYfZQFfkMlwfWDNOlCpmBXgdcWBgvsKjJhV",
  });

  useEffect(() => {
    if (accessToken) {
      getCurrentTrack();
    }
  }, [accessToken]);

  //   useEffect(() => {
  //     if (currentTrack) {
  //       const currentAlbumApiUrl =
  //         "https://api.spotify.com/v1/albums/" + currentTrack.album.id;
  //       fetch(currentAlbumApiUrl, {
  //         headers: { Authorization: "Bearer " + accessToken },
  //       })
  //         .then((response) => {
  //           return response.json();
  //         })
  //         .then((data) => {
  //           setSpotifyApiAlbumData(data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //       console.log("finished");
  //       dicogsApi
  //         .searchDatabase({
  //           query: "The Comet Is Coming",

  //           type: "artist",
  //         })
  //         .then((data) => {
  //           console.log("discogs", data);
  //           setSpotifyApiAlbumData({ ...songData, discogsApiArtistData: data });
  //         })
  //         .catch((error) => {
  //           console.warn("Oops, something went wrong!", error);
  //         });
  //     }
  //   }, [currentTrack]);

  function getCurrentTrack() {
    let spotifyTrackData = null;
    let spotifyAlbumData = null;
    let discogsAlbumData = null;
    let discogsArtistData = null;
    let discogsAlbumId = null;
    let discogsArtistId = null;
    const nowPlayingApiUrl = "https://api.spotify.com/v1/me/player";
    fetch(nowPlayingApiUrl, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        spotifyTrackData = data.item;
        const currentAlbumApiUrl =
          "https://api.spotify.com/v1/albums/" + spotifyTrackData.album.id;
        return currentAlbumApiUrl;
      })
      .then((currentAlbumApiUrl) =>
        fetch(currentAlbumApiUrl, {
          headers: { Authorization: "Bearer " + accessToken },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            spotifyAlbumData = data;
          })
      )
      .then(() => {
        const regex = /\s*\([^)]*\)/g;
        dicogsApi
          .searchDatabase({
            artist: spotifyTrackData.artists[0].name,
            query: spotifyTrackData.name.replace(regex, ""),
            type: "release",
          })
          .then((data) => {
            console.log("discogs", data);
            // checks if discogs search brings any result
            if (data.results.length > 0) {
              // gets the oldest release of the list of results
              const filteredList = data.results.filter((release) =>
                release.hasOwnProperty("year")
              );
              if (filteredList.length === 0) {
                discogsAlbumId = data.results[0].id;
              } else {
                const orderedList = filteredList.sort(
                  (a, b) => parseInt(a.year) - parseInt(b.year)
                );
                discogsAlbumId = orderedList[0].id;
              }
            } else {
              setSongData({
                spotifyTrackData: spotifyTrackData,
                spotifyAlbumData: spotifyAlbumData,
                discogsAlbumData: discogsAlbumData,
                discogsArtistData: discogsArtistData,
              });
            }
            return discogsAlbumId;
          })
          .then((discogsAlbumId) => {
            discogsAlbumId &&
              dicogsApi
                .getRelease(discogsAlbumId)
                .then((data) => {
                  discogsAlbumData = data;

                  discogsArtistId = data.artists[0].id;
                  console.log("discogs album", data);
                  return discogsArtistId;
                })
                .then((discogsArtistId) => {
                  discogsArtistId &&
                    dicogsApi.getArtist(discogsArtistId).then((data) => {
                      discogsArtistData = data;
                      console.log("discogs artist", data);
                      setSongData({
                        spotifyTrackData: spotifyTrackData,
                        spotifyAlbumData: spotifyAlbumData,
                        discogsAlbumData: discogsAlbumData,
                        discogsArtistData: discogsArtistData,
                      });
                    });
                });
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleSignInClick() {
    window.location = "http://localhost:8888/login";
  }
  return (
    <Container className="App">
      {!accessToken && (
        <Button onClick={handleSignInClick}>Sign in with Spotify</Button>
      )}
      {accessToken && songData && (
        <div>
          <NowPlaying songData={songData} />
        </div>
      )}
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
