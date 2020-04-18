import React from "react";
//
import { Boat } from "./Boats";
import { SeaBattleBoatData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Fleet = ({
	fleet,
	selectedBoat,
	setSelectedBoat
}: {
	fleet: SeaBattleBoatData[];
	selectedBoat: number;
	setSelectedBoat: (index: number) => void;
}) => {
	return (
		<>
			{fleet.map((boat, index) => (
				<Boat
					key={index}
					boat={boat}
					onClick={() => {
						if (boat.status === "ok") {
							setSelectedBoat(
								index === selectedBoat ? -1 : index
							);
						}
					}}
					selected={selectedBoat === index}
				/>
			))}
		</>
	);
};
