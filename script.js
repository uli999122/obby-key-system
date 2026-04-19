// ========== CONFIGURACIÓN DEL JUEGO ==========
const GAME_ID = "96790255677385";
const GAME_URL = `https://www.roblox.com/games/${GAME_ID}/TEMPORADA-2-Obby-BETA`;

// URL del archivo JSON de actualizaciones (debe estar en el mismo repositorio)
const UPDATES_URL = "updates.json";

// ========== PARTÍCULAS ==========
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
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

// ========== CARGAR ACTUALIZACIONES ==========
async function loadUpdates() {
    try {
        const response = await fetch(UPDATES_URL + "?t=" + Date.now());
        if (!response.ok) throw new Error("No se pudo cargar");
        const data = await response.json();
        renderUpdates(data.updates);
    } catch (error) {
        console.error("Error cargando actualizaciones:", error);
        // Mostrar mensaje de error o datos de ejemplo
        const fallbackUpdates = [
            {
                version: "V.2.1",
                date: "15 Enero 2025",
                title: "🎯 Lanzamiento Oficial",
                changes: ["✨ 20 nuevos niveles", "⚡ Mejoras de rendimiento", "🐛 Corrección de bugs"]
            }
        ];
        renderUpdates(fallbackUpdates);
    }
}

function renderUpdates(updates) {
    const container = document.getElementById("updatesGrid");
    if (!container) return;
    container.innerHTML = updates.map(update => `
        <div class="update-card">
            <div class="update-version">${update.version}</div>
            <h3>${update.title}</h3>
            <div class="update-date">
                <i class="far fa-calendar-alt"></i> ${update.date}
                ${update.type === "major" ? '<span class="badge-new">NUEVO</span>' : ''}
            </div>
            <ul class="update-list">
                ${update.changes.map(change => `<li><i class="fas fa-check-circle"></i> ${change}</li>`).join("")}
            </ul>
        </div>
    `).join("");
}

// ========== MÚSICA DE FONDO ==========
let audio = null;
let isMusicPlaying = false;

function initAudio() {
    // Usamos un audio de fondo libre de derechos de Pixabay (synthwave chill)
    // Este enlace es solo un ejemplo; puedes cambiarlo por cualquier URL de audio .mp3
    audio = new Audio("https://cdn.pixabay.com/download/audio/2022/05/16/audio_5b7f4d0c4c.mp3?filename=electronic-chill-126109.mp3");
    audio.loop = true;
    audio.volume = 0.3;
}

function playMusic() {
    if (!audio) initAudio();
    audio.play().catch(e => console.log("Error al reproducir música", e));
    isMusicPlaying = true;
    document.getElementById("musicStatus").innerText = "Música ON";
    document.getElementById("musicIcon").className = "fas fa-music";
}

function stopMusic() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    isMusicPlaying = false;
    document.getElementById("musicStatus").innerText = "Música OFF";
    document.getElementById("musicIcon").className = "fas fa-music-slash";
}

// ========== EVENTOS ==========
document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    createParticles();
    drawParticles();
    loadUpdates();

    // Botón de música
    const musicBtn = document.getElementById("musicPlayer");
    musicBtn.addEventListener("click", () => {
        if (isMusicPlaying) stopMusic();
        else playMusic();
    });

    // Botones de juego
    const playBtns = [document.getElementById("playNowBtn"), document.getElementById("openRobloxBtn")];
    playBtns.forEach(btn => {
        if (btn) btn.addEventListener("click", () => window.open(GAME_URL, "_blank"));
    });

    // Discord (puedes cambiar el enlace)
    document.getElementById("copyDiscordBtn")?.addEventListener("click", () => {
        navigator.clipboard.writeText("https://discord.gg/tu-servidor");
        alert("¡Enlace de Discord copiado!");
    });

    // Enlaces sociales (edítalos según tus redes)
    document.getElementById("discordLink")?.setAttribute("href", "https://discord.gg/tu-servidor");
    document.getElementById("twitterLink")?.setAttribute("href", "https://twitter.com/tu-usuario");
    document.getElementById("youtubeLink")?.setAttribute("href", "https://youtube.com/c/tu-canal");
    document.getElementById("robloxLink")?.setAttribute("href", GAME_URL);

    // Menú móvil
    const mobileBtn = document.getElementById("mobileMenu");
    const navLinks = document.querySelector(".nav-links");
    if (mobileBtn) {
        mobileBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
    }

    // Cerrar loader
    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 500);
    }, 1000);

    window.addEventListener("resize", () => {
        resizeCanvas();
        particles = [];
        createParticles();
    });
});
