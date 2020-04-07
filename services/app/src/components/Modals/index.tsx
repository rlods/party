import React, { MouseEvent, useState, useEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
//
import { ModalPrereq, popModal } from "../../actions/modals";
import { ConfirmModal } from "./ConfirmModal";
import { ConnectUserModal } from "../Users/ConnectUserModal";
import { CreateRoomModal } from "../Room/CreateRoomModal";
import { CreateUserModal } from "..//Users/CreateUserModal";
import { SearchModal } from "..//Room/SearchModal";
import { UnlockRoomModal } from "../Room/UnlockRoomModal";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "../../actions";
import { RootState } from "../../reducers";

// ------------------------------------------------------------------

const TRANSITION_TIMEOUT = 300;

// ------------------------------------------------------------------

export const getModal = (prereq?: ModalPrereq) => {
	if (prereq) {
		switch (prereq.type) {
			case "Confirm":
				return <ConfirmModal {...prereq.props} />;
			case "ConnectUser":
				return <ConnectUserModal />;
			case "CreateRoom":
				return <CreateRoomModal />;
			case "CreateUser":
				return <CreateUserModal />;
			case "Search":
				return <SearchModal />;
			case "UnlockRoom":
				return <UnlockRoomModal />;
		}
	}
	return null;
};

// ------------------------------------------------------------------

export const Modals = () => {
	const dispatch = useDispatch<Dispatch>();

	const { prereq } = useSelector<RootState, { prereq?: ModalPrereq }>(
		state => ({
			prereq:
				state.modals.stack.length > 0
					? state.modals.stack[state.modals.stack.length - 1]
					: void 0
		})
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
	});

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
	}, [prereq, prevPrereq]);

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
