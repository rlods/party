import { RootState } from "../reducers";

// ------------------------------------------------------------------

export const extractMessages = (state: RootState) =>
  state.messages.sort((m1, m2) => m1.stamp - m2.stamp);
