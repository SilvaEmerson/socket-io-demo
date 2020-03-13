var app = require("express")();
const express = require("express");
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(express.json());

app.get("/", function(req, res) {
  res.send("Hello");
});

app.post("/", function(req, res) {
  console.log(req.body)
  io.sockets
    .in(req.body.roomId)
    .emit("solicitation", { message: req.body.message });
  res.send("New solicitation");
});

const nsp = io.of('/custom-namespace');

nsp.on('connection', (socket) => {
  console.log("Someone connected to custom-namespace")
  nsp.emit('message-channel', {message: "Hello"})
})

io.on("connection", function(socket) {
  console.log("Someone connected");
  io.emit('message-channel', {message: "Hello"})
  socket.on("room", function(data) {
    socket.join(data.roomId);
  });
});

server.listen(3001);
