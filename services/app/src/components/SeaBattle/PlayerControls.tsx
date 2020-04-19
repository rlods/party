import React from "react";
//
import { IconButton } from "../Common/IconButton";
import {
	SeaBattleBoatData,
	SeaBattleMovementIconMappings
} from "../../utils/games/seabattle";
import { useTranslation } from "react-i18next";

// ------------------------------------------------------------------

export const PlayerControls = ({
	boat,
	disabled = false,
	onPlayNext,
	onMoveBackward,
	onMoveForward,
	onRotateLeft,
	onRotateRight
}: {
	boat?: SeaBattleBoatData;
	disabled?: boolean;
	onPlayNext?: () => void;
	onMoveBackward: () => void;
	onMoveForward: () => void;
	onRotateLeft: () => void;
	onRotateRight: () => void;
}) => {
	const { t } = useTranslation();

	return (
		<div className="SeaBattleControls">
			<IconButton
				disabled={disabled}
				icon="rotate-left"
				title="Rotate Left"
				onClick={onRotateLeft}
			/>
			<IconButton
				disabled={disabled}
				icon={
					boat?.direction
						? SeaBattleMovementIconMappings[boat.direction].backward
						: "arrow-down"
				}
				title="Move Backward"
				onClick={onMoveBackward}
			/>
			<IconButton
				icon="step-forward"
				onClick={onPlayNext}
				size="M"
				title={t("player.forward")}
			/>
			<IconButton
				disabled={disabled}
				icon={
					boat?.direction
						? SeaBattleMovementIconMappings[boat.direction].forward
						: "arrow-up"
				}
				title="Move Forward"
				onClick={onMoveForward}
			/>
			<IconButton
				disabled={disabled}
				icon="rotate-right"
				title="Rotate Right"
				onClick={onRotateRight}
			/>
		</div>
	);
};
