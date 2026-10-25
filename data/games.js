/* ============================================================
 *  这是整个网站的「内容配置文件」
 *  你只需要改这个文件，就能改文字、加游戏、改下载链接
 *  改完保存，刷新网页即可看到效果
 * ============================================================ */

/* ---------- 1. 大门页（打开网站第一眼看到的页面） ---------- */
/* 背景图：把你的图片放进 assets/img/ 文件夹，
   然后把路径按下面格式写进 images 里（可放任意张，会自动拼贴并半透明化）
   例：'assets/img/gate1.jpg'                                     */
const SITE_CONFIG = {
  siteName: '我的游戏库',                 // 网站名（左上角 + 浏览器标签页）
  siteTagline: 'GAME VAULT',             // 英文名（大写字母那一行）

  gate: {
    images: [
      // 'assets/img/gate1.jpg',
      // 'assets/img/gate2.jpg',
      // 'assets/img/gate3.jpg',
      // 'assets/img/gate4.jpg'
    ],
    title: '我的游戏库',                  // 大门页大标题
    subtitle: 'GAME VAULT',              // 大标题下的英文
    desc: '精选游戏资源 · 网盘直链下载',    // 再下面一行说明
    enterText: '进入我的游戏分享页',        // 中间那个大按钮的文字
    enterEn: 'ENTER',                    // 按钮右侧英文
    note: '资源版权归原作者所有 · 本站仅提供链接索引' // 大门页底部小字
  },

  /* ---------- 2. 游戏分享页 ---------- */
  headTitle: '全部游戏',                  // 游戏页大标题
  headSub: '点击卡片上的按钮即可跳转网盘下载，提取码点一下自动复制。',
  notice: '',                            // 置顶公告，留空则不显示

  // 顶部导航菜单（不需要的删掉即可）
  navItems: [
    { label: '全部游戏', href: '#games' },
    { label: '游戏标签', href: '#filters' },
    { label: '帮助文档', href: 'README.md' }
  ],

  footerText: '本站仅提供网盘链接索引，资源版权归原作者所有。',
  // 页脚分组链接（可自由增删）
  footerGroups: [
    { title: '导航', links: [{ label: '返回大门', url: 'index.html' }, { label: '全部游戏', url: '#games' }] },
    { title: '友情链接', links: [{ label: 'TouchGal', url: 'https://www.touchgal.ink/' }] },
    { title: '联系我', links: [{ label: 'GitHub', url: 'https://github.com/KANIplz' }, { label: '邮箱', url: 'mailto:2622271662@qq.com' }] }
  ]
};

/* ---------- 3. 游戏列表 ----------
 * 每个 { } 是一个游戏，复制一段改一改就能加新游戏
 * 字段说明：
 *   name     游戏名称（必填）
 *   desc     一句话简介
 *   cover    封面图路径，例如 'assets/img/zelda.jpg'（建议 3:4 竖版图）
 *            没有图就留空 ''，会自动用几何色块 + 游戏首字做封面
 *   category 分类名，会自动生成顶部筛选按钮
 *   tags     小标签数组，例如 ['PC', '中文']（可留空 []）
 *   rating   评分，显示在封面右上角（不需要就删掉这行）
 *   size     文件大小，例如 '15.6 GB'（可留空）
 *   updated  更新日期，例如 '2026-10-01'（可留空）
 *   links    下载链接数组，可以放多个（百度网盘、阿里云盘、直链都行）
 *            - label 按钮文字（如 '百度网盘'）
 *            - url   分享链接（必填，留空则该按钮不显示）
 *            - code  提取码（没有就留空 ''，留空则不显示）
 */
const GAMES = [
  {
    name: '示例游戏：塞尔达传说',
    desc: '开放世界冒险大作，自由探索海拉鲁大陆。',
    cover: '',
    category: '单机大作',
    tags: ['PC', '中文'],
    rating: 9.2,
    size: '15.6 GB',
    updated: '2026-10-01',
    links: [
      { label: '百度网盘', url: 'https://pan.baidu.com/s/示例链接', code: 'abcd' },
      { label: '阿里云盘', url: 'https://www.alipan.com/s/示例链接', code: '' }
    ]
  },
  {
    name: '示例游戏：星露谷物语',
    desc: '像素风农场经营，种田采矿钓鱼谈恋爱。',
    cover: '',
    category: '独立游戏',
    tags: ['PC', '中文'],
    rating: 8.8,
    size: '500 MB',
    updated: '2026-09-28',
    links: [
      { label: '百度网盘', url: 'https://pan.baidu.com/s/示例链接', code: '1234' }
    ]
  },
  {
    name: '示例游戏：双人成行',
    desc: '必须两人合作的冒险游戏，支持本地/联机。',
    cover: '',
    category: '联机游戏',
    tags: ['PC', '联机'],
    rating: 9.0,
    size: '48 GB',
    updated: '2026-09-20',
    links: [
      { label: '百度网盘', url: 'https://pan.baidu.com/s/示例链接', code: 'itso' }
    ]
  },
  {
    name: '示例工具：手柄测试器',
    desc: '用来测试手柄按键是否正常的小工具。',
    cover: '',
    category: '实用工具',
    tags: ['Windows'],
    rating: 7.5,
    size: '2 MB',
    updated: '2026-09-15',
    links: [
      { label: '直接下载', url: 'https://example.com/gamepad-test.zip', code: '' }
    ]
  }
];
