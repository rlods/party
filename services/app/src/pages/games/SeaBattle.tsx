import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { PlayerControls } from "../../components/SeaBattle/PlayerControls";
import { Map } from "../../components/SeaBattle/Map";
import { RootState } from "../../reducers";
import {
	extractBattleInfo,
	MAX_PLAYER_COUNT,
	SeaBattleMovementType
} from "../../utils/games/seabattle";
import { Dispatch } from "../../actions";
import { moveBoat, joinBattle } from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import { OpponentControls } from "../../components/SeaBattle/OpponentControls";
import { startPlayer } from "../../actions/player";
import { setQueuePosition } from "../../actions/queue";
import { generateRandomPosition } from "../../utils/player";
import { selectTracksCount } from "../../selectors/medias";
import { IconButton } from "../../components/Common/IconButton";
import { useTranslation } from "react-i18next";
import "./SeaBattle.scss";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const [selectedBoatIndex, setSelectedBoat] = useState<number>(-1);
	const [selectedOpponentIndex, setSelectedOpponent] = useState<number>(0);

	const queueReady = useSelector<RootState, boolean>(
		state => !!state.room.info
	);

	const userId = useSelector<RootState, string>(
		state => state.user.access.id
	);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const extra = useSelector<RootState, string>(
		state => state.room.info?.extra || ""
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

	useEffect(() => {
		if (queueReady && tracksCount > 0) {
			dispatch(setQueuePosition(generateRandomPosition() % tracksCount));
			dispatch(startPlayer());
		}
	}, [dispatch, queueReady, tracksCount]);

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
			const MoveMappings: {
				[direction: string]: { [key: string]: SeaBattleMovementType };
			} = {
				N: {
					[KEY_UP]: "move-forward",
					[KEY_DOWN]: "move-backward",
					[KEY_LEFT]: "rotate-left",
					[KEY_RIGHT]: "rotate-right"
				},
				E: {
					[KEY_UP]: "rotate-left",
					[KEY_DOWN]: "rotate-right",
					[KEY_LEFT]: "move-backward",
					[KEY_RIGHT]: "move-forward"
				},
				S: {
					[KEY_UP]: "move-backward",
					[KEY_DOWN]: "move-forward",
					[KEY_LEFT]: "rotate-right",
					[KEY_RIGHT]: "rotate-left"
				},
				W: {
					[KEY_UP]: "rotate-right",
					[KEY_DOWN]: "rotate-left",
					[KEY_LEFT]: "move-forward",
					[KEY_RIGHT]: "move-backward"
				}
			};
			onMove(MoveMappings[boat.direction][e.keyCode]);
		},
		[onMove, battle, player, boat]
	);

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
				<Map player={opponent} hideActiveFleet={true} />
			</div>
		</div>
	);
};
