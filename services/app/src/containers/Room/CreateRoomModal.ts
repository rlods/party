import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import CreateRoomModal from "../../components/Room/CreateRoomModal";
import { createRoom } from "../../actions/room";
import { popModal } from "../../actions/modals";
import { displayError } from "../../actions/messages";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onCreate: (name: string, secret: string) =>
    dispatch(createRoom(name, secret)),
  onError: (message: string) => dispatch(displayError(message)),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(CreateRoomModal);
