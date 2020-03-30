import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../reducers";
import { openModal } from "../actions/modals";
import Menu from "../components/Menu";
import { disconnectUser } from "../actions/users";
import { extractUser } from "../selectors/users";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  user: extractUser(state, state.users.user_id)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  createRoom: () => dispatch(openModal({ type: "CreateRoom", props: null })),
  enterRoom: () => dispatch(openModal({ type: "JoinRoom", props: null })),
  connectUser: () => dispatch(openModal({ type: "ConnectUser", props: null })),
  disconnectUser: () => dispatch(disconnectUser())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Menu);
