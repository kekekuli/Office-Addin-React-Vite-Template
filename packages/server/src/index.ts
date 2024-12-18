import sqlite3 from "sqlite3";

import {open} from "sqlite";

async function openDB(){
    return open({
        filename: "./database/database.db",
        driver: sqlite3.Database
    })
}

async function setup(){
    const db = await openDB();
    console.log("Database opened: ", db);
}
