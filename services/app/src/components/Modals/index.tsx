import React, { Component, MouseEvent } from "react";
import { CSSTransition } from "react-transition-group";
//
import { MappedProps } from "../../containers/Modals";
import { ModalPrereq } from "../../actions/modals";
import CreatePartyModal from "../../containers/Party/CreatePartyModal";
import "./index.scss";

// ------------------------------------------------------------------

const TransitionTimeout = 300;

// ------------------------------------------------------------------

export const getModal = (prereq: ModalPrereq) => {
  switch (prereq.type) {
    case "CreateParty":
      return <CreatePartyModal />;
  }
};

// ------------------------------------------------------------------

type State = {
  curr_prereq?: ModalPrereq;
  prev_prereq?: ModalPrereq; // Keeping prev modal prereq for modal fadeout
};

class Modals extends Component<MappedProps, State> {
  public readonly state: State = {
    curr_prereq: void 0,
    prev_prereq: void 0
  };

  public componentDidMount = () => {
    document.addEventListener("keydown", this.onKeyDown);
  };

  public componentWillUnmount = () => {
    document.removeEventListener("keydown", this.onKeyDown);
  };

  public componentDidUpdate = (prevProps: MappedProps) => {
    const oldPrereq = prevProps.prereq;
    const newPrereq = this.props.prereq;
    if (oldPrereq !== newPrereq) {
      // Hide current modal before showing new one (if there is a new one)
      this.setState(
        {
          curr_prereq: void 0,
          prev_prereq: oldPrereq
        },
        () => {
          if (newPrereq) {
            setTimeout(() => {
              this.setState({
                curr_prereq: newPrereq
              });
            }, TransitionTimeout);
          }
        }
      );
    }
  };

  public render = () => {
    const { curr_prereq, prev_prereq } = this.state;
    const prereq = curr_prereq || prev_prereq;
    let modal = null;
    if (prereq) {
      modal = getModal(prereq);
    }
    return (
      <CSSTransition
        in={!!curr_prereq}
        timeout={TransitionTimeout}
        unmountOnExit={true}
      >
        <div className="ModalOverlay" onClick={this.onClickOverlay}>
          {modal && (
            <div
              className="ModalWrapper"
              role="dialog"
              onClick={this.onClickWrapper}
            >
              {modal}
            </div>
          )}
        </div>
      </CSSTransition>
    );
  };

  private onClickOverlay = (event: MouseEvent) => {
    // Clicking overlay will close current modal
    event.stopPropagation();
    this.props.onCloseModal();
  };

  private onClickWrapper = (event: MouseEvent) => {
    // Clicking wrapper modal will not progagate to overlay which would close current modal
    event.stopPropagation();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.props.onCloseModal();
    }
  };
}

export default Modals;
