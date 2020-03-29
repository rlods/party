import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from ".";
import { RootState } from "../reducers";
import { Rooms } from "../utils/rooms";

export type RoomsAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>;

type Dispatch = ThunkDispatch<RootState, any, RoomsAction>;

const fetching = () => createAction("rooms/FETCHING");
const success = (rooms: Rooms) => createAction("rooms/FETCHED", rooms);
const error = (error: AxiosError) => createAction("rooms/ERROR", error);
const reset = () => createAction("rooms/RESET");
