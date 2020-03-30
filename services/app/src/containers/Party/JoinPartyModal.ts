import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import JoinPartyModal from "../../components/Party/JoinPartyModal";
import { joinRoom } from "../../actions/rooms";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onJoin: (id: string) => dispatch(joinRoom(id))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(JoinPartyModal);
