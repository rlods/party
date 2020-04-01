import React, { Component } from "react";
//
import Menu from "../../containers/App/Menu";
import { createSharingUrl, Room } from "../../utils/rooms";

// ------------------------------------------------------------------

export type Props = {
  room: Room | null;
  roomId: string;
};

class Head extends Component<Props> {
  public render = () => {
    const { room, roomId } = this.props;
    return (
      <div className="Head">
        <Menu />
        <a className="RoomLink" href={createSharingUrl(roomId)}>
          {room ? room.name : "?"}
        </a>
      </div>
    );
  };
}

export default Head;
