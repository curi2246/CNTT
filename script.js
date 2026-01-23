document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const mainScreen = document.getElementById("main-screen");
    const terminal = document.getElementById("terminal-text");
    const passwordInput = document.getElementById("password-input");
    const authMessage = document.getElementById("auth-message");
    const dbView = document.getElementById("database-view");
    const fileScreen = document.getElementById("file-screen");
    const fileScrollContainer = document.getElementById("file-scroll-container");

    // --- [추가] 배경음악 요소 가져오기 ---
    const bgm = document.getElementById("main-bgm");

    const PASSWORD = "1234";
    let inputBuffer = "";      
    let isGlitchUnlocked = false; 
    const fileSystem = {}; // HTML에서 읽어온 데이터 저장소

    // --- 0. 🔄 HTML에서 데이터 자동 수집 ---
    function syncDataFromHTML() {
        // 이 부분은 사용자님의 원본 로직을 유지합니다. 
        // 실제 데이터는 HTML에서 가져오거나 별도로 정의된 객체를 사용하게 됩니다.
        const dataStore = {
            "The main character": {
                "Leay_Full_Archive.txt": "내용 생략 (HTML 데이터를 참조합니다)",
            }
        };
        Object.assign(fileSystem, dataStore); 
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

            // --- [추가] 배경음악 재생 ---
            if (bgm) {
                bgm.play().catch(err => console.log("자동 재생 차단됨: ", err));
            }

            setTimeout(() => {
                document.body.classList.remove("auth-success-flash");
                authScreen.classList.add("hidden");
                mainScreen.classList.remove("hidden");
                
                window.scrollTo(0, 0); 
                
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

    // --- 4. 📄 파일 열기 로직 ---
    function openFile(name, content) {
        dbView.classList.add("hidden");
        fileScreen.classList.remove("hidden");
        document.getElementById("file-title").textContent = "FILE: " + name;
        
        window.scrollTo(0, 0);

        const textTarget = document.getElementById("file-text");
        const hZone = document.getElementById("hidden-zone");
        
        textTarget.innerHTML = ""; 
        fileScrollContainer.scrollTop = 0;
        fileScrollContainer.onscroll = null; 
        if(hZone) hZone.style.display = "none"; 

        const sysMsg = document.createElement("p");
        sysMsg.style.color = "var(--neon-mint)";
        sysMsg.textContent = "> SYSTEM: 기록 열람을 시작합니다...";
        textTarget.appendChild(sysMsg);

        setTimeout(() => {
            sysMsg.remove(); 
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
                    setTimeout(typeBody, 5); 
                    fileScrollContainer.scrollTop = fileScrollContainer.scrollHeight;
                } else {
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
                    fileScrollContainer.onscroll = null; 
                }
            };
        }
    }

    // --- 6. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").onclick = () => {
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
        window.scrollTo(0, 0);
    };

   // --- 7. ⌨️ "glitch" 커맨드 감지 ---
window.addEventListener("keydown", (e) => {
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.length > 6) inputBuffer = inputBuffer.substring(inputBuffer.length - 6);

    if (inputBuffer === "glitch" && !isGlitchUnlocked) {
        isGlitchUnlocked = true;

        // 🎵 음악 교체 로직
        const mainBgm = document.getElementById("main-bgm");
        const glitchBgm = document.getElementById("glitch-bgm");
        const musicTitle = document.getElementById("music-title");

        if (mainBgm) mainBgm.pause(); // 기존 노래 정지
        if (glitchBgm) {
            glitchBgm.currentTime = 0; // 처음부터 재생
            glitchBgm.play().catch(err => console.log("글리치 재생 실패:", err));
        }
        if (musicTitle) {
            musicTitle.textContent = "재생 중: Reupload Undertale The Hackers End - Its Just You And Me.mp3"; // 정보창 텍스트 변경
        }

        // 화면 글리치 효과 시작
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
