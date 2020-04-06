import React from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
//
import { RootState } from "../../reducers";
import "./Progress.scss";

// ------------------------------------------------------------------

export const Progress = () => {
	const { playing, value } = useSelector<
		RootState,
		{ playing: boolean; value: number }
	>(state => ({
		playing: state.player.playing,
		value: state.player.track_percent
	}));
	return (
		<div className={classNames("Progress", { playing })}>
			<progress max={100} value={value * 100} />
		</div>
	);
};
