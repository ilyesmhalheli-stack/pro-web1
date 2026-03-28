// =====================
//  tasks.js - StudyFlow
// =====================

function getTasks() {
    return JSON.parse(localStorage.getItem('studyflow_tasks') || '[]');
}

function saveTasks(tasks) {
    localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function priorityLabel(p) {
    return { haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' }[p] || p;
}

// ── Remplacer le champ "Heure" par un <select> ─────────────────
function replaceTimeInput() {
    const timeInput = document.querySelector('[name="time"]');
    if (!timeInput) return;

    const select = document.createElement('select');
    select.name = 'time';
    select.style.cssText = timeInput.style.cssText;
    select.className = timeInput.className;

    const options = [
        { value: '',        label: 'Sélectionnez un créneau' },
        { value: '9h-12h',  label: '9h - 12h  (Matin)'       },
        { value: '14h-17h', label: '14h - 17h (Après-midi)'  },
        { value: '18h-21h', label: '18h - 21h (Soir)'        },
    ];

    options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.value;
        opt.textContent = o.label;
        select.appendChild(opt);
    });

    timeInput.replaceWith(select);
}

// ── Ajouter une tâche ──────────────────────────────────────────
function addTask() {
    const title       = document.querySelector('[name="title"]').value.trim();
    const type        = document.querySelector('[name="type"]').value;
    const date        = document.querySelector('[name="date"]').value;
    const slot        = document.querySelector('[name="time"]').value;   // '9h-12h' | '14h-17h' | '18h-21h'
    const priority    = document.querySelector('[name="priority"]').value;
    const description = document.querySelector('[name="description"]').value.trim();

    if (!title || !type || !date) {
        alert('Veuillez remplir le titre, le type et la date.');
        return;
    }

    const task = {
        id: Date.now(),
        title, type, date,
        slot,          // créneau horaire choisi
        priority, description,
        status: 'afaire'
    };

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    document.querySelector('.task-form').reset();
    showSuccess();
    renderTasks();
}

function showSuccess() {
    let msg = document.getElementById('task-success-msg');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'task-success-msg';
        msg.style.cssText = 'background:#d4edda;color:#155724;padding:0.8rem 1rem;border-radius:8px;margin-top:1rem;';
        document.querySelector('.task-form').after(msg);
    }
    msg.innerHTML = '✅ Tâche ajoutée ! Elle est visible dans le <a href="planning.html">Planning</a>.';
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 4000);
}

// ── Supprimer ──────────────────────────────────────────────────
function deleteTask(id) {
    if (!confirm('Supprimer cette tâche ?')) return;
    saveTasks(getTasks().filter(t => t.id !== id));
    renderTasks();
}

// ── Terminer / Réactiver ───────────────────────────────────────
function toggleStatus(id) {
    const tasks = getTasks().map(t => {
        if (t.id === id) t.status = t.status === 'afaire' ? 'terminee' : 'afaire';
        return t;
    });
    saveTasks(tasks);
    renderTasks();
}

// ── Filtres ────────────────────────────────────────────────────
let currentFilter = 'toutes';

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}

// ── Rendu de la liste ──────────────────────────────────────────
function renderTasks() {
    const container = document.querySelector('.tasks-list-section');
    if (!container) return;

    let listDiv = document.getElementById('tasks-dynamic-list');
    if (!listDiv) {
        listDiv = document.createElement('div');
        listDiv.id = 'tasks-dynamic-list';
        container.appendChild(listDiv);
    }

    let tasks = getTasks();
    if (currentFilter === 'afaire')    tasks = tasks.filter(t => t.status === 'afaire');
    if (currentFilter === 'terminees') tasks = tasks.filter(t => t.status === 'terminee');

    if (tasks.length === 0) {
        listDiv.innerHTML = '<p style="color:#666;text-align:center;padding:2rem;">Aucune tâche trouvée.</p>';
        return;
    }

    listDiv.innerHTML = tasks.map(t => `
        <div style="
            margin-bottom:1rem; padding:1rem;
            background:${t.status === 'terminee' ? '#f8f9fa' : 'white'};
            border-radius:8px;
            border-left:4px solid ${t.priority === 'haute' ? '#dc3545' : t.priority === 'moyenne' ? '#ffc107' : '#28a745'};
            opacity:${t.status === 'terminee' ? '0.7' : '1'};
        ">
            <h4 style="margin:0 0 0.4rem;">${t.status === 'terminee' ? '✅ ' : ''}<strong>${t.title}</strong></h4>
            <p style="margin:0.2rem 0;">
                <strong>Type:</strong> ${t.type} |
                <strong>Date:</strong> ${formatDate(t.date)}
                ${t.slot ? ' | <strong>Créneau:</strong> ' + t.slot : ''}
            </p>
            <p style="margin:0.2rem 0;"><strong>Priorité:</strong> ${priorityLabel(t.priority)}</p>
            ${t.description ? `<p style="margin:0.4rem 0;color:#555;font-size:0.9rem;">${t.description}</p>` : ''}
            <div style="margin-top:0.8rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
                <button class="btn" onclick="toggleStatus(${t.id})">${t.status === 'afaire' ? 'Terminer' : 'Réactiver'}</button>
                <button class="btn" onclick="deleteTask(${t.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Remplacer le champ heure par un select
    replaceTimeInput();

    // Intercepter le formulaire
    const form = document.querySelector('.task-form');
    if (form) {
        form.removeAttribute('action');
        form.removeAttribute('method');
        form.addEventListener('submit', e => { e.preventDefault(); addTask(); });
    }

    const submitBtn = document.querySelector('.task-form [type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', e => { e.preventDefault(); addTask(); });
    }

    // Boutons filtres
    const filterBtns = document.querySelectorAll('.tasks-list-section .btn');
    const labels = ['toutes', 'afaire', 'terminees'];
    filterBtns.forEach((btn, i) => {
        if (labels[i]) btn.addEventListener('click', () => filterTasks(labels[i]));
    });

    renderTasks();
});
