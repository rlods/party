import React, { FC, FormEvent, ReactNode, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../components/Common/IconButton";
import { RootState } from "../reducers";
import { AppContext } from "../pages/AppContext";

// ------------------------------------------------------------------

export const Modal: FC<{
	children: ReactNode;
	className?: string;
	title: string;
	renderFoot?: () => React.ReactNode;
	onClose?: () => void;
	onSubmit?: () => void;
}> = ({ children, className, title, renderFoot, onClose, onSubmit }) => {
	const { onModalClose, onModalPop } = useContext(AppContext);
	const { t } = useTranslation();
	const has_prev_modal = useSelector<RootState, boolean>(
		state => state.modals.stack.length > 1
	);

	useEffect(() => {
		// on unmount...
		return () => {
			if (onClose) {
				onClose();
			}
		};
	}, [onClose]);

	return (
		<form
			className={classNames("Modal", className)}
			onSubmit={(event: FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				if (onSubmit) {
					onSubmit();
				}
			}}>
			<div className="ModalHead">
				<IconButton
					kind="special"
					className={classNames("ModalHeadBack", {
						hidden: !has_prev_modal
					})}
					icon="angle-left"
					title="Back"
					onClick={onModalPop}
				/>
				<div className="ModalTitle">{title}</div>
				<IconButton
					kind="special"
					className="ModalHeadClose"
					onClick={onModalClose}
					title={t("cancel")}
					icon="times"
				/>
			</div>
			<div className="ModalBody">{children}</div>
			<div className="ModalFoot">{renderFoot && renderFoot()}</div>
		</form>
	);
};
