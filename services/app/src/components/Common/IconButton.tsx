import React, { Component } from "react";
import classNames from "classnames";
//
import Icon from "./Icon";
import "./IconButton.scss";

// ------------------------------------------------------------------

type ButtonType = "button" | "submit";

export type Props = {
  className?: string;
  disabled?: boolean;
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
      disabled = false,
      icon,
      kind = "default",
      onClick,
      size,
      title,
      type = "button"
    } = this.props;
    return (
      <button
        type={type}
        aria-label={title}
        className={classNames("IconButton", className, kind, size, {
          clickable: !disabled && (!!onClick || type === "submit")
        })}
        onClick={disabled ? void 0 : onClick}
        title={title}
      >
        <Icon icon={icon} size={size} />
      </button>
    );
  };
}

export const CancelButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton onClick={onClick} title="Cancel" kind="default" icon="ban" />
);

export default IconButton;
