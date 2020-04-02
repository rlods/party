import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
//
import { MappedProps } from "../../containers/Room";
import Controls from "../../containers/Room/Controls";
import Queue from "../../containers/Room/Queue";
import Head from "../../containers/Room/Head";
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
      roomColor: { fg, bg }
    } = this.props;
    return (
      <div
        className="Room"
        style={{
          color: `rgb(${fg.r}, ${fg.g}, ${fg.b})`,
          backgroundColor: `rgb(${bg.r}, ${bg.g}, ${bg.b})`
        }}
      >
        <Head />
        <Queue />
        <Controls />
      </div>
    );
  };
}

export default withRouter(Room);
