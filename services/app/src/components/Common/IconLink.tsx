import React, { Component } from "react";
import classNames from "classnames";
//
import Icon from "../Common/Icon";

// ------------------------------------------------------------------

export type Props = {
  blank?: boolean;
  className?: string;
  icon: string;
  size?: "S" | "M" | "L";
  title: string;
  url: string;
};

class IconLink extends Component<Props> {
  public render = () => {
    const { blank = false, className, icon, size, title, url } = this.props;
    return (
      <a
        className={classNames("IconLink", className, size)}
        href={url}
        target={blank ? "_blank" : void 0}
        rel={blank ? "noopener noreferrer" : void 0}
      >
        <Icon icon={icon} size={size} title={title} />
      </a>
    );
  };
}

export default IconLink;
