/*eslint-env node, express*/


// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
const cfenv = require('cfenv');

// create a new express server
const app = express();
const http = require('http').Server(app);
const server = http.createServer(app);
const io = require('socket.io').listen(server);
//const io = require('socket.io')(http);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
const appEnv = cfenv.getAppEnv();
const PORT = appEnv.port;

// TODO:呼び出されていない？？
app.get(`/`, (req, res) => {
	console.log("★app.get");
	res.sendFile(__dirname + '/public/red.html');
});


// start server on the specified port and binding host
app.listen(PORT, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("★server starting on " + appEnv.url);
});

io.on('connection', (socket) => {
	console.log('★a user connected');

	socket.on('chat message', (msg) => {
		console.log('★message: ' + msg);
		io.emit('chat message', msg);
	});
});


/*
// ファイル読み込み
var fs = require("fs");

var server = require("http").createServer(function(req, res) {
	// リクエストされたページをURLごとに返すだけ
	console.log(req.url);
	res.writeHead(200, {"Content-Type":"text/html"});
	var output = "";
	if (req.url === '/center.html') {
		output = fs.readFileSync("./public/center.html", "utf-8");
	} else if (req.url === '/yellow.html') {
		output = fs.readFileSync("./public/yellow.html", "utf-8");
	} else if (req.url === '/red.html') {
		output = fs.readFileSync("./public/red.html", "utf-8");
	} else {
		output = fs.readFileSync("./public/index.html", "utf-8");
	}
	res.end(output);
}).listen(8080);
// WebSocket開始
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// 2.イベントの定義
io.sockets.on("connection", function (socket) {
	// 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
	socket.on("connected", function (name) {
		var msg = name + "が入室しました";
		userHash[socket.id] = name;
		io.sockets.emit("publish", {value: msg});
	});

	// コマンド受信時の処理
	socket.on("publish", function (data) {
		var cmd = data.value;
		// コマンドごとの対応はこのへん拡張する
		if (cmd === "GAME_START") {
			io.sockets.emit("publish", {value: "SRVCCMD_GAME_START"});
		} else if (cmd === "GAME_ABORT") {
			io.sockets.emit("publish", {value: "SRVCCMD_GAME_ABORT"});
		} else if (cmd === "YELLOW_FLAG_DOWN") {
			io.sockets.emit("publish", {value: "SRVCCMD_YELLOW_FLAG_DOWN"});
		} else if (cmd === "RED_FLAG_DOWN") {
			io.sockets.emit("publish", {value: "SRVCCMD_RED_FLAG_DOWN"});
		} else {
			//io.sockets.emit("publish", {value: cmd});
			io.sockets.emit("publish", {value: "other"});
		}
	});

	// 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
	socket.on("disconnect", function () {
		if (userHash[socket.id]) {
			var msg = userHash[socket.id] + "が退出しました";
			delete userHash[socket.id];
			io.sockets.emit("publish", {value: msg});
		}
	});
});
*/
