import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Progress from "../../components/Room/Progress";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  playing: state.player.playing,
  value: state.player.position
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Progress);
