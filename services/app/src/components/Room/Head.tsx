import React, { Component } from "react";
//
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/Room/Head";
import { copyToClipboard } from "../../utils/clipboard";
import "./Head.scss";

// ------------------------------------------------------------------

class Head extends Component<MappedProps> {
  public render = () => {
    const { locked, room, onLock, onUnlock } = this.props;
    return (
      <div className="Head">
        <div className="RoomStatus">
          {locked ? (
            <IconButton
              icon="lock"
              onClick={onUnlock}
              size="M"
              title="Locked (click to unlock)"
            />
          ) : (
            <IconButton
              icon="unlock"
              onClick={onLock}
              size="M"
              title="Unlocked (click to lock)"
            />
          )}
        </div>
        <div className="RoomName">{room ? room.name : ""}</div>
        <div className="RoomLink">
          <IconButton
            icon="link"
            onClick={this.onCopyLink}
            size="M"
            title="Copy Room Link to Clipboard"
          />
        </div>
      </div>
    );
  };

  private onCopyLink = async () => {
    await copyToClipboard(document.location.href);
    this.props.onMessage("Room link has been copied to clipboard");
  };
}

export default Head;
