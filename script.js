const lines = [
  "> 접속 승인. 환영합니다, 계약자님.",
  "> 데이터베이스 접근이 허가되어 기록을 열람합니다."
];

const terminal = document.getElementById("terminal-text");
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

typeLine();
