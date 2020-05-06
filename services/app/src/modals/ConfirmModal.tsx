import React, { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { AppContext } from "../pages/AppContext";

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
	const { onModalPop } = useContext(AppContext);
	const { t } = useTranslation();

	const onCancel = useCallback(() => {
		onModalPop();
		if (onCanceled) {
			onCanceled();
		}
	}, [onCanceled, onModalPop]);

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
