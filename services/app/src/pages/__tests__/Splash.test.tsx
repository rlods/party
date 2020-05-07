import React from "react";
//
import { Splash } from "../Splash";
import { initLocales } from "../../utils/i18n";
import { INITIAL_STATE } from "../../reducers";
import { wrapAndMount, createFakeContext } from "../../setupTests";

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

		const buttons = wrapper.find(".IconButton");
		expect(buttons.length).toEqual(0);
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

		const buttons = wrapper.find(".IconButton");
		expect(buttons.length).toEqual(3);
		for (let i = 0; i < buttons.length; ++i) {
			buttons.at(i).simulate("click");
		}
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

		const buttons = wrapper.find(".IconButton");
		expect(buttons.length).toEqual(2);
		for (let i = 0; i < buttons.length; ++i) {
			buttons.at(i).simulate("click");
		}
		expect(onRoomCreateAsk).toHaveBeenCalledTimes(1);
		expect(onUserDisconnect).toHaveBeenCalledTimes(1);
	});
});
