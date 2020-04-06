import React from "react";
import { Icon } from "./Icon";

// ------------------------------------------------------------------

export const LoadingIcon = ({ size }: { size?: "S" | "M" | "L" }) => (
	<Icon
		className="rotating"
		icon="circle-o-notch"
		size={size}
		title="Loading"
	/>
);
