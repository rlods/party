import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Head from "../../components/Room/Head";
import { extractRoom, isRoomLocked } from "../../selectors/rooms";
import { openModal } from "../../actions/modals";
import { lockRoom } from "../../actions/rooms";
import { displayMessage } from "../../actions/messages";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  locked: isRoomLocked(state),
  room: extractRoom(state)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onLock: () => dispatch(lockRoom()),
  onMessage: (message: string) => dispatch(displayMessage("info", message)),
  onUnlock: () => dispatch(openModal({ type: "UnlockRoom", props: null }))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Head);
