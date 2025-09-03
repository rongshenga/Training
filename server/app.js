require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件托管
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
