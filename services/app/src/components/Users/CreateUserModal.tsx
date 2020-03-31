import React, { Component, Fragment, RefObject, createRef } from "react";
import { v4 } from "uuid";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Users/CreateUserModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  name: string;
  secret: string;
};

class CreateUserModal extends Component<MappedProps, State> {
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
        title="Create User"
        onSubmit={this.onCreate}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-name">User Name</label>
          <input
            id="modal-name"
            type="text"
            placeholder="User Name..."
            maxLength={20}
            minLength={2}
            required={true}
            value={name}
            ref={this.nameRef}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
        </div>
        <div className="ModalField">
          <label htmlFor="modal-secret">User Secret</label>
          <input
            id="modal-secret"
            type="text"
            placeholder="User Secret..."
            maxLength={200}
            minLength={8}
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
      <IconButton title="Create" kind="primary" icon="plus" type="submit" />
      <CancelButton onClick={this.props.onClose} />
      <IconButton
        title="Connect"
        kind="default"
        icon="sign-in"
        onClick={this.props.onToggle}
      />
    </Fragment>
  );

  private onCreate = () => {
    const { onClose, onCreate, onError } = this.props;
    const { name, secret } = this.state;
    if (name.trim().length === 0) {
      onError("User name is invalid");
      return;
    }
    if (secret.trim().length === 0) {
      onError("User secret is invalid");
      return;
    }
    onCreate(name, secret);
    onClose();
  };
}

export default CreateUserModal;
