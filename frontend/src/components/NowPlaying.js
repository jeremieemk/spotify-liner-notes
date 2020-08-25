import React from "react";
import styled from "styled-components";

export default function NowPlaying(props) {
  console.log("props", props);
  function addComa(i) {
    return (
      props.songData.spotifyTrackData.artists.length > 1 &&
      i < props.songData.spotifyTrackData.artists.length - 1
    );
  }

  const releaseDate =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.year
      ? props.songData.discogsAlbumData.year
      : props.songData.spotifyTrackData.album.release_date.substring(0, 4);

  const label =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.labels
      ? props.songData.discogsAlbumData.labels[0].name
      : props.songData.spotifyAlbumData.label;

  const album =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.title
      ? props.songData.discogsAlbumData.title
      : props.songData.spotifyAlbumData.name;

  const albumCover = props.songData.discogsAlbumData
    ? props.songData.discogsAlbumData.images[0].uri
    : props.songData.spotifyTrackData.album.images[0].url;

  const albumType = props.songData.discogsAlbumData
    ? ""
    : "the " + props.songData.spotifyAlbumData.album_type;

  const tracklistItem =
    props.songData.discogsAlbumData &&
    props.songData.discogsAlbumData.tracklist.find(
      (track) => track.title === props.songData.spotifyTrackData.name
    );

  const trackCredits = tracklistItem && tracklistItem.extraartists;

  return (
    <Container>
      <img src={albumCover} alt="" />
      <h1>
        {props.songData.spotifyTrackData.artists.map((artist, i) => (
          <span>
            {artist.name}
            {addComa(i) && `, `}
          </span>
        ))}
      </h1>
      <h2>"{props.songData.spotifyTrackData.name}"</h2>
      <h2>
        from {albumType} "{album}"
      </h2>
      <h2>
        {label} {"("}
        {releaseDate}
        {")"}
      </h2>
      <h2>About {props.songData.spotifyTrackData.artists[0].name}</h2>
      <p>
        {props.songData.discogsArtistData &&
          props.songData.discogsArtistData.profile}
      </p>
      {trackCredits && (
        <>
          <h2>Track Credits</h2>
          <ul>
            {trackCredits.map((artist) => {
              return (
                <div>
                  <strong>
                    {artist.role}
                    {": "}
                  </strong>
                  <span>{artist.name}</span>
                </div>
              );
            })}
          </ul>
        </>
      )}
      {props.songData.discogsAlbumData.extraartists && (
        <>
          <h2>Record Credits</h2>
          <ul>
            {props.songData.discogsAlbumData.extraartists.map((artist) => {
              return (
                <div>
                  <strong>
                    {artist.role}
                    {": "}
                  </strong>
                  <span>{artist.name}</span>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </Container>
  );
}

const Container = styled.div``;
