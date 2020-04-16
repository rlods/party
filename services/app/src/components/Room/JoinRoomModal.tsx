import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { InputField } from "../Modals/ModalFields";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";
import { displayError } from "../../actions/messages";
import { enterRoom } from "../../actions/room";

// ------------------------------------------------------------------

export const JoinRoomModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const [id, setId] = useState("");
	const idRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (idRef.current) {
			idRef.current.focus();
		}
	}, [idRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onJoin = useCallback(() => {
		if (id.trim().length === 0) {
			dispatch(displayError("rooms.id_is_invalid"));
			return;
		}
		dispatch(enterRoom(id, ""));
		dispatch(popModal());
	}, [dispatch, id]);

	return (
		<FormModal
			title={t("rooms.room_join")}
			onSubmit={onJoin}
			renderButtons={() => (
				<>
					<IconButton
						disabled={id.trim().length === 0 || id.length !== 36}
						title={t("rooms.join")}
						kind="primary"
						icon="plus"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<InputField
				id="modal-id"
				label={t("rooms.id")}
				type="text"
				placeholder={t("rooms.id_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={id}
				ref={idRef}
				onChange={e => setId(e.target.value)}
			/>
		</FormModal>
	);
};
