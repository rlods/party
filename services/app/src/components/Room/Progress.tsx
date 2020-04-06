import React, { Component } from "react";
import classNames from "classnames";
//
import { MappedProps } from "../../containers/Room/Progress";
import "./Progress.scss";

// ------------------------------------------------------------------

class Progress extends Component<MappedProps> {
	public render = () => {
		const { playing, value } = this.props;
		return (
			<div className={classNames("Progress", { playing })}>
				<progress max={100} value={value * 100} />
			</div>
		);
	};
}

export default Progress;
