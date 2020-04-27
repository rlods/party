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
	propagate: boolean;
	onHelp?: () => void;
}> = ({ extended, propagate, onHelp }) => {
	const { t } = useTranslation();

	return (
		<div className="RoomControls">
			{extended ? (
				<div className="ControlsInner extended">
					<AudioPlayerControls
						propagate={propagate}
						bigPlayer={true}
					/>
					<Progress />
					<QueueControls propagate={propagate} onHelp={onHelp} />
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
						propagate={propagate}
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
