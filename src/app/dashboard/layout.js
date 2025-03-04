"use client";

import { AuthProvider } from "../context/AuthContext";
import { SpotifyProvider } from "../context/SpotifyContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { MusicDataProvider } from "../context/MusicDataContext";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <PlaybackProvider>
          <MusicDataProvider>
            {children}
          </MusicDataProvider>
        </PlaybackProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
