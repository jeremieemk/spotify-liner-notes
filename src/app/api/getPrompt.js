export const getPrompt = (track, artist, album, lyrics) => {
  let prompt = `Tell me about the song "${track}" by ${artist} on the album ${album}. Write the following sections:
  - Release year and label
  - Notable aspects of the recording (include fun facts, trivia, or interesting stories about the recording process)
  - Known credits (include musicians, studios, engineers, songwriters, producers, etc.)
  - Background about the artist/band (include the city where the artist is from - if known)
  `;

  // Only include lyrics analysis if lyrics exist.
  if (lyrics !== null) {
    prompt += `- Song meaning and lyrics analysis 
    (explain the meaning behind the words and add color to the lyrics. These are the lyrics: ${lyrics})`;
  }

  return prompt;
};
