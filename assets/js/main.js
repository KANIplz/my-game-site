/* ============================================================
 *  网站交互脚本
 *  一般不需要改这里 —— 内容改 data/games.js，样式改 style.css
 * ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);
  const grid = $('gameGrid');
  const emptyState = $('emptyState');
  const filterBox = $('filterBox');
  const searchInput = $('searchInput');
  const toastEl = $('toast');

  let activeCategory = '全部';
  let currentList = [];   // 当前显示的游戏列表（随机功能用）

  /* ---------- 数据读取（做了容错，写错也不会白屏） ---------- */
  function cfg() {
    return (typeof SITE_CONFIG === 'object' && SITE_CONFIG) ? SITE_CONFIG : {};
  }
  function allGames() {
    return Array.isArray(typeof GAMES !== 'undefined' ? GAMES : null) ? GAMES : [];
  }

  /* ---------- 小工具 ---------- */
  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
  }

  /* 根据名字生成稳定的渐变色（无封面图时用作占位） */
  function gradientOf(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const h1 = hash % 360;
    return [`hsl(${h1} 70% 56%)`, `hsl(${(h1 + 55) % 360} 70% 50%)`];
  }

  /* ---------- 站点信息、导航、页脚、统计 ---------- */
  function initSiteInfo() {
    const c = cfg();
    const name = c.siteName || '我的游戏库';
    document.title = name;
    setText('siteName', name);
    setText('footerName', name);
    setText('footerName2', name);
    setText('brandLogo', name.trim().charAt(0));
    setText('footerLogo', name.trim().charAt(0));
    setText('siteTagline', c.siteTagline || 'GAME VAULT');
    setText('heroTitle', c.heroTitle || '欢迎来到我的游戏库');
    setText('heroSubtitle', c.heroSubtitle || '');
    setText('heroDesc', c.heroDesc || '');
    setText('footerText', c.footerText || '');
    setText('year', String(new Date().getFullYear()));

    /* 置顶公告：留空则不显示 */
    if (c.notice) {
      $('notice').style.display = '';
      setText('noticeText', c.notice);
    }

    /* 导航菜单 */
    const nav = $('navLinks');
    nav.innerHTML = '';
    (c.navItems || []).forEach((item) => {
      const a = document.createElement('a');
      a.href = item.href || '#';
      a.textContent = item.label;
      nav.appendChild(a);
    });

    /* 页脚分组链接 */
    const fg = $('footerGroups');
    fg.innerHTML = '';
    (c.footerGroups || []).forEach((group) => {
      const col = document.createElement('div');
      col.className = 'footer-col';
      const h = document.createElement('h4');
      h.textContent = group.title;
      col.appendChild(h);
      (group.links || []).forEach((l) => {
        const a = document.createElement('a');
        a.href = l.url || '#';
        a.textContent = l.label;
        if ((l.url || '').startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
        col.appendChild(a);
      });
      fg.appendChild(col);
    });

    /* 顶部统计数字 */
    const list = allGames();
    const linkCount = list.reduce((n, g) => n + (g.links || []).filter((l) => l && l.url).length, 0);
    const cats = new Set(list.map((g) => g.category).filter(Boolean));
    setText('statGames', String(list.length));
    setText('statLinks', String(linkCount));
    setText('statCats', String(cats.size));
  }

  /* ---------- 分类筛选按钮 ---------- */
  function initFilters() {
    const cats = ['全部', ...new Set(allGames().map((g) => g.category).filter(Boolean))];
    filterBox.innerHTML = '';
    cats.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === activeCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        [...filterBox.children].forEach((b) => b.classList.toggle('active', b === btn));
        render();
      });
      filterBox.appendChild(btn);
    });
  }

  /* ---------- 渲染卡片 ---------- */
  function render() {
    const keyword = (searchInput.value || '').trim().toLowerCase();
    currentList = allGames().filter((g) => {
      const matchCat = activeCategory === '全部' || g.category === activeCategory;
      const text = `${g.name || ''} ${g.desc || ''} ${g.category || ''} ${(g.tags || []).join(' ')}`.toLowerCase();
      return matchCat && (!keyword || text.includes(keyword));
    });

    grid.innerHTML = '';
    emptyState.style.display = currentList.length ? 'none' : 'block';
    currentList.forEach((g) => grid.appendChild(buildCard(g)));

    const total = allGames().length;
    setText('gameCount', currentList.length === total ? `共 ${total} 个` : `${currentList.length} / ${total} 个`);
  }

  function buildCard(g) {
    const card = document.createElement('article');
    card.className = 'card';

    /* 封面（3:4 竖版）：有图用图，没图用渐变 + 首个字 */
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
    if (g.rating) {
      const rate = document.createElement('span');
      rate.className = 'badge-rating';
      rate.textContent = '★ ' + g.rating;
      cover.appendChild(rate);
    }

    /* 文字信息 */
    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = g.name || '未命名';
    title.title = g.name || '';
    body.appendChild(title);

    if (g.desc) {
      const desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = g.desc;
      body.appendChild(desc);
    }

    if ((g.tags || []).length) {
      const tags = document.createElement('div');
      tags.className = 'card-tags';
      g.tags.forEach((t) => {
        const s = document.createElement('span');
        s.textContent = t;
        tags.appendChild(s);
      });
      body.appendChild(tags);
    }

    if (g.size || g.updated) {
      const meta = document.createElement('div');
      meta.className = 'card-meta';
      if (g.size) meta.appendChild(span(g.size));
      if (g.updated) meta.appendChild(span(g.updated));
      body.appendChild(meta);
    }

    /* 下载链接 + 提取码 */
    const linksWrap = document.createElement('div');
    linksWrap.className = 'card-links';
    (g.links || []).filter((l) => l && l.url).forEach((l) => {
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
        codeBtn.textContent = l.code;
        codeBtn.title = '点击复制提取码';
        codeBtn.addEventListener('click', () => copyText(l.code));
        row.appendChild(codeBtn);
      }
      linksWrap.appendChild(row);
    });
    body.appendChild(linksWrap);

    card.append(cover, body);
    return card;
  }

  function span(text) {
    const s = document.createElement('span');
    s.textContent = text;
    return s;
  }

  /* ---------- 随机一部游戏 ---------- */
  function randomGame() {
    if (!currentList.length) { toast('没有可随机的游戏'); return; }
    const idx = Math.floor(Math.random() * currentList.length);
    const card = grid.children[idx];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 2400);
    }
    toast('🎲 随机到：' + (currentList[idx].name || '未命名'));
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
    updateIcon();
    $('themeToggle').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('site-theme', cur);
      updateIcon();
    });
  }

  function updateIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    setText('themeIcon', isLight ? '☀️' : '🌙');
  }

  /* ---------- 启动 ---------- */
  initSiteInfo();
  initFilters();
  initTheme();
  render();
  searchInput.addEventListener('input', render);
  $('btnRandom').addEventListener('click', randomGame);
  $('btnRandomHero').addEventListener('click', randomGame);
})();
