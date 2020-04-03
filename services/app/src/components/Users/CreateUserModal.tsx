import React, { Component, Fragment, RefObject, createRef } from "react";
import { v4 } from "uuid";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Users/CreateUserModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import SecretField from "../../containers/Modals/SecretField";

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
            maxLength={100}
            minLength={2}
            required={true}
            value={name}
            ref={this.nameRef}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>
        <SecretField
          id="modal-secret"
          label="User Secret"
          placeholder="User Secret..."
          value={secret}
          onChange={newSecret => this.setState({ secret: newSecret })}
        />
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
