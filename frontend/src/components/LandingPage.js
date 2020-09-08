import React from "react";
import styled from "styled-components";
import AlbumCover from "../img/dirty.jpg";
import { Button } from "../globalStyles.js";
import { ArrowRightIcon } from "react-line-awesome";

export default function LandingPage(props) {
  return (
    <Container>
      <h1>
        <strong>NowPlaying</strong> brings you detailed information (credits,
        dates, cover art) about the songs you are currently streaming on
        Spotify.
      </h1>
      <img src={AlbumCover} alt="album-cover" />
      <h2>
        <span>
          <ArrowRightIcon /> How does it work?
        </span>
        <br />
        1. Play some music from your Spotify player (you'll need a Spotify
        premium account to use this app)
        <br />
        2. Log in to your Spotify account via the button below:
      </h2>

      <Button onClick={props.handleSignInClick}>Log in to Spotify!</Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  width: 100%;
  @media (max-width: 801px) {
    height: auto;
  }
  img {
    height: 15rem;
    padding: 3rem 0 0;
  }
  h1 {
    font-family: bold;
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
    margin-block-start: 0;
    margin-block-end: 0;
    width: 60%;
    @media (max-width: 801px) {
      width: 80%;
      margin-top: 3rem;
    }
  }
  strong {
    color: #e47de9;
  }
  h2 {
    span {
      font-family: medium;
      font-size: 1rem;
      line-height: 1.8;
    }
    margin: 2rem 0;
    font-size: 0.8rem;
    width: 15rem;
    line-height: 1.55;
    font-family: book;
    @media (max-width: 801px) {
      margin-bottom: 3rem;
    }
  }
`;
