/* ============================================================
 *  网站脚本（引导页 + 游戏主页，合并在一个页面里）
 *  一般不需要改这里 —— 内容改 data/games.js，样式改 style.css
 * ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);
  const body = document.body;

  const grid = $('gameGrid');
  const emptyState = $('emptyState');
  const filterBox = $('filterBox');
  const searchInput = $('searchInput');
  const toastEl = $('toast');

  let activeCategory = '全部';

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

  function gradientOf(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const h = hash % 360;
    return [`hsl(${h} 22% 26%)`, `hsl(${(h + 40) % 360} 18% 14%)`];
  }

  /* ============================================================
   *  一、引导页（大门）
   * ============================================================ */
  function initGate() {
    const c = cfg();
    const gate = c.gate || {};
    const name = c.siteName || '我的游戏库';
    const tag = c.siteTagline || 'GAME VAULT';

    document.title = name;
    setText('gateBrand', tag);
    setText('gateKicker', '// ' + (gate.subtitle || tag));
    setText('gateTitle', gate.title || name);
    setText('gateSub', gate.subtitle || tag);
    setText('gateDesc', gate.desc || '');
    setText('gateEnterCn', gate.enterText || '进入我的游戏分享页');
    setText('gateEnterEn', gate.enterEn || 'ENTER');
    setText('gateNote', gate.note || '');

    /* 背景图片拼贴：没配图就用带编号的几何占位块 */
    const box = $('gateTiles');
    if (!box) return;
    const imgs = (gate.images || []).filter(Boolean);
    const list = imgs.length ? imgs : [null, null, null, null, null, null, null, null];
    list.forEach((src, i) => {
      const tile = document.createElement('div');
      tile.className = 'gate-tile';
      if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        tile.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'ph';
        const num = document.createElement('span');
        num.textContent = String(i + 1).padStart(2, '0');
        ph.appendChild(num);
        tile.appendChild(ph);
      }
      box.appendChild(tile);
    });
  }

  /* ---------- 页面切换（带渐变过渡） ---------- */
  let switching = false;

  function enterVault(targetId) {
    if (switching) return;
    switching = true;
    body.classList.remove('gate-active');

    /* 等淡出动画走完再滚动，避免动画期间跳动 */
    setTimeout(() => {
      switching = false;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 620);
  }

  function backToGate() {
    if (switching) return;
    switching = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    body.classList.add('gate-active');
    setTimeout(() => { switching = false; }, 620);
  }

  /* ============================================================
   *  二、游戏主页
   * ============================================================ */
  function initSiteInfo() {
    const c = cfg();
    const name = c.siteName || '我的游戏库';
    const tag = c.siteTagline || 'GAME VAULT';

    setText('brandLogo', name.trim().charAt(0));
    setText('brandName', name);
    setText('brandTag', tag);
    setText('footerLogo', name.trim().charAt(0));
    setText('footerName', name);
    setText('footerName2', name);
    setText('footerTag', tag);
    setText('headTitle', c.headTitle || '全部游戏');
    setText('headSub', c.headSub || '');
    setText('footerText', c.footerText || '');
    setText('year', String(new Date().getFullYear()));

    if (c.notice) {
      $('notice').style.display = '';
      setText('noticeText', c.notice);
    }

    /* 两处导航：引导页右上角 + 主页顶部 */
    const items = c.navItems || [];
    [['gateNav', true], ['navLinks', false]].forEach(([id, isGate]) => {
      const nav = $(id);
      if (!nav) return;
      nav.innerHTML = '';
      items.forEach((item) => {
        const a = document.createElement('a');
        a.href = item.href || '#';
        a.textContent = item.label;
        a.dataset.target = (item.href || '').replace('#', '');
        if (isGate) {
          /* 引导页上的导航：点了就过渡到主页并滚到对应位置 */
          a.addEventListener('click', (e) => {
            const href = item.href || '';
            if (href.startsWith('#') && href.length > 1) {
              e.preventDefault();
              enterVault(href.slice(1));
            }
          });
        }
        nav.appendChild(a);
      });
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

    /* 统计 */
    const list = allGames();
    const linkCount = list.reduce((n, g) => n + (g.links || []).filter((l) => l && l.url).length, 0);
    const cats = new Set(list.map((g) => g.category).filter(Boolean));
    setText('statGames', String(list.length));
    setText('statLinks', String(linkCount));
    setText('statCats', String(cats.size));
  }

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

  function render() {
    const keyword = (searchInput.value || '').trim().toLowerCase();
    const total = allGames().length;

    const list = allGames().filter((g) => {
      const matchCat = activeCategory === '全部' || g.category === activeCategory;
      const text = `${g.name || ''} ${g.desc || ''} ${g.category || ''} ${(g.tags || []).join(' ')}`.toLowerCase();
      return matchCat && (!keyword || text.includes(keyword));
    });

    grid.innerHTML = '';
    emptyState.style.display = list.length ? 'none' : 'block';
    list.forEach((g, i) => grid.appendChild(buildCard(g, i)));

    setText('gameCount', list.length === total ? `共 ${total} 个` : `${list.length} / ${total} 个`);
  }

  function buildCard(g, index) {
    const card = document.createElement('article');
    card.className = 'card';

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
    const idx = document.createElement('span');
    idx.className = 'card-idx';
    idx.textContent = String(index + 1).padStart(2, '0');
    cover.appendChild(idx);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = g.name || '未命名';
    title.title = g.name || '';
    bodyEl.appendChild(title);

    if (g.desc) {
      const desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = g.desc;
      bodyEl.appendChild(desc);
    }

    if ((g.tags || []).length) {
      const tags = document.createElement('div');
      tags.className = 'card-tags';
      g.tags.forEach((t) => {
        const s = document.createElement('span');
        s.textContent = t;
        tags.appendChild(s);
      });
      bodyEl.appendChild(tags);
    }

    if (g.size || g.updated) {
      const meta = document.createElement('div');
      meta.className = 'card-meta';
      if (g.size) meta.appendChild(span(g.size));
      if (g.updated) meta.appendChild(span(g.updated));
      bodyEl.appendChild(meta);
    }

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
    bodyEl.appendChild(linksWrap);

    card.append(cover, bodyEl);
    return card;
  }

  function span(text) {
    const s = document.createElement('span');
    s.textContent = text;
    return s;
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

  /* ============================================================
   *  三、启动
   * ============================================================ */
  initGate();
  initSiteInfo();
  initFilters();
  render();

  /* 事件绑定 */
  searchInput.addEventListener('input', render);
  $('btnEnter').addEventListener('click', () => enterVault());
  $('btnGate').addEventListener('click', backToGate);
  $('btnHome').addEventListener('click', (e) => { e.preventDefault(); backToGate(); });

  /* 直接带 #games / #filters 打开时，跳过引导页 */
  const hashId = (location.hash || '').replace('#', '');
  if (hashId === 'games' || hashId === 'filters') {
    body.classList.remove('gate-active');
  }
})();
