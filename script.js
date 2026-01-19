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

  // 1. 메인 터미널 타이핑 효과
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

  // 2. 초기 로딩 연출
  setTimeout(() => {
    if (loading) loading.classList.add("hidden");
    if (authScreen) {
      authScreen.classList.remove("hidden");
      passwordInput.focus();
    }
  }, 2000);

  // 3. 🔐 비밀번호 인증 및 연출 (핵심 수정 부분)
  const PASSWORD = "1234";

  document.addEventListener("keydown", (e) => {
    if (!authScreen || authScreen.classList.contains("hidden")) return;
    if (e.key !== "Enter") return;

    if (passwordInput.value === PASSWORD) {
      // ✅ [성공] 화면이 밝아지며 접속
      authScreen.classList.add("auth-success-bg");
      authMessage.textContent = "> 인증 성공. 시스템 동기화 중...";
      passwordInput.disabled = true; // 연속 입력 방지

      setTimeout(() => {
        authScreen.classList.add("hidden");
        authScreen.classList.remove("auth-success-bg"); // 상태 초기화
        main.classList.remove("hidden");
        typeLine(); // 메인 타이핑 시작
      }, 1000);

    } else {
      // ✅ [실패] 화면이 빨갛게 변함
      authScreen.classList.add("auth-error-bg");
      authMessage.textContent = "> 인증 실패. 접근이 거부되었습니다.";
      
      setTimeout(() => {
        authScreen.classList.remove("auth-error-bg");
        authMessage.textContent = "> 다시 시도하십시오.";
        passwordInput.value = "";
        passwordInput.focus();
      }, 800);
    }
  });

  // 4. 📁 파일 시스템 데이터
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

  // 5. 폴더 및 파일 클릭 이벤트
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

  // 6. 뒤로가기 버튼
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.getElementById("file-screen").classList.add("hidden");
      document.getElementById("database-view").classList.remove("hidden");
      document.getElementById("file-text").innerHTML = "";
      document.getElementById("file-title").textContent = "ACCESSING FILE";
    });
  }

  // 시길 클릭 이벤트
  if (sigil) {
    sigil.addEventListener("click", () => {
      sigil.style.textShadow = "0 0 30px red";
    });
  }
});

// ✅ openFileScreen 함수 (파일 내용 출력)
function openFileScreen(fileName, content) {
  const dbView = document.getElementById("database-view");
  const fileScreen = document.getElementById("file-screen");
  const title = document.getElementById("file-title");
  const text = document.getElementById("file-text");

  if (dbView) dbView.classList.add("hidden");
  if (fileScreen) fileScreen.classList.remove("hidden");

  title.textContent = "FILE: " + fileName;
  text.innerHTML = ""; 

  // 환영 문구 추가
  const welcome = document.createElement("p");
  welcome.style.color = "#00ff9c"; // CSS에서 설정한 강조색
  welcome.textContent = "> 환영합니다. 기록 열람을 시작합니다.";
  text.appendChild(welcome);

  // 본문 추가
  const body = document.createElement("p");
  body.style.marginTop = "10px";
  body.textContent = content;
  text.appendChild(body);
}
