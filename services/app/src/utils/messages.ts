export type MessageType = "error" | "info";

export type Message = {
  id: number;
  stamp: number;
  text: string;
  type: MessageType;
};

export const extractErrorMessage = (err: any) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
