import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDB() {
  return open({
    filename: './database/database.db',
    driver: sqlite3.Database
  });
}

async function setup() {
  const db = await openDB();
  console.log('Database opened: ', db);
}

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.post('/api/saveTableData', async (req, res) => {
    console.log(req.body);
    return;
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  setup();
});