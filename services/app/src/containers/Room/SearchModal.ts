import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Room/SearchModal";
import { popModal } from "../../actions/modals";
import { previewContainer } from "../../actions/containers";
import { queueTracks } from "../../actions/rooms";
import { previewTrack } from "../../actions/tracks";
import { ContainerType } from "../../utils/containers";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onPreviewContainer: (containerType: ContainerType, containerId: string) =>
    dispatch(previewContainer(containerType, containerId)),
  onPreviewTrack: (trackId: string) => dispatch(previewTrack(trackId, true)),
  onSelectContainer: (containerType: ContainerType, containerId: string) =>
    dispatch(queueTracks(containerType, containerId, "")),
  onSelectTrack: (trackId: string) =>
    dispatch(queueTracks("album", "", trackId))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
