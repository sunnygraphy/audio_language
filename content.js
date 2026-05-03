let lastText = "";

const observer = new MutationObserver((mutations, obs) => {
  // 넷플릭스 자막 요소를 더 포괄적으로 탐색
  const subtitleNode = document.querySelector('.player-timedtext') || 
                       document.querySelector('.watch-video--timed-text-container');
  
  if (subtitleNode) {
    const currentText = subtitleNode.textContent.replace(/-/g, '').trim().replace(/\s+/g, ' ');
    
    if (currentText && currentText !== lastText && currentText.length > 0) {
      lastText = currentText;
      
      try {
        if (chrome.runtime?.id) {
          console.log("[SubtitleReader] 자막 감지됨:", currentText);
          chrome.runtime.sendMessage({ type: "SPEAK_SUBTITLE", text: currentText });
        }
      } catch (e) {
        console.log("[SubtitleReader] 연결이 끊겼습니다. 페이지를 새로고침하세요.");
        obs.disconnect(); // 고립된 컨텍스트에서 관찰 중단
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});