import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";

// ------------------------------------------------------------------

export const ConfirmModal = ({
	question,
	onCanceled,
	onConfirmed
}: {
	question: string;
	onCanceled?: () => void;
	onConfirmed: () => void;
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
						title={t("cancel")}
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
