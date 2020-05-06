import React, { FC, useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { TrySomethingOptions } from "../actions";
import { SecretField, SECRET_FIELD_SIZE, InputField } from "./ModalFields";
import { AppContext } from "../pages/App";

// ------------------------------------------------------------------

let USER_COUNTER = 1;

// ------------------------------------------------------------------

export type CreateUserModalProps = { options?: TrySomethingOptions };

export const CreateUserModal: FC<CreateUserModalProps> = ({ options }) => {
	const { onModalClose, onUserCreate } = useContext(AppContext);
	const [name, setName] = useState("");
	const [secret, setSecret] = useState(v4());
	const nameRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setName(`${t("user.user")} ${USER_COUNTER}`);
		if (nameRef.current) {
			nameRef.current.focus();
		}
	}, [t, nameRef]);

	return (
		<FormModal
			title={t("user.user_creation")}
			onSubmit={() => {
				onUserCreate(name, secret, {
					onSuccess: () => {
						if (options?.onSuccess) {
							options.onSuccess();
						}
						onModalClose();
						USER_COUNTER++;
					}
				});
			}}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							name.trim().length === 0 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("user.create")}
						kind="primary"
						icon="check"
						type="submit"
					/>
					<CancelButton onClick={onModalClose} />
				</>
			)}>
			<InputField
				id="modal-name"
				label={t("user.name")}
				type="text"
				placeholder={t("user.name_placeholder")}
				maxLength={100}
				minLength={2}
				required={true}
				value={name}
				ref={nameRef}
				onChange={e => setName(e.target.value)}
			/>
			<SecretField
				id="modal-secret"
				label={t("user.secret")}
				placeholder={t("user.secret_placeholder")}
				value={secret}
				onChange={newSecret => setSecret(newSecret)}
			/>
		</FormModal>
	);
};
