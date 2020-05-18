import React, { FC, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../components/Common/IconButton";
import { RootState } from "../reducers";
import { Messages } from "../components/Common/Messages";
import { Icon } from "../components/Common/Icon";
import { AppContext } from "./AppContext";
import { DEFAULT_ROOM_TYPE } from "../utils/rooms";
import { isUserLoggedIn } from "../selectors/user";
import { CommonContext } from "../components/Common/CommonContext";
import "./Splash.scss";

// ------------------------------------------------------------------

export const Splash: FC = () => {
	const {
		onHelp,
		onRoomCreateAsk,
		onUserConnectAsk,
		onUserCreateAsk,
		onUserDisconnect
	} = useContext(AppContext);
	const { onMessagesClear } = useContext(CommonContext);
	const { t } = useTranslation();

	const fetching = useSelector<RootState, boolean>(
		state => state.user.fetching
	);
	const loggedIn = useSelector<RootState, boolean>(isUserLoggedIn);

	useEffect(() => {
		onMessagesClear();
	}, [onMessagesClear]);

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
									onClick={() =>
										onRoomCreateAsk(DEFAULT_ROOM_TYPE)
									}
									icon="play"
									size="XL"
									title={t("rooms.create")}
								/>
							</div>
						) : (
							<>
								<div className="MenuItem">
									<IconButton
										onClick={onUserCreateAsk}
										icon="user-plus"
										size="XL"
										title={t("user.create")}
									/>
								</div>
								<div className="MenuItem">
									<IconButton
										onClick={onUserConnectAsk}
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
									onClick={onUserDisconnect}
									size="M"
									title={t("user.disconnect")}
								/>
							</div>
						) : (
							<div className="MenuItem">
								<IconButton
									icon="question-circle"
									onClick={onHelp}
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
