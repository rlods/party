import React, { Component, Fragment, createRef, RefObject } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/UnlockRoomModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

type State = {
  secret: string;
};

class UnlockRoomModal extends Component<MappedProps & WithTranslation, State> {
  private secretRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    secret: "",
  };

  public componentDidMount() {
    if (this.secretRef.current) {
      this.secretRef.current.focus();
    }
  }

  public render = () => {
    const { t } = this.props;
    const { secret } = this.state;
    return (
      <FormModal
        title={t("rooms.room_unlock")}
        onSubmit={this.onUnlock}
        renderButtons={this.renderButtons}
      >
        <div className="ModalField">
          <label htmlFor="modal-secret">{t("rooms.room_key")}</label>
          <input
            id="modal-secret"
            type="password"
            placeholder={t("rooms.room_key_placeholder")}
            maxLength={36}
            minLength={36}
            required={true}
            value={secret}
            ref={this.secretRef}
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
      <Fragment>
        <IconButton
          title={t("rooms.unlock")}
          kind="primary"
          icon="key"
          type="submit"
        />
        <CancelButton onClick={this.props.onClose} />
      </Fragment>
    );
  };

  private onUnlock = () => {
    const { onClose, onUnlock } = this.props;
    onUnlock(this.state.secret);
    onClose();
  };
}

export default withTranslation()(UnlockRoomModal);
