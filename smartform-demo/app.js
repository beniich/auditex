/* ============================================================
   NEXUS AI — SmartForm Intelligence Platform
   Application Logic
   ============================================================ */

// ─── State ───────────────────────────────────────────────────
let formBlocks = [];
let totalSubmissions = 0;
let draggedBlock = null;
let charts = {};

// ─── Block Types Config ───────────────────────────────────────
const BLOCK_TYPES = {
  text:      { icon: '📝', label: 'Texte Libre',     preview: 'Zone de texte...',       ai: false },
  number:    { icon: '🔢', label: 'Numérique',       preview: '0 — 100',                ai: false },
  photo:     { icon: '📷', label: 'Photo / Média',   preview: '📎 Joindre fichier',     ai: true  },
  location:  { icon: '📍', label: 'Localisation',    preview: '📱 Détecter GPS',        ai: true  },
  scale:     { icon: '⚡', label: 'Échelle de Risque',preview: '● ○ ○ ○ ○',            ai: true  },
  checkbox:  { icon: '✅', label: 'Cases à cocher',  preview: '☐ Option 1  ☐ Option 2',ai: false },
  select:    { icon: '🔽', label: 'Sélecteur',       preview: '▼ Choisir...',           ai: false },
  'ai-tag':  { icon: '🤖', label: 'Tag IA Auto',     preview: '🏷️ Classification auto', ai: true  },
  signature: { icon: '✍️', label: 'Signature',       preview: '✍ Signer ici',           ai: false },
};

// ─── Splash Screen ────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('splashFill');
  const msgs = ['Chargement du moteur IA...', 'Initialisation du pipeline...', 'Connexion à GPT-4...', 'Calibration des modèles...'];
  let progress = 0;
  let msgIdx = 0;
  const msgEl = document.querySelector('.splash-sub');

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress >= 100) progress = 100;
    fill.style.width = progress + '%';

    if (msgIdx < msgs.length - 1 && progress > (msgIdx + 1) * 25) {
      msgIdx++;
      msgEl.textContent = msgs[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('splash').classList.add('done');
        document.getElementById('app').classList.remove('hidden');
        loadDefaultContent();
      }, 600);
    }
  }, 200);
});

function loadDefaultContent() {
  loadTemplate();
  renderHeatmap();
  renderGantt();
  initCharts();
  animateKPIs();
  startLiveCounter();
}

// ─── Tab Switching ────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'analytics') initTrendChart();
  if (tab === 'dashboard') { setTimeout(() => { initCharts(); animateKPIs(); }, 100); }
}

// ─── Form Builder ─────────────────────────────────────────────
function dragStart(e) {
  draggedBlock = {
    type: e.currentTarget.dataset.type,
    icon: e.currentTarget.dataset.icon,
    label: e.currentTarget.dataset.label,
  };
  e.dataTransfer.effectAllowed = 'copy';
  
  const canvas = document.querySelector('.canvas-area');
  canvas.classList.add('drag-over');
}

document.addEventListener('dragend', () => {
  document.querySelector('.canvas-area')?.classList.remove('drag-over');
});

function dropBlock(e) {
  e.preventDefault();
  document.querySelector('.canvas-area').classList.remove('drag-over');
  if (!draggedBlock) return;
  
  const type = draggedBlock.type;
  const conf = BLOCK_TYPES[type];
  const block = {
    id: Date.now() + Math.random().toString(36).slice(2),
    type,
    icon: conf.icon,
    label: conf.label,
    required: true,
    ai: conf.ai,
  };
  
  formBlocks.push(block);
  renderCanvas();
  renderPhonePreview();
}

