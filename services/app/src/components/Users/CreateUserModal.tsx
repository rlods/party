import React, { FC, useState, useEffect, useRef, useCallback } from "react";
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
import { popModal } from "../../reducers/modals";
import { displayError } from "../../actions/messages";
import { createUser } from "../../actions/user";
import { Dispatch, ActionOptions } from "../../actions";
import { selectUserDatabaseId } from "../../config/firebase";

// ------------------------------------------------------------------

let USER_COUNTER = 1;

// ------------------------------------------------------------------

export type CreateUserModalProps = { options?: ActionOptions };

export const CreateUserModal: FC<CreateUserModalProps> = ({ options }) => {
	const dispatch = useDispatch<Dispatch>();
	const [name, setName] = useState("");
	const [secret, setSecret] = useState(v4());
	const nameRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setName(`${t("users.user")} ${USER_COUNTER}`);
		if (nameRef.current) {
			nameRef.current.focus();
		}
	}, [t, nameRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onCreate = useCallback(() => {
		if (name.trim().length === 0) {
			dispatch(displayError("users.name_is_invalid"));
			return;
		}
		if (secret.trim().length === 0) {
			dispatch(displayError("users.secret_is_invalid"));
			return;
		}
		dispatch(
			createUser(selectUserDatabaseId(), name, secret, {
				onSuccess: () => {
					if (options && options.onSuccess) {
						options.onSuccess();
					}
					dispatch(popModal());
				}
			})
		);
		USER_COUNTER++;
	}, [dispatch, name, secret, options]);

	return (
		<FormModal
			title={t("users.user_creation")}
			onSubmit={onCreate}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							name.trim().length === 0 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("users.create")}
						kind="primary"
						icon="sign-in"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<InputField
				id="modal-name"
				label={t("users.name")}
				type="text"
				placeholder={t("users.name_placeholder")}
				maxLength={100}
				minLength={2}
				required={true}
				value={name}
				ref={nameRef}
				onChange={e => setName(e.target.value)}
			/>
			<SecretField
				id="modal-secret"
				label={t("users.secret")}
				placeholder={t("users.secret_placeholder")}
				value={secret}
				onChange={newSecret => setSecret(newSecret)}
			/>
		</FormModal>
	);
};
