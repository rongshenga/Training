# Strength Training Program Tracker

This is a single-page web application for tracking an 8-week strength training program.

The project supports two modes of operation: a server-based version with a database and user accounts, and a standalone static version that uses the browser's `localStorage`.

## How to Run

### 1. Static Version (No Server Required)

This version saves all your data directly in your web browser.

1.  Navigate to the `public/` directory.
2.  Open the `index.html` file directly in a modern web browser (e.g., Chrome, Firefox, Safari).

### 2. Server Version (with Database and User Accounts)

This version requires Node.js and npm. It allows you to save your progress on a server, accessible via a user account.

1.  **Install Dependencies**:
    Open your terminal in the project root directory and run:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    To start the server with automatic reloading, run:
    ```bash
    npm run dev
    ```

3.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000`.

The server will run on port 3000 by default. You can change this in the `.env` file if needed.
