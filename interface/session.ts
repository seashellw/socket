import { WebSocket } from "ws";
import { ConnectMap, Session } from "../api/connect";
import { send } from "../util/util";

/**
 * 会话列表
 */
export default (ws: WebSocket, session: Session) => {
  let name: string = "";
  let avatar: string = "";
  const contact = ConnectMap.get(ws)?.user;
  if (session.contactList.length === 2) {
    const c = session.contactList.find((item) => item !== contact);
    name = c?.name || "";
    avatar = c?.avatar || "";
  }
  let res = {
    ...session,
    name,
    avatar,
    messageList: [],
    contactList: session.contactList.map((contact) => {
      return {
        ...contact,
        sessionList: undefined,
      };
    }),
  };
  send(ws, { key: "session", value: res });
};
