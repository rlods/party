import React from "react";
//
import IconButton from "../Common/IconButton";

export const Cover = ({
  playing,
  image,
  onPlay,
  onStop
}: {
  image: string;
  onPlay: () => void;
  onStop: () => void;
  playing: boolean;
}) => (
  <div className="Cover" style={{ backgroundImage: `url('${image}')` }}>
    {!playing ? (
      <IconButton icon="play" title="Play" onClick={() => onPlay()} />
    ) : (
      <IconButton icon="pause" title="Stop" onClick={() => onStop()} />
    )}
  </div>
);
