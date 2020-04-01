import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Queue from "../../components/Room/Queue";
import { extractTracks } from "../../selectors/tracks";
import { previewTrack } from "../../actions/tracks";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  tracks: extractTracks(state, state.queue.trackIds)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onPlay: (trackId: string) => dispatch(previewTrack(trackId))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Queue);
