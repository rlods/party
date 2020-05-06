import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectUserId = (state: RootState): string =>
	state.user.access.userId;

export const selectUserName = (state: RootState): string =>
	state.user.info?.name || "";

export const isUserLoaded = (state: RootState): boolean => !!state.user._fbUser;
