import React from "react";

const ArtistBio = ({ bio }) => {
  const truncateBio = (text) => {
    if (!text) return "";

    const readMoreIndex = text.indexOf("<a href");
    if (readMoreIndex === -1) return text;

    return text.substring(0, readMoreIndex);
  };

  const processedBio = truncateBio(bio);
  const paragraphedBio = createParagraphs(processedBio);


  if (!paragraphedBio) {
    return null;
  }

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Artist Bio</h2>
      <div
        className="text-gray-300"
        dangerouslySetInnerHTML={{ __html: paragraphedBio }}
      />
    </div>
  );
};

export default ArtistBio;


const createParagraphs = (text) => {
    if (!text) return '';

    // Split into sentences (accounting for common abbreviations)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let paragraphs = [];
    let currentParagraph = [];
    let wordCount = 0;
    
    sentences.forEach(sentence => {
      const sentenceWords = sentence.trim().split(/\s+/).length;
      
      // Start new paragraph if:
      // 1. Current paragraph is getting too long (> ~50 words)
      // 2. Sentence contains transition words
      const hasTransition = /\b(born|in \d{4}|however|eventually|later|after|before|during|currently|recently)\b/i.test(sentence);
      
      if (wordCount > 100 || hasTransition) {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
          wordCount = 0;
        }
      }
      
      currentParagraph.push(sentence.trim());
      wordCount += sentenceWords;
    });
    
    // Add any remaining sentences
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }
    
    return paragraphs
      .map(p => `<p class="mb-2">${p}</p>`)
      .join('');
  };