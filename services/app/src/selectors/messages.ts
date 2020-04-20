import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const selectMessages = (state: RootState) =>
	Object.values(state.messages).sort((m1, m2) =>
		m1.weight !== m2.weight ? m1.weight - m2.weight : m1.stamp - m2.stamp
	);
