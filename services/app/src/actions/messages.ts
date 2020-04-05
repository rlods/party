import { createAction, AsyncAction } from ".";
import { Message, MessageType } from "../utils/messages";

// ------------------------------------------------------------------

export type MessagesAction =
  | ReturnType<typeof addMessage>
  | ReturnType<typeof clearMessages>
  | ReturnType<typeof removeMessage>;

const addMessage = (message: Message) => createAction("message/ADD", message);

const removeMessage = (id: number) => createAction("message/REMOVE", id);

const clearMessages = () => createAction("message/RESET");

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

export const displayMessage = (
  type: MessageType,
  text: string,
  duration: number = 5000
): AsyncAction => (dispatch): any => {
  const id = MESSAGE_ID_GENERATOR++;
  dispatch(addMessage({ id, stamp: new Date().getTime(), text, type }));
  setTimeout(() => dispatch(removeMessage(id)), duration);
};

export const displayError = (text: string): AsyncAction => (dispatch): any => {
  dispatch(displayMessage("error", text, 3000));
};

export const displayInfo = (text: string) => displayMessage("info", text, 3000);
