/* ============================================================
 *  个人资料页脚本
 *  要填的内容都在 data/games.js 的 profile 段里改
 * ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  const cfg = (typeof SITE_CONFIG === 'object' && SITE_CONFIG) ? SITE_CONFIG : {};
  const games = Array.isArray(typeof GAMES !== 'undefined' ? GAMES : null) ? GAMES : [];
  const p = cfg.profile || {};
  const name = p.nickname || cfg.siteName || 'KANI';

  document.title = name + ' · 个人资料';

  /* 顶栏品牌 */
  setText('brandLogo', (cfg.siteName || 'G').trim().charAt(0));
  setText('brandName', cfg.siteName || '我的游戏库');
  setText('brandTag', cfg.siteTagline || 'GAME VAULT');
  setText('footerName2', cfg.siteName || '我的游戏库');
  setText('year', String(new Date().getFullYear()));

  /* 头像：配了图片就用图片，没配就显示昵称首字 */
  const avatar = $('pfAvatar');
  if (avatar) {
    if (p.avatar) {
      avatar.style.backgroundImage = 'url("' + p.avatar + '")';
      avatar.textContent = '';
    } else {
      avatar.textContent = name.trim().charAt(0);
    }
  }

  /* 昵称 / 签名 / 状态 / 等级 */
  setText('pfNick', name);
  setText('pfBio', p.bio || '');
  setText('pfLevel', String(p.level || 1));

  const statusEl = $('pfStatus');
  if (statusEl) {
    const st = p.status || '离线';
    statusEl.textContent = st;
    statusEl.classList.add(st === '在线' ? 'online' : st === '忙碌' ? 'busy' : 'offline');
  }

  /* 资料信息：没填就显示「未填写」 */
  setText('pfLocation', p.location || '未填写');
  setText('pfJoined', p.joined || '未填写');
  setText('pfPlaying', p.playing || '未填写');

  /* 统计：直接用游戏库里的真实数据 */
  const linkCount = games.reduce((n, g) => n + (g.links || []).filter((l) => l && l.url).length, 0);
  const cats = new Set(games.map((g) => g.category).filter(Boolean));
  setText('pfGames', String(games.length));
  setText('pfLinks', String(linkCount));
  setText('pfCats', String(cats.size));

  /* 导航菜单：带 # 的链接自动指回主页对应位置 */
  const nav = $('navLinks');
  if (nav) {
    (cfg.navItems || []).forEach((item) => {
      const a = document.createElement('a');
      const href = item.href || '#';
      a.href = href.startsWith('#') ? 'index.html' + href : href;
      a.textContent = item.label;
      nav.appendChild(a);
    });
  }

  const back = $('btnBack');
  if (back) back.addEventListener('click', () => { location.href = 'index.html'; });
})();
