import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Queue";
import { Track } from "./Medias";
import "./Queue.scss";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps> {
  public render = () => {
    const { playing, playingPosition, tracks, onPlay, onStop } = this.props;
    return (
      <div className="Queue">
        {tracks.map((track, index) => (
          <div className="QueueItem" key={track.id}>
            <Track
              track={track}
              playing={playing && playingPosition === index}
              onPlay={() => onPlay(index)}
              onStop={onStop}
            />
          </div>
        ))}
      </div>
    );
  };
}

export default Queue;
