import React, { Component, Fragment } from "react";
//
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/Splash/Menu";

// ------------------------------------------------------------------

class Menu extends Component<MappedProps> {
  public render = () => {
    const { loggedIn, onCreateRoom, onConnectUser } = this.props;
    return (
      <div className="Menu">
        {loggedIn ? (
          <Fragment>
            <div className="MenuItem">
              <IconButton
                icon="plus"
                onClick={onCreateRoom}
                size="L"
                title="Create Room"
              />
            </div>
            <div className="MenuItem">
              <IconButton
                icon="sign-out"
                onClick={this.onDisconnect}
                size="M"
                title="Disconnect"
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="MenuItem">
              <IconButton
                onClick={onConnectUser}
                icon="sign-in"
                size="L"
                title="Connect"
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  };

  onDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect?")) {
      this.props.onDisconnectUser();
    }
  };
}

export default Menu;
