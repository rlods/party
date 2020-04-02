import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Controls";
import IconButton from "../Common/IconButton";
import history from "../../utils/history";
import "./Controls.scss";

// ------------------------------------------------------------------

class Controls extends Component<MappedProps> {
  public render = () => {
    const {
      onMoveBackward,
      onMoveForward,
      onPlay,
      onSearch,
      onStop,
      playable,
      playing
    } = this.props;
    return (
      <div className="Controls">
        <div className="ControlsSet">
          <div className="Control">
            <IconButton
              disabled={!playable}
              icon="step-backward"
              onClick={onMoveBackward}
              size="M"
              title="Previous"
            />
          </div>
          <div className="Control">
            {!playable || !playing ? (
              <IconButton
                disabled={!playable}
                onClick={onPlay}
                icon="play"
                size="L"
                title="Play"
              />
            ) : (
              <IconButton
                disabled={!playable}
                onClick={onStop}
                icon="pause"
                title="Stop"
                size="L"
              />
            )}
          </div>
          <div className="Control">
            <IconButton
              disabled={!playable}
              icon="step-forward"
              onClick={onMoveForward}
              size="M"
              title="Next"
            />
          </div>
        </div>
        <div className="ControlsSet">
          <div className="Control">
            <IconButton
              onClick={this.onClear}
              icon="trash"
              title="Clear Room"
            />
          </div>
          <div className="Control">
            <IconButton onClick={onSearch} icon="search" title="Search Media" />
          </div>
          <div className="Control">
            <IconButton
              onClick={this.onExit}
              icon="sign-out"
              title="Exit Room"
            />
          </div>
        </div>
      </div>
    );
  };

  onClear = () => {
    if (window.confirm("Are you sure you want to clear Room")) {
      this.props.onClear();
    }
  };

  onExit = () => {
    if (window.confirm("Are you sure you want to leave the room?")) {
      history.push("/");
    }
  };
}

export default Controls;
