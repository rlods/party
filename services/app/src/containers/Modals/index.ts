import { connect } from "react-redux";
//
import Modals from "../../components/Modals";
import { RootState } from "../../reducers";
import { popModal } from "../../actions/modals";

// ------------------------------------------------------------------

const mapStateToProps = (state: RootState) => ({
  prereq:
    state.modals.stack.length > 0
      ? state.modals.stack[state.modals.stack.length - 1]
      : void 0
});

const mapDispatchToProps = (dispatch: any) => ({
  onCloseModal: () => dispatch(popModal())
});

export type MappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
