import React from "react";
import classNames from "classnames";
//
import "./SwitchButton.scss";

// ------------------------------------------------------------------

export const SwitchButton = React.memo(
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
	}: {
		className?: string;
		checked: boolean;
		disabled?: boolean;
		displayLabel?: boolean;
		onClick?: (checked: boolean) => void;
		size?: "S" | "M" | "L";
		labelOff: string;
		labelOn: string;
		title: string;
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