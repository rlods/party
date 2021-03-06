import React, { FC, ReactNode } from "react";
import classNames from "classnames";
//
import { Modal } from "./Modal";
import "./FormModal.scss";

// ------------------------------------------------------------------

export const FormModal: FC<{
	children: ReactNode;
	className?: string;
	onClose?: () => void;
	onSubmit: () => void;
	renderButtons: () => React.ReactNode;
	title: string;
}> = ({ children, className, renderButtons, title, onClose, onSubmit }) => (
	<Modal
		className={classNames("FormModal", className)}
		title={title}
		renderFoot={renderButtons}
		onClose={onClose}
		onSubmit={onSubmit}>
		{children}
	</Modal>
);
