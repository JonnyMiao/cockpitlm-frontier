# CockpitLM Frontier

**面向智能座舱的 VLM / OMNI / World Model 前沿研究情报平台**

CockpitLM Frontier 用于持续追踪视觉语言模型、视频 VLM、原生全模态模型、多模态智能体、世界模型及其向智能座舱场景的迁移价值。

平台连接的不只是论文列表，而是完整的研究决策链：

> 论文 → 方法 → 模型 → 数据集 / 评测基准 → 研究趋势 → 座舱相关性 → 工程建议

## 核心原则

- 使用真实、可追溯的研究来源，不虚构论文、模型或统计数据。
- 来源元数据与平台生成的分类、评分和工程建议分开存储。
- 保留来源平台、原始记录 ID、来源链接、更新时间和采集时间。
- 支持增量采集、标准化、去重和失败恢复。
- 评分是透明的研究辅助信号，不替代论文原文、实验复现和安全验证。
- 产品面向桌面研究工作流，保持克制、专业和信息密集的界面。

## 在线版本

[访问 CockpitLM Frontier](https://cockpitlm-frontier-research.jonnym5832.chatgpt.site)

当前在线站点采用私有访问方式，需要通过 ChatGPT 登录。仓库同时支持完全本地运行。

## 当前能力

- 内置 1,200 条由 arXiv 公共 API 获取的真实研究记录。
- 提供 arXiv、OpenAlex 和 Crossref 模块化数据源适配器。
- 完整的采集、解析、验证、标准化、去重、分类和发布流程。
- 优先按 DOI 和 arXiv ID 去重，并使用标题、年份和作者重合度作为补充策略。
- 服务端论文搜索、筛选、排序和分页。
- 支持按研究主题、座舱任务、模态、分类、年份和评分筛选。
- 论文详情包含来源追溯、方法信号、三项决策评分、座舱迁移和推荐实验。
- 提供主题技术档案、90 天研究雷达和智能座舱技术地图。
- 提供模型、数据集、评测基准知识库和工程手册。
- 默认中文界面，支持持久化的中文 / English 切换。
- 支持浅色、深色主题和桌面优先的响应式布局。

## 技术栈

- React 19
- TypeScript 严格模式
- vinext
- Vite 8
- Tailwind CSS 4
- Cloudflare Workers 兼容 ESM 构建
- Drizzle ORM
- Cloudflare D1 / SQLite 数据模型
- Node.js 原生测试运行器

## 系统架构

```text
学术数据源
  ├─ arXiv（当前批量采集来源）
  ├─ OpenAlex（适配器）
  └─ Crossref（适配器）
        ↓
采集 → 解析 → 校验 → 标准化 → 去重
        ↓
SourcePaper 语料库（来源字段 + 数据追溯）
        ↓
主题分类 → 三项评分 → 座舱迁移 → 推荐实验
        ↓
Repository / JSON API → 服务端页面 → 研究工作台
        ↓
Cloudflare Worker + D1 Schema / Migration
```

## 项目结构

```text
app/                     页面、路由和 JSON API
components/              可复用界面组件
data/papers.json         已采集且来源可追溯的论文语料库
data/entities.ts         模型、数据集和评测基准档案
data/entities.zh.ts      知识实体中文展示内容
data/playbooks.ts        工程决策手册原始内容
data/playbooks.zh.ts     工程手册中文内容
db/schema.ts             研究知识关系数据库结构
drizzle/                 已生成并纳入版本管理的迁移文件
lib/providers/           模块化研究数据源适配器
lib/ingestion/           数据验证和采集编排
lib/taxonomy.ts          研究主题与座舱任务分类规则
lib/scoring.ts           三项可解释评分规则
lib/repository.ts        论文查询、筛选和趋势计算
scripts/ingest.ts        增量采集入口
tests/                   解析、去重、分类、查询和渲染测试
worker/                  Cloudflare Worker 入口
```

## 环境要求

- Node.js `22.13.0` 或更高版本
- npm（安装 Node.js 时会一并安装）
- 如需重新采集论文，需要能够访问对应的公开学术 API

检查版本：

```bash
node --version
npm --version
```

Windows PowerShell 如果限制了 `npm.ps1`，可以直接使用 `npm.cmd`：

```powershell
npm.cmd --version
```

## 安装依赖

进入项目目录后执行：

```bash
npm ci
```

Windows PowerShell：

```powershell
cd C:\Users\Miao8\Documents\cockpitlm-frontier
npm.cmd ci
```

## 本地运行模式

本项目所说的“本地模式”可以分为三种，它们解决的问题不同。

### 1. 本地开发模式

适合修改页面、调试交互和查看热更新：

```bash
npm run dev
```

Windows PowerShell：

```powershell
npm.cmd run dev
```

启动后访问：

```text
http://localhost:3000
```

特点：

- 修改代码后自动刷新。
- 输出更详细的开发错误信息。
- 不需要先执行生产构建。
- 适合日常开发，不代表最终生产性能。

### 2. 本地生产模式

这是最接近线上部署的本地运行方式，也可以理解为“先生成生产构建，再在本地运行”：

```bash
npm run build
npm run start
```

Windows PowerShell：

```powershell
npm.cmd run build
npm.cmd run start
```

特点：

- `npm run build` 在 `dist/` 中生成 Cloudflare Worker 兼容产物。
- `npm run start` 启动已构建的生产版本。
- 没有开发热更新。
- 适合发布前验证路由、构建产物和生产行为。

### 3. 本地数据生成 / 更新模式

如果“本地生成”指的是重新抓取并生成论文语料库，可使用采集命令。

小规模开发更新：

```bash
npm run ingest:quick
```

完整目标采集：

```bash
npm run ingest
```

采集程序会查询研究方向、校验记录、标准化字段、与现有语料去重并更新 `data/papers.json`。失败的单个查询会被记录，不会清空已有成功数据。

> 浏览现有网站不需要执行采集命令。仓库中的论文数据可以直接用于本地运行。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 生成生产构建 |
| `npm run start` | 运行本地生产版本 |
| `npm run lint` | 检查代码规范 |
| `npm run typecheck` | 执行 TypeScript 严格类型检查 |
| `npm test` | 运行单元测试 |
| `npm run test:render` | 检查服务端页面渲染 |
| `npm run ingest:quick` | 小规模更新论文数据 |
| `npm run ingest` | 执行完整目标采集 |
| `npm run db:generate` | 根据数据库结构生成迁移 |

## 环境变量

当前内置 arXiv 采集不需要 API Key，网站使用仓库中的语料库时也不需要 OpenAI API Key。

复制环境变量示例：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

只有启用需要鉴权的可选数据增强提供方时，才需要在本地 `.env` 中添加相应密钥。不要把 `.env` 或任何真实密钥提交到 GitHub。

## 数据库与迁移

`.openai/hosting.json` 中声明的逻辑 D1 绑定名称为 `DB`。数据库结构覆盖：

- `papers`、`paper_authors` 和来源标识 / 追溯字段；
- `topics`、`methods`、`cockpit_tasks` 及论文多对多关系；
- `models`、`datasets`、`benchmarks` 及论文关联；
- 独立版本化的 `research_intelligence`；
- 记录提供方运行状态的 `ingestion_runs`。

修改 `db/schema.ts` 后生成迁移：

```bash
npm run db:generate
```

提交前必须检查 `drizzle/` 下生成的 SQL。在线部署由 Sites 管理真实 D1 资源并应用打包后的迁移。

当前界面也保留 `data/papers.json` 只读后备，因此在本地没有 D1 数据库时，论文浏览、搜索和筛选仍可正常使用。

## 论文采集与增量更新

采集流程：

```text
Provider Query
  → Parse
  → Validate
  → Normalize
  → Deduplicate
  → Classify
  → Write Corpus
```

`.github/workflows/ingest.yml` 提供每日增量更新工作流，仅在真实语料变化并通过校验后提交数据变更。

### 添加新的数据源

1. 实现 `lib/providers/types.ts` 中的 `ResearchProvider`。
2. 将提供方响应映射为 `SourcePaper`。
3. 保留提供方记录 ID、规范来源 URL 和采集时间。
4. 在 `lib/providers/index.ts` 中注册提供方。
5. 添加基于固定样本的解析测试和失败测试。
6. 如有稳定标识符，将其加入规范键优先级。
7. 遵守提供方限流、缓存、许可和重试要求。

不得把自动生成的摘要、评分或工程建议写入来源元数据字段。

## 主题分类与评分

分类规则位于 `lib/taxonomy.ts`，覆盖：

- 多模态融合
- 视频 VLM
- 原生 OMNI
- VLM 微调
- 知识蒸馏
- 端侧 VLM
- 世界模型
- 多模态智能体
- 多模态推理

座舱任务分类覆盖感知、驾驶员 / 乘员状态、行为 / 事件、意图 / 推理、交互、智能体 / 执行和端侧部署。

平台提供三项相互独立的 1–5 分研究辅助评分：

- **前沿度**：发布时间和前沿研究主题信号，不是引用排名。
- **座舱相关度**：可迁移座舱任务和工程信号。
- **工程成熟度**：代码、发布产物和部署方法等可核验元数据信号。

每个分数都带解释。这些分数不替代论文结论、基准复核、工程复现或安全验证。

## JSON API

| 接口 | 说明 |
| --- | --- |
| `GET /api/papers` | 分页论文搜索和筛选 |
| `GET /api/papers/:id` | 包含来源追溯的论文详情 |
| `GET /api/radar` | 基于样本量的 90 天主题趋势比较 |
| `GET /api/health` | 服务、数据源和语料库状态 |

## 质量检查

提交或发布前建议执行：

```bash
npm run lint
npm run typecheck
npm test
npm run test:render
npm run build
```

测试覆盖数据解析、标准化、去重、主题分类、座舱映射、搜索、筛选、分页和服务端渲染。

## 部署

生产构建会在 `dist/` 下生成 Cloudflare Worker 兼容应用。当前在线版本通过 OpenAI Sites 发布，并打包：

- 已验证的 `dist/` 生产构建；
- `.openai/hosting.json`；
- Drizzle 数据库迁移。

本地运行不依赖 Sites，也不要求登录 ChatGPT。

## 数据来源与可信边界

- 论文语料：arXiv 公共 API。
- 可选元数据增强：OpenAlex 和 Crossref 适配器。
- 模型、数据集和评测档案：官方模型卡、项目页和基准网站。

每条论文记录保留数据源、数据源记录 ID、来源 URL、来源更新时间和平台采集时间。缺失字段保持为未知，不通过猜测补齐。

## 已知限制

- 当前语料库是面向目标研究方向的快照，不代表整个领域的完整论文集合。
- arXiv 元数据通常不包含完整训练配方、代码、权重、数据集和最终发表场所。
- 当前研究情报主要来自确定性规则和摘要级抽取。
- 未经原论文或官方基准核验的定量结论不会被平台直接复述。
- 趋势数据只代表当前语料库和查询策略，不代表领域总发文量。
- OpenReview、CVF Open Access、ACL Anthology、Semantic Scholar、GitHub 和 Hugging Face 等增强来源仍需独立模块接入。
- 座舱迁移建议仍需要领域数据、受控实验、安全审查和目标硬件性能验证。

## 许可证与引用

仓库中的第三方论文元数据、模型、数据集和评测内容分别遵循其原始来源的许可与使用条款。使用研究内容时，请访问详情页中的官方来源并引用原始论文或项目。
