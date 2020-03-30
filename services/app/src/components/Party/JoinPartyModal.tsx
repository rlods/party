import React, { Component, Fragment, createRef, RefObject } from "react";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Party/JoinPartyModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  roomId: string;
};

class JoinPartyModal extends Component<MappedProps, State> {
  private idRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    roomId: ""
  };

  public componentDidMount() {
    if (this.idRef.current) {
      this.idRef.current.focus();
    }
  }

  public render = () => {
    const { roomId } = this.state;
    return (
      <FormModal
        title="Join Party"
        onSubmit={this.onJoin}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-roomId">Room ID</label>
          <input
            id="modal-roomId"
            type="text"
            placeholder="Room ID..."
            value={roomId}
            ref={this.idRef}
            onChange={e => {
              this.setState({ roomId: e.target.value });
            }}
          />
        </div>
      </FormModal>
    );
  };

  private renderButtons = () => (
    <Fragment>
      <IconButton title="Join" kind="primary" icon="sign-in" type="submit" />
      <CancelButton onClick={this.props.onClose} />
    </Fragment>
  );

  private onJoin = () => {
    const { onClose, onJoin } = this.props;
    const { roomId } = this.state;
    if (roomId.trim().length === 0) {
      console.log("Room ID is invalid");
      return;
    }
    onJoin(roomId);
    onClose();
  };
}

export default JoinPartyModal;
