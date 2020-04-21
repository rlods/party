import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { Message } from "../../utils/messages";
import { selectMessages } from "../../selectors/messages";
import { RootState } from "../../reducers";
import { IconButton } from "../Common/IconButton";
import { Dispatch } from "../../actions";
import { removeMessage } from "../../reducers/messages";
import "./Messages.scss";

// ------------------------------------------------------------------

export const Messages: FC<{
	className?: string;
	bottomPosition?: string;
}> = ({ className, bottomPosition }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<Dispatch>();
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
										onClick={() =>
											dispatch(removeMessage(id))
										}
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
