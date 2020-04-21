import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "./IconButton";

// ------------------------------------------------------------------

export const CancelButton: FC<{ onClick: () => void }> = ({ onClick }) => {
	const { t } = useTranslation();
	return (
		<IconButton
			onClick={onClick}
			title={t("cancel")}
			kind="default"
			icon="ban"
		/>
	);
};
