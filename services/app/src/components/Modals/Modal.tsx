import React, { Component, FormEvent, ReactNode } from "react";
import classNames from "classnames";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Modals/Modal";
import IconButton from "../Common/IconButton";

// ------------------------------------------------------------------

type Props = {
	children: ReactNode;
	className?: string;
	title: string;
	renderFoot?: () => React.ReactNode;
	onSubmit?: () => void;
};

class Modal extends Component<Props & MappedProps & WithTranslation> {
	public render = () => {
		const {
			children,
			className,
			title,
			renderFoot,
			onClose,
			onPop,
			has_prev_modal,
			t
		} = this.props;
		return (
			<form
				className={classNames("Modal", className)}
				onSubmit={this.onSubmit}>
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

	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
	};
}

export default withTranslation()(Modal);
