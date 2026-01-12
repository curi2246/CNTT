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

  let p = terminal.children[lineIndex];
  if (!p) {
    p = document.createElement("p");
    terminal.appendChild(p);
    p.appendChild(cursor);
  }

  const currentLine = lines[lineIndex];
  p.textContent = currentLine.slice(0, charIndex + 1);

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

const fileSystem = {
  world: {
    "timeline.txt": "세계는 선택에 따라 여러 갈래로 분기된다...",
    "contracts.log": "기록된 계약자 수: nnnnn41423위험도: HIGH"
  },
  yokai: {
    "kitsune.txt": "어느 구슬을 지키기 위한 존재.",
    "sealed.txt": "[접근 거부] 권한이 부족한 정보입니다."
  }
};


const folders = document.querySelectorAll(".folder");

folders.forEach(folder => {
  folder.addEventListener("click", () => {
    const key = folder.dataset.folder;
    const files = fileSystem[key];

    printToTerminal(`> ${folder.textContent} OPENED`);
    printToTerminal("> FILE LIST:");

    Object.keys(files).forEach(name => {
      printToTerminal(" - " + name);
    });
  });
});

function printToTerminal(text) {
  const p = document.createElement("p");
  p.textContent = text;
  terminal.appendChild(p);
}
