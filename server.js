
require('dotenv').config();
const app= require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/service/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
  console.log('a user connected');
  socket.on('ai-message', (data) => {
        console.log('Message received:', data);
        io.emit('ai-message', data); // Broadcast to all connected clients
    });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

socket.on("ai-message", async (data) => {
  try {
    // If frontend sends JSON string, parse it
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    const prompt = parsed.prompt;

    console.log("AI message received:", prompt);

    if (!prompt) {
      return socket.emit("ai-message-response", { response: "❌ No prompt provided" });
    }

    const response = await generateResponse(prompt);
    socket.emit("ai-message-response", { response });

  } catch (err) {
    console.error("❌ Error handling ai-message:", err);
    socket.emit("ai-message-response", { response: "Server error" });
  }
});

});



httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});