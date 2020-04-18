import React from "react";
//
import { IconButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export const FleetControls = ({
	disabled,
	onMoveLeft,
	onMoveUp,
	onMoveDown,
	onMoveRight,
	onRotateLeft,
	onRotateRight
}: {
	disabled: boolean;
	onMoveLeft: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onMoveRight: () => void;
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
				icon="arrow-left"
				title="Move Left"
				onClick={onMoveLeft}
			/>
			<IconButton
				disabled={disabled}
				icon="arrow-up"
				title="Move Up"
				onClick={onMoveUp}
			/>
			<IconButton
				disabled={disabled}
				icon="arrow-down"
				title="Move Down"
				onClick={onMoveDown}
			/>
			<IconButton
				disabled={disabled}
				icon="arrow-right"
				title="Move Right"
				onClick={onMoveRight}
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
