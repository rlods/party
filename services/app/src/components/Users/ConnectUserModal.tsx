import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { popModal, openModal } from "../../actions/modals";
import { displayError } from "../../actions/messages";
import { connectUser } from "../../actions/user";
import { Dispatch } from "../../actions";
import { SECRET_FIELD_SIZE } from "../Modals/SecretField";

// ------------------------------------------------------------------

export const ConnectUserModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const [id, setId] = useState("");
	const [secret, setSecret] = useState("");
	const idRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (idRef.current) {
			idRef.current.focus();
		}
	});

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onConnect = useCallback(() => {
		if (id.trim().length === 0) {
			dispatch(displayError("users.id_is_invalid"));
			return;
		}
		if (secret.trim().length === 0) {
			dispatch(displayError("users.secret_is_invalid"));
			return;
		}
		dispatch(connectUser(id, secret));
		dispatch(popModal());
	}, [dispatch, id, secret]);

	const onToggle = useCallback(
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
							id.trim().length === 0 ||
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
						onClick={onToggle}
					/>
				</>
			)}>
			<div className="ModalField">
				<label htmlFor="modal-id">{t("users.user_id")}</label>
				<input
					id="modal-id"
					type="text"
					placeholder={t("users.id_placeholder")}
					maxLength={36}
					minLength={36}
					required={true}
					value={id}
					ref={idRef}
					onChange={e => setId(e.target.value)}
				/>
			</div>
			<div className="ModalField">
				<label htmlFor="modal-secret">{t("users.secret")}</label>
				<input
					id="modal-secret"
					type="password"
					autoComplete="password"
					placeholder={t("users.secret_placeholder")}
					maxLength={36}
					minLength={36}
					required={true}
					value={secret}
					onChange={e => setSecret(e.target.value)}
				/>
			</div>
		</FormModal>
	);
};
