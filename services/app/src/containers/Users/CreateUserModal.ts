import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import CreateUserModal from "../../components/Users/CreateUserModal";
import { createUser } from "../../actions/user";
import { popModal, openModal } from "../../actions/modals";
import { displayError } from "../../actions/messages";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onCreate: (name: string, secret: string) =>
    dispatch(createUser(name, secret)),
  onError: (message: string) => dispatch(displayError(message)),
  onToggle: () => dispatch(openModal({ type: "ConnectUser", props: null })),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(CreateUserModal);
