let lastText = "";

const observer = new MutationObserver((mutations, obs) => {
  // 넷플릭스 자막 요소를 더 포괄적으로 탐색
  const subtitleNode = document.querySelector('.player-timedtext') || 
                       document.querySelector('.watch-video--timed-text-container');
  
  if (subtitleNode) {
    // innerText는 <br>이나 블록 엘리먼트에 의한 줄바꿈을 \n으로 인식합니다.
    // 줄바꿈(\n)과 dash(-)를 찾아 쉼표로 바꾸고, 중복 쉼표와 공백을 정리합니다.
    const currentText = (subtitleNode.innerText || subtitleNode.textContent)
      .replace(/[\n-]/g, ', ')     // 줄바꿈과 대시를 쉼표로 변환
      .split(',')                  // 쉼표 기준으로 분리
      .map(t => t.trim())          // 각 문구 앞뒤 공백 제거
      .filter(t => t.length > 0)   // 빈 문구 제거
      .join(', ');                 // 다시 쉼표와 공백으로 연결
    
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