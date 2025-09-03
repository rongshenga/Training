const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const db = require('../database.js');

// 健康检查端点（无需认证）
router.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'server' });
});

// 应用认证中间件于所有 /api 路由
router.use(authMiddleware);

// 获取训练计划
router.get('/plan', (req, res) => {
  // 示例：从数据库获取该用户最新的训练计划
  const userId = req.user.id;
  const sql = `
    SELECT state FROM training_plans 
    WHERE user_id = ? 
    ORDER BY updated_at DESC 
    LIMIT 1`;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询失败' });
    }
    if (row) {
      res.json(JSON.parse(row.state));
    } else {
      res.json({}); // 如果没有数据，返回空对象
    }
  });
});

// 保存训练计划
router.post('/plan', (req, res) => {
  const userId = req.user.id;
  const { state } = req.body;

  if (!state) {
    return res.status(400).json({ error: '请求体中缺少state数据' });
  }

  const stateJson = JSON.stringify(state);
  const sql = `INSERT INTO training_plans (user_id, state) VALUES (?, ?)`;

  db.run(sql, [userId, stateJson], function(err) {
    if (err) {
      return res.status(500).json({ error: '数据库操作失败' });
    }
    res.status(201).json({ message: '训练计划已保存', planId: this.lastID });
  });
});

// 获取所有历史记录
router.get('/history', (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT state FROM training_plans 
    WHERE user_id = ? 
    ORDER BY created_at DESC`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '数据库查询失败' });
    }
    const history = rows.map(row => JSON.parse(row.state));
    res.json(history);
  });
});

// 归档训练计划（与保存逻辑相同）
router.post('/history', (req, res) => {
  const userId = req.user.id;
  const { state } = req.body;

  if (!state) {
    return res.status(400).json({ error: '请求体中缺少state数据' });
  }

  const stateJson = JSON.stringify(state);
  const sql = `INSERT INTO training_plans (user_id, state) VALUES (?, ?)`;

  db.run(sql, [userId, stateJson], function(err) {
    if (err) {
      return res.status(500).json({ error: '数据库操作失败' });
    }
    res.status(201).json({ message: '训练历史已归档', planId: this.lastID });
  });
});

module.exports = router;
