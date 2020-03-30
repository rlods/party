import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Splash";
import Menu from "../../containers/Menu";

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
