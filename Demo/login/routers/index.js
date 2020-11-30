const Router = require('koa-router'),
	FS = require('fs');

const sqlQuery = require('../utils/query.js');

let router = new Router();

router
	.get('/', async (ctx) => {
		// 数据库创建表：userinfo
		let sqlOperation = `create table if not exists userinfo (
		user_name varchar(255) not null,
		user_password varchar(255) not null,
		primary key(user_name)
	)`;
		sqlQuery.query(sqlOperation);
		// 插入默认用户名和密码: root 123456
		sqlOperation = `insert into userinfo (user_name, user_password) select ?,?
    where not exists(select user_name from userinfo where (user_name=?))`;
		sqlQuery.query(sqlOperation, ['root', '123456', 'root']);

		ctx.response.type = 'html';
		ctx.response.body = FS.createReadStream('./views/login.html');
	})
	// 接收post提交的数据
	.post('/dologin', async (ctx) => {
		// userInfo {username, password}
		let userInfo = ctx.request.body;
		// 查询数据
		let sqlOperation = `select * from userinfo where(user_name=? and user_password=?)`;
		let data = sqlQuery.query(sqlOperation, [
			userInfo.username,
			userInfo.password,
		]);
		await data.then((val) => {
			if (val.length == 0) {
				ctx.redirect('/');
			} else {
				ctx.response.type = 'html';
				ctx.response.body = FS.createReadStream('./views/main.html');
				// ctx.body = userInfo;
			}
		});
	});

module.exports = router;
