# tianxiawuhao.github.io

个人技术站点 —— **纯静态 HTML**（Gridea 生成的输出直接提交到仓库，无构建步骤），发布在 GitHub Pages：

> https://tianxiawuhao.github.io/

---

## 一、本地预览（如何启动）

> ⚠️ **站点内所有链接都是根绝对路径**（`/styles/main.css`、`/archives`、`/ai-weekly`、`/post-images/...`）。
> 所以**不能直接双击 `index.html`**（用 `file://` 打开会样式错乱、图片 404）。
> 必须**用 HTTP 服务器**，并且**以仓库根目录为站点根**。

### 方式一：仓库自带脚本（推荐，零配置）

```powershell
# 默认端口 8123
powershell -ExecutionPolicy Bypass -File start-local-preview.ps1

# 指定端口
powershell -ExecutionPolicy Bypass -File start-local-preview.ps1 -Port 8080
```

脚本会自动寻找 `python` / `py` / `python3` 并启动服务器。浏览器打开 **http://127.0.0.1:8123/**

### 方式二：Python 一行命令

```bash
# 在仓库根目录执行
python -m http.server 8123
# 打开 http://127.0.0.1:8123/
```

### 方式三：Node.js

```bash
# 在仓库根目录执行
npx --yes serve . -l 8123
# 或
npx --yes http-server . -p 8123
```

### 方式四：VS Code

安装 **Live Server** 扩展 → 右键根目录的 `index.html` → **Open with Live Server**。

### 停止服务

在运行服务器的终端按 `Ctrl + C`。

---

## 二、目录结构

```
.
├── index.html                  # 首页（含导航：首页 · 归档 · 标签 · 周报 · 教程 · 搜索）
├── page/2 … page/26            # 首页分页
├── archives/  page/2 … page/4  # 归档（全站文章时间线）
├── tags/                       # 标签总览，及各标签目录
├── about/  404.html  atom.xml  # 关于页 / 404 / RSS
├── search/                     # 站内搜索页
├── api-info/  api-content/     # 搜索索引数据（文章列表与正文摘要）
├── styles/main.css             # 全站样式
├── media/  images/  post-images/  post-assets/   # 图片资源
├── tutorial/                   # 教程总览 + 各教程的文档列表
│   ├── index.html              #   教程总览（课程大图块）
│   └── ai/  page/2…            #   AI 教程的文档列表
├── ai-tutorial/                # 「AI教程」标签页
├── ai-weekly/  page/2…22       # AI 周报列表
├── ai-weekly-YYYY-wNN/         # AI 周报各期（196 期）
├── llm-tutorial-*/             # AI 教程各篇（76 篇）
├── java-tutorial-*/            # Java 教程各篇（95 篇）
├── <随机短目录名>/              # Gridea 生成的其它文章（245 篇）
├── .nojekyll                   # ★ 必须保留（见下方注意事项）
└── start-local-preview.ps1     # 本地预览脚本
```

---

## 三、内容分区

| 分区 | 目录 | 篇数 | 入口 |
|---|---|---|---|
| 首页 | `index.html` + `page/` | — | `/` |
| 归档 | `archives/` + `page/` | 全站 619 篇（7 页） | `/archives` |
| 标签 | `tags/` + 各标签目录 | 50 个标签 | `/tags` |
| AI 周报 | `ai-weekly-YYYY-wNN/` | **196 期** | `/ai-weekly` |
| AI 教程 | `llm-tutorial-*/` | **76 篇** | `/tutorial` → `/tutorial/ai` |
| Java 教程 | `java-tutorial-*/` | **95 篇** | `/tutorial` |
| 其它文章 | 随机短目录名 | **245 篇** | 首页 / 归档 |

---

## 四、部署

GitHub Pages 直接发布本仓库**根目录**，所以部署就是推送：

```bash
git add -A
git commit -m "..."
git push
```

推送后 1–2 分钟自动生效：<https://tianxiawuhao.github.io/>

---

## 五、维护注意事项

1. **`.nojekyll` 必须保留**
   GitHub Pages 默认用 Jekyll 处理站点，而 Jekyll 会**忽略以下划线开头的目录**（例如 `_MxFmWNQI/`）。
   仓库根目录的这个空文件用于关闭 Jekyll，删掉它会导致这类目录 404。

2. **新增/修改页面时使用根绝对路径**
   站内链接统一写成 `/xxx/yyy`（以 `/` 开头），不要用 `./` 或 `../` 相对路径 —— 否则分页
   （`/page/2/`）与文章页（`深度不一`）会解析错误。

3. **图片放在 `post-images/`**
   文章里统一引用 `/post-images/<子目录>/<文件名>`。教程插图在 `post-images/tutorial-figs/`（138 张）。

4. **搜索索引需要同步**
   新增文章后，若要能被站内搜索到，需要把条目补进 `api-info/index.html`（文章清单）与
   `api-content/index.html`（正文摘要）。归档页 `archives/` 也需要相应补条目。

5. **教程系列结构**
   - `tutorial/index.html` 是**教程总览**（每个课程一个大图块）
   - `tutorial/ai/index.html` 是 **AI 教程的文档列表**（分页）
   - `ai-tutorial/` 是「AI教程」**标签页**
   新增教程时三者都要照顾到。

6. **HTML 文件编码**
   全部为 **UTF-8（无 BOM）**。用 PowerShell 处理中文时避免 `Get-Content`（默认按 ANSI 解码会产生乱码），
   建议显式指定：

   ```powershell
   [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
   ```

---

## 六、常见问题

| 现象 | 原因 / 解决 |
|---|---|
| 打开后没有样式、图片全裂 | 用 `file://` 直接打开了（或用错了站点根）。改用上面的 HTTP 服务器方式，并在**仓库根目录**启动 |
| `_MxFmWNQI/` 等目录 404 | 根目录 `.nojekyll` 丢失了，补回来 |
| 分页页面的链接跳错 | 用了相对路径，改成根绝对路径 `/...` |
| 中文显示成乱码 | 读取文件时用了 ANSI 解码，改用 UTF-8 显式读取 |
| 教程页图块右侧留白 | 表格或容器列数多了空列；检查该页的 `container / row / col-lg-8` 是否重复嵌套 |
