import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../../../components/Common/IconButton";
import { SeaBattleBoatData, AngleToDirection } from "../utils";
import { SeaBattleMovementIconMappings } from "../utils/mappings";

// ------------------------------------------------------------------

export const SeaBattlePlayerControls: FC<{
	boat?: SeaBattleBoatData;
	disabled?: boolean;
	onQueueMoveBackward: () => void;
	onQueueMoveForward: () => void;
	onRotateLeft: () => void;
	onRotateRight: () => void;
}> = ({
	boat,
	disabled = false,
	onQueueMoveBackward,
	onQueueMoveForward,
	onRotateLeft,
	onRotateRight
}) => {
	const { t } = useTranslation();

	return (
		<div className="SeaBattlePlayerControls SeaBattleControls">
			<IconButton
				disabled={disabled}
				icon="rotate-left"
				title={t("games.seabattle.turn_left")}
				onClick={onRotateLeft}
			/>
			<IconButton
				disabled={disabled}
				icon={
					boat
						? SeaBattleMovementIconMappings[
								AngleToDirection(boat.angle)
						  ].move_backward
						: "arrow-down"
				}
				title={t("games.seabattle.move_backward")}
				onClick={onQueueMoveBackward}
			/>
			<IconButton
				disabled={disabled}
				icon={
					boat
						? SeaBattleMovementIconMappings[
								AngleToDirection(boat.angle)
						  ].move_forward
						: "arrow-up"
				}
				title={t("games.seabattle.move_forward")}
				onClick={onQueueMoveForward}
			/>
			<IconButton
				disabled={disabled}
				icon="rotate-right"
				title={t("games.seabattle.turn_right")}
				onClick={onRotateRight}
			/>
		</div>
	);
};
