import React, { FC, MouseEvent, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
//
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";
import { ModalPrereq, popModal } from "../../reducers/modals";
import { ConfirmModal } from "./ConfirmModal";
import { ConnectUserModal } from "../Users/ConnectUserModal";
import { CreateRoomModal } from "../Room/CreateRoomModal";
import { CreateUserModal } from "../Users/CreateUserModal";
import { HelpModal } from "./HelpModal";
import { SeaBattleGameOverModal } from "../SeaBattle/GameOverModal";
import { SeaBattleHelpModal } from "../SeaBattle/HelpModal";
import { SearchModal } from "../Room/SearchModal";
import { JoinRoomModal } from "../Room/JoinRoomModal";
import { UnlockRoomModal } from "../Room/UnlockRoomModal";
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
				return <SeaBattleGameOverModal {...prereq.props} />;
			case "SeaBattle/Help":
				return <SeaBattleHelpModal />;
		}
	}
	return null;
};

// ------------------------------------------------------------------

export const Modals: FC = () => {
	const dispatch = useDispatch<Dispatch>();
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

	const onPopModal = useCallback(() => dispatch(popModal()), [dispatch]);

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.keyCode === 27) {
				onPopModal();
			}
		};

		document.addEventListener("keydown", keyDown);

		return () => {
			document.removeEventListener("keydown", keyDown);
		};
	}, [onPopModal]);

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
					onPopModal();
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
