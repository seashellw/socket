import { WebSocket } from "ws";
import { Message } from "../api/send-message";
import { send } from "../util/util";

export interface MessageListResponse {
  id: string;
  list: Message[];
}

/**
 * 消息列表
 */
export default (ws: WebSocket, value: MessageListResponse) => {
  send(ws, {
    key: "message-list",
    value: {
      id: value.id,
      list: value.list.map((item) => ({
        ...item,
        from: {
          ...item.from,
          sessionList: undefined,
        },
        time: item.time.toString(),
      })),
    },
  });
};
