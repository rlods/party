import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { RootState } from "../reducers";
import { Rooms, Room } from "../utils/rooms";
import { Room as FirebaseRoom } from "../utils/firebase";
import history from "../utils/history";
import { loadTrack } from "./tracks";
import { loadContainer } from "./containers";

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
    console.log("Creating room...");
    const id = v4();
    await FirebaseRoom(id, secret).init({ name });
    dispatch(enterRoom(id));
  } catch (err) {
    dispatch(displayError("Cannot create room", err));
  }
};

// ------------------------------------------------------------------

let FIREBASE_ROOM: ReturnType<typeof FirebaseRoom> | null = null;
let FIREBASE_CB: any = null;

export const enterRoom = (id: string): AsyncAction => async dispatch => {
  if (!FIREBASE_ROOM || FIREBASE_ROOM.id !== id) {
    dispatch(exitRoom());
    try {
      console.log("Entering room...", { id });
      const room = FirebaseRoom(id);
      dispatch(setRooms({ [id]: await room.wait() }));
      dispatch(setRoom(id));
      FIREBASE_CB = (snapshot: firebase.database.DataSnapshot) => {
        dispatch(setRooms({ [id]: snapshot.val() as Room }));
      };
      FIREBASE_ROOM = room;
      FIREBASE_ROOM.subscribeInfo(FIREBASE_CB);
      history.push(`/room/${id}`);
    } catch (err) {
      dispatch(displayError("Cannot join room", err));
    }
  }
};

export const exitRoom = (): AsyncAction => async dispatch => {
  if (FIREBASE_ROOM) {
    console.log("Exiting room...");
    FIREBASE_ROOM.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_ROOM = null;
    FIREBASE_CB = null;
    dispatch(setRoom(""));
  }
};

export const playInRoom = (
  containerType: string,
  containerId: string,
  trackId: string
): AsyncAction => async dispatch => {
  console.log("TODO: PLAY IN ROOM", { containerType, containerId, trackId });
  dispatch(loadContainer(containerType, containerId, false, false));
  dispatch(loadTrack(trackId, false, true));
};
