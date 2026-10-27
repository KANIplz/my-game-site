/* ============================================================
 *  网站脚本（引导页 + 游戏主页 + 全屏检索）
 *  一般不需要改这里 —— 内容改 data/games.js，样式改 style.css
 * ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);
  const body = document.body;

  const grid = $('gameGrid');
  const emptyState = $('emptyState');
  const filterBox = $('filterBox');
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

  /* 把文字里的 HTML 特殊字符转义，避免破坏页面结构 */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* 关键词高亮（把命中的文字标成橙色，其余内容保持转义） */
  function highlight(text, keyword) {
    const escaped = escapeHtml(text);
    if (!keyword) return escaped;
    const safe = escapeHtml(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(safe, 'gi'), (m) => `<mark>${m}</mark>`);
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

    /* 全屏背景图：多张自动轮播（6 秒切换）；没配图就用默认几何占位背景 */
    const layers = [$('gateBg'), $('gateBg2')].filter(Boolean);
    if (!layers.length) return;
    const imgs = (gate.images || []).filter(Boolean);
    if (!imgs.length) {
      layers[0].classList.add('show');
      return;
    }
    let cur = 0;
    layers[0].style.backgroundImage = 'url("' + imgs[0] + '")';
    layers[0].classList.add('show');
    if (imgs.length > 1) {
      setInterval(() => {
        cur = (cur + 1) % imgs.length;
        const showEl = layers.find((el) => !el.classList.contains('show'));
        const hideEl = layers.find((el) => el.classList.contains('show'));
        showEl.style.backgroundImage = 'url("' + imgs[cur] + '")';
        showEl.classList.add('show');
        hideEl.classList.remove('show');
      }, 15000);   /* 轮播间隔：15000 = 15 秒换一张 */
    }
  }

  /* ---------- 引导页 / 主页切换（带渐变过渡） ---------- */
  let switching = false;

  function enterVault(targetId) {
    if (switching) return;
    switching = true;
    body.classList.remove('gate-active');
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
   *  二、全屏检索（沉浸搜索）
   * ============================================================ */
  function initSearch() {
    const layer = $('searchLayer');
    const input = $('searchInput');
    const form = $('searchBar');
    const results = $('searchResults');
    const resultsGrid = $('searchGrid');
    const resultsEmpty = $('resultEmpty');
    const s = cfg().search || {};

    setText('searchKicker', s.kicker || '// DATABASE QUERY');
    setText('searchTitle', s.title || '在仓库中检索');
    input.placeholder = s.placeholder || '输入游戏名称、分类或标签…';
    setText('searchSubmit', s.buttonText ? (s.buttonText + ' ›') : '检索 ›');

    /* 打开检索界面 */
    function openSearch() {
      body.classList.add('search-open');
      setTimeout(() => input.focus(), 420);
    }

    /* 关闭并复位 */
    function closeSearch() {
      body.classList.remove('search-open', 'search-results');
      input.value = '';
      results.hidden = true;
      resultsGrid.innerHTML = '';
      layer.scrollTop = 0;
    }

    /* 执行一次检索 */
    function runSearch() {
      const keyword = input.value.trim();
      if (!keyword) { toast('请输入关键词'); input.focus(); return; }
      const kw = keyword.toLowerCase();

      const list = allGames().filter((g) => {
        const text = `${g.name || ''} ${g.desc || ''} ${g.category || ''} ${(g.tags || []).join(' ')}`.toLowerCase();
        return text.includes(kw);
      });

      /* 切到结果视图（搜索框上移收窄，结果淡入） */
      body.classList.add('search-results');
      results.hidden = false;
      resultsEmpty.hidden = list.length > 0;
      setText('resultCount', String(list.length));
      setText('resultKeyword', 'KEYWORD: ' + keyword);

      resultsGrid.innerHTML = '';
      list.forEach((g, i) => resultsGrid.appendChild(buildCard(g, i, kw)));
      layer.scrollTop = 0;
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); runSearch(); });
    $('searchSubmit').addEventListener('click', (e) => { e.preventDefault(); runSearch(); });
    $('searchClose').addEventListener('click', closeSearch);
    $('btnSearch').addEventListener('click', openSearch);
    $('btnSearchGate').addEventListener('click', openSearch);

    /* 结果状态下继续输入 → 实时更新结果 */
    input.addEventListener('input', () => {
      if (body.classList.contains('search-results') && input.value.trim()) runSearch();
    });

    /* ESC 退出检索 */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('search-open')) closeSearch();
    });

    /* 热门词（在 data/games.js 的 search.hotwords 里改） */
    const hotBox = $('searchHot');
    (s.hotwords || []).forEach((word) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = word;
      btn.addEventListener('click', () => {
        input.value = word;
        runSearch();
      });
      hotBox.appendChild(btn);
    });
  }

  /* ============================================================
   *  三、游戏主页
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

    /* 顶部横幅：图片 + 左侧站名 */
    const banner = c.banner || {};
    setText('bannerTitle', banner.title || name);
    const bannerEl = $('banner');
    if (bannerEl && banner.image) bannerEl.style.backgroundImage = 'url("' + banner.image + '")';

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
        if (isGate) {
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
    const total = allGames().length;
    const list = allGames().filter((g) => activeCategory === '全部' || g.category === activeCategory);

    grid.innerHTML = '';
    emptyState.style.display = list.length ? 'none' : 'block';
    list.forEach((g, i) => grid.appendChild(buildCard(g, i)));

    setText('gameCount', list.length === total ? `共 ${total} 个` : `${list.length} / ${total} 个`);
  }

  /* 卡片：keyword 有值时把命中的文字高亮（第三个参数可选） */
  function buildCard(g, index, keyword) {
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
    if (keyword) title.innerHTML = highlight(g.name || '未命名', keyword);
    else title.textContent = g.name || '未命名';
    title.title = g.name || '';
    bodyEl.appendChild(title);

    if (g.desc) {
      const desc = document.createElement('p');
      desc.className = 'card-desc';
      if (keyword) desc.innerHTML = highlight(g.desc, keyword);
      else desc.textContent = g.desc;
      bodyEl.appendChild(desc);
    }

    if ((g.tags || []).length) {
      const tags = document.createElement('div');
      tags.className = 'card-tags';
      g.tags.forEach((t) => {
        const s = document.createElement('span');
        if (keyword) s.innerHTML = highlight(t, keyword);
        else s.textContent = t;
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
   *  四、启动
   * ============================================================ */
  initGate();
  initSiteInfo();
  initFilters();
  initSearch();
  render();

  $('btnEnter').addEventListener('click', () => enterVault());
  $('btnGate').addEventListener('click', backToGate);
  $('btnHome').addEventListener('click', (e) => { e.preventDefault(); backToGate(); });

  /* 直接带 #games / #filters 打开时，跳过引导页 */
  const hashId = (location.hash || '').replace('#', '');
  if (hashId === 'games' || hashId === 'filters') {
    body.classList.remove('gate-active');
  }
})();
