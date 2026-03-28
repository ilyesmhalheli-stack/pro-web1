// =======================
//  planning.js - StudyFlow
// =======================

function getTasks() {
    return JSON.parse(localStorage.getItem('studyflow_tasks') || '[]');
}

function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function toYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatFR(date) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

let currentMonday = getMonday(new Date());

// Les 3 créneaux — une ligne par créneau
const SLOTS = ['9h-12h', '14h-17h', '18h-21h'];

// ── Rendu ──────────────────────────────────────────────────────
function renderPlanning() {
    const tasks = getTasks();
    const days  = Array.from({ length: 7 }, (_, i) => addDays(currentMonday, i));

    // Label semaine
    const weekLabel = document.querySelector('section div h3');
    if (weekLabel) {
        const fin = days[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        weekLabel.textContent = `${formatFR(days[0])} – ${fin}`;
    }

    const tbody = document.querySelector('.calendar-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Une ligne par créneau horaire
    SLOTS.forEach(slot => {
        const tr = document.createElement('tr');

        days.forEach(day => {
            const ymd = toYMD(day);

            // Afficher seulement les tâches dont le créneau correspond à cette ligne
            const dayTasks = tasks.filter(t => t.date === ymd && t.slot === slot);

            const td = document.createElement('td');
            td.className = 'split-cell';
            td.style.cssText = 'padding:1rem; border:1px solid #ddd; vertical-align:top;';

            td.innerHTML = `
                <div class="cell-date"  style="font-weight:bold; color:#007bff;">${formatFR(day)}</div>
                <div class="cell-hours" style="color:#666; font-size:0.9rem; margin-bottom:4px;">${slot}</div>
            `;

            dayTasks.forEach(t => {
                const colors = {
                    haute:   { bg: '#fde8e8', color: '#c0392b', border: '#dc3545' },
                    moyenne: { bg: '#fff8e1', color: '#b8860b', border: '#ffc107' },
                    basse:   { bg: '#e8f5e9', color: '#1e7e34', border: '#28a745' },
                };
                const c = colors[t.priority] || colors.basse;

                const pill = document.createElement('div');
                pill.style.cssText = `
                    margin-top:4px; padding:3px 6px; border-radius:4px;
                    font-size:0.82rem; border-left:3px solid ${c.border};
                    background:${c.bg}; color:${c.color};
                    ${t.status === 'terminee' ? 'opacity:0.5;text-decoration:line-through;' : ''}
                `;
                pill.title = t.description || '';
                pill.innerHTML = `<strong>${t.type}</strong> · ${t.title}`;
                td.appendChild(pill);
            });

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    updateStats(tasks, days);
}

// ── Stats ──────────────────────────────────────────────────────
function updateStats(tasks, days) {
    const ymds      = new Set(days.map(d => toYMD(d)));
    const weekTasks = tasks.filter(t => ymds.has(t.date));

    const statDivs = document.querySelectorAll('[style*="font-size: 1.5rem"]');
    if (statDivs[0]) statDivs[0].textContent = weekTasks.length;
    if (statDivs[1]) statDivs[1].textContent = weekTasks.filter(t => t.priority === 'haute').length;
    if (statDivs[2]) statDivs[2].textContent = weekTasks.filter(t => t.priority === 'moyenne').length;
    if (statDivs[3]) statDivs[3].textContent = weekTasks.filter(t => t.priority === 'basse').length;
}

// ── Navigation ─────────────────────────────────────────────────
function bindNavigation() {
    const btns = document.querySelectorAll('section > div > .btn');
    btns.forEach(btn => {
        if (btn.textContent.includes('précédente')) {
            btn.addEventListener('click', () => {
                currentMonday = addDays(currentMonday, -7);
                renderPlanning();
            });
        }
        if (btn.textContent.includes('suivante')) {
            btn.addEventListener('click', () => {
                currentMonday = addDays(currentMonday, 7);
                renderPlanning();
            });
        }
    });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    bindNavigation();
    renderPlanning();
});
