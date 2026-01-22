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
    let inputBuffer = "";      
    let isGlitchUnlocked = false; 
    const fileSystem = {}; // HTML에서 읽어온 데이터 저장소

    // --- 0. 🔄 HTML에서 데이터 자동 수집 ---
    function syncDataFromHTML() {
        const dataItems = document.querySelectorAll("#raw-data-store > div");
        dataItems.forEach(item => {
            const folder = item.dataset.folder;
            const fileName = item.dataset.file;
            const content = item.innerText.trim();
            if (!fileSystem[folder]) fileSystem[folder] = {};
            fileSystem[folder][fileName] = content;
        });
    }
    syncDataFromHTML();

    // --- 1. 🔐 비밀번호 인증 ---
    document.getElementById("auth-form").onsubmit = (e) => {
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
                buildDirectory(); 
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
    };

    // --- 2. ⌨️ 메인 화면 타이핑 효과 ---
    const lines = ["> 접속 승인. 환영합니다, 계약자님.", "> 데이터베이스 기록을 성공적으로 불러왔습니다."];
    let lineIdx = 0, charIdx = 0;
    const cursor = document.createElement("span");
    cursor.className = "cursor";

    function startTyping() {
        if (lineIdx >= lines.length) return;
        let p = terminal.querySelectorAll("p")[lineIdx];
        if (!p) { p = document.createElement("p"); terminal.appendChild(p); }
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

    // --- 3. 📁 폴더/파일 목록 생성 ---
    function buildDirectory() {
        const dir = document.getElementById("directory");
        dir.innerHTML = "";
        Object.keys(fileSystem).forEach(folder => {
            const fDiv = document.createElement("div"); 
            fDiv.className = "folder"; 
            fDiv.textContent = "📁 " + folder;
            
            const list = document.createElement("div"); 
            list.className = "hidden";
            
            fDiv.onclick = () => list.classList.toggle("hidden");
            
            Object.keys(fileSystem[folder]).forEach(file => {
                const fi = document.createElement("div"); 
                fi.className = "file"; 
                fi.textContent = "📄 " + file;
                fi.onclick = (e) => { 
                    e.stopPropagation(); 
                    openFile(file, fileSystem[folder][file]); 
                };
                list.appendChild(fi);
            });
            dir.appendChild(fDiv); 
            dir.appendChild(list);
        });
    }

    // --- 4. 📄 파일 열기 로직 (수정 및 통합 버전) ---
    function openFile(name, content) {
        dbView.classList.add("hidden");
        fileScreen.classList.remove("hidden");
        document.getElementById("file-title").textContent = "FILE: " + name;
        
        const textTarget = document.getElementById("file-text");
        const hZone = document.getElementById("hidden-zone");
        
        // 초기화 로직
        textTarget.innerHTML = ""; 
        fileScrollContainer.scrollTop = 0;
        fileScrollContainer.onscroll = null; // 기존 스크롤 이벤트 해제
        if(hZone) hZone.style.display = "none"; 

        const sysMsg = document.createElement("p");
        sysMsg.style.color = "var(--neon-mint)";
        sysMsg.textContent = "> SYSTEM: 기록 열람을 시작합니다...";
        textTarget.appendChild(sysMsg);

        setTimeout(() => {
            sysMsg.remove(); // 시스템 메시지 삭제 후 본문 타이핑
            const bodyMsg = document.createElement("p");
            bodyMsg.style.color = "#fff";
            bodyMsg.style.whiteSpace = "pre-wrap";
            bodyMsg.style.lineHeight = "1.6";
            textTarget.appendChild(bodyMsg);

            let mainIdx = 0;
            function typeBody() {
                if(mainIdx < content.length) {
                    bodyMsg.textContent += content[mainIdx];
                    mainIdx++;
                    setTimeout(typeBody, 10); 
                    fileScrollContainer.scrollTop = fileScrollContainer.scrollHeight;
                } else {
                    // 타이핑이 완전히 끝난 후 히든 체크 활성화
                    enableHiddenCheck(name);
                }
            }
            typeBody();
        }, 800);
    }

    // --- 5. 🖱️ 히든 체크 (스크롤 감지) ---
    function enableHiddenCheck(fileName) {
        if (isGlitchUnlocked && fileName.includes("Curo")) {
            fileScrollContainer.onscroll = () => {
                const isAtBottom = fileScrollContainer.scrollTop + fileScrollContainer.clientHeight >= fileScrollContainer.scrollHeight - 20;
                if (isAtBottom) {
                    document.getElementById("hidden-zone").style.display = "block";
                    fileScrollContainer.onscroll = null; // 한 번 나타나면 감지 중지
                }
            };
        }
    }

    // --- 6. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").onclick = () => {
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
    };

    // --- 7. ⌨️ "glitch" 커맨드 감지 ---
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

    // --- 8. 🖱️ 히든 버튼 클릭 ---
    document.getElementById("secret-btn").onclick = () => {
        alert("관리자 권한으로 심연의 데이터에 접속합니다...");
    };
});
