import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//
import { MappedProps } from "../../containers/Splash";
import "./index.scss";
import IconButton from "../Common/IconButton";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps> {
  public render = () => {
    const { user, loggedIn, onCreateRoom, onConnectUser } = this.props;
    return (
      <div className="Splash">
        <div className="Top">
          <div className="Logo">
            <Link to="/">Deezer Party</Link>
          </div>
          <div className="Welcome">
            {loggedIn || user
              ? `Welcome ${user?.name || ""}`
              : "Please connect to play"}
          </div>
        </div>
        <div className="Middle">
          <div className="Menu">
            {loggedIn ? (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="plus"
                  onClick={onCreateRoom}
                  size="L"
                  title="Create Room"
                />
              </div>
            ) : (
              <Fragment>
                <div className="MenuItem">
                  <IconButton
                    displayTitle={true}
                    onClick={onConnectUser}
                    icon="sign-in"
                    size="L"
                    title="Connect"
                  />
                </div>
              </Fragment>
            )}
          </div>
        </div>
        <div className="Bottom">
          <div className="Menu">
            {loggedIn ? (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="sign-out"
                  onClick={this.onDisconnect}
                  size="M"
                  title="Disconnect"
                />
              </div>
            ) : (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="info"
                  onClick={() => {}}
                  size="M"
                  title="CGU"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  onDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect?")) {
      this.props.onDisconnectUser();
    }
  };
}

export default Splash;
