import React, { useCallback } from "react";
//
import { IconButton } from "../Common/IconButton";
import {
	SeaBattleBoatData,
	SeaBattleMovementIconMappings
} from "../../utils/games/seabattle";
import { useSelector, useDispatch } from "react-redux";
import { moveToNextTrack } from "../../actions/queue";
import { Dispatch } from "../../actions";
import { useTranslation } from "react-i18next";
import { RootState } from "../../reducers";

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
	const { t } = useTranslation();
	const dispatch = useDispatch<Dispatch>();
	const tracksCount = useSelector<RootState, number>(
		state => state.room.medias.length
	);

	const nextTrack = useCallback(() => dispatch(moveToNextTrack()), [
		dispatch
	]);

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
				disabled={tracksCount === 0}
				icon="step-forward"
				onClick={nextTrack}
				size="M"
				title={t("player.forward")}
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
