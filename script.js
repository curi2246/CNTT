document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal-text");
  const loading = document.getElementById("loading-screen");
  const main = document.getElementById("main-screen");
  const sigil = document.querySelector(".sigil");

  const authScreen = document.getElementById("auth-screen");
  const passwordInput = document.getElementById("password-input");
  const authMessage = document.getElementById("auth-message");

  const PASSWORD = "1234";

  // 1. 초기 로딩 연출
  setTimeout(() => {
    if (loading) loading.classList.add("hidden");
    if (authScreen) {
      authScreen.classList.remove("hidden");
      passwordInput.focus();
    }
  }, 2000);

  // 2. 🔐 비밀번호 인증 및 색상 연출
  document.addEventListener("keydown", (e) => {
    if (!authScreen || authScreen.classList.contains("hidden")) return;
    if (e.key !== "Enter") return;

    if (passwordInput.value === PASSWORD) {
      // ✅ 성공: 화면이 청록색 톤으로 밝아짐
      authScreen.classList.add("auth-success-bg");
      authMessage.textContent = "> 인증 성공. 시스템 동기화 중...";
      passwordInput.disabled = true;

      setTimeout(() => {
        authScreen.classList.add("hidden");
        authScreen.classList.remove("auth-success-bg");
        main.classList.remove("hidden");
        startTyping(); // 인증 후 메인 타이핑 시작
      }, 1000);
    } else {
      // ✅ 실패: 화면이 붉은색 톤으로 변함
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

  // 3. 메인 화면 타이핑 효과
  const lines = ["> 접속 승인. 환영합니다, 계약자님.", "> 데이터베이스 접근 권한이 확인되었습니다."];
  let lineIdx = 0, charIdx = 0;
  const cursor = document.createElement("span");
  cursor.className = "cursor";

  function startTyping() {
    if (lineIdx >= lines.length) return;
    let p = terminal.children[lineIdx];
    if (!p) {
      p = document.createElement("p");
      terminal.appendChild(p);
    }
    p.textContent = lines[lineIdx].slice(0, charIdx + 1);
    p.appendChild(cursor);
    charIdx++;
    if (charIdx === lines[lineIdx].length) {
      charIdx = 0; lineIdx++;
      setTimeout(startTyping, 600);
    } else {
      setTimeout(startTyping, 40);
    }
  }

  // 4. 파일 시스템 데이터
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

  // 5. 폴더/파일 클릭 로직
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
        const fileDiv = document.createElement("div");
        fileDiv.className = "file";
        fileDiv.textContent = "📄 " + name;
        fileDiv.onclick = () => openFileScreen(name, fileSystem[key][name]);
        list.appendChild(fileDiv);
      });
    });
  });

  // 6. 뒤로가기 버튼
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.getElementById("file-screen").classList.add("hidden");
      document.getElementById("database-view").classList.remove("hidden");
    });
  }
});

// ✅ 7. 파일 열기 함수 (환영 문구 강제 삽입)
function openFileScreen(fileName, content) {
  const dbView = document.getElementById("database-view");
  const fileScreen = document.getElementById("file-screen");
  const title = document.getElementById("file-title");
  const textContainer = document.getElementById("file-text");

  if (dbView) dbView.classList.add("hidden");
  if (fileScreen) fileScreen.classList.remove("hidden");

  title.textContent = "FILE: " + fileName;
  
  // 환영 문구와 본문을 HTML로 한꺼번에 삽입 (더 확실한 방법)
  textContainer.innerHTML = `
    <p style="color: #00ff9c; font-weight: bold; margin-bottom: 12px;">> 환영합니다. 기록 열람을 시작합니다.</p>
    <p style="color: #5fd3ff;">${content}</p>
  `;
}
