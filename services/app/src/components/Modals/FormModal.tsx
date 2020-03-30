import React, { Component } from "react";
import classNames from "classnames";
//
import Modal from "../../containers/Modals/Modal";

// ------------------------------------------------------------------

type Props = {
  className?: string;
  onSubmit: () => void;
  renderButtons: () => React.ReactNode;
  title: string;
};

class FormModal extends Component<Props> {
  public render = () => {
    const { children, className, renderButtons, title, onSubmit } = this.props;
    return (
      <Modal
        className={classNames("FormModal", className)}
        title={title}
        renderFoot={renderButtons}
        onSubmit={onSubmit}
      >
        {children}
      </Modal>
    );
  };
}

export default FormModal;
