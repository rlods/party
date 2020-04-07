import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { Message } from "../../utils/messages";
import { extractMessages } from "../../selectors/messages";
import { RootState } from "../../reducers";
import "./Messages.scss";

// ------------------------------------------------------------------

export const Messages = () => {
	const { t } = useTranslation();
	const messages = useSelector<RootState, Message[]>(extractMessages);
	return (
		<div className="Messages">
			<TransitionGroup>
				{messages.map(message => (
					<CSSTransition
						key={message.id}
						classNames="Message"
						timeout={{ enter: 200, exit: 200 }}>
						<div
							className={classNames(
								"Message",
								"Message-" + message.type
							)}>
							{t(message.text)}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>
		</div>
	);
};
