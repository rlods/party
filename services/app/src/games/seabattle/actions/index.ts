import {
	AsyncAction,
	trySomething,
	TrySomethingOptions
} from "../../../actions";
import { displayError, displaySuccess } from "../../../actions/messages";
import { generateFleet } from "../utils/generator";
import { encode } from "../../../utils/encoder";
import {
	SeaBattleMovementType,
	AngleToDirection,
	MAX_PLAYER_COUNT,
	SeaBattlePosition,
	SeaBattleWeaponType,
	extractOpponentMaps,
	passUserTurn,
	checkUserTurn,
	SeaBattleData
} from "../utils";
import {
	SeaBattleBoatTranslationMappings,
	SeaBattleBoatRotationTransformationMappings,
	SeaBattleBoatLengthMappings
} from "../utils/mappings";
import {
	movementIsPossible,
	generateGrid,
	getGridCell
} from "../utils/collision";

// ------------------------------------------------------------------

export const joinBattle = (options?: TrySomethingOptions): AsyncAction => (
	dispatch,
	getState
) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, extraDecoded }
				},
				user: {
					access: { userId }
				}
			} = getState();
			if (!userId) {
				return "connect-and-retry";
			}
			if (!firebaseRoom || firebaseRoom.isLocked() || !extraDecoded) {
				return "unlock-and-retry";
			}

			console.debug("[SeaBattle] Joining battle...", { userId });
			const battle = extraDecoded as SeaBattleData;
			const map = battle.maps.find(other => other.userId === userId);
			if (map) {
				return true; // Nothing to do, user is already in the battle
			}
			if (Object.keys(battle.maps).length >= MAX_PLAYER_COUNT) {
				dispatch(displayError("games.max_players_count"));
				return true;
			}

			// Warning: Here it could overwrite last update pushed in the battle by other user at the same time
			// But there is very few chance for that to happen with small number of players

			generateFleet(battle, userId);
			await firebaseRoom.updateExtra(encode(battle));
			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const moveBoat = (
	{
		boatIndex,
		movement
	}: {
		boatIndex: number;
		movement: SeaBattleMovementType;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, extraDecoded }
				},
				user: {
					access: { userId }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !extraDecoded) {
				return "unlock-and-retry";
			}
			if (!userId) {
				return "connect-and-retry";
			}

			const battle = extraDecoded as SeaBattleData;

			const playerMap = battle.maps.find(
				other => other.userId === userId
			);
			if (!playerMap) {
				console.debug("[SeaBattle] Cannot find map for current user");
				return true;
			}

			if (!checkUserTurn(battle, userId)) {
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
			if (movement === "move_forward" || movement === "move_backward") {
				newPosition.x +=
					SeaBattleBoatTranslationMappings[oldDirection][movement].x;
				newPosition.y +=
					SeaBattleBoatTranslationMappings[oldDirection][movement].y;
			}

			let newAngle = oldAngle;
			let newDirection = oldDirection;
			if (movement === "rotate_left" || movement === "rotate_right") {
				if (movement === "rotate_left") {
					newAngle--;
				}
				if (movement === "rotate_right") {
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
				console.debug("[SeaBattle] Hitted boat cannot move...", {
					boatIndex
				});
				return true;
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
			passUserTurn(battle);
			await firebaseRoom.updateExtra(encode(battle));

			return true;
		}, options)
	);

// ------------------------------------------------------------------

export const attackOpponent = (
	{
		opponentIndex,
		position,
		weaponType
	}: {
		opponentIndex: number;
		position: SeaBattlePosition;
		weaponType: SeaBattleWeaponType;
	},
	options?: TrySomethingOptions
): AsyncAction => (dispatch, getState) =>
	dispatch(
		trySomething(async () => {
			const {
				room: {
					data: { firebaseRoom, extraDecoded }
				},
				user: {
					access: { userId }
				}
			} = getState();
			if (!firebaseRoom || firebaseRoom.isLocked() || !extraDecoded) {
				return "unlock-and-retry";
			}
			if (!userId) {
				return "connect-and-retry";
			}

			const battle = extraDecoded as SeaBattleData;
			const playerMap = battle.maps.find(
				other => other.userId === userId
			);
			if (!playerMap) {
				console.debug("[SeaBattle] Cannot find map for current user");
				return true;
			}
			if (!checkUserTurn(battle, userId)) {
				dispatch(displayError("games.seabattle.not_your_turn"));
				return true;
			}

			if (playerMap.weapons[weaponType] <= 0) {
				dispatch(displayError("games.seabattle.weapon_not_available"));
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
				console.debug("[SeaBattle] Opponent has already been killed");
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
							displayError("games.seabattle.ship_already_killed")
						);
						return true;
					}

					const hit = opponentBoat.hits.find(
						hit => hit.position.x === cell.boatLocalIndex
					);
					if (hit) {
						dispatch(
							displayError("games.seabattle.ship_already_hitted")
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
							opponentMap.status = "ko";
						}
					} else {
						dispatch(
							displaySuccess("games.seabattle.hitted_opponent")
						);
					}
				} else {
					dispatch(displaySuccess("games.seabattle.hitted_weapon")); // TODO: for example a mine
				}
			}
			playerMap.weapons[weaponType]--;
			passUserTurn(battle);
			await firebaseRoom.updateExtra(encode(battle));

			return true;
		}, options)
	);
