import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { mount } from "enzyme";
//
import { Splash } from "../Splash";
import { initLocales } from "../../utils/i18n";
import { initStore } from "../../utils/redux";
import { AppContext, AppContextProps } from "../../pages/AppContext";
import { INITIAL_STATE, RootState } from "../../reducers";

// ------------------------------------------------------------------

const DummyCB = () => {};

const createFakeContext = (
	overrides: Partial<AppContextProps> = {}
): AppContextProps => ({
	onDisplayError: overrides.onDisplayError || DummyCB,
	onDisplayInfo: overrides.onDisplayInfo || DummyCB,
	onExit: overrides.onExit || DummyCB,
	onHelp: overrides.onHelp || DummyCB,
	onMessagesClear: overrides.onMessagesClear || DummyCB,
	onMessagesRemove: overrides.onMessagesRemove || DummyCB,
	onModalClose: overrides.onModalClose || DummyCB,
	onModalOpen: overrides.onModalOpen || DummyCB,
	onModalPop: overrides.onModalPop || DummyCB,
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
	onQueueSetPosition: overrides.onQueueSetPosition || DummyCB,
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

const wrapAndMount = async ({
	children,
	context,
	state
}: {
	children: React.ReactNode;
	context: any;
	state: RootState;
}) =>
	mount(
		<Provider store={await initStore(state).store}>
			<HashRouter>
				<AppContext.Provider value={context}>
					{children}
				</AppContext.Provider>
			</HashRouter>
		</Provider>
	);

// ------------------------------------------------------------------

describe("Splash Page", () => {
	beforeAll(async () => {
		await initLocales();
	});

	it("test not fetched", async () => {
		const wrapper = await wrapAndMount({
			children: <Splash />,
			context: createFakeContext(),
			state: {
				...INITIAL_STATE,
				user: { ...INITIAL_STATE.user, fetching: true }
			}
		});

		const searchInput = wrapper.find(".IconButton");
		expect(searchInput.length).toEqual(0);
	});

	it("test fetched + unlogged", async () => {
		const onHelp = jest.fn();
		const onUserConnectAsk = jest.fn();
		const onUserCreateAsk = jest.fn();
		const wrapper = await wrapAndMount({
			children: <Splash />,
			context: createFakeContext({
				onHelp,
				onUserConnectAsk,
				onUserCreateAsk
			}),
			state: {
				...INITIAL_STATE,
				user: { ...INITIAL_STATE.user, fetching: false }
			}
		});

		const searchInput = wrapper.find(".IconButton");
		expect(searchInput.length).toEqual(3);
		searchInput.at(0).simulate("click");
		searchInput.at(1).simulate("click");
		searchInput.at(2).simulate("click");
		expect(onHelp).toHaveBeenCalledTimes(1);
		expect(onUserConnectAsk).toHaveBeenCalledTimes(1);
		expect(onUserCreateAsk).toHaveBeenCalledTimes(1);
	});

	it("test fetched + logged in", async () => {
		const onRoomCreateAsk = jest.fn();
		const onUserDisconnect = jest.fn();
		const wrapper = await wrapAndMount({
			children: <Splash />,
			context: createFakeContext({
				onRoomCreateAsk,
				onUserDisconnect
			}),
			state: {
				...INITIAL_STATE,
				user: {
					...INITIAL_STATE.user,
					fetching: false,
					access: { dbId: "dummy", secret: "dummy", userId: "dummy" }
				}
			}
		});

		const searchInput = wrapper.find(".IconButton");
		expect(searchInput.length).toEqual(2);
		searchInput.at(0).simulate("click");
		searchInput.at(1).simulate("click");
		expect(onRoomCreateAsk).toHaveBeenCalledTimes(1);
		expect(onUserDisconnect).toHaveBeenCalledTimes(1);
	});
});
