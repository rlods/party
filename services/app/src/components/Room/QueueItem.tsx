import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import Media from "./Medias";
import IconButton from "../Common/IconButton";
import { Media as MediaData, MediaType } from "../../utils/medias";

// ------------------------------------------------------------------

type Props = {
	locked: boolean;
	media: MediaData | null; // if null : stiil loading or cannot be loaded or to reload later because of rate limit
	mediaType: MediaType;
	playing: boolean;
	onPlay: () => void;
	onRemove: () => void;
	onStop: () => void;
};

class QueueItem extends Component<Props & WithTranslation> {
	public render = () => {
		const {
			locked,
			media,
			mediaType,
			playing,
			onPlay,
			onRemove,
			onStop,
			t
		} = this.props;
		return (
			<div className="QueueItem">
				<Media
					media={media}
					mediaType={mediaType}
					playable={!!media && !locked}
					playing={playing}
					onPlay={onPlay}
					onStop={onStop}
					actions={
						!locked ? (
							<IconButton
								title={t("medias.remove")}
								icon="trash"
								onClick={onRemove}
							/>
						) : null
					}
				/>
			</div>
		);
	};
}

export default withTranslation()(QueueItem);
