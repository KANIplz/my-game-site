/* ============================================================
 *  这是整个网站的「内容配置文件」
 *  你只需要改这个文件，就能增删改游戏、改下载链接、改站点信息
 *  改完保存，刷新网页即可看到效果
 * ============================================================ */

/* ---------- 1. 站点基本信息（改成你自己的） ---------- */
const SITE_CONFIG = {
  siteName: '我的游戏库',                    // 网站名字（显示在左上角和标签页）
  siteTagline: 'Game Vault',                 // 英文名 / 副标题（可留空 ''）
  heroTitle: '我的游戏下载站',                // 首页大标题
  heroDesc: '这里放我收藏的游戏，点击即可跳转到网盘下载。', // 大标题下面的说明
  footerText: '本站仅提供网盘链接索引，资源版权归原作者所有。', // 底部文字
  contact: {                                  // 联系方式（不需要就留空 ''）
    email: '',
    qq: '',
    bilibili: ''
  }
};

/* ---------- 2. 游戏列表 ----------
 * 每个 { } 里是一个游戏，复制一段改一改就能加新游戏
 * 字段说明：
 *   name     游戏名称（必填）
 *   desc     一句话简介（必填）
 *   cover    封面图片路径，例如 'assets/img/zelda.jpg'
 *            没有图片就留空 ''，会自动用渐变色 + 游戏首字做封面
 *   category 分类名，例如 '单机大作' '独立游戏' '模拟器'
 *            会自动生成顶部分类筛选按钮，不用额外设置
 *   size     文件大小，例如 '3.2 GB'（可留空）
 *   updated  更新日期，例如 '2026-10-01'（可留空）
 *   links    下载链接数组，可以放多个（百度网盘、阿里云盘、直链都行）
 *            - label 按钮文字（如 '百度网盘'）
 *            - url   分享链接（必填，留空则该按钮不显示）
 *            - code  提取码（没有就留空 ''，留空则不显示提取码）
 */
const GAMES = [
  {
    name: '示例游戏：塞尔达传说',
    desc: '开放世界冒险大作，自由探索海拉鲁大陆。',
    cover: '',
    category: '单机大作',
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
    size: '48 GB',
    updated: '2026-09-20',
    links: [
      { label: '百度网盘', url: 'https://pan.baidu.com/s/示例链接', code: 'itso' }
    ]
  },
  {
    name: '示例工具：游戏手柄测试器',
    desc: '用来测试手柄按键是否正常的小工具。',
    cover: '',
    category: '实用工具',
    size: '2 MB',
    updated: '2026-09-15',
    links: [
      { label: '直接下载', url: 'https://example.com/gamepad-test.zip', code: '' }
    ]
  }
];
