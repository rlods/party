import React, { FC, useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { InputField, SelectField } from "./ModalFields";
import firebaseConfig, { selectRoomDatabaseId } from "../config/firebase";
import { AppContext } from "../pages/AppContext";
import { CommonContext } from "../components/Common/CommonContext";

// ------------------------------------------------------------------

export const JoinRoomModal: FC = () => {
	const { onRoomEnter } = useContext(AppContext);
	const { onModalClose } = useContext(CommonContext);
	const [dbId, setDbId] = useState(selectRoomDatabaseId());
	const [roomId, setRoomId] = useState("");
	const roomIdRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (roomIdRef.current) {
			roomIdRef.current.focus();
		}
	}, [roomIdRef]);

	return (
		<FormModal
			title={t("rooms.room_join")}
			onSubmit={() =>
				onRoomEnter(
					{
						dbId,
						roomId,
						secret: ""
					},
					{
						onSuccess: onModalClose
					}
				)
			}
			renderButtons={() => (
				<>
					<IconButton
						disabled={
							roomId.trim().length === 0 || roomId.length !== 36
						}
						title={t("rooms.join")}
						kind="primary"
						icon="check"
						type="submit"
					/>
					<CancelButton onClick={onModalClose} />
				</>
			)}>
			<SelectField
				id="modal-serverId"
				label={t("rooms.server_id")}
				placeholder={t("rooms.server_id_placeholder")}
				options={firebaseConfig.dbIDs
					.sort((s1, s2) => s1.localeCompare(s2))
					.map(otherId => ({
						id: otherId,
						label: otherId
					}))}
				value={dbId}
				onChange={e => setDbId(e.target.value)}
			/>
			<InputField
				id="modal-roomId"
				label={t("rooms.id")}
				type="text"
				placeholder={t("rooms.id_placeholder")}
				maxLength={36}
				minLength={36}
				required={true}
				value={roomId}
				ref={roomIdRef}
				onChange={e => setRoomId(e.target.value)}
			/>
		</FormModal>
	);
};
