/**
 * Speech synthesis utility for Gujarati text-to-speech.
 * Falls back gracefully if voice synthesis is unavailable.
 */
export const speakGujarati = (text, rate = 0.85) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const cleanText = text.replace(/[^\u0A80-\u0AFF\s0-9A-Za-z.,!?]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText || text);
  utterance.rate = rate;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const gujaratiVoice = voices.find(v => v.lang === 'gu-IN' || v.lang === 'gu' || v.name.toLowerCase().includes('gujarati'));
  const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.name.toLowerCase().includes('hindi'));

  if (gujaratiVoice) {
    utterance.voice = gujaratiVoice;
    utterance.lang = 'gu-IN';
  } else if (hindiVoice) {
    utterance.voice = hindiVoice;
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'gu-IN';
  }

  window.speechSynthesis.speak(utterance);
};
