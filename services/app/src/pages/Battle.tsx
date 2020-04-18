import React, { useState } from "react";
//
import { FleetControls } from "../components/Battle/FleetControls";
import { Map } from "../components/Battle/Map";
import { BattleAssets } from "../components/Battle/BattleAssets";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducers";
import { SeaBattlePlayerData } from "../utils/games/seabattle";
import { Dispatch } from "../actions";
import "./Battle.scss";
import { moveBoat } from "../actions/games/seabattle";

// ------------------------------------------------------------------

export const Battle = () => {
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
	const selectedBoat: number[] = [selectedBoat1, selectedBoat2];
	const setSelectedBoat: Array<(index: number) => void> = [
		setSelectedBoat1,
		setSelectedBoat2
	];

	return (
		<div className="Battle">
			<FleetControls
				disabled={selectedBoat1 < 0}
				onMoveForward={() => {
					dispatch(
						moveBoat({
							boatIndex: selectedBoat1,
							playerId: "player1",
							movement: "move-forward"
						})
					);
				}}
				onMoveBackward={() => {
					dispatch(
						moveBoat({
							boatIndex: selectedBoat1,
							playerId: "player1",
							movement: "move-backward"
						})
					);
				}}
				onRotateLeft={() => {
					dispatch(
						moveBoat({
							boatIndex: selectedBoat1,
							playerId: "player1",
							movement: "rotate-left"
						})
					);
				}}
				onRotateRight={() => {
					dispatch(
						moveBoat({
							boatIndex: selectedBoat1,
							playerId: "player1",
							movement: "rotate-right"
						})
					);
				}}
			/>
			<svg viewBox="0 0 920 480">
				<BattleAssets />
				<>
					{players.map((player, index) => (
						<Map
							key={index}
							data={player}
							position={{ x: 40 + 440 * index, y: 40 }}
							selectedBoat={selectedBoat[index]}
							setSelectedBoat={setSelectedBoat[index]}
						/>
					))}
				</>
			</svg>
		</div>
	);
};
