import React from "react";
import classNames from "classnames";
//
import { Icon } from "./Icon";
import "./IconButton.scss";

// ------------------------------------------------------------------

type ButtonType = "button" | "submit";

export const IconButton = React.memo(
	({
		className,
		color,
		disabled = false,
		displayTitle = false,
		icon,
		kind = "default",
		onClick,
		size,
		title,
		type = "button"
	}: {
		className?: string;
		color?: string;
		disabled?: boolean;
		displayTitle?: boolean;
		icon: string;
		kind?: "default" | "primary" | "danger" | "special";
		onClick?: () => void;
		size?: "S" | "M" | "L";
		title: string;
		type?: ButtonType;
	}) => (
		<button
			type={type}
			aria-label={title}
			className={classNames("IconButton", className, kind, size, {
				clickable: !disabled && (!!onClick || type === "submit")
			})}
			onClick={disabled ? void 0 : onClick}
			title={title}>
			<Icon color={color} icon={icon} size={size} />
			{displayTitle && (
				<div className={classNames("IconButtonTitle", size)}>
					{title}
				</div>
			)}
		</button>
	)
);
