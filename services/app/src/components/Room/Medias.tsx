import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
//
import { Cover } from "./Cover";
import { LoadingIcon } from "../Common/LoadingIcon";
import {
	Album,
	Playlist,
	Track,
	Media as MediaData,
	MediaType
} from "../../utils/medias";
import "./Medias.scss";

// ------------------------------------------------------------------

export const Media = React.memo(
	({
		actions,
		media,
		mediaType,
		playable,
		playing,
		onPlay,
		onStop
	}: {
		actions?: ReactNode;
		media: MediaData | null;
		mediaType: MediaType;
		playable: boolean;
		playing: boolean;
		onPlay: () => void;
		onStop: () => void;
	}) => {
		const { t } = useTranslation();
		if (!media) {
			return (
				<div className="Media">
					{actions}
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
				</div>
			);
		} else if (mediaType === "album") {
			const album = media as Album;
			return (
				<div className="Media Album">
					{actions}
					<Cover
						playable={playable}
						playing={playing}
						image={album.cover_small}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<div className="Meta AlbumTitle">
							<a
								href={album.link}
								target="_blank"
								rel="noopener noreferrer">
								{album.title}
							</a>
						</div>
						<div className="Meta AlbumArtist">
							<a
								href={album.artist.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: album.artist.name })}
							</a>
						</div>
					</div>
				</div>
			);
		} else if (mediaType === "playlist") {
			const playlist = media as Playlist;
			return (
				<div className="Media Playlist">
					{actions}
					<Cover
						playable={playable}
						playing={playing}
						image={playlist.picture_small}
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
								href={playlist.user.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: playlist.user.name })}
							</a>
						</div>
					</div>
				</div>
			);
		} else if (mediaType === "track") {
			const track = media as Track;
			return (
				<div className="Media Track">
					{actions}
					<Cover
						playable={playable && !!track.preview}
						playing={playing}
						image={track.album.cover_small}
						onPlay={onPlay}
						onStop={onStop}
					/>
					<div className="Metas">
						<div className="Meta TrackTitle">
							<a
								href={track.link}
								target="_blank"
								rel="noopener noreferrer">
								{track.title}
							</a>
						</div>
						<div className="Meta TrackArtist">
							<a
								href={track.artist.link}
								target="_blank"
								rel="noopener noreferrer">
								{t("medias.by", { artist: track.artist.name })}
							</a>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
);
