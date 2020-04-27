import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectUserName = (state: RootState): string =>
	state.user.info?.name || "";

export const isUserLoaded = (state: RootState): boolean => !!state.user._fbUser;
