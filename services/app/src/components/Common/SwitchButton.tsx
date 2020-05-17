import React, { forwardRef } from "react";
import classNames from "classnames";
//
import { IconSize } from "./Icon";
import "./SwitchButton.scss";

// ------------------------------------------------------------------

type SwitchButtonProps = {
	className?: string;
	checked: boolean;
	disabled?: boolean;
	displayLabel?: boolean;
	onClick?: (checked: boolean) => void;
	size?: IconSize;
	labelOff: string;
	labelOn: string;
	title: string;
};

export const SwitchButton = forwardRef<HTMLButtonElement, SwitchButtonProps>(
	(
		{
			className,
			checked,
			disabled = false,
			displayLabel = false,
			onClick,
			size = "M",
			labelOff,
			labelOn,
			title
		},
		ref
	) => (
		<button
			ref={ref}
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={checked ? labelOn : labelOff}
			className={classNames("SwitchButton", className, size, {
				checked,
				clickable: !disabled && !!onClick
			})}
			onClick={disabled || !onClick ? void 0 : () => onClick(!checked)}
			title={title}>
			{displayLabel && (
				<span className={classNames("SwitchButtonLabel", size)}>
					{checked ? labelOn : labelOff}
				</span>
			)}
		</button>
	)
);
