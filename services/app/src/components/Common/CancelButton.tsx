import React from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "./IconButton";

// ------------------------------------------------------------------

export const CancelButton = ({ onClick }: { onClick: () => void }) => {
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
