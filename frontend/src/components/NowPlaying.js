import React from "react";
import styled from "styled-components";
import { Button } from "../globalStyles.js";
import { ArrowRightIcon } from "react-line-awesome";
import ReactMarkdown from "react-markdown";

export default function NowPlaying(props) {
  console.log("props", props);
  function addComa(i) {
    return (
      props.currentTrack.artists.length > 1 &&
      i < props.currentTrack.artists.length - 1
    );
  }

  const releaseDate =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.year
      ? props.songData.discogsAlbumData.year
      : props.currentTrack.album.release_date.substring(0, 4);

  const label =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.labels
      ? props.songData.discogsAlbumData.labels[0].name
      : props.songData.spotifyAlbumData.label;

  const album =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.title
      ? props.songData.discogsAlbumData.title
      : props.songData.spotifyAlbumData.name;

  const albumCover =
    props.songData.discogsAlbumData && props.songData.discogsAlbumData.images
      ? props.songData.discogsAlbumData.images[0].uri
      : props.currentTrack.album.images[0].url;

  const albumType = props.songData.discogsAlbumData
    ? ""
    : "the " + props.songData.spotifyAlbumData.album_type;

  const tracklistItem =
    props.songData.discogsAlbumData &&
    props.songData.discogsAlbumData.tracklist.find(
      (track) => track.title === props.currentTrack.name
    );

  const trackCredits = tracklistItem && tracklistItem.extraartists;

  return (
    <Container>
      <div className="image-container">
        <img src={albumCover} alt="" />
      </div>
      <div className="infos-container">
        <h1>
          {props.currentTrack.artists.map((artist, i) => (
            <span>
              {artist.name}
              {addComa(i) && `, `}
            </span>
          ))}
        </h1>
        <h2 className="song-title">"{props.currentTrack.name}"</h2>
        <h2 className="record-label">
          <ArrowRightIcon /> from {albumType} "{album}" {" - "}
          {label} {"("}
          {releaseDate}
          {")"}
        </h2>
        {props.songData.discogsAlbumData && (
          <h4 className="formats">
            {props.songData.discogsAlbumData.formats.map((format, i) => (
              <span>
                {format.name}
                {i > props.songData.discogsAlbumData.formats - 1 && ", "}
              </span>
            ))}
          </h4>
        )}
        {props.songData.releasesCount > 1 && (
          <Button className="more-releases" onClick={props.skipReleaseIndex}>
            {" "}
            More Releases
            <span>
              ({props.releaseIndex + 1}
              {"/"}
              {props.songData.releasesCount})
            </span>
          </Button>
        )}
        {props.songData.discogsArtistData && (
          <>
            <h2>About {props.currentTrack.artists[0].name}</h2>
            <ReactMarkdown source={props.songData.discogsArtistData.profile} />
          </>
        )}
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
        {props.songData.discogsAlbumData && (
          <>
            <h2>Record Tracklist</h2>
            <ul>
              {props.songData.discogsAlbumData.tracklist.map((track) => {
                return (
                  <div>
                    <strong>
                      {track.position}
                      {" - "}
                    </strong>
                    <span>{track.title}</span>
                  </div>
                );
              })}
            </ul>
          </>
        )}
        {props.songData.discogsAlbumData &&
          props.songData.discogsAlbumData.extraartists.length && (
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
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;

  .image-container,
  .infos-container {
    padding: 2rem;
  }
  h1 {
    background-color: rgb(250, 199, 255);
    padding: 5px 10px;
    width: fit-content;
    font-family: medium;
    font-size: 2.3rem;
    letter-spacing: 4px;
  }
  .song-title {
    font-size: 2rem;
  }
  div {
    width: 50%;
  }
  img {
    width: 100%;
  }
  .record-label {
    font-size: 1.4rem;
  }
  .formats {
    border: solid black 2px;
    padding: 3px 9px;
    border-radius: 5px;
    width: fit-content;
  }
  .more-releases {
    width: fit-content;
    span {
      font-family: regular;
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }
  }
`;
