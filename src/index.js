const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

// App setup
const PORT = 5000;
const app = express();

app.use(cors());
app.options("*", cors());

let users = [];

let messages = [
  {
    nickname: "lucasnck",
    message: "Hello world",
    hasNickname: true,
    uuid: "1ce0a11e-d9d7-469d-8ebc-e17eccab75fa",
    mousePos: { x: 624, y: 590 },
  },
];

let usersPos = [];

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = new Server(server, { cors: { origin: "*" } });

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let allClients = [];

io.on("connection", function (socket) {
  const uuid = uuidv4();
  allClients.push(socket);
  socket.emit("connection", {
    uuid,
  });
  socket.on("disconnect", function (reason) {
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });

  socket.on("signIn", function (data) {
    users.push(data);
    io.emit("signIn", data);
    io.emit("messages", messages);
    io.emit("usersPos", usersPos);
  });

  socket.on("usersPos", function (data) {
    usersPos.push(data);
    io.emit("usersPos", usersPos);
  });

  socket.on("send-message", function (data) {
    messages.push({ ...data, uuid: "" });
    io.emit("messages", messages);
  });
});
