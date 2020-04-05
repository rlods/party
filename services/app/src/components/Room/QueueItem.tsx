import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { Track } from "./Medias";
import IconButton from "../Common/IconButton";
import { ApiTrack } from "../../utils/deezer";

// ------------------------------------------------------------------

type Props = {
  locked: boolean;
  playing: boolean;
  track: ApiTrack;
  onPlay: () => void;
  onRemove: () => void;
  onStop: () => void;
};

class QueueItem extends Component<Props & WithTranslation> {
  public render = () => {
    const { locked, playing, track, onPlay, onRemove, onStop, t } = this.props;
    return (
      <div className="QueueItem">
        <Track
          track={track}
          playable={!locked}
          playing={playing}
          onPlay={onPlay}
          onStop={onStop}
          actions={
            !locked ? (
              <IconButton
                title={t("medias.remove")}
                icon="trash"
                onClick={onRemove}
              />
            ) : null
          }
        />
      </div>
    );
  };
}

export default withTranslation()(QueueItem);