import { AxiosError } from "axios";
import { v4 } from "uuid";
//
import { createAction, AsyncAction } from ".";
import { displayError } from "./messages";
import { RoomInfo } from "../utils/rooms";
import { FirebaseRoom } from "../utils/firebase";
import { loadMedias } from "./medias";
import { MediaAccess } from "../utils/medias";
import { CombinedColor } from "../utils/colorpicker";
import history from "../utils/history";
import { setQueue } from "./queue";
import { extractErrorMessage } from "../utils/messages";

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
const setRoom = (
  room: ReturnType<typeof FirebaseRoom> | null,
  info: RoomInfo | null
) => createAction("rooms/SET", { room, room_info: info });
const setRoomAccess = (id: string, secret: string) =>
  createAction("rooms/SET_ACCESS", { id, secret });
export const setRoomColor = (color: CombinedColor) =>
  createAction("rooms/SET_COLOR", color);

// ------------------------------------------------------------------

export const createRoom = (name: string, secret: string): AsyncAction => async (
  dispatch
) => {
  try {
    const id = v4();
    console.debug("Creating room...", { id, secret });
    await FirebaseRoom(id, secret).update({ name });
    dispatch(enterRoom(id, secret));
  } catch (err) {
    dispatch(displayError(extractErrorMessage(err)));
  }
};

// ------------------------------------------------------------------

let FIREBASE_CB: any = null;

export const enterRoom = (id: string, secret: string): AsyncAction => async (
  dispatch,
  getState
) => {
  const {
    rooms: { room },
  } = getState();
  if (!room || room.id !== id) {
    dispatch(exitRoom());
    try {
      console.debug("Entering room...", { id, secret });
      const newRoom = FirebaseRoom(id, secret);
      dispatch(setRoom(newRoom, await newRoom.wait()));
      dispatch(setRoomAccess(id, secret));
      FIREBASE_CB = newRoom.subscribeInfo(
        (snapshot: firebase.database.DataSnapshot) => {
          const newInfo = snapshot.val() as RoomInfo;
          console.debug("[Firebase] Received room update...", newInfo);
          let medias: MediaAccess[] = [];
          if (newInfo.queue) {
            medias = Object.entries(newInfo.queue)
              .sort((media1, media2) => Number(media1[0]) - Number(media2[0]))
              .map((media) => media[1]);
            dispatch(
              loadMedias(
                "deezer",
                "track",
                medias.map((media) => media.id),
                false,
                false
              )
            );
          }
          dispatch(setQueue(medias, newInfo.playing, newInfo.queue_position));
          dispatch(setRoom(newRoom, newInfo));
        }
      );
      history.push(`/room/${id}?key=${secret}`); // TODO: should push only if we're not already in it
    } catch (err) {
      dispatch(displayError(extractErrorMessage(err)));
    }
  }
};

export const exitRoom = (): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: { room },
  } = getState();
  if (room) {
    console.debug("Exiting room...");
    room.unsubscribeInfo(FIREBASE_CB);
    FIREBASE_CB = null;
    dispatch(setRoom(null, null));
    dispatch(setRoomAccess("", ""));
  }
};

// ------------------------------------------------------------------

export const lockRoom = (): AsyncAction => async (dispatch, getState) => {
  const {
    rooms: {
      room,
      room_access: { id },
    },
  } = getState();
  if (room && room.id === id) {
    console.debug("Locking room...", { id });
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
      room,
      room_access: { id },
    },
  } = getState();
  if (room && room.id === id) {
    console.debug("Unlocking room...", { id, secret });
    room.setSecret(secret);
    dispatch(setRoomAccess(id, secret));
  }
};
