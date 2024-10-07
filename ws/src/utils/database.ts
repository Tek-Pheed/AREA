require('dotenv').config();
import * as mysql from 'mysql2';

export const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWD,
    database: process.env.MYSQL_DATABASE,
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
