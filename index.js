const express = require("express");
const http = require("http");
const cors = require("cors");
require("./src/config/db");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = 6969;
const io = new Server(server, {
  cors: {
    origin: "https://my-cbt.netlify.app",
    methods: ["GET", "POST"],
  },
  path: "/proyek1/socket.io",
});

app.use(cors());
app.use(express.json());

const todoRoutes = require("./src/routes/todoroute");
// // app.use("/api/todos", todoRoutes);
app.use("/api", todoRoutes);

server.listen(port,'0.0.0.0',() => {
  console.log(`✅ Server running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("🚀 New socket connected:", socket.id);

  socket.on("join", (name) => {
    console.log("👋 User joined:", name);
    socket.username = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("chat-message", (msg) => {
    console.log("💬 Received chat message:", msg);
    io.emit("chat-message", msg);
  });

  socket.on("leave", (name) => {
    console.log("🏃‍♂️ User left:", name);
    socket.broadcast.emit("user-left", name);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected socket:", socket.id, "username:", socket.username);
    if (socket.username) {
      socket.broadcast.emit("user-left", socket.username);
    }
  });
});


  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);
  });

  socket.on("leave", (name) => {
    socket.broadcast.emit("user-left", name);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      socket.broadcast.emit("user-left", socket.username);
    }
  });
});
