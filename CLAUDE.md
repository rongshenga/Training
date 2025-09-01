# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a simple single-page web application for tracking an 8-week strength training program. It is built with vanilla HTML, CSS, and JavaScript, and does not use any external libraries or build tools. All data is stored locally in the user's browser using `localStorage`.

## Project Structure

- `index.html`: The main HTML file that defines the structure of the application page, including input fields for Training Maxes (TMs), buttons for various actions, and containers for the workout plan and history view.
- `style.css`: The stylesheet for the application. It includes a dark theme, responsive layouts for the workout plan, and styling for cards, buttons, and modals.
- `script.js`: Contains all the application logic. It manages the application state (TMs, workout progress, archived cycles), renders the UI dynamically, handles user interactions, and persists data to `localStorage`.

## Development Commands

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
