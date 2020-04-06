import React, { ReactNode } from "react";
import classNames from "classnames";
//
import { Modal } from "./Modal";
import "./FormModal.scss";

// ------------------------------------------------------------------

export const FormModal = ({
	children,
	className,
	renderButtons,
	title,
	onSubmit
}: {
	children: ReactNode;
	className?: string;
	onSubmit: () => void;
	renderButtons: () => React.ReactNode;
	title: string;
}) => (
	<Modal
		className={classNames("FormModal", className)}
		title={title}
		renderFoot={renderButtons}
		onSubmit={onSubmit}>
		{children}
	</Modal>
);
