import React, { forwardRef } from "react";
import FontAwesome from "react-fontawesome";
//
import { Icon, IconSize } from "./Icon";

// ------------------------------------------------------------------

type LoadingIconProps = { size?: IconSize };

export const LoadingIcon = forwardRef<FontAwesome, LoadingIconProps>(
	({ size }, ref) => (
		<Icon
			ref={ref}
			className="rotating"
			icon="circle-o-notch"
			size={size}
			title="Loading"
		/>
	)
);
