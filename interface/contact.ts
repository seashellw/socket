import { ContactMap, Session } from "../api/connect";
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
export default (id: string) => {
  const item = ContactMap.get(id);
  if (!item?.ws) return;
  send(item?.ws, {
    key: "contact",
    value: { ...item.contact, sessionList: undefined },
  });
};
