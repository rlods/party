import React from "react";
import { Icon, IconSize } from "./Icon";

// ------------------------------------------------------------------

export const LoadingIcon = React.memo(({ size }: { size?: IconSize }) => (
	<Icon
		className="rotating"
		icon="circle-o-notch"
		size={size}
		title="Loading"
	/>
));
