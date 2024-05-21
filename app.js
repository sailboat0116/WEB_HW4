var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 打開 SQLite 資料庫
var db = new sqlite3.Database(path.join(__dirname, 'db', 'sqlite.db'), (err) => {
    if (err) {
        console.error('資料庫連接失敗:', err.message);
    } else {
        console.log('已成功連接到 SQLite3 資料庫。');
    }
});


app.get('/api/sumit', function(req, res, next) {
    // 從請求中獲取 year 和 month 參數
    var year = req.query.year;
    var month = req.query.month;

    if (!year || !month) {
        return res.status(400).send('請提供 year 和 month 參數');
    }

    // 構建查詢語句
    var query = 'SELECT money FROM avocado WHERE year = ? AND month = ?';

    // 執行查詢
    db.get(query, [year, month], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.json({ error: '找不到符合條件的資料。' });
        }

        // 返回查詢結果中的 money
        res.json({ money: row.money });
    });
});

module.exports = app;