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
    const fileSystem = {}; // HTML에서 읽어온 데이터가 저장될 공간

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
                buildDirectory(); // 폴더 목록 생성
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

    // --- 3. 📁 폴더/파일 목록 생성 로직 ---
    function buildDirectory() {
        const dirContainer = document.getElementById("directory");
        dirContainer.innerHTML = "";
        
        Object.keys(fileSystem).forEach(folderName => {
            const fDiv = document.createElement("div");
            fDiv.className = "folder";
            fDiv.textContent = "📁 " + folderName;
            
            const fileList = document.createElement("div");
            fileList.className = "hidden";
            
            fDiv.onclick = () => fileList.classList.toggle("hidden");
            
            Object.keys(fileSystem[folderName]).forEach(fileName => {
                const fi = document.createElement("div");
                fi.className = "file";
                fi.textContent = "📄 " + fileName;
                fi.onclick = (e) => { 
                    e.stopPropagation(); 
                    openFile(fileName, fileSystem[folderName][fileName]); 
                };
                fileList.appendChild(fi);
            });
            dirContainer.appendChild(fDiv);
            dirContainer.appendChild(fileList);
        });
    }

    // --- 4. 📄 파일 열기 및 타이핑 효과 ---
    function openFile(name, content) {
        dbView.classList.add("hidden");
        fileScreen.classList.remove("hidden");
        document.getElementById("file-title").textContent = "FILE: " + name;

        const hiddenZone = document.getElementById("hidden-zone");
        if(hiddenZone) hiddenZone.style.display = "none";
        fileScrollContainer.scrollTop = 0;

        const textArea = document.getElementById("file-text");
        textArea.innerHTML = ""; 

        const welcomeLine = document.createElement("p");
        welcomeLine.style.color = "var(--neon-mint)";
        welcomeLine.textContent = "> SYSTEM: 기록 열람을 시작합니다...";
        textArea.appendChild(welcomeLine);

        setTimeout(() => {
            welcomeLine.remove();
            const contentLine = document.createElement("p");
            contentLine.style.color = "#fff";
            contentLine.style.whiteSpace = "pre-wrap"; // 줄바꿈 유지
            textArea.appendChild(contentLine);

            let mainIdx = 0;
            function typeMain() {
                if (mainIdx < content.length) {
                    contentLine.textContent += content[mainIdx];
                    mainIdx++;
                    setTimeout(typeMain, 10);
                    fileScrollContainer.scrollTop = fileScrollContainer.scrollHeight;
                }
            }
            typeMain();
        }, 800);
    }

    // --- 5. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").onclick = () => {
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
    };

    // --- 6. ⌨️ "glitch" 감지 ---
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

    // --- 7. 🖱️ 스크롤 감지 (히든 버튼) ---
    fileScrollContainer.onscroll = () => {
        const currentTitle = document.getElementById("file-title").textContent;
        if (isGlitchUnlocked && currentTitle.includes("Curo")) {
            if (fileScrollContainer.scrollTop + fileScrollContainer.clientHeight >= fileScrollContainer.scrollHeight - 20) {
                document.getElementById("hidden-zone").style.display = "block";
            }
        }
    };

    document.getElementById("secret-btn").onclick = () => {
        alert("관리자 권한으로 심연의 데이터에 접속합니다...");
    };
});
