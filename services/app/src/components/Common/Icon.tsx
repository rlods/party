import React from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export const Icon = React.memo(
	({
		className,
		color,
		icon,
		size = "M",
		title
	}: {
		className?: string;
		color?: string;
		icon: string;
		size?: "S" | "M" | "L";
		title?: string;
	}) => (
		<FontAwesome
			className={classNames("Icon", className, size)}
			name={icon}
			style={{ color }}
			title={title}
		/>
	)
);
