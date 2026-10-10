// Add future affiliations here. Palette selection never changes career facts.
(() => {
  const affiliations = [
    {
      id: 'kaist', name: 'KAIST', detail: 'KAIST, Daejeon', current: true,
      unit: 'Natural Science Research Institute',
      positions: [
        { title: 'Postdoctoral Researcher', period: 'Sep 2026–present' }
      ],
      image: 'assets/kaist-emblem.gif',
      colors: { accent: '#01438f', hover: '#002f67', underline: '#a4bbd5', rule: '#dde4ed', soft: '#c3d3e5', wash: '#f2f6fb' }
    },
    {
      id: 'postech', name: 'POSTECH', detail: 'POSTECH, Pohang', current: false,
      unit: 'Department of Physics',
      positions: [
        { title: 'PhD in Physics', period: 'Mar 2021–Aug 2026' },
        { title: 'BS in Physics', period: 'Mar 2017–Feb 2021' }
      ],
      image: 'assets/postech-emblem.png',
      colors: { accent: '#a61955', hover: '#78123d', underline: '#d4a4b8', rule: '#eadde2', soft: '#dfbecb', wash: '#fbf3f6' }
    }
  ];
  const key = 'academic-affiliation-theme-v1';
  const root = document.documentElement;
  let transitionReset;
  const known = id => affiliations.find(item => item.id === id);
  const current = affiliations.find(item => item.current) || affiliations[0];
  let selected = current;
  try {
    selected = known(new URLSearchParams(location.search).get('theme')) || known(localStorage.getItem(key)) || selected;
  } catch (_) { /* Theme selection still works without browser storage. */ }
  const paint = theme => {
    root.dataset.theme = theme.id;
    Object.entries(theme.colors).forEach(([token, value]) => root.style.setProperty('--theme-' + token, value));
  };
  paint(selected);
  document.addEventListener('DOMContentLoaded', () => {
    const region = document.querySelector('.affiliations');
    if (!region) return;
    const history = region.closest('.affiliation-history');
    if (history) {
      const summary = history.querySelector('.affiliation-summary');
      summary.querySelector('img').src = current.image;
      summary.querySelector('.affiliation-current-school').textContent = current.detail;
      summary.querySelector('.affiliation-current-title').textContent = current.positions[0].title;
      const mobile = window.matchMedia('(max-width: 760px)');
      let mobileExpanded = false;
      const syncHistory = () => {
        const open = !mobile.matches || mobileExpanded;
        if (!open && region.contains(document.activeElement)) summary.focus({ preventScroll: true });
        history.open = open;
      };
      history.addEventListener('toggle', () => {
        if (mobile.matches) mobileExpanded = history.open;
        else if (!history.open) history.open = true;
      });
      mobile.addEventListener('change', syncHistory);
      syncHistory();
    }
    const buttons = [];
    const update = () => {
      buttons.forEach(button => button.setAttribute('aria-pressed', button.dataset.theme === selected.id ? 'true' : 'false'));
      // Local-file storage differs by browser. Keep the theme on internal links too.
      document.querySelectorAll('a[href]').forEach(link => {
        const raw = link.getAttribute('href');
        if (raw.startsWith('#')) return;
        const url = new URL(raw, document.baseURI);
        if (url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
        url.searchParams.set('theme', selected.id);
        link.href = url.href;
      });
    };
    region.replaceChildren();
    affiliations.forEach(theme => {
      const entry = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'affiliation-choice' + (theme.current ? ' current-affiliation' : ' former-affiliation');
      button.dataset.theme = theme.id;
      button.title = 'Use ' + theme.name + ' colors';
      const career = theme.positions.map(position => position.title + ', ' + position.period).join('; ');
      button.setAttribute('aria-label', theme.detail + ', ' + theme.unit + '. ' + career + '. Use this color theme');
      const badge = document.createElement('span');
      badge.className = 'affiliation-badge';
      const image = document.createElement('img');
      image.src = theme.image;
      image.alt = '';
      image.className = 'affiliation-emblem';
      image.width = 34;
      image.height = 34;
      badge.append(image);
      const label = document.createElement('span');
      label.className = 'affiliation-label';
      const school = document.createElement('span');
      school.className = 'affiliation-school';
      school.textContent = theme.detail;
      const unit = document.createElement('span');
      unit.className = 'affiliation-unit';
      unit.textContent = theme.unit;
      const positions = document.createElement('span');
      positions.className = 'affiliation-positions';
      theme.positions.forEach(position => {
        const item = document.createElement('span');
        item.className = 'affiliation-position';
        const title = document.createElement('span');
        title.className = 'affiliation-title';
        title.textContent = position.title;
        const period = document.createElement('span');
        period.className = 'affiliation-period';
        period.textContent = position.period;
        item.append(title, period);
        positions.append(item);
      });
      label.append(school, unit, positions);
      button.append(badge, label);
      button.addEventListener('click', () => {
        if (selected.id === theme.id) return;
        // Enable color transitions only after an explicit switch, avoiding
        // an initial flash when restoring a saved palette on a new page.
        root.classList.add('theme-transitions');
        window.clearTimeout(transitionReset);
        selected = theme;
        paint(theme);
        // Release transitions if a background window pauses its paint timeline.
        transitionReset = window.setTimeout(() => root.classList.remove('theme-transitions'), 650);
        try { localStorage.setItem(key, theme.id); } catch (_) {}
        update();
        const status = document.querySelector('.theme-status');
        if (status) status.textContent = theme.name + ' colors selected.';
      });
      buttons.push(button);
      entry.append(button);
      region.append(entry);
    });
    update();
  });
})();
