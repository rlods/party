import React, { FC, useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { RoomType, RoomTypes } from "../utils/rooms";
import { AppContext } from "../pages/App";
import {
	InputField,
	SecretField,
	SelectField,
	SECRET_FIELD_SIZE
} from "./ModalFields";

// ------------------------------------------------------------------

let ROOM_COUNTER = 1;

// ------------------------------------------------------------------

export type CreateRoomModalProps = {
	type: RoomType;
};

export const CreateRoomModal: FC<CreateRoomModalProps> = ({
	type: defaultType
}) => {
	const { onModalClose, onRoomCreate } = useContext(AppContext);
	const [name, setName] = useState("");
	const [secret, setSecret] = useState(v4());

	const [type, setType] = useState<RoomType>(defaultType);
	const nameRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setName(`${t("rooms.room")} ${ROOM_COUNTER}`);
		if (nameRef.current) {
			nameRef.current.focus();
		}
	}, [t, nameRef]);

	return (
		<FormModal
			title={t("rooms.room_creation")}
			onSubmit={() =>
				onRoomCreate(name, secret, type, {
					onSuccess: () => {
						onModalClose();
						ROOM_COUNTER++;
					}
				})
			}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							name.trim().length === 0 ||
							secret.length !== SECRET_FIELD_SIZE
						}
						title={t("rooms.create")}
						kind="primary"
						icon="check"
						type="submit"
					/>
					<CancelButton onClick={onModalClose} />
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
			<SelectField
				id="modal-type"
				label={t("rooms.type")}
				placeholder={t("rooms.type_placeholder")}
				options={RoomTypes.map(type => ({
					id: type,
					label: t(`rooms.types.${type}`)
				}))}
				value={type}
				onChange={e => setType(e.target.value as RoomType)}
			/>
		</FormModal>
	);
};
