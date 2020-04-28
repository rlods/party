import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";

// ------------------------------------------------------------------

export type ConfirmModalProps = {
	question: string;
	onCanceled?: () => void;
	onConfirmed: () => void;
};

export const ConfirmModal: FC<ConfirmModalProps> = ({
	question,
	onCanceled,
	onConfirmed
}) => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();

	const onCancel = useCallback(() => {
		dispatch(popModal());
		if (onCanceled) {
			onCanceled();
		}
	}, [dispatch, onCanceled]);

	return (
		<FormModal
			title={t("confirm")}
			onSubmit={onConfirmed}
			renderButtons={() => (
				<>
					<IconButton
						title={t("confirm")}
						kind="primary"
						icon="plus"
						type="submit"
					/>
					<CancelButton onClick={onCancel} />
				</>
			)}>
			{question}
		</FormModal>
	);
};
