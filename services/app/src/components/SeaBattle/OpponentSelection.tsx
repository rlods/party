import React from "react";
//
import { IconButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export const OpponentSelection = ({
	onSelectPreviousOpponent,
	onSelectNextOpponent
}: {
	onSelectPreviousOpponent?: () => void;
	onSelectNextOpponent?: () => void;
}) => (
	<div className="OpponentSelection">
		<IconButton
			disabled={true}
			icon="caret-left"
			title="Previous enemy"
			onClick={onSelectPreviousOpponent}
		/>
		<IconButton
			disabled={true}
			icon="caret-right"
			title="Next enemy"
			onClick={onSelectNextOpponent}
		/>
	</div>
);
