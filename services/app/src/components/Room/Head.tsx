import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/Room/Head";
import { copyToClipboard } from "../../utils/clipboard";
import "./Head.scss";

// ------------------------------------------------------------------

class Head extends Component<MappedProps & WithTranslation> {
  public render = () => {
    const { locked, room, onUnlock, t } = this.props;
    return (
      <div className="Head">
        <div className="RoomStatus">
          {locked ? (
            <IconButton
              icon="lock"
              onClick={onUnlock}
              size="M"
              title={t("rooms.locked")}
            />
          ) : (
            <IconButton
              icon="unlock"
              onClick={this.onLock}
              size="M"
              title={t("rooms.unlocked")}
            />
          )}
        </div>
        <div className="RoomName">{room ? room.name : ""}</div>
        <div className="RoomLink">
          <IconButton
            icon="link"
            onClick={this.onCopyLink}
            size="M"
            title={t("rooms.copy_link")}
          />
        </div>
      </div>
    );
  };

  private onCopyLink = async () => {
    const { t } = this.props;
    await copyToClipboard(document.location.href.split("?")[0]);
    this.props.onMessage(t("rooms.link_copied_to_clipboard"));
  };

  private onLock = () => {
    const { t } = this.props;
    if (window.confirm(t("rooms.confirm_lock"))) {
      this.props.onLock();
    }
  };
}

export default withTranslation()(Head);
