import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Room/SearchModal";
import { popModal } from "../../actions/modals";
import { preview, queueTracks } from "../../actions/rooms";
import { ContainerType } from "../../utils/containers";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onPreview: (
    containerType: ContainerType,
    containerId: string,
    trackId: string
  ) => dispatch(preview(containerType, containerId, trackId)),
  onSelect: (
    containerType: ContainerType,
    containerId: string,
    trackId: string
  ) => dispatch(queueTracks(containerType, containerId, trackId))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
