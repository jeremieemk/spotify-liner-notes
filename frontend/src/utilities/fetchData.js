import Discojs from "discojs";

export function fetchCurrentTrack(
  accessToken,
  setCurrentTrack,
  setErrorMessage
) {
  const nowPlayingApiUrl = "https://api.spotify.com/v1/me/player";
  fetch(nowPlayingApiUrl, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => {
      if (response.status === 204 || response.status === 401) {
        setErrorMessage(response.status);
      } else {
        setErrorMessage(null);
        return response.json();
      }
    })
    .then((data) => {
      setCurrentTrack(data.item);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fetchSpotifyAlbumData(currentTrack,
  spotifyAlbumData,
  accessToken) {
  return new Promise((resolve) => {
    const currentAlbumApiUrl =
    "https://api.spotify.com/v1/albums/" + currentTrack.album.id;
  fetch(currentAlbumApiUrl, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      spotifyAlbumData = data;
      resolve(spotifyAlbumData)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  )  
}

function searchDiscogsDatabase(
  dicogsApi,
  currentTrack,
  releasesCount,
  discogsAlbumId,
  releaseIndex,
  songData,
  setSongData,
  discogsArtistData,
  spotifyAlbumData,
  discogsAlbumData,
  discogsReleaseData,
) {
  return new Promise((resolve, reject) => {
  // removes parenthesis and what's inside
  const regex = /\s*\([^)]*\)/g;

  const cleanTrackName = currentTrack.name.includes("-") ?
      currentTrack.name
            .replace(regex, "")
            .replaceAll("&", "")
            .substring(0, currentTrack.name.indexOf("-")):
      currentTrack.name
            .replace(regex, "")
            .replaceAll("&", "")

  const cleanArtistName = currentTrack.artists[0].name.replaceAll("&", "and")

  console.log(cleanArtistName, cleanTrackName) 

  dicogsApi
    .searchDatabase({
      // search uses only the first word of the artist name
      // artist: spotifyTrackData.artists[0].name.replace(/ .*/, ""),
      artist: cleanArtistName,
      track: cleanTrackName,
      type: "release",
    })
    .then((data) => {
      console.log("discogs api data", data)
      // checks if discogs search brings any result
      if (data.results.length > 0) {
        // gets the oldest release of the list of results
        const filteredList = data.results.filter((release) =>
          release.hasOwnProperty("year")
        );
        
        releasesCount = filteredList.length;
        if (filteredList.length === 0) {
          discogsReleaseData = data.results[0];
        } else {
          const orderedList = filteredList.sort(
            (a, b) => parseInt(a.year) - parseInt(b.year)
          );
          discogsReleaseData = orderedList[releaseIndex];
        }
        const result = [discogsReleaseData, releasesCount]
        resolve(result)
      } else {
        setSongData({
          ...songData,
          spotifyAlbumData: spotifyAlbumData,
          discogsAlbumData: discogsAlbumData,
          discogsArtistData: discogsArtistData,
        });
      }
    });



  } )
  
}

export function fetchSongInfo(
  accessToken,
  currentTrack,
  songData,
  setSongData,
  releaseIndex
) {
  const dicogsApi = new Discojs({
    userToken: process.env.REACT_APP_DISCOGS_KEY,
  });
  let spotifyAlbumData = null;
  let discogsAlbumData = null;
  let discogsArtistData = null;
  let discogsAlbumId = null;
  let discogsArtistId = null;
  let discogsReleaseData = null
  let releasesCount = 0

  fetchSpotifyAlbumData(currentTrack, spotifyAlbumData, accessToken)
    .then((spotifyAlbumData) => {
      searchDiscogsDatabase(
        dicogsApi,
        currentTrack,
        releasesCount,
        discogsAlbumId,
        releaseIndex,
        songData,
        setSongData,
        discogsArtistData,
        spotifyAlbumData,
        discogsAlbumData,
        spotifyAlbumData
      ).then((response) => {
        discogsReleaseData = response[0]
        discogsAlbumId = response[0].id
        releasesCount = response[1]
        discogsAlbumId &&
          dicogsApi
            .getRelease(discogsAlbumId)
            .then((data) => {
              discogsAlbumData = data;
              discogsArtistId = data.artists[0].id;
              return discogsArtistId;
            })
            .then((discogsArtistId) => {
              discogsArtistId &&
                dicogsApi.getArtist(discogsArtistId).then((data) => {
                  discogsArtistData = data;
                  setSongData({
                    ...songData,
                    spotifyAlbumData: spotifyAlbumData,
                    discogsAlbumData: discogsAlbumData,
                    discogsArtistData: discogsArtistData,
                    releasesCount: releasesCount,
                    discogsReleaseData: discogsReleaseData
                  });
                });
            });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
