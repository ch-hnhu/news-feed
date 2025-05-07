// config/db.js
const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "newsfeed_management",
});

conn.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối database:", err);
        return;
    }
    console.log("✅ Kết nối MySQL thành công!");
});

module.exports = conn;
