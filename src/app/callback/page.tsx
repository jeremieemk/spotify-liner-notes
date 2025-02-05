"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial: { [key: string]: string }, item) => {
        const parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    if (hash.access_token) {
      localStorage.setItem("spotify_access_token", hash.access_token);
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Authenticating...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
