import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { FleetControls } from "../../components/SeaBattle/FleetControls";
import { Map } from "../../components/SeaBattle/Map";
import { BattleAssets } from "../../components/SeaBattle/BattleAssets";
import { RootState } from "../../reducers";
import {
	SeaBattlePlayerData,
	GRID_CELL_UNIT_SIZE
} from "../../utils/games/seabattle";
import { Dispatch } from "../../actions";
import { moveBoat } from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import "./SeaBattle.scss";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const [selectedBoat1, setSelectedBoat1] = useState<number>(-1);
	const [selectedBoat2, setSelectedBoat2] = useState<number>(-1);

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
			if (e.repeat) {
				return;
			}
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
			<FleetControls
				disabled={selectedBoats[activePlayer] < 0}
				onMoveForward={moveForward}
				onMoveBackward={moveBackward}
				onRotateLeft={rotateLeft}
				onRotateRight={rotateRight}
			/>
			<svg viewBox="0 0 920 480">
				<BattleAssets />
				<>
					{players.map((player, index) => (
						<Map
							key={index}
							data={player}
							position={{
								x: GRID_CELL_UNIT_SIZE + 440 * index,
								y: GRID_CELL_UNIT_SIZE
							}}
							selectedBoat={selectedBoats[index]}
							setSelectedBoat={setSelectedBoats[index]}
						/>
					))}
				</>
			</svg>
		</div>
	);
};
