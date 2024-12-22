import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { run } from 'node:test';

async function openDB() {
  return open({
    filename: './database/database.db',
    driver: sqlite3.Database
  });
}

let db: Database | null = null;

async function setup() {
  await openDB().then((database) => {
    db = database;
  }).then(async () => {
    await db!.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL
    )
  `);
    console.log('Table "messages" is ready.');
  });
}

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 通用错误处理
function runDatabase(task: Promise<any> | undefined, res: express.Response) {
  if (!db || !task) {
    res.status(500).json({ error: "Database not initialized" });
    return;
  }
  task.catch((error) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });
}

// 路由
app.post('/api/saveMessages', async (req, res) => {
  const { message } = req.body;
  const task = db?.run('INSERT INTO messages (message) VALUES (?)', [JSON.stringify(message)]).then((result) => {
    console.log('Message saved', message, "id is", result.lastID);
    res.status(201).json({ success: true, savedId: result.lastID });
  })
  runDatabase(task, res);
});

app.get('/api/getMessages', async (req, res) => {
  console.log('getMessages called');
  const task = db?.all('SELECT * FROM messages').then((rows) => {
    const messages = rows.map(row => ({
      ...JSON.parse(row.message),
      savedId: row.id
    }));
    res.status(200).json(messages);
  })
  runDatabase(task, res);
});

app.delete('/api/deleteMessages', async (req, res) => {
  const task = db?.run('DELETE FROM messages').then(() => {
    res.status(200).json({ success: true });
  });
  runDatabase(task, res);
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  setup();
});