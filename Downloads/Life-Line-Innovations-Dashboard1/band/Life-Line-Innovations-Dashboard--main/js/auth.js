/* =============================================
   Life Band – Authentication & Navigation
   Login, session, sidebar, topbar, UI helpers
   ============================================= */

const App = (() => {

  // ====== AUTH MODULE ======
  const Auth = {
    CREDENTIALS: {
      individual: { email: 'user@lifeband.com', password: 'password123' },
      corporate:  { email: 'hr@lifeband.com',   password: 'corporate123' }
    },

    login(email, password, type) {
      const cred = this.CREDENTIALS[type];
      if (email === cred.email && password === cred.password) {
        const user = type === 'individual'
          ? { name: 'Alex Morgan', email, type, avatar: 'AM', onboarded: !!localStorage.getItem('lifeBand_onboarded') }
          : { name: 'HR Admin', email, type, company: 'TechCorp Inc.', avatar: 'HR' };
        localStorage.setItem('lifeBand_user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: 'Invalid email or password' };
    },

    logout() {
      localStorage.removeItem('lifeBand_user');
      window.location.href = 'index.html';
    },

    getUser() {
      const data = localStorage.getItem('lifeBand_user');
      return data ? JSON.parse(data) : null;
    },

    isLoggedIn() {
      return !!this.getUser();
    },

    requireAuth(type) {
      const user = this.getUser();
      if (!user || user.type !== type) {
        window.location.href = type === 'corporate' ? 'corporate-login.html' : 'individual-login.html';
        return false;
      }
      return true;
    },

    completeOnboarding(profile) {
      localStorage.setItem('lifeBand_onboarded', 'true');
      localStorage.setItem('lifeBand_profile', JSON.stringify(profile));
      const user = this.getUser();
      if (user) {
        user.onboarded = true;
        user.name = profile.fullName || user.name;
        localStorage.setItem('lifeBand_user', JSON.stringify(user));
      }
    },

    getProfile() {
      const data = localStorage.getItem('lifeBand_profile');
      return data ? JSON.parse(data) : null;
    }
  };

  // ====== SIDEBAR RENDERER ======
  function renderSidebar(activePage) {
    const user = Auth.getUser();
    if (!user) return '';

    const isIndividual = user.type === 'individual';
    const navItems = isIndividual ? [
      { label: 'Dashboard',     href: 'dashboard.html',   icon: 'layout-dashboard' },
      { label: 'History',       href: 'history.html',     icon: 'clock' },
      { label: 'Suggestions',   href: 'suggestions.html', icon: 'lightbulb' },
      { label: 'Find a Doctor', href: 'doctor.html',      icon: 'stethoscope' }
    ] : [
      { label: 'Employee Overview', href: 'corporate-dashboard.html', icon: 'users' },
      { label: 'Alerts',           href: 'corporate-alerts.html',    icon: 'bell-ring' },
      { label: 'Reports',          href: 'corporate-reports.html',   icon: 'file-bar-chart' }
    ];

    return `
    <aside class="sidebar" id="sidebar">
      <div class="px-5 py-5 border-b border-slate-700/50">
        <a href="${isIndividual ? 'dashboard.html' : 'corporate-dashboard.html'}" class="flex items-center gap-3 no-underline">
          <img src="assets/logo.png" alt="Life Band" class="w-10 h-10 rounded-xl object-contain shadow-lg">
          <div>
            <div class="text-white font-bold text-base tracking-tight">Life Band</div>
            <div class="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">${isIndividual ? 'Patient Portal' : 'Corporate'}</div>
          </div>
        </a>
      </div>
      <nav class="mt-4 px-3">
        <div class="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-3 mb-2">Menu</div>
        ${navItems.map(item => `
          <a href="${item.href}" class="nav-item ${activePage === item.href ? 'active' : ''}">
            <i data-lucide="${item.icon}" class="w-[18px] h-[18px]"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${user.avatar || 'U'}</div>
          <div class="min-w-0">
            <div class="text-white text-sm font-medium truncate">${user.name}</div>
            <div class="text-slate-500 text-xs truncate">${user.email}</div>
          </div>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="App.toggleSidebar()"></div>
    `;
  }

  // ====== NOTIFICATIONS SYSTEM ======
  function getNotifications() {
    const stored = localStorage.getItem('lifeBand_notifications');
    if (stored) return JSON.parse(stored);
    // Generate fresh mock notifications
    const now = Date.now();
    const notifs = [
      { id: 'n1', title: 'High Stress Detected', body: 'Your stress level reached 85%. Consider taking a break.', type: 'warning', time: new Date(now - 180000).toISOString(), read: false },
      { id: 'n2', title: 'BP Reading Complete', body: 'Blood pressure logged: 128/82 mmHg — within normal range.', type: 'success', time: new Date(now - 900000).toISOString(), read: false },
      { id: 'n3', title: 'Wellness Tip', body: 'You\'ve been sitting for 2 hours. A short walk can lower cortisol by 25%.', type: 'info', time: new Date(now - 3600000).toISOString(), read: false },
      { id: 'n4', title: 'Emergency Contact Updated', body: 'Your emergency contact info was successfully saved.', type: 'success', time: new Date(now - 7200000).toISOString(), read: true },
      { id: 'n5', title: 'Weekly Report Ready', body: 'Your weekly health summary is available for download.', type: 'info', time: new Date(now - 14400000).toISOString(), read: true }
    ];
    localStorage.setItem('lifeBand_notifications', JSON.stringify(notifs));
    return notifs;
  }

  function markNotifRead(id) {
    const notifs = getNotifications();
    const n = notifs.find(x => x.id === id);
    if (n) n.read = true;
    localStorage.setItem('lifeBand_notifications', JSON.stringify(notifs));
    refreshNotifUI();
  }

  function markAllRead() {
    const notifs = getNotifications();
    notifs.forEach(n => n.read = true);
    localStorage.setItem('lifeBand_notifications', JSON.stringify(notifs));
    refreshNotifUI();
  }

  function refreshNotifUI() {
    const notifs = getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('notifBadge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
    const panel = document.getElementById('notifPanel');
    if (panel && panel.classList.contains('open')) renderNotifPanel();
  }

  function renderNotifPanel() {
    const notifs = getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    const typeIcon = { warning: 'alert-triangle', success: 'check-circle', info: 'info', error: 'x-circle' };
    const typeColor = { warning: 'text-amber-500', success: 'text-green-500', info: 'text-blue-500', error: 'text-red-500' };
    panel.innerHTML = `
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span class="font-bold text-sm text-slate-800">Notifications${unread ? ` (${unread})` : ''}</span>
        ${unread ? '<button onclick="App.markAllRead()" class="text-xs text-blue-600 font-semibold hover:underline">Mark all read</button>' : ''}
      </div>
      <div class="max-h-80 overflow-y-auto">
        ${notifs.length === 0 ? '<div class="p-6 text-center text-sm text-slate-400">No notifications</div>' :
          notifs.map(n => `
            <div class="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${n.read ? 'opacity-60' : ''}" onclick="App.markNotifRead('${n.id}')">
              <div class="flex items-start gap-3">
                <i data-lucide="${typeIcon[n.type] || 'info'}" class="w-4 h-4 mt-0.5 flex-shrink-0 ${typeColor[n.type] || 'text-slate-400'}"></i>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-slate-800 truncate">${n.title}</span>
                    ${!n.read ? '<span class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>' : ''}
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">${n.body}</p>
                  <span class="text-[10px] text-slate-400 mt-1 block">${App.timeAgo(n.time)}</span>
                </div>
              </div>
            </div>
          `).join('')}
      </div>
    `;
    requestAnimationFrame(() => { if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [panel] }); });
  }

  // ====== TOP BAR RENDERER ======
  function renderTopBar(title, subtitle) {
    const user = Auth.getUser();
    const notifs = getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    return `
    <header class="topbar">
      <div class="flex items-center gap-4">
        <button class="lg:hidden p-2 rounded-lg hover:bg-slate-100" onclick="App.toggleSidebar()">
          <i data-lucide="menu" class="w-5 h-5 text-slate-600"></i>
        </button>
        <div>
          <h1 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">${title}</h1>
          ${subtitle ? `<p class="text-xs text-slate-500 mt-0.5 hidden sm:block">${subtitle}</p>` : ''}
        </div>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="live-pulse no-print hidden sm:flex">LIVE</div>
        <!-- Notifications -->
        <div class="relative no-print" id="notifWrap">
          <button onclick="App.toggleNotifPanel()" class="relative p-2 rounded-lg hover:bg-slate-100 transition">
            <i data-lucide="bell" class="w-5 h-5 text-slate-500"></i>
            <span id="notifBadge" class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full items-center justify-center" style="display:${unread > 0 ? 'flex' : 'none'}">${unread}</span>
          </button>
          <div id="notifPanel" class="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 hidden"></div>
        </div>
        <div class="h-8 w-px bg-slate-200 no-print hidden sm:block"></div>
        <!-- Profile Dropdown -->
        <div class="relative no-print" id="profileWrap">
          <button onclick="App.toggleProfileMenu()" class="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">${user ? user.avatar : 'U'}</div>
            <span class="text-sm font-medium text-slate-700 hidden sm:block">${user ? user.name : 'User'}</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 hidden sm:block"></i>
          </button>
          <div id="profileMenu" class="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 hidden py-2">
            <div class="px-4 py-3 border-b border-slate-100">
              <div class="text-sm font-bold text-slate-800">${user ? user.name : 'User'}</div>
              <div class="text-xs text-slate-500">${user ? user.email : ''}</div>
            </div>
            <a href="profile.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
              <i data-lucide="user-circle" class="w-4 h-4 text-slate-400"></i>
              My Profile
            </a>
            <a href="history.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
              <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
              Health History
            </a>
            <div class="border-t border-slate-100 mt-1 pt-1">
              <button onclick="App.Auth.logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                <i data-lucide="log-out" class="w-4 h-4"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    `;
  }

  // ====== UI HELPERS ======
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" class="w-5 h-5"></i><span>${message}</span>`;
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ====== DROPDOWN TOGGLES ======
  function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) profileMenu.classList.add('hidden');
    if (panel) {
      panel.classList.toggle('hidden');
      panel.classList.toggle('open');
      if (!panel.classList.contains('hidden')) renderNotifPanel();
    }
  }

  function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    const notifPanel = document.getElementById('notifPanel');
    if (notifPanel) { notifPanel.classList.add('hidden'); notifPanel.classList.remove('open'); }
    if (menu) menu.classList.toggle('hidden');
  }

  // Close dropdowns on outside click
  function initDropdownListeners() {
    document.addEventListener('click', function(e) {
      const notifWrap = document.getElementById('notifWrap');
      const notifPanel = document.getElementById('notifPanel');
      if (notifPanel && notifWrap && !notifWrap.contains(e.target)) {
        notifPanel.classList.add('hidden');
        notifPanel.classList.remove('open');
      }
      const profileWrap = document.getElementById('profileWrap');
      const profileMenu = document.getElementById('profileMenu');
      if (profileMenu && profileWrap && !profileWrap.contains(e.target)) {
        profileMenu.classList.add('hidden');
      }
    });
  }

  function initDashboardShell(activePage, title, subtitle) {
    const user = Auth.getUser();
    if (!user) return false;
    const sidebarTarget = document.getElementById('app-sidebar');
    if (sidebarTarget) sidebarTarget.innerHTML = renderSidebar(activePage);
    const topbarTarget = document.getElementById('app-topbar');
    if (topbarTarget) topbarTarget.innerHTML = renderTopBar(title, subtitle);
    requestAnimationFrame(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    initDropdownListeners();
    return true;
  }

  function statusBadge(status) {
    const map = { normal: 'badge normal', warning: 'badge warning', critical: 'badge critical' };
    return `<span class="${map[status] || 'badge info'}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
  }

  function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  // ====== PUBLIC API ======
  return {
    Auth,
    renderSidebar,
    renderTopBar,
    initDashboardShell,
    toggleSidebar,
    toggleNotifPanel,
    toggleProfileMenu,
    markNotifRead,
    markAllRead,
    showToast,
    statusBadge,
    timeAgo
  };

})();
