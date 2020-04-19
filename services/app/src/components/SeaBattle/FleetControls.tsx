import React from "react";
//
import { IconButton } from "../Common/IconButton";
import {
	SeaBattleBoatData,
	SeaBattleMovementIconMappings
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const FleetControls = ({
	boat,
	disabled = false,
	onMoveBackward,
	onMoveForward,
	onRotateLeft,
	onRotateRight
}: {
	boat?: SeaBattleBoatData;
	disabled?: boolean;
	onMoveBackward: () => void;
	onMoveForward: () => void;
	onRotateLeft: () => void;
	onRotateRight: () => void;
}) => {
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
