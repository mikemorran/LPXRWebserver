const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for debugging
      methods: ["GET", "POST"]
    }
  });

let touchDesignerSocket = null;

io.on("connection", (socket) => {
    console.log('New socket connection:', socket.id);

    // Identify if a TouchDesigner client connects
    socket.on('registerTouchDesigner', () => {
        console.log('TouchDesigner client registered:', socket.id);
        touchDesignerSocket = socket; // Store the socket
    });

    socket.on('loadPrompt', (msg) => {
        console.log('loadPrompt:', msg);

        // Send update to TouchDesigner client
        if (touchDesignerSocket) {
            touchDesignerSocket.emit('touchdesignerPrompt', msg);
        }
    });

    socket.on('updatePrompt', (msg) => {
        console.log('updatePrompt:', msg);

        // Send update to TouchDesigner client
        if (touchDesignerSocket) {
            touchDesignerSocket.emit('touchdesignerPrompt', msg);
        }
    });

    socket.on('disconnect', () => {
        if (socket === touchDesignerSocket) {
            console.log('TouchDesigner client disconnected');
            touchDesignerSocket = null;
        }
    });
});

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

const PORT = process.env.PORT || 4040;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
