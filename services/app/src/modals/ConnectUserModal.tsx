import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { popModal } from "../reducers/modals";
import { displayError } from "../actions/messages";
import { connectUser } from "../actions/user";
import { Dispatch, ActionOptions } from "../actions";
import { SECRET_FIELD_SIZE, InputField } from "./ModalFields";
import { selectUserDatabaseId } from "../config/firebase";

// ------------------------------------------------------------------

export type ConnectUserModalProps = { options?: ActionOptions };

export const ConnectUserModal: FC<ConnectUserModalProps> = ({ options }) => {
	const dispatch = useDispatch<Dispatch>();
	const [userId, setUserId] = useState("");
	const [secret, setSecret] = useState("");
	const userIdRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (userIdRef.current) {
			userIdRef.current.focus();
		}
	}, [userIdRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onConnect = useCallback(() => {
		if (userId.trim().length === 0) {
			dispatch(displayError("user.id_is_invalid"));
			return;
		}
		if (secret.trim().length === 0) {
			dispatch(displayError("user.secret_is_invalid"));
			return;
		}
		dispatch(
			connectUser({
				dbId: selectUserDatabaseId(),
				userId,
				secret,
				options: {
					onSuccess: () => {
						if (options && options.onSuccess) {
							options.onSuccess();
						}
						dispatch(popModal());
					}
				}
			})
		);
	}, [dispatch, userId, secret, options]);

	return (
		<FormModal
			title={t("user.connection")}
			onSubmit={onConnect}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							userId.trim().length === 0 ||
							userId.length !== 36 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("user.connect")}
						kind="primary"
						icon="check"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<InputField
				id="modal-userId"
				label={t("user.id")}
				type="text"
				placeholder={t("user.id_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={userId}
				ref={userIdRef}
				onChange={e => setUserId(e.target.value)}
			/>
			<InputField
				id="modal-secret"
				label={t("user.secret")}
				type="password"
				autoComplete="password"
				placeholder={t("user.secret_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={secret}
				onChange={e => setSecret(e.target.value)}
			/>
		</FormModal>
	);
};
