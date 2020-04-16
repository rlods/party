import { AsyncAction } from ".";

// ------------------------------------------------------------------

export const confirmModal = (
	question: string,
	onConfirmed: () => void,
	onCanceled?: () => void
): AsyncAction => async () => {
	// TODO: open custom ConfirmModal instead of system popup
	if (window.confirm(question)) {
		onConfirmed();
		return;
	}
	if (onCanceled) {
		onCanceled();
	}
};
