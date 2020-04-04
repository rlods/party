import React, { Component, RefObject, createRef } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { v4 } from "uuid";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Users/CreateUserModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import SecretField from "../../containers/Modals/SecretField";

// ------------------------------------------------------------------

let USER_COUNTER = 1;

// ------------------------------------------------------------------

type State = {
  name: string;
  secret: string;
};

class CreateUserModal extends Component<MappedProps & WithTranslation, State> {
  private nameRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    name: "",
    secret: v4(),
  };

  public componentDidMount() {
    this.setState({
      name: `${this.props.t("users.user")} ${USER_COUNTER}`,
    });
    if (this.nameRef.current) {
      this.nameRef.current.focus();
    }
  }

  public render = () => {
    const { t } = this.props;
    const { name, secret } = this.state;
    return (
      <FormModal
        title={t("users.user_creation")}
        onSubmit={this.onCreate}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-name">{t("users.name")}</label>
          <input
            id="modal-name"
            type="text"
            placeholder={t("users.name_placeholder")}
            maxLength={100}
            minLength={2}
            required={true}
            value={name}
            ref={this.nameRef}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
        <SecretField
          id="modal-secret"
          label={t("users.secret")}
          placeholder={t("users.secret_placeholder")}
          value={secret}
          onChange={(newSecret) => this.setState({ secret: newSecret })}
        />
      </FormModal>
    );
  };

  private renderButtons = () => {
    const { t } = this.props;
    return (
      <>
        <IconButton
          title={t("users.create")}
          kind="primary"
          icon="plus"
          type="submit"
        />
        <CancelButton onClick={this.props.onClose} />
        <IconButton
          title={t("users.connect")}
          kind="default"
          icon="sign-in"
          onClick={this.props.onToggle}
        />
      </>
    );
  };

  private onCreate = () => {
    const { onClose, onCreate, onError, t } = this.props;
    const { name, secret } = this.state;
    if (name.trim().length === 0) {
      onError(t("users.name_is_invalid"));
      return;
    }
    if (secret.trim().length === 0) {
      onError(t("users.secret_is_invalid"));
      return;
    }
    onCreate(name, secret);
    onClose();
    USER_COUNTER++;
  };
}

export default withTranslation()(CreateUserModal);
