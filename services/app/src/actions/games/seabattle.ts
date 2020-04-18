import { AsyncAction } from "..";
import { displayError } from "../messages";
import { extractErrorMessage } from "../../utils/messages";
import {
	SeaBattleMovementType,
	SeabattleBoatRotationMappings,
	SeabattleBoatTranslationMappings,
	SeabattleBoatRotationTransformationMappings
} from "../../utils/games/seabattle";
import { setBoatPosition } from "../../reducers/games/seabattle";

// ------------------------------------------------------------------

export const moveBoat = ({
	playerId,
	boatIndex,
	movement
}: {
	playerId: string;
	boatIndex: number;
	movement: SeaBattleMovementType;
}): AsyncAction => async (dispatch, getState) => {
	try {
		const {
			games: {
				seabattle: { players }
			}
		} = getState();

		if (boatIndex < 0 || boatIndex >= players[playerId].fleet.length) {
			return;
		}

		const {
			direction: oldDirection,
			position: oldPosition,
			type
		} = players[playerId].fleet[boatIndex];

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

		console.debug("[SeaBattle] Moving boat...", {
			playerId,
			boatIndex,
			movement,
			oldDirection,
			newDirection,
			oldPosition,
			newPosition
		});
		dispatch(
			setBoatPosition({
				playerId,
				boatIndex,
				direction: newDirection,
				position: newPosition
			})
		);
	} catch (err) {
		dispatch(displayError(extractErrorMessage(err)));
	}
};
