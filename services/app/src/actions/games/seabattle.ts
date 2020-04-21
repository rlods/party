import { AsyncAction } from "..";
import { displayError, displaySuccess } from "../messages";
import { extractErrorMessage } from "../../utils/messages";
import {
	SeaBattleMovementType,
	AngleToDirection,
	MAX_PLAYER_COUNT,
	INVALID_MOVE_MESSAGE_TAG,
	SeaBattlePosition,
	SeaBattleWeaponType,
	extractOpponentMaps,
	passBatonToNextPlayer,
	checkUserHasBatton,
	decodeBattle,
	encodeBattle
} from "../../utils/games/seabattle";
import {
	SeaBattleBoatTranslationMappings,
	SeaBattleBoatRotationTransformationMappings,
	SeaBattleBoatLengthMappings
} from "../../utils/games/seabattle/mappings";
import {
	movementIsPossible,
	generateGrid,
	getGridCell
} from "../../utils/games/seabattle/collision";
import { generateFleet } from "../../utils/games/seabattle/generator";
import { unlockAndRetry, connectAndRetry } from "../modals";

// ------------------------------------------------------------------

export const joinBattle = (): AsyncAction => async (dispatch, getState) => {
	const {
		room: { info, room },
		user: {
			access: { userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.errors.locked"));
		dispatch(unlockAndRetry(() => dispatch(joinBattle())));
		return;
	}
	if (!userId) {
		dispatch(displayError("users.not_connected"));
		dispatch(connectAndRetry(() => dispatch(joinBattle())));
		return;
	}
	try {
		console.debug("[SeaBattle] Joining battle...", { userId });
		const battle = decodeBattle(info.extra);
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
			extra: encodeBattle(battle)
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
			access: { userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.errors.locked"));
		dispatch(
			unlockAndRetry(() => dispatch(moveBoat({ boatIndex, movement })))
		);
		return;
	}
	if (!userId) {
		dispatch(displayError("users.not_connected"));
		dispatch(
			connectAndRetry(() => dispatch(moveBoat({ boatIndex, movement })))
		);
		return;
	}
	try {
		const battle = decodeBattle(info.extra);

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
		if (boat.hits.find(hit => hit.type === "hitted")) {
			dispatch(
				displayError(
					"games.seabattle.movement_not_possible_because_hitted",
					{
						tag: INVALID_MOVE_MESSAGE_TAG
					}
				)
			);
			return;
		}

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
				displayError("games.seabattle.movement_not_possible", {
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
			extra: encodeBattle(battle)
		});
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
			access: { userId }
		}
	} = getState();
	if (!room || room.isLocked() || !info) {
		dispatch(displayError("rooms.errors.locked"));
		dispatch(
			unlockAndRetry(() =>
				dispatch(
					attackOpponent({
						opponentIndex,
						position,
						weaponType
					})
				)
			)
		);
		return;
	}
	if (!userId) {
		dispatch(displayError("users.not_connected"));
		dispatch(
			connectAndRetry(() =>
				dispatch(
					attackOpponent({
						opponentIndex,
						position,
						weaponType
					})
				)
			)
		);
		return;
	}
	try {
		const battle = decodeBattle(info.extra);
		const playerMap = battle.maps.find(other => other.userId === userId);
		if (!playerMap) {
			console.debug("[SeaBattle] Cannot find map for current user");
			return;
		}
		if (!checkUserHasBatton(battle, userId)) {
			dispatch(displayError("games.seabattle.not_your_turn"));
			return;
		}

		if (playerMap.weapons[weaponType] <= 0) {
			dispatch(displayError("games.seabattle.weapon_not_available"));
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
		if (opponentMap.status === "ko") {
			dispatch(displayError("games.seabattle.opponent_already_killed"));
			return;
		}

		console.debug("[SeaBattle] Attacking opponent...", {
			opponentIndex,
			position,
			weaponType
		});

		const grid = generateGrid(opponentMap.fleet);
		const cell = getGridCell(grid, position);

		// Alter battle
		if (null === cell) {
			dispatch(displayError("games.seabattle.missed_opponent"));
			opponentMap.hits.push({
				position,
				type: "missed"
			});
		} else {
			if (cell.type === "boat") {
				const opponentBoat = opponentMap.fleet[cell.boatIndex];
				if (opponentBoat.status === "ko") {
					dispatch(
						displayError("games.seabattle.ship_already_killed")
					);
					return;
				}

				const hit = opponentBoat.hits.find(
					hit => hit.position.x === cell.boatLocalIndex
				);
				if (hit) {
					dispatch(
						displayError("games.seabattle.ship_already_hitted")
					);
					return;
				}

				opponentBoat.hits.push({
					position: {
						x: cell.boatLocalIndex,
						y: 0
					},
					type: "hitted"
				});
				if (
					opponentBoat.hits.length ===
					SeaBattleBoatLengthMappings[opponentBoat.type]
				) {
					dispatch(
						displaySuccess("games.seabattle.killed_opponent_boat")
					);
					opponentBoat.status = "ko";

					if (!opponentMap.fleet.find(boat => boat.status === "ok")) {
						dispatch(
							displaySuccess("games.seabattle.killed_opponent")
						);
						opponentMap.status = "ko";
					}
				} else {
					dispatch(displaySuccess("games.seabattle.hitted_opponent"));
				}
			} else {
				dispatch(displaySuccess("games.seabattle.hitted_weapon")); // TODO: for example a mine
			}
		}
		playerMap.weapons[weaponType]--;
		passBatonToNextPlayer(battle);
		await room.update({
			...info,
			extra: encodeBattle(battle)
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
