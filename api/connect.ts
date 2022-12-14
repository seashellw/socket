import { WebSocket } from "ws";
import sendContact, { Contact } from "../interface/contact";
import sendSession from "../interface/session";
import { getId } from "../util/util";
import { Message } from "./send-message";

export interface ConnectValue {
  userId: string;
}

/**
 * 所有联系人
 */
export const ContactMap = new Map<
  string,
  {
    ws?: WebSocket;
    contact: Contact;
  }
>([
  [
    "张三",
    {
      contact: {
        id: "张三",
        name: "张三",
        avatar: "",
        sessionList: [],
      },
    },
  ],
]);

export interface Session {
  id: string;
  contactList: Contact[];
  messageList: Message[];
}

/**
 * 连接建立
 */
export default (ws: WebSocket, value: ConnectValue) => {
  const { userId } = value;
  if (!ContactMap.has(userId)) {
    let user: Contact = {
      id: userId,
      name: userId,
      avatar: ``,
      sessionList: [],
    };
    Array.from(ContactMap.values()).forEach(({ contact, ws }) => {
      const session: Session = {
        id: getId(),
        contactList: [user, contact],
        messageList: [],
      };
      user.sessionList.push(session);
      contact.sessionList.push(session);
      if (!ws || !contact.id) return;
      sendSession(contact.id, session);
    });
    ContactMap.set(userId, { contact: user, ws });
  }
  let user = ContactMap.get(userId);
  if (!user?.contact.id) return;
  user.ws = ws;
  sendContact(user.contact.id);
  let id = user.contact.id;
  user.contact.sessionList.forEach((session) => {
    sendSession(id, session);
  });
};
