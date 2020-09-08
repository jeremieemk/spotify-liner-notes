import React from "react";
import styled from "styled-components";
import { Heading } from "../globalStyles.js";

export default function Error(props) {
  let message = "";
  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://spotify-labels-backend.herokuapp.com/login"
      : "http://localhost:8888/login";

  switch (props.errorMessage) {
    case 204:
      message = (
        <Heading className="error-message">
          Oops... it looks like you are not currently streaming any music from
          Spotify. Play a song on Spotify to launch this app.
        </Heading>
      );
      break;
    case 401:
      message = (
        <Heading className="error-message">
          Oops... it looks like you have been disconnected from Spotify. Click{" "}
          <a href={redirectUrl}>here</a> to reconnect.
        </Heading>
      );
    default:
      break;
  }
  return <Container>{message}</Container>;
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .error-message {
    width: 60%;
    background: lightgrey;
    padding: 1rem;
    text-align: center;
  }
`;
