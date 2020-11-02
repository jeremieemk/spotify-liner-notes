import { useEffect, useState } from "react";
import queryString from "query-string";

export default function useAccessToken() {
  const [accessToken, setAccessToken] = useState(null);

  // extracts token from url
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    setAccessToken(parsed.access_token);
  }, [window.location]);

  return accessToken;
}
