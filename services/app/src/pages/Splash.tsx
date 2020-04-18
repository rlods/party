import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../components/Common/IconButton";
import { RootState } from "../reducers";
import { openModal } from "../reducers/modals";
import { disconnectUser } from "../actions/user";
import "./Splash.scss";

// ------------------------------------------------------------------

export const Splash = () => {
	const dispatch = useDispatch();
	const loggedIn = useSelector<RootState, boolean>(
		state => !!state.user.access.id
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
				<div className="Logo">
					<Link to="/">Party</Link>
				</div>
				<div className="Description">
					<span>{t("splash.description")}</span>
				</div>
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
								icon="info"
								onClick={() => {}}
								size="M"
								title={t("splash.CGU")}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
