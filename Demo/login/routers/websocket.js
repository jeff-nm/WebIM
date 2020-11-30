const Router = require('koa-router'),
	FS = require('fs');

let router = new Router();

// 用来存储建立了的链接，（真实项目中使用数据库代替）
let wsObj = {};

router.all('/main', (ctx) => {
	// 客户端链接传过来的客户端身份
	const { id } = ctx.query;
	// 将链接保存起来
	wsObj[id] = ctx;
	// 给客户端发送链接成功信息
	ctx.websocket.send('连接成功');
	// 监听客户端发送过来的信息
	ctx.websocket.on('message', (message) => {
		// uid为发送方，将接收到的信息发送给接收方sendid
		const sendid = JSON.parse(message).sendid;
		if (!wsObj[sendid]) {
			ctx.websocket.send(`${sendid}未上线`);
		} else {
			wsObj[sendid].websocket.send(message);
		}
	});
});

module.exports = router;
