import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Splash";
import Menu from "../../containers/App/Menu";
import "./index.scss";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return (
      <div className="Splash">
        <Menu />
      </div>
    );
  };
}

export default Splash;
