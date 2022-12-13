import { nanoid } from "nanoid";
import { WebSocket } from "ws";
export interface WsMessage {
  key: string;
  value: any;
}
export const send = (ws: WebSocket, value: WsMessage) => {
  ws.send(JSON.stringify(value));
};
export const getId = () => nanoid(64);
