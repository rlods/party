import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";
import { unlockRoom } from "../../actions/room";
import { SECRET_FIELD_SIZE, InputField } from "../Modals/ModalFields";

// ------------------------------------------------------------------

export const UnlockRoomModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const [secret, setSecret] = useState("");
	const secretRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (secretRef.current) {
			secretRef.current.focus();
		}
	}, [secretRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onUnlock = useCallback(() => {
		dispatch(unlockRoom(secret));
		dispatch(popModal());
	}, [dispatch, secret]);

	return (
		<FormModal
			title={t("rooms.room_unlocking")}
			onSubmit={onUnlock}
			renderButtons={() => (
				<>
					<IconButton
						disabled={secret.length !== SECRET_FIELD_SIZE}
						title={t("rooms.unlock")}
						kind="primary"
						icon="unlock"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<InputField
				id="modal-secret"
				label={t("rooms.key")}
				type="password"
				autoComplete="password"
				placeholder={t("rooms.key_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={secret}
				ref={secretRef}
				onChange={e => setSecret(e.target.value)}
			/>
		</FormModal>
	);
};
