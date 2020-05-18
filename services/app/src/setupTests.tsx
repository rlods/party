import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { mount } from "enzyme";
//
import { initStore } from "./utils/redux";
import {
	CommonContext,
	CommonContextProps
} from "./components/Common/CommonContext";
import { AppContext, AppContextProps } from "./pages/AppContext";
import { RootState } from "./reducers";

// ------------------------------------------------------------------

configure({ adapter: new Adapter() });

const DummyCB = () => {};

// ------------------------------------------------------------------

const createFakeCommonContext = (
	overrides: Partial<CommonContextProps> = {}
): CommonContextProps => ({
	onCopyToClipboard: overrides.onCopyToClipboard || DummyCB,
	onDisplayError: overrides.onDisplayError || DummyCB,
	onDisplayInfo: overrides.onDisplayInfo || DummyCB,
	onMessagesClear: overrides.onMessagesClear || DummyCB,
	onMessagesRemove: overrides.onMessagesRemove || DummyCB,
	onModalClose: overrides.onModalClose || DummyCB,
	onModalOpen: overrides.onModalOpen || DummyCB,
	onModalPop: overrides.onModalPop || DummyCB
});

// ------------------------------------------------------------------

const createFakeAppContext = (
	overrides: Partial<AppContextProps> = {}
): AppContextProps => ({
	onExit: overrides.onExit || DummyCB,
	onHelp: overrides.onHelp || DummyCB,
	onPlayerSetMode: overrides.onPlayerSetMode || DummyCB,
	onPlayerSetPropagate: overrides.onPlayerSetPropagate || DummyCB,
	onPlayerStart: overrides.onPlayerStart || DummyCB,
	onPlayerStop: overrides.onPlayerStop || DummyCB,
	onPreviewStart: overrides.onPreviewStart || DummyCB,
	onPreviewStop: overrides.onPreviewStop || DummyCB,
	onQueueAppend: overrides.onQueueAppend || DummyCB,
	onQueueClear: overrides.onQueueClear || DummyCB,
	onQueueMoveBackward: overrides.onQueueMoveBackward || DummyCB,
	onQueueMoveForward: overrides.onQueueMoveForward || DummyCB,
	onQueueRemove: overrides.onQueueRemove || DummyCB,
	onQueueSearch: overrides.onQueueSearch || DummyCB,
	onRoomCreate: overrides.onRoomCreate || DummyCB,
	onRoomCreateAsk: overrides.onRoomCreateAsk || DummyCB,
	onRoomEnter: overrides.onRoomEnter || DummyCB,
	onRoomExit: overrides.onRoomExit || DummyCB,
	onRoomJoinAsk: overrides.onRoomJoinAsk || DummyCB,
	onRoomLock: overrides.onRoomLock || DummyCB,
	onRoomUnlock: overrides.onRoomUnlock || DummyCB,
	onRoomUnlockAsk: overrides.onRoomUnlockAsk || DummyCB,
	onUserConnect: overrides.onUserConnect || DummyCB,
	onUserConnectAsk: overrides.onUserConnectAsk || DummyCB,
	onUserCreate: overrides.onUserCreate || DummyCB,
	onUserCreateAsk: overrides.onUserCreateAsk || DummyCB,
	onUserDisconnect: overrides.onUserDisconnect || DummyCB
});

// ------------------------------------------------------------------

export async function wrapAndMount({
	appContext,
	commonContext,
	children,
	state
}: {
	appContext?: Partial<AppContextProps>;
	commonContext?: Partial<CommonContextProps>;
	children: React.ReactNode;
	state: RootState;
}) {
	return mount(
		<Provider store={await initStore(state).store}>
			<HashRouter>
				<CommonContext.Provider
					value={createFakeCommonContext(commonContext)}>
					<AppContext.Provider
						value={createFakeAppContext(appContext)}>
						{children}
					</AppContext.Provider>
				</CommonContext.Provider>
			</HashRouter>
		</Provider>
	);
}
