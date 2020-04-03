import { RootState } from "../reducers";

export const extractUser = (state: RootState) => state.users.user_info;
