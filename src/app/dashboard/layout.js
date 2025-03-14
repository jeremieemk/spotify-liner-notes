"use client";

import { AuthProvider } from "../context/AuthContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { SongDataProvider } from "../context/SongDataContext";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <SongDataProvider>
        <PlaybackProvider>{children}</PlaybackProvider>
      </SongDataProvider>
    </AuthProvider>
  );
}
