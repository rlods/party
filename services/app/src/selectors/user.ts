import { RootState } from "../reducers";

export const extractUser = (state: RootState) => state.user.info;
