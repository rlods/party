import React, { Component } from "react";
//
import Modal from "../../containers/Modals/Modal";
import { MappedProps } from "../../containers/Party/CreatePartyModal";

// ------------------------------------------------------------------

class CreatePartyModal extends Component<MappedProps> {
  public render = () => {
    return <Modal title="Create Party">CreatePartyModal</Modal>;
  };
}

export default CreatePartyModal;
