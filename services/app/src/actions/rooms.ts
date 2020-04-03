import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { Room } from "../utils/rooms";
import {
  Room as FirebaseRoom,
  getCurrentRoom,
  setCurrentRoom
} from "../utils/firebase";
import { loadTracks } from "./tracks";
import { loadContainer } from "./containers";
import { ContainerType } from "../utils/containers";
import { CombinedColor } from "../utils/colorpicker";
import history from "../utils/history";
import { setQueue } from "./queue";

// ------------------------------------------------------------------

export type RoomsAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setRoom>
  | ReturnType<typeof setRoomAccess>
  | ReturnType<typeof setRoomColor>;

const fetching = () => createAction("rooms/FETCHING");
const success = () => createAction("rooms/FETCHED");
const error = (error: AxiosError) => createAction("rooms/ERROR", error);
const reset = () => createAction("rooms/RESET");
const setRoom = (room: Room | null) => createAction("rooms/SET_ROOM", room);
const setRoomAccess = (id: string, secret: string) =>
  createAction("rooms/SET_ROOM_ACCESS", { id, secret });
export const setRoomColor = (color: CombinedColor) =>
  createAction("rooms/SET_ROOM_COLOR", color);

// ------------------------------------------------------------------

export const createRoom = (
  name: string,
  secret: string
): AsyncAction => async dispatch => {
  try {
    const id = v4();
    console.log("Creating room...", { id, secret });
    await FirebaseRoom(id, secret).init({ name });
    dispatch(enterRoom(id, secret));
  } catch (err) {
    dispatch(displayError("Cannot create room", err));
  }
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const enterRoom = (
  id: string,
  secret: string
): AsyncAction => async dispatch => {
  let room = getCurrentRoom();
  if (!room || room.id !== id) {
    dispatch(exitRoom());
    try {
      console.log("Entering room...", { id, secret });
      room = FirebaseRoom(id, secret);
      dispatch(setRoom(await room.wait()));
      dispatch(setRoomAccess(id, secret));
      FIREBASE_CB = (snapshot: firebase.database.DataSnapshot) => {
        const newRoom = snapshot.val() as Room;
        let trackIds: string[] = [];
        if (newRoom.queue) {
          trackIds = Object.entries(newRoom.queue)
            .sort((track1, track2) => Number(track1[0]) - Number(track2[0]))
            .map(track => track[1].id);
          dispatch(loadTracks(trackIds, false, false));
        }
        dispatch(setQueue(trackIds));
        dispatch(setRoom(newRoom));
      };
      setCurrentRoom(room);
      room.subscribeInfo(FIREBASE_CB);
      history.push(`/room/${id}?key=${secret}`); // TODO: should push only if we're not already in it
    } catch (err) {
      dispatch(displayError("Cannot join room", err));
    }
  }
};

export const exitRoom = (): AsyncAction => async dispatch => {
  const room = getCurrentRoom();
  if (room) {
    console.log("Exiting room...");
    room.unsubscribeInfo(FIREBASE_CB);
    setCurrentRoom(null);
    FIREBASE_CB = null;
    dispatch(setRoomAccess("", ""));
  }
};

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: {
      room_access: { id }
    }
  } = getState();
  const room = getCurrentRoom();
  if (room && room.id === id) {
    console.log("Locking room...", { id });
    room.setSecret("");
    dispatch(setRoomAccess(id, ""));
  }
};

export const unlockRoom = (secret: string): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    rooms: {
      room_access: { id }
    }
  } = getState();
  const room = getCurrentRoom();
  if (room && room.id === id) {
    console.log("Unlocking room...", { id, secret });
    room.setSecret(secret);
    dispatch(setRoomAccess(id, secret));
  }
};

// ------------------------------------------------------------------

export const queueTracks = (
  containerType: ContainerType,
  containerId: string,
  trackId: string
): AsyncAction => async dispatch => {
  console.log("Queuing room tracks...", {
    containerType,
    containerId,
    trackId
  });
  if (containerId) {
    dispatch(loadContainer(containerType, containerId, true, false));
  }
  if (trackId) {
    dispatch(loadTracks([trackId], true, false));
  }
};
