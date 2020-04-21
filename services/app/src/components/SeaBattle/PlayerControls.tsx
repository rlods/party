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
				title={t("Rotate Left")}
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
				title={t("Move Backward")}
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
				title={t("Move Forward")}
				onClick={onMoveForward}
			/>
			<IconButton
				disabled={disabled}
				icon="rotate-right"
				title={t("Rotate Right")}
				onClick={onRotateRight}
			/>
		</div>
	);
};
