import React from "react";
import { useTranslation } from "react-i18next";
//
import { Media } from "./Medias";
import { IconButton } from "../Common/IconButton";
import { Track } from "../../utils/medias";

// ------------------------------------------------------------------

export const QueueItem = React.memo(
	({
		locked,
		track,
		playing,
		onPlay,
		onRemove,
		onStop
	}: {
		locked: boolean;
		track: Track | null; // if null : stiil loading or cannot be loaded or to reload later because of rate limit
		playing: boolean;
		onPlay: () => void;
		onRemove: () => void;
		onStop: () => void;
	}) => {
		const { t } = useTranslation();
		return (
			<div className="QueueItem">
				<Media
					media={track}
					playable={!!track && !locked}
					playing={playing}
					onPlay={onPlay}
					onStop={onStop}
					actions={
						<IconButton
							disabled={locked}
							title={t("medias.remove")}
							icon="trash"
							onClick={onRemove}
						/>
					}
				/>
			</div>
		);
	}
);
