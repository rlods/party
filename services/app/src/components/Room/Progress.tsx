import React from "react";
import { useSelector } from "react-redux";
//
import { RootState } from "../../reducers";
import "./Progress.scss";

// ------------------------------------------------------------------

export const Progress = () => {
	const value = useSelector<RootState, number>(
		state => state.player.track_percent
	);
	return (
		<div className="Progress">
			<progress max={100} value={value * 100} />
		</div>
	);
};
