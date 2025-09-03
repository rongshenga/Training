# 服务器数据存储与账号区分开发计划

## 1. 项目基础结构搭建 (Setup)
- [x] **创建目录**: 创建 `server/` 和 `public/` 目录。
- [x] **迁移前端文件**: 将 `index.html`, `style.css`, `script.js` 移动到 `public/` 目录下。
- [x] **初始化后端项目**: 在项目根目录创建 `package.json`，并安装 `express`, `sqlite3`, `nodemon`, `dotenv`。
- [x] **配置开发脚本**: 在 `package.json` 中添加 `start` 和 `dev` 命令，后者使用 `nodemon` 实现服务器热重载。
- [x] **创建基础后端服务**: 创建 `server/app.js`，设置一个 Express 服务器，并完成以下配置：
  - 能够托管 `public` 目录下的静态文件。
  - 使用 `dotenv` 加载环境变量（如 `PORT`）。
  - 配置 CORS 中间件，允许跨域请求。
- [x] **验证**: 启动服务器后，确保在浏览器中访问时，现有静态页面功能完全正常。

## 2. 后端开发 (Backend Development)
- [x] **数据库设计与初始化**:
  - 选用 **SQLite** 数据库。
  - 在 `server/` 目录下创建数据库初始化脚本，定义 `users` 和 `training_plans` 等表结构。
- [x] **用户认证 (Authentication)**:
  - [x] 实现用户注册 API (`POST /auth/register`)。
  - [x] 实现用户登录 API (`POST /auth/login`)，成功后返回 JWT Token。
- [x] **核心 API 开发 (Core API)**:
  - [x] 创建身份验证中间件，用于保护需要登录的接口。
  - [x] 实现训练计划 API (`GET /api/plan`, `POST /api/plan`)。
  - [x] 实现历史记录 API (`GET /api/history`, `POST /api/history`)。

- [x] **文档**: 创建 `README.md`，说明服务器版和静态版的运行方式。

## 3. 前端改造 (Frontend Refactoring)
- [x] **API 服务模块**: 在 `public/script.js` 中创建一个模块或一组函数，用于封装所有对后端 API 的 `fetch` 调用。
- [ ] **双模式持久化改造 (Dual-Mode Persistence)**:
  - [x] **模式检测**: 通过健康检查API (`/api/health`) 动态判断运行模式。
    - [x] 后端: 添加 `GET /api/health` 端点。
    - [x] 前端: 在 `app.init` 中调用健康检查API，根据结果设置模式，失败则回退到静态模式。
  - [ ] 改造 `app.storage` 模块，使其成为一个抽象数据层，能根据当前模式调用 `localStorage` 或 API。
  - [ ] 更新所有数据保存和加载的调用点，使用新的抽象数据层。
- [ ] **集成用户认证 (Authentication)**:
  - [ ] 在服务器模式下，添加并显示登录/注册 UI。
  - [ ] 在服务器模式下，实现完整的登录、Token 保存和 API 请求认证流程。
  - [ ] 在静态模式下，自动隐藏登录/注册相关的 UI 元素。
