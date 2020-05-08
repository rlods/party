import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
//
import { Room } from "./Room";
import { Splash } from "./Splash";
import { Modals } from "../modals";
import { Dispatch, TrySomethingOptions } from "../actions";
import { setApp } from "../reducers/app";
import { RoomType } from "../utils/rooms";
import { MessageOptions, displayInfo, displayError } from "../actions/messages";
import { clearMessages, removeMessages } from "../reducers/messages";
import { MediaAccess } from "../utils/medias";
import { previewMedia } from "../actions/medias";
import { PREVIEW_PLAYER } from "../utils/player";
import { confirmModal } from "../actions/modals";
import { stopPlayer, startPlayer } from "../actions/player";
import { selectUserDatabaseId, selectRoomDatabaseId } from "../config/firebase";
import {
	reconnectUser,
	disconnectUser,
	connectUser,
	createUser
} from "../actions/user";
import {
	exitRoom,
	enterRoom,
	lockRoom,
	unlockRoom,
	RoomAccess,
	createRoom
} from "../actions/room";
import {
	closeModal,
	openModal,
	popModal,
	ModalPrereq
} from "../reducers/modals";
import {
	appendToQueue,
	clearQueue,
	removeFromQueue,
	moveToOffset
} from "../actions/queue";
import { AppContext } from "./AppContext";
import { copyToClipboard } from "../utils/clipboard";
import { useDebounce } from "../utils/use";
import "./App.scss";

// ------------------------------------------------------------------

