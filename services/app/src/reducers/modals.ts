import { Reducer } from "redux";
import { createAction } from "../actions";

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
	| ModalPrereqT<"Help", null>
	| ModalPrereqT<"JoinRoom", null>
	| ModalPrereqT<"Search", null>
	| ModalPrereqT<"UnlockRoom", null>;

// ------------------------------------------------------------------

type ModalsAction =
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

export type ModalsState = {
	stack: ModalPrereq[];
};

// ------------------------------------------------------------------

export const initialState: ModalsState = {
	stack: []
};

// ------------------------------------------------------------------

export const modalsReducer: Reducer<ModalsState, ModalsAction> = (
	state = initialState,
	action
): ModalsState => {
	switch (action.type) {
		case "modals/OPEN":
			return {
				...state,
				stack: [action.payload]
			};
		case "modals/CLOSE":
			return {
				...state,
				stack: []
			};
		case "modals/PUSH":
			return {
				...state,
				stack: [...state.stack, action.payload]
			};
		case "modals/POP":
			const copy = [...state.stack];
			copy.pop();
			return {
				...state,
				stack: copy
			};
		default:
			return state;
	}
};
