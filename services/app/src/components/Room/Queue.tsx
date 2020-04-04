import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Room/Queue";
import { Track } from "./Medias";
import IconButton from "../Common/IconButton";
import { LoadingIcon } from "../Common/Icon";
import "./Queue.scss";
import QueueItem from "./QueueItem";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps & WithTranslation> {
  public render = () => {
    const {
      loaded,
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
            <QueueItem
              key={index}
              locked={locked}
              playing={playing && trackIndex === index}
              track={track}
              onPlay={() => onPlay(index)}
              onRemove={() => onRemove(index)}
              onStop={onStop}
            />
          ))
        ) : (
          <div className="QueueEmpty">
            {loaded ? (
              <>
                <IconButton
                  title="..."
                  icon="shower"
                  onClick={onSearch}
                  size="L"
                />
                <span onClick={onSearch}>{t("rooms.empty")}</span>
              </>
            ) : (
              <>
                <LoadingIcon size="L" />
                <span>{t("rooms.loading")}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
}

export default withTranslation()(Queue);
