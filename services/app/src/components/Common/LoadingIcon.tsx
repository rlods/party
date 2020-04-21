import React, { FC } from "react";
import { Icon, IconSize } from "./Icon";

// ------------------------------------------------------------------

export const LoadingIcon: FC<{ size?: IconSize }> = React.memo(({ size }) => (
	<Icon
		className="rotating"
		icon="circle-o-notch"
		size={size}
		title="Loading"
	/>
));
