import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
//
import { MappedProps } from "../../containers/Room";
import Controls from "../../containers/Room/Controls";
import Queue from "../../containers/Room/Queue";
import Menu from "../../containers/App/Menu";
import { createSharingUrl } from "../../utils/rooms";
import "./index.scss";

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
    const {
      match: {
        params: { room_id }
      },
      room
    } = this.props;
    return (
      <div className="Room">
        <Menu />
        <div>{room_id}</div>
        <div>{room ? room.name : "?"}</div>
        <div>{createSharingUrl(room_id)}</div>
        <Controls />
        <Queue />
      </div>
    );
  };
}

export default withRouter(Room);
