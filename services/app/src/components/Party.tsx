import React, { Component } from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
//
import { MappedProps } from "../containers/Party";

// ------------------------------------------------------------------

export type Props = RouteComponentProps<{
  room_id: string;
}>;

class Party extends Component<Props & MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return (
      <div className="Party">
        Party {this.props.match.params.room_id} <Link to="/">Splash</Link>
      </div>
    );
  };
}

export default withRouter(Party);
