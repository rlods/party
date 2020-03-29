import React, { Component } from "react";
//
import { MappedProps } from "../containers/Party";
import { withRouter, RouteComponentProps } from "react-router-dom";

// ------------------------------------------------------------------

export type Props = RouteComponentProps<{
  room_id: string;
}>;

class Party extends Component<Props & MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return <div className="Party">Party {this.props.match.params.room_id}</div>;
  };
}

export default withRouter(Party);
