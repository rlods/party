import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Room/Controls";
import IconButton from "../Common/IconButton";
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
			onUnlock,
			tracksCount,
			locked,
			playing,
			t
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
				</div>
			</div>
		);
	};

	private onClear = () => {
		const { onClear, onConfirm, t } = this.props;
		onConfirm(t("rooms.confirm_clear"), onClear);
	};

	private onLock = () => {
		const { onConfirm, t } = this.props;
		onConfirm(t("rooms.confirm_lock"), this.props.onLock);
	};
}

export default withTranslation()(Controls);
