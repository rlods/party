import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
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

class SecretField extends Component<Props & MappedProps & WithTranslation> {
  public render = () => {
    const { id, label, onChange, placeholder, value } = this.props;
    return (
      <div className="ModalField">
        <label htmlFor={id}>{label}</label>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <input
            style={{
              flexGrow: 1,
              marginRight: "0.5rem",
            }}
            id={id}
            type="password"
            placeholder={placeholder}
            maxLength={36}
            minLength={36}
            required={true}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <IconButton
            icon="clipboard"
            onClick={this.onCopyToClipboard}
            size="M"
            title={`Copy to Clipboard`}
          />
        </div>
      </div>
    );
  };

  private onCopyToClipboard = async () => {
    const { onMessage, value, t } = this.props;
    await copyToClipboard(value);
    onMessage(t("secret_copied_to_clipboard"));
  };
}

export default withTranslation()(SecretField);
