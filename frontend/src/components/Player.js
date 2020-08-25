import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

function Player(props) {
  return (
    <SpotifyPlayer
      token="BQCSfI4JFCusYTFnj7js0vAC1o9crb4GiVRNbofek-cNYkA_0laLMuPbDbFzchyzjeO8mhq4xUffCLJAak4GFNOu2w84f6_IgnntwlcCW3-gpQZ-WHGICqbRpXx1Zuc8sKxcf8pPSShr5FtAkDqPV5SbE_SVh5qmRg"
      uris={["spotify:track:3UEnF6y5tyHVtMzldS3svp"]}
    />
  );
}

export default Player;
