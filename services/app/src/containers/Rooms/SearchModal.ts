import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Rooms/SearchModal";
import { popModal } from "../../actions/modals";
import { playInRoom } from "../../actions/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onSelect: (containerType: string, containerId: string, trackId: string) =>
    dispatch(playInRoom(containerType, containerId, trackId))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
