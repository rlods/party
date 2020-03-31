import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Queue from "../../components/Room/Queue";
import { extractTracks } from "../../selectors/tracks";
import { preview } from "../../actions/rooms";
import { ContainerType } from "../../utils/containers";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  tracks: extractTracks(state, state.queue.trackIds)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onPlay: (
    containerType: ContainerType,
    containerId: string,
    trackId: string
  ) => dispatch(preview(containerType, containerId, trackId))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Queue);
