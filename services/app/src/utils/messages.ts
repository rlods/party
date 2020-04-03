export type MessageType = "error" | "info";

export type Message = {
  id: number;
  text: string;
  type: MessageType;
};
