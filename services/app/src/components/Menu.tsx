import React, { Component } from "react";
import { Link } from "react-router-dom";
//
import IconButton from "./Common/IconButton";
import { MappedProps } from "../containers/Menu";

// ------------------------------------------------------------------

class Menu extends Component<MappedProps> {
  public render = () => {
    return (
      <div className="Menu">
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <IconButton
            title="Join Party"
            icon="sign-in"
            onClick={this.props.joinRoom}
          />
        </div>
        <div>
          <IconButton
            title="Create Party"
            icon="plus"
            onClick={this.props.createRoom}
          />
        </div>
      </div>
    );
  };
}

export default Menu;
