import { ReactNode } from "react";
import { Reducer } from "redux";
//
import { createAction } from "../actions";

// ------------------------------------------------------------------

type ModalsAction =
	| ReturnType<typeof closeModal>
	| ReturnType<typeof openModal>
	| ReturnType<typeof popModal>
	| ReturnType<typeof pushModal>;

// ------------------------------------------------------------------

export const openModal = (render: () => ReactNode) =>
	createAction("modals/OPEN", render);

export const closeModal = () => createAction("modals/CLOSE");

// ------------------------------------------------------------------

export const pushModal = (render: () => ReactNode) =>
	createAction("modals/PUSH", render);

export const popModal = () => createAction("modals/POP");

// ------------------------------------------------------------------

export type ModalsState = Readonly<{
	renderers: ReadonlyArray<() => ReactNode>;
}>;

// ------------------------------------------------------------------

export const INITIAL_STATE: ModalsState = {
	renderers: []
};

// ------------------------------------------------------------------

export const modalsReducer: Reducer<ModalsState, ModalsAction> = (
	state = INITIAL_STATE,
	action
): ModalsState => {
	switch (action.type) {
		case "modals/OPEN":
			return {
				...state,
				renderers: [action.payload]
			};
		case "modals/CLOSE":
			return {
				...state,
				renderers: []
			};
		case "modals/PUSH":
			return {
				...state,
				renderers: [...state.renderers, action.payload]
			};
		case "modals/POP":
			const copy = [...state.renderers];
			copy.pop();
			return {
				...state,
				renderers: copy
			};
		default:
			return state;
	}
};
