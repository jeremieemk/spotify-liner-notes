import React from "react";
import styled from "styled-components";

function AlbumsList(props) {
  console.log(props);
  return (
    <Container>
      {props.albums.map((a) => (
        <AlbumCover
          key={a.album.id}
          src={a.album.images[0].url}
          alt={a.album.name}
        />
      ))}
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const AlbumCover = styled.img`
  width: 25%;
`;

export default AlbumsList;
