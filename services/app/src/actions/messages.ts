import { AsyncAction } from ".";
import { MessageType } from "../utils/messages";
import { addMessage, removeMessage } from "../reducers/messages";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

type MessageCreationData = {
	duration: number;
	extra?: () => React.ReactNode;
	text?: string;
	weight?: number;
};

export const displayMessage = (
	type: MessageType,
	{ duration = 5000, extra, text, weight = 0 }: MessageCreationData
): AsyncAction => (dispatch): any => {
	const id = MESSAGE_ID_GENERATOR++;
	dispatch(
		addMessage({
			extra,
			id,
			stamp: new Date().getTime(),
			text,
			type,
			weight
		})
	);
	setTimeout(() => dispatch(removeMessage(id)), duration);
};

// ------------------------------------------------------------------

export const displayError = (text: string, duration = 3000) =>
	displayMessage("error", { duration, text });

export const displayInfo = (text: string, duration = 3000) =>
	displayMessage("info", { duration, text });

export const displaySuccess = (text: string, duration = 3000) =>
	displayMessage("success", { duration, text });
