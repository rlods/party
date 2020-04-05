import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import SearchModal from "../../components/Room/SearchModal";
import { popModal } from "../../actions/modals";
import { loadMedias } from "../../actions/medias";
import { stopPreview } from "../../actions/player";
import { ProviderType, MediaType } from "../../utils/medias";
import { isRoomLocked } from "../../selectors/rooms";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({
  locked: isRoomLocked(state),
});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  onClose: () => dispatch(popModal()),
  onSelect: (provider: ProviderType, mediaType: MediaType, mediaId: string) =>
    dispatch(loadMedias(provider, mediaType, [mediaId], true, false)),
  onPlay: (provider: ProviderType, mediaType: MediaType, mediaId: string) =>
    dispatch(loadMedias(provider, mediaType, [mediaId], false, true)),
  onStop: () => dispatch(stopPreview()),
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(SearchModal);
