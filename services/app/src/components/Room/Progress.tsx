import React, { FC, useEffect, useState } from "react";
//
import { QUEUE_PLAYER } from "../../utils/player";
import "./Progress.scss";

// ------------------------------------------------------------------

export const Progress: FC = () => {
	const [value, setValue] = useState<number>(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setValue(QUEUE_PLAYER.getPlayingTrackPercent());
		}, 250);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div className="Progress">
			<progress max={100} value={value * 100} />
		</div>
	);
};
