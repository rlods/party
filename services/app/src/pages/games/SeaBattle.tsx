import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { PlayerControls } from "../../components/SeaBattle/PlayerControls";
import { Map } from "../../components/SeaBattle/Map";
import { RootState } from "../../reducers";
import { SeaBattleKeyboardMoveMappings } from "../../utils/games/seabattle/mappings";
import { Dispatch } from "../../actions";
import {
	moveBoat,
	joinBattle,
	attackOpponent
} from "../../actions/games/seabattle";
import { KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT } from "../../utils/keyboards";
import { OpponentControls } from "../../components/SeaBattle/OpponentControls";
import { generateRandomPosition } from "../../utils/player";
import { selectTracksCount } from "../../selectors/medias";
import { IconButton } from "../../components/Common/IconButton";
import { setRoom } from "../../reducers/room";
import { RoomInfo } from "../../utils/rooms";
import {
	extractBattleInfo,
	MAX_PLAYER_COUNT,
	SeaBattleMovementType,
	SeaBattlePosition,
	SeaBattleWeaponType,
	AngleToDirection
} from "../../utils/games/seabattle";
import "./SeaBattle.scss";
import { displayInfo } from "../../actions/messages";

// ------------------------------------------------------------------

export const SeaBattle = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const [boatIndex, setSelectedBoatIndex] = useState<number>(-1);
	const [opponentIndex, setSelectedOpponent] = useState<number>(0);
	const [weaponType, setSelectedWeaponType] = useState<
		SeaBattleWeaponType | undefined
	>();

	const userId = useSelector<RootState, string>(
		state => state.user.access.id
	);

	const tracksCount = useSelector<RootState, number>(selectTracksCount);

	const extra = useSelector<RootState, string>(
		state => state.room.info?.extra || ""
	);

	const roomInfo = useSelector<RootState, RoomInfo | null>(
		state => state.room.info
	);

	const { boat, opponentMaps, playerMap } = extractBattleInfo({
		extra,
		userId,
		boatIndex,
		weaponType
	});

	const onJoinBattle = useCallback(() => {
		dispatch(joinBattle());
	}, [dispatch]);

	const onPlayNext = useCallback(() => {
		if (!roomInfo || tracksCount === 0) {
			return;
		}
		dispatch(
			setRoom({
				info: {
					...roomInfo,
					queue_position: generateRandomPosition() % tracksCount
				}
			})
		);
	}, [dispatch, roomInfo, tracksCount]);

	const onMove = useCallback(
		(movement: SeaBattleMovementType) => {
			dispatch(
				moveBoat({
					boatIndex,
					movement
				})
			);
		},
		[dispatch, boatIndex]
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (
				e.repeat ||
				(e.keyCode !== KEY_UP &&
					e.keyCode !== KEY_DOWN &&
					e.keyCode !== KEY_LEFT &&
					e.keyCode !== KEY_RIGHT)
			) {
				return;
			}
			e.preventDefault(); // to prevent scrolling with keyboard
			if (!boat) {
				return;
			}
			onMove(
				SeaBattleKeyboardMoveMappings[AngleToDirection(boat.angle)][
					e.keyCode
				]
			);
		},
		[onMove, boat]
	);

	const onOpponentCellClick = useCallback(
		(position: SeaBattlePosition) => {
			if (!opponentMaps || opponentMaps.length === 0) {
				dispatch(displayInfo("games.no_opponents_to_attack"));
				return;
			}
			if (!weaponType) {
				dispatch(displayInfo("games.seabattle.no_weapon_selected"));
				return;
			}

			dispatch(attackOpponent({ opponentIndex, position, weaponType }));
		},
		[dispatch, opponentIndex, opponentMaps, weaponType]
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

	return (
		<div className="SeaBattle">
			<div className="SeaBattlePlayer current">
				<PlayerControls
					boat={boat}
					disabled={!boat}
					onPlayNext={onPlayNext}
					onMoveForward={() => onMove("move-forward")}
					onMoveBackward={() => onMove("move-backward")}
					onRotateLeft={() => onMove("rotate-left")}
					onRotateRight={() => onMove("rotate-right")}
				/>
				{playerMap ? (
					<Map
						map={playerMap}
						selectedBoatIndex={boatIndex}
						onSelectBoatIndex={setSelectedBoatIndex}
					/>
				) : (
					<div className="SeaBattleJoin">
						{opponentMaps &&
						opponentMaps.length >= MAX_PLAYER_COUNT ? (
							<span>{t("games.max_players_count")}</span>
						) : (
							<>
								<span>{t("games.watch_or_join")}</span>
								<IconButton
									icon="sign-in"
									title={t("games.seabattle.join_battle")}
									size="L"
									displayTitle={true}
									onClick={onJoinBattle}
								/>
							</>
						)}
					</div>
				)}
			</div>
			<div className="SeaBattlePlayer other">
				<OpponentControls
					opponentsCount={opponentMaps?.length || 0}
					opponentIndex={opponentIndex}
					onSelectPreviousOpponent={
						opponentMaps && opponentMaps.length > 0
							? () =>
									setSelectedOpponent(
										opponentIndex === 0
											? opponentMaps.length - 1
											: opponentIndex - 1
									)
							: void 0
					}
					onSelectNextOpponent={
						opponentMaps && opponentMaps.length > 0
							? () =>
									setSelectedOpponent(
										(opponentIndex + 1) %
											opponentMaps?.length
									)
							: void 0
					}
					onSelectWeaponType={setSelectedWeaponType}
					weapons={playerMap?.weapons || {}}
				/>
				<Map
					map={
						opponentMaps && opponentMaps.length > 0
							? opponentMaps[opponentIndex]
							: void 0
					}
					hideActiveFleet={true}
					onCellClick={onOpponentCellClick}
				/>
			</div>
		</div>
	);
};
