document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal-text");
  const loading = document.getElementById("loading-screen");
  const main = document.getElementById("main-screen");
  const sigil = document.querySelector(".sigil");

  const authScreen = document.getElementById("auth-screen");
  const passwordInput = document.getElementById("password-input");
  const authMessage = document.getElementById("auth-message");

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
    }

    p.textContent = lines[lineIndex].slice(0, charIndex + 1);
    p.appendChild(cursor);

    charIndex++;

    if (charIndex === lines[lineIndex].length) {
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

  // 로딩 → 인증 화면
  setTimeout(() => {
    if (loading) loading.classList.add("hidden");
    authScreen.classList.remove("hidden");
    passwordInput.focus();
  }, 2000);

  // 🔐 비밀번호 인증
  const PASSWORD = "1234";

  document.addEventListener("keydown", (e) => {
    if (authScreen.classList.contains("hidden")) return;
    if (e.key !== "Enter") return;

    if (passwordInput.value === PASSWORD) {
      authMessage.textContent = "> 인증 성공. 시스템에 접속합니다...";

      setTimeout(() => {
        authScreen.classList.add("hidden");
        main.classList.remove("hidden");
        typeLine();
      }, 800);
    } else {
      authMessage.textContent = "> 인증 실패. 접근이 거부되었습니다.";
      passwordInput.value = "";
    }
  });

  // 📁 파일 시스템
  const fileSystem = {
    world: {
      "timeline.txt": "세계는 선택에 따라 여러 갈래로 분기된다...",
      "contracts.log": "기록된 계약자 수: nnnnn41423\n위험도: HIGH"
    },
    yokai: {
      "kitsune.txt": "어느 구슬을 지키기 위한 존재.",
      "sealed.txt": "[접근 거부] 권한이 부족한 정보입니다."
    }
  };

  document.querySelectorAll(".folder").forEach(folder => {
    folder.addEventListener("click", () => {
      const key = folder.dataset.folder;
      const list = document.querySelector(`.file-list[data-files="${key}"]`);
      if (!list) return;

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
});

function openFileScreen(fileName, content) {
  // 메인 DB 화면 숨기기
  document.getElementById("database-view").classList.add("hidden");

  // 파일 화면 보이기
  document.getElementById("file-screen").classList.remove("hidden");

  // 🔥 중요: 기존 터미널 출력 제거 (인증/로그 흔적 제거)
  const terminal = document.getElementById("terminal-text");
  if (terminal) terminal.innerHTML = "";

  const title = document.getElementById("file-title");
  const text = document.getElementById("file-text");

  title.textContent = "FILE: " + fileName;
  text.innerHTML = "";

  const welcome = document.createElement("p");
  welcome.textContent = "> 환영합니다. 기록 열람을 시작합니다.";
  text.appendChild(welcome);

  const body = document.createElement("p");
  body.textContent = content;
  text.appendChild(body);
}

document.getElementById("back-btn").addEventListener("click", () => {
  // 파일 화면 숨기기
  document.getElementById("file-screen").classList.add("hidden");

  // 메인 DB 화면 복귀
  document.getElementById("database-view").classList.remove("hidden");

  // 🔥 파일 화면 상태 초기화
  document.getElementById("file-text").innerHTML = "";
  document.getElementById("file-title").textContent = "ACCESSING FILE";
});
