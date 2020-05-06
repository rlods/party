import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../../../components/Common/IconButton";
import {
	SeaBattleBoatData,
	AngleToDirection,
	SeaBattleMovementType
} from "../utils";
import { SeaBattleMovementIconMappings } from "../utils/mappings";

// ------------------------------------------------------------------

export const SeaBattlePlayerControls: FC<{
	boat?: SeaBattleBoatData;
	disabled?: boolean;
	onMove: (type: SeaBattleMovementType) => void;
}> = ({ boat, disabled = false, onMove }) => {
	const { t } = useTranslation();

	return (
		<div className="SeaBattlePlayerControls SeaBattleControls">
			<IconButton
				disabled={disabled}
				icon="rotate-left"
				title={t("games.seabattle.turn_left")}
				onClick={() => onMove("rotate_left")}
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
				onClick={() => onMove("move_backward")}
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
				onClick={() => onMove("move_forward")}
			/>
			<IconButton
				disabled={disabled}
				icon="rotate-right"
				title={t("games.seabattle.turn_right")}
				onClick={() => onMove("rotate_right")}
			/>
		</div>
	);
};
