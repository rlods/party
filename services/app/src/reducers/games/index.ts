import { combineReducers } from "redux";
import { seabattleReducer as seabattle } from "./seabattle";

export type GamesState = ReturnType<typeof gamesReducer>;

export const gamesReducer = combineReducers({
	seabattle
});
