import React from "react";
//
import { Boat } from "./Boats";
import { SeaBattleBoatData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Fleet = ({
	fleet,
	hideActiveFleet,
	selectedBoatIndex,
	onSelectBoatIndex
}: {
	fleet: SeaBattleBoatData[];
	hideActiveFleet?: boolean;
	selectedBoatIndex?: number;
	onSelectBoatIndex?: (index: number) => void;
}) => (
	<>
		{fleet
			.filter(boat => !hideActiveFleet || boat.status === "ko")
			.map((boat, index) => (
				<Boat
					key={index}
					boat={boat}
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
