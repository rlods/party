import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Room/SearchModal";
import { popModal } from "../../actions/modals";
import { previewMedia } from "../../actions/medias";
import { queueTracks } from "../../actions/rooms";
import { stopPreview } from "../../actions/player";
import { MediaType } from "../../utils/medias";
import { isRoomLocked } from "../../selectors/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  locked: isRoomLocked(state),
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onSelect: (mediaType: MediaType, mediaId: string) =>
    dispatch(queueTracks("deezer", mediaType, mediaId)),
  onStartPreview: (mediaType: MediaType, mediaId: string) =>
    dispatch(previewMedia("deezer", mediaType, mediaId)),
  onStopPreview: () => dispatch(stopPreview()),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
