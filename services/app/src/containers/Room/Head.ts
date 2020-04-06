import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Head from "../../components/Room/Head";
import { extractRoom } from "../../selectors/room";
import { confirmModal } from "../../actions/modals";
import { displayMessage } from "../../actions/messages";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
	room: extractRoom(state)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
	onConfirm: (question: string, onConfirmed: () => void) => {
		dispatch(confirmModal(question, onConfirmed));
	},
	onMessage: (message: string) => dispatch(displayMessage("info", message))
});

export type MappedProps = ReturnType<typeof stateToProps> &
	ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Head);
