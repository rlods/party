import React from "react";
import classNames from "classnames";
//
import { Icon } from "../Common/Icon";

// ------------------------------------------------------------------

export const IconLink = React.memo(
	({
		blank = false,
		className,
		color,
		icon,
		size,
		title,
		url
	}: {
		blank?: boolean;
		className?: string;
		color?: string;
		icon: string;
		size?: "S" | "M" | "L";
		title: string;
		url: string;
	}) => {
		return (
			<a
				className={classNames("IconLink", className)}
				href={url}
				target={blank ? "_blank" : void 0}
				rel={blank ? "noopener noreferrer" : void 0}>
				<Icon color={color} icon={icon} size={size} title={title} />
			</a>
		);
	}
);
