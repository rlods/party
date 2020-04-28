import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { InputField, SelectField } from "../Modals/ModalFields";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";
import { displayError } from "../../actions/messages";
import { enterRoom } from "../../actions/room";
import config, { selectRoomDatabaseId } from "../../config/firebase";

// ------------------------------------------------------------------

export const JoinRoomModal: FC = () => {
	const dispatch = useDispatch<Dispatch>();
	const [dbId, setDbId] = useState(selectRoomDatabaseId());
	const [roomId, setRoomId] = useState("");
	const roomIdRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (roomIdRef.current) {
			roomIdRef.current.focus();
		}
	}, [roomIdRef]);

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onJoin = useCallback(() => {
		if (dbId.trim().length === 0) {
			dispatch(displayError("rooms.id_is_invalid"));
			return;
		}
		if (roomId.trim().length === 0) {
			dispatch(displayError("rooms.id_is_invalid"));
			return;
		}
		dispatch(
			enterRoom({
				dbId,
				roomId,
				secret: "",
				options: {
					onSuccess: () => {
						dispatch(popModal());
					}
				}
			})
		);
	}, [dispatch, roomId, dbId]);

	return (
		<FormModal
			title={t("rooms.room_join")}
			onSubmit={onJoin}
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
					<CancelButton onClick={onClose} />
				</>
			)}>
			<SelectField
				id="modal-serverId"
				label={t("rooms.server_id")}
				placeholder={t("rooms.server_id_placeholder")}
				options={config.dbIDs
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
