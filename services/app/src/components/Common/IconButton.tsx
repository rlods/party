import React, { Component } from "react";
import classNames from "classnames";
//
import Icon from "./Icon";
import "./IconButton.scss";

// ------------------------------------------------------------------

type ButtonType = "button" | "submit";

export type Props = {
  className?: string;
  icon: string;
  kind?: "default" | "primary" | "danger" | "special";
  onClick?: () => void;
  title: string;
  type?: ButtonType;
};

class IconButton extends Component<Props> {
  public render = () => {
    const {
      className,
      icon,
      kind = "default",
      onClick,
      title,
      type = "button"
    } = this.props;
    return (
      <button
        type={type}
        aria-label={title}
        className={classNames("IconButton", className, kind, {
          clickable: !!onClick || type === "submit"
        })}
        onClick={onClick}
        title={title}
      >
        <Icon icon={icon} />
      </button>
    );
  };
}

export const CancelButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton onClick={onClick} title="Cancel" kind="default" icon="ban" />
);

export default IconButton;
