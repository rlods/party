import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
//
import { Cover } from "./Cover";
import { LoadingIcon } from "../Common/LoadingIcon";
import { Media as MediaData } from "../../utils/medias";
import "./Medias.scss";

// ------------------------------------------------------------------

export const renderMediaInToaster = (media: MediaData): React.ReactNode => {
	return <Media media={media} playable={false} playing={true} />;
};

// ------------------------------------------------------------------

export const Media = React.memo(
	({
		actions,
		media,
		playable,
		playing,
		onPlay,
		onStop
	}: {
		actions?: ReactNode;
		media: MediaData | null;
		playable: boolean;
		playing: boolean;
		onPlay?: () => void;
		onStop?: () => void;
	}) => {
		const { t } = useTranslation();
		if (!media) {
			return (
				<div className="Media">
					<Cover
						playable={playable}
						playing={playing}
						image={""}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<LoadingIcon size="M" />
					</div>
					{actions ? <div className="Actions">{actions}</div> : null}
				</div>
			);
		}
		if (media.type === "album") {
			return (
				<div className="Media Album">
					<Cover
						playable={playable}
						playing={playing}
						image={media.picture_small}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<div className="Meta AlbumTitle">
							<a
								href={media.link}
								target="_blank"
								rel="noopener noreferrer">
								{media.title}
							</a>
						</div>
						<div className="Meta AlbumArtist">
							<a
								href={media.artist.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: media.artist.name })}
							</a>
						</div>
					</div>
					{actions ? <div className="Actions">{actions}</div> : null}
				</div>
			);
		}
		if (media.type === "playlist") {
			return (
				<div className="Media Playlist">
					<Cover
						playable={playable}
						playing={playing}
						image={media.picture_small}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<div className="Meta PlaylistTitle">
							<a
								href={media.link}
								target="_blank"
								rel="noopener noreferrer">
								{media.title}
							</a>
						</div>
						<div className="Meta PlaylistCreator">
							<a
								href={media.user.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: media.user.name })}
							</a>
						</div>
					</div>
					{actions ? <div className="Actions">{actions}</div> : null}
				</div>
			);
		}
		if (media.type === "track") {
			return (
				<div className="Media Track">
					<Cover
						playable={playable && !!media.preview}
						playing={playing}
						image={media.album.picture_small}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<div className="Meta TrackTitle">
							<a
								href={media.link}
								target="_blank"
								rel="noopener noreferrer">
								{media.title}
							</a>
						</div>
						<div className="Meta TrackArtist">
							<a
								href={media.artist.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: media.artist.name })}
							</a>
						</div>
					</div>
					{actions ? <div className="Actions">{actions}</div> : null}
				</div>
			);
		}
		return null;
	}
);
