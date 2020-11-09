import { useEffect, useState } from "react";
import queryString from "query-string";

export default function useAccessToken() {
  const [accessToken, setAccessToken] = useState(null);
  
  useEffect(() => {
    const token = window.location.hash.substr(1).split('&')[0].split("=")[1]
    if (token) {
      setAccessToken(token)
    }
  }, []); 

  return accessToken;
}

