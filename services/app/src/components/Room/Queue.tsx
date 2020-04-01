import React, { Component } from "react";
//
import { MappedProps } from "../../containers/Room/Queue";
import { TrackMeta } from "./Metas";
import { Cover } from "./Cover";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps> {
  public render = () => {
    const { playing, playingPosition, tracks, onPlay, onStop } = this.props;
    return (
      <div className="Queue">
        {tracks.map((track, index) => (
          <div className="QueueItem" key={track.id}>
            <Cover
              image={track.album.cover_small}
              playing={playing && playingPosition === index}
              onPlay={() => onPlay(index)}
              onStop={onStop}
            />
            <TrackMeta track={track} />
          </div>
        ))}
      </div>
    );
  };
}

export default Queue;
