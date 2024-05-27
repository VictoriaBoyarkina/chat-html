const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");


let users = {};
const messages = [];

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001", // Allow your React app origin
    methods: ["GET", "POST"],
  }),
  cors({
    origin: "http://localhost:8080", // Allow your React app origin
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast the message to all clients
  socket.on("chat message", (msg) => {
    console.log('chat message');
    messages.push(msg);
    io.emit("chat message", msg);
  });

  // Notify about new user
  socket.on("user joined", (user) => {
    users[socket.id] = user;
    io.emit('update users', Object.values(users));
  });

  // Delete user if disconnected
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete users[socket.id];
    io.emit('update users', Object.values(users));
  });

  // Imitate get request of users
  socket.on("get messages", () => {
    io.emit("all messages", messages);
  });

});

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
