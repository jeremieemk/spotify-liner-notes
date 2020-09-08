import React from "react";
import styled from "styled-components";
import { Button } from "../globalStyles.js";

export default function DiscogsData(props) {
  const { currentTrack, songData, releaseIndex, skipReleaseIndex } = props;
  function renderFormats() {
    return (
      <h4 className="formats">
        {songData.discogsAlbumData.formats.map((format, i) => (
          <span>
            {format.name}
            {i > songData.discogsAlbumData.formats - 1 && ", "}
          </span>
        ))}
      </h4>
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

const Container = styled.div``;
