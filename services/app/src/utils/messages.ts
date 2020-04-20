export type MessageType = "error" | "info" | "success";

export type Message = {
	extra?: () => React.ReactNode;
	id: number;
	stamp: number;
	tag?: string;
	text?: string;
	timer?: NodeJS.Timeout;
	type: MessageType;
	weight: number;
};

export const extractErrorMessage = (err: any) =>
	err.response && err.response.data && err.response.data.message
		? err.response.data.message
		: err.message;
