import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import ConnectUserModal from "../../components/Users/ConnectUserModal";
import { connectUser } from "../../actions/user";
import { popModal, openModal } from "../../actions/modals";
import { displayError } from "../../actions/messages";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onConnect: (id: string, secret: string) => dispatch(connectUser(id, secret)),
  onError: (message: string) => dispatch(displayError(message)),
  onToggle: () => dispatch(openModal({ type: "CreateUser", props: null })),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(ConnectUserModal);
