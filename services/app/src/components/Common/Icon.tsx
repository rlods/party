import React, { FC } from "react";
import FontAwesome from "react-fontawesome";
import classNames from "classnames";
//
import "./Icon.scss";

// ------------------------------------------------------------------

export type IconSize = "S" | "M" | "L" | "XL";

// ------------------------------------------------------------------

export const Icon: FC<{
	className?: string;
	color?: string;
	icon: string;
	size?: IconSize;
	title?: string;
}> = React.memo(({ className, color, icon, size = "M", title }) => (
	<FontAwesome
		className={classNames("Icon", className, size)}
		name={icon}
		style={{ color }}
		title={title}
	/>
));
