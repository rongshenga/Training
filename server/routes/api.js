const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const db = require('../database.js');

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
  // 使用 INSERT OR REPLACE (UPSERT) 逻辑
  // 这里简化处理：假定每个用户只有一个训练计划记录，我们不断更新它
  // 更完善的设计是记录多条历史，但这超出了当前 TODO 的范围
  const sql = `
    INSERT INTO training_plans (user_id, state) 
    VALUES (?, ?)
    ON CONFLICT(user_id) DO UPDATE SET 
    state=excluded.state, 
    updated_at=CURRENT_TIMESTAMP`;

  db.run(sql, [userId, stateJson], function(err) {
    if (err) {
      return res.status(500).json({ error: '数据库操作失败' });
    }
    res.status(200).json({ message: '训练计划已保存' });
  });
});

module.exports = router;
