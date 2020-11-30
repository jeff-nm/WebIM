const Koa = require('koa'),
	Router = require('koa-router'),
	bodyParser = require('koa-bodyparser'),
	fs = require('fs');

const sqlQuery = require('./utils/query.js');

// 实例化
var app = new Koa(),
	router = new Router();

// 中间件
app.use(bodyParser()); // 获取表单post数据

// 路由
router.get('/', async (ctx) => {
	// 数据库创建表：userinfo
	let sqlOperation = `create table if not exists userinfo (
		user_name varchar(255) not null,
		user_password varchar(255) not null,
		primary key(user_name)
	)`;
	sqlQuery.query(sqlOperation);
	// 插入默认用户名和密码: root 123456
	sqlOperation = `insert into userinfo (user_name, user_password) values (?,?)`;
	sqlQuery.query(sqlOperation, ['root', '123456']);

	ctx.response.type = 'html';
	ctx.response.body = fs.createReadStream(__dirname + '/views/login.html');
});

// 接收post提交的数据
router.post('/dologin', async (ctx) => {
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
			ctx.response.body = fs.createReadStream(
				__dirname + '/views/main.html'
			);
			ctx.body = userInfo;
		}
	});
});

// 启动路由
app.use(router.routes()) // 启动路由
	.use(router.allowedMethods());

app.listen(3000);
