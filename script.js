document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const mainScreen = document.getElementById("main-screen");
    const terminal = document.getElementById("terminal-text");
    const passwordInput = document.getElementById("password-input");
    const authMessage = document.getElementById("auth-message");
    const dbView = document.getElementById("database-view");
    const fileScreen = document.getElementById("file-screen");
    const fileScrollContainer = document.getElementById("file-scroll-container");

    // --- [교정] 모든 배경음악 요소 풀 네임 매칭 ---
    const bgm = document.getElementById("main-bgm");
    const glitchBgm = document.getElementById("glitch-bgm");
    const abyssBgm = document.getElementById("???-bgm"); // 심연 구간 노래
    const musicTitle = document.getElementById("music-title");

    const PASSWORD = "1234";
    let inputBuffer = "";      
    let isGlitchUnlocked = false; 
    const fileSystem = {}; 

    // --- 0. 🔄 HTML에서 데이터 자동 수집 ---
    function syncDataFromHTML() {
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

            if (bgm) {
                bgm.currentTime = 0; 
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
        textTarget.innerHTML = ""; 
        window.onscroll = null;
        document.body.style.backgroundColor = "var(--bg-black)";
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
                    setTimeout(typeBody, 2); 
                } else {
                    enableHiddenCheck(name);
                }
            }
            typeBody();
        }, 800);
    }

    // --- 5. 🖱️ 히든 체크 ---
    function enableHiddenCheck(fileName) {
        const hZone = document.getElementById("hidden-zone");
        if (isGlitchUnlocked && fileName.includes("Curo")) {
            if(hZone) {
                hZone.style.display = "block";
                hZone.style.opacity = "0";
            }
            window.onscroll = () => {
                const scrollY = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (maxScroll <= 0) return;
                const darkness = Math.min(scrollY / (maxScroll * 0.9), 1);
                document.body.style.backgroundColor = `rgb(${5 * (1 - darkness)}, ${5 * (1 - darkness)}, ${5 * (1 - darkness)})`;
                const triggerPoint = maxScroll * 0.7;
                if (scrollY > triggerPoint) {
                    const opacity = (scrollY - triggerPoint) / (maxScroll - triggerPoint);
                    hZone.style.opacity = opacity;
                } else {
                    hZone.style.opacity = "0";
                }
            };
        }
    }

    // --- 6. 🔙 뒤로가기 버튼 ---
    document.getElementById("back-btn").onclick = () => {
        window.onscroll = null;
        document.body.style.backgroundColor = "var(--bg-black)";
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
            if (bgm) bgm.pause();
            if (glitchBgm) {
                glitchBgm.currentTime = 0;
                glitchBgm.play().catch(err => console.log("글리치 재생 실패:", err));
            }
            if (musicTitle) musicTitle.textContent = "재생 중: error.mp3.mp3";
            document.body.classList.add("glitch-active");
            setTimeout(() => {
                document.body.classList.remove("glitch-active");
                alert("SYSTEM BREACHED: HIDDEN SECTOR UNLOCKED");
            }, 1500);
        }
    });

    // --- 8. 🖱️ 히든 버튼 클릭 (요청하신 시퀀스 적용) ---
    document.getElementById("secret-btn").onclick = () => {
        const fileScreenElem = document.getElementById("file-screen");
        const bgSigil = document.querySelector(".bg-sigil");

        fileScreenElem.style.transition = "opacity 0.5s";
        fileScreenElem.style.opacity = "0";
        if(bgSigil) bgSigil.style.display = "none";
        
        if (bgm) bgm.pause();
        if (glitchBgm) glitchBgm.pause();
        if (abyssBgm) {
            abyssBgm.currentTime = 0;
            abyssBgm.play().catch(err => console.log("심연 재생 실패"));
            if (musicTitle) musicTitle.textContent = "재생 중: t+pazolite - CENSORED!! (2).mp3.mp3";
        }

        const createNaturalFlash = (color, duration) => {
            const flash = document.createElement("div");
            flash.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${color}; z-index:11000; pointer-events:none; opacity:1;`;
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.transition = `opacity ${duration}ms ease-out`;
                flash.style.opacity = "0";
                setTimeout(() => flash.remove(), duration);
            }, 50);
        };

        // 4분할 플래시 유지
        [0, 2400, 5000, 7400].forEach(time => {
            setTimeout(() => createNaturalFlash("#fff", 800), time);
        });

        // 심연 레이어 생성
        const abyssLayer = document.createElement("div");
        abyssLayer.id = "abyss-layer";
        abyssLayer.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:9999; overflow:hidden; display:flex; align-items:center; justify-content:center;`;
        document.body.appendChild(abyssLayer);

        const textContainer = document.createElement("div");
        textContainer.style.cssText = `width:90%; text-align:center; z-index:10001;`;
        abyssLayer.appendChild(textContainer);

        // [10.0초] - 에러 및 경고 텍스트 난사
        setTimeout(() => {
            const errInterval = setInterval(() => {
                if (abyssBgm.currentTime >= 19.6) { clearInterval(errInterval); return; }
                const err = document.createElement("div");
                err.textContent = Math.random() > 0.5 ? "SYSTEM_FAILURE" : "CRITICAL_ERROR";
                err.style.cssText = `position:absolute; color:#600; font-size:14px; left:${Math.random()*90}%; top:${Math.random()*90}%; opacity:0.7; pointer-events:none;`;
                abyssLayer.appendChild(err);
                setTimeout(() => err.remove(), 400);
            }, 50);
        }, 10000);

        // [19.6초] - '그'가 인지한다 + RGB 블록 글리치
        setTimeout(() => {
            createNaturalFlash("#fff", 1000);
            
            const style = document.createElement('style');
            style.innerHTML = `
                .glitch-rgb-block { 
                    animation: rgb-split 0.1s infinite, block-distortion 0.2s infinite;
                    filter: contrast(200%);
                }
                @keyframes rgb-split {
                    0% { text-shadow: 5px 0 red, -5px 0 blue; }
                    50% { text-shadow: -5px 0 red, 5px 0 blue; }
                }
                @keyframes block-distortion {
                    0% { clip-path: inset(10% 0 80% 0); transform: skew(10deg); }
                    50% { clip-path: inset(70% 0 10% 0); transform: skew(-10deg); }
                    100% { clip-path: inset(0); }
                }
            `;
            document.head.appendChild(style);
            abyssLayer.classList.add("glitch-rgb-block");

            textContainer.innerHTML = `<h1 style="font-size:4.5rem; color:#fff; font-weight:bold;">이제 '그'가 당신을 인지합니다.</h1>`;
        }, 19600);

        // [29.6초] - 최종 플래시 및 마무리
        setTimeout(() => {
            createNaturalFlash("#fff", 3000);
            setTimeout(() => {
                abyssLayer.classList.remove("glitch-rgb-block");
                abyssLayer.style.background = "#fff";
                textContainer.innerHTML = `<h1 style="color:#000; font-size:1.5rem; letter-spacing:8px;">CONNECTION LOST</h1>`;
            }, 100);
        }, 29600);
    };
});
