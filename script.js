document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const mainScreen = document.getElementById("main-screen");
    const terminal = document.getElementById("terminal-text");
    const passwordInput = document.getElementById("password-input");
    const authMessage = document.getElementById("auth-message");
    const dbView = document.getElementById("database-view");
    const fileScreen = document.getElementById("file-screen");

    const PASSWORD = "1234";

    // --- 1. 🔐 비밀번호 인증 (PC 엔터 + 모바일 완료 버튼 대응) ---
    // 모바일 대응을 위해 keypress 이벤트를 사용합니다.
    passwordInput.addEventListener("keypress", (e) => {
        const keyCode = e.keyCode || e.which;

        if (keyCode === 13) { // 엔터키 감지
            e.preventDefault(); 
            
            if (passwordInput.value === PASSWORD) {
                // 성공 연출
                document.body.classList.add("auth-success-flash");
                authMessage.style.color = "var(--neon-mint)";
                authMessage.textContent = "> ACCESS GRANTED. SYNCHRONIZING...";
                passwordInput.disabled = true;

                setTimeout(() => {
                    document.body.classList.remove("auth-success-flash");
                    authScreen.classList.add("hidden");
                    mainScreen.classList.remove("hidden");
                    startTyping(); // 메인 화면 타이핑 시작
                }, 1200);
            } else {
                // 실패 연출
                document.body.classList.add("auth-error-flash");
                authMessage.style.color = "var(--neon-pink)";
                authMessage.textContent = "> ACCESS DENIED. INVALID CREDENTIALS.";
                
                setTimeout(() => {
                    document.body.classList.remove("auth-error-flash");
                    passwordInput.value = "";
                    passwordInput.focus();
                }, 800);
            }
        }
    });

    // --- 2. ⌨️ 메인 화면 접속 타이핑 효과 ---
    const lines = [
        "> 접속 승인. 환영합니다, 계약자님.", 
        "> 데이터베이스 기록을 성공적으로 불러왔습니다."
    ];
    let lineIdx = 0, charIdx = 0;
    const cursor = document.createElement("span");
    cursor.className = "cursor";

    function startTyping() {
        if (lineIdx >= lines.length) return;
        
        let p = terminal.querySelectorAll("p")[lineIdx];
        if (!p) {
            p = document.createElement("p");
            terminal.appendChild(p);
        }
        
        p.textContent = lines[lineIdx].slice(0, charIdx + 1);
        p.appendChild(cursor);
        charIdx++;

        if (charIdx === lines[lineIdx].length) {
            charIdx = 0; 
            lineIdx++;
            setTimeout(startTyping, 600);
        } else {
            setTimeout(startTyping, 40);
        }
    }

    // --- 3. 📁 파일 시스템 데이터 ---
    const fileSystem = {
        world: {
            "timeline.txt": "세상은 여러 선택에 따라 분류된다. 현재 관측 가능한 시간선은 총 4개다.\n\n일련번호: 99123\n우리 세계에 침범하던 다른 시간선도 존재한다.",
            "contracts.log": "기록된 계약자 수: nnnnn41423\n위험도: HIGH\n최근 업데이트: 2026-01-20"
        },
        yokai: {
            "kitsune.txt": "어느 구슬을 지키기 위한 존재. 아홉 개의 꼬리는 각각 다른 권능을 상징한다.",
            "sealed.txt": "[접근 거부] 이 데이터는 1급 기밀로 분류되어 열람이 차단되었습니다."
        }
    };

    // --- 4. 📁 폴더 클릭 시 파일 목록 생성 로직 ---
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const key = folder.dataset.folder;
            const list = document.querySelector(`.file-list[data-files="${key}"]`);
            
            // 이미 열려있으면 닫기
            if (list.innerHTML !== "") { 
                list.innerHTML = ""; 
                return; 
            }

            // 파일 목록 동적 생성
            Object.keys(fileSystem[key]).forEach(name => {
                const fileDiv = document.createElement("div");
                fileDiv.className = "file"; // CSS 효과 연결
                fileDiv.textContent = "📄 " + name;
                
                // 파일 클릭 시 열기
                fileDiv.onclick = () => openFile(name, fileSystem[key][name]);
                
                list.appendChild(fileDiv);
            });
        });
    });
    
function openFile(name, content) {
    dbView.classList.add("hidden");
    fileScreen.classList.remove("hidden");
    document.getElementById("file-title").textContent = "FILE: " + name;

    const textArea = document.getElementById("file-text");
    textArea.innerHTML = ""; // 기존 내용 비우기

    // 1단계: 환영 메시지 설정
    const welcomeLine = document.createElement("p");
    welcomeLine.style.color = "var(--neon-mint)";
    welcomeLine.className = "typing-cursor"; // 커서 효과 추가
    textArea.appendChild(welcomeLine);

    const welcomeText = "> SYSTEM: 기록 열람을 시작합니다...";
    let charIdx = 0;

    // 환영 메시지 타이핑 함수
    function typeWelcome() {
        if (charIdx < welcomeText.length) {
            welcomeLine.textContent += welcomeText[charIdx];
            charIdx++;
            setTimeout(typeWelcome, 40); // 보통 속도
        } else {
            // 타이핑 끝나면 1초 뒤에 지우고 본문 시작
            setTimeout(() => {
                welcomeLine.remove(); // 환영 메시지 삭제
                startMainContent();
            }, 1000);
        }
    }

    // 2단계: 본문 고속 타이핑 함수
    function startMainContent() {
        const contentLine = document.createElement("p");
        contentLine.style.color = "#fff";
        contentLine.style.lineHeight = "1.8";
        contentLine.className = "typing-cursor"; 
        textArea.appendChild(contentLine);

        let mainIdx = 0;
        // 텍스트의 \n을 <br>로 바꾸지 않고, 한 글자씩 검사하며 넣기
        function typeMain() {
            if (mainIdx < content.length) {
                if (content[mainIdx] === "\n") {
                    contentLine.innerHTML += "<br>";
                } else {
                    contentLine.innerHTML += content[mainIdx];
                }
                mainIdx++;
                setTimeout(typeMain, 15); // ⚡ 고속 타이핑 (15ms)
            } else {
                contentLine.classList.remove("typing-cursor"); // 다 쓰면 커서 제거
            }
        }
        typeMain();
    }

    typeWelcome(); // 실행 시작
}
    // --- 6. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").addEventListener("click", () => {
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
    });

    // --- 7. ✨ 심볼 클릭 보너스 효과 ---
    document.querySelectorAll(".sigil-small").forEach(s => {
        s.onclick = () => {
            s.style.textShadow = "0 0 40px red";
            s.style.color = "red";
        };
    });
});
