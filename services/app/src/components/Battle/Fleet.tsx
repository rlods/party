import React from "react";
//
import { BoatProps, Boat } from "./Boats";

// ------------------------------------------------------------------

export const Fleet = ({
	fleet,
	selectedBoat,
	setSelectedBoat
}: {
	fleet: BoatProps[];
	selectedBoat: number;
	setSelectedBoat: (index: number) => void;
}) => {
	return (
		<>
			{fleet.map((props, index) => (
				<Boat
					key={index}
					onClick={() => {
						if (props.status === "ok") {
							setSelectedBoat(
								index === selectedBoat ? -1 : index
							);
						}
					}}
					selected={selectedBoat === index}
					{...props}
				/>
			))}
		</>
	);
};
