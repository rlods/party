import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectUserId = (state: RootState): string =>
	state.user.access.userId;

export const selectUserName = (state: RootState): string =>
	state.user.data.info?.name || "";

export const isUserLoaded = (state: RootState): boolean =>
	!!state.user.data.firebaseUser;

export const isUserLoggedIn = (state: RootState): boolean =>
	!!state.user.access.dbId &&
	!!state.user.access.secret &&
	!!state.user.access.userId;
