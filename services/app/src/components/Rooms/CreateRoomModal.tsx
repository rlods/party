import React, { Component, Fragment, RefObject, createRef } from "react";
import { v4 } from "uuid";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Rooms/CreateRoomModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  name: string;
  secret: string;
};

class CreateRoomModal extends Component<MappedProps, State> {
  private nameRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    name: "",
    secret: v4()
  };

  public componentDidMount() {
    if (this.nameRef.current) {
      this.nameRef.current.focus();
    }
  }

  public render = () => {
    const { name, secret } = this.state;
    return (
      <FormModal
        title="Create Room"
        onSubmit={this.onCreate}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-name">Room Name</label>
          <input
            id="modal-name"
            type="text"
            placeholder="Room Name..."
            value={name}
            ref={this.nameRef}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
        </div>
        <div className="ModalField">
          <label htmlFor="modal-secret">Room Secret</label>
          <input
            id="modal-secret"
            type="text"
            placeholder="Room Secret..."
            value={secret}
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
      <IconButton title="Create" kind="primary" icon="plus" type="submit" />
      <CancelButton onClick={this.props.onClose} />
    </Fragment>
  );

  private onCreate = () => {
    const { onClose, onCreate, onError } = this.props;
    const { name, secret } = this.state;
    if (name.trim().length === 0) {
      onError("Room name is invalid");
      return;
    }
    if (secret.trim().length === 0) {
      onError("Room secret is invalid");
      return;
    }
    onCreate(name, secret);
    onClose();
  };
}

export default CreateRoomModal;
