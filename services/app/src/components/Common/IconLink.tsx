import React, { forwardRef } from "react";
import classNames from "classnames";
//
import { Icon, IconSize } from "../Common/Icon";

// ------------------------------------------------------------------

type IconLinkProps = {
	blank?: boolean;
	className?: string;
	color?: string;
	icon: string;
	size?: IconSize;
	title: string;
	url: string;
};

export const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(
	({ blank = false, className, color, icon, size, title, url }, ref) => {
		return (
			<a
				ref={ref}
				className={classNames("IconLink", className)}
				href={url}
				target={blank ? "_blank" : void 0}
				rel={blank ? "noopener noreferrer" : void 0}>
				<Icon color={color} icon={icon} size={size} title={title} />
			</a>
		);
	}
);
