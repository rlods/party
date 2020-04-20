import {
	SeaBattleData,
	SeaBattleBoatData,
	SeaBattleBoatType,
	SeaBattleWeaponsSet
} from ".";

// ------------------------------------------------------------------

const FleetDefaultSet = {
	// Keys are boat types
	boat1: 4,
	boat2: 3,
	boat3: 2
};

// ------------------------------------------------------------------

export const generateBattle = (userId: string): SeaBattleData => {
	console.debug("[SeaBattle] Genering battle...");
	const battle: SeaBattleData = {
		currentMapIndex: 0,
		maps: []
	};
	generateFleet(battle, userId);
	return battle;
};

// ------------------------------------------------------------------

export const generateFleet = (battle: SeaBattleData, userId: string) => {
	const oldMap = battle.maps.find(other => other.userId === userId);
	if (oldMap) {
		return; // User already has a map in the battle
	}
	console.debug("[SeaBattle] Genering fleet...", {
		userId
	});

	let totalCount = 0;
	const fleet: SeaBattleBoatData[] = [];
	Object.entries(FleetDefaultSet)
		.reverse()
		.forEach(([type, count]) => {
			for (let i = 0; i < count; ++i) {
				fleet.push({
					hits: [
						/*
						{ position: { x: 0, y: 0 }, type: "hitted" },
						{ position: { x: 1, y: 0 }, type: "hitted" }
						 */
					],
					type: type as SeaBattleBoatType,
					angle: 0,
					position: { x: 0, y: totalCount++ },
					status: "ok"
				});
			}
		});

	battle.maps.push({
		fleet,
		hits: [
			/*
			{ position: { x: 0, y: 1 }, type: "hitted" },
			{ position: { x: 0, y: 2 }, type: "hitted" },
			{ position: { x: 0, y: 3 }, type: "missed" }
			*/
		],
		opponentsWeapons: [
			/*
			{position: { x: 0, y: 5 }, opponentId: '', type:'mine'}
			*/
		],
		status: "ok",
		userId,
		weapons: generateWeaponsSet()
	});
};

// ------------------------------------------------------------------

export const shuffleFleet = (battle: SeaBattleData) => {
	// TODO: shuffleFleet
};

// ------------------------------------------------------------------

export const generateWeaponsSet = (): SeaBattleWeaponsSet => ({
	// Keys are weapon types: Following counts are abitrary choices (to validate or adjust ^_^) - TODO
	bullet1: 100,
	bullet2: 6,
	bullet3: 3,
	mine: 3
});
