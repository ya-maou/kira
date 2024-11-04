// db.js or db.ts
import mysql from 'mysql2/promise'; // `mysql2/promise` provides a modern async interface

// Create a connection to the database
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yami'
});

export default db;
