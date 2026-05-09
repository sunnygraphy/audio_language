chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SPEAK_SUBTITLE") {
    console.log("[SubtitleReader] 자막 수신됨:", request.text);
    processSpeak(request.text);
  }
});

function processSpeak(text) {
  chrome.storage.local.get(["voiceRate", "isEnabled"], (data) => {
    // 설정이 없거나(undefined) true인 경우에만 재생
    const isEnabled = data.isEnabled !== false;
    if (!isEnabled) return;

    const rate = parseFloat(data.voiceRate) || 1.0;
    // TTS rate는 0.1에서 10.0 사이여야 합니다.
    const clampedRate = Math.max(0.1, Math.min(10.0, rate));

    console.log("[SubtitleReader] TTS 재생 시작 - 속도:", rate);

    // Google 한국어 음성을 명시적으로 검색하여 재생
    chrome.tts.getVoices((voices) => {
      const googleVoice = voices.find(v => v.lang === 'ko-KR' && v.voiceName.includes('Google'));
      
      chrome.tts.speak(text, {
        voiceName: googleVoice ? googleVoice.voiceName : null,
        lang: 'ko-KR',
        rate: clampedRate,
        pitch: 1.1, // 기존 설정 유지
        enqueue: true,
        onEvent: (event) => {
          if (event.type === 'error') {
            console.error("[SubtitleReader] TTS 에러:", event.errorMessage);
          }
        }
      });
    });
  });
}