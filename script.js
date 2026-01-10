const lines = [
  "> 접속 승인. 환영합니다, 계약자님.",
  "> 데이터베이스 접근이 허가되어 기록을 열람합니다."
];

const terminal = document.getElementById("terminal-text");

let lineIndex = 0;
let charIndex = 0;
let currentP = null;

function typeLine() {
  if (lineIndex >= lines.length) return;

  // 줄이 시작될 때만 p 생성
  if (charIndex === 0) {
    currentP = document.createElement("p");
    terminal.appendChild(currentP);
  }

  const currentLine = lines[lineIndex];
  currentP.textContent += currentLine[charIndex];
  charIndex++;

  if (charIndex >= currentLine.length) {
    charIndex = 0;
    lineIndex++;
    setTimeout(typeLine, 600); // 다음 줄로
  } else {
    setTimeout(typeLine, 40); // 다음 글자
  }
}

typeLine();

const cursor = document.createElement("span");
cursor.className = "cursor";
terminal.appendChild(cursor);

const sigil = document.querySelector(".sigil");

sigil.addEventListener("click", () => {
  sigil.style.textShadow = "0 0 30px red";
});


document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading-screen");
  const mainScreen = document.querySelector(".screen");

  setTimeout(() => {
    loading.style.display = "none";
    mainScreen.classList.remove("hidden");
  }, 2200);
});
