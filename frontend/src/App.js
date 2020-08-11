import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import queryString from "query-string";
import styled from "styled-components";

function App() {
  const [data, setData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  useEffect(() => {
    accessToken &&
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        });
  }, [accessToken]);

  function handleSignInClick() {
    window.location = "https://spotify-labels-backend.herokuapp.com/login";
  }
  return (
    <Container className="App">
      {!accessToken && (
        <Button onClick={handleSignInClick}>Sign in with Spotify</Button>
      )}
      {accessToken && (
        <h2>
          Hi {data && data.display_name}, you have{" "}
          {data && data.followers.total} followers on Spotify
        </h2>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  background-color: rgb(29, 185, 84);
  color: rgb(255, 255, 255);
  font-family: Circular, Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 12px;
  padding-bottom: 9px;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 11px;
  border-radius: 20px;
  cursor: pointer;
  margin: 2rem 0;
`;

export default App;
