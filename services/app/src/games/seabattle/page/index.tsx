import React, { FC, useState, useEffect, useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { SeaBattlePlayerControls } from "../components/PlayerControls";
import { Map } from "../components/Map";
import { RootState } from "../../../reducers";
import { SeaBattleKeyboardMoveMappings } from "../utils/mappings";
import { Dispatch } from "../../../actions";
import { moveBoat, joinBattle, attackOpponent } from "../actions";
import { SeaBattleOpponentControls } from "../components/OpponentControls";
import { IconButton } from "../../../components/Common/IconButton";
import { Messages } from "../../../components/Common/Messages";
import { WeaponSelection } from "../components/WeaponSelection";
import { RoomControls } from "../../../components/Room/RoomControls";
import { selectUserId } from "../../../selectors/user";
import { selectExtraDecoded } from "../../../selectors/room";
import { AppContext } from "../../../pages/AppContext";
import {
	extractBattleInfo,
	MAX_PLAYER_COUNT,
	SeaBattleMovementType,
	SeaBattlePosition,
	SeaBattleWeaponType,
	AngleToDirection,
	SeaBattleData
} from "../utils";
import {
	KEY_UP,
	KEY_DOWN,
	KEY_LEFT,
	KEY_RIGHT
} from "../../../utils/keyboards";
import "./index.scss";

// ------------------------------------------------------------------

export const PLAYER_TURN_MESSAGE_TAG = "seabattle/player_turn";

// ------------------------------------------------------------------

export const SeaBattle: FC = () => {
	const {
		onDisplayInfo,
		onMessagesClear,
		onModalOpen,
		onQueueAppend,
		onPlayerSetMode,
		onPlayerStart,
		onRoomLock,
		onUserCreateAsk
	} = useContext(AppContext);
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const [previousMapIndex, setPreviousMapIndex] = useState<number>(-1);
	const [boatIndex, setSelectedBoatIndex] = useState<number>(-1);
	const [opponentIndex, setSelectedOpponent] = useState<number>(0);
	const [weaponType, setSelectedWeaponType] = useState<SeaBattleWeaponType>(
		"bullet1"
	);

	const userId = useSelector<RootState, string>(selectUserId);

	const battle = useSelector<RootState, SeaBattleData | null>(
		selectExtraDecoded
	);

	const {
		boat,
		currentMapIndex,
		opponentMaps,
		playerMap,
		playerMapIndex
	} = extractBattleInfo({
		battle,
		userId,
		boatIndex
	});

	const onJoinBattle = useCallback(
		() =>
			dispatch(
				joinBattle({
					onFailure: onRoomLock
				})
			),
		[dispatch, onRoomLock]
	);

	const onMoveBoat = useCallback(
		(movement: SeaBattleMovementType) =>
			dispatch(
				moveBoat(
					{
						boatIndex,
						movement
					},
					{
						onFailure: onRoomLock
					}
				)
			),
		[dispatch, boatIndex, onRoomLock]
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
			onMoveBoat(
				SeaBattleKeyboardMoveMappings[AngleToDirection(boat.angle)][
					e.keyCode
				]
			);
		},
		[onMoveBoat, boat]
	);

	const onAttackOpponent = useCallback(
		(position: SeaBattlePosition) => {
			if (!opponentMaps || opponentMaps.length === 0) {
				onDisplayInfo("games.no_opponents_to_attack");
				return;
			}
			if (!weaponType) {
				onDisplayInfo("games.seabattle.no_weapon_selected");
				return;
			}
			dispatch(
				attackOpponent(
					{ opponentIndex, position, weaponType },
					{
						onFailure: onRoomLock
					}
				)
			);
		},
		[
			dispatch,
			opponentIndex,
			opponentMaps,
			weaponType,
			onRoomLock,
			onDisplayInfo
		]
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		onQueueAppend([
			{
				id: "301013", // Pirates Of The Caribbean OST
				provider: "deezer",
				type: "album"
			},
			{
				id: "7358507", // Stalingrad OST
				provider: "deezer",
				type: "album"
			},
			{
				id: "558976", // Master & Commander OST
				provider: "deezer",
				type: "album"
			},
			{
				id: "87375582", // Le chant du loup OST
				provider: "deezer",
				type: "album"
			}
		]);

		onPlayerSetMode("shuffle");
		onPlayerStart();

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown, onPlayerSetMode, onPlayerStart, onQueueAppend]);

	useEffect(() => {
		if (previousMapIndex !== currentMapIndex) {
			onMessagesClear(PLAYER_TURN_MESSAGE_TAG);
			if (playerMap?.status === "ko") {
				onModalOpen({
					type: "SeaBattle/GameOver",
					props: {
						roomType: "seabattle",
						status: "looser"
					}
				});
			} else if (opponentMaps && opponentMaps.length > 0) {
				if (
					!opponentMaps.find(
						opponentMap => opponentMap.status !== "ko"
					)
				) {
					onModalOpen({
						type: "SeaBattle/GameOver",
						props: {
							roomType: "seabattle",
							status: "winner"
						}
					});
				} else if (currentMapIndex === playerMapIndex) {
					onDisplayInfo("games.seabattle.player_turn", {
						autoclear: false,
						closable: false,
						tag: PLAYER_TURN_MESSAGE_TAG,
						weight: 1000000
					});
				} else {
					onDisplayInfo("games.seabattle.opponent_turn", {
						autoclear: false,
						closable: false,
						tag: PLAYER_TURN_MESSAGE_TAG,
						weight: 1000000
					});
				}
			}
			setPreviousMapIndex(currentMapIndex);
		}
	}, [
		currentMapIndex,
		dispatch,
		opponentMaps,
		playerMap,
		playerMapIndex,
		previousMapIndex,
		onMessagesClear,
		onDisplayInfo,
		onModalOpen
	]);

	return (
		<>
			<div className="SeaBattle">
				<div className="SeaBattlePlayer current">
					<SeaBattlePlayerControls
						boat={boat}
						disabled={!boat}
						onMove={onMoveBoat}
					/>
					{playerMap ? (
						<Map
							map={playerMap}
							hideFleet={false}
							selectedBoatIndex={boatIndex}
							onSelectBoatIndex={setSelectedBoatIndex}
						/>
					) : (
						<div className="SeaBattleJoin">
							{opponentMaps &&
							opponentMaps.length >= MAX_PLAYER_COUNT ? (
								<span>{t("games.max_players_count")}</span>
							) : !userId ? (
								<>
									<span>{t("games.connect_to_join")}</span>
									<IconButton
										icon="sign-in"
										title={t("user.connect")}
										size="L"
										displayTitle={true}
										onClick={onUserCreateAsk}
									/>
								</>
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
					<SeaBattleOpponentControls
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
						weaponType={weaponType}
					/>
					<Map
						map={
							opponentMaps && opponentMaps.length > 0
								? opponentMaps[opponentIndex]
								: void 0
						}
						hideFleet={true}
						onCellClick={onAttackOpponent}
					/>
				</div>
			</div>
			<RoomControls
				extended={false}
				onHelp={() => {
					onModalOpen({
						type: "SeaBattle/Help",
						props: {
							renderWeapons: () => (
								<WeaponSelection
									weapons={{
										bullet1: 1,
										bullet2: 1,
										bullet3: 0,
										mine: 1
									}}
									weaponType={"bullet1"}
								/>
							)
						}
					});
				}}
			/>
			<Messages bottomPosition="50px" />
		</>
	);
};
