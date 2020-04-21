import React, { FC } from "react";
//
import { Boat } from "./Boats";
import { SeaBattleBoatData } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

export const Fleet: FC<{
	fleet: SeaBattleBoatData[];
	hideFleet: boolean;
	selectedBoatIndex?: number;
	onSelectBoatIndex?: (index: number) => void;
}> = ({ fleet, hideFleet, selectedBoatIndex, onSelectBoatIndex }) => (
	<>
		{fleet.map((boat, index) => (
			<Boat
				key={index}
				boat={boat}
				hideFleet={hideFleet}
				onClick={
					onSelectBoatIndex && boat.status === "ok"
						? () => {
								console.debug("[SeaBattle] Selected boat", {
									boat
								});
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
