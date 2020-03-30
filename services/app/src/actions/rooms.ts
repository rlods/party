import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { RootState } from "../reducers";
import { Rooms } from "../utils/rooms";
import { Room as FirebaseRoom } from "../utils/firebase";
import history from "../utils/history";

// ------------------------------------------------------------------

export type RoomsAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setRoom>
  | ReturnType<typeof setRooms>;

type Dispatch = ThunkDispatch<RootState, any, RoomsAction>;

const fetching = () => createAction("rooms/FETCHING");
const success = () => createAction("rooms/FETCHED");
const error = (error: AxiosError) => createAction("rooms/ERROR", error);
const reset = () => createAction("rooms/RESET");
const setRoom = (id: string) => createAction("rooms/SET_ROOM", id);
const setRooms = (rooms: Rooms) => createAction("rooms/SET_ROOMS", rooms);

// ------------------------------------------------------------------

export const createRoom = (
  name: string,
  secret: string
): AsyncAction => async dispatch => {
  try {
    const id = v4();
    const room = FirebaseRoom(id, secret);
    await room.init({ name });
    dispatch(setRoom(id));
    dispatch(setRooms({ [id]: room.getInfo() }));
    history.push(`/party/${id}`);
  } catch (err) {
    dispatch(displayError("Cannot create room", err));
  }
};

export const joinRoom = (id: string): AsyncAction => async dispatch => {
  try {
    const room = await FirebaseRoom(id).wait();
    dispatch(setRoom(id));
    dispatch(setRooms({ [id]: room }));
    history.push(`/party/${id}`);
  } catch (err) {
    dispatch(displayError("Cannot join room", err));
  }
};
