import { Reducer } from "redux";
import { AxiosError } from "axios";
//
import { createAction } from "../../actions";
import {
	SeaBattleData,
	SeaBattleAssetPosition,
	SeaBattleDirection
} from "../../utils/games/seabattle";

// ------------------------------------------------------------------

type SeabattleAction =
	| ReturnType<typeof fetching>
	| ReturnType<typeof success>
	| ReturnType<typeof error>
	| ReturnType<typeof reset>
	| ReturnType<typeof setBoatPosition>;

export const fetching = () => createAction("games/seabattle/FETCHING");
export const success = () => createAction("games/seabattle/FETCHED");
export const error = (error: AxiosError) =>
	createAction("games/seabattle/ERROR", error);
export const reset = () => createAction("games/seabattle/RESET", error);
export const setBoatPosition = ({
	playerId,
	boatIndex,
	direction,
	position
}: {
	playerId: string;
	boatIndex: number;
	direction: SeaBattleDirection;
	position: SeaBattleAssetPosition;
}) =>
	createAction("games/seabattle/SET_BOAT_POSITION", {
		direction,
		playerId,
		boatIndex,
		position
	});

// ------------------------------------------------------------------

export type State = SeaBattleData & {
	fetching: boolean;
	error: null | AxiosError;
};

const INITIAL_STATE: State = {
	error: null,
	fetching: false,
	players: {
		player1: {
			fleet: [
				{
					type: "boat1",
					direction: "E",
					position: { x: 6, y: 6 },
					status: "ok"
				},
				{
					type: "boat1",
					direction: "E",
					position: { x: 46, y: 6 },
					status: "ko"
				},
				{
					type: "boat2",
					direction: "E",
					position: { x: 6, y: 46 },
					status: "ok"
				},
				{
					type: "boat2",
					direction: "E",
					position: { x: 86, y: 46 },
					status: "ko"
				},
				{
					type: "boat3",
					direction: "E",
					position: { x: 6, y: 86 },
					status: "ok"
				},
				{
					type: "boat3",
					direction: "E",
					position: { x: 126, y: 86 },
					status: "ko"
				}
			],
			hits: [
				{ position: { x: 10, y: 50 }, type: "hitted1" },
				{ position: { x: 10, y: 90 }, type: "hitted2" },
				{ position: { x: 10, y: 130 }, type: "missed1" },
				{ position: { x: 10, y: 170 }, type: "missed2" }
			],
			weapons: [
				{ position: { x: 12, y: 216 }, type: "bullet1" },
				{ position: { x: 12, y: 256 }, type: "bullet2" },
				{ position: { x: 12, y: 296 }, type: "bullet3" },
				{ position: { x: 12, y: 332 }, type: "mine" }
			]
		},
		player2: {
			fleet: [
				{
					type: "boat1",
					direction: "E",
					position: { x: 6, y: 6 },
					status: "ok"
				},
				{
					type: "boat1",
					direction: "E",
					position: { x: 46, y: 6 },
					status: "ko"
				},
				{
					type: "boat2",
					direction: "E",
					position: { x: 6, y: 46 },
					status: "ok"
				},
				{
					type: "boat2",
					direction: "E",
					position: { x: 86, y: 46 },
					status: "ko"
				},
				{
					type: "boat3",
					direction: "E",
					position: { x: 6, y: 86 },
					status: "ok"
				},
				{
					type: "boat3",
					direction: "E",
					position: { x: 126, y: 86 },
					status: "ko"
				}
			],
			hits: [
				{ position: { x: 10, y: 50 }, type: "hitted1" },
				{ position: { x: 10, y: 90 }, type: "hitted2" },
				{ position: { x: 10, y: 130 }, type: "missed1" },
				{ position: { x: 10, y: 170 }, type: "missed2" }
			],
			weapons: [
				{ position: { x: 12, y: 216 }, type: "bullet1" },
				{ position: { x: 12, y: 256 }, type: "bullet2" },
				{ position: { x: 12, y: 296 }, type: "bullet3" },
				{ position: { x: 12, y: 332 }, type: "mine" }
			]
		}
	}
};

// ------------------------------------------------------------------

export const seabattleReducer: Reducer<State, SeabattleAction> = (
	state = { ...INITIAL_STATE },
	action: SeabattleAction
): State => {
	switch (action.type) {
		case "games/seabattle/FETCHING":
			return {
				...state,
				fetching: true,
				error: null
			};
		case "games/seabattle/FETCHED": {
			return {
				...state,
				fetching: false,
				error: null
			};
		}
		case "games/seabattle/ERROR":
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		case "games/seabattle/SET_BOAT_POSITION": {
			const oldPlayer = state.players[action.payload.playerId];
			const newPlayer = {
				...oldPlayer,
				fleet: [...oldPlayer.fleet]
			};
			newPlayer.fleet[action.payload.boatIndex] = {
				...oldPlayer.fleet[action.payload.boatIndex],
				direction: action.payload.direction,
				position: action.payload.position
			};
			const copy = {
				...state,
				players: {
					...state.players,
					[action.payload.playerId]: newPlayer
				}
			};
			return copy;
		}
		case "games/seabattle/RESET":
			return INITIAL_STATE;
		default:
			return state;
	}
};
