import { createAction, AsyncAction } from ".";

// ------------------------------------------------------------------

export type ModalPrereqT<T extends string, P> = {
	type: T;
	props: P;
};

export type ModalPrereq =
	| ModalPrereqT<
			"Confirm",
			{
				question: string;
				onCanceled?: () => void;
				onConfirmed: () => void;
			}
	  >
	| ModalPrereqT<"ConnectUser", null>
	| ModalPrereqT<"CreateRoom", null>
	| ModalPrereqT<"CreateUser", null>
	| ModalPrereqT<"JoinRoom", null>
	| ModalPrereqT<"Search", null>
	| ModalPrereqT<"UnlockRoom", null>;

// ------------------------------------------------------------------

export type ModalsAction =
	| ReturnType<typeof closeModal>
	| ReturnType<typeof openModal>
	| ReturnType<typeof popModal>
	| ReturnType<typeof pushModal>;

// ------------------------------------------------------------------

export const openModal = (prereq: ModalPrereq) =>
	createAction("modals/OPEN", prereq);

export const closeModal = () => createAction("modals/CLOSE");

// ------------------------------------------------------------------

export const pushModal = (prereq: ModalPrereq) =>
	createAction("modals/PUSH", prereq);

export const popModal = () => createAction("modals/POP");

// ------------------------------------------------------------------

export const confirmModal = (
	question: string,
	onConfirmed: () => void,
	onCanceled?: () => void
): AsyncAction => async () => {
	// TODO: open custom ConfirmModal instead of system popup
	if (window.confirm(question)) {
		onConfirmed();
	} else if (onCanceled) {
		onCanceled();
	}
};
