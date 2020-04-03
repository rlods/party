import React, { Component } from "react";
//
import { copyToClipboard } from "../../utils/clipboard";
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/Modals/SecretField";

// ------------------------------------------------------------------

type Props = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

class SecretField extends Component<Props & MappedProps> {
  public render = () => {
    const { id, label, onChange, placeholder, value } = this.props;
    return (
      <div className="ModalField">
        <label htmlFor={id}>{label}</label>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <input
            style={{
              flexGrow: 1,
              marginRight: "0.5rem"
            }}
            id={id}
            type="text"
            placeholder={placeholder}
            maxLength={36}
            minLength={36}
            readOnly={true}
            required={true}
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <IconButton
            icon="clipboard"
            onClick={this.onCopyToClipboard}
            size="M"
            title={`Copy ${label} to Clipboard`}
          />
        </div>
      </div>
    );
  };

  private onCopyToClipboard = async () => {
    const { onMessage, label, value } = this.props;
    await copyToClipboard(value);
    onMessage(`${label} has been copied to clipboard`);
  };
}

export default SecretField;
