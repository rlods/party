import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Room/Queue";
import { Track } from "./Medias";
import IconButton from "../Common/IconButton";
import "./Queue.scss";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps & WithTranslation> {
  public render = () => {
    const {
      locked,
      playing,
      trackIndex,
      tracks,
      onPlay,
      onRemove,
      onStop,
      t,
    } = this.props;
    return (
      <div className="Queue">
        {tracks.map((track, index) => (
          <div className="QueueItem" key={index}>
            <Track
              track={track}
              playable={!locked}
              playing={playing && trackIndex === index}
              onPlay={() => onPlay(index)}
              onStop={onStop}
              actions={
                !locked ? (
                  <IconButton
                    title={t("medias.remove")}
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

export default withTranslation()(Queue);