export const App: FC = () => {
	const d = useDispatch<Dispatch>();
	const h = useHistory();
	const t = useTranslation().t;

	const [propagate, onPlayerSetPropagate] = useState<boolean>(false);

	const [wantedOffset, setWantedOffset] = useState<number>(0);
	useDebounce(
		() => {
			if (wantedOffset !== 0) {
				console.debug("Apply debounced wanted offset", {
					wantedOffset
				});
				d(moveToOffset({ offset: wantedOffset, propagate }));
				setWantedOffset(0);
			}
		},
		250,
		[d, propagate, wantedOffset]
	);

	const onQueueMoveBackward = useCallback(
		() => setWantedOffset(wantedOffset - 1),
		[wantedOffset]
	);

	const onQueueMoveForward = useCallback(
		() => setWantedOffset(wantedOffset + 1),
		[wantedOffset]
	);

	const onMessagesClear = useCallback(
		(tag?: string) => d(clearMessages(tag)),
		[d]
	);

	const onMessagesRemove = useCallback(
		(ids: ReadonlyArray<number>) => d(removeMessages(ids)),
		[d]
	);

	const onModalClose = useCallback(() => d(closeModal()), [d]);

	const onModalPop = useCallback(() => d(popModal()), [d]);

	const onExit = useCallback(() => {
		d(
			confirmModal(t("rooms.confirm_exit"), () => {
				h.push("/");
			})
		);
	}, [t, d, h]);

	const onDisplayError = useCallback(
		(text: string, options?: MessageOptions) =>
			d(displayError(text, options)),
		[d]
	);

	const onDisplayInfo = useCallback(
		(text: string, options?: MessageOptions) =>
			d(displayInfo(text, options)),
		[d]
	);

	const onModalOpen = useCallback(
		(prereq: ModalPrereq) => d(openModal(prereq)),
		[d]
	);

	const onOnlineStatusChange = useCallback(
		() => d(setApp({ online: navigator.onLine })),
		[d]
	);

	const onUserConnectAsk = useCallback(
		() => onModalOpen({ type: "User/Connect", props: {} }),
		[onModalOpen]
	);

	const onRoomCreateAsk = useCallback(
		(type: RoomType) =>
			onModalOpen({ type: "Room/Create", props: { type } }),
		[onModalOpen]
	);

	const onRoomJoinAsk = useCallback(
		() => onModalOpen({ type: "Room/Join", props: null }),
		[onModalOpen]
	);

	const onUserConnect = useCallback(
		(userId: string, secret: string, options?: TrySomethingOptions) => {
			userId = userId.trim();
			if (userId.length === 0) {
				onDisplayError("user.id_is_invalid");
				return;
			}
			d(
				connectUser(
					{
						dbId: selectUserDatabaseId(),
						userId,
						secret
					},
					options
				)
			);
		},
		[d, onDisplayError]
	);

	const onRoomCreate = useCallback(
		(
			name: string,
			secret: string,
			type: RoomType,
			options?: TrySomethingOptions
		) => {
			name = name.trim();
			if (name.length === 0) {
				onDisplayError("rooms.name_is_invalid");
				return;
			}
			d(
				createRoom(
					{
						dbId: selectRoomDatabaseId(),
						name,
						secret,
						type
					},
					options
				)
			);
		},
		[d, onDisplayError]
	);

	const onUserCreate = useCallback(
		(name: string, secret: string, options?: TrySomethingOptions) => {
			name = name.trim();
			if (name.length === 0) {
				onDisplayError("user.name_is_invalid");
				return;
			}
			d(
				createUser(
					{
						dbId: selectUserDatabaseId(),
						name,
						secret
					},
					options
				)
			);
		},
		[d, onDisplayError]
	);

	const onUserCreateAsk = useCallback(
		() => onModalOpen({ type: "User/Create", props: {} }),
		[onModalOpen]
	);

	const onUserDisconnect = useCallback(() => d(disconnectUser()), [d]);

	const onReconnectUser = useCallback(() => d(reconnectUser()), [d]);

	const onQueueSearch = useCallback(
		() => onModalOpen({ type: "Room/Search", props: null }),
		[onModalOpen]
	);

	const onRoomEnter = useCallback(
		(access: RoomAccess, options?: TrySomethingOptions) =>
			d(enterRoom(access, options)),
		[d]
	);

	const onPreviewStart = useCallback(
		(access: MediaAccess) => d(previewMedia(access)),
		[d]
	);

	const onPreviewStop = useCallback(() => PREVIEW_PLAYER.stop(), []);

	const onPlayerStart = useCallback(
		({ position }: { position?: number }, options?: TrySomethingOptions) =>
			d(startPlayer({ position, propagate }, options)),
		[d, propagate]
	);

	const onPlayerStop = useCallback(
		(options?: TrySomethingOptions) =>
			d(stopPlayer({ propagate }, options)),
		[d, propagate]
	);

	const onQueueAppend = useCallback(
		(access: MediaAccess, options?: TrySomethingOptions) =>
			d(appendToQueue({ medias: [access], propagate }, options)),
		[d, propagate]
	);

	const onQueueClear = useCallback(
		(options?: TrySomethingOptions) =>
			d(
				confirmModal(t("rooms.confirm_clear"), () => {
					d(clearQueue({ propagate }, options));
					d(stopPlayer({ propagate }, options));
				})
			),
		[d, t, propagate]
	);

	const onQueueRemove = useCallback(
		({ position }: { position: number }, options?: TrySomethingOptions) =>
			d(removeFromQueue({ position, propagate }, options)),
		[d, propagate]
	);

	const onRoomLock = useCallback(() => d(lockRoom()), [d]);

	const onRoomUnlockAsk = useCallback(
		() => onModalOpen({ type: "Room/Unlock", props: {} }),
		[onModalOpen]
	);

	const onRoomUnlock = useCallback(
		(secret: string, options?: TrySomethingOptions) =>
			d(
				unlockRoom(
					{
						secret
					},
					options
				)
			),
		[d]
	);

	const onRoomExit = useCallback(() => d(exitRoom()), [d]);

	const onHelp = useCallback(
		() => onModalOpen({ type: "General/Help", props: null }),
		[onModalOpen]
	);

	const onCopyToClipboard = useCallback(
		async (value: string) => {
			await copyToClipboard(value);
			onDisplayInfo("secret_copied_to_clipboard");
		},
		[onDisplayInfo]
	);

	useEffect(() => {
		window.addEventListener("online", onOnlineStatusChange);
		window.addEventListener("offline", onOnlineStatusChange);

		onReconnectUser();

		return () => {
			window.removeEventListener("online", onOnlineStatusChange);
			window.removeEventListener("offline", onOnlineStatusChange);
		};
	}, [onOnlineStatusChange, onReconnectUser]);

	return (
		<AppContext.Provider
			value={{
				onCopyToClipboard,
				onDisplayError,
				onDisplayInfo,
				onExit,
				onHelp,
				onMessagesClear,
				onMessagesRemove,
				onModalClose,
				onModalOpen,
				onModalPop,
				onPlayerSetPropagate,
				onPlayerStart,
				onPlayerStop,
				onPreviewStart,
				onPreviewStop,
				onQueueAppend,
				onQueueClear,
				onQueueMoveBackward,
				onQueueMoveForward,
				onQueueRemove,
				onQueueSearch,
				onRoomCreate,
				onRoomCreateAsk,
				onRoomEnter,
				onRoomExit,
				onRoomJoinAsk,
				onRoomLock,
				onRoomUnlock,
				onRoomUnlockAsk,
				onUserConnect,
				onUserConnectAsk,
				onUserCreate,
				onUserCreateAsk,
				onUserDisconnect
			}}>
			<div className="App">
				<Modals />
				<Switch>
					<Route
						exact={true}
						path="/room/:dbId/:roomId"
						component={Room}
					/>
					<Route exact={true} path="/" component={Splash} />
					<Redirect to="/" />
				</Switch>
			</div>
		</AppContext.Provider>
	);
};
