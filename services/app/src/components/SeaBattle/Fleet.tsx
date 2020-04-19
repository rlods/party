import React from "react";
//
import { Boat } from "./Boats";
import { SeaBattleBoatData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Fleet = ({
	fleet,
	hideActiveFleet,
	selectedBoat,
	setSelectedBoat
}: {
	fleet: SeaBattleBoatData[];
	hideActiveFleet?: boolean;
	selectedBoat?: SeaBattleBoatData;
	setSelectedBoat?: (index: number) => void;
}) => {
	return (
		<>
			{fleet
				.filter(boat => !hideActiveFleet || boat.status === "ko")
				.map((boat, index) => (
					<Boat
						key={index}
						boat={boat}
						onClick={
							setSelectedBoat && boat.status === "ok"
								? () => {
										setSelectedBoat(
											boat === selectedBoat ? -1 : index
										);
								  }
								: void 0
						}
						selected={boat === selectedBoat}
					/>
				))}
		</>
	);
};
