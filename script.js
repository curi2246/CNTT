document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const mainScreen = document.getElementById("main-screen");
    const terminal = document.getElementById("terminal-text");
    const passwordInput = document.getElementById("password-input");
    const authMessage = document.getElementById("auth-message");
    const dbView = document.getElementById("database-view");
    const fileScreen = document.getElementById("file-screen");
    const fileScrollContainer = document.getElementById("file-scroll-container");

    const bgm = document.getElementById("main-bgm");
    const glitchBgm = document.getElementById("glitch-bgm");
    const abyssBgm = document.getElementById("???-bgm"); 
    const musicTitle = document.getElementById("music-title");

    const PASSWORD = "1234";
    let inputBuffer = "";      
    let isGlitchUnlocked = false; 
    const fileSystem = {}; 

    function syncDataFromHTML() {
        const dataStore = {
            "The main character": {
                "Leay_Full_Archive.txt": "명칭: 리에(Leay)...(중략)",
                "Curo_Half_Archive.txt": "명칭: 큐로(Curo)...(중략)",
                "Kisune_Full_Archive.txt": "명칭: 키스네(Kisune)...(중략)",
                "Shiro_Full_Archive.txt": "명칭: 시로(Shiro)...(중략)"
            }
        };
        Object.assign(fileSystem, dataStore); 
    }
    syncDataFromHTML();

    document.getElementById("auth-form").onsubmit = (e) => {
        e.preventDefault();
        if (passwordInput.value === PASSWORD) {
            document.body.classList.add("auth-success-flash");
            authMessage.style.color = "var(--neon-mint)";
            authMessage.textContent = "> ACCESS GRANTED. SYNCHRONIZING...";
            passwordInput.disabled = true;

            if (bgm) {
                bgm.currentTime = 0; 
                bgm.play().catch(err => console.log("자동 재생 차단됨"));
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

    document.getElementById("back-btn").onclick = () => {
        window.onscroll = null;
        document.body.style.backgroundColor = "var(--bg-black)";
        fileScreen.classList.add("hidden");
        dbView.classList.remove("hidden");
        window.scrollTo(0, 0);
    };

    window.addEventListener("keydown", (e) => {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > 6) inputBuffer = inputBuffer.substring(inputBuffer.length - 6);
        if (inputBuffer === "glitch" && !isGlitchUnlocked) {
            isGlitchUnlocked = true;
            if (bgm) bgm.pause();
            if (glitchBgm) {
                glitchBgm.currentTime = 0;
                glitchBgm.play().catch(err => console.log("글리치 재생 실패"));
            }
            if (musicTitle) musicTitle.textContent = "재생 중: error.mp3.mp3";
            document.body.classList.add("glitch-active");
            setTimeout(() => {
                document.body.classList.remove("glitch-active");
            }, 1500);
        }
    });

    // --- 히든 시퀀스 (secret-btn) 연출 강화 버전 ---
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

        // 초기 플래시 (0s, 2.4s, 5.0s, 7.4s)
        [0, 2400, 5000, 7400].forEach(time => {
            setTimeout(() => createNaturalFlash("#fff", 800), time);
        });

        const abyssLayer = document.createElement("div");
        abyssLayer.id = "abyss-layer";
        abyssLayer.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:9999; overflow:hidden; display:flex; align-items:center; justify-content:center;`;
        document.body.appendChild(abyssLayer);

        const textContainer = document.createElement("div");
        textContainer.style.cssText = `width:90%; text-align:center; z-index:10001;`;
        abyssLayer.appendChild(textContainer);

        // [10.0초] - 백그라운드 에러 메시지 무차별 도배
        setTimeout(() => {
            const errInterval = setInterval(() => {
                if (abyssBgm.currentTime >= 19.6) { clearInterval(errInterval); return; }
                // 한 틱에 3개씩 생성하여 도배 가속
                for(let i=0; i<3; i++) {
                    const err = document.createElement("div");
                    err.textContent = Math.random() > 0.5 ? "SYSTEM_FAILURE" : "CRITICAL_ERROR";
                    err.style.cssText = `position:absolute; color:#800; font-family:monospace; font-size:${12 + Math.random() * 20}px; left:${Math.random() * 100}%; top:${Math.random() * 100}%; opacity:0.9; pointer-events:none; font-weight:bold; z-index:10000; white-space:nowrap;`;
                    abyssLayer.appendChild(err);
                    setTimeout(() => err.remove(), 400);
                }
            }, 30); // 0.03초마다 생성하여 도배
        }, 10000);

        // [19.6초] - 인지 텍스트 및 강력한 RGB 글리치
        setTimeout(() => {
            createNaturalFlash("#fff", 1000);
            const style = document.createElement('style');
            style.innerHTML = `
                .glitch-rgb-block { animation: rgb-split 0.1s infinite, block-distortion 0.1s infinite; }
                @keyframes rgb-split {
                    0% { box-shadow: 15px 0 rgba(255,0,0,0.5), -15px 0 rgba(0,0,255,0.5); background: rgba(255,0,0,0.1); }
                    50% { box-shadow: -15px 0 rgba(255,0,0,0.5), 15px 0 rgba(0,0,255,0.5); background: rgba(0,0,255,0.1); }
                }
                @keyframes block-distortion {
                    0% { clip-path: inset(10% 0 80% 0); transform: translate(-10px, 5px); }
                    25% { clip-path: inset(70% 0 10% 0); transform: translate(10px, -5px); }
                    100% { clip-path: inset(0); }
                }
                .認知텍스트 {
                    text-shadow: 0 0 25px #fff, 5px 0 red, -5px 0 blue;
                    color: #fff; font-size: 4.5rem; font-weight: bold;
                    animation: text-vibrate 0.05s infinite;
                }
                @keyframes text-vibrate {
                    0% { transform: translate(2px); }
                    100% { transform: translate(-2px); }
                }
            `;
            document.head.appendChild(style);
            abyssLayer.classList.add("glitch-rgb-block");
            textContainer.innerHTML = `<h1 class="認知텍스트">이제 '그'가 당신을 인지합니다.</h1>`;
        }, 19600);

        // [28.5초] - 텍스트 소멸
        setTimeout(() => { textContainer.innerHTML = ""; }, 28500);

        // [29.6초] - 최종 연결 해제 화면
        setTimeout(() => {
            createNaturalFlash("#fff", 3000);
            setTimeout(() => {
                abyssLayer.classList.remove("glitch-rgb-block");
                abyssLayer.style.background = "#fff";
                textContainer.innerHTML = `
                    <h1 style="color:#000; font-size:1.8rem; letter-spacing:10px; font-weight:bold; margin-bottom:20px;">CONNECTION LOST</h1>
                    <p style="color:#333; font-size:1.1rem; line-height:1.6; font-weight:bold;">
                        데이터베이스의 임계점을 초과했습니다.<br>
                        더 이상 기록에 접근할 수 없습니다.
                    </p>
                `;
            }, 100);
        }, 29600);
    };
});
