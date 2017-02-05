/*eslint-env node */


var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     //リクエストされたページをURLごとに返すだけ
     console.log(req.url);
     //res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     if(req.url == '/center.html'){
       res.writeHead(200, {"Content-Type":"text/html"});
       output = fs.readFileSync("./center.html", "utf-8");
     }else if(req.url == '/yellow.html'){
       res.writeHead(200, {"Content-Type":"text/html"});
       output = fs.readFileSync("./yellow.html", "utf-8");
     }else if(req.url == '/red.html'){
       res.writeHead(200, {"Content-Type":"text/html"});
       output = fs.readFileSync("./red.html", "utf-8");
     }else{
       res.writeHead(404, {"Content-Type":"text/html"});
       output = "404 Error";
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

  //コマンド受信時の処理
  socket.on("publish", function (data) {
    var cmd = data.value;
    //コマンドごとの対応はこのへん拡張する
    if(cmd == "GAME_START" ){
      io.sockets.emit("publish", {value: "SRVCCMD_GAME_START"});
    }else if(cmd == "GAME_ABORT" ){
      io.sockets.emit("publish", {value: "SRVCCMD_GAME_ABORT"});
    }else if(cmd == "YELLOW_FLAG_DOWN" ){
      io.sockets.emit("publish", {value: "SRVCCMD_YELLOW_FLAG_DOWN"});
    }else if(cmd == "RED_FLAG_DOWN" ){
      io.sockets.emit("publish", {value: "SRVCCMD_RED_FLAG_DOWN"});
    }else{
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
