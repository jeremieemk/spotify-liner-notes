"use client";

import { AuthProvider } from "../context/AuthContext";
import { SpotifyProvider } from "../context/SpotifyContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { SongDataProvider } from "../context/SongDataContext";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <PlaybackProvider>
          <SongDataProvider>
            {children}
          </SongDataProvider>
        </PlaybackProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
