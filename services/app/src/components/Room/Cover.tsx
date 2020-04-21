import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { Icon } from "../Common/Icon";
import "./Cover.scss";

// ------------------------------------------------------------------

export const Cover: FC<{
	image: string;
	onPlay?: () => void;
	onStop?: () => void;
	playable: boolean;
	playing: boolean;
}> = React.memo(({ playable, playing, image, onPlay, onStop }) => {
	const { t } = useTranslation();
	if (playable) {
		return (
			<div
				className={classNames("Cover", { playable, playing })}
				style={image ? { backgroundImage: `url('${image}')` } : {}}
				onClick={!playing ? onPlay : onStop}>
				{!playing ? (
					<Icon icon="play" size="S" title={t("player.play")} />
				) : (
					<Icon icon="pause" size="S" title={t("player.stop")} />
				)}
			</div>
		);
	} else {
		return (
			<div
				className={classNames("Cover", { playing })}
				style={image ? { backgroundImage: `url('${image}')` } : {}}>
				{playing ? (
					<Icon icon="music" size="S" title={t("player.playing")} />
				) : null}
			</div>
		);
	}
});
