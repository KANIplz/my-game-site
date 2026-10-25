/* ============================================================
 *  大门页脚本
 *  作用：把 data/games.js 里的文字填到页面上，并生成背景图片拼贴
 *  一般不需要改这里 —— 内容和图片都去 data/games.js 改
 * ============================================================ */

(function () {
  function $(id) { return document.getElementById(id); }
  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  const cfg = (typeof SITE_CONFIG === 'object' && SITE_CONFIG) ? SITE_CONFIG : {};
  const gate = cfg.gate || {};

  /* ---------- 填充文字 ---------- */
  const name = cfg.siteName || '我的游戏库';
  const tag = cfg.siteTagline || 'GAME VAULT';
  document.title = name;
  setText('gateBrand', tag);
  setText('gateKicker', '// ' + (gate.subtitle || tag));
  setText('gateTitle', gate.title || name);
  setText('gateSub', gate.subtitle || tag);
  setText('gateDesc', gate.desc || '');
  setText('gateEnterCn', gate.enterText || '进入我的游戏分享页');
  setText('gateEnterEn', gate.enterEn || 'ENTER');
  setText('gateNote', gate.note || '');

  /* ---------- 生成背景图片拼贴 ----------
   * 配了图片就用图片；没配图片就用几何占位块（带编号），页面照样好看
   */
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
})();
