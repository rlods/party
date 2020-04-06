import { connect } from "react-redux";
//
import { RootState } from "../../reducers";
import Messages from "../../components/App/Messages";
import { extractMessages } from "../../selectors/messages";

// ------------------------------------------------------------------

const mapStateToProps = (state: RootState) => ({
	messages: extractMessages(state)
});

const mapDispatchToProps = (dispatch: any) => ({});

export type MappedProps = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
