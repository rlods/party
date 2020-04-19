import { AsyncAction } from ".";
import { MessageType } from "../utils/messages";
import { addMessage, removeMessage } from "../reducers/messages";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

export const displayMessage = ({
	extra,
	type,
	text,
	duration = 5000
}: {
	extra?: () => React.ReactNode;
	type: MessageType;
	text: string;
	duration: number;
}): AsyncAction => (dispatch): any => {
	const id = MESSAGE_ID_GENERATOR++;
	dispatch(
		addMessage({ extra, id, stamp: new Date().getTime(), text, type })
	);
	setTimeout(() => dispatch(removeMessage(id)), duration);
};

// ------------------------------------------------------------------

export const displayError = (text: string): AsyncAction => (dispatch): any => {
	dispatch(displayMessage({ type: "error", text, duration: 3000 }));
};

export const displayInfo = (text: string) =>
	displayMessage({ type: "info", text, duration: 3000 });

export const displaySuccess = (text: string) =>
	displayMessage({ type: "success", text, duration: 3000 });

export const displayExtra = (extra: () => React.ReactNode): AsyncAction => (
	dispatch
): any => {
	dispatch(displayMessage({ type: "info", extra, text: "", duration: 5000 }));
};
