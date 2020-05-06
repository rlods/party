import { createContext } from "react";
import { MessageOptions } from "../actions/messages";
import { ModalPrereq } from "../reducers/modals";
import { MediaAccess } from "../utils/medias";
import { TrySomethingOptions } from "../actions";
import { RoomType, RoomAccess } from "../utils/rooms";

// ------------------------------------------------------------------

export const AppContext = createContext<{
	onDisplayError: (text: string, options?: MessageOptions) => void;
	onDisplayInfo: (text: string, options?: MessageOptions) => void;
	onExit: () => void;
	onMessagesClear: (tag?: string) => void;
	onMessagesRemove: (ids: number[]) => void;
	onModalClose: () => void;
	onModalOpen: (prereq: ModalPrereq) => void;
	onModalPop: () => void;
	onPlayerStart: (propagate: boolean, options?: TrySomethingOptions) => void;
	onPlayerStop: (propagate: boolean, options?: TrySomethingOptions) => void;
	onPreviewStart: (access: MediaAccess) => void;
	onPreviewStop: () => void;
	onQueueAppend: (
		propagate: boolean,
		access: MediaAccess,
		options?: TrySomethingOptions
	) => void;
	onQueueClear: (propagate: boolean, options?: TrySomethingOptions) => void;
	onQueueMoveBackward: (propagate: boolean) => void;
	onQueueMoveForward: (propagate: boolean) => void;
	onQueueRemove: (
		propagate: boolean,
		position: number,
		options?: TrySomethingOptions
	) => void;
	onQueueSearch: () => void;
	onQueueSetPosition: (
		propagate: boolean,
		position: number,
		options?: TrySomethingOptions
	) => void;
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
}>({
	onDisplayError: () => {},
	onDisplayInfo: () => {},
	onExit: () => {},
	onMessagesClear: () => {},
	onMessagesRemove: () => {},
	onModalClose: () => {},
	onModalOpen: () => {},
	onModalPop: () => {},
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
	onQueueSetPosition: () => {},
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