function renderCanvas() {
  const canvas = document.getElementById('formCanvas');
  const empty = document.getElementById('canvasEmpty');
  
  if (formBlocks.length === 0) {
    empty.style.display = 'flex';
    canvas.innerHTML = '';
    canvas.appendChild(empty);
    return;
  }
  
  empty.style.display = 'none';

  // Only re-render if needed
  const existing = canvas.querySelectorAll('.form-block');
  if (existing.length !== formBlocks.length) {
    while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
    
    formBlocks.forEach((block, i) => {
      const el = document.createElement('div');
      el.className = 'form-block';
      el.dataset.id = block.id;
      el.innerHTML = `
        <span class="fb-icon">${block.icon}</span>
        <div class="fb-content">
          <div class="fb-label">${block.label}</div>
          <div class="fb-type">${BLOCK_TYPES[block.type].preview}</div>
        </div>
        ${block.required ? '<span class="fb-required">Requis</span>' : ''}
        ${block.ai ? '<span class="ai-tag-chip">🤖 IA</span>' : ''}
        <button class="fb-delete" onclick="deleteBlock('${block.id}')">✕</button>
      `;
      canvas.appendChild(el);
    });
  }
  
  // Update stats
  document.getElementById('fieldCount').textContent = formBlocks.length;
  document.getElementById('fillTime').textContent = Math.round(formBlocks.length * 12);
}

function deleteBlock(id) {
  formBlocks = formBlocks.filter(b => b.id !== id);
  renderCanvas();
  renderPhonePreview();
}

function clearCanvas() {
  formBlocks = [];
  renderCanvas();
  renderPhonePreview();
  showToast('🗑️ Formulaire réinitialisé', 'info');
}

function loadTemplate() {
  const template = [
    { type: 'scale',     label: 'Niveau de Risque', required: true  },
    { type: 'select',    label: 'Type d\'Incident',  required: true  },
    { type: 'location',  label: 'Secteur / Zone GPS',required: true  },
    { type: 'text',      label: 'Description Libre', required: false },
    { type: 'photo',     label: 'Photo de Preuve',   required: false },
    { type: 'ai-tag',    label: 'Classification IA', required: true  },
  ];

  formBlocks = template.map(t => ({
    id: Date.now() + Math.random().toString(36).slice(2),
    type: t.type,
    icon: BLOCK_TYPES[t.type].icon,
    label: t.label,
    required: t.required,
    ai: BLOCK_TYPES[t.type].ai,
  }));

  renderCanvas();
  renderPhonePreview();
  showToast('✅ Modèle "Alerte Sécurité" chargé', 'success');
}

function renderPhonePreview() {
  const container = document.getElementById('phoneFields');
  container.innerHTML = '';
  formBlocks.slice(0, 5).forEach(block => {
    const el = document.createElement('div');
    el.className = 'phone-field';
    el.innerHTML = `
      <span class="phone-field-icon">${block.icon}</span>
      <label class="phone-field-label">${block.label}</label>
    `;
    container.appendChild(el);
  });
  if (formBlocks.length > 5) {
    const more = document.createElement('div');
    more.className = 'phone-field';
    more.innerHTML = `<label class="phone-field-label" style="color:#6366f1">+${formBlocks.length - 5} champs supplémentaires...</label>`;
    container.appendChild(more);
  }
  document.getElementById('previewTitle').textContent = document.getElementById('formTitle').value;
}

function filterBlocks(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.library-block').forEach(el => {
    const label = el.dataset.label.toLowerCase();
    el.style.display = label.includes(q) ? 'flex' : 'none';
  });
}

function publishForm() {
  if (formBlocks.length === 0) {
    showToast('⚠️ Ajoutez au moins un champ', 'warn');
    return;
  }
  showToast(`🚀 Formulaire "${document.getElementById('formTitle').value}" publié ! ${formBlocks.length} champs disponibles sur le terrain.`, 'success');
  totalSubmissions += Math.floor(Math.random() * 5 + 1);
  document.getElementById('totalSubmissions').textContent = totalSubmissions;
}

function simulateSubmit() {
  showToast('📤 Soumission envoyée vers le Pipeline IA...', 'info');
  totalSubmissions += 1;
  document.getElementById('totalSubmissions').textContent = totalSubmissions;
  setTimeout(() => showToast('✅ Données traitées et harmonisées en 2.4s !', 'success'), 1800);
}

