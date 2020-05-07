import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectUserId = (state: RootState): string =>
	state.user.data.access.userId;

export const selectUserName = (state: RootState): string =>
	state.user.data.info?.name || "";

export const isUserLoaded = (state: RootState): boolean =>
	!!state.user.data.firebaseUser;

export const isUserLoggedIn = (state: RootState): boolean =>
	!!state.user.data.access.dbId &&
	!!state.user.data.access.secret &&
	!!state.user.data.access.userId;
