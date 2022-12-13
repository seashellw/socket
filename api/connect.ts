import { WebSocket } from "ws";
import contact, { Contact } from "../interface/contact";
import sendSession from "../interface/session";
import { getId } from "../util/util";
import { Message } from "./send-message";

export interface ConnectValue {
  userId: string;
}

export const ConnectMap = new Map<
  WebSocket,
  {
    user: Contact;
    ws: WebSocket;
  }
>();

/**
 * 所有联系人
 */
export const ContactMap = new Map<string, Contact>();

export interface Session {
  id: string;
  contactList: Contact[];
  messageList: Message[];
}

/**
 * 所有会话
 */
export const SessionMap = new Map<string, Session>();

/**
 * 连接建立
 */
export default (ws: WebSocket, value: ConnectValue) => {
  const { userId } = value;
  if (!ContactMap.has(userId)) {
    let user: Contact = {
      id: userId,
      name: userId,
      avatar: `https://i.pravatar.cc/150?u=${userId}`,
      sessionList: [],
    };
    Array.from(ContactMap.values()).forEach((contact) => {
      const session: Session = {
        id: getId(),
        contactList: [user, contact],
        messageList: [],
      };
      user.sessionList.push(session);
      contact.sessionList.push(session);
      SessionMap.set(session.id, session);
      Array.from(ConnectMap.values()).forEach((connect) => {
        if (connect.user.id === contact.id) {
          sendSession(connect.ws, session);
        }
      });
    });
    ContactMap.set(userId, user);
  }
  let user = ContactMap.get(userId);
  if (!user) return;
  ConnectMap.set(ws, { user, ws });
  contact(ws, user.id);
  user.sessionList.forEach((session) => {
    sendSession(ws, session);
  });
};
