let lastText = "";

const observer = new MutationObserver(() => {
  // 넷플릭스 자막 요소를 더 포괄적으로 탐색
  const subtitleNode = document.querySelector('.player-timedtext') || 
                       document.querySelector('.watch-video--timed-text-container');
  
  if (subtitleNode) {
    const currentText = subtitleNode.textContent.trim().replace(/\s+/g, ' ');
    
    if (currentText && currentText !== lastText && currentText.length > 0) {
      lastText = currentText;
      console.log("[SubtitleReader] 자막 감지됨:", currentText);
      // 백그라운드 엔진에 음성 재생 요청
      chrome.runtime.sendMessage({ type: "SPEAK_SUBTITLE", text: currentText });
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});