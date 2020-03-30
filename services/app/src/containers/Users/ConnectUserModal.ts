import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import ConnectUserModal from "../../components/Users/ConnectUserModal";
import { createUser } from "../../actions/users";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onCreate: (name: string, secret: string) => dispatch(createUser(name, secret))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(ConnectUserModal);
