import { AsyncAction } from "..";
import { displayError } from "../messages";
import { extractErrorMessage } from "../../utils/messages";
import { decode, encode } from "../../utils/encoder";
import {
	SeaBattleMovementType,
	SeaBattleData,
	generateFleet,
	AngleToDirection,
	MAX_PLAYER_COUNT,
	INVALID_MOVE_MESSAGE_TAG
} from "../../utils/games/seabattle";
import {
	SeaBattleBoatTranslationMappings,
	SeaBattleBoatRotationTransformationMappings
} from "../../utils/games/seabattle/mappings";
import { movementIsPossible } from "../../utils/games/seabattle/collision";
import { clearMessages } from "../../reducers/messages";

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
		dispatch(displayError("users.not_connected"));
		return;
	}
	try {
		console.debug("[SeaBattle] Joining battle...", { userId });
		const battle = decode<SeaBattleData>(info.extra);
		const player = battle.players[userId];
		if (player) {
			return; // User is already in the battle
		}
		if (Object.keys(battle.players).length >= MAX_PLAYER_COUNT) {
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
		dispatch(displayError("users.not_connected"));
		return;
	}
	try {
		const battle = decode<SeaBattleData>(info.extra);

		const player = battle.players[userId];
		if (!player) {
			return;
		}

		const { fleet } = player;
		if (boatIndex < 0 || boatIndex >= player.fleet.length) {
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
				displayError(
					"games.seabattle.movement_is_not_possible",
					INVALID_MOVE_MESSAGE_TAG
				)
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

		boat.angle = newAngle;
		boat.position = newPosition;

		await room.update({
			...info,
			extra: encode(battle)
		});

		dispatch(clearMessages(INVALID_MOVE_MESSAGE_TAG));
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
