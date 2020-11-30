const Koa = require('koa'),
	Router = require('koa-router'),
	BodyParser = require('koa-bodyparser'),
	KoaStatic = require('koa-static'),
	WebSocket = require('koa-websocket');

const routerCommon = require('./routers/index');
const routerWebSocket = require('./routers/websocket');

// 实例化
const app = WebSocket(new Koa());

// 中间件
app.use(BodyParser()); // 获取表单post数据
app.use(KoaStatic(__dirname + '/static/')); // 配置koa-static中间件 -- 静态web服务

// 启动路由
app.use(routerCommon.routes()) // 启动路由
	.use(routerCommon.allowedMethods());
app.ws.use(routerWebSocket.routes()).use(routerWebSocket.allowedMethods());

app.listen(3000);
