import { Reducer } from "redux";
import { createAction } from "../actions";
import { ConnectUserModalProps } from "../modals/ConnectUserModal";
import { CreateRoomModalProps } from "../modals/CreateRoomModal";
import { CreateUserModalProps } from "../modals/CreateUserModal";
import { ConfirmModalProps } from "../modals/ConfirmModal";
import { UnlockRoomModalProps } from "../modals/UnlockRoomModal";
import { GameOverModalProps } from "../modals/GameOverModal";
import { SeaBattleHelpModalProps } from "../modals/SeaBattleHelpModal";

// ------------------------------------------------------------------

export type ModalPrereqT<T extends string, P> = {
	type: T;
	props: P;
};

export type ModalPrereq =
	| ModalPrereqT<"General/Confirm", ConfirmModalProps>
	| ModalPrereqT<"General/Help", null>
	| ModalPrereqT<"Room/Create", CreateRoomModalProps>
	| ModalPrereqT<"Room/Join", null>
	| ModalPrereqT<"Room/Search", null>
	| ModalPrereqT<"Room/Unlock", UnlockRoomModalProps>
	| ModalPrereqT<"SeaBattle/GameOver", GameOverModalProps>
	| ModalPrereqT<"SeaBattle/Help", SeaBattleHelpModalProps>
	| ModalPrereqT<"User/Connect", ConnectUserModalProps>
	| ModalPrereqT<"User/Create", CreateUserModalProps>;

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

type Filter<T, U> = T extends U ? T : never;

export type ModalType = PropType<ModalPrereq, "type">;

export type ModalProps<TYPE> = Filter<ModalPrereq, { type: TYPE }>["props"];

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
