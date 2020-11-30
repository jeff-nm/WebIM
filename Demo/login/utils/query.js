// 执行SQL语句
// 核心模块 + 第三方模块
const mysql = require('mysql');

// 自定义模块
const mysqlConfig = require('../config/mysql_config.js');

// mysql
const pool = mysql.createPool(mysqlConfig);

// query sql语句入口
const query = (sql, val) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err);
			else {
				connection.query(sql, val, (err, fields) => {
					if (err) reject(err);
					else resolve(fields);
					connection.release();
				});
			}
		});
	});
};

module.exports = {
	query,
};
