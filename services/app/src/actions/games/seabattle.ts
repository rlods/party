import { AsyncAction } from "..";
import { displayError, displaySuccess, displayInfo } from "../messages";
import { extractErrorMessage } from "../../utils/messages";
import { decode, encode } from "../../utils/encoder";
import {
	SeaBattleMovementType,
	SeaBattleData,
	generateFleet,
	AngleToDirection,
	MAX_PLAYER_COUNT,
	INVALID_MOVE_MESSAGE_TAG,
	SeaBattlePosition,
	SeaBattleWeaponType,
	extractOpponentMaps,
	passBatonToNextPlayer,
	checkUserHasBatton
} from "../../utils/games/seabattle";
import {
	SeaBattleBoatTranslationMappings,
	SeaBattleBoatRotationTransformationMappings
} from "../../utils/games/seabattle/mappings";
import {
	movementIsPossible,
	generateGrid
} from "../../utils/games/seabattle/collision";
import { openModal } from "../../reducers/modals";

// ------------------------------------------------------------------

export const joinBattle = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room },
		user: {
			access: { id: userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (!userId) {
		console.debug("[SeaBattle] Not connected");
		dispatch(openModal({ type: "CreateUser", props: null }));
		return;
	}
	try {
		console.debug("[SeaBattle] Joining battle...", { userId });
		const battle = decode<SeaBattleData>(info.extra);
		const map = battle.maps.find(other => other.userId === userId);
		if (map) {
			return; // User is already in the battle
		}
		if (Object.keys(battle.maps).length >= MAX_PLAYER_COUNT) {
			dispatch(displayError("games.max_players_count"));
			return;
		}
		generateFleet(battle, userId);
		await room.update({
			...info,
			extra: encode(battle)
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

export const moveBoat = ({
	boatIndex,
	movement
}: {
	boatIndex: number;
	movement: SeaBattleMovementType;
}): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room },
		user: {
			access: { id: userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (!userId) {
		console.debug("[SeaBattle] Not connected");
		dispatch(openModal({ type: "CreateUser", props: null }));
		return;
	}
	try {
		const battle = decode<SeaBattleData>(info.extra);

		const playerMap = battle.maps.find(other => other.userId === userId);
		if (!playerMap) {
			console.debug("[SeaBattle] Cannot find map for current user");
			return;
		}

		if (!checkUserHasBatton(battle, userId)) {
			dispatch(displayError("games.seabattle.not_your_turn"));
			return;
		}

		const { fleet } = playerMap;
		if (boatIndex < 0 || boatIndex >= fleet.length) {
			console.debug("[SeaBattle] No boat selected");
			return;
		}

		const { angle: oldAngle, position: oldPosition, type } = fleet[
			boatIndex
		];

		const oldDirection = AngleToDirection(oldAngle);

		let newPosition = { ...oldPosition };
		if (movement === "move-forward" || movement === "move-backward") {
			newPosition.x +=
				SeaBattleBoatTranslationMappings[oldDirection][movement].x;
			newPosition.y +=
				SeaBattleBoatTranslationMappings[oldDirection][movement].y;
		}

		let newAngle = oldAngle;
		let newDirection = oldDirection;
		if (movement === "rotate-left" || movement === "rotate-right") {
			if (movement === "rotate-left") {
				newAngle--;
			}
			if (movement === "rotate-right") {
				newAngle++;
			}
			newDirection = AngleToDirection(newAngle);
			newPosition.x +=
				SeaBattleBoatRotationTransformationMappings[type][
					oldDirection
				].x;
			newPosition.y +=
				SeaBattleBoatRotationTransformationMappings[type][
					oldDirection
				].y;
		}

		const boat = fleet[boatIndex];
		if (!movementIsPossible(fleet, boat, newPosition, newDirection)) {
			console.debug("[SeaBattle] Movement is not possible...", {
				boatIndex,
				movement,
				oldDirection,
				newDirection,
				oldPosition,
				newPosition
			});
			dispatch(
				displayError("games.seabattle.movement_is_not_possible", {
					tag: INVALID_MOVE_MESSAGE_TAG
				})
			);
			return;
		}

		console.debug("[SeaBattle] Moving boat...", {
			boatIndex,
			movement,
			oldDirection,
			oldPosition,
			newDirection,
			newPosition
		});

		// Alter battle
		boat.angle = newAngle;
		boat.position = newPosition;
		passBatonToNextPlayer(battle);
		await room.update({
			...info,
			extra: encode(battle)
		});

		dispatch(
			displaySuccess("games.seabattle.you_played_your_turn", {
				tag: INVALID_MOVE_MESSAGE_TAG
			})
		);
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};

// ------------------------------------------------------------------

export const attackOpponent = ({
	opponentIndex,
	position,
	weaponType
}: {
	opponentIndex: number;
	position: SeaBattlePosition;
	weaponType: SeaBattleWeaponType;
}): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room },
		user: {
			access: { id: userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.error.locked"));
		return;
	}
	if (!userId) {
		console.debug("[SeaBattle] Not connected");
		dispatch(openModal({ type: "CreateUser", props: null }));
		return;
	}
	try {
		const battle = decode<SeaBattleData>(info.extra);

		const playerMap = battle.maps.find(other => other.userId === userId);
		if (!playerMap) {
			console.debug("[SeaBattle] Cannot find map for current user");
			return;
		}
		if (!checkUserHasBatton(battle, userId)) {
			dispatch(displayError("games.seabattle.not_your_turn"));
			return;
		}

		const weaponCount = playerMap.weapons[weaponType];
		if (weaponCount <= 0) {
			dispatch(displayInfo("games.seabattle.weapon_not_available"));
			return;
		}

		const opponentMaps = extractOpponentMaps(battle.maps, userId);
		if (opponentIndex < 0 || opponentIndex >= opponentMaps.length) {
			console.debug("[SeaBattle] Cannot find opponent map");
			return;
		}
		const opponentMap = opponentMaps[opponentIndex];
		if (opponentMap.userId === userId) {
			console.debug("[SeaBattle] Invalid opponent map");
			return;
		}

		console.debug("[SeaBattle] Attacking opponent...", {
			opponentIndex,
			position,
			weaponType
		});

		const grid = generateGrid(opponentMap.fleet);

		// Alter battle
		if (grid[position.y][position.x] === 0) {
			dispatch(displayError("games.seabattle.missed_opponent"));
			opponentMap.hits.push({
				position,
				type: "missed"
			});
		} else {
			dispatch(displaySuccess("games.seabattle.hitted_opponent"));
			opponentMap.hits.push({
				position,
				type: "hitted1"
			});
		}
		playerMap.weapons[weaponType]--;
		passBatonToNextPlayer(battle);
		await room.update({
			...info,
			extra: encode(battle)
		});

		dispatch(
			displaySuccess("games.seabattle.you_played_your_turn", {
				tag: INVALID_MOVE_MESSAGE_TAG
			})
		);
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
