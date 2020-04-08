import React, { useEffect, useState } from "react";
//
import { QUEUE_PLAYER } from "../../utils/player";
import "./Progress.scss";

// ------------------------------------------------------------------

export const Progress = () => {
	const [value, setValue] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setValue(QUEUE_PLAYER.getPlayingTrackPercent());
		}, 250);
		return () => {
			clearInterval(timer);
		};
	}, [setValue]);

	return (
		<div className="Progress">
			<progress max={100} value={value * 100} />
		</div>
	);
};
