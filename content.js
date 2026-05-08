let lastText = "";

const observer = new MutationObserver((mutations, obs) => {
  // 넷플릭스 자막 요소를 더 포괄적으로 탐색
  const subtitleNode = document.querySelector('.player-timedtext') || 
                       document.querySelector('.watch-video--timed-text-container');
  
  if (subtitleNode) {
    // innerText는 <br>이나 블록 엘리먼트에 의한 줄바꿈을 \n으로 인식합니다.
    // 1. 줄바꿈으로 분리 2. 앞뒤 공백 및 대화 구분용 대시(-) 제거
    const lines = (subtitleNode.innerText || subtitleNode.textContent)
      .split('\n')
      .map(line => line.trim().replace(/^[-\s]+/, ''))
      .filter(line => line.length > 0);

    // 3. 줄바꿈이 있으면 쉼표로 연결, 4. 물음표 뒤에 쉼표 2개 추가
    let currentText = lines.join(', ');
    currentText = currentText.replace(/\?/g, '?,,').trim();
    
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