# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a simple single-page web application for tracking an 8-week strength training program. It is built with vanilla HTML, CSS, and JavaScript, and does not use any external libraries or build tools. All data is stored locally in the user's browser using `localStorage`.

## Project Structure

- `index.html`: The main HTML file that defines the structure of the application page, including input fields for Training Maxes (TMs), buttons for various actions, and containers for the workout plan and history view.
- `style.css`: The stylesheet for the application. It includes a dark theme, responsive layouts for the workout plan, and styling for cards, buttons, and modals.
- `script.js`: Contains all the application logic. It manages the application state (TMs, workout progress, archived cycles), renders the UI dynamically, handles user interactions, and persists data to `localStorage`.

## Development Commands

- **本地预览**: 直接在浏览器中打开 `index.html` 进行测试。
- **后端开发**: 当引入后端服务后，需要通过 `npm run dev` 启动本地服务器进行开发。

### NPM 环境配置

如果你的开发环境需要代理，请使用以下一条命令进行配置（已包含淘宝镜像源）:

```bash
npm config set proxy http://127.0.0.1:7890 && npm config set https-proxy http://127.0.0.1:7890 && npm config set registry https://registry.npmmirror.com/
```

Since this is a minimal project without a build system:

- Open `index.html` directly in a web browser for testing.
- There are no build, lint, or test commands configured.

## Architecture Notes

The application follows a simple, state-driven architecture implemented in vanilla JavaScript.
- **State Management**: A global `state` object in `script.js` holds all application data, including user TMs, progress, and historical workout cycles.
- **Data Persistence**: The `state` object is serialized to JSON and saved to the browser's `localStorage` whenever a change is made, ensuring data is preserved across sessions.
- **Rendering**: The UI, particularly the workout plan, is dynamically generated and updated by functions in `script.js` that manipulate the DOM. There is no virtual DOM or templating engine.
- **Modularity**: The JavaScript code is organized into sections for data, state, DOM elements, utility functions, rendering functions, event handlers, and initialization.

## Communication Policy

- 使用中文回复所有问题和说明
- 涉及代码的改动，改动完运行正常后都需要提交到git
- 完成 `TODO.md` 中的任务后，需要更新其状态并提交到 Git
- 提交代码时，总是使用 `git add .` 命令来确保所有本地改动都被纳入版本控制，避免遗漏。

## Coding Style and Conventions

- **HTML Content**: All user-visible text in `index.html` must be in English.
- **Git Commits**: Commit messages must follow the conventional commit format (e.g., `fix(scope): message`), but the descriptive part of the message must be in Chinese. For example: `fix(ui): 修复按钮样式`.
