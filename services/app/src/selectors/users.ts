import { RootState } from "../reducers";
import { User } from "../utils/users";

export const extractUser = (state: RootState, id: string): User | null => {
  const user = state.users.users[id];
  if (!user) {
    return null;
  }
  return user;
};
