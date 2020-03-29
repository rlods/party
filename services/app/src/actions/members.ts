import { AxiosError } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from ".";
import { RootState } from "../reducers";
import { Member } from "../utils/members";

export type MembersAction =
  | ReturnType<typeof fetching>
  | ReturnType<typeof success>
  | ReturnType<typeof error>
  | ReturnType<typeof reset>;

type Dispatch = ThunkDispatch<RootState, any, MembersAction>;

const fetching = () => createAction("members/FETCHING");
const success = (members: Member[]) => createAction("members/FETCHED", members);
const error = (error: AxiosError) => createAction("members/ERROR", error);
const reset = () => createAction("members/RESET");
