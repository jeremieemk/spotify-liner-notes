import React from "react";
import styled from "styled-components";
import PuffLoader from "react-spinners/ClipLoader";
import { Heading } from "../globalStyles.js";

export default function Loader(props) {
  return (
    <Container>
      <Heading>NowLoading</Heading>
      <PuffLoader size={100} color={"#FAC7FF"} />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
