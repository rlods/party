import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { popModal, openModal } from "../../reducers/modals";
import { displayError } from "../../actions/messages";
import { connectUser } from "../../actions/user";
import { Dispatch } from "../../actions";
import { SECRET_FIELD_SIZE, InputField } from "../Modals/ModalFields";
import { DEFAULT_USER_DATABASE_ID } from "../../config/firebase";

// ------------------------------------------------------------------

export const ConnectUserModal = () => {
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
			dispatch(displayError("users.id_is_invalid"));
			return;
		}
		if (secret.trim().length === 0) {
			dispatch(displayError("users.secret_is_invalid"));
			return;
		}
		dispatch(
			connectUser(DEFAULT_USER_DATABASE_ID, userId, secret, {
				onSuccess: () => {
					dispatch(popModal());
				}
			})
		);
	}, [dispatch, userId, secret]);

	const onCreate = useCallback(
		() => dispatch(openModal({ type: "CreateUser", props: null })),
		[dispatch]
	);

	return (
		<FormModal
			title={t("users.connection")}
			onSubmit={onConnect}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							userId.trim().length === 0 ||
							userId.length !== 36 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("users.connect")}
						kind="primary"
						icon="sign-in"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
					<IconButton
						title={t("users.create")}
						kind="default"
						icon="plus"
						onClick={onCreate}
					/>
				</>
			)}>
			<InputField
				id="modal-userId"
				label={t("users.id")}
				type="text"
				placeholder={t("users.id_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={userId}
				ref={userIdRef}
				onChange={e => setUserId(e.target.value)}
			/>
			<InputField
				id="modal-secret"
				label={t("users.secret")}
				type="password"
				autoComplete="password"
				placeholder={t("users.secret_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={secret}
				onChange={e => setSecret(e.target.value)}
			/>
		</FormModal>
	);
};
