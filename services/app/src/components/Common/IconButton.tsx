import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
//
import Icon from "./Icon";
import "./IconButton.scss";

// ------------------------------------------------------------------

type ButtonType = "button" | "submit";

export type Props = {
  className?: string;
  color?: string;
  disabled?: boolean;
  displayTitle?: boolean;
  icon: string;
  kind?: "default" | "primary" | "danger" | "special";
  onClick?: () => void;
  size?: "S" | "M" | "L";
  title: string;
  type?: ButtonType;
};

class IconButton extends Component<Props> {
  public render = () => {
    const {
      className,
      color,
      disabled = false,
      displayTitle = false,
      icon,
      kind = "default",
      onClick,
      size,
      title,
      type = "button",
    } = this.props;
    return (
      <button
        type={type}
        aria-label={title}
        className={classNames("IconButton", className, kind, size, {
          clickable: !disabled && (!!onClick || type === "submit"),
        })}
        onClick={disabled ? void 0 : onClick}
        title={title}
      >
        <Icon color={color} icon={icon} size={size} />
        {displayTitle && (
          <div className={classNames("IconButtonTitle", size)}>{title}</div>
        )}
      </button>
    );
  };
}

export default IconButton;

// ------------------------------------------------------------------

type CancelButtonProps = {
  onClick: () => void;
};

class _CancelButton extends Component<CancelButtonProps & WithTranslation> {
  public render = () => {
    const { onClick, t } = this.props;
    return (
      <IconButton
        onClick={onClick}
        title={t("cancel")}
        kind="default"
        icon="ban"
      />
    );
  };
}

export const CancelButton = withTranslation()(_CancelButton);
