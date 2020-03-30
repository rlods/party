import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
//
import { MappedProps } from "../../containers/Party";
import Menu from "../../containers/Menu";

// ------------------------------------------------------------------

export type Props = RouteComponentProps<{
  room_id: string;
}>;

class Party extends Component<Props & MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return (
      <div className="Party">
        <Menu />
        {this.props.match.params.room_id}
      </div>
    );
  };
}

export default withRouter(Party);
