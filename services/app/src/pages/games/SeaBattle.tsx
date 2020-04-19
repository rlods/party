import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { PlayerControls } from "../../components/SeaBattle/PlayerControls";
import { Map } from "../../components/SeaBattle/Map";
import { RootState } from "../../reducers";
import {
	extractBattleInfo,
	MAX_PLAYER_COUNT,
	SeaBattleMovementType,
	SeaBattlePosition
} from "../../utils/games/seabattle";
import { SeabattleKeyboardMoveMappings } from "../../utils/games/seabattle/mappings";
import { Dispatch } from "../../actions";
import { moveBoat, joinBattle } from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import { OpponentControls } from "../../components/SeaBattle/OpponentControls";
import { generateRandomPosition } from "../../utils/player";
import { selectTracksCount } from "../../selectors/medias";
import { IconButton } from "../../components/Common/IconButton";
import { setRoom } from "../../reducers/room";
import { RoomInfo } from "../../utils/rooms";
import "./SeaBattle.scss";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const [selectedBoatIndex, setSelectedBoat] = useState<number>(-1);
	const [selectedOpponentIndex, setSelectedOpponent] = useState<number>(0);

	const userId = useSelector<RootState, string>(
		state => state.user.access.id
	);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const extra = useSelector<RootState, string>(
		state => state.room.info?.extra || ""
	);

	const roomInfo = useSelector<RootState, RoomInfo | null>(
		state => state.room.info
	);

	const { battle, boat, opponent, opponents, player } = extractBattleInfo(
		extra,
		userId,
		selectedBoatIndex,
		selectedOpponentIndex
	);

	const onJoinBattle = useCallback(() => {
		dispatch(joinBattle());
	}, [dispatch]);

	const onPlayNext = useCallback(() => {
		if (!roomInfo || tracksCount === 0) {
			return;
		}
		dispatch(
			setRoom({
				info: {
					...roomInfo,
					queue_position: generateRandomPosition() % tracksCount
				}
			})
		);
	}, [dispatch, roomInfo, tracksCount]);

	const onMove = useCallback(
		(movement: SeaBattleMovementType) => {
			dispatch(
				moveBoat({
					boatIndex: selectedBoatIndex,
					movement
				})
			);
		},
		[dispatch, selectedBoatIndex]
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (
				!battle ||
				e.repeat ||
				(e.keyCode !== KEY_UP &&
					e.keyCode !== KEY_DOWN &&
					e.keyCode !== KEY_LEFT &&
					e.keyCode !== KEY_RIGHT)
			) {
				return;
			}
			e.preventDefault(); // to prevent scrolling with keyboard
			if (!player || !boat) {
				return;
			}
			onMove(SeabattleKeyboardMoveMappings[boat.direction][e.keyCode]);
		},
		[onMove, battle, player, boat]
	);

	const onOpponentCellClick = useCallback((position: SeaBattlePosition) => {
		// console.debug("XXX", position);
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

	return (
		<div className="SeaBattle">
			<div className="SeaBattlePlayer current">
				<PlayerControls
					boat={boat}
					disabled={!boat}
					onPlayNext={onPlayNext}
					onMoveForward={() => onMove("move-forward")}
					onMoveBackward={() => onMove("move-backward")}
					onRotateLeft={() => onMove("rotate-left")}
					onRotateRight={() => onMove("rotate-right")}
				/>
				{player ? (
					<Map
						player={player}
						selectedBoat={boat}
						setSelectedBoat={setSelectedBoat}
					/>
				) : (
					<div className="SeaBattleJoin">
						{opponents && opponents.length >= MAX_PLAYER_COUNT ? (
							<span>{t("games.max_players_count")}</span>
						) : (
							<>
								<span>{t("games.watch_or_join")}</span>
								<IconButton
									icon="sign-in"
									title={t("games.seabattle.join_battle")}
									size="L"
									displayTitle={true}
									onClick={onJoinBattle}
								/>
							</>
						)}
					</div>
				)}
			</div>
			<div className="SeaBattlePlayer other">
				<OpponentControls
					disabled={!opponent}
					opponentsCount={opponents?.length || 0}
					opponentIndex={selectedOpponentIndex}
					onSelectPreviousOpponent={
						opponents && opponents.length > 0
							? () =>
									setSelectedOpponent(
										selectedOpponentIndex === 0
											? opponents.length - 1
											: selectedOpponentIndex - 1
									)
							: void 0
					}
					onSelectNextOpponent={
						opponents && opponents.length > 0
							? () =>
									setSelectedOpponent(
										(selectedOpponentIndex + 1) %
											opponents?.length
									)
							: void 0
					}
				/>
				<Map
					player={opponent}
					hideActiveFleet={true}
					onCellClick={onOpponentCellClick}
				/>
			</div>
		</div>
	);
};
