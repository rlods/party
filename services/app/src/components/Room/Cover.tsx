import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { Icon } from "../Common/Icon";
import "./Cover.scss";

// ------------------------------------------------------------------

export const Cover = React.memo(
	({
		playable,
		playing,
		image,
		onPlay,
		onStop
	}: {
		image: string;
		onPlay: () => void;
		onStop: () => void;
		playable: boolean;
		playing: boolean;
	}) => {
		const { t } = useTranslation();
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
	}
);
