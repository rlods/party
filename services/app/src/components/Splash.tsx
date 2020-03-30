import React, { Component } from "react";
import { Link } from "react-router-dom";
//
import { MappedProps } from "../containers/Splash";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return (
      <div className="Splash">
        Splash <Link to="/party/xxx">Party</Link>
      </div>
    );
  };
}

export default Splash;
