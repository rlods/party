import React, { FC, MouseEvent, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
//
import { RootState } from "../reducers";
import { ModalPrereq } from "../reducers/modals";
import { ConfirmModal } from "./ConfirmModal";
import { ConnectUserModal } from "./ConnectUserModal";
import { CreateRoomModal } from "./CreateRoomModal";
import { CreateUserModal } from "./CreateUserModal";
import { HelpModal } from "./HelpModal";
import { GameOverModal } from "./GameOverModal";
import { SeaBattleHelpModal } from "./SeaBattleHelpModal";
import { SearchModal } from "./SearchModal";
import { JoinRoomModal } from "./JoinRoomModal";
import { UnlockRoomModal } from "./UnlockRoomModal";
import { AppContext } from "../pages/AppContext";
import "./index.scss";

// ------------------------------------------------------------------

const TRANSITION_TIMEOUT = 300;

// ------------------------------------------------------------------

export const getModal = (prereq?: ModalPrereq) => {
	if (prereq) {
		switch (prereq.type) {
			// General
			case "General/Confirm":
				return <ConfirmModal {...prereq.props} />;
			case "General/Help":
				return <HelpModal />;
			// User
			case "User/Connect":
				return <ConnectUserModal {...prereq.props} />;
			case "User/Create":
				return <CreateUserModal {...prereq.props} />;
			// Room
			case "Room/Create":
				return <CreateRoomModal {...prereq.props} />;
			case "Room/Join":
				return <JoinRoomModal />;
			case "Room/Search":
				return <SearchModal />;
			case "Room/Unlock":
				return <UnlockRoomModal {...prereq.props} />;
			// SeaBattle
			case "SeaBattle/GameOver":
				return <GameOverModal {...prereq.props} />;
			case "SeaBattle/Help":
				return <SeaBattleHelpModal {...prereq.props} />;
		}
	}
	return null;
};

// ------------------------------------------------------------------

export const Modals: FC = () => {
	const { onModalPop } = useContext(AppContext);
	const prereq = useSelector<RootState, ModalPrereq | undefined>(state =>
		state.modals.stack.length > 0
			? state.modals.stack[state.modals.stack.length - 1]
			: void 0
	);

	const [currPrereq, setCurrPrereq] = useState<ModalPrereq | undefined>(
		void 0
	);
	const [prevPrereq, setPrevPrereq] = useState<ModalPrereq | undefined>(
		void 0
	);

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.keyCode === 27) {
				onModalPop();
			}
		};

		document.addEventListener("keydown", keyDown);

		return () => {
			document.removeEventListener("keydown", keyDown);
		};
	}, [onModalPop]);

	useEffect(() => {
		// Hide current modal before showing new one (if there is a new one)
		setCurrPrereq(void 0);
		setPrevPrereq(prereq);
	}, [prereq]);

	useEffect(() => {
		if (prereq) {
			setTimeout(() => {
				setCurrPrereq(prereq);
			}, TRANSITION_TIMEOUT);
		}
	}, [prereq]);

	const modal = getModal(currPrereq || prevPrereq);
	return (
		<CSSTransition
			in={!!currPrereq}
			timeout={TRANSITION_TIMEOUT}
			unmountOnExit={true}>
			<div
				className="ModalOverlay"
				onClick={e => {
					// Clicking overlay will close current modal
					e.stopPropagation();
					onModalPop();
				}}>
				{modal && (
					<div
						className="ModalWrapper"
						role="dialog"
						onClick={(e: MouseEvent) => {
							// Clicking wrapper modal will not progagate to overlay which would close current modal
							e.stopPropagation();
						}}>
						{modal}
					</div>
				)}
			</div>
		</CSSTransition>
	);
};
