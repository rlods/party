import { connect } from "react-redux";
//
import SecretField from "../../components/Modals/SecretField";
import { RootState } from "../../reducers";
import { displayMessage } from "../../actions/messages";

// ------------------------------------------------------------------

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onMessage: (message: string) => dispatch(displayMessage("info", message))
});

export type MappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SecretField);
