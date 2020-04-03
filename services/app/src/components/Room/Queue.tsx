import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Queue";
import { Track } from "./Medias";
import "./Queue.scss";
import IconButton from "../Common/IconButton";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps> {
  public render = () => {
    const {
      playing,
      playingPosition,
      tracks,
      onPlay,
      onRemove,
      onStop
    } = this.props;
    return (
      <div className="Queue">
        {tracks.map((track, index) => (
          <div className="QueueItem" key={track.id}>
            <Track
              track={track}
              playing={playing && playingPosition === index}
              onPlay={() => onPlay(index)}
              onStop={onStop}
              actions={
                <IconButton
                  title="Remove"
                  icon="trash"
                  onClick={() => onRemove(index)}
                />
              }
            />
          </div>
        ))}
      </div>
    );
  };
}

export default Queue;
