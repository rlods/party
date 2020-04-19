import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { FleetControls } from "../../components/SeaBattle/FleetControls";
import { Map } from "../../components/SeaBattle/Map";
import { RootState } from "../../reducers";
import { SeaBattlePlayerData } from "../../utils/games/seabattle";
import { Dispatch } from "../../actions";
import { moveBoat } from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import { WeaponControls } from "../../components/SeaBattle/WeaponsControls";
import { startPlayer } from "../../actions/player";
import { setQueuePosition } from "../../actions/queue";
import { generateRandomPosition } from "../../utils/player";
import "./SeaBattle.scss";
import { selectTracksCount } from "../../selectors/medias";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const [selectedBoat1, setSelectedBoat1] = useState<number>(-1);
	const [selectedBoat2, setSelectedBoat2] = useState<number>(-1);

	const queueReady = useSelector<RootState, boolean>(
		state => !!state.room.info
	);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const player1 = useSelector<RootState, SeaBattlePlayerData>(
		state => state.games.seabattle.players.player1
	);
	const player2 = useSelector<RootState, SeaBattlePlayerData>(
		state => state.games.seabattle.players.player2
	);

	const players: SeaBattlePlayerData[] = [player1, player2];
	const selectedBoats: number[] = [selectedBoat1, selectedBoat2];
	const setSelectedBoats: Array<(index: number) => void> = [
		setSelectedBoat1,
		setSelectedBoat2
	];
	const activePlayer = 0;

	useEffect(() => {
		if (queueReady && tracksCount > 0) {
			const x = generateRandomPosition() % tracksCount;
			dispatch(setQueuePosition(x));
			dispatch(startPlayer());
		}
	}, [dispatch, queueReady, tracksCount]);

	const moveForward = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoats[activePlayer],
				playerId: "player1",
				movement: "move-forward"
			})
		);
	}, [dispatch, selectedBoats]);

	const moveBackward = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoats[activePlayer],
				playerId: "player1",
				movement: "move-backward"
			})
		);
	}, [dispatch, selectedBoats]);

	const rotateLeft = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoats[activePlayer],
				playerId: "player1",
				movement: "rotate-left"
			})
		);
	}, [dispatch, selectedBoats]);

	const rotateRight = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoats[activePlayer],
				playerId: "player1",
				movement: "rotate-right"
			})
		);
	}, [dispatch, selectedBoats]);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (
				e.repeat ||
				(e.keyCode !== KEY_UP &&
					e.keyCode !== KEY_DOWN &&
					e.keyCode !== KEY_LEFT &&
					e.keyCode !== KEY_RIGHT)
			) {
				return;
			}
			e.preventDefault(); // to prevent scrolling with keyboard
			const player = players[activePlayer];
			if (!player) {
				return;
			}
			const selectedBoatIndex = selectedBoats[activePlayer];
			if (selectedBoatIndex < 0) {
				return;
			}
			const selectedBoat = player.fleet[selectedBoatIndex];
			const MoveMappings: {
				[direction: string]: { [key: string]: () => void };
			} = {
				N: {
					[KEY_UP]: moveForward,
					[KEY_DOWN]: moveBackward,
					[KEY_LEFT]: rotateLeft,
					[KEY_RIGHT]: rotateRight
				},
				E: {
					[KEY_UP]: rotateLeft,
					[KEY_DOWN]: rotateRight,
					[KEY_LEFT]: moveBackward,
					[KEY_RIGHT]: moveForward
				},
				S: {
					[KEY_UP]: moveBackward,
					[KEY_DOWN]: moveForward,
					[KEY_LEFT]: rotateRight,
					[KEY_RIGHT]: rotateLeft
				},
				W: {
					[KEY_UP]: rotateRight,
					[KEY_DOWN]: rotateLeft,
					[KEY_LEFT]: moveForward,
					[KEY_RIGHT]: moveBackward
				}
			};
			const move = MoveMappings[selectedBoat.direction][e.keyCode];
			if (move) {
				move();
			}
		},
		[
			moveForward,
			moveBackward,
			rotateLeft,
			rotateRight,
			players,
			selectedBoats
		]
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
				<FleetControls
					boat={
						selectedBoats[activePlayer] >= 0
							? players[activePlayer].fleet[
									selectedBoats[activePlayer]
							  ]
							: void 0
					}
					disabled={selectedBoats[activePlayer] < 0}
					onMoveForward={moveForward}
					onMoveBackward={moveBackward}
					onRotateLeft={rotateLeft}
					onRotateRight={rotateRight}
				/>
				<Map
					player={players[0]}
					selectedBoat={selectedBoats[0]}
					setSelectedBoat={setSelectedBoats[0]}
				/>
			</div>
			<div className="SeaBattlePlayer other">
				<WeaponControls disabled={selectedBoats[activePlayer] < 0} />
				<Map player={players[1]} hideFleet={true} />
			</div>
		</div>
	);
};
