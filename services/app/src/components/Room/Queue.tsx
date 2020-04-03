import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Queue";
import { Track } from "./Medias";
import IconButton from "../Common/IconButton";
import "./Queue.scss";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps> {
  public render = () => {
    const {
      locked,
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
                !locked ? (
                  <IconButton
                    title="Remove"
                    icon="trash"
                    onClick={() => onRemove(index)}
                  />
                ) : null
              }
            />
          </div>
        ))}
      </div>
    );
  };
}

export default Queue;
