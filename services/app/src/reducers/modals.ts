import { Reducer } from "redux";
import { ModalsAction, ModalPrereq } from "../actions/modals";

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
