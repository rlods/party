import React, { Component, Fragment, RefObject, createRef } from "react";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Users/ConnectUserModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  id: string;
  secret: string;
};

class ConnectUserModal extends Component<MappedProps, State> {
  private idRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    id: "",
    secret: ""
  };

  public componentDidMount() {
    if (this.idRef.current) {
      this.idRef.current.focus();
    }
  }

  public render = () => {
    const { id, secret } = this.state;
    return (
      <FormModal
        title="Connect User"
        onSubmit={this.onConnect}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-id">User ID</label>
          <input
            id="modal-id"
            type="text"
            placeholder="User ID..."
            maxLength={36}
            minLength={36}
            required={true}
            value={id}
            ref={this.idRef}
            onChange={e => {
              this.setState({ id: e.target.value });
            }}
          />
        </div>
        <div className="ModalField">
          <label htmlFor="modal-secret">User Secret</label>
          <input
            id="modal-secret"
            type="text"
            placeholder="User Secret..."
            maxLength={36}
            minLength={36}
            required={true}
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
      <IconButton title="Connect" kind="primary" icon="sign-in" type="submit" />
      <CancelButton onClick={this.props.onClose} />
      <IconButton
        title="Create"
        kind="default"
        icon="plus"
        onClick={this.props.onToggle}
      />
    </Fragment>
  );

  private onConnect = () => {
    const { onClose, onConnect, onError } = this.props;
    const { id, secret } = this.state;
    if (id.trim().length === 0) {
      onError("User ID is invalid");
      return;
    }
    if (secret.trim().length === 0) {
      onError("User secret is invalid");
      return;
    }
    onConnect(id, secret);
    onClose();
  };
}

export default ConnectUserModal;
