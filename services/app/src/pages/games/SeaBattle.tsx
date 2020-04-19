import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { FleetControls } from "../../components/SeaBattle/FleetControls";
import { Map } from "../../components/SeaBattle/Map";
import { RootState } from "../../reducers";
import {
	SeaBattleData,
	SeaBattlePlayerData,
	SeaBattleBoatData
} from "../../utils/games/seabattle";
import { Dispatch } from "../../actions";
import { moveBoat } from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import { WeaponControls } from "../../components/SeaBattle/WeaponsControls";
import { startPlayer } from "../../actions/player";
import { setQueuePosition } from "../../actions/queue";
import { generateRandomPosition } from "../../utils/player";
import { selectTracksCount } from "../../selectors/medias";
import { decode } from "../../utils/encoder";
import "./SeaBattle.scss";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const [selectedBoatIndex, setSelectedBoat] = useState<number>(-1);

	const queueReady = useSelector<RootState, boolean>(
		state => !!state.room.info
	);

	const playerId = useSelector<RootState, string | undefined>(
		state => state.user.access.id
	);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const extra = useSelector<RootState, string | undefined>(
		state => state.room.info?.extra
	);

	let battle: SeaBattleData | undefined = void 0;
	let player: SeaBattlePlayerData | undefined = void 0;
	let boat: SeaBattleBoatData | undefined = void 0;

	if (extra) {
		battle = decode<SeaBattleData>(extra);
		if (playerId) {
			player = battle.players[playerId];
			if (
				selectedBoatIndex >= 0 &&
				selectedBoatIndex < player.fleet.length
			) {
				boat = player.fleet[selectedBoatIndex];
			}
		}
	}

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
				boatIndex: selectedBoatIndex,
				movement: "move-forward"
			})
		);
	}, [dispatch, selectedBoatIndex]);

	const moveBackward = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoatIndex,
				movement: "move-backward"
			})
		);
	}, [dispatch, selectedBoatIndex]);

	const rotateLeft = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoatIndex,
				movement: "rotate-left"
			})
		);
	}, [dispatch, selectedBoatIndex]);

	const rotateRight = useCallback(() => {
		dispatch(
			moveBoat({
				boatIndex: selectedBoatIndex,
				movement: "rotate-right"
			})
		);
	}, [dispatch, selectedBoatIndex]);

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
			const move = MoveMappings[boat.direction][e.keyCode];
			if (move) {
				move();
			}
		},
		[
			moveForward,
			moveBackward,
			rotateLeft,
			rotateRight,
			battle,
			player,
			boat
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
					boat={boat}
					disabled={!boat}
					onMoveForward={moveForward}
					onMoveBackward={moveBackward}
					onRotateLeft={rotateLeft}
					onRotateRight={rotateRight}
				/>
				<Map
					player={player}
					selectedBoat={boat}
					setSelectedBoat={setSelectedBoat}
				/>
			</div>
			<div className="SeaBattlePlayer other">
				<WeaponControls disabled={!battle} />
				<Map
					player={battle?.players["player2"]}
					hideActiveFleet={true}
				/>
			</div>
		</div>
	);
};
