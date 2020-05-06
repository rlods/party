import {
	AngleToDirection,
	SeaBattleDirection,
	extractBattleInfo,
	checkUserTurn,
	passUserTurn,
	SeaBattleData
} from "..";

// ------------------------------------------------------------------

const generateFakeBattle = (): SeaBattleData => ({
	currentMapIndex: 1,
	maps: [
		{
			fleet: [
				{
					angle: 0,
					hits: [],
					position: {
						x: 1,
						y: 1
					},
					status: "ok",
					type: "boat1"
				},
				{
					angle: 0,
					hits: [],
					position: {
						x: 2,
						y: 2
					},
					status: "ok",
					type: "boat2"
				}
			],
			hits: [],
			opponentsWeapons: [],
			status: "ok",
			userId: "user1",
			weapons: { bullet1: 0, bullet2: 0, bullet3: 0, mine: 0 }
		},
		{
			fleet: [
				{
					angle: 0,
					hits: [],
					position: {
						x: 3,
						y: 3
					},
					status: "ok",
					type: "boat2"
				},
				{
					angle: 0,
					hits: [],
					position: {
						x: 3,
						y: 3
					},
					status: "ok",
					type: "boat3"
				}
			],
			hits: [],
			opponentsWeapons: [],
			status: "ok",
			userId: "user2",
			weapons: {
				bullet1: 0,
				bullet2: 0,
				bullet3: 0,
				mine: 0
			}
		},
		{
			fleet: [
				{
					angle: 0,
					hits: [],
					position: {
						x: 4,
						y: 4
					},
					status: "ok",
					type: "boat3"
				}
			],
			hits: [],
			opponentsWeapons: [],
			status: "ok",
			userId: "user3",
			weapons: { bullet1: 0, bullet2: 0, bullet3: 0, mine: 0 }
		}
	]
});

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

	it("extractBattleInfo - empty", () => {
		expect(
			extractBattleInfo({
				battle: null,
				boatIndex: 0,
				userId: ""
			})
		).toEqual({
			boat: void 0,
			currentMapIndex: -1,
			opponentMaps: void 0,
			playerMap: void 0,
			playerMapIndex: -1
		});
	});

	it("extractBattleInfo - valid", () => {
		const battle = generateFakeBattle();
		expect(
			extractBattleInfo({
				battle,
				boatIndex: 1,
				userId: battle.maps[1].userId
			})
		).toEqual({
			boat: battle.maps[1].fleet[1],
			currentMapIndex: 1,
			opponentMaps: [battle.maps[0], battle.maps[2]],
			playerMap: battle.maps[1],
			playerMapIndex: 1
		});
	});

	it("checkUserTurn - valid", () => {
		const battle = generateFakeBattle();

		expect(
			checkUserTurn(battle, battle.maps[battle.currentMapIndex].userId)
		).toEqual(true);

		expect(
			checkUserTurn(
				battle,
				battle.maps[(battle.currentMapIndex + 1) % battle.maps.length]
					.userId
			)
		).toEqual(false);
	});

	it("passUserTurn - valid", () => {
		const battle = generateFakeBattle();

		const currentIndex = battle.currentMapIndex;

		passUserTurn(battle);

		expect(
			battle.currentMapIndex === (currentIndex + 1) % battle.maps.length
		);
	});
});
