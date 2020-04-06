import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import IconButton from "../Common/IconButton";
import { MappedProps } from "../../containers/Room/Head";
import history from "../../utils/history";
import { copyToClipboard } from "../../utils/clipboard";
import "./Head.scss";

// ------------------------------------------------------------------

class Head extends Component<MappedProps & WithTranslation> {
	public render = () => {
		const { room, t } = this.props;
		return (
			<div className="Head">
				<div className="RoomLink">
					<IconButton
						icon="link"
						onClick={this.onCopyLink}
						size="M"
						title={t("rooms.copy_link")}
					/>
				</div>
				<div className="RoomName">{room ? room.name : ""}</div>
				<div className="RoomExit">
					<IconButton
						onClick={this.onExit}
						icon="sign-out"
						size="M"
						title={t("rooms.exit")}
					/>
				</div>
			</div>
		);
	};

	private onCopyLink = async () => {
		const { onMessage, t } = this.props;
		await copyToClipboard(document.location.href.split("?")[0]);
		onMessage(t("rooms.link_copied_to_clipboard"));
	};

	private onExit = () => {
		const { onConfirm, t } = this.props;
		onConfirm(t("rooms.confirm_exit"), () => {
			history.push("/");
		});
	};
}

export default withTranslation()(Head);
