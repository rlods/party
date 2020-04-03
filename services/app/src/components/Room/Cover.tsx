import React from "react";
import classNames from "classnames";
//
import Icon from "../Common/Icon";
import "./Cover.scss";

export const Cover = ({
  playable,
  playing,
  image,
  onPlay,
  onStop
}: {
  image: string;
  onPlay: () => void;
  onStop: () => void;
  playable: boolean;
  playing: boolean;
}) => {
  if (playable) {
    return (
      <div
        className={classNames("Cover", { playing })}
        style={{ backgroundImage: `url('${image}')` }}
        onClick={!playing ? onPlay : onStop}
      >
        {!playing ? (
          <Icon icon="play" title="Play" />
        ) : (
          <Icon icon="pause" title="Stop" />
        )}
      </div>
    );
  } else {
    return (
      <div
        className={classNames("Cover", { playing })}
        style={{ backgroundImage: `url('${image}')` }}
      >
        {playing ? <Icon icon="music" title="Playing" /> : null}
      </div>
    );
  }
};
