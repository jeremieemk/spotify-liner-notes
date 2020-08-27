import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

import bentonsansregular from "./fonts/bentonsansregular.otf";
import bentonsansblack from "./fonts/bentonsansblack.otf";
import bentonsansbook from "./fonts/bentonsansbook.otf";
import bentonsansmedium from "./fonts/bentonsansmedium.otf";
import bentonsansbold from "./fonts/bentonsansbold.otf";

export const GlobalStyle = createGlobalStyle`
 @font-face {
    font-family: regular;
    src: local('bentonsansregular'),  url(${bentonsansregular});
}
@font-face {
    font-family: black;
    src: local('bentonsansblack'),  url(${bentonsansblack});
}
@font-face {
    font-family: book;
    src: local('bentonsansbook'),  url(${bentonsansbook});
}
@font-face {
    font-family: medium;
    src: local('bentonsansmedium'),  url(${bentonsansmedium});
}
@font-face {
    font-family: bold;
    src: local('bentonsansbold'),  url(${bentonsansbold});
}
  body {
    margin: 0;
    padding: 0;
    font-family: regular;
    box-sizing: border-box
  }
`;

export const Button = styled.div`
  background-color: rgb(229, 255, 240);
  border-radius: 12px;
  padding: 22.5px 40.5px;
  color: rgb(34, 34, 34);

  cursor: pointer;
  &:hover {
    background-color: rgb(245, 245, 245);
    box-shadow: rgb(34, 34, 34) 2px 2px 0px 0px;
  }
  font-family: medium;
  border: 2px solid black;
`;
