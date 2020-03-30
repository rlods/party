import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//
import IconButton from "./Common/IconButton";
import { MappedProps } from "../containers/Menu";

// ------------------------------------------------------------------

class Menu extends Component<MappedProps> {
  public render = () => {
    const { user } = this.props;
    return (
      <div className="Menu">
        <div>
          <Link to="/">Home</Link>
        </div>
        {!!user ? (
          <Fragment>
            <div>
              <IconButton
                title="Create Room"
                icon="plus"
                onClick={this.props.createRoom}
              />
            </div>
            <div>
              <IconButton
                title="Join Room"
                icon="folder-open"
                onClick={this.props.enterRoom}
              />
            </div>
            <div>
              <IconButton
                title="Disconnect"
                icon="sign-out"
                onClick={this.props.disconnectUser}
              />
              {user.name}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div>
              <IconButton
                title="Connect"
                icon="sign-in"
                onClick={this.props.connectUser}
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  };
}

export default Menu;
