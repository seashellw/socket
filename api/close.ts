import { WebSocket } from "ws";
import { ConnectMap } from "./connect";

/**
 * 连接释放
 */
export default (ws: WebSocket) => {
  console.log(ConnectMap.get(ws)?.user.id, "close");
  console.log(ConnectMap.size);
  ConnectMap.delete(ws);
};
