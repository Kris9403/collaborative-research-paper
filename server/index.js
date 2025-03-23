import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import docxRoutes from "./routes/docx.js";  // Import DOCX route

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Use the DOCX processing route
app.use("/docx", docxRoutes);

app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend is Running!");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
