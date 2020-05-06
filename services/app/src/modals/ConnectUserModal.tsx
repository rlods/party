import React, { FC, useRef, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { TrySomethingOptions } from "../actions";
import { SECRET_FIELD_SIZE, InputField } from "./ModalFields";
import { AppContext } from "../pages/AppContext";

// ------------------------------------------------------------------

export type ConnectUserModalProps = { options?: TrySomethingOptions };

export const ConnectUserModal: FC<ConnectUserModalProps> = ({ options }) => {
	const { onModalClose, onUserConnect } = useContext(AppContext);
	const [userId, setUserId] = useState("");
	const [secret, setSecret] = useState("");
	const userIdRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (userIdRef.current) {
			userIdRef.current.focus();
		}
	}, [userIdRef]);

	return (
		<FormModal
			title={t("user.connection")}
			onSubmit={() => {
				onUserConnect(userId, secret, {
					onSuccess: () => {
						if (options?.onSuccess) {
							options.onSuccess();
						}
						onModalClose();
					}
				});
			}}
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
					<CancelButton onClick={onModalClose} />
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
