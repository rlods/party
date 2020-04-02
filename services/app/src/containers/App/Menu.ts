import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import { openModal } from "../../actions/modals";
import Menu from "../../components/App/Menu";
import { disconnectUser } from "../../actions/users";
import { extractUser } from "../../selectors/users";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  user: extractUser(state, state.users.user.id)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onCreateRoom: () => dispatch(openModal({ type: "CreateRoom", props: null })),
  onConnectUser: () =>
    dispatch(openModal({ type: "ConnectUser", props: null })),
  onDisconnectUser: () => dispatch(disconnectUser())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Menu);
