export const getPrompt = (artist, song, album, lyrics, credits) => {
  let prompt = `Tell me about the song "${song}" by ${artist} on the album ${album}. Write the following sections:
  (please not that the album name might be the same as the song name, if it is a single. If you wan't find any reference to the song or artist, just skip the following sections)
  - Release year and label
  - Notable aspects of the recording (include fun facts, trivia, or interesting stories about the recording process)
  - Background about the artist/band (include the city where the artist is from - if known - if it isn't know just don't mention it)
  - Known credits (include musicians, studios, engineers, songwriters, producers, etc.)
  `;

  // Only include lyrics analysis if lyrics exist.
  if (credits !== null) {
    prompt += `I fetched data from Discogs, here's what i found: ${credits}
  Integrate Discogs data in your answer.`;
  }

  // Only include lyrics analysis if lyrics exist.
  if (lyrics !== null) {
    prompt += `- Song meaning and lyrics analysis 
    (explain the meaning behind the words and add color to the lyrics. These are the lyrics: ${lyrics})`;
  }

  return prompt;
};
