import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { AudioPlayerControls } from "./AudioPlayerControls";
import { IconButton } from "../Common/IconButton";
import { Progress } from "./Progress";
import { QueueControls } from "./QueueControls";
import "./RoomControls.scss";

// ------------------------------------------------------------------

export const RoomControls: FC<{
	extended: boolean;
	onHelp?: () => void;
}> = ({ extended, onHelp }) => {
	const { t } = useTranslation();

	return (
		<div className="RoomControls">
			{extended ? (
				<div className="ControlsInner extended">
					<AudioPlayerControls bigPlayer={true} />
					<Progress />
					<QueueControls onHelp={onHelp} />
				</div>
			) : (
				<div className="ControlsInner compact">
					<div>
						<IconButton
							icon="question-circle"
							title={t("rooms.tutorial")}
							onClick={onHelp}
						/>
					</div>
					<AudioPlayerControls
						className="ControlsSet"
						bigPlayer={false}
					/>
					<div>
						<IconButton
							icon="diamond"
							title={t("...")}
							onClick={void 0 /* TODO */}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
