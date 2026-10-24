/* ============================================================
 *  这是整个网站的「内容配置文件」
 *  你只需要改这个文件，就能增删改游戏、改下载链接、改站点信息
 *  改完保存，刷新网页即可看到效果
 * ============================================================ */

/* ---------- 1. 站点基本信息（改成你自己的） ---------- */
const SITE_CONFIG = {
  siteName: '我的游戏库',                 // 网站名字（左上角 + 浏览器标签页）
  siteTagline: 'GAME VAULT',             // Hero 上方的小标签（英文/副标题，可留空）
  heroTitle: '欢迎来到我的游戏库',         // 首页大标题
  heroSubtitle: '一站式游戏资源下载站',     // 大标题下的一行
  heroDesc: '免费、高质量的游戏资源下载，点击即可跳转网盘。', // 再下面的说明
  notice: '网站刚上线，资源持续更新中，欢迎收藏！',           // 置顶公告，留空 '' 则不显示
  footerText: '本站仅提供网盘链接索引，资源版权归原作者所有。',

  // 顶部导航菜单（不需要的删掉即可）
  navItems: [
    { label: '游戏下载', href: '#games' },
    { label: '游戏标签', href: '#filters' },
    { label: '帮助文档', href: 'README.md' }
  ],

  // 页脚分组链接（可自由增删）
  footerGroups: [
    {
      title: '导航',
      links: [
        { label: '全部游戏', url: '#games' },
        { label: '游戏标签', url: '#filters' }
      ]
    },
    {
      title: '友情链接',
      links: [
        { label: 'TouchGal', url: 'https://www.touchgal.ink/' }
      ]
    },
    {
      title: '联系我',
      links: [
        { label: 'GitHub', url: 'https://github.com/KANIplz' },
        { label: '邮箱', url: 'mailto:2622271662@qq.com' }
      ]
    }
  ]
};

/* ---------- 2. 游戏列表 ----------
 * 每个 { } 是一个游戏，复制一段改一改就能加新游戏
 * 字段说明：
 *   name     游戏名称（必填）
 *   desc     一句话简介
 *   cover    封面图路径，例如 'assets/img/zelda.jpg'
 *            没有图就留空 ''，会自动用渐变色 + 游戏首字做封面
 *   category 分类名（单机大作 / 独立游戏 / 联机游戏 / 实用工具…）
 *            会自动生成顶部筛选按钮，不用额外设置
 *   tags     小标签数组，例如 ['PC', '中文']，会显示在卡片上（可留空 []）
 *   rating   评分，例如 8.5，会显示在封面右上角（不想要就删掉这行）
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
