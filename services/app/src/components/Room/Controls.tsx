import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Room/Controls";
import IconButton from "../Common/IconButton";
import history from "../../utils/history";
import Progress from "../../containers/Room/Progress";
import "./Controls.scss";

// ------------------------------------------------------------------

class Controls extends Component<MappedProps & WithTranslation> {
  public render = () => {
    const {
      onMoveBackward,
      onMoveForward,
      onPlay,
      onSearch,
      onStop,
      tracksCount,
      locked,
      playing,
      t,
    } = this.props;
    return (
      <div className="Controls">
        <div className="ControlsSet">
          <div className="Control">
            <IconButton
              disabled={locked || tracksCount === 0}
              icon="step-backward"
              onClick={onMoveBackward}
              size="M"
              title={t("player.backward")}
            />
          </div>
          <div className="Control">
            {!playing ? (
              <IconButton
                disabled={locked || tracksCount === 0}
                onClick={onPlay}
                icon="play"
                size="L"
                title={t("player.play")}
              />
            ) : (
              <IconButton
                disabled={locked || tracksCount === 0}
                onClick={onStop}
                icon="pause"
                title={t("player.stop")}
                size="L"
              />
            )}
          </div>
          <div className="Control">
            <IconButton
              disabled={locked || tracksCount === 0}
              icon="step-forward"
              onClick={onMoveForward}
              size="M"
              title={t("player.forward")}
            />
          </div>
        </div>
        <Progress />
        <div className="ControlsSet">
          <div className="Control">
            <IconButton
              disabled={locked || tracksCount === 0}
              onClick={this.onClear}
              icon="trash"
              title={t("rooms.clear")}
            />
          </div>
          <div className="Control">
            <IconButton
              onClick={onSearch}
              icon="search"
              title={t("medias.search")}
            />
          </div>
          <div className="Control">
            <IconButton
              onClick={this.onExit}
              icon="sign-out"
              title={t("rooms.exit")}
            />
          </div>
        </div>
      </div>
    );
  };

  onClear = () => {
    const { onConfirm, t } = this.props;
    onConfirm(t("rooms.confirm_clear"), this.props.onClear);
  };

  onExit = () => {
    const { onConfirm, t } = this.props;
    onConfirm(t("rooms.confirm_exit"), () => {
      history.push("/");
    });
  };
}

export default withTranslation()(Controls);
