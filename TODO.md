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
- [ ] **核心 API 开发 (Core API)**:
  - [x] 创建身份验证中间件，用于保护需要登录的接口。
  - [x] 实现训练计划 API (`GET /api/plan`, `POST /api/plan`)。
  - [ ] 实现历史记录 API (`GET /api/history`, `POST /api/history`)。

## 3. 前端改造 (Frontend Refactoring)
- [ ] **API 服务模块**: 在 `public/script.js` 中创建一个模块或一组函数，用于封装所有对后端 API 的 `fetch` 调用。
- [ ] **状态管理**: 将原来从 `localStorage` 加载和保存状态的逻辑，替换为调用后端的 API。
- [ ] **集成用户认证**:
  - 添加登录/注册 UI（如果需要）。
  - 实现登录逻辑，保存 Token，并在后续的 API 请求中带上它。
