import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export type Props = {
  className?: string;
  icon: string;
  size?: "S" | "M" | "L";
  title?: string;
};

class Icon extends Component<Props> {
  public render = () => {
    const { className, icon, size = "M", title } = this.props;
    return (
      <FontAwesome
        className={classNames("Icon", className, size)}
        name={icon}
        title={title}
      />
    );
  };
}

export default Icon;
