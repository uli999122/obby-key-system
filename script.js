let currentTab = 0;
const tabs = [{ title: "Google", url: "https://www.google.com" }];

const iframe = document.getElementById('webView');
const urlBar = document.getElementById('urlBar');
const tabBar = document.getElementById('tabBar');

function renderTabs() {
    tabBar.innerHTML = '';
    tabs.forEach((tab, index) => {
        const div = document.createElement('div');
        div.className = `tab ${index === currentTab ? 'active' : ''}`;
        div.textContent = tab.title;
        div.onclick = () => switchTab(index);
        tabBar.appendChild(div);
    });
}

function switchTab(index) {
    currentTab = index;
    iframe.src = tabs[index].url;
    urlBar.value = tabs[index].url;
    renderTabs();
}

function newTab() {
    const newIndex = tabs.length;
    tabs.push({ title: "Nueva pestaña", url: "https://www.google.com" });
    renderTabs();
    switchTab(newIndex);
}

function goToUrl() {
    let url = urlBar.value.trim();
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    tabs[currentTab].url = url;
    tabs[currentTab].title = url.includes('google') ? 'Google' : 'Página';
    iframe.src = url;
    renderTabs();
}

function goToUrlDirect(url) {
    tabs[currentTab].url = url;
    tabs[currentTab].title = url.includes('google') ? 'Google' : url.split('//')[1].split('/')[0];
    iframe.src = url;
    urlBar.value = url;
    renderTabs();
}

function reloadPage() { iframe.src = iframe.src; }
function goBack() { iframe.contentWindow.history.back(); }
function goForward() { iframe.contentWindow.history.forward(); }

// Eventos
urlBar.addEventListener('keypress', e => { if (e.key === 'Enter') goToUrl(); });

iframe.onload = () => {
    try {
        urlBar.value = iframe.contentWindow.location.href;
    } catch(e) {}
};

// Modo oscuro por defecto (moderno)
document.documentElement.style.setProperty('--bg', '#0f0f0f');

function toggleTheme() {
    const isDark = document.body.style.background === 'rgb(15, 15, 15)';
    if (isDark) {
        document.body.style.background = '#f8f9fa';
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.body.style.background = '#0f0f0f';
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

// Inicializar
renderTabs();
