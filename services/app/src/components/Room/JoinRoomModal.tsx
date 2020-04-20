import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { InputField } from "../Modals/ModalFields";
import { Dispatch } from "../../actions";
import { popModal, openModal } from "../../reducers/modals";
import { displayError } from "../../actions/messages";
import { enterRoom } from "../../actions/room";
import { DEFAULT_ROOM_DATABASE_ID } from "../../config/firebase";

// ------------------------------------------------------------------

export const JoinRoomModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const [roomId, setRoomId] = useState("");
	const roomIdRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (roomIdRef.current) {
			roomIdRef.current.focus();
		}
	}, [roomIdRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onJoin = useCallback(() => {
		if (roomId.trim().length === 0) {
			dispatch(displayError("rooms.id_is_invalid"));
			return;
		}
		dispatch(
			enterRoom(DEFAULT_ROOM_DATABASE_ID, roomId, "", {
				onSuccess: () => {
					dispatch(popModal());
				}
			})
		);
	}, [dispatch, roomId]);

	const onCreate = useCallback(
		() => dispatch(openModal({ type: "CreateRoom", props: null })),
		[dispatch]
	);

	return (
		<FormModal
			title={t("rooms.room_join")}
			onSubmit={onJoin}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							roomId.trim().length === 0 || roomId.length !== 36
						}
						title={t("rooms.join")}
						kind="primary"
						icon="sign-in"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
					<IconButton
						title={t("rooms.create")}
						kind="default"
						icon="plus"
						onClick={onCreate}
					/>
				</>
			)}>
			<InputField
				id="modal-roomId"
				label={t("rooms.id")}
				type="text"
				placeholder={t("rooms.id_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={roomId}
				ref={roomIdRef}
				onChange={e => setRoomId(e.target.value)}
			/>
		</FormModal>
	);
};
