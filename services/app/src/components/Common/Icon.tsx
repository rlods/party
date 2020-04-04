import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export type Props = {
  className?: string;
  color?: string;
  icon: string;
  size?: "S" | "M" | "L";
  title?: string;
};

class Icon extends Component<Props> {
  public render = () => {
    const { className, color, icon, size = "M", title } = this.props;
    return (
      <FontAwesome
        className={classNames("Icon", className, size)}
        name={icon}
        style={{ color }}
        title={title}
      />
    );
  };
}

export default Icon;

// ------------------------------------------------------------------

export const LoadingIcon = ({ size }: { size?: "S" | "M" | "L" }) => (
  <Icon
    className="rotating"
    icon="circle-o-notch"
    size={size}
    title="Loading"
  />
);
