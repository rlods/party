import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
//
import { RootState } from "../reducers";
import { openModal } from "../actions/modals";
import Menu from "../components/Menu";

// ------------------------------------------------------------------

const stateToProps = (state: RootState) => {
  return {};
};

const dispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => ({
  createRoom: () => dispatch(openModal({ type: "CreateParty", props: null })),
  joinRoom: () => dispatch(openModal({ type: "JoinParty", props: null }))
});

export type MappedProps = ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>;

export default connect(stateToProps, dispatchToProps)(Menu);
