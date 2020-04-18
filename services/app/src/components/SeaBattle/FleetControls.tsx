import React from "react";
//
import { IconButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export const FleetControls = ({
	disabled,
	onMoveBackward,
	onMoveForward,
	onRotateLeft,
	onRotateRight
}: {
	disabled: boolean;
	onMoveBackward: () => void;
	onMoveForward: () => void;
	onRotateLeft: () => void;
	onRotateRight: () => void;
}) => {
	return (
		<div className="FleetControls">
			<IconButton
				disabled={disabled}
				icon="rotate-left"
				title="Rotate Left"
				onClick={onRotateLeft}
			/>
			<IconButton
				disabled={disabled}
				icon="arrow-up"
				title="Move Forward"
				onClick={onMoveForward}
			/>
			<IconButton
				disabled={disabled}
				icon="arrow-down"
				title="Move Backward"
				onClick={onMoveBackward}
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
