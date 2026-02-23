/**
 * AI-Lead Engine - Control Center Logic v2
 * Enhanced for live demo simulation and lead intake
 */

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal-content');
    const simulateBtn = document.getElementById('btn-simulate');
    const leadFeed = document.querySelector('.lead-feed');
    const filterTags = document.querySelectorAll('.filter-tag');

    const logMessages = [
        { time: '12:05:01', msg: 'Lead detectado desde LinkedIn Ads.', type: 'info', agent: 'search' },
        { time: '12:05:03', msg: 'Agente de Búsqueda: Extrayendo historial de Lucía Torres...', type: 'ai', agent: 'search' },
        { time: '12:05:05', msg: 'Analizando reporte anual de GlobalTech Q4.', type: 'ai', agent: 'search' },
        { time: '12:05:06', msg: 'Agente de Clasificación: Calculando Fit Score (98/100)...', type: 'ai', agent: 'scoring' },
        { time: '12:05:07', msg: '¡Lead Calificado! Notificación enviada a Slack.', type: 'success', agent: 'scoring' },
        { time: '12:05:12', msg: 'Agente de Escritura: Personalizando propuesta para México...', type: 'ai', agent: 'writer' },
        { time: '12:05:15', msg: 'Borrador de Email generado con éxito.', type: 'success', agent: 'writer' }
    ];

    const emailTemplates = {
        'Lucía Torres': {
            to: 'lucia.torres@globaltech.com',
            subject: 'Propuesta Estratégica: Expansión GlobalTech México',
            body: `Hola Lucía,\n\nEspero que estés muy bien.\n\nHe estado siguiendo de cerca las noticias sobre la expansión de GlobalTech a México. Es un paso emocionante y felicidades por el anuncio.\n\nEntiendo que con este crecimiento, los desafíos logísticos suelen ser el cuello de botella principal, especialmente en la coordinación fronteriza. Nuestra solución de IA está diseñada precisamente para automatizar esa capa operativa que hoy les quita tiempo valioso.\n\nMe encantaría comentarte cómo estamos ayudando a empresas similares a escalar sin aumentar su carga administrativa en un 40%.\n\n¿Tendrías 15 minutos el jueves para una breve videollamada?\n\nSaludos,\n[Tu Nombre]`
        },
        'Marco Rossi': {
            to: 'mrossi@dataflow.systems',
            subject: 'Optimización de Costos de Infraestructura - DataFlow',
            body: `Hola Marco,\n\nVi que están buscando activamente perfiles DevOps Senior para DataFlow Systems. Es evidente que están escalando su infraestructura a un ritmo impresionante.\n\nAnalizando las vacantes, noté que buscan optimizar la eficiencia operativa en la nube. Nuestra herramienta de IA ayuda a CTOs a detectar redundancias en la infraestructura que suelen pasar desapercibidas, reduciendo costos operativos hasta en un 25% de forma automatizada.\n\n¿Te interesaría ver un demo rápido de cómo podríamos integrarnos con su stack actual?\n\nAtentamente,\n[Tu Nombre]`
        },
        'Elena Smith': {
            to: 'elena.smith@cloudnexus.io',
            subject: 'Automatización de Operaciones - CloudNexus 2024',
            body: `Hola Elena,\n\nFue un gusto ver que asististe al webinar de "Automatización 2024". Me pareció muy relevante tu pregunta sobre la escalabilidad de procesos manuales.\n\nSabiendo que CloudNexus ha incrementado su presupuesto de IT para este año, creo que hay una oportunidad perfecta para implementar flujos de trabajo "AI-First" en el departamento de operaciones.\n\nPodemos transformar las 4 horas de investigación manual que hace tu equipo diariamente en apenas 5 minutos de supervisión.\n\n¿Podemos agendar una charla de 10 minutos para mostrarte el ROI proyectado para CloudNexus?\n\nUn saludo,\n[Tu Nombre]`
        },
        'Julian Barnes': {
            to: 'jbarnes@technexus.com',
            subject: 'Enhorabuena por la Serie B + Estrategia de Crecimiento',
            body: `Hola Julian,\n\nMuchas felicidades por cerrar la Serie B de $20M para TechNexus. ¡Es un hito increíble!\n\nHe visto que están escalando el equipo de ventas rápidamente. En esta etapa de hipercrecimiento, el mayor riesgo es que tus mejores vendedores gasten su tiempo buscando datos en lugar de cerrando tratos.\n\nNuestro motor de IA puede encargarse de toda la prospección y personalización de mensajes para que tu nuevo equipo se enfoque 100% en la ejecución.\n\n¿Te parecería bien si te envío un breve documento con la estrategia que hemos diseñado para TechNexus?\n\nSaludos,\n[Tu Nombre]`
        }
    };

    const modal = document.getElementById('email-modal');
    const closeModal = document.getElementById('close-modal');
    const emailTo = document.getElementById('email-to');
    const emailSubject = document.getElementById('email-subject');
    const emailBody = document.getElementById('email-body');
    const btnCopy = document.getElementById('btn-copy');

    let currentLogs = [];

    // Copy to clipboard logic
    btnCopy.addEventListener('click', () => {
        const text = emailBody.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '<i data-lucide="check"></i> Copied!';
            btnCopy.style.background = 'rgba(16, 185, 129, 0.1)';
            btnCopy.style.color = 'var(--accent-emerald)';
            lucide.createIcons();

            setTimeout(() => {
                btnCopy.innerHTML = originalText;
                btnCopy.style.background = '';
                btnCopy.style.color = '';
                lucide.createIcons();
            }, 2000);
        });
    });

    function addLogEntry(log) {
        currentLogs.push(log);
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.setAttribute('data-agent', log.agent);

        const timestamp = document.createElement('span');
        timestamp.className = 'log-time';
        timestamp.textContent = `[${log.time}]`;

        const message = document.createElement('span');
        message.className = 'log-msg';
        if (log.type === 'ai') message.classList.add('ai');
        if (log.type === 'success') message.classList.add('highlight');
        message.textContent = ` ${log.msg}`;

        entry.appendChild(timestamp);
        entry.appendChild(message);

        terminal.appendChild(entry);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function openEmailModal(leadName) {
        const template = emailTemplates[leadName] || {
            to: 'prospecto@empresa.com',
            subject: 'Propuesta de Valor Personalizada',
            body: 'Cargando propuesta...'
        };

        emailTo.textContent = template.to;
        emailSubject.textContent = template.subject;
        emailBody.textContent = template.body;

        modal.classList.add('active');
        lucide.createIcons();
    }

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    simulateBtn.addEventListener('click', () => {
        terminal.innerHTML = '<div class="log-entry" style="color: #6d28d9">--- INICIANDO SIMULACIÓN DE INBOUND LEAD ---</div>';
        setTimeout(() => {
            const newLead = {
                name: 'Julian Barnes',
                role: 'Director of Growth en TechNexus',
                score: 96,
                insight: 'Acaban de recibir $20M en Serie B. Están contratando a 50 personas en el departamento de ventas.'
            };
            const card = document.createElement('article');
            card.className = 'lead-card';
            card.innerHTML = `
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" alt="Julian Barnes" class="lead-avatar">
                <div class="lead-info">
                    <div class="lead-header">
                        <div class="lead-name">
                            <h3>${newLead.name}</h3>
                            <p>${newLead.role}</p>
                        </div>
                        <div class="score-badge">
                            <span class="score-val">${newLead.score}</span>
                            <span class="score-total">/100</span>
                        </div>
                    </div>
                    <div class="insight-box">
                        <strong>AI Insight</strong>
                        <p>${newLead.insight}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-slack" title="Push to Slack">
                            <i data-lucide="slack"></i>
                        </button>
                        <button class="btn-draft">
                            <i data-lucide="mail"></i> Draft AI Email
                        </button>
                    </div>
                </div>
            `;
            leadFeed.prepend(card);
            lucide.createIcons();
            bindLeadButtons(card);
            let i = 0;
            const interval = setInterval(() => {
                const now = new Date();
                const log = { ...logMessages[i], time: now.toLocaleTimeString() };
                addLogEntry(log);
                i++;
                if (i >= logMessages.length) clearInterval(interval);
            }, 800);
        }, 500);
    });

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const filter = tag.getAttribute('data-filter');
            const entries = terminal.querySelectorAll('.log-entry');
            entries.forEach(entry => {
                if (filter === 'all' || entry.getAttribute('data-agent') === filter) {
                    entry.style.display = 'block';
                } else {
                    entry.style.display = 'none';
                }
            });
        });
    });

    function bindLeadButtons(container = document) {
        const draftBtns = container.querySelectorAll('.btn-draft');
        draftBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.lead-card');
                const leadName = card.querySelector('h3').textContent;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Writing...';
                lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = '<i data-lucide="check"></i> Email Drafted';
                    btn.style.background = 'var(--accent-emerald)';
                    lucide.createIcons();
                    setTimeout(() => openEmailModal(leadName), 500);
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        lucide.createIcons();
                    }, 3000);
                }, 1500);
            });
        });

        const slackBtns = container.querySelectorAll('.btn-slack');
        slackBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const originalColor = btn.style.background;
                btn.style.background = '#4A154B';
                btn.innerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
                setTimeout(() => {
                    btn.style.background = originalColor;
                    btn.innerHTML = '<i data-lucide="slack"></i>';
                    lucide.createIcons();
                }, 1500);
            });
        });
    }

    // PROACTIVE SEARCH AGENT LOGIC
    const ticker = document.getElementById('news-ticker');
    const matchContainer = document.getElementById('match-container');
    const newsData = [
        { time: '14:05', source: 'Bloomber:', msg: 'E-com growth in Mexico rises 20%' },
        { time: '14:07', source: 'SecurNews:', msg: 'Data breach in Logistic Systems' },
        { time: '14:10', source: 'Yahoo Fin:', msg: 'Solar Energy Co expansion to US' },
        { time: '14:12', source: 'LinkedIn:', msg: 'Growth Lead hiring at SolarTech' }
    ];

    function updateTicker() {
        const now = new Date();
        const item = newsData[Math.floor(Math.random() * newsData.length)];
        const lastTime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');

        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <span class="time">[${lastTime}]</span>
            <span class="source">${item.source}</span>
            <span>${item.msg}</span>
        `;
        ticker.prepend(div);
        if (ticker.children.length > 6) ticker.removeChild(ticker.lastChild);
    }

    setInterval(updateTicker, 4000);

    const matchTemplates = [
        { name: 'Solar Energy Co', signal: 'US Expansion detected' },
        { name: 'Mexico-Ecom', signal: 'Volume Increase Detected' },
        { name: 'FinTech Corp', signal: 'Serie B Funding Closed' }
    ];

    function discoverNewMatch() {
        const match = matchTemplates[Math.floor(Math.random() * matchTemplates.length)];
        matchContainer.innerHTML = `
            <div class="match-card-mini" style="background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2);">
                <i data-lucide="sparkles" style="color: var(--accent-violet);"></i>
                <div class="match-info-mini">
                    <h4>${match.name} Found</h4>
                    <p>Signal: ${match.signal}</p>
                </div>
                <button class="btn-reveal-lead" style="background: var(--accent-violet); color: white;">Review</button>
            </div>
        `;
        lucide.createIcons();
    }

    setInterval(discoverNewMatch, 10000);

    bindLeadButtons();
});
