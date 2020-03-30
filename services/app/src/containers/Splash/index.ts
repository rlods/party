import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../../reducers";
import Splash from "../../components/Splash";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => ({});

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Splash);