// ─── Pipeline ─────────────────────────────────────────────────
async function runPipeline() {
  const stages = ['ingest', 'clean', 'classify', 'output'];
  const arrows = ['arrow1', 'arrow2', 'arrow3'];
  const logs = [
    { type: 'run', msg: '▶ Pipeline IA démarré — 4 entrées brutes détectées' },
    { type: 'info', msg: '▷ [INGEST] Lecture des soumissions terrain...' },
    { type: 'success', msg: '✓ [INGEST] 4 entrées chargées (3 texte, 1 structuré)' },
    { type: 'run', msg: '▷ [NLP] Analyse sémantique en cours...' },
    { type: 'info', msg: '  — Détection synonymes: "cassée" → "dégradé"' },
    { type: 'info', msg: '  — Extraction entité: "secteur nord" → GPS [48.8N, 2.3E]' },
    { type: 'warn', msg: '  — Doublon détecté: entrées 1 et 3 fusionnées' },
    { type: 'success', msg: '✓ [NLP] 3 entrées distinctes après harmonisation' },
    { type: 'run', msg: '▷ [CLASSIFY] Classification taxonomique...' },
    { type: 'info', msg: '  — SÉCURITÉ > MATÉRIEL > ÉCHELLE (confiance: 94.2%)' },
    { type: 'info', msg: '  — Priorité calculée: CRITIQUE (score 9.4/10)' },
    { type: 'success', msg: '✓ [CLASSIFY] Objet structuré créé avec succès' },
    { type: 'success', msg: '🏁 Pipeline complet — 2.4s | Donnée prête pour analyse IA' },
  ];

  const logContainer = document.getElementById('logEntries');
  logContainer.innerHTML = '';

  for (let i = 0; i < stages.length; i++) {
    // Animate stage
    const stage = document.getElementById('stage-' + stages[i]);
    const statusEl = stage.querySelector('[id^="stage-"]') || stage.lastElementChild;
    const statusId = 'stage-' + stages[i] + '-status';
    const statusEl2 = document.getElementById(statusId);
    
    stage.classList.add('running');
    if (statusEl2) { statusEl2.textContent = '⟳ En cours...'; statusEl2.className = 'stage-status running'; }
    if (i > 0 && arrows[i-1]) document.getElementById(arrows[i-1]).classList.add('active');

    // Add logs for this stage
    const stageLogs = logs.filter((_, idx) => {
      if (i === 0) return idx <= 2;
      if (i === 1) return idx >= 3 && idx <= 6;
      if (i === 2) return idx >= 7 && idx <= 10;
      return idx >= 11;
    });

    for (const log of stageLogs) {
      await delay(350);
      addLog(log.type, log.msg, logContainer);
    }

    await delay(600);
    stage.classList.remove('running');
    stage.classList.add('done');
    if (statusEl2) { statusEl2.textContent = '✓ Terminé'; statusEl2.className = 'stage-status done'; }
  }
  
  showToast('✅ Pipeline complet ! 3 entrées structurées prêtes.', 'success');
}

