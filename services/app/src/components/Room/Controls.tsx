import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Controls";
import IconButton from "../Common/IconButton";

// ------------------------------------------------------------------

class Controls extends Component<MappedProps> {
  public render = () => {
    const { onPlay, onSearch, onStop, playing } = this.props;
    return (
      <div className="Controls">
        <div className="Control">
          {!playing ? (
            <IconButton onClick={onPlay} icon="play" title="Play" />
          ) : (
            <IconButton onClick={onStop} icon="pause" title="Stop" />
          )}
        </div>
        <div className="Control">
          <IconButton onClick={onSearch} icon="search" title="Search" />
        </div>
      </div>
    );
  };
}

export default Controls;
