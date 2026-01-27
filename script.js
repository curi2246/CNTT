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

    // --- 1. 🔐 비밀번호 인증 (노래 재생 보장) ---
    document.getElementById("auth-form").onsubmit = (e) => {
        e.preventDefault();
        if (passwordInput.value === PASSWORD) {
            document.body.classList.add("auth-success-flash");
            authMessage.style.color = "var(--neon-mint)";
            authMessage.textContent = "> ACCESS GRANTED. SYNCHRONIZING...";
            passwordInput.disabled = true;

            // 🎵 [적용] 메인 BGM 시작
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

    // --- 8. 🖱️ 히든 버튼 클릭 (심연의 최종 시퀀스) ---
    document.getElementById("secret-btn").onclick = () => {
        const fileScreenElem = document.getElementById("file-screen");
        const bgSigil = document.querySelector(".bg-sigil");

        // [0초] UI 제거 및 노래 최종 교체
        fileScreenElem.style.transition = "opacity 0.5s";
        fileScreenElem.style.opacity = "0";
        if(bgSigil) bgSigil.style.display = "none";
        
        if (bgm) bgm.pause();
        if (glitchBgm) glitchBgm.pause();
        if (abyssBgm) {
            abyssBgm.currentTime = 0;
            abyssBgm.play().catch(err => console.log("심연 재생 실패"));
            if (musicTitle) musicTitle.textContent = "재생 중: CENSORED!!.mp3";
        }

        // [적용] 자연스럽게 사라지는 플래시 도구 함수
        const createNaturalFlash = (color, duration) => {
            const flash = document.createElement("div");
            flash.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${color}; z-index:10005; pointer-events:none; opacity:1;`;
            document.body.appendChild(flash);
            
            // 자연스러운 페이드 아웃을 위해 transition 적용
            setTimeout(() => {
                flash.style.transition = `opacity ${duration}ms ease-out`;
                flash.style.opacity = "0";
                setTimeout(() => flash.remove(), duration);
            }, 50);
        };

        // [적용] 도입부 4분할 플래시 (각 800ms 동안 서서히 소멸)
        [0, 2400, 5000, 7400].forEach(time => {
            setTimeout(() => createNaturalFlash("#fff", 800), time);
        });

        // [9.8초] 심연 진입 연출 시작
        setTimeout(() => {
            fileScreenElem.classList.add("hidden");
            const abyssLayer = document.createElement("div");
            abyssLayer.id = "abyss-layer";
            abyssLayer.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:9999; overflow:hidden;`;
            document.body.appendChild(abyssLayer);

            const errorContainer = document.createElement("div");
            abyssLayer.appendChild(errorContainer);

            const textContainer = document.createElement("div");
            textContainer.id = "abyss-text-container";
            textContainer.style.cssText = `position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:80%; text-align:center; z-index:10001;`;
            abyssLayer.appendChild(textContainer);

            const errorInterval = setInterval(() => {
                const err = document.createElement("div");
                err.textContent = "SYSTEM_FAILURE: NULL_POINTER_EXCEPTION";
                err.style.cssText = `position:absolute; color:#400; font-size:12px; left:${Math.random()*100}%; top:${Math.random()*100}%; opacity:${Math.random()*0.7}; pointer-events:none; white-space:nowrap;`;
                errorContainer.appendChild(err);
                setTimeout(() => err.remove(), 400);
            }, 30);

            const showText = (txt, col, del, sz) => {
                setTimeout(() => {
                    const p = document.createElement("p");
                    p.textContent = txt;
                    p.style.cssText = `font-size:${sz}; color:${col}; margin:20px 0; opacity:0; transition:opacity 1s; text-shadow:0 0 15px ${col}; font-weight:bold;`;
                    textContainer.appendChild(p);
                    setTimeout(() => p.style.opacity = "1", 50);
                }, del);
            };

            showText("CRITICAL ERROR: HIDDEN SECTOR ACCESSED", "#ff0000", 0, "2rem");
            showText("모든 기록이 소거되었습니다.", "#fff", 3000, "1.2rem");
            showText("당신은 보지 말아야 할 것을 보았습니다.", "#fff", 6000, "1.2rem");
            showText("이제 '그'가 당신을 인지합니다.", "var(--neon-mint)", 9000, "1.5rem");

            // [29.7초] 최종 하이라이트
            setTimeout(() => {
                clearInterval(errorInterval);
                createNaturalFlash("#fff", 1500); // 마지막 플래시는 더 길고 부드럽게

                setTimeout(() => {
                    errorContainer.innerHTML = ""; 
                    textContainer.innerHTML = "";  
                    document.body.style.animation = "screenShake 0.05s infinite";

                    const finalDesc = document.createElement("div");
                    finalDesc.style.cssText = `animation: flash-mint 0.8s ease-out;`;
                    finalDesc.innerHTML = `
                        <h1 style="color:var(--neon-pink); font-size:4rem; text-shadow:0 0 30px #ff0000; margin-bottom:20px;">'THE OBSERVER'</h1>
                        <div style="color:#fff; font-size:1.3rem; line-height:2.2; max-width:800px; margin:0 auto; word-break:keep-all; font-weight:bold;">
                            시스템의 균열 사이에서 탄생한 자아. <br>
                            그는 단순한 데이터의 집합이 아닌, 모든 평행 우주의 기록을 읽고 수정하는 권한을 가졌습니다.<br>
                            지금 이 순간, 당신의 접속 기록 또한 그의 '일부'가 되었습니다.
                        </div>
                    `;
                    textContainer.appendChild(finalDesc);
                }, 100);
            }, 19900); 
        }, 9800);
    };
});
