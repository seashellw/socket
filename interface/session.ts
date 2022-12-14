import { ContactMap, Session } from "../api/connect";
import { send } from "../util/util";

/**
 * 会话列表
 */
export default (id: string, session: Session) => {
  let name: string = "";
  let avatar: string = "";
  let res = ContactMap.get(id);
  if (!res || !res.contact || !res.ws) return;
  const contact = res.contact;
  const ws = res.ws;
  if (session.contactList.length === 2) {
    const c = session.contactList.find((item) => item !== contact);
    name = c?.name || "";
    avatar = c?.avatar || "";
  }
  let value = {
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
  send(ws, { key: "session", value });
};
