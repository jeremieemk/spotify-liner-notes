import Discojs from "discojs";

export function fetchCurrentTrack(accessToken, setCurrentTrack) {
  const nowPlayingApiUrl = "https://api.spotify.com/v1/me/player";
  fetch(nowPlayingApiUrl, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      setCurrentTrack(data.item);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function fetchSongInfo(
  accessToken,
  currentTrack,
  songData,
  setSongData,
  releaseIndex
) {
  const dicogsApi = new Discojs({
    userToken: "qICsaNYfZQFfkMlwfWDNOlCpmBXgdcWBgvsKjJhV",
  });
  console.log("gros fetch");
  let spotifyAlbumData = null;
  let discogsAlbumData = null;
  let discogsArtistData = null;
  let discogsAlbumId = null;
  let discogsArtistId = null;
  let releasesCount = 0;
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
    })
    .then(() => {
      const regex = /\s*\([^)]*\)/g;
      dicogsApi
        .searchDatabase({
          // search uses only the first word of the artist name
          // artist: spotifyTrackData.artists[0].name.replace(/ .*/, ""),
          artist: currentTrack.artists[0].name,
          track: currentTrack.name,
          // removes parenthesis and what's inside
          // .replace(regex, "")
          // .substring(0, currentTrack.name.indexOf("-")),
          type: "release",
        })
        .then((data) => {
          // checks if discogs search brings any result
          if (data.results.length > 0) {
            // gets the oldest release of the list of results
            const filteredList = data.results.filter((release) =>
              release.hasOwnProperty("year")
            );
            console.log("filteredList", filteredList);
            releasesCount = filteredList.length;
            if (filteredList.length === 0) {
              discogsAlbumId = data.results[0].id;
            } else {
              const orderedList = filteredList.sort(
                (a, b) => parseInt(a.year) - parseInt(b.year)
              );
              discogsAlbumId = orderedList[releaseIndex].id;
            }
          } else {
            setSongData({
              ...songData,
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
                      ...songData,
                      spotifyAlbumData: spotifyAlbumData,
                      discogsAlbumData: discogsAlbumData,
                      discogsArtistData: discogsArtistData,
                      releasesCount: releasesCount,
                    });
                  });
              });
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}
