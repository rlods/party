import { connect } from "react-redux";
//
import { RootState } from "../../reducers";
import Messages from "../../components/App/Messages";

// ------------------------------------------------------------------

export type MappedProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
  messages: state.messages.sort((m1, m2) => m1.stamp - m2.stamp)
});

export default connect(mapStateToProps)(Messages);
