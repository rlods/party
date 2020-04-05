import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Controls from "../../components/Room/Controls";
import { startPlayer, stopPlayer } from "../../actions/player";
import { openModal, confirmModal } from "../../actions/modals";
import { clearQueue, moveBackward, moveForward } from "../../actions/queue";
import { isRoomLocked } from "../../selectors/rooms";
import { displayMessage } from "../../actions/messages";
import { lockRoom } from "../../actions/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  tracksCount: state.queue.trackIds.length,
  locked: isRoomLocked(state),
  playing: state.player.playing,
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClear: () => {
    dispatch(clearQueue());
    dispatch(stopPlayer());
  },
  onConfirm: (question: string, onConfirmed: () => void) => {
    dispatch(confirmModal(question, onConfirmed));
  },
  onLock: () => dispatch(lockRoom()),
  onUnlock: () => dispatch(openModal({ type: "UnlockRoom", props: null })),
  onMessage: (message: string) => dispatch(displayMessage("info", message)),
  onMoveBackward: () => dispatch(moveBackward()),
  onMoveForward: () => dispatch(moveForward()),
  onPlay: () => dispatch(startPlayer()),
  onSearch: () => dispatch(openModal({ type: "Search", props: null })),
  onStop: () => dispatch(stopPlayer()),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Controls);
