import { connect } from "react-redux";
//
import Modal from "../../components/Modals/Modal";
import { RootState } from "../../reducers";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const mapStateToProps = (state: RootState) => ({
  has_prev_modal: state.modals.stack.length > 1
});

const mapDispatchToProps = (dispatch: any) => ({
  onCloseModal: () => dispatch(popModal()),
  onPopModal: () => dispatch(popModal())
});

export type MappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
