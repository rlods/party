import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Modals/ConfirmModal";
import IconButton, { CancelButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export type ConfirmModalProps = {
  question: string;
  onCanceled?: () => void;
  onConfirmed: () => void;
};

class ConfirmModal extends Component<
  ConfirmModalProps & MappedProps & WithTranslation
> {
  public render = () => {
    const { question, t } = this.props;
    return (
      <FormModal
        title={t("confirm")}
        onSubmit={this.props.onConfirmed}
        renderButtons={this.renderButtons}
      >
        {question}
      </FormModal>
    );
  };

  private renderButtons = () => {
    const { t } = this.props;
    return (
      <>
        <IconButton
          title={t("cancel")}
          kind="primary"
          icon="plus"
          type="submit"
        />
        <CancelButton onClick={this.props.onCancel} />
      </>
    );
  };
}

export default withTranslation()(ConfirmModal);
