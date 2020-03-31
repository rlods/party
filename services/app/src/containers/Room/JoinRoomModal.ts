import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import JoinRoomModal from "../../components/Room/JoinRoomModal";
import { enterRoom } from "../../actions/rooms";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onEnter: (id: string) => dispatch(enterRoom(id))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(JoinRoomModal);
