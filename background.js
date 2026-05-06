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
    console.log("[SubtitleReader] TTS 재생 시작 - 속도:", rate);

    // 새로운 자막이 들어오면 이전 음성은 즉시 중단
    chrome.tts.stop();

    chrome.tts.speak(text, {
      lang: 'ko-KR',
      rate: rate,
      pitch: 1.1, // 음높이를 약간 높이면 의문문 처리가 더 자연스러워집니다.
      enqueue: true,
      onEvent: (event) => {
        if (event.type === 'error') {
          console.error("[SubtitleReader] TTS 에러:", event.errorMessage);
        }
      }
    });
  });
}