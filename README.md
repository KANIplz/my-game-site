# 我的游戏下载站 · 使用与上线说明

这是一个**纯静态网站**：没有数据库、没有后端，维护极简单。你日常只需要改两个文件。

## 一、本地预览（改完之后先看效果）

**方法 1（最简单）**：直接双击 `index.html`，用浏览器打开。

**方法 2（推荐，效果更准确）**：在本文件夹里打开 PowerShell，执行：

```bash
python -m http.server 8000
```

然后浏览器访问 `http://localhost:8000`。

> 改完文件后，按 `Ctrl + F5` 强制刷新才能看到最新效果。

## 二、日常维护：只改这两个文件

### 1. 加游戏 / 改下载链接 → `data/games.js`

打开 `data/games.js`，复制一段 `{ ... }` 改一改即可：

```js
{
  name: '游戏名称',                 // 显示的名字
  desc: '一句话简介',
  cover: '',                        // 封面图路径，如 'assets/img/zelda.jpg'；没有就留空 ''
  category: '单机大作',              // 分类，会自动生成顶部筛选按钮
  size: '15.6 GB',                  // 大小（可留空）
  updated: '2026-10-01',            // 更新日期（可留空）
  links: [
    { label: '百度网盘', url: 'https://pan.baidu.com/s/xxxx', code: 'abcd' },
    { label: '阿里云盘', url: 'https://www.alipan.com/s/xxxx', code: '' }
  ]
}
```

- `url` 填网盘分享链接；留空则该按钮不显示
- `code` 填提取码；留空则不显示。访客点一下提取码就自动复制
- 一个游戏可以同时放多个下载源

网站名字、首页大标题、底部文字也在 `data/games.js` 顶部的 `SITE_CONFIG` 里改。

### 2. 换配色 / 美化 → `assets/css/style.css`

打开 `assets/css/style.css`，最顶部就是主题变量，改颜色即可全站生效：

```css
:root {
  --bg: #0b0d12;        /* 背景色 */
  --primary: #5b8cff;   /* 主题色（按钮、高亮） */
  --primary-2: #a855f7; /* 辅助渐变色 */
  --radius: 18px;       /* 圆角大小 */
}
```

推荐配色：[coolors.co](https://coolors.co) 或 [uigradients.com](https://uigradients.com) 挑一组，把颜色码粘进来即可。

想改得更深（字体、卡片布局、间距等），直接改同一文件里对应的段落，每段都有中文注释。

### 3. 加封面图（可选）

把图片放进 `assets/img/`，然后在 `data/games.js` 里填路径，例如 `cover: 'assets/img/zelda.jpg'`。
不填也能用——会自动生成渐变色封面（取游戏名第一个字）。

## 三、上线（让别人也能访问）

### 方案 A：GitHub Pages（免费，推荐先试）

1. 注册 [github.com](https://github.com)，新建仓库（New repository），名字随意，例如 `my-game-site`，选 **Public**，勾选 Add a README 可不勾
2. 把本文件夹的文件传到仓库，三种方式任选其一：

   **方式 ①：网页上传（不用装任何软件，最快）**
   - 仓库页面点 `Add file → Upload files`
   - 把 `index.html`、`README.md` 拖进去（根目录文件可直接拖）
   - 子目录里的文件：点 `Add file → Create new file`，在文件名框里**连目录一起输入**，GitHub 会自动创建目录：
     - 输入 `data/games.js`，粘贴对应文件内容
     - 输入 `assets/css/style.css`，粘贴内容
     - 输入 `assets/js/main.js`，粘贴内容
   - 也可以直接把整个 `assets`、`data` 文件夹拖进上传区（新版浏览器支持保留目录结构）
   - 滚到底部点 `Commit changes`

   **方式 ②：GitHub Desktop（推荐零基础长期使用，图形界面）**
   - 下载安装 [desktop.github.com](https://desktop.github.com)
   - 登录 → `File → Add local repository` → 选择本文件夹
   - 左下角填 Summary（如 `first commit`）→ `Commit` → 顶部 `Publish repository`
   - 名称填 `my-game-site`，**取消勾选 Keep this code private**（即设为公开）→ Publish

   **方式 ③：命令行（需先装 Git）**
   - 安装 [git-scm.com/download/win](https://git-scm.com/download/win)（一路下一步）
   - 在本文件夹打开 PowerShell：
     ```bash
     git init
     git add .
     git commit -m "first commit"
     git branch -M main
     git remote add origin https://github.com/你的用户名/my-game-site.git
     git push -u origin main
     ```
3. 进入仓库 `Settings → Pages`，`Source` 选 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，点 Save
4. 等 1~2 分钟，访问：`https://你的用户名.github.io/my-game-site/`

以后改完文件再 push 一次，网站会自动更新（约 1 分钟生效）。

> 说明：免费账号的 Pages 需要仓库为 **Public**（公开）。仓库里只有网页代码，不含游戏文件，所以体积很小。

### 方案 B：Vercel（同样免费，国内访问通常比 GitHub Pages 稳）

1. 用 GitHub 账号登录 [vercel.com](https://vercel.com)
2. 点 `Add New → Project`，导入你刚才的 GitHub 仓库
3. 框架选 `Other`，构建命令和输出目录**全部留空**，点 Deploy
4. 部署完成得到地址：`https://my-game-site.vercel.app`

之后每次 push 到 GitHub，Vercel 会自动重新部署。

> 两个方案可以同时用：代码都放在同一个 GitHub 仓库，随时切换访问的域名。

## 四、常见问题

| 问题 | 解决办法 |
|------|---------|
| 改完没变化 | 浏览器按 `Ctrl + F5` 强制刷新；部署后需等 1~2 分钟 |
| 国内朋友打不开 | 把仓库导入 Vercel（方案 B），或换用腾讯云 EdgeOne Pages |
| 想用自己的域名 | Vercel / GitHub Pages 的 Settings 里都能绑定，域名需先购买（阿里云/腾讯云约几十元/年） |
| 游戏文件想直接放网站 | 小文件（几十 MB 内）可放 `assets/` 下并填相对路径；大文件不建议，流量会很贵，仍推荐网盘 |

## 五、文件结构

```
├── index.html              网页主体
├── assets/
│   ├── css/style.css       样式（改配色看这里）
│   ├── js/main.js          交互逻辑（一般不用改）
│   └── img/                封面图放这里
├── data/games.js           ★ 游戏内容与下载链接（改内容看这里）
└── README.md               本说明
```
