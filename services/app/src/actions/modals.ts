import { AsyncAction } from ".";
import { openModal } from "../reducers/modals";

// ------------------------------------------------------------------

export const confirmModal = (
	question: string,
	onConfirmed: () => void,
	onCanceled?: () => void
): AsyncAction => () => {
	// TODO: open custom ConfirmModal instead of system popup
	if (window.confirm(question)) {
		onConfirmed();
		return;
	}
	if (onCanceled) {
		onCanceled();
	}
};

// ------------------------------------------------------------------

export const unlockAndRetry = (
	onUnlocked: () => void
): AsyncAction => async dispatch => {
	dispatch(
		openModal({
			type: "UnlockRoom",
			props: {
				options: {
					onSuccess: onUnlocked
				}
			}
		})
	);
};
// ------------------------------------------------------------------

export const connectAndRetry = (
	onConnected: () => void
): AsyncAction => async dispatch => {
	dispatch(
		openModal({
			type: "CreateUser",
			props: {
				options: {
					onSuccess: onConnected
				}
			}
		})
	);
};
