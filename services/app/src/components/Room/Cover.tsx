import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";
//
import { Icon } from "../Common/Icon";
import "./Cover.scss";

// ------------------------------------------------------------------

type Props = {
	image: string;
	onPlay: () => void;
	onStop: () => void;
	playable: boolean;
	playing: boolean;
};

class Cover extends Component<Props & WithTranslation> {
	public render = () => {
		const { playable, playing, image, onPlay, onStop, t } = this.props;
		if (playable) {
			return (
				<div
					className={classNames("Cover", { playable, playing })}
					style={image ? { backgroundImage: `url('${image}')` } : {}}
					onClick={!playing ? onPlay : onStop}>
					{!playing ? (
						<Icon icon="play" title={t("player.play")} />
					) : (
						<Icon icon="pause" title={t("player.stop")} />
					)}
				</div>
			);
		} else {
			return (
				<div
					className={classNames("Cover", { playing })}
					style={image ? { backgroundImage: `url('${image}')` } : {}}>
					{playing ? (
						<Icon icon="music" title={t("player.playing")} />
					) : null}
				</div>
			);
		}
	};
}

export default withTranslation()(Cover);
