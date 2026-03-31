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
      const show = nav && nav.style.display !== 'flex';
      if (nav) nav.style.display = show ? 'flex' : 'none';
      if (actions) actions.style.display = show ? 'flex' : 'none';
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
      if(kind === 'quote') message = 'Request queued for office review.';
      if(kind === 'contact' || kind === 'report') message = 'Message sent to the office queue.';
      if(kind === 'route') message = 'Update preference saved.';
      if(kind === 'login') message = 'Use the sign-in button to open the office workspace.';
      showToast(message);
      if(kind !== 'login') form.reset();
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

  const portalLink = document.querySelector('.header-actions a[href="customer-portal.html"]');
  if (portalLink && page === 'portal') portalLink.classList.add('active');

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
        <div class="panel">
          <span class="eyebrow">Account record</span>
          <h2 style="margin:14px 0 8px">${data.account.name}</h2>
          <p>${data.account.service_address}</p>
          <div class="hero-stats" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-top:18px">
            <div><strong>${data.account.plan}</strong><span>Plan</span></div>
            <div><strong>${data.account.autopay}</strong><span>Autopay</span></div>
            <div><strong>${data.account.balance}</strong><span>Balance</span></div>
          </div>
        </div>`;
    }

    if (upcoming) {
      upcoming.innerHTML = data.upcoming.map(item => `
        <div class="portal-item">
          <div class="route-meta">
            <div>
              <strong>${item.title}</strong>
              <div class="muted" style="font-size:.92rem">${item.when}</div>
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
              <div class="muted" style="font-size:.92rem">${inv.due}</div>
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
        <div class="portal-item">
          <div class="route-meta" style="align-items:flex-start">
            <div style="font-size:1.05rem">${n.icon}</div>
            <div><strong>${n.title}</strong><p style="margin-top:6px">${n.body}</p></div>
          </div>
        </div>`).join('');
    }
  }

  loadPortal();
})();
