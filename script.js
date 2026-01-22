document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const mainScreen = document.getElementById("main-screen");
    const terminal = document.getElementById("terminal-text");
    const passwordInput = document.getElementById("password-input");
    const authMessage = document.getElementById("auth-message");
    const dbView = document.getElementById("database-view");
    const fileScreen = document.getElementById("file-screen");
    const fileScrollContainer = document.getElementById("file-scroll-container");

    const PASSWORD = "1234";
    let inputBuffer = "";      // glitch 타이핑 저장용
    let isGlitchUnlocked = false; // glitch 활성화 여부

    // --- 1. 🔐 비밀번호 인증 ---
    passwordInput.addEventListener("keypress", (e) => {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault(); 
            if (passwordInput.value === PASSWORD) {
                document.body.classList.add("auth-success-flash");
                authMessage.style.color = "var(--neon-mint)";
                authMessage.textContent = "> ACCESS GRANTED. SYNCHRONIZING...";
                passwordInput.disabled = true;

                setTimeout(() => {
                    document.body.classList.remove("auth-success-flash");
                    authScreen.classList.add("hidden");
                    mainScreen.classList.remove("hidden");
                    startTyping();
                }, 1200);
            } else {
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

    // --- 3. 📁 파일 시스템 데이터 (큐로 파일 추가) ---
    const fileSystem = {
        world: {
            "timeline.txt": "세상은 여러 선택에 따라 분류된다. 현재 관측 가능한 시간선은 총 4개다.\n\n일련번호: 99123\n우리 세계에 침범하던 다른 시간선도 존재한다.",
            "contracts.log": "기록된 계약자 수: nnnnn41423\n위험도: HIGH\n최근 업데이트: 2026-01-20"
        },
        yokai: {
            "kitsune.txt": "어느 구슬을 지키기 위한 존재. 아홉 개의 꼬리는 각각 다른 권능을 상징한다.",
            "Curo_Half_Archive.log": "명칭: 큐로(Curo)\n상태: 데이터 손상.\n\n[경고]\n이 파일의 끝에는 아무것도 없습니다.\n더 이상 조사를 진행하지 마십시오."
        }
    };

    // --- 4. 📁 폴더 클릭 로직 ---
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const key = folder.dataset.folder;
            const list = document.querySelector(`.file-list[data-files="${key}"]`);
            if (list.innerHTML !== "") { list.innerHTML = ""; return; }
            Object.keys(fileSystem[key]).forEach(name => {
                const fileDiv = document.createElement("div");
                fileDiv.className = "file";
                fileDiv.textContent = "📄 " + name;
                fileDiv.onclick = () => openFile(name, fileSystem[key][name]);
                list.appendChild(fileDiv);
            });
        });
    });
    
    // --- 5. 📄 파일 열기 로직 (히든 초기화 포함) ---
    function openFile(name, content) {
        dbView.classList.add("hidden");
        fileScreen.classList.remove("hidden");
        document.getElementById("file-title").textContent = "FILE: " + name;

        // 히든 구역 초기화 (새 파일을 열 때마다 숨김)
        const hiddenZone = document.getElementById("hidden-zone");
        if(hiddenZone) hiddenZone.classList.add("hidden");
        fileScrollContainer.scrollTop = 0;

        const textArea = document.getElementById("file-text");
        textArea.innerHTML = ""; 

        const welcomeLine = document.createElement("p");
        welcomeLine.style.color = "var(--neon-mint)";
        welcomeLine.className = "typing-cursor"; 
        textArea.appendChild(welcomeLine);

        const welcomeText = "> SYSTEM: 기록 열람을 시작합니다...";
        let cIdx = 0;

        function typeWelcome() {
            if (cIdx < welcomeText.length) {
                welcomeLine.textContent += welcomeText[cIdx];
                cIdx++;
                setTimeout(typeWelcome, 40);
            } else {
                setTimeout(() => {
                    welcomeLine.remove();
                    startMainContent();
                }, 1000);
            }
        }

        function startMainContent() {
            const contentLine = document.createElement("p");
            contentLine.style.color = "#fff";
            contentLine.style.lineHeight = "1.8";
            contentLine.className = "typing-cursor"; 
            textArea.appendChild(contentLine);

            let mainIdx = 0;
            function typeMain() {
                if (mainIdx < content.length) {
                    if (content[mainIdx] === "\n") {
                        contentLine.innerHTML += "<br>";
                    } else {
                        contentLine.innerHTML += content[mainIdx];
                    }
                    mainIdx++;
                    setTimeout(typeMain, 15);
                } else {
                    contentLine.classList.remove("typing-cursor");
                }
            }
            typeMain();
        }
        typeWelcome();
    }

    // --- 6. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").addEventListener("click", () => {
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
    });

    // --- 7. ✨ 심볼 클릭 효과 ---
    document.querySelectorAll(".sigil-small").forEach(s => {
        s.onclick = () => {
            s.style.textShadow = "0 0 40px red";
            s.style.color = "red";
        };
    });

    // --- 8. ⌨️ "glitch" 타이핑 커맨드 감지 ---
    window.addEventListener("keydown", (e) => {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > 6) inputBuffer = inputBuffer.substring(inputBuffer.length - 6);

        if (inputBuffer === "glitch" && !isGlitchUnlocked) {
            isGlitchUnlocked = true;
            document.body.classList.add("glitch-active");
            setTimeout(() => {
                document.body.classList.remove("glitch-active");
                alert("SYSTEM BREACHED: HIDDEN SECTOR UNLOCKED");
            }, 1500);
        }
    });

    // --- 9. 🖱️ 큐로 파일 하단 휠 감지 ---
    fileScrollContainer.addEventListener("scroll", () => {
        const currentTitle = document.getElementById("file-title").textContent;
        // 1. glitch 입력 완료 2. 파일명이 Curo 포함 3. 스크롤이 바닥일 때
        if (isGlitchUnlocked && currentTitle.includes("Curo")) {
            const scrollBottom = fileScrollContainer.scrollHeight - fileScrollContainer.clientHeight;
            if (fileScrollContainer.scrollTop >= scrollBottom - 10) {
                document.getElementById("hidden-zone").classList.remove("hidden");
            }
        }
    });

    // 히든 버튼 클릭 시
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "secret-btn") {
            alert("관리자 권한으로 심연의 데이터에 접속합니다...");
            // 이후 동작 추가 가능
        }
    });
});
