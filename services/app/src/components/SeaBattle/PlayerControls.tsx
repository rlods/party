import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../Common/IconButton";
import {
	SeaBattleBoatData,
	AngleToDirection
} from "../../utils/games/seabattle";
import { SeaBattleMovementIconMappings } from "../../utils/games/seabattle/mappings";

// ------------------------------------------------------------------

export const SeaBattlePlayerControls: FC<{
	boat?: SeaBattleBoatData;
	disabled?: boolean;
	onMoveBackward: () => void;
	onMoveForward: () => void;
	onRotateLeft: () => void;
	onRotateRight: () => void;
}> = ({
	boat,
	disabled = false,
	onMoveBackward,
	onMoveForward,
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
						  ].backward
						: "arrow-down"
				}
				title={t("games.seabattle.move_backward")}
				onClick={onMoveBackward}
			/>
			<IconButton
				disabled={disabled}
				icon={
					boat
						? SeaBattleMovementIconMappings[
								AngleToDirection(boat.angle)
						  ].forward
						: "arrow-up"
				}
				title={t("games.seabattle.move_forward")}
				onClick={onMoveForward}
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
