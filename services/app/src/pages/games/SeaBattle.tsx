import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { SeaBattlePlayerControls } from "../../components/SeaBattle/PlayerControls";
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
import { SeaBattleOpponentControls } from "../../components/SeaBattle/OpponentControls";
import { IconButton } from "../../components/Common/IconButton";
import {
	extractBattleInfo,
	MAX_PLAYER_COUNT,
	SeaBattleMovementType,
	SeaBattlePosition,
	SeaBattleWeaponType,
	AngleToDirection
} from "../../utils/games/seabattle";
import { displayInfo } from "../../actions/messages";
import { openModal } from "../../reducers/modals";
import "./SeaBattle.scss";

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
		state => state.user.access.userId
	);

	const extra = useSelector<RootState, string>(
		state => state.room.info?.extra || ""
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

	const onConnectUser = useCallback(
		() => dispatch(openModal({ type: "CreateUser", props: null })),
		[dispatch]
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
				<SeaBattlePlayerControls
					boat={boat}
					disabled={!boat}
					onMoveForward={() => onMove("move-forward")}
					onMoveBackward={() => onMove("move-backward")}
					onRotateLeft={() => onMove("rotate-left")}
					onRotateRight={() => onMove("rotate-right")}
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
									title={t("users.connect")}
									size="L"
									displayTitle={true}
									onClick={onConnectUser}
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
				/>
				<Map
					map={
						opponentMaps && opponentMaps.length > 0
							? opponentMaps[opponentIndex]
							: void 0
					}
					hideFleet={true}
					onCellClick={onOpponentCellClick}
				/>
			</div>
		</div>
	);
};
