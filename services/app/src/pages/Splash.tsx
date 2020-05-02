import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../components/Common/IconButton";
import { RootState } from "../reducers";
import { openModal } from "../reducers/modals";
import { disconnectUser } from "../actions/user";
import { clearMessages } from "../reducers/messages";
import { Messages } from "../components/Common/Messages";
import { Icon } from "../components/Common/Icon";
import "./Splash.scss";

// ------------------------------------------------------------------

export const Splash: FC = () => {
	const dispatch = useDispatch();
	const fetching = useSelector<RootState, boolean>(
		state => state.user.fetching
	);
	const loggedIn = useSelector<RootState, boolean>(
		state => !!state.user.access.dbId && !!state.user.access.userId
	);
	const { t } = useTranslation();

	const onCreateRoom = useCallback(
		() => dispatch(openModal({ type: "Room/Create", props: {} })),
		[dispatch]
	);

	const onCreateUser = useCallback(
		() => dispatch(openModal({ type: "User/Create", props: {} })),
		[dispatch]
	);

	const onConnectUser = useCallback(
		() => dispatch(openModal({ type: "User/Connect", props: {} })),
		[dispatch]
	);

	const onDisconnect = useCallback(() => dispatch(disconnectUser()), [
		dispatch
	]);

	const onShowHelp = useCallback(
		() => dispatch(openModal({ type: "General/Help", props: null })),
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
		<>
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
						{fetching ? (
							<div className="MenuItem">
								<Icon
									className="rotating"
									icon="refresh"
									size="XL"
									title={t("loading")}
								/>
							</div>
						) : loggedIn ? (
							<div className="MenuItem">
								<IconButton
									onClick={onCreateRoom}
									icon="play"
									size="XL"
									title={t("rooms.create")}
								/>
							</div>
						) : (
							<>
								<div className="MenuItem">
									<IconButton
										onClick={onCreateUser}
										icon="user-plus"
										size="XL"
										title={t("user.create")}
									/>
								</div>
								<div className="MenuItem">
									<IconButton
										onClick={onConnectUser}
										icon="sign-in"
										size="XL"
										title={t("user.connect")}
									/>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="Bottom">
					<div className="Menu">
						{fetching ? null : loggedIn ? (
							<div className="MenuItem">
								<IconButton
									icon="sign-out"
									onClick={onDisconnect}
									size="M"
									title={t("user.disconnect")}
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
			<Messages />
		</>
	);
};
