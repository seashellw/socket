import { Contact } from "../interface/contact";
import sendMessageList from "../interface/message-list";
import { getId } from "../util/util";
import { ContactMap } from "./connect";

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
export default (value: SendMessageRequest) => {
  const { from: fromId, to: toId, content } = value;
  let user = ContactMap.get(fromId);
  if (!user || !user.ws) return;
  const session = user.contact.sessionList.find((item) => item.id === toId);
  if (!session) return;
  const { messageList } = session;
  const from = ContactMap.get(fromId);
  if (!from) return;
  const message: Message = {
    id: getId(),
    content,
    from: user.contact,
    time: new Date().valueOf(),
  };
  let lastTime = messageList.at(-1)?.time || 0;
  if (lastTime >= message.time) {
    message.time = lastTime + 1;
  }
  messageList.push(message);
  Array.from(ContactMap.values()).forEach(({ contact, ws }) => {
    if (!ws) return;
    // 对于每一个在线的用户
    // 若当前会话中存在此用户
    if (session.contactList.find((item) => item.id === contact.id)) {
      sendMessageList(ws, { id: toId, list: [message] });
    }
  });
};
