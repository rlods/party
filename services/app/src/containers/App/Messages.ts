import { connect } from "react-redux";
//
import { RootState } from "../../reducers";
import Messages from "../../components/App/Messages";
import { extractMessages } from "../../selectors/messages";

// ------------------------------------------------------------------

export type MappedProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
  messages: extractMessages(state),
});

export default connect(mapStateToProps)(Messages);
