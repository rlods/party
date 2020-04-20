import React from "react";
//
import { Boat } from "./Boats";
import { SeaBattleBoatData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Fleet = ({
	fleet,
	hideFleet,
	selectedBoatIndex,
	onSelectBoatIndex
}: {
	fleet: SeaBattleBoatData[];
	hideFleet: boolean;
	selectedBoatIndex?: number;
	onSelectBoatIndex?: (index: number) => void;
}) => (
	<>
		{fleet.map((boat, index) => (
			<Boat
				key={index}
				boat={boat}
				hideFleet={hideFleet}
				onClick={
					onSelectBoatIndex && boat.status === "ok"
						? () => {
								onSelectBoatIndex(
									index === selectedBoatIndex ? -1 : index
								);
						  }
						: void 0
				}
				selected={index === selectedBoatIndex}
			/>
		))}
	</>
);
