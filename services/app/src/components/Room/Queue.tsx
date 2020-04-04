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
      onSearch,
      onStop,
      t,
    } = this.props;
    return (
      <div className="Queue">
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
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
          ))
        ) : (
          <div className="QueueEmpty">
            <IconButton title="..." icon="shower" onClick={onSearch} size="L" />
            <span onClick={onSearch}>{t("rooms.empty")}</span>
          </div>
        )}
      </div>
    );
  };
}

export default withTranslation()(Queue);
