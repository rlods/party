import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Controls from "../../components/Room/Controls";
import { loadAudio, stopAudio } from "../../actions/player";
import { openModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onPlay: () =>
    dispatch(
      loadAudio(
        "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3",
        true,
        0
      )
    ),
  onSearch: () => dispatch(openModal({ type: "Search", props: null })),
  onStop: () => dispatch(stopAudio())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Controls);
