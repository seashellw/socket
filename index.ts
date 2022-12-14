import { readFileSync } from "fs";
import { createServer } from "https";
import { WebSocketServer } from "ws";
import close from "./api/close";
import connect from "./api/connect";
import messageList from "./api/message-list";
import sendMessage from "./api/send-message";
import { WsMessage } from "./util/util";

const CERT_FILE = process.env.CERT_FILE;
const KEY_FILE = process.env.KEY_FILE;
const PORT = 9003;

let wsServer: WebSocketServer;

if (CERT_FILE && KEY_FILE) {
  const cert = readFileSync(CERT_FILE);
  const key = readFileSync(KEY_FILE);
  const server = createServer({ cert, key });
  wsServer = new WebSocketServer({ server });
  server.listen(PORT);
} else {
  wsServer = new WebSocketServer({ port: PORT });
}

wsServer.on("connection", (ws) => {
  let userId: string | undefined = undefined;
  ws.on("message", (data) => {
    if (!data.toString().startsWith("{")) return;
    try {
      let msg: WsMessage = JSON.parse(data.toString());
      switch (msg.key) {
        case "connect":
          userId = msg.value.userId;
          connect(ws, msg.value);
          break;
        case "message-list":
          if (!userId) break;
          messageList(userId, msg.value);
          break;
        case "send-message":
          if (!userId) break;
          sendMessage(msg.value);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  });
  ws.on("close", () => {
    close(userId);
  });
});
