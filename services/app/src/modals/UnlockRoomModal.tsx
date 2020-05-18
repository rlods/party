import React, { FC, useRef, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { TrySomethingOptions } from "../actions";
import { SECRET_FIELD_SIZE, InputField } from "./ModalFields";
import { AppContext } from "../pages/AppContext";
import { CommonContext } from "../components/Common/CommonContext";

// ------------------------------------------------------------------

type UnlockRoomModalProps = { options?: TrySomethingOptions };

export const renderUnlockRoomModal = (props: UnlockRoomModalProps) => (
	<UnlockRoomModal {...props} />
);

export const UnlockRoomModal: FC<UnlockRoomModalProps> = ({ options }) => {
	const { onRoomUnlock } = useContext(AppContext);
	const { onModalClose } = useContext(CommonContext);
	const [secret, setSecret] = useState("");
	const secretRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (secretRef.current) {
			secretRef.current.focus();
		}
	}, [secretRef]);

	return (
		<FormModal
			title={t("rooms.room_unlocking")}
			onSubmit={() =>
				onRoomUnlock(secret, {
					onSuccess: () => {
						if (options?.onSuccess) {
							options.onSuccess();
						}
						onModalClose();
					}
				})
			}
			renderButtons={() => (
				<>
					<IconButton
						disabled={secret.length !== SECRET_FIELD_SIZE}
						title={t("rooms.unlock")}
						kind="primary"
						icon="unlock"
						type="submit"
					/>
					<CancelButton onClick={onModalClose} />
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
