document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal-text");
  const loading = document.getElementById("loading-screen");
  const main = document.getElementById("main-screen");
  const sigil = document.querySelector(".sigil");

  const lines = [
    "> 접속 승인. 환영합니다, 계약자님.",
    "> 데이터베이스 접근이 허가되어 기록을 열람합니다."
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) return;

    if (!terminal.children[lineIndex]) {
      const p = document.createElement("p");
      terminal.appendChild(p);
    }

    const currentLine = lines[lineIndex];
    terminal.children[lineIndex].textContent =
      currentLine.slice(0, charIndex + 1);

    charIndex++;

    if (charIndex === currentLine.length) {
      charIndex = 0;
      lineIndex++;
      setTimeout(typeLine, 600);
    } else {
      setTimeout(typeLine, 40);
    }
  }

  // cursor 생성
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  terminal.appendChild(cursor);

  // 시그일 클릭 이벤트
  if (sigil) {
    sigil.addEventListener("click", () => {
      sigil.style.textShadow = "0 0 30px red";
    });
  }

  // 2초 로딩 후 메인 화면 + 타이핑 시작
  setTimeout(() => {
    loading.classList.add("hidden");
    main.classList.remove("hidden");
    typeLine();
  }, 2000);
});
