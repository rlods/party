import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../components/Common/IconButton";
import { RootState } from "../reducers";
import { openModal } from "../reducers/modals";
import { disconnectUser } from "../actions/user";
import { clearMessages } from "../reducers/messages";
import "./Splash.scss";

// ------------------------------------------------------------------

export const Splash = () => {
	const dispatch = useDispatch();
	const loggedIn = useSelector<RootState, boolean>(
		state => !!state.user.access.dbId && !!state.user.access.userId
	);
	const { t } = useTranslation();

	const onCreateRoom = useCallback(
		() => dispatch(openModal({ type: "CreateRoom", props: null })),
		[dispatch]
	);

	const onConnectUser = useCallback(
		() => dispatch(openModal({ type: "CreateUser", props: null })),
		[dispatch]
	);

	const onDisconnect = useCallback(() => dispatch(disconnectUser()), [
		dispatch
	]);

	const onShowHelp = useCallback(
		() => dispatch(openModal({ type: "Help", props: null })),
		[dispatch]
	);

	useEffect(() => {
		dispatch(clearMessages());
	}, [dispatch]);

	/*
	<div className="PoweredWith">
		<span>{t("splash.powered_with")}</span>
		<a
			href="https://www.deezer.com"
			target="_blank"
			rel="noopener noreferrer">
			<img
				src="/images/deezer.svg"
				height="20px"
				title="Deezer"
				alt="Deezer Logo"
			/>
		</a>
	</div>
	*/

	return (
		<div className="Splash">
			<div className="Top">
				<Link className="Logo" to="/">
					<img
						src="/images/logo.png"
						title="Party"
						alt="Party Logo"
					/>
					Party
				</Link>
				<div className="Description">{t("splash.description")}</div>
			</div>
			<div className="Middle">
				<div className="Menu">
					{loggedIn ? (
						<>
							<div className="MenuItem">
								<IconButton
									icon="plus"
									onClick={onCreateRoom}
									size="L"
									title={t("rooms.create")}
								/>
							</div>
						</>
					) : (
						<>
							<div className="MenuItem">
								<IconButton
									onClick={onConnectUser}
									icon="sign-in"
									size="L"
									title={t("users.connect")}
								/>
							</div>
						</>
					)}
				</div>
			</div>
			<div className="Bottom">
				<div className="Menu">
					{loggedIn ? (
						<div className="MenuItem">
							<IconButton
								icon="sign-out"
								onClick={onDisconnect}
								size="M"
								title={t("users.disconnect")}
							/>
						</div>
					) : (
						<div className="MenuItem">
							<IconButton
								icon="question-circle"
								onClick={onShowHelp}
								size="L"
								title={t("help.help")}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
