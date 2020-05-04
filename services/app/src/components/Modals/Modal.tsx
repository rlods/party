import React, { FC, FormEvent, ReactNode, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
//
import { IconButton } from "../Common/IconButton";
import { RootState } from "../../reducers";
import { Dispatch } from "../../actions";
import { popModal, closeModal } from "../../reducers/modals";

// ------------------------------------------------------------------

export const Modal: FC<{
	children: ReactNode;
	className?: string;
	title: string;
	renderFoot?: () => React.ReactNode;
	onSubmit?: () => void;
}> = ({ children, className, title, renderFoot, onSubmit }) => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const has_prev_modal = useSelector<RootState, boolean>(
		state => state.modals.stack.length > 1
	);

	const onClose = useCallback(() => dispatch(closeModal()), [dispatch]);

	const onPop = useCallback(() => dispatch(popModal()), [dispatch]);

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
					onClick={onPop}
				/>
				<div className="ModalTitle">{title}</div>
				<IconButton
					kind="special"
					className="ModalHeadClose"
					onClick={onClose}
					title={t("cancel")}
					icon="times"
				/>
			</div>
			<div className="ModalBody">{children}</div>
			<div className="ModalFoot">{renderFoot && renderFoot()}</div>
		</form>
	);
};
