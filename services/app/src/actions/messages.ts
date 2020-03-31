import { createAction, AsyncAction } from ".";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

export const extractErrorMessage = (err: any) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

export type Message = {
  id: number;
  text: string;
  type: string;
};

export type MessagesAction =
  | ReturnType<typeof addMessage>
  | ReturnType<typeof clearMessages>
  | ReturnType<typeof removeMessage>;

const addMessage = (message: Message) => createAction("message/ADD", message);

const removeMessage = (id: number) => createAction("message/REMOVE", id);

const clearMessages = () => createAction("message/RESET");

export const displayMessage = (
  type: string,
  text: string,
  duration: number = 5000
): AsyncAction => (dispatch): any => {
  const id = MESSAGE_ID_GENERATOR++;
  dispatch(addMessage({ id, text, type }));
  setTimeout(() => dispatch(removeMessage(id)), duration);
};

export const displayError = (text: string, error?: any): AsyncAction => (
  dispatch
): any => {
  dispatch(
    displayMessage(
      "error",
      error ? `${text}: ${extractErrorMessage(error)}` : text,
      3000
    )
  );
};

export const displayInfo = (text: string) => displayMessage("info", text, 3000);
