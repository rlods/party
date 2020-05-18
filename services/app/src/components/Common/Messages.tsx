import React, { FC, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { Message } from "../../utils/messages";
import { selectMessages } from "../../selectors/messages";
import { RootState } from "../../reducers";
import { IconButton } from "../Common/IconButton";
import { CommonContext } from "./CommonContext";
import "./Messages.scss";

// ------------------------------------------------------------------

export const Messages: FC<{
	className?: string;
	bottomPosition?: string;
}> = ({ className, bottomPosition }) => {
	const { onMessagesRemove } = useContext(CommonContext);
	const { t } = useTranslation();
	const messages = useSelector<RootState, Message[]>(selectMessages);
	return (
		<div
			className={classNames("Messages", className)}
			style={{ bottom: bottomPosition }}>
			<TransitionGroup>
				{messages.map(({ closable, extra, id, text, type }) => (
					<CSSTransition
						key={id}
						classNames="Message"
						timeout={{ enter: 200, exit: 200 }}>
						<div
							className={classNames(
								"Message",
								"Message-" + type
							)}>
							<div className="MessageBody">
								{text ? t(text) : null}
								{extra ? extra() : null}
							</div>
							{closable ? (
								<div className="MessageActions">
									<IconButton
										icon="close"
										title={t("clear")}
										onClick={() => onMessagesRemove([id])}
									/>
								</div>
							) : null}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>
		</div>
	);
};
