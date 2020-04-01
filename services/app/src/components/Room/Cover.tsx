import React from "react";
import classNames from "classnames";
//
import Icon from "../Common/Icon";
import "./Cover.scss";

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
