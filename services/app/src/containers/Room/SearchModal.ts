import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Room/SearchModal";
import { popModal } from "../../actions/modals";
import { previewContainer } from "../../actions/containers";
import { queueTracks } from "../../actions/rooms";
import { startPreview, stopPreview } from "../../actions/player";
import { MediaType } from "../../utils/containers";
import { isRoomLocked } from "../../selectors/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  locked: isRoomLocked(state)
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onSelect: (mediaType: MediaType, mediaId: string) =>
    dispatch(
      "track" === mediaType
        ? queueTracks("album", "", mediaId)
        : queueTracks(mediaType, mediaId, "")
    ),
  onStartPreview: (mediaType: MediaType, mediaId: string) => {
    dispatch(
      "track" === mediaType
        ? startPreview(mediaId)
        : previewContainer(mediaType, mediaId)
    );
  },
  onStopPreview: () => dispatch(stopPreview())
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
