import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
//
import { createAction } from ".";
import { RootState } from "../reducers";
import { Containers } from "../utils/containers";

// ------------------------------------------------------------------

export type ContainersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>
  | ReturnType<typeof setContainers>;

type Dispatch = ThunkDispatch<RootState, any, ContainersAction>;

const fetching = () => createAction("containers/FETCHING");
const success = () => createAction("containers/FETCHED");
const error = (error: AxiosError) => createAction("containers/ERROR", error);
const reset = () => createAction("containers/RESET");
const setContainers = (containers: Containers) =>
  createAction("containers/SET_CONTAINERS", containers);
