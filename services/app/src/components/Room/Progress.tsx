import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
//
import { QUEUE_PLAYER } from "../../utils/player";
import { RootState } from "../../reducers";
import { isRoomPlaying } from "../../selectors/queue";
import "./Progress.scss";

// ------------------------------------------------------------------

export const Progress: FC = () => {
	const [value, setValue] = useState<number>(0);
	const playing = useSelector<RootState, boolean>(isRoomPlaying);

	useEffect(() => {
		let timer: number = 0;

		if (playing) {
			const step = () => {
				setValue(
					Math.floor(QUEUE_PLAYER.getPlayingTrackPercent() * 1000)
				);
				timer = requestAnimationFrame(step);
			};
			timer = requestAnimationFrame(step);
		}

		return () => {
			cancelAnimationFrame(timer);
		};
	}, [playing]);

	return (
		<div className="Progress">
			<progress max={1000} value={value} />
		</div>
	);
};
