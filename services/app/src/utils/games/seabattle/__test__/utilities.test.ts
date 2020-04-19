import { AngleToDirection, SeaBattleDirection } from "..";

// ------------------------------------------------------------------

describe("SeaBattle Utilities", () => {
	it("AngleToDirection", () => {
		const References: Array<{
			angle: number;
			direction: SeaBattleDirection;
		}> = [
			{ angle: -10, direction: "W" },
			{ angle: -9, direction: "N" },
			{ angle: -8, direction: "E" },
			{ angle: -7, direction: "S" },
			{ angle: -6, direction: "W" },
			{ angle: -5, direction: "N" },
			{ angle: -4, direction: "E" },
			{ angle: -3, direction: "S" },
			{ angle: -2, direction: "W" },
			{ angle: -1, direction: "N" },
			{ angle: 0, direction: "E" },
			{ angle: 1, direction: "S" },
			{ angle: 2, direction: "W" },
			{ angle: 3, direction: "N" },
			{ angle: 4, direction: "E" },
			{ angle: 5, direction: "S" },
			{ angle: 6, direction: "W" },
			{ angle: 7, direction: "N" },
			{ angle: 8, direction: "E" },
			{ angle: 9, direction: "S" },
			{ angle: 10, direction: "W" }
		];
		for (const reference of References) {
			expect(AngleToDirection(reference.angle)).toEqual(
				reference.direction
			);
		}
	});
});
