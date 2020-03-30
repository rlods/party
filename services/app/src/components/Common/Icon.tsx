import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export type Props = {
  className?: string;
  icon: string;
  title?: string;
};

class Icon extends Component<Props> {
  public render = () => {
    const { className, icon, title } = this.props;
    return (
      <FontAwesome
        className={classNames("Icon", className)}
        name={icon}
        title={title}
      />
    );
  };
}

export default Icon;
