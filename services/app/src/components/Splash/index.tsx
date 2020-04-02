import React, { Component } from "react";
import { Link } from "react-router-dom";
//
import { MappedProps } from "../../containers/Splash";
import Menu from "../../containers/Splash/Menu";
import "./index.scss";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps> {
  public render = () => {
    return (
      <div className="Splash">
        <div className="Logo">
          <Link to="/">Deezer Party</Link>
        </div>
        <Menu />
      </div>
    );
  };
}

export default Splash;
