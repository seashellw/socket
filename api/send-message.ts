import { WebSocket } from "ws";
import { Contact } from "../interface/contact";
import sendMessageList from "../interface/message-list";
import { getId } from "../util/util";
import { ConnectMap, ContactMap, SessionMap } from "./connect";

export interface Message {
  id: string;
  from: Contact;
  time: number;
  content: string;
}

export interface SendMessageRequest {
  from: string;
  to: string;
  content: string;
}

/**
 * 发送消息
 */
export default (ws: WebSocket, value: SendMessageRequest) => {
  const { from: fromId, to: toId, content } = value;
  const session = SessionMap.get(toId);
  if (!session) return;
  const { messageList } = session;
  const from = ContactMap.get(fromId);
  if (!from) return;
  const message: Message = {
    id: getId(),
    content,
    from,
    time: new Date().valueOf(),
  };
  let lastTime = messageList.at(-1)?.time || 0;
  if (lastTime >= message.time) {
    message.time = lastTime + 1;
  }
  messageList.push(message);
  Array.from(ConnectMap.values()).forEach((connect) => {
    // 对于每一个在线的用户
    // 若当前会话中存在此用户
    if (session.contactList.find((contact) => connect.user.id === contact.id)) {
      sendMessageList(connect.ws, { id: toId, list: [message] });
    }
  });
};
