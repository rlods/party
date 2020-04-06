import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Room/Queue";
import IconButton from "../Common/IconButton";
import { LoadingIcon } from "../Common/Icon";
import QueueItem from "./QueueItem";
import "./Queue.scss";

// ------------------------------------------------------------------

class Queue extends Component<MappedProps & WithTranslation> {
	public render = () => {
		const {
			loaded,
			locked,
			medias,
			playing,
			playingIndex,
			onPlay,
			onRemove,
			onSearch,
			onStop,
			t
		} = this.props;
		return (
			<div className="Queue">
				{medias.length > 0 ? (
					medias.map((media, index) => (
						<QueueItem
							key={index}
							locked={locked}
							playing={playing && playingIndex === index}
							media={media}
							mediaType="track"
							onPlay={() => onPlay(index)}
							onRemove={() => onRemove(index)}
							onStop={onStop}
						/>
					))
				) : (
					<div className="QueueEmpty">
						{loaded ? (
							<>
								<IconButton
									title="..."
									icon="shower"
									onClick={onSearch}
									size="L"
								/>
								<span onClick={onSearch}>
									{t(
										locked
											? "rooms.empty_for_now"
											: "rooms.empty"
									)}
								</span>
							</>
						) : (
							<>
								<LoadingIcon size="L" />
								<span>{t("rooms.loading")}</span>
							</>
						)}
					</div>
				)}
			</div>
		);
	};
}

export default withTranslation()(Queue);
