import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

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
  }).then(async ()=>{
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

// 路由
app.post('/api/saveMessages', async (req, res) => {
  const {message} = req.body;  

  if (db){
    db.run('INSERT INTO messages (message) VALUES (?)', [JSON.stringify(message)]).then((result) => {
      console.log('Message saved', message, "id is", result.lastID);
    }).catch((error) => {
      console.error(error);
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  setup();
});