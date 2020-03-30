import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction } from ".";
import { RootState } from "../reducers";
import { Tracks } from "../utils/tracks";

// ------------------------------------------------------------------

export type TracksAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setTracks>;

type Dispatch = ThunkDispatch<RootState, any, TracksAction>;

const fetching = () => createAction("tracks/FETCHING");
const success = () => createAction("tracks/FETCHED");
const error = (error: AxiosError) => createAction("tracks/ERROR", error);
const reset = () => createAction("tracks/RESET");
const setTracks = (tracks: Tracks) => createAction("tracks/SET_TRACKS", tracks);
