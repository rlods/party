import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import ConfirmModal, {
  ConfirmModalProps,
} from "../../components/Modals/ConfirmModal";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (
  dispatch: ThunkDispatch<RootState, any, any>,
  ownProps: ConfirmModalProps
) => ({
  onCancel: () => {
    dispatch(popModal());
    if (ownProps.onCanceled) {
      ownProps.onCanceled();
    }
  },
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(ConfirmModal);
