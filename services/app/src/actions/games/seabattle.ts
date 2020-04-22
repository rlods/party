import { AsyncAction, trySomething } from "..";
import { displayError, displaySuccess } from "../messages";
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
import { lockRoom } from "../room";

// ------------------------------------------------------------------

export const joinBattle = (): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, room },
					user: {
						access: { userId }
					}
				} = getState();
				console.log("****** joinBattle1");
				if (!userId) {
					dispatch(displayError("user.not_connected"));
					return "connect-and-retry";
				}
				console.log("****** joinBattle2");
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				console.log("****** joinBattle3");
				console.debug("[SeaBattle] Joining battle...", { userId });
				const battle = decodeBattle(info.extra);
				const map = battle.maps.find(other => other.userId === userId);
				if (map) {
					return true; // User is already in the battle
				}
				if (Object.keys(battle.maps).length >= MAX_PLAYER_COUNT) {
					dispatch(displayError("games.max_players_count"));
					return true;
				}
				generateFleet(battle, userId);
				await room.update({
					...info,
					extra: encodeBattle(battle)
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const moveBoat = ({
	boatIndex,
	movement
}: {
	boatIndex: number;
	movement: SeaBattleMovementType;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, room },
					user: {
						access: { userId }
					}
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				if (!userId) {
					dispatch(displayError("user.not_connected"));
					return "connect-and-retry";
				}

				const battle = decodeBattle(info.extra);

				const playerMap = battle.maps.find(
					other => other.userId === userId
				);
				if (!playerMap) {
					console.debug(
						"[SeaBattle] Cannot find map for current user"
					);
					return true;
				}

				if (!checkUserHasBatton(battle, userId)) {
					dispatch(displayError("games.seabattle.not_your_turn"));
					return true;
				}

				const { fleet } = playerMap;
				if (boatIndex < 0 || boatIndex >= fleet.length) {
					console.debug("[SeaBattle] No boat selected");
					return true;
				}

				const { angle: oldAngle, position: oldPosition, type } = fleet[
					boatIndex
				];

				const oldDirection = AngleToDirection(oldAngle);

				let newPosition = { ...oldPosition };
				if (
					movement === "move-forward" ||
					movement === "move-backward"
				) {
					newPosition.x +=
						SeaBattleBoatTranslationMappings[oldDirection][
							movement
						].x;
					newPosition.y +=
						SeaBattleBoatTranslationMappings[oldDirection][
							movement
						].y;
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
					return true;
				}

				if (
					!movementIsPossible(fleet, boat, newPosition, newDirection)
				) {
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
					return true;
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

				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);

// ------------------------------------------------------------------

export const attackOpponent = ({
	opponentIndex,
	position,
	weaponType
}: {
	opponentIndex: number;
	position: SeaBattlePosition;
	weaponType: SeaBattleWeaponType;
}): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething({
			onAction: async () => {
				const {
					room: { info, room },
					user: {
						access: { userId }
					}
				} = getState();
				if (!room || room.isLocked() || !info) {
					dispatch(displayError("rooms.errors.locked"));
					return "unlock-and-retry";
				}
				if (!userId) {
					dispatch(displayError("user.not_connected"));
					return "connect-and-retry";
				}

				const battle = decodeBattle(info.extra);
				const playerMap = battle.maps.find(
					other => other.userId === userId
				);
				if (!playerMap) {
					console.debug(
						"[SeaBattle] Cannot find map for current user"
					);
					return true;
				}
				if (!checkUserHasBatton(battle, userId)) {
					dispatch(displayError("games.seabattle.not_your_turn"));
					return true;
				}

				if (playerMap.weapons[weaponType] <= 0) {
					dispatch(
						displayError("games.seabattle.weapon_not_available")
					);
					return true;
				}

				const opponentMaps = extractOpponentMaps(battle.maps, userId);
				if (opponentIndex < 0 || opponentIndex >= opponentMaps.length) {
					console.debug("[SeaBattle] Cannot find opponent map");
					return true;
				}
				const opponentMap = opponentMaps[opponentIndex];
				if (opponentMap.userId === userId) {
					console.debug("[SeaBattle] Invalid opponent map");
					return true;
				}
				if (opponentMap.status === "ko") {
					dispatch(
						displayError("games.seabattle.opponent_already_killed")
					);
					return true;
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
								displayError(
									"games.seabattle.ship_already_killed"
								)
							);
							return true;
						}

						const hit = opponentBoat.hits.find(
							hit => hit.position.x === cell.boatLocalIndex
						);
						if (hit) {
							dispatch(
								displayError(
									"games.seabattle.ship_already_hitted"
								)
							);
							return true;
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
								displaySuccess(
									"games.seabattle.killed_opponent_boat"
								)
							);
							opponentBoat.status = "ko";

							if (
								!opponentMap.fleet.find(
									boat => boat.status === "ok"
								)
							) {
								dispatch(
									displaySuccess(
										"games.seabattle.killed_opponent"
									)
								);
								opponentMap.status = "ko";
							}
						} else {
							dispatch(
								displaySuccess(
									"games.seabattle.hitted_opponent"
								)
							);
						}
					} else {
						dispatch(
							displaySuccess("games.seabattle.hitted_weapon")
						); // TODO: for example a mine
					}
				}
				playerMap.weapons[weaponType]--;
				passBatonToNextPlayer(battle);
				await room.update({
					...info,
					extra: encodeBattle(battle)
				});
				return true;
			},
			onFailure: () => dispatch(lockRoom())
		})
	);
