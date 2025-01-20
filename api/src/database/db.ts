require('dotenv').config();
import * as mysql from 'mysql2';

export const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 0
});

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const dbConnect = new Promise((resolve, reject) => {
    db.connect((err: mysql.QueryError | null) => {
        if (err) {
            reject(err);
        } else {
            resolve(null);
        }
    });
});

export default dbConnect;
exports.db = db;
