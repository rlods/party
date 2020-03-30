import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import CreatePartyModal from "../../components/Party/CreatePartyModal";
import { createRoom } from "../../actions/rooms";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onCreate: (name: string, secret: string) => dispatch(createRoom(name, secret))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(CreatePartyModal);
