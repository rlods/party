import { AsyncAction } from "..";
import { displayError } from "../messages";
import { extractErrorMessage } from "../../utils/messages";
import { decode, encode } from "../../utils/encoder";
import {
	SeaBattleMovementType,
	SeaBattleData,
	generateFleet,
	MAX_PLAYER_COUNT
} from "../../utils/games/seabattle";
import {
	SeabattleBoatRotationMappings,
	SeabattleBoatTranslationMappings,
	SeabattleBoatRotationTransformationMappings
} from "../../utils/games/seabattle/mappings";
import { movementIsPossible } from "../../utils/games/seabattle/collision";

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

		const { direction: oldDirection, position: oldPosition, type } = fleet[
			boatIndex
		];

		let newPosition = { ...oldPosition };
		if (movement === "move-forward" || movement === "move-backward") {
			newPosition.x +=
				SeabattleBoatTranslationMappings[oldDirection][movement].x;
			newPosition.y +=
				SeabattleBoatTranslationMappings[oldDirection][movement].y;
		}

		let newDirection = oldDirection;
		if (movement === "rotate-left" || movement === "rotate-right") {
			newDirection =
				SeabattleBoatRotationMappings[oldDirection][movement];
			newPosition.x +=
				SeabattleBoatRotationTransformationMappings[type][
					oldDirection
				].x;
			newPosition.y +=
				SeabattleBoatRotationTransformationMappings[type][
					oldDirection
				].y;
		}

		if (!movementIsPossible(fleet, boatIndex, newPosition, newDirection)) {
			console.debug("[SeaBattle] Movement is not possible...", {
				boatIndex,
				movement,
				oldDirection,
				newDirection,
				oldPosition,
				newPosition
			});
			dispatch(displayError("games.seabattle.movement_is_not_possible"));
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

		player.fleet[boatIndex].direction = newDirection;
		player.fleet[boatIndex].position = newPosition;

		await room.update({
			...info,
			extra: encode(battle)
		});
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
