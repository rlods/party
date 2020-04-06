import { AxiosError } from "axios";
import { createAction } from ".";
import { Member } from "../utils/members";

// ------------------------------------------------------------------

export type MembersAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof reset>;

const fetching = () => createAction("members/FETCHING");
const success = (members: Member[]) => createAction("members/FETCHED", members);
const error = (error: AxiosError) => createAction("members/ERROR", error);
const reset = () => createAction("members/RESET");

// ------------------------------------------------------------------
