import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Controls from "../../components/Room/Controls";
import { startPlayer, stopPlayer } from "../../actions/player";
import { openModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  playable: state.queue.trackIds.length > 0,
  playing: state.player.playing
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onPlay: () => dispatch(startPlayer()),
  onSearch: () => dispatch(openModal({ type: "Search", props: null })),
  onStop: () => dispatch(stopPlayer())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Controls);
