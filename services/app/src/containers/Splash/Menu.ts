import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import { openModal } from "../../actions/modals";
import Menu from "../../components/Splash/Menu";
import { disconnectUser } from "../../actions/users";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  loggedIn: !!state.users.user_access.id
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onCreateRoom: () => dispatch(openModal({ type: "CreateRoom", props: null })),
  onConnectUser: () => dispatch(openModal({ type: "CreateUser", props: null })),
  onDisconnectUser: () => dispatch(disconnectUser())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Menu);
