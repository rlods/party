import React, { Component } from "react";
import { Room } from "../../utils/rooms";

// ------------------------------------------------------------------

export type Props = {
  room: Room | null;
};

class Head extends Component<Props> {
  public render = () => {
    const { room } = this.props;
    return <div className="Head">{room ? room.name : "?"}</div>;
  };
}

export default Head;
