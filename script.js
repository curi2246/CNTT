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

  const cursor = document.createElement("span");
  cursor.className = "cursor";

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

  if (sigil) {
    sigil.addEventListener("click", () => {
      sigil.style.textShadow = "0 0 30px red";
    });
  }

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


function printToTerminal(text) {
  const terminal = document.getElementById("terminal-text");
  const p = document.createElement("p");
  p.textContent = text;
  terminal.appendChild(p);
}


document.querySelectorAll(".folder").forEach(folder => {
  folder.addEventListener("click", () => {
    const key = folder.dataset.folder;
    const list = document.querySelector(`.file-list[data-files="${key}"]`);

    if (list.childElementCount > 0) {
      list.innerHTML = "";
      return;
    }

    Object.keys(fileSystem[key]).forEach(name => {
      const file = document.createElement("div");
      file.className = "file";
      file.textContent = "📄 " + name;

      file.addEventListener("click", () => {
  openFileScreen(name, fileSystem[key][name]);
});


      list.appendChild(file);
    });
  });
});

function openFileScreen(fileName, content) {
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("file-screen").classList.remove("hidden");

  const title = document.getElementById("file-title");
  const text = document.getElementById("file-text");

  title.textContent = "FILE: " + fileName;
  text.innerHTML = "";

  // 환영 문구 먼저
  const welcome = document.createElement("p");
  welcome.textContent = "> 환영합니다. 기록 열람을 시작합니다.";
  text.appendChild(welcome);

  // 파일 내용
  const body = document.createElement("p");
  body.textContent = content;
  text.appendChild(body);
}

document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("file-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
});

const PASSWORD = "1234"; // 원하는 비밀번호로 변경 가능

const authScreen = document.getElementById("auth-screen");
const mainScreen = document.getElementById("main-screen");
const passwordInput = document.getElementById("password-input");
const authMessage = document.getElementById("auth-message");

passwordInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (passwordInput.value === PASSWORD) {
    authMessage.textContent = "> 인증 성공. 시스템에 접속합니다...";
    
    setTimeout(() => {
      authScreen.classList.add("hidden");
      mainScreen.classList.remove("hidden");
    }, 1000);

  } else {
    authMessage.textContent = "> 인증 실패. 접근이 거부되었습니다.";
    passwordInput.value = "";
  }
});
