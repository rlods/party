import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import * as qs from "qs";
//
import { RootState } from "../../reducers";
import Room, { Props } from "../../components/Room";
import { enterRoom, exitRoom } from "../../actions/room";

// ------------------------------------------------------------------

const stateToProps = (state: RootState, ownProps: Props) => ({
	color: state.room.color
});

const dispatchToProps = (
	dispatch: ThunkDispatch<RootState, any, any>,
	ownProps: Props
) => {
	const { secret } = qs.parse(ownProps.location.search.substr(1)) as {
		secret?: string;
	};
	return {
		onEnter: () =>
			dispatch(enterRoom(ownProps.match.params.room_id, secret || "")),
		onExit: () => dispatch(exitRoom())
	};
};

export type MappedProps = ReturnType<typeof stateToProps> &
	ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Room);
