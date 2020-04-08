import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import {
	SecretField,
	SECRET_FIELD_SIZE,
	InputField
} from "../Modals/ModalFields";
import { Dispatch } from "../../actions";
import { popModal } from "../../actions/modals";
import { createRoom } from "../../actions/room";
import { displayError } from "../../actions/messages";

// ------------------------------------------------------------------

let ROOM_COUNTER = 1;

// ------------------------------------------------------------------

export const CreateRoomModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const [name, setName] = useState("");
	const [secret, setSecret] = useState(v4());
	const nameRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setName(`${t("rooms.room")} ${ROOM_COUNTER}`);
		if (nameRef.current) {
			nameRef.current.focus();
		}
	}, [t, nameRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onCreate = useCallback(() => {
		if (name.trim().length === 0) {
			dispatch(displayError("rooms.name_is_invalid"));
			return;
		}
		if (secret.trim().length === 0) {
			dispatch(displayError("rooms.secret_is_invalid"));
			return;
		}
		dispatch(createRoom(name, secret));
		dispatch(popModal());
		ROOM_COUNTER++;
	}, [dispatch, name, secret]);

	return (
		<FormModal
			title={t("rooms.room_creation")}
			onSubmit={onCreate}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							name.trim().length === 0 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("rooms.create")}
						kind="primary"
						icon="plus"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<InputField
				id="modal-name"
				label={t("rooms.name")}
				type="text"
				placeholder={t("rooms.name_placeholder")}
				maxLength={100}
				minLength={2}
				required={true}
				value={name}
				ref={nameRef}
				onChange={e => setName(e.target.value)}
			/>
			<SecretField
				id="modal-secret"
				label={t("rooms.key")}
				placeholder={t("rooms.key_placeholder")}
				value={secret}
				onChange={setSecret}
			/>
		</FormModal>
	);
};
