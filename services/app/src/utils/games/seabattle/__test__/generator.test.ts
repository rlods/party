import {
	checkAvailable,
	generateBattle,
	generateFleet,
	generatePlace
} from "../generator";

// ------------------------------------------------------------------

describe("SeaBattle Generator Utilities", () => {
	it("checkAvailable - ...", () => {});

	it("generateBattle - ...", () => {
		const battle1 = generateBattle("user1");
		const battle2 = generateBattle("user1");
		expect(battle1.maps.length).toEqual(1);
		expect(battle1.maps[0].userId).toEqual("user1");
		expect(battle1).not.toEqual(battle2);
	});

	it("generateFleet - ...", () => {});

	it("generatePlace - ...", () => {});
});
