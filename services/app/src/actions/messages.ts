import { AsyncAction } from ".";
import { MessageType } from "../utils/messages";
import { addMessage, removeMessage } from "../reducers/messages";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

type MessageCreationData = {
	autoclear?: boolean;
	duration?: number;
	extra?: () => React.ReactNode;
	tag?: string;
	text?: string;
	weight?: number;
};

export const displayMessage = (
	type: MessageType,
	{
		autoclear = true,
		duration = 3000,
		extra,
		tag,
		text,
		weight = 0
	}: MessageCreationData
): AsyncAction => (dispatch): any => {
	const id = MESSAGE_ID_GENERATOR++;
	dispatch(
		addMessage({
			extra,
			id,
			stamp: new Date().getTime(),
			tag,
			text,
			type,
			weight
		})
	);
	if (autoclear) {
		setTimeout(() => dispatch(removeMessage(id)), duration);
	}
};

// ------------------------------------------------------------------

export const displayError = (text: string, tag?: string) =>
	displayMessage("error", { tag, text });

export const displayInfo = (text: string, tag?: string) =>
	displayMessage("info", { tag, text });

export const displaySuccess = (text: string) =>
	displayMessage("success", { text });
