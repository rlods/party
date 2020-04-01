import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/App/Menu";

// ------------------------------------------------------------------

class Menu extends Component<MappedProps> {
  public render = () => {
    const {
      user,
      onCreateRoom,
      onEnterRoom,
      onDisconnectUser,
      onConnectUser
    } = this.props;
    return (
      <Fragment>
        <div className="Logo">
          <Link to="/">Logo</Link>
        </div>
        <div className="Menu">
          {!!user ? (
            <Fragment>
              <div>
                <IconButton
                  title="Create Room"
                  icon="plus"
                  onClick={onCreateRoom}
                />
              </div>
              <div>
                <IconButton
                  title="Join Room"
                  icon="folder-open"
                  onClick={onEnterRoom}
                />
              </div>
              <div>
                <IconButton
                  title={`Disconnect (${user.name})`}
                  icon="sign-out"
                  onClick={onDisconnectUser}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div>
                <IconButton
                  title="Connect"
                  icon="sign-in"
                  onClick={onConnectUser}
                />
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  };
}

export default Menu;
