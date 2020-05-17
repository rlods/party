import { createContext } from "react";
import { MessageOptions } from "../actions/messages";
import { ModalPrereq } from "../reducers/modals";
import { MediaAccess } from "../utils/medias";
import { TrySomethingOptions } from "../actions";
import { RoomType, RoomAccess, PlayMode } from "../utils/rooms";

// ------------------------------------------------------------------

export type AppContextProps = {
	onCopyToClipboard: (value: string) => void;
	onDisplayError: (text: string, options?: MessageOptions) => void;
	onDisplayInfo: (text: string, options?: MessageOptions) => void;
	onExit: () => void;
	onHelp: () => void;
	onMessagesClear: (tag?: string) => void;
	onMessagesRemove: (ids: ReadonlyArray<number>) => void;
	onModalClose: () => void;
	onModalOpen: (prereq: ModalPrereq) => void;
	onModalPop: () => void;
	onPlayerSetMode: (mode: PlayMode) => void;
	onPlayerSetPropagate: (propagate: boolean) => void;
	onPlayerStart: (
		data?: { position?: number },
		options?: TrySomethingOptions
	) => void;
	onPlayerStop: (options?: TrySomethingOptions) => void;
	onPreviewStart: (access: MediaAccess) => void;
	onPreviewStop: () => void;
	onQueueAppend: (
		accesses: MediaAccess[],
		options?: TrySomethingOptions
	) => void;
	onQueueClear: (options?: TrySomethingOptions) => void;
	onQueueMoveBackward: () => void;
	onQueueMoveForward: () => void;
	onQueueRemove: (
		data: { position: number },
		options?: TrySomethingOptions
	) => void;
	onQueueSearch: () => void;
	onRoomCreate: (
		name: string,
		secret: string,
		type: RoomType,
		options?: TrySomethingOptions
	) => void;
	onRoomCreateAsk: (type: RoomType) => void;
	onRoomEnter: (access: RoomAccess, options?: TrySomethingOptions) => void;
	onRoomExit: () => void;
	onRoomJoinAsk: () => void;
	onRoomLock: () => void;
	onRoomUnlock: (secret: string, options?: TrySomethingOptions) => void;
	onRoomUnlockAsk: () => void;
	onUserConnect: (
		userId: string,
		secret: string,
		options?: TrySomethingOptions
	) => void;
	onUserConnectAsk: () => void;
	onUserCreate: (
		name: string,
		secret: string,
		options?: TrySomethingOptions
	) => void;
	onUserCreateAsk: () => void;
	onUserDisconnect: () => void;
};

// ------------------------------------------------------------------

export const AppContext = createContext<AppContextProps>({
	onCopyToClipboard: () => {},
	onDisplayError: () => {},
	onDisplayInfo: () => {},
	onExit: () => {},
	onHelp: () => {},
	onMessagesClear: () => {},
	onMessagesRemove: () => {},
	onModalClose: () => {},
	onModalOpen: () => {},
	onModalPop: () => {},
	onPlayerSetMode: () => {},
	onPlayerSetPropagate: () => {},
	onPlayerStart: () => {},
	onPlayerStop: () => {},
	onPreviewStart: () => {},
	onPreviewStop: () => {},
	onQueueAppend: () => {},
	onQueueClear: () => {},
	onQueueMoveBackward: () => {},
	onQueueMoveForward: () => {},
	onQueueRemove: () => {},
	onQueueSearch: () => {},
	onRoomCreate: () => {},
	onRoomCreateAsk: () => {},
	onRoomEnter: () => {},
	onRoomExit: () => {},
	onRoomJoinAsk: () => {},
	onRoomLock: () => {},
	onRoomUnlock: () => {},
	onRoomUnlockAsk: () => {},
	onUserConnect: () => {},
	onUserConnectAsk: () => {},
	onUserCreate: () => {},
	onUserCreateAsk: () => {},
	onUserDisconnect: () => {}
});
