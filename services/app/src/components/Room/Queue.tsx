import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Queue";
import { TrackMeta } from "./Metas";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps> {
  public render = () => {
    const { tracks, onPlay } = this.props;
    return (
      <div className="Queue">
        {tracks.map((track, index) => (
          <div className="QueueItem" key={track.id}>
            <img
              className="Cover"
              src={track.album.cover_small}
              alt="Cover"
              onClick={() => onPlay(index)}
            />
            <TrackMeta track={track} />
          </div>
        ))}
      </div>
    );
  };
}

export default Queue;
