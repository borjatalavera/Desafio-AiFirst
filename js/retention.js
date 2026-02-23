/**
 * AI-Retention Engine - Control Center Logic with Interactivity & Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal-content');
    const simulateBtn = document.getElementById('btn-simulate');
    const filterTags = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('.lead-card');

    // Modal Elements
    const modal = document.getElementById('email-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('btn-cancel-modal');
    const emailTo = document.getElementById('email-to');
    const emailSubject = document.getElementById('email-subject');
    const emailBody = document.getElementById('email-body');
    const modalConfidence = document.getElementById('modal-confidence');
    const approveBtn = modal.querySelector('.btn-primary');

    let lastClickedAccount = "";

    const emailTemplates = {
        'TechCorp Inc.': {
            to: 'cto@techcorp.com',
            subject: 'Superaron sus metas. ¿Listos para el siguiente nivel? 🚀',
            confidence: '98%',
            body: `Hola equipo de TechCorp,

Estaba revisando su cuenta y noté que este mes tuvieron un uso increíble: consumieron el 90% de su cuota y nuestro equipo de soporte les resolvió 2 tickets exitosamente. ¡Felicidades por el crecimiento!

Dado que están a 90 días de su renovación, creo que es el momento perfecto para hacer un upgrade al Plan Pro. Esto les dará capacidad ilimitada y evitará interrupciones. ¿Tienen 5 minutos el martes para revisarlo?`
        },
        'Global Logistics': {
            to: 'ops@globallogistics.com',
            subject: 'Tu reporte de valor de los 6 meses + Próximos pasos',
            confidence: '94%',
            body: `Hola equipo,

Se cumplen 6 meses desde que empezamos a trabajar juntos. En este tiempo, nuestra plataforma les ha ayudado a automatizar 450 envíos. Sin embargo, noté que en las últimas dos semanas su actividad en la plataforma bajó un 40%.

Quiero asegurarme de que están sacándole el máximo provecho a su Plan Pro. Les preparé un pequeño reporte adjunto con oportunidades de mejora. ¿Podemos agendar una llamada rápida de 10 minutos esta semana para ver cómo podemos ayudarles a retomar el ritmo?`
        }
    };

    const retentionLogs = [
        { time: '14:00:12', msg: 'Make.com: Activando trigger por ciclo de 6 meses...', type: 'ai', agent: 'make' },
        { time: '14:00:15', msg: 'AI OCR: Extrayendo cláusulas de contrato_TechCorp.pdf...', type: 'ai', agent: 'ocr' },
        { time: '14:00:18', msg: 'HubSpot Sync: Cruzando fecha de vencimiento con telemetría de uso.', type: 'ai', agent: 'hubspot' },
        { time: '14:00:20', msg: 'GPT-4o: Redactando reporte de valor hiper-personalizado...', type: 'ai', agent: 'gpt' },
        { time: '14:00:25', msg: 'Success: Estrategia de Retención lista para Global Logistics.', type: 'success', agent: 'gpt' }
    ];

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-success';
        toast.innerHTML = `<i data-lucide="check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function addLogEntry(log) {
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
        if (log.type === 'danger') message.classList.add('danger');

        message.textContent = ` ${log.msg}`;

        entry.appendChild(timestamp);
        entry.appendChild(message);

        terminal.appendChild(entry);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Initial log sequence
    retentionLogs.forEach((log, i) => {
        setTimeout(() => addLogEntry(log), i * 1200);
    });

    simulateBtn.addEventListener('click', () => {
        terminal.innerHTML = '<div class="log-entry" style="color: #8B5CF6; font-weight: bold; letter-spacing: 1px;">--- INICIANDO AUTOMATIZACIÓN MID-TERM CHECK ---</div>';

        // Add scanning animation to cards
        cards.forEach(card => card.classList.add('scanning'));

        let i = 0;
        const interval = setInterval(() => {
            const now = new Date();
            const log = { ...retentionLogs[i], time: now.toLocaleTimeString() };
            addLogEntry(log);
            i++;
            if (i >= retentionLogs.length) {
                clearInterval(interval);
                cards.forEach(card => card.classList.remove('scanning'));
            }
        }, 1000);
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

    function openModal(accountName) {
        const template = emailTemplates[accountName];
        if (!template) return;

        lastClickedAccount = accountName;
        emailTo.textContent = template.to;
        emailSubject.textContent = template.subject;
        emailBody.value = template.body;
        modalConfidence.textContent = template.confidence;

        modal.classList.add('active');
    }

    function closeModalHandler() {
        modal.classList.remove('active');
    }

    closeModal.addEventListener('click', closeModalHandler);
    cancelModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });

    approveBtn.addEventListener('click', () => {
        closeModalHandler();
        showToast(`Email enviado con éxito a ${emailTo.textContent}`);

        // Update the card that sent the email
        cards.forEach(card => {
            if (card.querySelector('h3').textContent === lastClickedAccount) {
                card.classList.add('sent-success');
                const btn = card.querySelector('.btn-proactive');
                btn.innerHTML = '<i data-lucide="check"></i> Email Sent';
                lucide.createIcons();
            }
        });
    });

    // Proactive button interaction
    const proactiveBtns = document.querySelectorAll('.btn-proactive');
    proactiveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.lead-card');
            const accountName = card.querySelector('h3').textContent;

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width: 14px;"></i> AI Writing Draft...';
            lucide.createIcons();

            setTimeout(() => {
                btn.innerHTML = '<i data-lucide="check" style="width: 14px;"></i> Draft Ready';
                btn.style.background = '#10B981';
                lucide.createIcons();

                setTimeout(() => {
                    openModal(accountName);

                    setTimeout(() => {
                        if (!card.classList.contains('sent-success')) {
                            btn.innerHTML = originalText;
                            btn.style.background = '';
                            lucide.createIcons();
                        }
                    }, 3000);
                }, 500);
            }, 1500);
        });
    });
});
