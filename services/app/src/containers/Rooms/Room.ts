import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Room, { Props } from "../../components/Rooms/Room";
import { extractRoom } from "../../selectors/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState, ownProps: Props) => ({
  room: extractRoom(state, ownProps.match.params.room_id)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onSubscribe: () => {},
  onUnsubscribe: () => {}
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Room);
