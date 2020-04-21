import React, { FC } from "react";
import classNames from "classnames";
//
import { Icon, IconSize } from "../Common/Icon";

// ------------------------------------------------------------------

export const IconLink: FC<{
	blank?: boolean;
	className?: string;
	color?: string;
	icon: string;
	size?: IconSize;
	title: string;
	url: string;
}> = React.memo(
	({ blank = false, className, color, icon, size, title, url }) => {
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
