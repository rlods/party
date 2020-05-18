import React, { FC, useContext, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CommonContext } from "../components/Common/CommonContext";

// ------------------------------------------------------------------

type ReadyModalProps = { onReady: () => void };

export const ReadyModal: FC<ReadyModalProps> = ({ onReady }) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { onModalClose } = useContext(CommonContext);
	const { t } = useTranslation();

	useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.focus();
		}
	}, [buttonRef]);

	return (
		<FormModal
			className="ReadyModal"
			title={t("splash.direct_welcome")}
			onClose={onReady}
			onSubmit={onModalClose}
			renderButtons={() => (
				<IconButton
					ref={buttonRef}
					title={t("splash.direct_lets_go")}
					kind="primary"
					icon="play"
					type="submit"
				/>
			)}>
			<div className="Description">{t("splash.description")}</div>
		</FormModal>
	);
};