function addLog(type, msg, container) {
  const el = document.createElement('div');
  el.className = 'log-entry ' + type;
  el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

// ─── Analytics ────────────────────────────────────────────────
function showAnomalyDetail(el, type) {
  const details = {
    echelle: {
      title: 'Récurrence Critique — Échelles Défectueuses',
      severity: 'CRITIQUE',
      color: '#ef4444',
      detail: `L'IA a détecté 5 signalements d'échelles défectueuses en 30 jours concentrés sur le Secteur Nord. Le modèle de régression temporelle prédit un accident avec une probabilité de 73% dans les 15 prochains jours si aucune action n'est prise.
      
La corrélation spatiale montre que 80% des incidents surviennent entre 14h et 17h lors des interventions de type "maintenance préventive".

Coût d'accident évité estimé : 38,000€. Coût d'intervention immédiate : 2,400€. ROI de l'action : 15.8x.`,
      action: '🛒 Commander 4 nouvelles échelles',
    },
    fatigue: {
      title: 'Indicateur de Fatigue — Pôle Dépannage',
      severity: 'ÉLEVÉ',
      color: '#f59e0b',
      detail: `L'analyse des temps de réponse sur 14 jours révèle une augmentation de +34% de la latence opérationnelle. Le modèle de corrélation montre un lien significatif (r=0.87) avec l'augmentation du volume de missions (+22%).

Les agents du Pôle Dépannage ont en moyenne dépassé leur quota hebdomadaire de 18% sur les 3 dernières semaines. Le risque d'épuisement professionnel est classé "Élevé".`,
      action: '📅 Réviser les plannings',
    },
    vehicule: {
      title: 'Corrélation Pannes — Véhicule #042',
      severity: 'MODÉRÉ',
      color: '#6366f1',
      detail: `Le véhicule #042 est impliqué dans 80% des pannes signalées sur le Secteur X au cours des 45 derniers jours. L'analyse des codes d'erreur télémétriques suggère une défaillance progressive du système de frein principal.

Kilométrage actuel : 127,430 km. Dernière révision : il y a 8 mois. Recommandation : révision complète dans les 72h.`,
      action: '🔧 Planifier la maintenance',
    },
  };

  const d = details[type];
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">${d.title}</div>
    <span class="modal-severity" style="background:${d.color}20;color:${d.color};border:1px solid ${d.color}40">${d.severity}</span>
    <div class="modal-detail">
      ${d.detail.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
    </div>
    <button class="btn-primary modal-action" onclick="closeModal();showToast('✅ Action assignée au responsable', 'success')">${d.action}</button>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function generateSynthesis() {
  const el = document.getElementById('synthesisText');
  el.style.opacity = '0.3';
  setTimeout(() => {
    el.style.opacity = '1';
    showToast('🧠 Synthèse régénérée par GPT-4', 'success');
  }, 1200);
}

function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx || charts.trend) return;
  
  const labels = ['J-30','J-25','J-20','J-15','J-10','J-5','Auj','J+5','J+10','J+15','J+30'];
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Incidents',
        data: [12, 15, 11, 18, 23, 28, 35, null, null, null, null],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },{
        label: 'Prédiction IA',
        data: [null, null, null, null, null, null, 35, 38, 32, 28, 20],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.05)',
        borderDash: [6, 4],
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      }
    }
  });
}

// ─── Dashboard Charts ─────────────────────────────────────────
function initCharts() {
  initMainChart();
  initDonutChart();
}

function initMainChart() {
  const ctx = document.getElementById('mainChart');
  if (!ctx) return;
  if (charts.main) { charts.main.destroy(); }
  
  charts.main = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
      datasets: [
        { label: 'Sécurité', data: [42, 58, 51, 73, 64, 89, 94, 78], backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
        { label: 'Maintenance', data: [31, 24, 38, 29, 35, 41, 53, 47], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
        { label: 'RH', data: [15, 19, 22, 18, 25, 21, 28, 23], backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 6 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      }
    }
  });
}

function initDonutChart() {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;
  if (charts.donut) { charts.donut.destroy(); }
  
  charts.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critique', 'Élevé', 'Moyen', 'Faible'],
      datasets: [{
        data: [23, 31, 28, 18],
        backgroundColor: ['#ef4444', '#f59e0b', '#6366f1', '#22c55e'],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: { legend: { display: false } },
    }
  });
}

