import { WebSocket } from "ws";
import sendMessageList from "../interface/message-list";
import { ContactMap } from "./connect";
import { Message } from "./send-message";

export interface MessageListRequest {
  id: string;
  /**
   * 查询自end时间之前的消息（不包括end）
   */
  end: string;
}

/**
 * 二分查找消息
 */
export const messageListBinarySearch = (time: number, list: Message[]) => {
  let start = 0;
  let end = list.length - 1;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (list[mid].time === time) {
      return mid;
    } else if (list[mid].time < time) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return start;
};

/**
 * 获取消息列表
 */
export default (userId: string, value: MessageListRequest) => {
  const { id: sessionId, end } = value;
  let user = ContactMap.get(userId);
  if (!user || !user.ws) return;
  const session = user.contact.sessionList.find(
    (item) => item.id === sessionId
  );
  if (!session) return;
  const { messageList } = session;
  let index = messageListBinarySearch(parseInt(end), messageList);
  let startIndex = index - 20;
  if (startIndex < 0) startIndex = 0;
  let list = messageList.slice(startIndex, index);
  sendMessageList(user.ws, { id: sessionId, list });
};
