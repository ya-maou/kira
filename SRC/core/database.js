import mysql from 'mysql2/promise';

// Create the connection with promise support
const db = await mysql.createConnection({
    host: 'localhost', // Update to your host
    user: 'root',      // Update to your username
    password: '', // Update to your password
    database: 'yami' // Update to your database
});

console.log('Connected to MySQL database!');

export default db;
