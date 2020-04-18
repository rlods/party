import React, { useState } from "react";
//
import { FleetControls } from "../components/Battle/FleetControls";
import { Map, MapData } from "../components/Battle/Map";
import { BattleAssets } from "../components/Battle/BattleAssets";
import "./Battle.scss";

// ------------------------------------------------------------------

export type BattleData = {
	map1: MapData;
	map2: MapData;
};

// ------------------------------------------------------------------

export const Battle = () => {
	const [selectedBoat1, setSelectedBoat1] = useState<number>(-1);
	const [selectedBoat2, setSelectedBoat2] = useState<number>(-1);

	const data: BattleData = {
		map1: {
			fleet: [
				{ type: "boat1", position: { x: 6, y: 6 }, status: "ok" },
				{ type: "boat1", position: { x: 46, y: 6 }, status: "ko" },
				{ type: "boat2", position: { x: 6, y: 46 }, status: "ok" },
				{ type: "boat2", position: { x: 86, y: 46 }, status: "ko" },
				{ type: "boat3", position: { x: 6, y: 86 }, status: "ok" },
				{ type: "boat3", position: { x: 126, y: 86 }, status: "ko" }
			],
			hits: [
				{ position: { x: 10, y: 50 }, type: "hitted1" },
				{ position: { x: 10, y: 90 }, type: "hitted2" },
				{ position: { x: 10, y: 130 }, type: "missed1" },
				{ position: { x: 10, y: 170 }, type: "missed2" }
			],
			weapons: [
				{ position: { x: 12, y: 216 }, type: "bullet1" },
				{ position: { x: 12, y: 256 }, type: "bullet2" },
				{ position: { x: 12, y: 296 }, type: "bullet3" },
				{ position: { x: 12, y: 332 }, type: "mine" }
			]
		},
		map2: {
			fleet: [
				{ type: "boat1", position: { x: 6, y: 6 }, status: "ok" },
				{ type: "boat1", position: { x: 46, y: 6 }, status: "ko" },
				{ type: "boat2", position: { x: 6, y: 46 }, status: "ok" },
				{ type: "boat2", position: { x: 86, y: 46 }, status: "ko" },
				{ type: "boat3", position: { x: 6, y: 86 }, status: "ok" },
				{ type: "boat3", position: { x: 126, y: 86 }, status: "ko" }
			],
			hits: [
				{ position: { x: 10, y: 50 }, type: "hitted1" },
				{ position: { x: 10, y: 90 }, type: "hitted2" },
				{ position: { x: 10, y: 130 }, type: "missed1" },
				{ position: { x: 10, y: 170 }, type: "missed2" }
			],
			weapons: [
				{ position: { x: 12, y: 216 }, type: "bullet1" },
				{ position: { x: 12, y: 256 }, type: "bullet2" },
				{ position: { x: 12, y: 296 }, type: "bullet3" },
				{ position: { x: 12, y: 332 }, type: "mine" }
			]
		}
	};

	return (
		<div className="Battle">
			<FleetControls
				disabled={selectedBoat1 < 0}
				onMoveLeft={() => {
					if (
						selectedBoat1 >= 0 &&
						selectedBoat1 < data.map1.fleet.length
					) {
						data.map1.fleet[selectedBoat1].position.x -= 40;
					}
				}}
				onMoveUp={() => {}}
				onMoveDown={() => {}}
				onMoveRight={() => {}}
				onRotateLeft={() => {}}
				onRotateRight={() => {}}
			/>
			<svg viewBox="0 0 920 480">
				<BattleAssets />
				<Map
					data={data.map1}
					position={{ x: 40, y: 40 }}
					selectedBoat={selectedBoat1}
					setSelectedBoat={setSelectedBoat1}
				/>
				<Map
					data={data.map2}
					position={{ x: 480, y: 40 }}
					selectedBoat={selectedBoat2}
					setSelectedBoat={setSelectedBoat2}
				/>
			</svg>
		</div>
	);
};
