import { ContactMap } from "./connect";

/**
 * 连接释放
 */
export default (id: string | undefined) => {
  if (!id) return;
  let item = ContactMap.get(id);
  if (!item) return;
  item.ws = undefined;
};
