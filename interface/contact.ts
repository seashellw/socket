import { WebSocket } from "ws";
import { Session, ContactMap } from "../api/connect";
import { send } from "../util/util";

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  sessionList: Session[];
}

/**
 * 当前用户的信息
 */
export default (ws: WebSocket, id: string) => {
  const item = ContactMap.get(id);
  send(ws, { key: "contact", value: { ...item, sessionList: undefined } });
};
