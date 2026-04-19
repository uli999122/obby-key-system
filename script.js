// ========== CONFIGURACIÓN ==========
const GAME_ID = "96790255677385";
const GAME_URL = `https://www.roblox.com/games/${GAME_ID}/TEMPORADA-2-Obby-BETA`;
const UPDATES_URL = "updates.json";

const DISCORD_URL = "https://discord.gg/TMearmbRAY";
const YOUTUBE_URL = "https://youtube.com/@obbybeta?si=f9k7Xira-_Xlo7Qu";

// ========== MERCADO DE DIAMANTES ==========
let diamondValue = 100;
let demandLevel = "Media";
let nextIncreaseSeconds = 30 * 60;
let timerInterval = null;

function loadMarketData() {
    const saved = localStorage.getItem("diamondMarket");
    if (saved) {
        const data = JSON.parse(saved);
        diamondValue = data.value;
        demandLevel = data.demand;
        nextIncreaseSeconds = data.nextIncrease || 30 * 60;
    }
    updateMarketUI();
    startTimer();
}

function saveMarketData() {
    localStorage.setItem("diamondMarket", JSON.stringify({
        value: diamondValue,
        demand: demandLevel,
        nextIncrease: nextIncreaseSeconds
    }));
}

function updateMarketUI() {
    document.getElementById("diamondValue").innerText = diamondValue;
    document.getElementById("diamondDemand").innerText = demandLevel;
    updateDemandLevel();
}

function updateDemandLevel() {
    if (diamondValue >= 150) demandLevel = "Muy alta";
    else if (diamondValue >= 120) demandLevel = "Alta";
    else if (diamondValue >= 80) demandLevel = "Media";
    else if (diamondValue >= 50) demandLevel = "Baja";
    else demandLevel = "Muy baja";
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (nextIncreaseSeconds <= 0) {
            diamondValue = Math.min(diamondValue + 5, 200);
            updateDemandLevel();
            saveMarketData();
            updateMarketUI();
            nextIncreaseSeconds = 30 * 60;
        } else {
            nextIncreaseSeconds--;
        }
        const minutes = Math.floor(nextIncreaseSeconds / 60);
        const seconds = nextIncreaseSeconds % 60;
        document.getElementById("nextChange").innerHTML = `Próxima subida en: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }, 1000);
}

function reportDiamond() {
    diamondValue = Math.max(diamondValue - 10, 10);
    updateDemandLevel();
    saveMarketData();
    updateMarketUI();
    nextIncreaseSeconds = 30 * 60;
    showNotification("💎 Diamante reportado! Valor bajó -10", "success");
}

// ========== ESTADÍSTICAS ==========
async function fetchPlayerStats(username) {
    // SIMULACIÓN - Reemplazar con backend real después
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                coins: Math.floor(Math.random() * 5000),
                wins: Math.floor(Math.random() * 200),
                diamonds: Math.floor(Math.random() * 50)
            });
        }, 800);
    });
}

async function searchStats() {
    const username = document.getElementById("statsUsername").value.trim();
    if (!username) {
        document.getElementById("statsError").innerText = "Ingresa un nombre";
        return;
    }
    document.getElementById("statsError").innerText = "Buscando...";
    const result = await fetchPlayerStats(username);
    if (result.success) {
        document.getElementById("statsCoins").innerText = result.coins;
        document.getElementById("statsWins").innerText = result.wins;
        document.getElementById("statsDiamonds").innerText = result.diamonds;
        document.getElementById("statsResult").style.display = "flex";
        document.getElementById("statsError").innerText = "";
    } else {
        document.getElementById("statsError").innerText = "No encontrado";
        document.getElementById("statsResult").style.display = "none";
    }
}

function showStatsModal() {
    const modal = document.getElementById("statsModal");
    modal.style.display = "flex";
    document.getElementById("statsUsername").value = "";
    document.getElementById("statsResult").style.display = "none";
    document.getElementById("statsError").innerText = "";
}

// ========== PARTÍCULAS (tus animaciones originales) ==========
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.2})`
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    }
    requestAnimationFrame(drawParticles);
}

// ========== MÚSICA ==========
let audio = null;
let isMusicPlaying = false;

function initAudio() {
    audio = new Audio("https://cdn.pixabay.com/download/audio/2022/05/16/audio_5b7f4d0c4c.mp3?filename=electronic-chill-126109.mp3");
    audio.loop = true;
    audio.volume = 0.3;
}

function playMusic() {
    if (!audio) initAudio();
    audio.play().catch(e => console.log);
    isMusicPlaying = true;
    document.getElementById("musicStatus").innerText = "Música ON";
    document.getElementById("musicIcon").className = "fas fa-music";
}

function stopMusic() {
    if (audio) audio.pause();
    isMusicPlaying = false;
    document.getElementById("musicStatus").innerText = "Música OFF";
    document.getElementById("musicIcon").className = "fas fa-music-slash";
}

function showNotification(message, type) {
    const notif = document.createElement("div");
    notif.style.position = "fixed";
    notif.style.bottom = "80px";
    notif.style.right = "20px";
    notif.style.background = type === "success" ? "#1db954" : "#a855f7";
    notif.style.color = "white";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "30px";
    notif.style.zIndex = "1000";
    notif.style.fontSize = "14px";
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// ========== ACTUALIZACIONES ==========
async function loadUpdates() {
    try {
        const response = await fetch(UPDATES_URL + "?t=" + Date.now());
        const data = await response.json();
        renderUpdates(data.updates);
    } catch (error) {
        renderUpdates([{ version: "V.2.1", date: "15 Enero 2025", title: "Lanzamiento", changes: ["✨ Nuevos niveles"] }]);
    }
}

function renderUpdates(updates) {
    const container = document.getElementById("updatesGrid");
    if (!container) return;
    container.innerHTML = updates.map(update => `
        <div class="update-card">
            <div class="update-version">${update.version}</div>
            <h3>${update.title}</h3>
            <div class="update-date"><i class="far fa-calendar-alt"></i> ${update.date}</div>
            <ul class="update-list">${update.changes.map(c => `<li><i class="fas fa-check-circle"></i> ${c}</li>`).join("")}</ul>
        </div>
    `).join("");
}

// ========== EVENTOS ==========
document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    createParticles();
    drawParticles();
    loadUpdates();
    loadMarketData();

    document.getElementById("musicPlayer").addEventListener("click", () => {
        if (isMusicPlaying) stopMusic();
        else playMusic();
    });

    document.getElementById("playNowBtn")?.addEventListener("click", () => window.open(GAME_URL, "_blank"));
    document.getElementById("openRobloxBtn")?.addEventListener("click", () => window.open(GAME_URL, "_blank"));
    document.getElementById("statsBtn")?.addEventListener("click", showStatsModal);
    document.getElementById("fetchStatsBtn")?.addEventListener("click", searchStats);
    document.getElementById("reportDiamondBtn")?.addEventListener("click", reportDiamond);

    document.getElementById("discordLink")?.setAttribute("href", DISCORD_URL);
    document.getElementById("youtubeLink")?.setAttribute("href", YOUTUBE_URL);
    document.getElementById("robloxLink")?.setAttribute("href", GAME_URL);

    const modal = document.getElementById("statsModal");
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => modal.style.display = "none");
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    const mobileBtn = document.getElementById("mobileMenu");
    const navLinks = document.querySelector(".nav-links");
    mobileBtn?.addEventListener("click", () => navLinks.classList.toggle("active"));

    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 500);
    }, 1000);

    window.addEventListener("resize", () => {
        resizeCanvas();
        createParticles();
    });
});
