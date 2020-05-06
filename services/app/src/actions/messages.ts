import { AsyncAction } from ".";
import { MessageType } from "../utils/messages";
import { addMessage, removeMessages } from "../reducers/messages";

// ------------------------------------------------------------------

let MESSAGE_ID_GENERATOR: number = 0;

export type MessageOptions = {
	autoclear?: boolean;
	closable?: boolean;
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
		closable = true,
		duration = 3000,
		extra,
		tag,
		text,
		weight = 0
	}: MessageOptions
): AsyncAction => (dispatch, getState) => {
	const { messages } = getState();

	const oldEntry = Object.entries(messages).find(
		([_, message]) => message.tag === tag && message.text === text
	);
	let id = 0;
	if (oldEntry) {
		const [oldID, oldMessage] = oldEntry;
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
				closable,
				extra,
				id,
				stamp: new Date().getTime(),
				tag,
				text,
				type,
				weight
			},
			autoclear
				? setTimeout(() => dispatch(removeMessages([id])), duration)
				: void 0
		)
	);
};

// ------------------------------------------------------------------

export const displayError = (text: string, options?: MessageOptions) =>
	displayMessage("error", {
		text,
		...options
	});

export const displayInfo = (text: string, options?: MessageOptions) =>
	displayMessage("info", {
		text,
		...options
	});

export const displaySuccess = (text: string, options?: MessageOptions) =>
	displayMessage("success", {
		text,
		...options
	});
