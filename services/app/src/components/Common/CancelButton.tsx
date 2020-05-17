import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "./IconButton";

// ------------------------------------------------------------------

type CancelButtonProps = { onClick: () => void };

export const CancelButton = forwardRef<HTMLButtonElement, CancelButtonProps>(
	({ onClick }, ref) => {
		const { t } = useTranslation();
		return (
			<IconButton
				ref={ref}
				onClick={onClick}
				title={t("cancel")}
				kind="default"
				icon="ban"
			/>
		);
	}
);
