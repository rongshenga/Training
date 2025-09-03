const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('无法连接到数据库:', err.message);
  } else {
    console.log('成功连接到SQLite数据库.');
  }
});

db.serialize(() => {
  // 创建 users 表
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('创建 users 表失败:', err.message);
    } else {
      console.log('Users 表已成功创建或已存在.');
    }
  });

  // 创建 training_plans 表
  // state TEXT 存储整个前端状态对象的JSON字符串
  db.run(`CREATE TABLE IF NOT EXISTS training_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('创建 training_plans 表失败:', err.message);
    } else {
      console.log('Training_plans 表已成功创建或已存在.');
    }
  });
});

module.exports = db;
