import React, { forwardRef } from "react";
import classNames from "classnames";
//
import { Icon, IconSize } from "./Icon";
import "./IconButton.scss";

// ------------------------------------------------------------------

type ButtonType = "button" | "submit";

type IconButtonProps = {
	className?: string;
	color?: string;
	disabled?: boolean;
	displayTitle?: boolean;
	icon: string;
	kind?: "default" | "primary" | "danger" | "special";
	onClick?: () => void;
	size?: IconSize;
	title: string;
	type?: ButtonType;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
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
		},
		ref
	) => (
		<button
			ref={ref}
			type={type}
			aria-label={title}
			className={classNames("IconButton", className, kind, {
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
