const rateInput = document.getElementById('voiceRate');
const rateLabel = document.getElementById('rateLabel');
const isEnabledInput = document.getElementById('isEnabled');
const testBtn = document.getElementById('testBtn');
const testText = document.getElementById('testText');

// 초기 설정값 로드
chrome.storage.local.get(['voiceRate', 'isEnabled'], (data) => {
  const rate = data.voiceRate || 1.0;
  rateInput.value = rate;
  rateLabel.innerText = rate.toFixed(1);
  isEnabledInput.checked = data.isEnabled !== false;
});

// 속도 변경 시 저장
rateInput.addEventListener('input', () => {
  const rate = parseFloat(rateInput.value);
  rateLabel.innerText = rate.toFixed(1);
  chrome.storage.local.set({ voiceRate: rate });
});

// 활성화 상태 변경 시 저장
isEnabledInput.addEventListener('change', () => {
  chrome.storage.local.set({ isEnabled: isEnabledInput.checked });
});

// 넷플릭스 자막 메시지를 받으면 입력창 업데이트
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "SPEAK_SUBTITLE") {
    testText.value = request.text;
    console.log("[Popup] 입력창 업데이트:", request.text);
  }
});

// 속도 조절 테스트 버튼 로직
testBtn.addEventListener('click', () => {
  const text = testText.value;
  const rate = parseFloat(rateInput.value);
  // 백그라운드와 동일한 엔진으로 테스트 실행
  chrome.tts.speak(text, { lang: 'ko-KR', rate: rate, enqueue: false });
});