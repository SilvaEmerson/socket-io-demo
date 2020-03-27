var app = require("express")();
const express = require("express");
const cors = require("cors");
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(express.json());
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello");
});

app.post("/", function(req, res) {
  io.sockets
    .in(req.body.roomId)
    .emit("solicitation", { message: req.body.message });
  res.send("New solicitation");
});

app.post("/demo", function(req, res) {
  io.emit("message-channel", { message: req.body.message });
  res.send("New solicitation");
});

const nsp = io.of("/custom-namespace");

nsp.on("connection", socket => {
  console.log(`${socket.conn.remoteAddress} connected to custom-namespace`);
  nsp.emit("message-channel", { message: "Hello" });
});

io.on("connection", function(socket) {
  console.log(`${socket.conn.remoteAddress} connected`);
  socket.emit("message-channel", { message: "Hello" }, () => {
    console.log("Message received by client");
  });
  socket
    .on("room", function(data) {
      socket.join(data.roomId);
    })
    .on("send-message", function(data) {
      console.log(data);
      io.sockets
        .in(data.destinyRoom)
        .emit("message-channel", { message: data.message });
    });
});

server.listen(3001);
