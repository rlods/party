import React, { FC } from "react";
import classNames from "classnames";
//
import { IconSize } from "./Icon";
import "./SwitchButton.scss";

// ------------------------------------------------------------------

export const SwitchButton: FC<{
	className?: string;
	checked: boolean;
	disabled?: boolean;
	displayLabel?: boolean;
	onClick?: (checked: boolean) => void;
	size?: IconSize;
	labelOff: string;
	labelOn: string;
	title: string;
}> = React.memo(
	({
		className,
		checked,
		disabled = false,
		displayLabel = false,
		onClick,
		size = "M",
		labelOff,
		labelOn,
		title
	}) => (
		<button
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
