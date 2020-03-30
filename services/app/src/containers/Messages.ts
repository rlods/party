import { connect } from "react-redux";
//
import { RootState } from "../reducers";
import Messages from "../components/Messages";

// ------------------------------------------------------------------

export type MappedProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(Messages);
