
require('dotenv').config();
const app= require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/service/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });




const chatHistory=[
  {
    role: "user",
    parts:[{text:"Hello!"}]
  },
  {
    role:"model",
     parts: [
        {
          text: "Hello! How can I assist you today?",
        },
      ],
  }
];

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

socket.on("message", async (data) => {
  try {
    
    console.log("AI message received:", data);

    if (!data) {
      return socket.emit("ai-message-response", { response: "❌ No prompt provided" });
    }
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });

    const response = await generateResponse(chatHistory);
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