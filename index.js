const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let touchDesignerSocket = null;

wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error("Invalid JSON:", message);
            return;
        }

        console.log("Received message:", data);

        if (data.type === "registerTouchDesigner") {
            console.log("TouchDesigner client registered");
            touchDesignerSocket = ws;
        } else if (data.type === "loadPrompt" || data.type === "updatePrompt") {
            if (touchDesignerSocket) {
                touchDesignerSocket.send(JSON.stringify({ type: "touchdesignerPrompt", data: data.data }));
            }
        }
    });

    ws.on("close", () => {
        if (ws === touchDesignerSocket) {
            console.log("TouchDesigner client disconnected");
            touchDesignerSocket = null;
        }
    });
});

app.get("/", (req, res) => {
    res.send("WebSocket Server is running!");
});

const PORT = process.env.PORT || 4040;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
