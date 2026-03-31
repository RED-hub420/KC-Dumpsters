(function(){
  const body = document.body;
  const page = body.dataset.page;
  const isLoginPage = window.location.pathname.endsWith('/admin/login.html') || window.location.pathname.endsWith('admin/login.html');
  if (!isLoginPage && localStorage.getItem('kc_demo_admin') !== '1') {
    window.location.href = 'login.html';
    return;
  }
  document.querySelectorAll('[data-admin-nav]').forEach(link => {
    if (link.dataset.adminNav === page) link.classList.add('active');
  });

  const sidebar = document.querySelector('.admin-sidebar');
  if (sidebar && !document.querySelector('.sidebar-tools')) {
    const tools = document.createElement('div');
    tools.className = 'sidebar-tools';
    tools.innerHTML = '<a class="btn btn-secondary btn-block" href="../index.html">Open public site</a><button class="btn btn-dark btn-block" type="button" data-signout>Sign out</button>';
    sidebar.appendChild(tools);
  }

  const signoutBtn = document.querySelector('[data-signout]');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      localStorage.removeItem('kc_demo_admin');
      window.location.href = 'login.html';
    });
  }

  function statusClass(status){
    const key = String(status).toLowerCase();
    if (key.includes('paid') || key.includes('complete') || key.includes('active') || key.includes('closed') || key.includes('ready') || key.includes('scheduled') || key.includes('available') || key.includes('on route')) return 'success';
    if (key.includes('due') || key.includes('pending') || key.includes('waiting') || key.includes('hold') || key.includes('delayed') || key.includes('quoted') || key.includes('attention') || key.includes('review')) return 'warning';
    if (key.includes('past due') || key.includes('urgent') || key.includes('open') || key.includes('collections') || key.includes('repair')) return 'danger';
    return 'info';
  }

  async function getJson(path){
    return fetch(path).then(r => r.json()).catch(() => null);
  }

  function renderTable(target, columns, rows){
    const mount = document.querySelector(target);
    if (!mount) return;
    if (!rows || !rows.length) {
      mount.innerHTML = '<div class="empty">No records available.</div>';
      return;
    }
    const head = columns.map(c => `<th>${c.label}</th>`).join('');
    const body = rows.map(row => `<tr>${columns.map(c => {
      let value = row[c.key] ?? '';
      if (c.type === 'status') value = `<span class="status ${statusClass(value)}">${value}</span>`;
      if (typeof c.render === 'function') value = c.render(row);
      return `<td>${value}</td>`;
    }).join('')}</tr>`).join('');
    mount.innerHTML = `<div class="table-wrap"><table class="admin-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  async function loadDashboard(){
    if (!document.querySelector('[data-kpis]')) return;
    const data = await getJson('../data/dashboard.json');
    if (!data) return;

    const kpis = document.querySelector('[data-kpis]');
    if (kpis) {
      kpis.innerHTML = data.kpis.map(k => `
        <div class="kpi">
          <div class="label">${k.label}</div>
          <div class="value">${k.value}</div>
          <div class="delta ${k.delta_class}">${k.delta}</div>
        </div>`).join('');
    }

    const routes = document.querySelector('[data-route-board]');
    if (routes) {
      routes.innerHTML = data.routes.map(r => `
        <div class="route-card">
          <div class="route-meta">
            <div><strong>${r.name}</strong><br><span class="muted" style="font-size:.92rem">${r.driver} · ${r.window}</span></div>
            <span class="status ${statusClass(r.status)}">${r.status}</span>
          </div>
          <div class="mini-grid">
            <div class="metric-chip"><span class="muted">Stops</span><strong>${r.stops}</strong></div>
            <div class="metric-chip"><span class="muted">Completed</span><strong>${r.completed}</strong></div>
            <div class="metric-chip"><span class="muted">Issues</span><strong>${r.issues}</strong></div>
          </div>
        </div>`).join('');
    }

    const alerts = document.querySelector('[data-alerts]');
    if (alerts) {
      alerts.innerHTML = data.alerts.map(a => `
        <div class="notice-card">
          <div class="route-meta" style="align-items:flex-start">
            <div style="font-size:1.05rem">${a.icon}</div>
            <div><strong>${a.title}</strong><p style="margin-top:6px">${a.body}</p></div>
          </div>
        </div>`).join('');
    }

    renderTable('[data-open-quotes]', [
      {label:'Quote', key:'quote_id'},
      {label:'Customer', key:'customer'},
      {label:'Service', key:'service'},
      {label:'Location', key:'location'},
      {label:'Status', key:'status', type:'status'}
    ], data.open_quotes);

    renderTable('[data-today-tickets]', [
      {label:'Ticket', key:'ticket_id'},
      {label:'Issue', key:'issue'},
      {label:'Address', key:'address'},
      {label:'Priority', key:'priority', type:'status'},
      {label:'Assigned', key:'assigned'}
    ], data.tickets);
  }

  async function loadCustomers(){
    const rows = await getJson('../data/customers.json');
    renderTable('[data-customers-table]', [
      {label:'Customer', key:'name', render:(r)=>`<strong>${r.name}</strong><small>${r.account}</small>`},
      {label:'Service', key:'service'},
      {label:'Address', key:'address'},
      {label:'Route / Asset', key:'route'},
      {label:'Status', key:'status', type:'status'},
      {label:'Balance', key:'balance'}
    ], rows);
  }

  async function loadQuotes(){
    const rows = await getJson('../data/quotes.json');
    renderTable('[data-quotes-table]', [
      {label:'Quote', key:'quote_id'},
      {label:'Requested By', key:'customer'},
      {label:'Service Type', key:'service'},
      {label:'Requested Window', key:'requested'},
      {label:'Location', key:'location'},
      {label:'Status', key:'status', type:'status'}
    ], rows);
  }

  async function loadDispatch(){
    if (!document.querySelector('[data-dispatch-routes]')) return;
    const routes = await getJson('../data/routes.json');
    const dumpsters = await getJson('../data/dumpsters.json');
    const routesMount = document.querySelector('[data-dispatch-routes]');
    if (routesMount && routes) {
      routesMount.innerHTML = routes.map(r => `
        <div class="route-card">
          <div class="route-meta">
            <div><strong>${r.route}</strong><br><span class="muted" style="font-size:.92rem">${r.driver} · ${r.truck}</span></div>
            <span class="status ${statusClass(r.status)}">${r.status}</span>
          </div>
          <p style="margin:0">${r.notes}</p>
          <div class="mini-grid">
            <div class="metric-chip"><span class="muted">Deliveries</span><strong>${r.deliveries}</strong></div>
            <div class="metric-chip"><span class="muted">Pulls</span><strong>${r.pulls}</strong></div>
            <div class="metric-chip"><span class="muted">On route</span><strong>${r.on_route}</strong></div>
          </div>
        </div>`).join('');
    }
    const ready = dumpsters ? dumpsters.filter(d => ['Ready','Ready after wash'].includes(d.status)) : [];
    renderTable('[data-ready-assets]', [
      {label:'Asset', key:'asset'},
      {label:'Type', key:'type'},
      {label:'Size', key:'size'},
      {label:'Location', key:'yard'},
      {label:'Status', key:'status', type:'status'}
    ], ready);
  }

  async function loadInventory(){
    const rows = await getJson('../data/dumpsters.json');
    renderTable('[data-inventory-table]', [
      {label:'Asset', key:'asset'},
      {label:'Category', key:'type'},
      {label:'Size', key:'size'},
      {label:'Current Location', key:'yard'},
      {label:'Condition', key:'condition', type:'status'},
      {label:'Status', key:'status', type:'status'}
    ], rows);
  }

  async function loadInvoices(){
    const rows = await getJson('../data/invoices.json');
    renderTable('[data-invoices-table]', [
      {label:'Invoice', key:'invoice'},
      {label:'Customer', key:'customer'},
      {label:'Type', key:'type'},
      {label:'Due', key:'due'},
      {label:'Amount', key:'amount'},
      {label:'Status', key:'status', type:'status'}
    ], rows);
  }

  async function loadTickets(){
    const rows = await getJson('../data/tickets.json');
    renderTable('[data-tickets-table]', [
      {label:'Ticket', key:'ticket_id'},
      {label:'Issue', key:'issue'},
      {label:'Customer', key:'customer'},
      {label:'Location', key:'address'},
      {label:'Priority', key:'priority', type:'status'},
      {label:'Status', key:'status', type:'status'}
    ], rows);
  }

  async function loadStaff(){
    const rows = await getJson('../data/staff.json');
    renderTable('[data-staff-table]', [
      {label:'Staff', key:'name', render:(r)=>`<strong>${r.name}</strong><small>${r.email}</small>`},
      {label:'Role', key:'role'},
      {label:'Permissions', key:'permissions'},
      {label:'Assignment', key:'assignment'},
      {label:'Status', key:'status', type:'status'}
    ], rows);
  }

  async function loadReports(){
    const data = await getJson('../data/reports.json');
    if (!data) return;
    const metrics = document.querySelector('[data-report-metrics]');
    if (metrics) {
      metrics.innerHTML = data.metrics.map(item => `
        <div class="progress-item">
          <div class="route-meta">
            <strong>${item.label}</strong>
            <span class="muted">${item.value}</span>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width:${item.percent}%"></div></div>
        </div>`).join('');
    }
    renderTable('[data-report-table]', [
      {label:'Period', key:'period'},
      {label:'Quotes', key:'quotes'},
      {label:'Conversions', key:'conversions'},
      {label:'Missed pickups', key:'missed_pickups'},
      {label:'A/R over 30', key:'ar_30'},
      {label:'Utilization', key:'utilization'}
    ], data.periods);
  }

  loadDashboard();
  loadCustomers();
  loadQuotes();
  loadDispatch();
  loadInventory();
  loadInvoices();
  loadTickets();
  loadStaff();
  loadReports();
})();
