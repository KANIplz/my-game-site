/* ============================================================
 *  网站交互脚本
 *  一般不需要改这里 —— 内容请改 data/games.js，样式请改 style.css
 * ============================================================ */

(function () {
  const grid = document.getElementById('gameGrid');
  const emptyState = document.getElementById('emptyState');
  const filtersBox = document.getElementById('filters');
  const searchInput = document.getElementById('searchInput');
  const toastEl = document.getElementById('toast');

  let activeCategory = '全部';

  /* ---------- 提示气泡 ---------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  /* ---------- 根据名字生成一个稳定的渐变配色（做封面占位用） ---------- */
  function gradientOf(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const h1 = hash % 360;
    const h2 = (h1 + 55) % 360;
    return [`hsl(${h1} 72% 58%)`, `hsl(${h2} 72% 52%)`];
  }

  /* ---------- 站点信息填充 ---------- */
  function initSiteInfo() {
    const c = (typeof SITE_CONFIG === 'object' && SITE_CONFIG) ? SITE_CONFIG : {};
    document.title = c.siteName || '我的游戏库';
    setText('siteName', c.siteName || '我的游戏库');
    setText('heroTitle', c.heroTitle || '我的游戏下载站');
    setText('heroDesc', c.heroDesc || '');
    setText('footerText', c.footerText || '');
    setText('footerName', c.siteName || '我的游戏库');
    setText('year', String(new Date().getFullYear()));

    const games = safeGames();
    const linkCount = games.reduce((n, g) => n + (g.links || []).filter(l => l.url).length, 0);
    const cats = new Set(games.map(g => g.category).filter(Boolean));
    setText('statGames', String(games.length));
    setText('statLinks', String(linkCount));
    setText('statCats', String(cats.size));
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function safeGames() {
    return Array.isArray(typeof GAMES !== 'undefined' ? GAMES : []) ? GAMES : [];
  }

  /* ---------- 生成分类筛选按钮 ---------- */
  function initFilters() {
    const games = safeGames();
    const cats = ['全部', ...new Set(games.map(g => g.category).filter(Boolean))];
    filtersBox.innerHTML = '';
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === activeCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        [...filtersBox.children].forEach(b => b.classList.toggle('active', b === btn));
        render();
      });
      filtersBox.appendChild(btn);
    });
  }

  /* ---------- 渲染卡片 ---------- */
  function render() {
    const games = safeGames();
    const keyword = (searchInput.value || '').trim().toLowerCase();

    const list = games.filter(g => {
      const matchCat = activeCategory === '全部' || g.category === activeCategory;
      const text = `${g.name || ''} ${g.desc || ''} ${g.category || ''}`.toLowerCase();
      const matchKey = !keyword || text.includes(keyword);
      return matchCat && matchKey;
    });

    grid.innerHTML = '';
    emptyState.style.display = list.length ? 'none' : 'block';

    list.forEach(g => grid.appendChild(buildCard(g)));
  }

  function buildCard(g) {
    const card = document.createElement('article');
    card.className = 'card';

    /* 封面：有图用图，没图用渐变 + 首个汉字 */
    const cover = document.createElement('div');
    cover.className = 'card-cover';
    if (g.cover) {
      const img = document.createElement('img');
      img.src = g.cover;
      img.alt = g.name || '';
      img.loading = 'lazy';
      cover.appendChild(img);
    } else {
      const fb = document.createElement('div');
      fb.className = 'fallback';
      const [a, b] = gradientOf(g.name || 'G');
      fb.style.setProperty('--cover-a', a);
      fb.style.setProperty('--cover-b', b);
      fb.textContent = (g.name || 'G').trim().charAt(0);
      cover.appendChild(fb);
    }
    if (g.category) {
      const tag = document.createElement('span');
      tag.className = 'badge-cat';
      tag.textContent = g.category;
      cover.appendChild(tag);
    }

    /* 文字信息 */
    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = g.name || '未命名';

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = g.desc || '';

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    if (g.size) meta.appendChild(metaItem('💾 ' + g.size));
    if (g.updated) meta.appendChild(metaItem('🕒 ' + g.updated));

    /* 下载链接 + 提取码 */
    const linksWrap = document.createElement('div');
    linksWrap.className = 'card-links';
    (g.links || []).filter(l => l && l.url).forEach(l => {
      const row = document.createElement('div');
      row.className = 'link-row';

      const a = document.createElement('a');
      a.className = 'link-btn';
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = l.label || '下载';

      row.appendChild(a);

      if (l.code) {
        const codeBtn = document.createElement('button');
        codeBtn.className = 'code-badge';
        codeBtn.textContent = '提取码 ' + l.code;
        codeBtn.title = '点击复制提取码';
        codeBtn.addEventListener('click', () => copyText(l.code));
        row.appendChild(codeBtn);
      }
      linksWrap.appendChild(row);
    });

    body.append(title, desc, meta, linksWrap);
    card.append(cover, body);
    return card;
  }

  function metaItem(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  /* ---------- 复制提取码 ---------- */
  function copyText(text) {
    const done = () => toast('提取码已复制：' + text);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  /* 兼容 http 直接打开（非安全上下文）时的复制 */
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { toast('复制失败，请手动记录：' + text); }
    document.body.removeChild(ta);
  }

  /* ---------- 深色 / 浅色主题 ---------- */
  function initTheme() {
    const saved = localStorage.getItem('site-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon();

    document.getElementById('themeToggle').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('site-theme', cur);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.getElementById('themeIcon').textContent = isLight ? '☀️' : '🌙';
  }

  /* ---------- 启动 ---------- */
  initSiteInfo();
  initFilters();
  initTheme();
  render();
  searchInput.addEventListener('input', render);
})();
