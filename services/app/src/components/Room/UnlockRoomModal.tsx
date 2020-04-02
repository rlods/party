import React, { Component, Fragment, createRef, RefObject } from "react";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/UnlockRoomModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  secret: string;
};

class UnlockRoomModal extends Component<MappedProps, State> {
  private secretRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    secret: ""
  };

  public componentDidMount() {
    if (this.secretRef.current) {
      this.secretRef.current.focus();
    }
  }

  public render = () => {
    const { secret } = this.state;
    return (
      <FormModal
        title="Join Room"
        onSubmit={this.onJoin}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-secret">Room Secret</label>
          <input
            id="modal-secret"
            type="text"
            placeholder="Room Secret..."
            maxLength={36}
            minLength={36}
            required={true}
            value={secret}
            ref={this.secretRef}
            onChange={e => {
              this.setState({ secret: e.target.value });
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
    const { onClose, onUnlock } = this.props;
    onUnlock(this.state.secret);
    onClose();
  };
}

export default UnlockRoomModal;
