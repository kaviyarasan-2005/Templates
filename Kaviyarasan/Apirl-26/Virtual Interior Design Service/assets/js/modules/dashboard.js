/* VIRTUAL INTERIOR DESIGN — DASHBOARD MODULE */
'use strict';

const Dashboard = {
    currentRole: 'client',

    init() {
        this.initRoleSwitcher();
        this.initSidebar();
        this.initCharts();
        this.initNotifications();
        this.initSortableTables();
        this.initMiniCalendar();
    },

    initRoleSwitcher() {
        const switcher = document.querySelector('.role-switcher');
        if (!switcher) return;
        const btns = switcher.querySelectorAll('.role-switcher__btn');
        const adminViews = document.querySelectorAll('[data-role="admin"]');
        const clientViews = document.querySelectorAll('[data-role="client"]');
        const slider = switcher.querySelector('.role-switcher__slider');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const role = btn.getAttribute('data-switch');
                this.currentRole = role;
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (slider) {
                    slider.style.transform = role === 'admin' ? 'translateX(0)' : 'translateX(100%)';
                }
                adminViews.forEach(v => v.style.display = role === 'admin' ? '' : 'none');
                clientViews.forEach(v => v.style.display = role === 'client' ? '' : 'none');
            });
        });
    },

    initSidebar() {
        const toggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.dashboard__sidebar');
        const main = document.querySelector('.dashboard__main');
        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (main) main.classList.toggle('expanded');
        });

        // Nav items active state
        sidebar.querySelectorAll('.sidebar__link').forEach(link => {
            link.addEventListener('click', (e) => {
                sidebar.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },

    initCharts() {
        // CSS-based bar charts
        document.querySelectorAll('.bar-chart').forEach(chart => {
            const bars = chart.querySelectorAll('.bar-chart__bar');
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bars.forEach(bar => {
                            const val = bar.getAttribute('data-value');
                            bar.style.height = val + '%';
                        });
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            obs.observe(chart);
        });

        // Donut charts
        document.querySelectorAll('.donut-chart').forEach(chart => {
            const pct = parseInt(chart.getAttribute('data-percentage'));
            const circle = chart.querySelector('.donut-chart__fill');
            if (circle) {
                const circumference = 2 * Math.PI * 54;
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
            }
        });
    },

    initNotifications() {
        const bell = document.querySelector('.notif-bell');
        const panel = document.querySelector('.notif-panel');
        if (!bell || !panel) return;

        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
        document.addEventListener('click', () => panel.classList.remove('open'));
        panel.addEventListener('click', e => e.stopPropagation());
    },

    initSortableTables() {
        document.querySelectorAll('.sortable-table th[data-sort]').forEach(th => {
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                const colIdx = Array.from(th.parentNode.children).indexOf(th);
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const asc = !th.classList.contains('sort-asc');

                // Reset other headers
                table.querySelectorAll('th').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                th.classList.add(asc ? 'sort-asc' : 'sort-desc');

                rows.sort((a, b) => {
                    const aVal = a.children[colIdx].textContent.trim();
                    const bVal = b.children[colIdx].textContent.trim();
                    const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
                    const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
                    if (!isNaN(aNum) && !isNaN(bNum)) return asc ? aNum - bNum : bNum - aNum;
                    return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                });
                rows.forEach(r => tbody.appendChild(r));
            });
        });
    },

    initMiniCalendar() {
        const cal = document.querySelector('.mini-calendar');
        if (!cal) return;
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];

        const header = cal.querySelector('.mini-calendar__header');
        if (header) header.textContent = `${months[month]} ${year}`;

        const grid = cal.querySelector('.mini-calendar__grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Day headers
        days.forEach(d => {
            const div = document.createElement('div');
            div.className = 'mini-calendar__day-header';
            div.textContent = d;
            grid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'mini-calendar__day empty';
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const day = document.createElement('div');
            day.className = 'mini-calendar__day';
            day.textContent = d;
            if (d === now.getDate()) day.classList.add('today');
            // Sample events
            if ([5, 12, 18, 25].includes(d)) day.classList.add('has-event');
            grid.appendChild(day);
        }
    }
};
