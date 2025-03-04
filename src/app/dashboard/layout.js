"use client";

import { SpotifyProvider } from "../context/SpotifyContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { MusicDataProvider } from "../context/MusicDataContext";

export default function DashboardLayout({ children }) {
  return (
    <SpotifyProvider>
      <PlaybackProvider>
        <MusicDataProvider>
          {children}
        </MusicDataProvider>
      </PlaybackProvider>
    </SpotifyProvider>
  );
}
