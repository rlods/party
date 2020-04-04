import React, { Component, RefObject, createRef } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Users/ConnectUserModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  id: string;
  secret: string;
};

class ConnectUserModal extends Component<MappedProps & WithTranslation, State> {
  private idRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    id: "",
    secret: "",
  };

  public componentDidMount() {
    if (this.idRef.current) {
      this.idRef.current.focus();
    }
  }

  public render = () => {
    const { t } = this.props;
    const { id, secret } = this.state;
    return (
      <FormModal
        title={t("users.connection")}
        onSubmit={this.onConnect}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-id">{t("users.user_id")}</label>
          <input
            id="modal-id"
            type="text"
            placeholder={t("users.id_placeholder")}
            maxLength={36}
            minLength={36}
            required={true}
            value={id}
            ref={this.idRef}
            onChange={(e) => {
              this.setState({ id: e.target.value });
            }}
          />
        </div>
        <div className="ModalField">
          <label htmlFor="modal-secret">{t("users.secret")}</label>
          <input
            id="modal-secret"
            type="password"
            placeholder={t("users.secret_placeholder")}
            maxLength={36}
            minLength={36}
            required={true}
            value={secret}
            onChange={(e) => {
              this.setState({ secret: e.target.value });
            }}
          />
        </div>
      </FormModal>
    );
  };

  private renderButtons = () => {
    const { t } = this.props;
    return (
      <>
        <IconButton
          title={t("users.connect")}
          kind="primary"
          icon="sign-in"
          type="submit"
        />
        <CancelButton onClick={this.props.onClose} />
        <IconButton
          title={t("users.create")}
          kind="default"
          icon="plus"
          onClick={this.props.onToggle}
        />
      </>
    );
  };

  private onConnect = () => {
    const { onClose, onConnect, onError, t } = this.props;
    const { id, secret } = this.state;
    if (id.trim().length === 0) {
      onError(t("users.id_is_invalid"));
      return;
    }
    if (secret.trim().length === 0) {
      onError(t("users.secret_is_invalid"));
      return;
    }
    onConnect(id, secret);
    onClose();
  };
}

export default withTranslation()(ConnectUserModal);
