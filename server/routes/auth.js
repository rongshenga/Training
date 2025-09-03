const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database.js');

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    
    db.run(sql, [username, hashedPassword], function(err) {
      if (err) {
        // UNIQUE constraint failed
        if (err.errno === 19) {
          return res.status(409).json({ error: '用户名已存在' });
        }
        return res.status(500).json({ error: '数据库错误，注册失败' });
      }
      res.status(201).json({ message: '用户注册成功', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误，注册失败' });
  }
});

module.exports = router;
