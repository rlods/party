import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Room, { Props } from "../../components/Rooms/Room";
import { enterRoom, exitRoom } from "../../actions/rooms";
import { extractRoom } from "../../selectors/rooms";
import { load, stop } from "../../actions/player";
import { openModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState, ownProps: Props) => ({
  room: extractRoom(state, ownProps.match.params.room_id)
});

const dispatchToProps = (
  dispatch: ThunkDispatch<RootState, any, any>,
  ownProps: Props
) => ({
  onEnter: () => dispatch(enterRoom(ownProps.match.params.room_id)),
  onExit: () => dispatch(exitRoom()),
  onPlay: () =>
    dispatch(
      load(
        "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3",
        true,
        0
      )
    ),
  onSearch: () => dispatch(openModal({ type: "Search", props: null })),
  onStop: () => dispatch(stop())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Room);
