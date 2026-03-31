
(function(){
  const body = document.body;
  const page = body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.classList.add('active');
  });

  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      const actions = document.querySelector('.header-actions');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      if (actions) actions.style.display = actions.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  function showToast(message){
    let toast = document.querySelector('.toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__kcToastTimer);
    window.__kcToastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const kind = form.dataset.demoForm;
      let message = 'Request recorded.';
      if(kind === 'quote') message = 'Quote request recorded. In production this would route to dispatch and the quote queue.';
      if(kind === 'contact') message = 'Message recorded. In production this would create a contact event for the office team.';
      if(kind === 'report') message = 'Service report recorded. In production this would create a ticket and notify operations.';
      if(kind === 'route') message = 'Update signup recorded. In production this would be saved to customer notifications.';
      showToast(message);
      form.reset();
    });
  });

  const loginBtn = document.querySelector('[data-demo-login]');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('kc_demo_admin', '1');
      window.location.href = 'dashboard.html';
    });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  async function loadPortal() {
    const portal = document.querySelector('[data-customer-portal]');
    if (!portal) return;
    const data = await fetch('data/customer_portal.json').then(r => r.json()).catch(() => null);
    if (!data) return;

    const acct = portal.querySelector('[data-portal-account]');
    const upcoming = portal.querySelector('[data-portal-upcoming]');
    const invoices = portal.querySelector('[data-portal-invoices]');
    const notices = portal.querySelector('[data-portal-notices]');

    if (acct) {
      acct.innerHTML = `
        <div class="card">
          <span class="eyebrow">Account snapshot</span>
          <h2 style="margin:16px 0 8px">${data.account.name}</h2>
          <p>${data.account.service_address}</p>
          <div class="badge-row" style="margin-top:16px">
            <span class="badge">Plan: ${data.account.plan}</span>
            <span class="badge">Autopay: ${data.account.autopay}</span>
            <span class="badge">Balance: ${data.account.balance}</span>
          </div>
        </div>`;
    }

    if (upcoming) {
      upcoming.innerHTML = data.upcoming.map(item => `
        <div class="portal-item">
          <div class="route-meta">
            <div>
              <strong>${item.title}</strong>
              <div class="muted small">${item.when}</div>
            </div>
            <span class="status ${item.status_class}">${item.status}</span>
          </div>
          <p style="margin:10px 0 0">${item.note}</p>
        </div>`).join('');
    }

    if (invoices) {
      invoices.innerHTML = data.invoices.map(inv => `
        <div class="portal-item">
          <div class="route-meta">
            <div>
              <strong>${inv.invoice}</strong>
              <div class="muted small">Due ${inv.due}</div>
            </div>
            <div style="text-align:right">
              <strong>${inv.amount}</strong><br>
              <span class="status ${inv.status_class}">${inv.status}</span>
            </div>
          </div>
        </div>`).join('');
    }

    if (notices) {
      notices.innerHTML = data.notices.map(n => `
        <div class="notice">
          <div style="font-size:1.1rem">${n.icon}</div>
          <div><strong>${n.title}</strong><p>${n.body}</p></div>
        </div>`).join('');
    }
  }
  loadPortal();
})();
