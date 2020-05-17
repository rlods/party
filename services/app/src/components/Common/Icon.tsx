import React, { forwardRef } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export type IconSize = "S" | "M" | "L" | "XL";

// ------------------------------------------------------------------

type IconProps = {
	className?: string;
	color?: string;
	icon: string;
	size?: IconSize;
	title?: string;
};

export const Icon = forwardRef<FontAwesome, IconProps>(
	({ className, color, icon, size = "M", title }, ref) => (
		<FontAwesome
			ref={ref}
			className={classNames("Icon", className, size)}
			name={icon}
			style={{ color }}
			title={title}
		/>
	)
);
