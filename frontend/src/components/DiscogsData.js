import React from "react";
import styled from "styled-components";
import { Button } from "../globalStyles.js";

export default function DiscogsData(props) {
  const { currentTrack, songData, releaseIndex, skipReleaseIndex, discogsReleaseData } = props;
  console.log(songData.discogsReleaseData)
  function renderFormats() {
    return (
      <div className="formats-container">
        
          {songData.discogsReleaseData.format.map((format, i) => (
            <h4 className="formats">
            <span>
              {format}
              {i > songData.discogsAlbumData.format - 1 && ", "}
            </span>
            </h4>
          ))}
        
        <h4 className="formats country">
            <span>{songData.discogsReleaseData.country}</span>
        </h4>
      </div>
    );
  }

  function renderMoreReleasesButton() {
    if (songData.releasesCount > 1) {
      return (
        <Button className="more-releases" onClick={skipReleaseIndex}>
          {" "}
          More releases of this track
          <span>
            ({releaseIndex + 1}
            {"/"}
            {songData.releasesCount})
          </span>
        </Button>
      );
    }
  }

  function renderArtistDetails() {
    if (
      songData.discogsArtistData &&
      songData.discogsArtistData.profile != ""
    ) {
      const bio = songData.discogsArtistData.profile
        .replaceAll("[l=", "")
        .replaceAll("]", "")
        .replaceAll("[m=", "")
        .replaceAll("[a=", "");
      return (
        <>
          <h2>About {currentTrack.artists[0].name}</h2>
          {bio}
        </>
      );
    }
  }

  function renderTrackCredits() {
    const tracklistItem = songData.discogsAlbumData.tracklist.find(
      (track) => track.title === currentTrack.name
    );
    const trackCredits = tracklistItem && tracklistItem.extraartists;
    if (trackCredits) {
      return (
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
      );
    }
  }

  function renderTracklist() {
    return (
      <>
        <h2>Record Tracklist</h2>
        <ul>
          {songData.discogsAlbumData.tracklist.map((track) => {
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
    );
  }

  function renderAlbumCredits() {
    if (songData.discogsAlbumData.extraartists.length > 0) {
      return (
        <>
          <h2>Record Credits</h2>
          <ul>
            {songData.discogsAlbumData.extraartists.map((artist) => {
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
      );
    }
  }
  return (
    <Container>
      {renderFormats()}
      {renderMoreReleasesButton()}
      {renderArtistDetails()}
      {renderTrackCredits()}
      {renderTracklist()}
      {renderAlbumCredits()}
    </Container>
  );
}

const Container = styled.div`
  .formats-container{
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    .formats {
      border: solid black 2px;
      padding: 3px 9px;
      border-radius: 5px;
      width: fit-content;
      margin-left: 0.5rem;
      margin-block-start: 0;
      margin-block-end: 0;
      background-color: rgb(229, 255, 240);
    }
    .country {
      background-color: #fbf2b8;
    }
  }
`;
