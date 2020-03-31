import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Controls";
import IconButton from "../Common/IconButton";

// ------------------------------------------------------------------

class Controls extends Component<MappedProps> {
  public render = () => {
    const { onPlay, onSearch, onStop } = this.props;
    return (
      <div className="Controls">
        <div>
          <IconButton onClick={onPlay} icon="play" title="Play" />
        </div>
        <div>
          <IconButton onClick={onStop} icon="stop" title="Stop" />
        </div>
        <div>
          <IconButton onClick={onSearch} icon="search" title="Search" />
        </div>
      </div>
    );
  };
}

export default Controls;
