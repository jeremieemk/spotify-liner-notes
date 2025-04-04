"use client";

import React from "react";
import { usePlayback } from "../../context/PlaybackContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CommentarySettings() {
  const { autoPlayCommentary, setAutoPlayCommentary } = usePlayback();

  return (
    <div className="flex  items-center space-x-2 w-full justify-end">
      <Label htmlFor="auto-play-commentary-switch">
        Auto-play commentary at end of song
      </Label>
      <Switch
        id="auto-play-commentary-switch"
        checked={autoPlayCommentary}
        onCheckedChange={(checked) => setAutoPlayCommentary(checked)}
        className="w-10 h-6 bg-gray-200 rounded-full"
      />
    </div>
  );
}
