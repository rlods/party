import React from "react";
//
import { IconButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export const WeaponControls = ({
	disabled = false
}: {
	disabled?: boolean;
}) => {
	return (
		<div className="SeaBattleControls SeaBattleWeaponControls">
			<IconButton
				disabled={true}
				icon="caret-up"
				title="Previous enemy"
				onClick={() => {}}
			/>
			<IconButton
				disabled={true}
				icon="caret-down"
				title="Next enemy"
				onClick={() => {}}
			/>
		</div>
	);
};
