import React, { Component } from "react";
//
import { MappedProps } from "../containers/Splash";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return <div className="Splash">Splash</div>;
  };
}

export default Splash;
