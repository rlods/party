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
): AsyncAction => (dispatch, getState) => {
	const { messages } = getState();

	const oldEntry = Object.entries(messages).find(
		([_, message]) => message.tag === tag && message.text === text
	);
	let id = 0;
	if (oldEntry) {
		const [oldID, oldMessage] = oldEntry;
		console.log("REUSING");
		id = Number(oldID); // Reuse message id and renqueue
		if (oldMessage.timer) {
			clearTimeout(oldMessage.timer);
		}
	} else {
		id = MESSAGE_ID_GENERATOR++;
	}

	dispatch(
		addMessage(
			id,
			{
				extra,
				id,
				stamp: new Date().getTime(),
				tag,
				text,
				type,
				weight
			},
			autoclear
				? setTimeout(() => dispatch(removeMessage(id)), duration)
				: void 0
		)
	);
};

// ------------------------------------------------------------------

export const displayError = (text: string, data?: MessageCreationData) =>
	displayMessage("error", {
		text,
		...data
	});

export const displayInfo = (text: string, data?: MessageCreationData) =>
	displayMessage("info", {
		text,
		...data
	});

export const displaySuccess = (text: string, data?: MessageCreationData) =>
	displayMessage("success", {
		text,
		...data
	});
