import { AsyncAction } from ".";
import { MessageType } from "../utils/messages";
import { addMessage, removeMessage } from "../reducers/messages";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

type MessageCreationData = {
	autoclear?: boolean;
	duration?: number;
	extra?: () => React.ReactNode;
	text?: string;
	weight?: number;
};

export const displayMessage = (
	type: MessageType,
	{
		autoclear = true,
		duration = 3000,
		extra,
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
			text,
			type,
			weight
		})
	);
	if (autoclear) {
		console.log("TOTO");
		setTimeout(() => dispatch(removeMessage(id)), duration);
	}
};

// ------------------------------------------------------------------

export const displayError = (text: string) => displayMessage("error", { text });

export const displayInfo = (text: string) => displayMessage("info", { text });

export const displaySuccess = (text: string) =>
	displayMessage("success", { text });
