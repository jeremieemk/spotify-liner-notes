import React from "react";
import styled from "styled-components";
import { Heading } from "../globalStyles.js";
import { ArrowRightIcon, BroadcastTowerIcon } from "react-line-awesome";
import DiscogsData from "./DiscogsData";

export default function NowPlaying(props) {
  const { currentTrack, songData, releaseIndex, skipReleaseIndex } = props;
  const albumCover =
    songData.discogsAlbumData && songData.discogsAlbumData.images
      ? songData.discogsAlbumData.images[0].uri
      : currentTrack.album.images[0].url;

  function addComa(i) {
    return (
      currentTrack.artists.length > 1 && i < currentTrack.artists.length - 1
    );
  }
  function renderArtists() {
    return currentTrack.artists.map((artist, i) => (
      <span>
        {artist.name}
        {addComa(i) && `, `}
      </span>
    ));
  }

  function renderReleaseDetails() {
    const album =
      songData.discogsAlbumData && songData.discogsAlbumData.title
        ? songData.discogsAlbumData.title
        : songData.spotifyAlbumData.name;
    const albumType = songData.discogsAlbumData
      ? ""
      : "the " + songData.spotifyAlbumData.album_type;
    const releaseDate =
      songData.discogsAlbumData && songData.discogsAlbumData.year
        ? songData.discogsAlbumData.year
        : currentTrack.album.release_date.substring(0, 4);

    const label =
      songData.discogsAlbumData && songData.discogsAlbumData.labels
        ? songData.discogsAlbumData.labels[0].name
        : songData.spotifyAlbumData.label;
    return (
      <div>
        <ArrowRightIcon />
        from {albumType} "{album}" {" - "}
        {label} {"("}
        {releaseDate}
        {")"}
      </div>
    );
  }

  return (
    <Container>
      <div className="image-container">
        <img src={albumCover} alt="" />
      </div>
      <div className="infos-container">
        <Heading>{renderArtists()}</Heading>
        <h2 className="song-title">"{currentTrack.name}"</h2>
        <h2 className="record-label">{renderReleaseDetails()}</h2>
        {songData.discogsAlbumData ? (
          <DiscogsData
            currentTrack={currentTrack}
            skipReleaseIndex={skipReleaseIndex}
            releaseIndex={releaseIndex}
            songData={songData}
          />
        ) : (
          <h4>
            <BroadcastTowerIcon /> Sorry! we couldn't find more information on
            this track...
          </h4>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: 801px) {
    flex-direction: column;
  }
  .image-container,
  .infos-container {
    padding: 2rem;
    width: 50%;
    @media (max-width: 801px) {
      width: 100%;
    }
  }
  .song-title {
    font-size: 2rem;
  }
  img {
    width: 100%;
  }
  .record-label {
    font-size: 1.4rem;
    margin-bottom: 2rem;
  }
  .more-releases {
    width: fit-content;
    margin-bottom: 2rem;
    background-color: #83FFCD;
    span {
      font-family: regular;
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }
  }
`;