// ─── Heatmap ──────────────────────────────────────────────────
function renderHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;
  const secteurs = [
    'Nord','Nord-Est','Est','Sud-Est','Sud','Sud-Ouest','Ouest',
    'Centre','Nord-A','Nord-B','Est-A','Est-B','Sud-A','Centre-B',
    'Zone-1','Zone-2','Zone-3','Zone-4','Zone-5','Zone-6','Zone-7',
  ];
  const values = [9, 3, 5, 7, 8, 2, 4, 6, 9, 7, 3, 5, 8, 4, 6, 2, 7, 9, 3, 5, 6];
  
  grid.innerHTML = '';
  values.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'hm-cell';
    const alpha = v / 10;
    cell.style.background = v >= 8 ? `rgba(239,68,68,${alpha})` : 
                             v >= 6 ? `rgba(245,158,11,${alpha})` : 
                             v >= 4 ? `rgba(99,102,241,${alpha})` : 
                             `rgba(34,197,94,${alpha * 0.8})`;
    cell.title = `${secteurs[i] || 'Zone '+i}: ${v}/10`;
    cell.onclick = () => showToast(`📍 ${secteurs[i] || 'Zone '+i}: Niveau ${v}/10`, v >= 8 ? 'error' : 'warn');
    grid.appendChild(cell);
  });
}

// ─── Gantt ────────────────────────────────────────────────────
function renderGantt() {
  const gantt = document.getElementById('ganttChart');
  if (!gantt) return;
  
  const tasks = [
    { label: 'Achat Échelles', start: 0, len: 15, color: '#6366f1', status: 'done' },
    { label: 'Révision Véh. #042', start: 20, len: 40, color: '#22c55e', status: 'run' },
    { label: 'Réorg. Planning', start: 35, len: 55, color: '#f59e0b', status: 'plan' },
    { label: 'Audit Sectoriel', start: 60, len: 90, color: '#a855f7', status: 'plan' },
    { label: 'Formation Agents', start: 50, len: 75, color: '#06b6d4', status: 'plan' },
  ];
  
  gantt.innerHTML = tasks.map(t => `
    <div class="gantt-row">
      <div class="gantt-label" title="${t.label}">${t.label}</div>
      <div class="gantt-track">
        <div class="gantt-bar" style="left:${t.start}%;width:${t.len - t.start}%;background:${t.color};opacity:${t.status === 'done' ? 1 : t.status === 'run' ? 0.8 : 0.4}"></div>
      </div>
    </div>
  `).join('');
}

// ─── KPI Animation ────────────────────────────────────────────
function animateKPIs() {
  document.querySelectorAll('.kpi-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('fr-FR');
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

// ─── Live Counter ─────────────────────────────────────────────
function startLiveCounter() {
  setInterval(() => {
    if (Math.random() < 0.3) {
      totalSubmissions += 1;
      document.getElementById('totalSubmissions').textContent = totalSubmissions;
    }
  }, 4000);
}

// ─── Report Generation ────────────────────────────────────────
function generateReport() {
  showToast('🤖 Génération du rapport IA en cours...', 'info');
  const btn = document.querySelector('#tab-reports .btn-primary');
  const orig = btn.innerHTML;
  btn.innerHTML = '⏳ Génération...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.innerHTML = '✅ Rapport Généré';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
    showToast('📄 Rapport Avril 2026 généré — 31 pages | Export PDF disponible', 'success');
  }, 2500);
}

function exportDashboard() {
  showToast('📥 Export PDF du dashboard en cours...', 'info');
  setTimeout(() => showToast('✅ Dashboard exporté : Rapport_Avril_2026.pdf', 'success'), 2000);
}

// ─── Toast ────────────────────────────────────────────────────
let toastTimer;
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const colors = { success: '#22c55e', error: '#ef4444', warn: '#f59e0b', info: '#6366f1' };
  
  toast.style.borderLeft = `3px solid ${colors[type] || colors.info}`;
  toast.textContent = message;
  toast.classList.remove('hidden');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ─── Update form title in preview ────────────────────────────
document.addEventListener('input', e => {
  if (e.target.id === 'formTitle') {
    document.getElementById('previewTitle').textContent = e.target.value || 'Mon Formulaire';
  }
});
