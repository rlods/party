import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
//
import { MappedProps } from "../../containers/Rooms/Room";
import Menu from "../../containers/Menu";
import { createSharingUrl } from "../../utils/rooms";

// ------------------------------------------------------------------

export type Props = RouteComponentProps<{
  room_id: string;
}>;

class Room extends Component<Props & MappedProps> {
  public componentDidMount = () => {
    this.props.onEnter();
  };

  public componentWillUnmount = () => {
    this.props.onExit();
  };

  public render = () => {
    return (
      <div className="Room">
        <Menu />
        <div>{this.props.match.params.room_id}</div>
        <div>{this.props.room ? this.props.room.name : "?"}</div>
        <div>{createSharingUrl(this.props.match.params.room_id)}</div>
      </div>
    );
  };
}

export default withRouter(Room);
