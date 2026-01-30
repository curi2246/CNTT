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

  <div id="html-data-storage" style="display: none;">
    <section data-folder="The main character">
        <article data-file="Leay_Full_Archive.txt">명칭: 리에(Leay)... 여기에 긴 설명을 적으세요.</article>
        <article data-file="Curo_Half_Archive.txt">명칭: 큐로(Curo)... 여기에 설명을 적으세요.</article>
        <article data-file="Kisune_Full_Archive.txt">명칭: 키스네(Kisune)... 내용을 입력하세요.</article>
        <article data-file="Shiro_Full_Archive.txt">명칭: 시로(Shiro)... 데이터를 입력하세요.</article>
    </section>
</div>
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
            const fDiv = document.createElement("div"); fDiv.className = "folder"; fDiv.textContent = "📁 " + folder;
            const list = document.createElement("div"); list.className = "hidden";
            fDiv.onclick = () => list.classList.toggle("hidden");
            Object.keys(fileSystem[folder]).forEach(file => {
                const fi = document.createElement("div"); fi.className = "file"; fi.textContent = "📄 " + file;
                fi.onclick = (e) => { e.stopPropagation(); openFile(file, fileSystem[folder][file]); };
                list.appendChild(fi);
            });
            dir.appendChild(fDiv); dir.appendChild(list);
        });
    }

    function openFile(name, content) {
        dbView.classList.add("hidden");
        fileScreen.classList.remove("hidden");
        document.getElementById("file-title").textContent = "FILE: " + name;
        window.scrollTo(0, 0);
        const textTarget = document.getElementById("file-text");
        textTarget.innerHTML = ""; window.onscroll = null;
        document.body.style.backgroundColor = "var(--bg-black)";
        const sysMsg = document.createElement("p");
        sysMsg.style.color = "var(--neon-mint)";
        sysMsg.textContent = "> SYSTEM: 기록 열람을 시작합니다...";
        textTarget.appendChild(sysMsg);
        setTimeout(() => {
            sysMsg.remove(); 
            const bodyMsg = document.createElement("p");
            bodyMsg.style.color = "#fff"; bodyMsg.style.whiteSpace = "pre-wrap"; bodyMsg.style.lineHeight = "1.6";
            textTarget.appendChild(bodyMsg);
            let mainIdx = 0;
            function typeBody() {
                if(mainIdx < content.length) {
                    bodyMsg.textContent += content[mainIdx];
                    mainIdx++;
                    setTimeout(typeBody, 2); 
                } else { enableHiddenCheck(name); }
            }
            typeBody();
        }, 800);
    }

    function enableHiddenCheck(fileName) {
        const hZone = document.getElementById("hidden-zone");
        if (isGlitchUnlocked && fileName.includes("Curo")) {
            if(hZone) { hZone.style.display = "block"; hZone.style.opacity = "0"; }
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
                } else { hZone.style.opacity = "0"; }
            };
        }
    }

    document.getElementById("back-btn").onclick = () => {
        window.onscroll = null; document.body.style.backgroundColor = "var(--bg-black)";
        fileScreen.classList.add("hidden"); dbView.classList.remove("hidden"); window.scrollTo(0, 0);
    };

    window.addEventListener("keydown", (e) => {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > 6) inputBuffer = inputBuffer.substring(inputBuffer.length - 6);
        if (inputBuffer === "glitch" && !isGlitchUnlocked) {
            isGlitchUnlocked = true;
            if (bgm) bgm.pause();
            if (glitchBgm) { glitchBgm.currentTime = 0; glitchBgm.play().catch(err => console.log("글리치 재생 실패")); }
            if (musicTitle) musicTitle.textContent = "재생 중: error.mp3.mp3";
            document.body.classList.add("glitch-active");
            setTimeout(() => { document.body.classList.remove("glitch-active"); }, 1500);
        }
    });

    // --- 🔥 [버그 수정] 히든 시퀀스: 음악 시간 기반 타이밍 체크 ---
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
            flash.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${color}; z-index:110000; pointer-events:none; opacity:1;`;
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.transition = `opacity ${duration}ms ease-out`;
                flash.style.opacity = "0";
                setTimeout(() => flash.remove(), duration);
            }, 50);
        };

        const abyssLayer = document.createElement("div");
        abyssLayer.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:99999; overflow:hidden;`;
        document.body.appendChild(abyssLayer);

        const textContainer = document.createElement("div");
        textContainer.style.cssText = `position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:90%; text-align:center; z-index:100001; pointer-events:none;`;
        abyssLayer.appendChild(textContainer);

        // 초기 플래시
        [0, 2400, 5000, 7400].forEach(time => setTimeout(() => createNaturalFlash("#fff", 800), time));

        // 초기 텍스트
        setTimeout(() => {
            const p1 = document.createElement("p");
            p1.textContent = "CRITICAL ERROR: HIDDEN SECTOR ACCESSED";
            p1.style.cssText = "font-size:2rem; color:#f00; margin:20px 0; opacity:0; transition:opacity 2s; font-weight:bold;";
            textContainer.appendChild(p1);
            setTimeout(() => p1.style.opacity = "1", 100);
        }, 0);

        setTimeout(() => {
            const p2 = document.createElement("p");
            p2.textContent = "모든 기록이 소거되었습니다.";
            p2.style.cssText = "font-size:1.2rem; color:#fff; margin:20px 0; opacity:0; transition:opacity 2s; font-weight:bold;";
            textContainer.appendChild(p2);
            setTimeout(() => p2.style.opacity = "1", 100);
        }, 3000);

        setTimeout(() => {
            const p3 = document.createElement("p");
            p3.textContent = "당신은 보지 말아야 할 것을 보았습니다.";
            p3.style.cssText = "font-size:1.2rem; color:#fff; margin:20px 0; opacity:0; transition:opacity 2s; font-weight:bold;";
            textContainer.appendChild(p3);
            setTimeout(() => p3.style.opacity = "1", 100);
        }, 6500);

        // --- 🔥 음악 재생 시간 기반 타이밍 체크 (버그 수정 핵심 부분) ---
        const warningInterval = setInterval(() => {
            // 10초부터 에러 도배 시작
            if (abyssBgm.currentTime >= 10.0 && abyssBgm.currentTime < 19.6) {
                if (Math.random() > 0.8) {
                    const err = document.createElement("div");
                    err.textContent = Math.random() > 0.5 ? "SYSTEM_FAILURE" : "CRITICAL_ERROR";
                    err.style.cssText = `position:fixed; color:#f00; font-family:monospace; font-size:${14 + Math.random() * 26}px; left:${Math.random() * 100}vw; top:${Math.random() * 100}vh; opacity:0.9; font-weight:bold; z-index:100000; white-space:nowrap;`;
                    abyssLayer.appendChild(err);
                    setTimeout(() => err.remove(), 400);
                }
            }

            // 19.6초에 인지 텍스트 등장
            if (abyssBgm.currentTime >= 19.6 && !abyssLayer.dataset.cognized) {
                abyssLayer.dataset.cognized = "true";
                createNaturalFlash("#fff", 1000);
                
                const style = document.createElement('style');
                style.innerHTML = `
                    .glitch-final { animation: shake-rgb 0.1s infinite; }
                    @keyframes shake-rgb {
                        0% { transform: translate(5px, -5px); filter: hue-rotate(90deg); }
                        50% { transform: translate(-5px, 5px); filter: hue-rotate(180deg); }
                        100% { transform: translate(0); }
                    }
                    .認知텍스트 {
                        text-shadow: 0 0 30px #fff, 10px 0 red, -10px 0 blue;
                        color: #fff; font-size: 4.8rem; font-weight: 900;
                    }
                `;
                document.head.appendChild(style);
                abyssLayer.classList.add("glitch-final");
                textContainer.innerHTML = `<h1 class="認知텍스트">이제 '그'가 당신을 인지합니다.</h1>`;
            }

            // 28.5초에 텍스트 소멸
            if (abyssBgm.currentTime >= 28.5 && !abyssLayer.dataset.cleared) {
                abyssLayer.dataset.cleared = "true";
                textContainer.innerHTML = "";
            }

            // 29.6초에 최종 엔딩
            if (abyssBgm.currentTime >= 29.6 && !abyssLayer.dataset.ended) {
                abyssLayer.dataset.ended = "true";
                clearInterval(warningInterval); // 인터벌 종료
                
                abyssLayer.classList.remove("glitch-final");
                abyssLayer.style.background = "#fff";
                textContainer.innerHTML = `
                    <h1 style="color:#000; font-size:2.2rem; letter-spacing:15px; font-weight:900; margin-bottom:30px;">CONNECTION LOST</h1>
                    <p style="color:#111; font-size:1.3rem; line-height:1.8; font-weight:bold;">
                        데이터베이스의 임계점을 초과했습니다.<br>
                        더 이상 기록에 접근할 수 없습니다.
                    </p>
                `;
            }
        }, 100); // 100ms마다 음악 시간 체크
    };
});
