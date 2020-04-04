import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Queue from "../../components/Room/Queue";
import { extractTracks } from "../../selectors/tracks";
import { setQueuePosition, removeFromQueue } from "../../actions/queue";
import { stopPlayer, startPlayer } from "../../actions/player";
import { isRoomLocked } from "../../selectors/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  locked: isRoomLocked(state),
  playing: state.player.playing,
  trackIndex: state.queue.position % state.queue.trackIds.length,
  tracks: extractTracks(state, state.queue.trackIds)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onPlay: (index: number) => {
    dispatch(startPlayer());
    dispatch(setQueuePosition(index));
  },
  onRemove: (index: number) => dispatch(removeFromQueue(index)),
  onStop: () => dispatch(stopPlayer())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Queue);
