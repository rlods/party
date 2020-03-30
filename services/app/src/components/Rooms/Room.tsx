import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
//
import { MappedProps } from "../../containers/Rooms/Room";
import Menu from "../../containers/Menu";

// ------------------------------------------------------------------

export type Props = RouteComponentProps<{
  room_id: string;
}>;

class Room extends Component<Props & MappedProps> {
  public componentDidMount = () => {
    this.props.onSubscribe();
  };

  public componentWillUnmount = () => {
    this.props.onUnsubscribe();
  };

  public render = () => {
    return (
      <div className="Room">
        <Menu />
        <div>{this.props.match.params.room_id}</div>
        <div>{this.props.room ? this.props.room.name : "?"}</div>
      </div>
    );
  };
}

export default withRouter(Room);
